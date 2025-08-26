import { Router } from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { getSituationById } from "../controllers/situationsController.js";

const router = Router();
router.get("/:id", verifyToken, getSituationById);
export default router;
