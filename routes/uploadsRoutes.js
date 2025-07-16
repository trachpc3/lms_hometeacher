import express from "express";
import { serveUploads } from "../middlewares/serveUploads.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/audio/:folder/:filename", verifyToken, serveUploads);

export default router;
