import express from "express";
import { updateProgress, getProgress } from "../controllers/progressController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Ruta para actualizar el progreso de una unidad
router.post("/update", verifyToken, updateProgress);

// Ruta para obtener el progreso de un usuario (protegida)
router.get("/:userId", verifyToken, getProgress);

export default router;

