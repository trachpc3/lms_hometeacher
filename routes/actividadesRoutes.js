import express from "express";
import {
  getSpeakingActividadByUnidad,
  getProductiveSkillsActividadByUnidad,
  getProductiveSkillsPrompts, // ✅ nuevo import
} from "../controllers/actividadesController.js";

const router = express.Router();

// 🎯 Rutas por tipo de actividad
router.get("/unidad/:unitId/speaking", getSpeakingActividadByUnidad);
router.get("/unidad/:unitId/productiveSkills", getProductiveSkillsActividadByUnidad);

// ✅ Nueva ruta para obtener los textos (writing/speaking) de Productive Skills
router.get("/unidad/:unitId/productiveSkills/prompts", getProductiveSkillsPrompts);

export default router;
