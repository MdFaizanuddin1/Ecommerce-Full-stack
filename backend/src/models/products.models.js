import mongoose, { Schema } from "mongoose";

const ProductSchema = new Schema(
  {
    productName: {
      type: String,
      required: true,
    },

    barcodeNumber: {
      type: Number,
      required: true,
      unique: true, // Optional, but useful for ensuring uniqueness
    },
    price: {
      type: Number,
      required: true,
    },
    category: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
      },
    ],
    bestseller: {
      type: Boolean,
      default: false,
      index: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: [String],
      required: true,
    },
    age: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      index: true,

      required: true,
    },
    stock: {
      type: Number,
      required: true,
    },

    //
    restockedAt: {
      // Track when the product was last restocked
      type: Date,
    },
    lowStockThreshold: {
      // Alert if stock goes below a certain threshold
      type: Number,
      default: 10,
    },
    stockHistory: [
      // Historical records of stock changes
      {
        type: new Schema(
          {
            quantityChanged: { type: Number, required: true }, // + or - stock change
            changeReason: { type: String, required: true }, // Restock or Sold
            date: { type: Date, default: Date.now },
          },
          { _id: false }
        ),
      },
    ],
    // userId: {
    //   //owner
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "User",
    // },
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Product = mongoose.model("Product", ProductSchema);
