import Coupon from "./coupon.model.js";
import { Op } from "sequelize";
import sequelize from "../../config/db.js";

export const createCoupon = async (req, res) => {
  try {
    const {
      code,
      description,
      discount_type,
      discount_value,
      min_purchase,
      max_discount,
      expiry_date,
      usage_limit,
    } = req.body;

    if (!code || !discount_type || !discount_value) {
      return res.status(400).json({
        message: "Code, discount_type, and discount_value are required",
      });
    }

    // Check if code already exists
    const existingCoupon = await Coupon.findOne({ where: { code } });
    if (existingCoupon) {
      return res.status(400).json({
        message: "Coupon code already exists",
      });
    }

    const coupon = await Coupon.create({
      code: code.toUpperCase(),
      description,
      discount_type,
      discount_value,
      min_purchase: min_purchase || 0,
      max_discount,
      expiry_date: expiry_date ? new Date(expiry_date) : null,
      usage_limit,
    });

    return res.status(201).json({
      message: "Coupon created successfully",
      coupon,
    });
  } catch (error) {
    console.error("Error creating coupon:", error);
    return res.status(500).json({
      message: "Failed to create coupon",
      error: error.message,
    });
  }
};

export const getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.findAll({
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      message: "Coupons fetched successfully",
      total: coupons.length,
      coupons,
    });
  } catch (error) {
    console.error("Error fetching coupons:", error);
    return res.status(500).json({
      message: "Failed to fetch coupons",
      error: error.message,
    });
  }
};

export const getAvailableCoupons = async (req, res) => {
  try {
    const now = new Date();
    const coupons = await Coupon.findAll({
      where: {
        is_active: true,
        [Op.or]: [
          { expiry_date: null },
          { expiry_date: { [Op.gte]: now } },
        ],
        [Op.or]: [
          { usage_limit: null },
          sequelize.literal('used_count < usage_limit'),
        ],
      },
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      message: "Available coupons fetched successfully",
      coupons,
    });
  } catch (error) {
    console.error("Error fetching available coupons:", error);
    return res.status(500).json({
      message: "Failed to fetch available coupons",
      error: error.message,
    });
  }
};

export const validateCoupon = async (req, res) => {
  try {
    const { code, total_amount } = req.body;

    if (!code) {
      return res.status(400).json({
        message: "Coupon code is required",
      });
    }

    const coupon = await Coupon.findOne({
      where: { code: code.toUpperCase(), is_active: true },
    });

    if (!coupon) {
      return res.status(404).json({
        message: "Invalid coupon code",
        valid: false,
      });
    }

    // Check expiry
    if (coupon.expiry_date && new Date(coupon.expiry_date) < new Date()) {
      return res.status(400).json({
        message: "Coupon has expired",
        valid: false,
      });
    }

    // Check usage limit
    if (coupon.usage_limit && coupon.used_count >= coupon.usage_limit) {
      return res.status(400).json({
        message: "Coupon usage limit reached",
        valid: false,
      });
    }

    // Check minimum purchase
    if (total_amount && coupon.min_purchase && total_amount < coupon.min_purchase) {
      return res.status(400).json({
        message: `Minimum purchase of ₹${coupon.min_purchase} required`,
        valid: false,
      });
    }

    // Calculate discount
    let discount = 0;
    if (coupon.discount_type === "percentage") {
      discount = (total_amount * coupon.discount_value) / 100;
      if (coupon.max_discount && discount > coupon.max_discount) {
        discount = coupon.max_discount;
      }
    } else {
      discount = coupon.discount_value;
    }

    return res.status(200).json({
      message: "Coupon is valid",
      valid: true,
      coupon: {
        id: coupon.id,
        code: coupon.code,
        description: coupon.description,
        discount_type: coupon.discount_type,
        discount_value: coupon.discount_value,
        discount: discount,
      },
    });
  } catch (error) {
    console.error("Error validating coupon:", error);
    return res.status(500).json({
      message: "Failed to validate coupon",
      error: error.message,
    });
  }
};

// Update Coupon
export const updateCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      code,
      description,
      discount_type,
      discount_value,
      min_purchase,
      max_discount,
      expiry_date,
      usage_limit,
      is_active,
    } = req.body;

    const coupon = await Coupon.findByPk(id);
    if (!coupon) {
      return res.status(404).json({
        message: "Coupon not found",
      });
    }

    // Check if code already exists (excluding current coupon)
    if (code && code.toUpperCase() !== coupon.code) {
      const existingCoupon = await Coupon.findOne({
        where: { code: code.toUpperCase() },
      });
      if (existingCoupon) {
        return res.status(400).json({
          message: "Coupon code already exists",
        });
      }
    }

    await coupon.update({
      code: code ? code.toUpperCase() : coupon.code,
      description: description !== undefined ? description : coupon.description,
      discount_type: discount_type || coupon.discount_type,
      discount_value: discount_value !== undefined ? discount_value : coupon.discount_value,
      min_purchase: min_purchase !== undefined ? min_purchase : coupon.min_purchase,
      max_discount: max_discount !== undefined ? max_discount : coupon.max_discount,
      expiry_date: expiry_date ? new Date(expiry_date) : coupon.expiry_date,
      usage_limit: usage_limit !== undefined ? usage_limit : coupon.usage_limit,
      is_active: is_active !== undefined ? is_active : coupon.is_active,
    });

    return res.status(200).json({
      message: "Coupon updated successfully",
      coupon,
    });
  } catch (error) {
    console.error("Error updating coupon:", error);
    return res.status(500).json({
      message: "Failed to update coupon",
      error: error.message,
    });
  }
};

// Delete Coupon
export const deleteCoupon = async (req, res) => {
  try {
    const { id } = req.params;

    const coupon = await Coupon.findByPk(id);
    if (!coupon) {
      return res.status(404).json({
        message: "Coupon not found",
      });
    }

    await coupon.destroy();

    return res.status(200).json({
      message: "Coupon deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting coupon:", error);
    return res.status(500).json({
      message: "Failed to delete coupon",
      error: error.message,
    });
  }
};

// Get Coupon by ID
export const getCouponById = async (req, res) => {
  try {
    const { id } = req.params;

    const coupon = await Coupon.findByPk(id);
    if (!coupon) {
      return res.status(404).json({
        message: "Coupon not found",
      });
    }

    return res.status(200).json({
      message: "Coupon fetched successfully",
      coupon,
    });
  } catch (error) {
    console.error("Error fetching coupon:", error);
    return res.status(500).json({
      message: "Failed to fetch coupon",
      error: error.message,
    });
  }
};

