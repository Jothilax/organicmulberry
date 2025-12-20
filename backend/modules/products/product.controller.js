// controllers/product.controller.js
import fs from "fs";
import path from "path";
import { Op } from "sequelize";
import Product from "./product.model.js";
import ProductImage from "./productImg.model.js";
import { Category, Size, Color, Order, OrderItem } from "../associations/index.js"; // adjust path if needed

const uploadDir = path.join(process.cwd(), "uploads", "products");

export const createProduct = async (req, res) => {
  const transaction = await Product.sequelize.transaction();
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized: Missing user token" });

    const { created_by, updated_by, ...bodyData } = req.body;

    // Validate category/size/color if sent
    if (!bodyData.category_id) return res.status(400).json({ message: "category_id is required" });
    const category = await Category.findByPk(bodyData.category_id);
    if (!category) return res.status(400).json({ message: "Invalid category_id" });

    if (bodyData.size) {
      const size = await Size.findByPk(bodyData.size);
      if (!size) return res.status(400).json({ message: "Invalid size_id" });
    }
    if (bodyData.color) {
      const color = await Color.findByPk(bodyData.color);
      if (!color) return res.status(400).json({ message: "Invalid color_id" });
    }

    // Create product
    const product = await Product.create(
      { ...bodyData, created_by: userId, updated_by: userId },
      { transaction }
    );

    // Handle images from multer upload
    if (req.files && req.files.length > 0) {
      const imageData = req.files.map((file, index) => ({
        product_id: product.id,
        images: file.filename,            // column name 'images' in ProductImage
        alt_text: (req.body.alt_texts && Array.isArray(req.body.alt_texts) && req.body.alt_texts[index]) || "",
        is_primary: index === 0,
        is_active: true,
        created_by: userId,
        updated_by: userId,
      }));

      await ProductImage.bulkCreate(imageData, { transaction });
    }

    await transaction.commit();

    // include images in response
    const fresh = await Product.findByPk(product.id, {
      include: [{ 
        model: ProductImage, 
        as: "images",
        attributes: ["id", "images", "alt_text", "is_primary", "is_active"]
      }],
    });

    // Format response with image URLs
    const json = fresh.toJSON();
    json.images = json.images.map((img) => ({
      ...img,
      imageUrl: `${req.protocol}://${req.get("host")}/uploads/products/${img.images}`,
    }));

    return res.status(201).json({ message: "Product created successfully", product: json });
  } catch (error) {
    await transaction.rollback();
    console.error("Error creating product:", error);
    return res.status(500).json({ message: "Failed to create product", error: error.message });
  }
};

