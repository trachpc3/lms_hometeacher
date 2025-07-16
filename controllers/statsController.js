import pool from "../models/db.js";

// 📊 Obtener estadísticas del usuario
export const getUserStats = async (req, res) => {
    const { userId } = req.params;

    try {
        // 🔹 Tiempo total de conexión (desde el registro hasta ahora)
        const [user] = await pool.query("SELECT TIMESTAMPDIFF(HOUR, fecha_registro, NOW()) AS horas_conectado FROM usuarios WHERE id = ?", [userId]);

        // 🔹 Cantidad total de accesos
        const [logins] = await pool.query("SELECT COUNT(*) AS total_logins FROM logins WHERE usuario_id = ?", [userId]);

        // 🔹 Niveles completados
        const [niveles] = await pool.query("SELECT progreso_global FROM usuarios WHERE id = ?", [userId]);

        // 🔹 Unidades completadas
        const [unidades] = await pool.query("SELECT COUNT(*) AS unidades_completadas FROM avance_usuario WHERE usuario_id = ? AND completado = 1", [userId]);

        // 🔹 Gráfica de accesos por mes
        const [loginsPorMes] = await pool.query(`
            SELECT DATE_FORMAT(fecha, '%Y-%m') AS mes, COUNT(*) AS cantidad 
            FROM logins 
            WHERE usuario_id = ? 
            GROUP BY mes 
            ORDER BY mes ASC
        `, [userId]);

        // 🔹 Actividades completadas (de progreso_unidades)
const [actividades] = await pool.query(`
  SELECT COUNT(*) AS completadas 
  FROM progreso_unidades 
  WHERE usuario_id = ? AND completado = 1
`, [userId]);

const total_actividades = 144 * 8;


        res.json({
  success: true,
  horas_conectado: user[0]?.horas_conectado || 0,
  total_logins: logins[0]?.total_logins || 0,
  niveles_completados: niveles[0]?.progreso_global || 0,
  unidades_completadas: unidades[0]?.unidades_completadas || 0,
  logins_por_mes: loginsPorMes || [],
  actividades: {
    completadas: actividades[0]?.completadas || 0,
    total: total_actividades
  }
});

    } catch (error) {
        console.error("❌ Error obteniendo estadísticas:", error);
        res.status(500).json({ success: false, message: "Error en el servidor" });
    }
};
