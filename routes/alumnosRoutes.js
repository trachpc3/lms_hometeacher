import express from "express";
import {
  getAlumnos,
  addAlumno,
  updateAlumno,
  deleteAlumno,
  getAlumnosStats, // 👈 nuevo import
} from "../controllers/alumnosController.js";

const router = express.Router();

// Obtener todos los alumnos
router.get("/", getAlumnos);

// 📊 Obtener contadores globales
router.get("/stats", getAlumnosStats); // 👈 nueva ruta

// Agregar un nuevo alumno
router.post("/", addAlumno);

// Actualizar un alumno
router.put("/:id", updateAlumno);

// Eliminar un alumno
router.delete("/:id", deleteAlumno);

export default router;
