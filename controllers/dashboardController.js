import pool from "../models/db.js"; // Conexión a la base de datos

export const getTeacherDashboard = async (req, res) => {
    try {
        const profesorId = req.user.id; // Obtenemos el ID del profesor desde el token

        // Contar alumnos asignados a este profesor
        const [alumnos] = await pool.query(
            "SELECT COUNT(*) AS total FROM matriculas WHERE profesor_id = ?", 
            [profesorId]
        );

        // Contar actividades pendientes de revisión (esto puede variar según tu lógica)
        const [actividades] = await pool.query(
            "SELECT COUNT(*) AS total FROM avance_usuario au " +
            "JOIN actividades a ON au.actividad_id = a.id " +
            "JOIN unidades u ON a.unidad_id = u.id " +
            "WHERE au.completado = 0 AND u.nivel_id IN " +
            "(SELECT nivel_id FROM matriculas WHERE profesor_id = ?)", 
            [profesorId]
        );

        // Calcular progreso promedio de los alumnos
        const [progreso] = await pool.query(
            "SELECT AVG(progreso_global) AS promedio FROM usuarios " +
            "WHERE id IN (SELECT alumno_id FROM matriculas WHERE profesor_id = ?)", 
            [profesorId]
        );

        res.json({
            alumnos: alumnos[0].total || 0,
            actividades: actividades[0].total || 0,
            progreso: progreso[0].promedio ? Math.round(progreso[0].promedio) : 0,
        });

    } catch (error) {
        console.error("💥 Error en getTeacherDashboard:", error);
        res.status(500).json({ message: "Error al obtener datos del dashboard" });
    }
};
