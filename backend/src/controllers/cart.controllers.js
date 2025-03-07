import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";

import { Cart } from "../models/cart.models.js";
import { Product } from "../models/products.models.js";
import mongoose from "mongoose";

const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;

  // Validate productId format (Optional, but recommended)
  if (!mongoose.Types.ObjectId.isValid(productId) || quantity < 1) {
    throw new ApiError(400, "Invalid Product ID format or Quantity");
  }
  const userId = req.user._id;
  if (!userId) {
    throw new ApiError(400, "Unauthorized request");
  }
  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(404, "Product Not Found");
  }

  let cart = await Cart.findOne({ userId });

  if (!cart) {
    cart = new Cart({ userId, items: [], totalPrice: 0 });
  }

  const existingItem = cart.items.find(
    (item) => item.product.toString() === productId
  );

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.items.push({ product: productId, quantity });
  }

  cart.totalPrice = cart.items.reduce((total, item) => {
    return total + item.quantity * product.price;
  }, 0);

  await cart.save();

  res.status(200).json(new ApiResponse(200, cart, "Item added to cart"));
});

const getCartData = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const cart = await Cart.findOne({ userId }).populate(
    "items.product",
    "productName price image"
  );

  if (!cart) {
    return res
      .status(200)
      .json(
        new ApiResponse(200, { items: [], totalPrice: 0 }, "Cart is empty")
      );
  }

  res
    .status(200)
    .json(new ApiResponse(200, cart, "Cart retrieved successfully"));
});

const updateCart = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { productId, quantity } = req.body;

  if (!productId || quantity < 1) {
    throw new ApiError(400, "Invalid product ID or quantity");
  }

  const cart = await Cart.findOne({ userId }).populate(
    "items.product",
    "productName price image"
  );
  if (!cart) {
    throw new ApiError(404, "Cart not found");
  }

  // console.log("cart is ", cart);
  // console.log("product id is", productId);

  const item = cart.items.find((item) => {
    // console.log("logged product is ", item.product.toString());
    return item.product._id.toString() === productId;
  });
  if (!item) {
    throw new ApiError(404, "Product not found in cart");
  }
  // console.log('items is',item)

  item.quantity = quantity;
  cart.totalPrice = cart.items.reduce(
    (acc, item) => acc + item.quantity * item.product.price,
    0
  );

  await cart.save();
  res.status(200).json(new ApiResponse(200, "Cart updated", cart));
});

const removeCartItem = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { productId } = req.body;

  const cart = await Cart.findOne({ userId }).populate(
    "items.product",
    "productName price image"
  );
  if (!cart) {
    throw new ApiError(404, "Cart not found");
  }

  // Check if the product exists in the cart
  const itemExists = cart.items.some(
    (item) => item.product._id.toString() === productId.toString()
  );

  if (!itemExists) {
    throw new ApiError(404, "Product not found in cart");
  }

  // console.log("cart is", cart);
  cart.items = cart.items.filter((item) => {
    // console.log("product id from req ",productId, item.product._id.toString())
    return item.product._id.toString() !== productId.toString();
  });

  // If cart is empty after removing item, delete the cart
  if (cart.items.length === 0) {
    await Cart.deleteOne({ _id: cart._id });
    return res.status(200).json(new ApiResponse(200, null, "Cart deleted"));
  }

  // Recalculate total price
  cart.totalPrice = cart.items.reduce((total, item) => {
    // console.log("product is ", item.product);
    return total + item.quantity * item.product.price;
  }, 0);

  await cart.save();
  // console.log("cart item is", cart.items);

  res.status(200).json(new ApiResponse(200, cart, "Item removed from cart"));
});

const clearCart = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const cart = await Cart.findOneAndDelete({ userId });

  if (!cart) {
    throw new ApiError(404, "Cart not found");
  }

  res.status(200).json(new ApiResponse(200, cart, "Cart cleared"));
});

export { addToCart, getCartData, updateCart, removeCartItem, clearCart };
