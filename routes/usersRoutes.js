import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import bcrypt from "bcrypt";
import db from "../models/db.js";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuración de almacenamiento para fotos de perfil
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, "../public/uploads/avatars");
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `user_${req.params.id}${ext}`);
  },
});
const upload = multer({ storage });

/**
 * POST /api/users/:id/photo
 * Subida de imagen de perfil (requiere token)
 */
router.post("/:id/photo", verifyToken, (req, res) => {
  upload.single("imagen")(req, res, (err) => {
    if (err) {
      console.error("❌ Error en multer:", err);
      return res.status(400).json({ message: "Error al procesar la imagen" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No se ha subido ningún archivo" });
    }

    const userId = req.params.id;
    const imageName = req.file.filename;

    db.query(
      "UPDATE usuarios SET imagen = ? WHERE id = ?",
      [imageName, userId],
      (dbErr) => {
        if (dbErr) {
          console.error("❌ Error al guardar la imagen en la BD:", dbErr);
          return res.status(500).json({ message: "Error al guardar imagen" });
        }

        const publicUrl = `/uploads/avatars/${imageName}`;
        res.json({ imagen: imageName, url: publicUrl });
      }
    );
  });
});

/**
 * PUT /api/users/:id/password
 * Cambiar contraseña (requiere token)
 */
router.put("/:id/password", verifyToken, async (req, res) => {
  const { nuevaPassword } = req.body;

  if (!nuevaPassword || nuevaPassword.length < 6) {
    return res.status(400).json({ message: "Contraseña demasiado corta" });
  }

  try {
    const hashedPassword = await bcrypt.hash(nuevaPassword, 10);
    db.query(
      "UPDATE usuarios SET password = ? WHERE id = ?",
      [hashedPassword, req.params.id],
      (err) => {
        if (err) {
          console.error("❌ Error al actualizar contraseña:", err);
          return res.status(500).json({ message: "Error al actualizar contraseña" });
        }

        res.json({ message: "Contraseña actualizada correctamente" });
      }
    );
  } catch (error) {
    console.error("❌ Error hash contraseña:", error);
    res.status(500).json({ message: "Error interno" });
  }
});

/**
 * GET /api/users/:id
 * Obtener datos del usuario (requiere token)
 */
router.get("/:id", verifyToken, (req, res) => {
  const userId = req.params.id;
  console.log(`🔍 Buscando usuario con ID: ${userId}`);
  console.time("⏱️ Consulta usuario");

  db.query(
    `SELECT 
        id, 
        nombre, 
        apellidos,
        email, 
        imagen, 
        curso_matriculado AS curso, 
        profesor_asignado AS profesor, 
        telefono AS movil, 
        estado_formacion, 
        fecha_registro
     FROM usuarios 
     WHERE id = ?`,
    [userId],
    (err, results) => {
      console.timeEnd("⏱️ Consulta usuario");

      if (err) {
        console.error("❌ Error al obtener usuario:", err);
        return res.status(500).json({ message: "Error al obtener datos del usuario" });
      }

      if (!results.length) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      console.log("✅ Usuario encontrado:", results[0]);
      res.json(results[0]);
    }
  );
});

export default router;
