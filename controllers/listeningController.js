import pool from "../models/db.js";

export const getListeningQuestions = async (req, res) => {
  const { unidadId } = req.params;

  try {
    const [questions] = await pool.query(
      "SELECT * FROM listening_questions WHERE unidad_id = ?", 
      [unidadId]
    );

    // Si no hay preguntas, devolver un array vacío
    if (!Array.isArray(questions)) {
      return res.json([]);
    }

    // Agrega las opciones a cada pregunta
    for (const question of questions) {
      const [options] = await pool.query(
        "SELECT id, text, correct FROM listening_options WHERE question_id = ?", 
        [question.id]
      );
      question.options = Array.isArray(options) ? options : [];
    }

    res.json(questions);
  } catch (error) {
    console.error("❌ Error en getListeningQuestions:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};
