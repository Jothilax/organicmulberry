// import Customer from "./customer.model.js";
import { generateOTP, hashPassword } from "../../utils/auth.js";
import { sendSMSOTP } from "../../utils/sendOTP.js";
import { sendEmail } from "../../utils/sendEmail.js";
import { generateToken } from "../../utils/jwt.js";
import { Op } from "sequelize";
// import Order from '../order/order.model.js'
import { Customer, Order, OrderItem, Product} from '../associations/index.js'


export const requestOTP = async (req, res) => {
  try {
    const { email, phone } = req.body;
    if (!email && !phone) return res.status(400).json({ message: "Email or phone required" });

    // Find existing customer by email or phone
    let customer = await Customer.findOne({
      where: {
        [Op.or]: [
          email ? { email } : null,
          phone ? { phone } : null
        ].filter(Boolean), // remove nulls
      },
    });

    // If customer does not exist, create one
    if (!customer) {
      const password = generateOTP();
      customer = await Customer.create({ 
        email, 
        phone, 
        password: await hashPassword(password) 
      });
    }

    // Generate OTP and set expiry
    const otp = generateOTP();
    const expiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
    await customer.update({ otp, otpExpiry: expiry, isVerified: false });

    // Send OTP
    if (email) await sendEmail(email, otp);
    if (phone) await sendSMSOTP(phone);

    res.json({ message: "OTP sent successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


export const verifyOTP = async (req, res) => {
  try {
    const { email, phone, otp } = req.body;
    if (!otp || (!email && !phone))
      return res.status(400).json({ message: "Invalid request" });

    // find customer by email or phone
    const customer = await Customer.findOne({
      where: {
        [Op.or]: [
          email ? { email } : null,
          phone ? { phone } : null
        ].filter(Boolean),
      },
    });

    if (!customer)
      return res.status(404).json({ message: "Customer not found" });

    // check OTP
    if (customer.otp !== otp)
      return res.status(400).json({ message: "Invaliad OTP" });

    // check OTP expiry
    if (customer.otpExpiry && new Date() > customer.otpExpiry)
      return res.status(400).json({ message: "OTP expired" });

    // update verification status
    await customer.update({
      isVerified: true,
      otp: null,
      otpExpiry: null,
    });

    const token = generateToken({ id: customer.id, email: customer.email });
    res.json({ message: "OTP verified successfully", token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const customer = req.customer;

    // ✅ Fix: use isVerified instead of is_verified
    if (!customer.isVerified) {
      return res.status(403).json({ message: "Customer not verified" });
    }

    await customer.update(req.body);
    res.json({ message: "Profile updated successfully", customer });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


// ✅ Get logged-in customer's profile
export const getProfile = async (req, res) => {
  try {
    const customer = req.customer;

    if (!customer)
      return res.status(404).json({ message: "Customer not found" });

    res.json({
      message: "Profile fetched successfully",
      customer,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


export const getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.findAll({
      attributes: [
        "id",
        "name",
        "email",
        "phone",
        "gender",
        "address",
        "country",
        "state",
        "city",
        "pincode",
        "landmark",
        "createdAt",
        "updatedAt",
      ],
      include: [
        {
          model: Order,
          as: "orders",
          attributes: ["id"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    // Add totalOrders count for each customer
    const customersWithOrderCount = customers.map((c) => ({
      ...c.toJSON(),
      totalOrders: c.orders ? c.orders.length : 0,
    }));

    res.json({
      message: "All customers fetched successfully",
      total: customers.length,
      customers: customersWithOrderCount,
    });
  } catch (error) {
    console.error("Error fetching customers:", error);
    res.status(500).json({ message: "Failed to fetch customers" });
  }
};