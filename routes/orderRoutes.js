import express from "express";
import {
  placeOrder,
  getMyOrders,
  getSellerOrders,
  updateStatus,
  cancelOrder,
  sellerAnalytics
} from "../controllers/orderController.js";

import {
  protect,
  sellerOnly
} from "../middleware/authMiddleware.js";

const router = express.Router();

/* ================= BUYER ================= */

// place order
router.post("/", protect, placeOrder);

// my orders
router.get("/my", protect, getMyOrders);

// cancel order (before delivered)
router.put("/:id/cancel", protect, cancelOrder);

/* ================= SELLER ================= */

// 🔥 ANALYTICS — MUST COME FIRST
router.get(
  "/seller/analytics",
  protect,
  sellerOnly,
  sellerAnalytics
);

// seller orders
router.get(
  "/seller",
  protect,
  sellerOnly,
  getSellerOrders
);

// update order status
router.put(
  "/:id/status",
  protect,
  sellerOnly,
  updateStatus
);

export default router;
