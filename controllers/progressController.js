import pool from "../models/db.js";

// ✅ Actualiza el progreso cuando el usuario completa una actividad
export const updateProgress = async (req, res) => {
    const requesterId   = req.userId;        // del token
    const requesterRole = req.userRole;
    const {
        usuario_id: bodyUserId,
        unidad_id,
        actividad_id,
        calificacion
    } = req.body;

    // Validaciones básicas
    if (!unidad_id || !actividad_id) {
        return res.status(400).json({ success: false, message: "Faltan parámetros obligatorios" });
    }

    // Validar permisos y decidir a qué usuario se aplica el progreso
    const targetUserId = bodyUserId || requesterId;
    const isStaff = ["administrador", "profesor", "gestion"].includes(requesterRole);
    const isOwn = targetUserId === requesterId;

    if (!isStaff && !isOwn) {
        return res.status(403).json({ success: false, message: "No autorizado para actualizar este progreso" });
    }

    try {
        console.log("📌 Actualizando progreso para usuario:", targetUserId);

        // Verificar si ya existe el progreso
        const [rows] = await pool.query(
            "SELECT id FROM avance_usuario WHERE usuario_id = ? AND unidad_id = ? AND actividad_id = ?",
            [targetUserId, unidad_id, actividad_id]
        );

        if (rows.length > 0) {
            await pool.query(
                "UPDATE avance_usuario SET completado = 1, calificacion = ?, fecha_completado = NOW() WHERE id = ?",
                [calificacion || 0, rows[0].id]
            );
            console.log("✅ Progreso actualizado");
        } else {
            await pool.query(
                "INSERT INTO avance_usuario (usuario_id, unidad_id, actividad_id, completado, calificacion, fecha_completado) VALUES (?, ?, ?, 1, ?, NOW())",
                [targetUserId, unidad_id, actividad_id, calificacion || 0]
            );
            console.log("✅ Nuevo progreso insertado");
        }

        res.json({ success: true, message: "Progreso actualizado correctamente" });
    } catch (error) {
        console.error("❌ Error en updateProgress:", error.sqlMessage || error);
        res.status(500).json({ success: false, message: error.sqlMessage || "Error en el servidor" });
    }
};


// ✅ Obtener el progreso de un usuario autenticado (con control de acceso)
export const getProgress = async (req, res) => {
    const requesterId   = req.userId;        // del token
    const requesterRole = req.userRole;
    const paramUserId   = Number(req.params.userId);

    if (!requesterId) return res.status(401).json({ message: "Token inválido o expirado" });
    if (!paramUserId)  return res.status(400).json({ message: "Falta el ID del usuario" });

    const isStaff = ["administrador", "profesor", "gestion"].includes(requesterRole);
    const isOwn   = requesterId === paramUserId;

    if (!isStaff && !isOwn) {
        return res.status(403).json({ message: "No autorizado para ver este progreso" });
    }

    try {
        console.log(`📌 Obteniendo progreso para usuario: ${paramUserId}`);

        const [rows] = await pool.query(
            `
            SELECT unidad_id, actividad_id, completado, calificacion, fecha_completado
            FROM avance_usuario
            WHERE usuario_id = ?
            `,
            [paramUserId]
        );

        res.json({ userId: paramUserId, progreso: rows });
    } catch (error) {
        console.error("❌ Error en getProgress:", error.sqlMessage || error);
        res.status(500).json({ message: error.sqlMessage || "Error en el servidor" });
    }
};

