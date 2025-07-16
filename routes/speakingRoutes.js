import express from 'express';
import { getSpeakingByActividad } from '../controllers/speakingController.js';

const router = express.Router();

router.get('/:actividadId', getSpeakingByActividad);

export default router;
