import { Router } from "express";
import {
  addToWishList,
  deleteWishList,
  getAllWishList,
  getWishList,
  removeFromWishList,
} from "../controllers/wishList.controllers.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/add/:productId").post(verifyToken, addToWishList);
router.route("/get").get(verifyToken, getWishList);
router.route("/delete").delete(verifyToken, deleteWishList);
router.route("/remove/:productId").patch(verifyToken, removeFromWishList);
router.route("/getAll").get(verifyToken, getAllWishList);

export default router;
