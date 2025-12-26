import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true
        },
        seller: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true
        },
        quantity: Number,
        price: Number
      }
    ],

    shippingAddress: Object,

    totalAmount: Number,

    status: {
      type: String,
      enum: ["Request Sent", "Accepted", "Shipped", "Delivered", "Cancelled"],
      default: "Request Sent"
    }
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
