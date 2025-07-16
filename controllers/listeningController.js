import pool from "../models/db.js"; // Asegúrate de que tienes la conexión a MySQL

export const getListeningQuestions = async (req, res) => {
    const { unidadId } = req.params;

    try {
        const [questions] = await pool.query(
            "SELECT * FROM listening_questions WHERE unidad_id = ?", 
            [unidadId]
        );

        for (const question of questions) {
            const [options] = await pool.query(
                "SELECT id, text, correct FROM listening_options WHERE question_id = ?", 
                [question.id]
            );
            question.options = options;
        }

        res.json(questions);
    } catch (error) {
        console.error("Error al obtener preguntas de Listening:", error);
        res.status(500).json({ error: "Error en el servidor" });
    }
};
