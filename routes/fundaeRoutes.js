import express from 'express';
import {
  postParticipante,
  getEnvios,
  getFundaeUsers,
  getUltimosEnvios,
  getUsuariosNuevos,
  getUsuariosFinalizados
} from "../controllers/fundaeController.js";

const router = express.Router();

router.post('/participante', postParticipante);
router.get('/envios', getEnvios); // Ya gestiona ?limit=5
router.get('/usuarios', getFundaeUsers);
router.get('/usuarios-nuevos', getUsuariosNuevos);
router.get('/usuarios-finalizados', getUsuariosFinalizados);
router.get('/envios/ultimos', getUltimosEnvios); // ← esta es la nueva

export default router;
