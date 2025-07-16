import express from "express";
import { getSentencesByUnit } from "../controllers/sentencesController.js";

const router = express.Router();

// La ruta correcta debe ser `/:unidadId` en lugar de `/sentences/:unidadId`
router.get("/:unidadId", getSentencesByUnit);

export default router;
