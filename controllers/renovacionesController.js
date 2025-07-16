import pool from "../models/db.js";

// Obtener alumnos con matrícula próxima a vencer (15 días o menos)
export const getRenovaciones = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT id, nombre, email, telefono, estado_formacion, fecha_registro, fecha_baja 
            FROM usuarios
            WHERE estado_formacion = 'matriculado'
            AND fecha_baja <= DATE_ADD(CURDATE(), INTERVAL 15 DAY)
        `);

        console.log("📊 Alumnos próximos a vencer su matrícula:", rows); // 🔹 Verificar los datos
        res.json(rows);
    } catch (error) {
        console.error("❌ Error al obtener renovaciones:", error);
        res.status(500).json({ error: "Error al obtener alumnos para renovación" });
    }
};

// 🔹 Renovar matrícula de un alumno
export const renovarMatricula = async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await pool.query(`
            UPDATE usuarios 
            SET fecha_baja = DATE_ADD(fecha_baja, INTERVAL 1 YEAR) 
            WHERE id = ? AND estado_formacion = 'matriculado'
        `, [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Alumno no encontrado o no matriculado" });
        }

        res.json({ message: "Matrícula renovada exitosamente" });
    } catch (error) {
        console.error("❌ Error al renovar matrícula:", error);
        res.status(500).json({ error: "Error al renovar matrícula" });
    }
};
