import pool from "../models/db.js"; // Asegúrate de importar la conexión a la BD

export const getSituationByUnit = async (req, res) => {
    const { unitId } = req.params;
    try {
        const [rows] = await pool.query("SELECT * FROM situations WHERE id = ?", [unitId]);
        if (rows.length === 0) {
            return res.status(404).json({ error: "No se encontró la situación para esta unidad." });
        }
        res.json(rows[0]);
    } catch (error) {
        console.error("Error al obtener la situación:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};
