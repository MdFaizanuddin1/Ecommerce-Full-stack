import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { WishList } from "../models/wishList.models.js";
import { Product } from "../models/products.models.js";
import mongoose from "mongoose";

// Add to wishlist
const addToWishList = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  if (!userId) {
    throw new ApiError(400, "Unauthorized request");
  }

  const { name = "favorites" } = req.body;
  const { productId } = req.params;

  if (!productId) {
    throw new ApiError(400, "Error: productId is required");
  }

  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  let wishListItem = await WishList.findOne({
    userId,
    name,
    "products.product": productId,
  });
  if (wishListItem) {
    return res
      .status(200)
      .send(
        new ApiResponse(
          200,
          wishListItem,
          "The specified item is already in this wishlist."
        )
      );
  }

  wishListItem = await WishList.findOneAndUpdate(
    { userId, name },
    { $push: { products: { product: productId } } },
    { new: true, upsert: true }
  ).populate("products.product");

  return res
    .status(200)
    .send(
      new ApiResponse(200, wishListItem, "Item added to wishlist successfully")
    );
});

// Get all wishlists for a user
const getAllWishList = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  if (!userId) {
    throw new ApiError(400, "Unauthorized request");
  }
  const wishLists = await WishList.find({ userId }).populate(
    "products.product"
  );

  res
    .status(200)
    .send(
      new ApiResponse(200, wishLists, "User wishlists fetched successfully")
    );
});

// Remove item from wishlist
const removeFromWishList = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { productId } = req.params;
  const { name = "favorites" } = req.body;

  if (!userId || !productId) {
    throw new ApiError(400, "Error: userId and productId are required");
  }

  const wishListItem = await WishList.findOneAndUpdate(
    { userId, name },
    { $pull: { products: { product: productId } } },
    { new: true }
  ).populate("products.product");

  res
    .status(200)
    .send(
      new ApiResponse(
        200,
        wishListItem,
        "Item removed from wishlist successfully"
      )
    );
});

// Delete an entire wishlist
const deleteWishList = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { name } = req.body;
  if (!userId || !name) {
    throw new ApiError(400, "Error: userId and wishlist name are required");
  }

  const deletedWishList = await WishList.findOneAndDelete({ userId, name });

  if(!deletedWishList) {
    throw new ApiError (500, 'Failed to delete wishlist')
  }
  res
    .status(200)
    .send(new ApiResponse(200, deletedWishList, "Wishlist deleted successfully"));
});

// Get WishList by userId and name
const getWishList = asyncHandler(async (req, res) => {
  const { name } = req.query; // Get userId and name from query parameters

  const userId = req.user._id;
  if (!userId) {
    throw new ApiError(400, "Unauthorized request");
  }

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new ApiError(404, "User ID is invalid");
  }

  // Find wish list items by userId and name
  const wishItems = await WishList.find({ userId, name }).populate(
    "products.product"
  );

  if (!wishItems || wishItems.length === 0) {
    throw new ApiError(
      404,
      "No wishlist items found for this user and wishlist name"
    );
  }

  return res
    .status(200)
    .send(new ApiResponse(200, wishItems, "Wishlist fetched successfully"));
});

export {
  addToWishList,
  getWishList,
  deleteWishList,
  getAllWishList,
  removeFromWishList,
};
