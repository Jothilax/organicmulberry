import Wishlist from "./wishlist.model.js";
import Product from "../products/product.model.js";
import ProductImage from "../products/productImg.model.js";
import Category from "../catregory/category.model.js";

/**
 * Add product to wishlist
 */
export const addToWishlist = async (req, res) => {
  try {
    const cust_id = req.customer.id;
    const { product_id } = req.body;

    if (!product_id) {
      return res.status(400).json({ message: "Product ID required" });
    }

    // Check if product exists
    const product = await Product.findByPk(product_id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if already in wishlist
    const existingWishlistItem = await Wishlist.findOne({
      where: { cust_id, product_id },
    });

    if (existingWishlistItem) {
      return res.status(400).json({ message: "Product already in wishlist" });
    }

    // Add to wishlist
    const wishlistItem = await Wishlist.create({ cust_id, product_id });
    return res.status(201).json({
      message: "Product added to wishlist",
      wishlistItem,
    });
  } catch (err) {
    console.error("Error adding to wishlist:", err);
    return res.status(500).json({
      message: "Failed to add to wishlist",
      error: err.message,
    });
  }
};

/**
 * Get all wishlist items for logged-in customer
 */
export const getWishlist = async (req, res) => {
  try {
    const cust_id = req.customer.id;

    const wishlistItems = await Wishlist.findAll({
      where: { cust_id },
      include: [
        {
          model: Product,
          as: "product",
          include: [
            {
              model: ProductImage,
              as: "images",
              attributes: ["id", "images", "alt_text", "is_primary", "is_active"],
              where: { is_active: true },
              required: false,
            },
            {
              model: Category,
              as: "category",
              attributes: ["id", "category_name"],
            },
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    // Format wishlist items with product images
    const formatted = wishlistItems.map((item) => {
      const product = item.product;
      const productImages = product?.images || [];
      const formattedImages = productImages.map((img) => ({
        ...img.toJSON(),
        imageUrl: `${req.protocol}://${req.get("host")}/uploads/products/${img.images}`,
      }));

      return {
        id: item.id,
        product_id: item.product_id,
        addedDate: item.createdAt,
        product: product
          ? {
              id: product.id,
              name: product.name,
              price: product.price,
              mrp: product.mrp,
              brand: product.brand,
              stock: product.stock,
              description: product.description,
              rating: product.rating,
              reviewsCount: product.reviewsCount,
              images: formattedImages,
              category: product.category ? {
                id: product.category.id,
                category_name: product.category.category_name,
              } : null,
            }
          : null,
      };
    });

    return res.status(200).json({
      message: "Wishlist fetched successfully",
      items: formatted,
      total: formatted.length,
    });
  } catch (err) {
    console.error("Error fetching wishlist:", err);
    return res.status(500).json({
      message: "Failed to fetch wishlist",
      error: err.message,
    });
  }
};

/**
 * Remove product from wishlist
 */
export const removeFromWishlist = async (req, res) => {
  try {
    const { id } = req.params;
    const cust_id = req.customer.id;

    const deleted = await Wishlist.destroy({
      where: { id, cust_id },
    });

    if (!deleted) {
      return res.status(404).json({ message: "Wishlist item not found" });
    }

    return res.status(200).json({ message: "Removed from wishlist" });
  } catch (err) {
    console.error("Error removing from wishlist:", err);
    return res.status(500).json({
      message: "Failed to remove from wishlist",
      error: err.message,
    });
  }
};

/**
 * Check if product is in wishlist
 */
export const checkWishlist = async (req, res) => {
  try {
    const cust_id = req.customer.id;
    const { product_id } = req.params;

    const wishlistItem = await Wishlist.findOne({
      where: { cust_id, product_id },
    });

    return res.status(200).json({
      inWishlist: !!wishlistItem,
      wishlistItem: wishlistItem || null,
    });
  } catch (err) {
    console.error("Error checking wishlist:", err);
    return res.status(500).json({
      message: "Failed to check wishlist",
      error: err.message,
    });
  }
};

