import db from "./db.js";

export const getSentencesByUnitAndActivity = async (unidadId, actividadId) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM sentences WHERE unidad_id = ? AND actividad_id = ?",
      [unidadId, actividadId]
    );
    return rows;
  } catch (error) {
    throw new Error("Error fetching sentences: " + error.message);
  }
};
