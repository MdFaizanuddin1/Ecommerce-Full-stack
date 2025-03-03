import mongoose, { Schema } from "mongoose";

const reviewSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    stars: {
      type: String,
      Required: true,
    },
    reviewTitle: {
      type: String,
      Required: true,
    },
    review: {
      type: String,
      Required: true,
    },
    recommended: {
      type: Boolean,
      Required: true,
    },
  },
  { timestamps: true }
);

export const Review = mongoose.model("Review", reviewSchema);
