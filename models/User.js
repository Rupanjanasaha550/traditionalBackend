import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    password: String,
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    isVerified: { type: Boolean, default: false },
    emailVerifyToken: String,
    

    role: {
      type: String,
      enum: ["buyer", "seller", "admin"],
      default: "buyer"
    },
    profileImage: {
  type: String,
  default: ""
},


    // Seller specific fields
    shopName: String,
    gstNumber: String,
    phone: String,
    address: String
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
