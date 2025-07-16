import express from "express";
import { getListeningQuestions } from "../controllers/listeningController.js";

const router = express.Router();

// Obtener preguntas de una unidad específica
router.get("/:unidadId", getListeningQuestions);

export default router;
