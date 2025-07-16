import pool from "../models/db.js";

export const getGrammarByUnit = async (req, res) => {
    try {
        const { unidadId } = req.params;
        const [rows] = await pool.query("SELECT * FROM grammar WHERE unidad_id = ?", [unidadId]);

        if (rows.length === 0) {
            return res.status(404).json({ message: "No se encontró la gramática para esta unidad" });
        }

        res.json(rows[0]);
    } catch (error) {
        console.error("Error obteniendo la gramática:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};
