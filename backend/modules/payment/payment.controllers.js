import Razorpay from "razorpay";
import crypto from "crypto";
import Payment from "./payment.model.js";
import Order from "../order/order.model.js";
import dotenv from "dotenv";


dotenv.config();

// initialize razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/**
 * Create Razorpay order for an existing backend Order.
 * Input: { order_id: "<order-uuid>" }
 * Output: razorpay order id + key so frontend can open checkout
 */
export const createRazorpayOrder = async (req, res) => {
  try {
    const { order_id } = req.body;
    const order = await Order.findByPk(order_id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    // create razorpay order (amount in paise)
    const options = {
      amount: Math.round(order.total_amount * 100), // paise
      currency: "INR",
      receipt: `receipt_${order.id}`,
      payment_capture: 1, // auto-capture
    };

    const razorOrder = await razorpay.orders.create(options);

    // store minimal payment record
    await Payment.create({
      order_id: order.id,
      razorpay_order_id: razorOrder.id,
      status: "created",
    });

    return res.status(200).json({
      message: "Razorpay order created",
      razorpay_order_id: razorOrder.id,
      amount: order.total_amount,
      currency: "INR",
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to create razorpay order", error: err.message });
  }
};

/**
 * Verify razorpay payment sent from frontend.
 * Frontend must send razorpay_order_id, razorpay_payment_id, razorpay_signature
 */
export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ message: "Missing payment info" });
    }

    // compute expected signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid signature" });
    }

    // find payment record
    const payment = await Payment.findOne({ where: { razorpay_order_id } });
    if (!payment) return res.status(404).json({ message: "Payment not found" });

    payment.razorpay_payment_id = razorpay_payment_id;
    payment.razorpay_signature = razorpay_signature;
    payment.status = "paid";
    await payment.save();

    // update order status to paid
    await Order.update({ status: "paid" }, { where: { id: payment.order_id } });

    return res.status(200).json({ message: "Payment verified and order updated" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Payment verification failed", error: err.message });
  }
}
