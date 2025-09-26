// routes/authRoutes.js
import express from "express";
import {
  login,
  loginGoogle,
  loginMeta,
  refresh,
  logout,
  forgotPassword,
  resetPassword,
  register,
} from "../controllers/authController.js";

const router = express.Router();

// === AUTENTICACIÓN ===
router.post("/login", login);
router.post("/google", loginGoogle);
router.post("/meta", loginMeta);
router.post("/register", register);

// === REFRESH & LOGOUT ===
router.post("/refresh", refresh);
router.post("/logout", logout);

// === RECUPERACIÓN DE CONTRASEÑA ===
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;
