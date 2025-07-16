import express from "express";
import {
  getUnidadesConProgreso,
  getUnidadById,
} from "../controllers/unidadesController.js";

import { verifyToken } from "../middlewares/authMiddleware.js"; // ✅ Importa el middleware

const router = express.Router();

// ✅ Ruta protegida para que req.user esté disponible
router.get("/", verifyToken, getUnidadesConProgreso);

// ✅ También protegemos esta si necesitas saber quién accede a la unidad específica
router.get("/:unitId", verifyToken, getUnidadById);

export default router;
