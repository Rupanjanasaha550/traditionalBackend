import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { addReview, deleteReview } from "../controllers/reviewController.js";

const router = express.Router();

router.post("/:id", protect, addReview);
router.delete("/:productId/:reviewId", protect, deleteReview);

export default router;
