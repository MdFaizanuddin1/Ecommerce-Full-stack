import mongoose, { Schema } from "mongoose";

const wishListSchema = new Schema(
  {
    name: {
      type: String,
      default: "favorites", // Default value if not provided
      required: true,
    },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        addedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

export const WishList = mongoose.model("WishList", wishListSchema);
