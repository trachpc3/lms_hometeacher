import { Router } from "express";
import {
  login,
  loginGoogle,
  loginMeta,
  forgotPassword,
  resetPassword,
  register,
  refresh,
  logout,
} from "../controllers/authController.js";

const router = Router();

// 🔐 Login tradicional
router.post("/login", login);

// 🔐 Login con Google
router.post("/google", loginGoogle);

// 🔐 Login con Facebook (Meta)
router.post("/meta", loginMeta);

// 🔁 Refresh Access Token (usa cookie httpOnly)
router.post("/refresh", refresh);

// 🚪 Logout (borra cookie refresh)
router.post("/logout", logout);

// 🆘 Recuperar contraseña
router.post("/forgot-password", forgotPassword);

// 🔄 Resetear contraseña
router.post("/reset-password", resetPassword);

// 📝 Registro
router.post("/register", register);

export default router;
