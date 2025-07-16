import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import bcrypt from "bcrypt";
import db from "../models/db.js";
import { fileURLToPath } from "url";
import { dirname } from "path";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuración de almacenamiento
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, "../public/uploads");
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
 * Subida de imagen de perfil
 */
router.post("/:id/photo", upload.single("imagen"), (req, res) => {
  const userId = req.params.id;

  if (!req.file) {
    return res.status(400).json({ message: "No se ha subido ningún archivo" });
  }

  const imageName = req.file.filename;

  db.query("UPDATE usuarios SET imagen = ? WHERE id = ?", [imageName, userId], (err) => {
    if (err) {
      console.error("❌ Error al guardar la imagen:", err);
      return res.status(500).json({ message: "Error al guardar imagen" });
    }

    const publicUrl = `/uploads/${imageName}`;
    res.json({ imagen: imageName, url: publicUrl });
  });
});


/**
 * PUT /api/users/:id/password
 * Actualización de contraseña
 */
router.put("/:id/password", async (req, res) => {
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
