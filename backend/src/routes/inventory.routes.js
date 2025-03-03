import { Router } from "express";
import {
  checkLowStock,
  getStockDetails,
  restockProduct,
} from "../controllers/inventory.controllers.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.put("/restockProduct", verifyToken, restockProduct);
router.post("/checkLowStock", verifyToken, checkLowStock);
router.get("/getStockDetails", verifyToken, getStockDetails);

export default router;
