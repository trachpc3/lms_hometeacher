// src/models/fundaeModel.js
import pool from './db.js'; // Asegúrate que este import apunta a tu conexión MySQL

export const guardarEnvioFundae = async (datos, respuesta) => {
  const sql = `
    INSERT INTO fundae_envios (nombre, dni, curso_id, respuesta)
    VALUES (?, ?, ?, ?)
  `;

  try {
    const [result] = await pool.query(sql, [
      datos.nombre,
      datos.dni,
      datos.cursoId,
      JSON.stringify(respuesta),
    ]);

    return result.insertId;
  } catch (error) {
    console.error("❌ Error guardando en fundae_envios:", error.message);
    throw error;
  }
};

export const listarEnviosFundae = async () => {
  try {
    const [rows] = await pool.query('SELECT * FROM fundae_envios ORDER BY id DESC');
    return rows;
  } catch (error) {
    console.error("❌ Error en listarEnviosFundae:", error.message);
    throw error;
  }
};


export const listarEnviosFundaeLimit = async (limit) => {
  const [rows] = await pool.query(`
    SELECT id, estado, fecha
    FROM fundae_envios
    ORDER BY fecha DESC
    LIMIT ?
  `, [limit]);
  return rows;
};
