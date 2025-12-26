import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    name: String,
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema(
  {
    title: String,
    price: Number,
    images: [String],
    category: String,
    state: String,
    stock: Number,
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    // ⭐⭐⭐⭐⭐
    reviews: [reviewSchema],
    rating: {
      type: Number,
      default: 0
    },
    numReviews: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
