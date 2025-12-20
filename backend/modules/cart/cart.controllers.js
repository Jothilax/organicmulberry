import Cart from "./cart.model.js";
import Product from "../products/product.model.js";
import ProductImage from "../products/productImg.model.js";

/**
 * Add product to user's cart.
 * If product exists, increase quantity.
 */
export const addToCart = async (req, res) => {
  try {
    const cust_id = req.customer.id; // <-- changed from req.user.id
    const { product_id, quantity = 1 } = req.body;

    if (!product_id) return res.status(400).json({ message: "Product ID required" });
    if (quantity < 1) return res.status(400).json({ message: "Quantity must be at least 1" });

    const product = await Product.findByPk(product_id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    let cartItem = await Cart.findOne({ where: { cust_id, product_id } });

    if (cartItem) {
      cartItem.quantity += Number(quantity);
      await cartItem.save();
      return res.status(200).json({ message: "Cart updated", item: cartItem });
    }

    cartItem = await Cart.create({ cust_id, product_id, quantity });
    return res.status(201).json({ message: "Added to cart", item: cartItem });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to add to cart", error: err.message });
  }
};

/**
 * Get all cart items for logged-in user
 */
export const getCart = async (req, res) => {
  try {
    const cust_id = req.customer.id; // <-- changed from req.user.id

    const items = await Cart.findAll({
      where: { cust_id },
      include: [
        {
          model: Product,
          include: [
            {
              model: ProductImage,
              as: "images",
              attributes: ["id", "images", "alt_text", "is_primary", "is_active"],
              where: { is_active: true },
              required: false,
            },
          ],
        },
      ],
    });

    let total = 0;
    const formatted = items.map((item) => {
      const price = item.Product?.price || 0;
      const subtotal = price * item.quantity;
      total += subtotal;

      // Format product images with full URLs
      const productImages = item.Product?.images || [];
      const formattedImages = productImages
        .filter(img => img.is_active !== false)
        .map((img) => {
          const imgData = img.toJSON ? img.toJSON() : img;
          return {
            ...imgData,
            imageUrl: `${req.protocol}://${req.get("host")}/uploads/products/${imgData.images}`,
          };
        });

      return {
        id: item.id,
        product_id: item.product_id,
        quantity: item.quantity,
        product: item.Product
          ? {
              id: item.Product.id,
              name: item.Product.name,
              price: item.Product.price,
              brand: item.Product.brand,
              stock: item.Product.stock,
              images: formattedImages,
            }
          : null,
        subtotal,
      };
    });

    return res.status(200).json({ items: formatted, total });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to fetch cart", error: err.message });
  }
};

/**
 * Remove item from cart by cart ID
 */
export const removeFromCart = async (req, res) => {
  try {
    const { id } = req.params;
    const cust_id = req.customer.id; // <-- changed from req.user.id

    const deleted = await Cart.destroy({ where: { id, cust_id } });
    if (!deleted) return res.status(404).json({ message: "Cart item not found" });

    return res.status(200).json({ message: "Removed from cart" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to remove from cart", error: err.message });
  }
};
