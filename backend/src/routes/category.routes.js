import { Router } from "express";
import {
  createCategory,
  deleteCategory,
  getAllCategory,
  getCategory,
  updateCategory,
} from "../controllers/category.controllers.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/create").post(verifyToken, createCategory);
router.route("/getAll").get(getAllCategory);
router.route("/get/:id").get(getCategory);
router.route("/update/:id").patch(verifyToken, updateCategory);
router.route("/delete/:id").delete(verifyToken, deleteCategory);

export default router;
