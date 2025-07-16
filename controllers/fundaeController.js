import pool from "../models/db.js";
import { enviarParticipante } from "../integrations/fundae/fundaeClient.js";
import { guardarEnvioFundae} from "../models/fundaeModel.js";
import {
  listarUsuariosNuevos,
  listarUsuariosFinalizados
} from '../models/usuarioModel.js';

export const postParticipante = async (req, res) => {
  try {
    const datos = req.body;
    if (!datos?.nombre || !datos?.dni || !datos?.cursoId) {
      return res.status(400).json({ success: false, message: 'Faltan datos obligatorios' });
    }

    const respuestaFundae = await enviarParticipante(datos);
    const envioId = await guardarEnvioFundae(datos, respuestaFundae);

    console.log(`Envio FUNDAE guardado con ID ${envioId}`);

    return res.status(200).json({
      success: true,
      message: 'Participante enviado correctamente a FUNDAE',
      data: respuestaFundae,
      envioId,
    });
  } catch (error) {
    console.error('❌ Error desde el controller FUNDAE:', error.message);
    return res.status(500).json({ success: false, message: 'Error enviando a FUNDAE' });
  }
};

export const getEnvios = async (req, res) => {
  try {
    const { limit } = req.query;

    const query = limit
      ? 'SELECT * FROM fundae_envios  ORDER BY created_at DESC LIMIT ?'
      : 'SELECT * FROM fundae_envios ORDER BY created_at DESC';

    const [rows] = limit
      ? await pool.query(query, [parseInt(limit)])
      : await pool.query(query);

    return res.status(200).json({ success: true, data: rows });
  } catch (error) {
    console.error('❌ Error al listar envíos FUNDAE:', error.message);
    return res.status(500).json({ success: false, message: 'Error obteniendo envíos' });
  }
};


export const getFundaeUsers = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT id, nombre, email, telefono, estado, fecha_registro
      FROM usuarios
      WHERE rol = 'fundae'
    `);
    return res.status(200).json({ success: true, data: rows });
  } catch (error) {
    console.error("❌ Error al obtener usuarios FUNDAE:", error.message);
    return res.status(500).json({ success: false, message: "Error del servidor" });
  }
};

export const getUsuariosNuevos = async (req, res) => {
  try {
    const usuarios = await listarUsuariosNuevos(5);
    res.json({ success: true, data: usuarios });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error obteniendo usuarios nuevos' });
  }
};

export const getUsuariosFinalizados = async (req, res) => {
  try {
    const usuarios = await listarUsuariosFinalizados();
    res.json({ success: true, data: usuarios });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error obteniendo usuarios finalizados' });
  }
};

export const getUltimosEnvios = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const envios = await listarEnviosFundaeLimit(limit);
    return res.status(200).json({ success: true, data: envios });
  } catch (error) {
    console.error("❌ Error en getUltimosEnvios:", error.message);
    return res.status(500).json({ success: false, message: "Error obteniendo últimos envíos" });
  }
};
