import pool from "../models/db.js";

// Devuelve preguntas del test por nivel
export const getTestQuestions = async (req, res) => {
  const { level, cantidad = 5 } = req.query;

  if (!["A1", "A2", "B1", "B2"].includes(level)) {
    return res.status(400).json({ message: "Nivel no válido" });
  }

  try {
    const [rows] = await pool.query(
      `SELECT id, question, option_a, option_b, option_c, correct_option
       FROM testnivel_questions
       WHERE level = ?
       ORDER BY RAND()
       LIMIT ?`,
      [level, parseInt(cantidad, 10)]
    );

    res.json({ questions: rows });
  } catch (error) {
    console.error("💥 Error al obtener preguntas:", error);
    res.status(500).json({ message: "Error al obtener preguntas del test" });
  }
};
