import { Router } from "express";
import {
  AddReview,
  deleteReview,
  editReview,
  getProductReviews,
} from "../controllers/review.controllers.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/add").post(verifyToken, AddReview);
router.route("/getReviews/:productId").get(getProductReviews);
router.route("/edit/:reviewId").patch(verifyToken, editReview);
router.route("/delete/:reviewId").delete(verifyToken, deleteReview);

export default router;
