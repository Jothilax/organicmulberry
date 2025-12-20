// import Order from "./order.model.js";
// import OrderItem from "./oderItem.model.js";
import Cart from "../cart/cart.model.js";
// import Product from "../products/product.model.js";
// import { sequelize } from "../config/db.js";
import sequelize from "../../config/db.js";
import { Customer, Order, OrderItem, Product} from '../associations/index.js'
import { generateOrderCode } from "../../utils/generateOrderCode.js";
import { generateOrderQRCode } from "../../utils/generateQRCode.js";

/**
 * Create an order from the logged-in user's cart.
 * Steps:
 *  - fetch cart items & validate
 *  - compute total
 *  - create order within a transaction
 *  - create order items (snapshot price)
 *  - clear cart
 */
export const createOrderFromCart = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const userId = req.customer.id; // ✅ changed from req.user.id
    const { payment_method = "COD", address = "" } = req.body;

    // Fetch cart items with product details
    const cartItems = await Cart.findAll({
      where: { cust_id: userId }, // ✅ change user_id -> cust_id
      include: [Product],
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    if (!cartItems || cartItems.length === 0) {
      await t.rollback();
      return res.status(400).json({ message: "Cart is empty" });
    }

    let total = 0;
    const orderItemsPayload = [];

    for (const ci of cartItems) {
      const product = ci.Product;
      if (!product) throw new Error(`Product not found: ${ci.product_id}`);

      const price = Number(product.price) || 0;
      const qty = Number(ci.quantity);
      total += price * qty;

      orderItemsPayload.push({
        product_id: product.id,
        quantity: qty,
        price,
      });
    }

    // Generate unique order code
    let orderCode = null;
    try {
      orderCode = generateOrderCode();
    } catch (codeError) {
      console.error('Error generating order code:', codeError);
      // Generate a fallback code using timestamp
      orderCode = `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    }

    // Create order - try with order_code, fallback without if column doesn't exist
    let order;
    try {
      order = await Order.create(
        {
          user_id: userId,
          total_amount: total,
          payment_method,
          address,
          order_code: orderCode,
          created_by: userId,
          updated_by: userId,
        },
        { transaction: t }
      );
    } catch (createError) {
      // If order_code column doesn't exist, create without it
      if (createError.message && createError.message.includes('order_code')) {
        console.warn('order_code column may not exist, creating order without it');
        order = await Order.create(
          {
            user_id: userId,
            total_amount: total,
            payment_method,
            address,
            created_by: userId,
            updated_by: userId,
          },
          { transaction: t }
        );
        // Try to update with order_code after creation
        try {
          await order.update({ order_code: orderCode }, { transaction: t });
        } catch (updateError) {
          console.warn('Could not update order_code:', updateError.message);
        }
      } else {
        throw createError;
      }
    }

    // Create order items
    const itemsToCreate = orderItemsPayload.map((it) => ({ ...it, order_id: order.id }));
    await OrderItem.bulkCreate(itemsToCreate, { transaction: t });

    // Clear user's cart
    await Cart.destroy({ where: { cust_id: userId }, transaction: t }); // ✅ change user_id -> cust_id

    await t.commit();
    
    // Generate QR code for the order (outside transaction to avoid issues)
    let qrCodeBase64 = null;
    try {
      qrCodeBase64 = await generateOrderQRCode({
        id: order.id,
        order_code: order.order_code,
        total_amount: order.total_amount,
        status: order.status,
        createdAt: order.createdAt,
        user_id: order.user_id
      });
      
      // Update order with QR code (no transaction needed here)
      await order.update({ qr_code: qrCodeBase64 });
    } catch (qrError) {
      console.error('Error generating QR code (non-critical):', qrError);
      // Continue even if QR code generation fails
    }
    
    // Reload order to get updated data
    const updatedOrder = await Order.findByPk(order.id, {
      include: [
        { model: OrderItem, as: "items", include: [{ model: Product, as: "product" }] },
      ],
    });

    return res.status(201).json({
      message: "Order created successfully",
      order: updatedOrder,
    });
  } catch (err) {
    await t.rollback();
    console.error(err);
    return res.status(500).json({ message: "Failed to create order", error: err.message });
  }
};

/**
 * Get orders for logged-in user (with order items)
 */
export const getUserOrders = async (req, res) => {
  try {
    const userId = req.customer.id; // ✅ changed from req.user.id
    const orders = await Order.findAll({
      where: { user_id: userId },
      include: [
        { model: OrderItem, as: "items", include: [{ model: Product, as: "product" }] },
      ],
      order: [["createdAt", "DESC"]],
    });
    
    // Ensure all orders have order_code and qr_code fields (even if null)
    const ordersWithCodes = orders.map(order => {
      const orderData = order.toJSON();
      // If order_code doesn't exist, generate a display code from ID
      if (!orderData.order_code) {
        orderData.order_code = `ORD-${orderData.id.substring(0, 8).toUpperCase()}`;
      }
      return orderData;
    });
    
    return res.status(200).json(ordersWithCodes);
  } catch (err) {
    console.error('Error in getUserOrders:', err);
    return res.status(500).json({ message: "Failed to fetch orders", error: err.message });
  }
};

/**
 * Get all orders (Admin only)
 */
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
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
          model: Customer,
          as: "customer",
          attributes: ["id", "name", "email", "phone"],
        },
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

    return res.status(200).json({
      message: "All orders fetched successfully",
      total: orders.length,
      orders: orders.map(order => order.toJSON()),
    });
  } catch (err) {
    console.error('Error in getAllOrders:', err);
    return res.status(500).json({ message: "Failed to fetch orders", error: err.message });
  }
};
