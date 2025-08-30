import express from "express";
import { getUserStats } from "../controllers/statsController.js";
import { verifyToken } from "../middlewares/authMiddleware.js"; // 👈 añade esto

const router = express.Router();

// Protege la ruta con verifyToken
router.get("/:userId", verifyToken, getUserStats);

export default router;
