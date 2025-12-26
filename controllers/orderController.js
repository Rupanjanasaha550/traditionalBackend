import Order from "../models/Order.js";
import Product from "../models/Product.js";
import { io } from "../server.js";

/* ================= PLACE ORDER ================= */
export const placeOrder = async (req, res) => {
  try {
    const { items, shippingAddress } = req.body;
    console.log("🔥 PLACE ORDER API HIT");
    if (!req.user)
      return res.status(401).json({ message: "Login required" });

    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product);

      if (!product)
        return res.status(404).json({ message: "Product not found" });

      if (product.stock < item.quantity)
        return res
          .status(400)
          .json({ message: "Out of stock" });

      product.stock -= item.quantity;
      await product.save();

      orderItems.push({
        product: product._id,
        seller: product.seller,
        quantity: item.quantity,
        price: product.price
      });

      totalAmount += product.price * item.quantity;
    }

    const order = await Order.create({
      user: req.user.id,
      items: orderItems,
      shippingAddress,
      totalAmount,
      status: "Request Sent" // 🔥 ORDER PLACED
    });

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: "Order failed" });
  }
};

/* ================= BUYER ORDERS ================= */
export const getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user.id })
    .populate("items.product", "title images price")
    .sort({ createdAt: -1 });

  res.json(orders);
};

/* ================= SELLER ORDERS ================= */
export const getSellerOrders = async (req, res) => {
  const orders = await Order.find({
    "items.seller": req.user.id
  })
    .populate("user", "name email")
    .populate("items.product", "title images")
    .sort({ createdAt: -1 });

  const sellerOrders = orders.map((o) => ({
    _id: o._id,
    customer: o.user,
    status: o.status,
    items: o.items.filter(
      (i) => i.seller.toString() === req.user.id
    )
  }));

  res.json(sellerOrders);
};

/* ================= UPDATE STATUS (SELLER) ================= */
export const updateStatus = async (req, res) => {
  const { status } = req.body;

  const order = await Order.findOne({
    _id: req.params.id,
    "items.seller": req.user.id
  });

  if (!order)
    return res.status(404).json({ message: "Order not found" });

  order.status = status;
  await order.save();

  // 🔔 REAL-TIME UPDATE TO BUYER
  io.emit("orderUpdated", {
    orderId: order._id,
    status: order.status
  });

  res.json(order);
};

/* ================= CANCEL ORDER (BUYER) ================= */
export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order)
      return res.status(404).json({ message: "Order not found" });

    // only owner can cancel
    if (order.user.toString() !== req.user.id)
      return res.status(403).json({ message: "Not allowed" });

    // ❌ delivered ke baad cancel nahi
    if (order.status === "Delivered")
      return res
        .status(400)
        .json({ message: "Order already delivered" });

    // already cancelled
    if (order.status === "Cancelled")
      return res
        .status(400)
        .json({ message: "Order already cancelled" });

    // 🔁 stock restore
    for (const item of order.items) {
      const product = await Product.findById(item.product);
      if (product) {
        product.stock += item.quantity;
        await product.save();
      }
    }

    order.status = "Cancelled";
    await order.save();

    res.json({ message: "Order cancelled", order });
  } catch (err) {
    console.error("CANCEL ORDER ERROR:", err);
    res.status(500).json({ message: "Cancel failed" });
  }
};
export const sellerAnalytics = async (req, res) => {
  try {
    const sellerId = req.user.id;

    // Only delivered orders count
    const orders = await Order.find({
      "items.seller": sellerId,
      status: "Delivered"
    });

    let lifetimeSales = 0;

    const monthly = {}; // { "2025-1": amount }
    const yearly = {};  // { "2025": amount }

    orders.forEach(order => {
      const date = new Date(order.createdAt);
      const year = date.getFullYear();
      const month = date.getMonth() + 1; // 1-12

      order.items.forEach(item => {
        if (item.seller.toString() === sellerId) {
          const amount = item.price * item.quantity;

          lifetimeSales += amount;

          // yearly
          yearly[year] = (yearly[year] || 0) + amount;

          // monthly
          const key = `${year}-${month}`;
          monthly[key] = (monthly[key] || 0) + amount;
        }
      });
    });

    res.json({
      lifetimeSales,
      yearly,
      monthly
    });
  } catch (err) {
    console.error("SELLER ANALYTICS ERROR:", err);
    res.status(500).json({ message: "Analytics failed" });
  }
};
