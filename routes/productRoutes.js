import express from "express";
import {
  getProducts,
  getProductById,
  createProduct,
  getMyProducts,
  updateProduct,
  deleteProduct
} from "../controllers/productController.js";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.get("/", getProducts);

// 🔥 MUST BE BEFORE :id
router.get("/my", protect, getMyProducts);

router.get("/:id", getProductById);

router.post(
  "/",
  protect,
  upload.array("images", 5),
  createProduct
);

router.put("/:id", protect, updateProduct);
router.delete("/:id", protect, deleteProduct);

export default router;
