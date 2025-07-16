import pool from "./db.js";

/**
 * Obtiene los últimos usuarios registrados con rol 'estudiante'
 */
export const listarUsuariosNuevos = async (limit = 5) => {
  const [rows] = await pool.query(
    `SELECT id, nombre, estado_formacion, fecha_registro, fecha_baja
     FROM usuarios
     WHERE rol = 'estudiante'
     ORDER BY fecha_registro DESC
     LIMIT ?`,
    [limit]
  );
  return rows;
};

/**
 * Lista los usuarios con formación completada
 */
export const listarUsuariosFinalizados = async () => {
  const [rows] = await pool.query(
    `SELECT id, nombre, email, fecha_baja
     FROM usuarios
     WHERE estado_formacion = 'completado'
     ORDER BY fecha_baja DESC`
  );
  return rows;
};
