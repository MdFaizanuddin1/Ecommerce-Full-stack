import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Product } from "../models/products.models.js";
import { Cart } from "../models/cart.models.js";
import crypto from "node:crypto";
import { razorpay } from "../utils/razorpay.config.js";
import { Order } from "../models/order.models.js";

const createOrderBuyNow = asyncHandler(async (req, res) => {
  // Extract user ID
  const userId = req.user?._id;
  if (!userId) throw new ApiError(401, "Unauthorized");

  // Extract product ID and quantity
  const { productId, quantity } = req.body;
  if (!productId) throw new ApiError(400, "Product ID is required");
  if (!quantity || quantity < 1) throw new ApiError(400, "Invalid quantity");

  // Fetch product details
  const product = await Product.findById(productId);
  if (!product) throw new ApiError(404, "No product found with this ID");

  const amount = product.price * quantity;
  const shortUserId = userId.toString().substring(0, 6); // Take first 6 characters of userId
  const shortTimestamp = Date.now().toString().slice(-6); // Take last 6 digits of timestamp

  const options = {
    amount: amount * 100, // Convert to paise
    currency: "INR",
    receipt: `r_${shortUserId}_${shortTimestamp}`,
  };

  try {
    const order = await razorpay.orders.create(options);
    if (!order) throw new ApiError(500, "Order creation failed");

    // Return response with product details
    res
      .status(200)
      .json(
        new ApiResponse(200, { order, product }, "Order created successfully")
      );
  } catch (error) {
    console.log("error is ", error);
    throw new ApiError(500, "Payment gateway error: " + error);
  }
});

const createOrderFromCart = asyncHandler(async (req, res) => {
  // Extract user ID
  const userId = req.user?._id || req.body._id;
  if (!userId) throw new ApiError(401, "Unauthorized");

  // Fetch user's cart
  const cart = await Cart.findOne({ userId }).populate("items.product");
  if (!cart || !cart.items || cart.items.length === 0) {
    throw new ApiError(404, "Your cart is empty");
  }

  // Calculate total price and validate stock
  let totalPrice = 0;
  let productDetails = [];

  for (let item of cart.items) {
    const product = item.product;
    if (!product)
      throw new ApiError(404, `Product with ID ${item.product} not found`);

    productDetails.push({
      productId: product._id,
      name: product.productName,
      price: product.price,
      quantity: item.quantity,
      subtotal: product.price * item.quantity,
    });

    totalPrice += product.price * item.quantity;
  }

  if (totalPrice <= 0) throw new ApiError(400, "Invalid total price");
  const shortUserId = userId.toString().substring(0, 6); // Take first 6 characters of userId
  const shortTimestamp = Date.now().toString().slice(-6); // Take last 6 digits of timestamp

  // Create order in Razorpay
  const options = {
    amount: totalPrice * 100, // Convert to paise
    currency: "INR",
    receipt: `r_${shortUserId}_${shortTimestamp}`,
  };

  try {
    const order = await razorpay.orders.create(options);
    if (!order) throw new ApiError(500, "Order creation failed");

    // Send response
    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { order, productDetails, totalPrice },
          "Order created successfully"
        )
      );
  } catch (error) {
    throw new ApiError(500, "Payment gateway error: " + error.message);
  }
});

const verify = asyncHandler(async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    userId,
    products, // Now expecting an array of products [{ productId, quantity }]
    quantity,
    amount,
    currency,
  } = req.body;

  const key_secret = process.env.RAZOR_KEY_SECRET; // Replace with your Razorpay key_secret
  if (!key_secret) throw new Error("Razorpay key secret is not set");

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    throw new ApiError(400, "Missing payment verification parameters");
  }

  // Use `crypto.createHmac` to generate the signature
  const generatedSignature = crypto
    .createHmac("sha256", key_secret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (generatedSignature !== razorpay_signature)
    throw new ApiError(400, "payment verification failed");

  // Ensure products is an array before storing
  if (!Array.isArray(products) || products.length === 0) {
    throw new ApiError(400, "Products array is required");
  }

  // Store order details in the database
  const newOrder = new Order({
    userId,
    products, // store multiple products
    quantity,
    amount,
    currency,
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    status: "Paid",
  });

  await newOrder.save();
  return res
    .status(200)
    .json(new ApiResponse(200, newOrder, "payment verified successfully!"));
});

const getAllOrder = asyncHandler(async (req, res) => {
  if (req.user.role !== "admin") {
    throw new ApiError(404, "Admin access only : get all order");
  }

  const orders = await Order.find()
    .populate("userId", "userName email")
    .populate("products.productId", "productName price image");

  return res
    .status(200)
    .json(new ApiResponse(200, orders, "All orders fetched successfully"));
});

const getUserOrder = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  if (!userId) {
    throw new ApiError(404, "unauthorized");
  }

  const orders = await Order.find({ userId })
    .populate("userId", "userName email")
    .populate("products.productId", "productName price image");
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        orders,
        "All orders for specific user fetched successfully"
      )
    );
});

export {
  createOrderBuyNow,
  createOrderFromCart,
  verify,
  getAllOrder,
  getUserOrder,
};
