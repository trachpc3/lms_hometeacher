import express from "express";
import { updateProgress, getProgress } from "../controllers/progressController.js";

const router = express.Router();

// Ruta para actualizar el progreso de una unidad
router.post("/update", updateProgress);

// Ruta para obtener el progreso de un usuario
router.get("/:userId", getProgress);

export default router;
