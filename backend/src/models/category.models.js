import mongoose, { Schema } from "mongoose";

// Defining the Category schema
const CategorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      lowercase: true,
    },
    description: {
      type: String,
      default: "",
    },
    parentCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category", // For subcategories
      default: null,
    },
    isActive: {
      type: String,
      default: "active",
      enum: ["active", "inactive"]
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

// Create the model
export const Category = mongoose.model("Category", CategorySchema);
