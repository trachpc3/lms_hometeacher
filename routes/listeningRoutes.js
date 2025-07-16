// listeningRoutes.js
import express from "express";
import { getListeningQuestions } from "../controllers/listeningController.js";

const router = express.Router();

// Ruta base para comprobar que funciona el módulo
router.get("/", (req, res) => {
  res.json({ message: "Listening module ready 🎧" });
});

// Obtener preguntas de una unidad específica
router.get("/:unidadId", getListeningQuestions);

export default router;
