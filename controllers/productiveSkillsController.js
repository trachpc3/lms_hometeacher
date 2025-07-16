import axios from "axios";
import dotenv from "dotenv";
import db from "../models/db.js"; // Asegurate de tener conexión a MySQL

dotenv.config();

const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

// ✅ Corrección de la parte escrita
export const correctProductiveWriting = async (req, res) => {
  const { text, userId, actividadId, unidadId } = req.body;

  if (!text) {
    return res.status(400).json({ error: "El texto no puede estar vacío." });
  }

  try {
    const response = await axios.post(
      OPENAI_API_URL,
      {
        model: "gpt-3.5-turbo-16k",
        messages: [
          {
            role: "system",
            content:
              "Actúa como profesor nativo. Corrige el siguiente texto en inglés, mejorando gramática, ortografía y fluidez. Mantén el significado original y proporciona sugerencias al final si es necesario.",
          },
          { role: "user", content: text },
        ],
        temperature: 0.5,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const correctedText = response.data.choices[0].message.content;

    // 📌 Registrar avance (si aplica)
    if (userId && actividadId && unidadId) {
      await db.query(
        "INSERT INTO avance_usuario (usuario_id, unidad_id, actividad_id, completado, fecha_completado) VALUES (?, ?, ?, 1, NOW()) ON DUPLICATE KEY UPDATE completado=1, fecha_completado=NOW()",
        [userId, unidadId, actividadId]
      );
    }

    res.json({ correctedText });
  } catch (error) {
    console.error("❌ Error al corregir el texto:", error.message);
    res.status(500).json({ error: "Error del servidor al procesar la corrección." });
  }
};

