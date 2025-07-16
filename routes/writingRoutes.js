import express from "express";
import { correctWriting } from "../controllers/writingController.js";

const router = express.Router();

router.post("/correct-writing", correctWriting);

export default router;
