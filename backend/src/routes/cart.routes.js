import { Router } from "express";
import {
  addToCart,
  clearCart,
  updateCart,
  getCartData,
  removeCartItem,
} from "../controllers/cart.controllers.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

// -------- secure routes

router.route("/addToCart").post(verifyToken,addToCart);
router.route("/getCartData/").get(verifyToken,getCartData);
// router.route("/decreaseQuantity/:productId").put(verifyToken,decreaseQuantity);
router.route("/update").put(verifyToken,updateCart);
router.route("/removeCartItem").delete(verifyToken,removeCartItem);
router.route("/clearCart").delete(verifyToken,clearCart);

export default router;
