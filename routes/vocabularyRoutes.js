import express from "express";
import { getVocabularyByUnit } from "../controllers/vocabularyController.js";

const router = express.Router();

/**
 * @route   GET /api/vocabulary/:unidadId
 * @desc    Obtener vocabulario por unidad
 * @access  Público
 */
router.get("/:unidadId", getVocabularyByUnit);

export default router;
