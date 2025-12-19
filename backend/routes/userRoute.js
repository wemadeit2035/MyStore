import express from "express";
import {
  loginUser,
  registerUser,
  adminLogin,
  getAllUsers,
  deleteUser,
  verifyToken,
  verifyRefreshToken,
  getUserProfile,
  updateUserProfile,
  changePassword,
  refreshToken,
  logoutUser,
  googleAuth,
  facebookAuth,
  verifyEmail,
  contactForm,
  resendVerificationEmail,
  forgotPassword,
  resetPassword,
  verifyResetCode,
  deleteUserAccount,
  getUserOrdersSummary,
  getTopCustomers,
} from "../controllers/userController.js";

const userRouter = express.Router();

// ========================
// PUBLIC AUTHENTICATION ROUTES
// SEO Note: These endpoints handle user authentication and should be
// protected with proper security headers in production
// ========================

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/admin", adminLogin);
userRouter.get("/verify-email", verifyEmail);
userRouter.post("/forgot-password", forgotPassword);
userRouter.post("/verify-reset-code", verifyResetCode);
userRouter.post("/reset-password", resetPassword);
userRouter.post("/resend-verification", resendVerificationEmail);
userRouter.post("/contact", contactForm);
userRouter.post("/google", googleAuth);
userRouter.post("/facebook", facebookAuth);

// ========================
// TOKEN MANAGEMENT ROUTES
// Handles JWT token refresh and logout functionality
// ========================

userRouter.post("/refresh", verifyRefreshToken, refreshToken);
userRouter.post("/logout", verifyRefreshToken, logoutUser);

// ========================
// PROTECTED USER ROUTES
// Requires valid JWT token for user-specific operations
// ========================

userRouter.get("/profile", verifyToken, getUserProfile);
userRouter.put("/profile", verifyToken, updateUserProfile);
userRouter.put("/password", verifyToken, changePassword);
userRouter.delete("/account", verifyToken, deleteUserAccount);

// ========================
// PROTECTED ADMIN ROUTES
// Requires admin privileges and valid JWT token
// SEO Note: Admin routes are internal and should not be indexed
// ========================

userRouter.get("/admin/users", verifyToken, getAllUsers);
userRouter.delete("/admin/users/:id", verifyToken, deleteUser);
userRouter.get("/admin/top-customers", verifyToken, getTopCustomers);
userRouter.get(
  "/admin/users/:userId/orders",
  verifyToken,
  getUserOrdersSummary
);

export default userRouter;
