import pool from "../models/db.js"; // conexión a la BD

// 🔎 Obtener situación por ID (usado en rutas como /api/situacion/5)
export const getSituationById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query("SELECT * FROM situations WHERE id = ?", [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "Situación no encontrada." });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error("❌ Error al obtener situación por ID:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// 📦 Obtener situación por unidad (si usás otra lógica de relación)
export const getSituationByUnit = async (req, res) => {
  const { unitId } = req.params;
  try {
    const [rows] = await pool.query("SELECT * FROM situations WHERE unidad_id = ?", [unitId]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "No se encontró la situación para esta unidad." });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error("❌ Error al obtener la situación por unidad:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
