import pool from "../models/db.js";

export const getSpeakingByActividad = async (req, res) => {
  const { actividadId } = req.params;

  try {
    const [dialogue] = await pool.query(
      `SELECT * FROM speaking_dialogues WHERE actividad_id = ?`,
      [actividadId]
    );

    if (!dialogue.length) {
      return res.status(404).json({ message: "No se encontró el diálogo" });
    }

    const [lines] = await pool.query(
      `SELECT speaker, texto, audio_url, line_order FROM speaking_lines WHERE dialogue_id = ? ORDER BY line_order ASC`,
      [dialogue[0].id]
    );

    // Aseguramos que solo enviamos el nombre del archivo, sin rutas raras
    const cleanedLines = lines.map((line) => ({
      ...line,
      audio_url: line.audio_url?.split("/").pop() || null, // solo el nombre del archivo
    }));

    res.json({
      ...dialogue[0],
      lines: cleanedLines,
    });
  } catch (error) {
    console.error("[GET /speaking/:actividadId]:", error);
    res.status(500).json({ message: "Error al obtener el diálogo" });
  }
};
