import express from "express";
import { getTeacherDashboard } from "../controllers/dashboardController.js";
import { verifyToken } from "../middlewares/authMiddleware.js"; // Middleware para proteger la ruta

const router = express.Router();

router.get("/profesor", verifyToken, getTeacherDashboard); // Protegemos la ruta con el token

export default router;
