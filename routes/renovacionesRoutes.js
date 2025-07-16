import express from "express";
import { getRenovaciones, renovarMatricula } from "../controllers/renovacionesController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";


const router = express.Router();

router.get("/", verifyToken, getRenovaciones);
router.post("/:id", verifyToken, renovarMatricula);


export default router;
