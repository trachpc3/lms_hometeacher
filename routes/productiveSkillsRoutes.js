import express from "express";
import { correctProductiveWriting } from "../controllers/productiveSkillsController.js";

const router = express.Router();

// Endpoint para corrección escrita de la actividad Productive Skills
router.post("/correct-writing", correctProductiveWriting);

export default router;
