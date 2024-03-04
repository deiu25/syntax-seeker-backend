import express from "express";
const router = express.Router();

import {
  protect,
  adminOnly,
  authorOnly,
} from "../middleware/authMiddleware.js";

import {
  registerUser, loginUser, logoutUser, getUser, updateUser, deleteUser, getUsers,
  loginStatus, upgradeUser, sendAutomatedEmail, sendVerificationEmail,
  verifyUser, forgotPassword, resetPassword, changePassword, sendLoginCode, 
  loginWithCode, loginWithGoogle, changeUserTheme,
} from "../controllers/userController.js";

import upload from "../utils/cloudinaryConfig.js";

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", logoutUser);
router.get("/getUser", protect, getUser);
router.patch("/updateUser", protect, upload.single('photo'), updateUser);

router.delete("/:id", protect, adminOnly, deleteUser);
router.get("/getUsers", protect, authorOnly, getUsers);
router.get("/loginStatus", loginStatus);
router.post("/upgradeUser", protect, adminOnly, upgradeUser);
router.post("/sendAutomatedEmail", protect, sendAutomatedEmail);

router.post("/sendVerificationEmail", protect, sendVerificationEmail);
router.patch("/verifyUser/:verificationToken", verifyUser);
router.post("/forgotPassword", forgotPassword);
router.patch("/resetPassword/:resetToken", resetPassword);
router.patch("/changePassword", protect, changePassword);

router.post("/sendLoginCode/:email", sendLoginCode);
router.post("/loginWithCode/:email", loginWithCode);

router.post("/google/callback", loginWithGoogle);

router.put("/updateTheme", protect, changeUserTheme);

export default router;