export const updateProduct = async (req, res) => {
  const transaction = await Product.sequelize.transaction();
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const product = await Product.findByPk(id, { include: [{ model: ProductImage, as: "images" }] });
    if (!product) return res.status(404).json({ message: "Product not found" });

    const { created_by, updated_by, ...bodyData } = req.body;
    await product.update({ ...bodyData, updated_by: userId }, { transaction });

    // Handle image updates
    // If new images are uploaded, check if we should replace all or add to existing
    if (req.files && req.files.length > 0) {
      // Check if replace_images flag is set to true (default: replace all)
      const replaceAll = req.body.replace_images === 'true' || req.body.replace_images === true;

      if (replaceAll) {
        // Delete old image files
        for (const img of product.images || []) {
          const fp = path.join(uploadDir, img.images);
          if (fs.existsSync(fp)) {
            try { 
              fs.unlinkSync(fp); 
            } catch (err) { 
              console.warn("Failed deleting file:", fp, err.message); 
            }
          }
        }

        // Delete old image records
        await ProductImage.destroy({ where: { product_id: id }, transaction });

        // Insert new images
        const imageData = req.files.map((file, index) => ({
          product_id: id,
          images: file.filename,
          alt_text: (req.body.alt_texts && Array.isArray(req.body.alt_texts) && req.body.alt_texts[index]) || "",
          is_primary: index === 0 && product.images.length === 0, // Only first new image is primary if no existing images
          is_active: true,
          created_by: userId,
          updated_by: userId,
        }));
        await ProductImage.bulkCreate(imageData, { transaction });
      } else {
        // Add new images to existing ones (don't delete old ones)
        const imageData = req.files.map((file, index) => ({
          product_id: id,
          images: file.filename,
          alt_text: (req.body.alt_texts && Array.isArray(req.body.alt_texts) && req.body.alt_texts[index]) || "",
          is_primary: false, // New images are not primary by default
          is_active: true,
          created_by: userId,
          updated_by: userId,
        }));
        await ProductImage.bulkCreate(imageData, { transaction });
      }
    }

    // Handle image deletion if image_ids_to_delete is provided
    if (req.body.image_ids_to_delete) {
      const imageIdsToDelete = Array.isArray(req.body.image_ids_to_delete) 
        ? req.body.image_ids_to_delete 
        : [req.body.image_ids_to_delete];

      const imagesToDelete = await ProductImage.findAll({
        where: { 
          id: imageIdsToDelete,
          product_id: id 
        },
        transaction
      });

      // Delete image files
      for (const img of imagesToDelete) {
        const fp = path.join(uploadDir, img.images);
        if (fs.existsSync(fp)) {
          try { 
            fs.unlinkSync(fp); 
          } catch (err) { 
            console.warn("Failed deleting file:", fp, err.message); 
          }
        }
      }

      // Delete image records
      await ProductImage.destroy({ 
        where: { 
          id: imageIdsToDelete,
          product_id: id 
        }, 
        transaction 
      });
    }

    await transaction.commit();
    const fresh = await Product.findByPk(id, { 
      include: [{ 
        model: ProductImage, 
        as: "images", 
        attributes: ["id", "images", "alt_text", "is_primary", "is_active"] 
      }] 
    });
    
    // Format response with image URLs
    const json = fresh.toJSON();
    json.images = json.images.map((img) => ({
      ...img,
      imageUrl: `${req.protocol}://${req.get("host")}/uploads/products/${img.images}`,
    }));
    
    return res.status(200).json({ message: "Product updated successfully", product: json });
  } catch (error) {
    await transaction.rollback();
    console.error("Error updating product:", error);
    return res.status(500).json({ message: "Failed to update product", error: error.message });
  }
};

// export const getAllProducts = async (req, res) => {
//   try {
//     const { search = "" } = req.query;
//     const products = await Product.findAll({
//       where: {
//         [Op.or]: [
//           { name: { [Op.like]: `%${search}%` } },
//           { brand: { [Op.like]: `%${search}%` } },
//         ],
//       },
//       include: [
//         { model: ProductImage, as: "images", attributes: ["id", "images", "alt_text", "is_primary", "is_active"] },
//       ],
//       order: [["createdAt", "DESC"]],
//     });

//     const formatted = products.map((p) => {
//       const json = p.toJSON();
//       json.images = json.images.map((img) => ({
//         ...img,
//         imageUrl: `${req.protocol}://${req.get("host")}/uploads/products/${img.images}`,
//       }));
//       return json;
//     });

//     return res.status(200).json({ message: "Products fetched successfully", data: formatted });
//   } catch (error) {
//     console.error("Error fetching products:", error);
//     return res.status(500).json({ message: "Failed to fetch products", error: error.message });
//   }
// };

// export const getProductById = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const product = await Product.findByPk(id, {
//       include: [{ model: ProductImage, as: "images", attributes: ["id", "images", "alt_text", "is_primary", "is_active"] }],
//     });
//     if (!product) return res.status(404).json({ message: "Product not found" });

//     const json = product.toJSON();
//     json.images = json.images.map((img) => ({
//       ...img,
//       imageUrl: `${req.protocol}://${req.get("host")}/uploads/products/${img.images}`,
//     }));
//     return res.status(200).json({ message: "Product fetched successfully", data: json });
//   } catch (error) {
//     console.error("Error fetching product by id:", error);
//     return res.status(500).json({ message: "Failed to fetch product", error: error.message });
//   }
// };


