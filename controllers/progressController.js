import pool from "../models/db.js";

// ✅ Actualiza el progreso cuando el usuario completa una actividad
export const updateProgress = async (req, res) => {
    const { usuario_id, unidad_id, actividad_id, calificacion } = req.body;

    // Verificar que los parámetros requeridos estén presentes
    if (!usuario_id || !unidad_id || !actividad_id) {
        return res.status(400).json({ success: false, message: "Faltan parámetros obligatorios" });
    }

    try {
        console.log("📌 Recibiendo datos:", req.body);

        // Verificar si el usuario ya tiene progreso en esta actividad
        const [rows] = await pool.query(
            "SELECT id FROM avance_usuario WHERE usuario_id = ? AND unidad_id = ? AND actividad_id = ?",
            [usuario_id, unidad_id, actividad_id]
        );

        if (rows.length > 0) {
            // Si ya existe, actualizarlo
            await pool.query(
                "UPDATE avance_usuario SET completado = 1, calificacion = ?, fecha_completado = NOW() WHERE id = ?",
                [calificacion || 0, rows[0].id] // Si calificación no viene, se guarda como 0
            );
            console.log("✅ Progreso actualizado en avance_usuario");
        } else {
            // Si no existe, insertar un nuevo registro
            await pool.query(
                "INSERT INTO avance_usuario (usuario_id, unidad_id, actividad_id, completado, calificacion, fecha_completado) VALUES (?, ?, ?, 1, ?, NOW())",
                [usuario_id, unidad_id, actividad_id, calificacion || 0]
            );
            console.log("✅ Nuevo progreso insertado en avance_usuario");
        }

        res.json({ success: true, message: "Progreso actualizado correctamente" });
    } catch (error) {
        console.error("❌ Error en updateProgress:", error.sqlMessage || error);
        res.status(500).json({ success: false, message: error.sqlMessage || "Error en el servidor" });
    }
};

// ✅ Obtener el progreso de un usuario
export const getProgress = async (req, res) => {
    const { userId } = req.params;

    if (!userId) {
        return res.status(400).json({ success: false, message: "Falta el ID del usuario" });
    }

    try {
        console.log(`📌 Obteniendo progreso para usuario: ${userId}`);

        const [rows] = await pool.query(
            "SELECT unidad_id, actividad_id, completado, calificacion, fecha_completado FROM avance_usuario WHERE usuario_id = ?",
            [userId]
        );

        res.json(rows);
    } catch (error) {
        console.error("❌ Error en getProgress:", error.sqlMessage || error);
        res.status(500).json({ success: false, message: error.sqlMessage || "Error en el servidor" });
    }
};
