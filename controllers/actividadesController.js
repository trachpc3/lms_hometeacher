import pool from "../models/db.js";

export const getSpeakingActividadByUnidad = async (req, res) => {
  const { unitId } = req.params;
  try {
    const [rows] = await pool.query(
      "SELECT id, tipo, descripcion AS titulo FROM actividades WHERE unidad_id = ? AND tipo = 'Speaking' LIMIT 1",
      [unitId]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: "No se encontró actividad Speaking para esta unidad" });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error("❌ Error al obtener actividad Speaking:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const getProductiveSkillsActividadByUnidad = async (req, res) => {
  const { unitId } = req.params;

  try {
    const [rows] = await db.query(
      "SELECT * FROM actividades WHERE unidad_id = ? AND tipo = 'ProductiveSkills' LIMIT 1",
      [unitId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Actividad ProductiveSkills no encontrada." });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("❌ Error al obtener ProductiveSkills:", error.message);
    res.status(500).json({ error: "Error del servidor al buscar ProductiveSkills." });
  }
};

export const getProductiveSkillsPrompts = async (req, res) => {
  const { unitId } = req.params;
  try {
    const [rows] = await db.query(
      "SELECT tipo, descripcion FROM productive_skills WHERE unidad_id = ?",
      [unitId]
    );

    const prompts = rows.reduce((acc, curr) => {
      acc[curr.tipo] = curr.descripcion;
      return acc;
    }, {});

    res.json(prompts);
  } catch (error) {
    console.error("❌ Error al obtener prompts ProductiveSkills:", error);
    res.status(500).json({ error: "Error del servidor al obtener los prompts." });
  }
};
