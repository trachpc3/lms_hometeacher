import express from "express";
import {
  login,
  loginGoogle,
  loginMeta,
  forgotPassword,
  resetPassword,
  register
} from "../controllers/authController.js";

const router = express.Router();

// 🔐 Login tradicional
router.post("/login", login);

// 🔐 Login con Google
router.post("/google", loginGoogle);

// 🔐 Login con Facebook (Meta)
router.post("/meta", loginMeta);

// 🔐 Recuperar contraseña
router.post("/forgot-password", forgotPassword);

// 🔐 Resetear contraseña
router.post("/reset-password", resetPassword);

// 🔐 Rgistro de usuarios nuevos
router.post("/register", register);


export default router;
