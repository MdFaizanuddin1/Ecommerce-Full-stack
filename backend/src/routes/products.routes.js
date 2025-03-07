import { Router } from "express";
import {
  authAddProduct,
  authDeleteProductById,
  authEditProduct,
  deleteAllProducts,
  getAllProducts,
  getAllProductsByField,
  getProductByQuery,
  getSingleProduct,
} from "../controllers/products.controllers.js";
import { upload } from "../middlewares/multer.middlewares.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/getSingleProduct").get(getSingleProduct);
router.route("/getAll").get(getAllProducts);
router.route("/getField").post(getAllProductsByField);
router.route("/get").get(getProductByQuery);

// --------------- auth secured routes
router
  .route("/addProduct")
  .post(upload.fields([{ name: "image" }]), verifyToken, authAddProduct);

router.route("/delete/:productId").delete(verifyToken, authDeleteProductById);
router.route("/edit/:productId").patch(verifyToken, authEditProduct);

router.route("/deleteAllProducts").delete(verifyToken, deleteAllProducts);
export default router;
