import pool from "../models/db.js"; // Conexión a la BD

// Obtener vocabulario por unidad
export const getVocabularyByUnit = async (req, res) => {
  const { unidadId } = req.params;

  if (isNaN(unidadId)) {
    return res.status(400).json({ error: "El ID de la unidad debe ser un número válido" });
  }

  try {
    const [words] = await pool.query(
      "SELECT id, word, translation, audio_url FROM vocabulary WHERE unidad_id = ?", 
      [unidadId]
    );

    if (words.length === 0) {
      return res.status(404).json({ error: "No se encontró vocabulario para esta unidad" });
    }

    res.json(words); // ✅ Solo el array directamente
  } catch (error) {
    console.error("Error en la base de datos:", error);
    res.status(500).json({ error: "Error en el servidor al obtener vocabulario" });
  }
};
