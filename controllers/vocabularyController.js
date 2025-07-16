import pool from "../models/db.js"; // Importa la conexión a la BD

// Obtener vocabulario por unidad
export const getVocabularyByUnit = async (req, res) => {
    const { unidadId } = req.params;

    // Verificar que unidadId sea un número válido
    if (isNaN(unidadId)) {
        return res.status(400).json({ success: false, error: "El ID de la unidad debe ser un número válido" });
    }

    try {
        const [words] = await pool.query(
            "SELECT id, word, translation, audio_url FROM vocabulary WHERE unidad_id = ?", 
            [unidadId]
        );
        
               // Verificar si hay vocabulario para la unidad
        if (words.length === 0) {
            return res.status(404).json({ success: false, message: "No se encontró vocabulario para esta unidad" });
        }

        res.json({ success: true, data: words });
    } catch (error) {
        console.error("Error en la base de datos:", error);
        res.status(500).json({ success: false, error: "Error en el servidor al obtener vocabulario" });
    }
};
