// routes/profesoresRoutes.js
import express from "express";
import { getProfesores } from "../controllers/profesoresController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", verifyToken, getProfesores);

export default router;
