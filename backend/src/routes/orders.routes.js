import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import {
  createOrderBuyNow,
  createOrderFromCart,
  getAllOrder,
  getUserOrder,
  verify,
} from "../controllers/orders.controllers.js";

const router = Router();

router.post("/cartOrder", verifyToken, createOrderFromCart);
router.post("/buyNowOrder", verifyToken, createOrderBuyNow);
router.post("/verify", verifyToken, verify);
router.get("/get", verifyToken, getUserOrder);
router.get("/getAll", verifyToken, getAllOrder);

export default router;
