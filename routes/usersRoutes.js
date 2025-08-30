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

// Configuración de almacenamiento
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
router.post("/:id/photo", verifyToken, (req, res, next) => {
  upload.single("imagen")(req, res, (err) => {
    if (err) {
      console.error("❌ Error en multer:", err);
      return res.status(400).json({ message: "Error al procesar la imagen" });
    }

    const userId = req.params.id;

    if (!req.file) {
      return res.status(400).json({ message: "No se ha subido ningún archivo" });
    }

    const imageName = req.file.filename;

    db.query("UPDATE usuarios SET imagen = ? WHERE id = ?", [imageName, userId], (dbErr) => {
      if (dbErr) {
        console.error("❌ Error al guardar la imagen en la BD:", dbErr);
        return res.status(500).json({ message: "Error al guardar imagen" });
      }

      const publicUrl = `/uploads/avatars/${imageName}`;
      res.json({ imagen: imageName, url: publicUrl });
    });
  });
});

/**
 * PUT /api/users/:id/password (requiere token)
 */
router.put("/:id/password", verifyToken, async (req, res) => {
  const { nuevaPassword } = req.body;
  if (!nuevaPassword || nuevaPassword.length < 6) {
    return res.status(400).json({ message: "Contraseña demasiado corta" });
  }

  try {
    const hashedPassword = await bcrypt.hash(nuevaPassword, 10);
    db.query("UPDATE usuarios SET password = ? WHERE id = ?", [hashedPassword, req.params.id], (err) => {
      if (err) {
        console.error("❌ Error al actualizar contraseña:", err);
        return res.status(500).json({ message: "Error al actualizar contraseña" });
      }

      res.json({ message: "Contraseña actualizada correctamente" });
    });
  } catch (error) {
    console.error("❌ Error hash contraseña:", error);
    res.status(500).json({ message: "Error interno" });
  }
});

export default router;