export const getAllProducts = async (req, res) => {
  try {
    const { search = "" } = req.query;

    const products = await Product.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.like]: `%${search}%` } },
          { brand: { [Op.like]: `%${search}%` } },
        ],
      },
      include: [
        // ✅ Include Category
        {
          model: Category,
          as: "category",
          attributes: ["id", "category_name"],
        },
        // ✅ Include Size
        {
          model: Size,
          as: "sizeData",
          attributes: ["id", "size_name"],
        },
        // ✅ Include Color
        {
          model: Color,
          as: "colorData",
          attributes: ["color_id", "color_name", "color_code"],
        },
        // ✅ Include Product Images
        {
          model: ProductImage,
          as: "images",
          attributes: ["id", "images", "alt_text", "is_primary", "is_active"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    // ✅ Format images with URLs
    const formatted = products.map((p) => {
      const json = p.toJSON();
      json.images = json.images.map((img) => ({
        ...img,
        imageUrl: `${req.protocol}://${req.get("host")}/uploads/products/${img.images}`,
      }));
      return json;
    });

    return res.status(200).json({
      message: "Products fetched successfully",
      data: formatted,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return res.status(500).json({
      message: "Failed to fetch products",
      error: error.message,
    });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id, {
      include: [
        {
          model: Category,
          as: "category",
          attributes: ["id", "category_name"],
        },
        {
          model: Size,
          as: "sizeData",
          attributes: ["id", "size_name"],
        },
        {
          model: Color,
          as: "colorData",
          attributes: ["color_id", "color_name", "color_code"],
        },
        {
          model: ProductImage,
          as: "images",
          attributes: ["id", "images", "alt_text", "is_primary", "is_active"],
        },
      ],
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const json = product.toJSON();
    json.images = json.images.map((img) => ({
      ...img,
      imageUrl: `${req.protocol}://${req.get("host")}/uploads/products/${img.images}`,
    }));

    return res.status(200).json({
      message: "Product fetched successfully",
      data: json,
    });
  } catch (error) {
    console.error("Error fetching product by id:", error);
    return res.status(500).json({
      message: "Failed to fetch product",
      error: error.message,
    });
  }
};

export const deleteProduct = async (req, res) => {
  const transaction = await Product.sequelize.transaction();
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id, { include: [{ model: ProductImage, as: "images" }] });
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Delete image files
    for (const img of product.images || []) {
      const fp = path.join(uploadDir, img.images);
      if (fs.existsSync(fp)) {
        try { fs.unlinkSync(fp); } catch (err) { console.warn("Failed deleting file:", fp, err.message); }
      }
    }

    // Delete rows & product
    await ProductImage.destroy({ where: { product_id: id }, transaction });
    await product.destroy({ transaction });

    await transaction.commit();
    return res.status(200).json({ message: "Product and images deleted successfully" });
  } catch (error) {
    await transaction.rollback();
    console.error("Error deleting product:", error);
    return res.status(500).json({ message: "Failed to delete product", error: error.message });
  }
};

export const deleteProductImage = async (req, res) => {
  try {
    const { id } = req.params;
    const image = await ProductImage.findByPk(id);
    if (!image) return res.status(404).json({ message: "Product image not found" });

    const filePath = path.join(uploadDir, image.images);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    await image.destroy();
    return res.status(200).json({ message: "Product image deleted successfully", deletedImage: { id: image.id, filename: image.images } });
  } catch (error) {
    console.error("Error deleting product image:", error);
    return res.status(500).json({ message: "Failed to delete product image", error: error.message });
  }
};

//customer orders
export const getCustomerOrders = async (req, res) => {
  const { customerId } = req.params;

  try {
    const orders = await Order.findAll({
      where: { user_id: customerId },
      attributes: [
        "id",
        "user_id",
        "total_amount",
        "status",
        "payment_method",
        "address",
        "order_code",
        "qr_code",
        "createdAt",
        "updatedAt",
      ],
      include: [
        {
          model: OrderItem,
          as: "items",
          include: [
            {
              model: Product,
              as: "product",
              attributes: ["id", "name", "price"],
            },
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json({
      message: "Customer orders fetched successfully",
      total: orders.length,
      orders,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch customer orders" });
  }
};

export const getOrderItems = async (req, res) => {
  const { orderId } = req.params;

  try {
    const items = await OrderItem.findAll({
      where: { order_id: orderId },
      include: [
        {
          model: Product,
          as: "product",
          attributes: ["id", "name", "price", "brand"],
        },
      ],
    });

    res.json({
      message: "Order items fetched successfully",
      total: items.length,
      items,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch order items" });
  }
};
