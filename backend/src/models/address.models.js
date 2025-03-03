import mongoose from "mongoose";

const AddressSchema = new mongoose.Schema(
  {
    country: {
      type: String,
      required: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    pinCode: {
      type: Number,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    isDeleted: { type: Boolean, default: false }, // ✅ Soft delete field
  },
  {
    timestamps: true,
  }
);

export const Address = mongoose.model("Address", AddressSchema);
