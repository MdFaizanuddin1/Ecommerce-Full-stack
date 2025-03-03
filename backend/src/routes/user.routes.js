import { Router } from "express";
import {
  changePass,
  getAllUsers,
  getUser,
  logOut,
  logInUser,
  registerUser,
  refreshAccessToken,
} from "../controllers/user.controllers.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(logInUser);
router.route("/refreshToken", refreshAccessToken);
router.route("/getAllUsers").get(getAllUsers);

//------------- secure routes

router.route("/getUser").get(verifyToken, getUser);
router.route("/logout").get(verifyToken, logOut);
router.route("/changePass").post(verifyToken, changePass);

export default router;
