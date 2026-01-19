// import Order from "./order.model.js";
// import OrderItem from "./oderItem.model.js";
import Cart from "../cart/cart.model.js";
// import Product from "../products/product.model.js";
// import { sequelize } from "../config/db.js";
import sequelize from "../../config/db.js";
import { Customer, Order, OrderItem, Product} from '../associations/index.js'
import { generateOrderCode } from "../../utils/generateOrderCode.js";
import { generateOrderQRCode } from "../../utils/generateQRCode.js";
// controllers/report.controller.js
import PDFDocument from "pdfkit";
import path from "path";
import ExcelJS from "exceljs";

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

export const generateOrderPDF = async (req, res) => {
  try {
    const userId = req.customer.id;
    const { order_id } = req.params;

    const order = await Order.findOne({
      where: { id: order_id, user_id: userId },
      include: [
        {
          model: OrderItem,
          as: "items",
          include: [{ model: Product, as: "product" }],
        },
      ],
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const orderData = order.toJSON();

    const doc = new PDFDocument({ size: "A4", margin: 40 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=Invoice-${orderData.order_code}.pdf`
    );

    doc.pipe(res);

    /* ================= HEADER ================= */

    const logoPath = path.join(process.cwd(), "assets/organicmulberrylogo.png");
    doc.image(logoPath, 40, 40, { width: 150 });

    doc
      .font("Helvetica-Bold")
      .fontSize(26)
      .text("Invoice", 0, 55, { align: "right" });

    doc.moveTo(40, 120).lineTo(555, 120).stroke();

    /* ================= ADDRESS BLOCK ================= */

    const startY = 140;
    const lineGap = 12;

    // /* -------- SHIP TO -------- */
    let shipY = startY;
    doc.font("Helvetica-Bold").fontSize(9).text("SHIP TO", 40, shipY);
    doc.font("Helvetica").fontSize(8);
    shipY += lineGap;

    doc.font("Helvetica").fontSize(8);
 
const shipToDetails = [
  req.customer.name,
  req.customer.email,
  req.customer.phone,
  orderData.address,
  `${req.customer.city}, ${req.customer.state}`,
  req.customer.country,
  req.customer.pincode,
];

shipToDetails.forEach((text) => {
  if (!text) return;

  const textHeight = doc.heightOfString(text, {
    width: 180,
  });

  doc.text(text, 40, shipY, {
    width: 180,
    lineGap: 2, // 🔹 space between wrapped lines
  });

  shipY += textHeight + 6; // 🔹 space between fields
});

/* -------- BILL TO -------- */
let billY = startY;

doc.font("Helvetica-Bold")
   .fontSize(9)
   .text("BILL TO", 280, billY);

billY += lineGap;

doc.font("Helvetica").fontSize(8);

const billToDetails = [
  "LINEN & MORE INDIA PRIVATE LIMITED",
  "senthil@lamlinen.com",
  "+91 95663 80568",
  "5/405 Kamanayakanpalayam Road",
  "Karadivavi, Palladam",
  "Tirupur, Tamil Nadu",
  "India - 641658",
];

billToDetails.forEach((text) => {
  doc.text(text, 280, billY, { width: 180 });
  billY += lineGap;
});

    /* -------- QR CODE -------- */
    if (orderData.qr_code) {
      const base64 = orderData.qr_code.replace(
        /^data:image\/png;base64,/,
        ""
      );
      const qrBuffer = Buffer.from(base64, "base64");

      doc
        .font("Helvetica-Bold")
        .fontSize(9)
        .text("QR FOR TRACKING", 450, startY);

      doc.image(qrBuffer, 450, startY + 15, { width: 100 });
    }

    /* ================= ORDER INFO ================= */

    const infoY = Math.max(shipY, billY) + 15;

    doc.font("Helvetica").fontSize(10);
    doc.text(`Payment Method: ${orderData.payment_method}`, 40, infoY);
    doc.text(`Order Code: ${orderData.order_code}`, 40, infoY + 15);
    doc.text(
      `Order Date: ${new Date(orderData.createdAt).toLocaleDateString()}`,
      280,
      infoY
    );

    /* ================= TABLE HEADER ================= */

    let tableY = infoY + 45;

    doc.rect(40, tableY, 515, 28).fill("#f3d9a5");

    doc
      .fillColor("#000")
      .font("Helvetica-Bold")
      .fontSize(11);

    doc.text("Product", 50, tableY + 8);
    doc.text("Price", 300, tableY + 8);
    doc.text("Qty", 390, tableY + 8);
    doc.text("Total", 460, tableY + 8);

    /* ================= TABLE ROWS ================= */


const fontPath = path.join(process.cwd(), "/assets/fonts/Roboto-Regular.ttf");


doc.font(fontPath).fontSize(10);


    doc.font("Helvetica").fontSize(10);
    let rowY = tableY + 38;
const formatINR = (amount) =>
  `₹ ${amount.toLocaleString("en-IN")}`;

    orderData.items.forEach((item) => {
      doc.text(item.product.name, 50, rowY, { width: 230 });
       doc.text(item.price, 300, rowY);
      // doc.text(formatINR(item.price), 300, rowY);
      doc.text(item.quantity, 390, rowY);
      doc.text(item.price * item.quantity, 460, rowY);
      rowY += 22;
    });

    /* ================= GRAND TOTAL ================= */

    doc.rect(40, rowY + 5, 515, 35).fill("#f3d9a5");

    doc
      .fillColor("#000")
      .font("Helvetica-Bold")
      .fontSize(12)
      .text(`Grand Total: Rs ${orderData.total_amount}/-`, 380, rowY + 17);

    /* ================= SIGNATURE ================= */

    const signPath = path.join(process.cwd(), "assets/signature.png");

    doc.image(signPath, 430, rowY + 60, { width: 100 });

    doc
      .font("Helvetica")
      .fontSize(10)
      .text("Authorised Sign", 430, rowY + 95);

    doc.end();
  } catch (err) {
    console.error("Invoice PDF Error:", err);
    res.status(500).json({
      message: "Invoice PDF generation failed",
      error: err.message,
    });
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

export const downloadOrdersExcel = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [
        {
          model: Customer,
          as: "customer",
          attributes: ["name", "email", "phone"],
        },
        {
          model: OrderItem,
          as: "items",
          include: [
            {
              model: Product,
              as: "product",
              attributes: ["name", "price"],
            },
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    // ✅ Create Workbook & Sheet
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Orders");

    // ✅ Excel Columns
    sheet.columns = [
      { header: "Order Code", key: "order_code", width: 25 },
      { header: "Customer Name", key: "customer_name", width: 20 },
      { header: "Email", key: "email", width: 25 },
      { header: "Phone", key: "phone", width: 15 },
      { header: "Product Name", key: "product", width: 25 },
      { header: "Quantity", key: "quantity", width: 10 },
      { header: "Price", key: "price", width: 12 },
      { header: "Total Amount", key: "total", width: 15 },
      { header: "Payment Method", key: "payment", width: 15 },
      { header: "Status", key: "status", width: 15 },
      { header: "Address", key: "address", width: 40 },
      { header: "Order Date", key: "date", width: 20 },
    ];

    // ✅ Add Rows
    orders.forEach(order => {
      order.items.forEach(item => {
        sheet.addRow({
          order_code: order.order_code,
          customer_name: order.customer?.name,
          email: order.customer?.email,
          phone: order.customer?.phone,
          product: item.product?.name,
          quantity: item.quantity,
          price: item.price,
          total: order.total_amount,
          payment: order.payment_method,
          status: order.status,
          address: order.address,
          date: new Date(order.createdAt).toLocaleString(),
        });
      });
    });

    // ✅ Header Styling
    sheet.getRow(1).font = { bold: true };

    // ✅ Response Headers
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=orders.xlsx"
    );

    await workbook.xlsx.write(res);
    res.end();

  } catch (err) {
    console.error("Excel Download Error:", err);
    res.status(500).json({ message: "Failed to download Excel" });
  }
};
