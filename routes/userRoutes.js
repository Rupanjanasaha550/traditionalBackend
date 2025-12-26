import express from "express";
import upload from "../middleware/upload.js";
import { protect } from "../middleware/authMiddleware.js";
import {
  uploadProfileImage,
  updateUser
} from "../controllers/userController.js";

const router = express.Router();

router.put(
  "/profile-image",
  protect,
  upload.single("image"),
  uploadProfileImage
);

router.put("/update", protect, updateUser);

export default router;
