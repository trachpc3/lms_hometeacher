import express from "express";
import { getGrammarByUnit } from "../controllers/grammarController.js";

const router = express.Router();

router.get("/:unidadId", getGrammarByUnit);

export default router;
