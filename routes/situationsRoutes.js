import express from "express";
import { getSituationByUnit } from "../controllers/situationsController.js";

const router = express.Router();

router.get("/:unitId", getSituationByUnit);

export default router;
