import express from "express";
import { submitTestResult } from "../controllers/testnivelController.js";
import { getTestQuestions } from "../controllers/testnivelQuestionsController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/questions", getTestQuestions); // pública o privada según quieras
router.post("/submit", verifyToken, submitTestResult);

export default router;
