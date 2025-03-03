import { Router } from "express";
import {
  addAddress,
  checkUserHasAddress,
  deleteAddress,
  editSingleAddress,
  getAddress,
  getDeletedAddresses,
  getSingleAddress,
  restoreAddress,
} from "../controllers/address.controllers.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/add").post(verifyToken, addAddress);
router.route("/get").get(verifyToken, getAddress);
router.route("/getSingle/:addressId").get(verifyToken, getSingleAddress);
router.route("/edit/:addressId").post(verifyToken, editSingleAddress);
router.route("/delete/:addressId").delete(verifyToken, deleteAddress);
router.route("/hasAddress").get(verifyToken, checkUserHasAddress);
router.route("/restore/:addressId").patch(verifyToken, restoreAddress);
router.route("/getDeletedAddresses").get(verifyToken, getDeletedAddresses);

export default router;
