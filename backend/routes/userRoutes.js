import express from "express";
import { verifyToken } from "../services/authService.js";
import { upload } from "../services/cloudinaryService.js";
import * as userService from "../services/userService.js";

const router = express.Router();

router.post("/register",        upload.single("image"), userService.register);
router.post("/login",           userService.login);
router.post("/forgot-password", userService.forgotPassword);
router.post("/reset-password",  userService.resetPassword);
router.get("/me",               verifyToken, userService.getCurrentUser);
router.put("/update-profile",   upload.single("image"), verifyToken, userService.updateProfile);
router.delete("/delete-me",     verifyToken, userService.deleteMe);

export default router;
