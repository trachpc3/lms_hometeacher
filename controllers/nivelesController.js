// controllers/nivelesController.js
import pool from "../models/db.js";

export const getNiveles = async (_req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, nombre FROM niveles ORDER BY id ASC"
    );
    return res.json(rows);
  } catch (err) {
    console.error("💥 Error obteniendo niveles:", err);
    return res.status(500).json({ message: "Error obteniendo niveles" });
  }
};
