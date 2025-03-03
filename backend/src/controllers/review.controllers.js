import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";

import { Review } from "../models/review.models.js";
import { Product } from "../models/products.models.js";
import mongoose from "mongoose";

const AddReview = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  if (!userId) {
    throw new ApiError(400, "Unauthorized request");
  }
  const { productId, stars, reviewTitle, review, recommended } = req.body;

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new ApiError(400, "Invalid Product ID");
  }

  // Check if product exists
  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  const newReview = await Review.create({
    user: userId,
    product: product._id,
    stars,
    reviewTitle,
    review,
    recommended,
  });

  const createdReview = await Review.findById(newReview._id)
    .populate("product", "productName image")
    .populate("user", "userName email");

  if (!createdReview) {
    throw new ApiError(400, "Review creation failed");
  }

  // Push review into Product's review array
  product.reviews.push(newReview._id);
  await product.save();

  return res
    .status(200)
    .send(new ApiResponse(200, createdReview, "Review created successfully"));
});

const editReview = asyncHandler(async (req, res) => {
  const { reviewId } = req.params;
  const userId = req.user._id; // Get logged-in user's ID
  const { stars, reviewTitle, review, recommended } = req.body;

  // Validate reviewId
  if (!mongoose.Types.ObjectId.isValid(reviewId)) {
    throw new ApiError(404, "Invalid Review ID");
  }

  // Find the review
  const existingReview = await Review.findOne({ _id: reviewId, user: userId });

  if (!existingReview) {
    throw new ApiError(404, "Review not found or not authorized to edit");
  }

  // Update only the provided fields
  if (stars) existingReview.stars = stars;
  if (reviewTitle) existingReview.reviewTitle = reviewTitle;
  if (review) existingReview.review = review;
  if (recommended !== undefined) existingReview.recommended = recommended;

  // Save the updated review
  const updatedReview = await existingReview.save();

  return res
    .status(200)
    .send(new ApiResponse(200, updatedReview, "Review updated successfully"));
});

const deleteReview = asyncHandler(async (req, res) => {
  const { reviewId } = req.params;
  const userId = req.user._id;

  // Validate reviewId
  if (!mongoose.Types.ObjectId.isValid(reviewId)) {
    throw new ApiError(404, "Invalid Review ID");
  }

  // Find review to get product ID
  const review = await Review.findOne({ _id: reviewId, user: userId });
  if (!review) {
    throw new ApiError(404, "Review not found or not authorized to delete");
  }

  // Remove review from Product's review array
  await Product.findByIdAndUpdate(review.product, {
    $pull: { reviews: reviewId },
  });

  // Delete the review
  await Review.findByIdAndDelete(reviewId);

  return res
    .status(200)
    .send(new ApiResponse(200, null, "Review deleted successfully"));
});

const getProductReviews = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new ApiError(400, "Invalid Product ID");
  }

  const product = await Product.findById(productId)
    .populate({
      path: "reviews", // First populate reviews
      populate: {
        path: "user", // Then populate user inside each review
        select: "name email", // Optional: Select only required fields
      },
    })
    .exec();

  if (!product) {
    throw new ApiError(500, "No product found");
  }

  const reviews = product.reviews;

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { totalReviews: reviews.length, reviews },
        "Product reviews fetched successfully"
      )
    );
});

export { AddReview, editReview, deleteReview, getProductReviews };
