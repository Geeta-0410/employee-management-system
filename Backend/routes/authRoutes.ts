import { Router } from "express";
import {signup,login, logout, getCurrentUser, getUsers, verifyOTP, resendOTP, uploadProfileImage, googleLogin, changeEmployeePassword,} from "../controllers/authController";
import { verifyFirebaseToken } from "../middleware/verifyFirebaseToken";
import { verifyAuth } from "../middleware/authMiddleware";
import upload from "../middleware/upload";
import { employeeLogin } from "../controllers/authController";

const router = Router();

router.post("/signup", signup);
router.post("/verify-otp", verifyOTP);
router.post("/resend-otp", resendOTP);
router.post("/login", login);
router.post("/employee-login", employeeLogin);
router.post("/employee/change-password",verifyAuth,changeEmployeePassword);
router.post("/google",verifyFirebaseToken,googleLogin);
router.post("/logout",verifyAuth, logout);
router.get("/me", verifyAuth, getCurrentUser);
router.post( "/upload-profile",verifyAuth,upload.single("image"), uploadProfileImage);
router.get("/users", verifyAuth, getUsers);

export default router;