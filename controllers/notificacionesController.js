// controllers/notificacionesController.js
import pool from "../models/db.js";

const normRole = (r) => {
  if (!r) return null;
  r = String(r).toLowerCase();
  if (r === "admin" || r === "administrador") return "profesor";
  if (r === "alumno") return "estudiante";
  return r;
};

// GET /api/notificaciones
export const listMyNotifications = async (req, res) => {
  const userId = req.userId;
  try {
    const [rows] = await pool.query(
      `SELECT nr.id,
              n.id AS notificationId,
              n.titulo, n.cuerpo, n.tipo, n.link_url AS linkUrl,
              n.metadata, n.priority,
              nr.read_at AS readAt,
              n.created_at AS createdAt
       FROM notification_recipients nr
       JOIN notifications n ON n.id = nr.notification_id
       WHERE nr.user_id = ?
       ORDER BY (nr.read_at IS NULL) DESC, n.created_at DESC`,
      [userId]
    );
    res.json({ notificaciones: rows });
  } catch (e) {
    console.error("💥 listMyNotifications", e);
    res.status(500).json({ message: "Error al listar notificaciones" });
  }
};

// GET /api/notificaciones/unread-count
export const unreadCount = async (req, res) => {
  const userId = req.userId;
  try {
    const [[row]] = await pool.query(
      `SELECT COUNT(*) AS unread
       FROM notification_recipients
       WHERE user_id = ? AND read_at IS NULL`,
      [userId]
    );
    res.json({ unread: Number(row?.unread || 0) });
  } catch (e) {
    console.error("💥 unreadCount", e);
    res.status(500).json({ message: "Error al contar no leídas" });
  }
};

// POST /api/notificaciones/:recipientRowId/read
export const markRead = async (req, res) => {
  const userId = req.userId;
  const { recipientRowId } = req.params;
  try {
    const [r] = await pool.query(
      `UPDATE notification_recipients
       SET read_at = NOW()
       WHERE id = ? AND user_id = ? AND read_at IS NULL`,
      [recipientRowId, userId]
    );
    res.json({ ok: true, updated: r.affectedRows });
  } catch (e) {
    console.error("💥 markRead", e);
    res.status(500).json({ message: "Error al marcar como leída" });
  }
};

// POST /api/notificaciones  (profesor crea y envía a lista de user_ids)
export const createAndSend = async (req, res) => {
  const role = normRole(req.userRole);
  if (role !== "profesor") {
    return res.status(403).json({ message: "Sólo profesores pueden crear avisos masivos." });
  }

  const { titulo, cuerpo, tipo = "aviso", linkUrl = null, metadata = null, recipients = [] } = req.body || {};
  if (!titulo || !cuerpo || !Array.isArray(recipients) || recipients.length === 0) {
    return res.status(400).json({ message: "Datos incompletos o sin destinatarios" });
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [insN] = await conn.query(
      `INSERT INTO notifications (titulo, cuerpo, tipo, link_url, metadata)
       VALUES (?, ?, ?, ?, ?)`,
      [titulo, cuerpo, tipo, linkUrl, metadata ? JSON.stringify(metadata) : null]
    );
    const notifId = insN.insertId;

    const values = recipients.map(uid => [notifId, Number(uid)]);
    await conn.query(
      `INSERT INTO notification_recipients (notification_id, user_id)
       VALUES ?`,
      [values]
    );

    await conn.commit(); conn.release();
    res.status(201).json({ id: notifId, recipients: recipients.length });
  } catch (e) {
    console.error("💥 createAndSend", e);
    await conn.rollback(); conn.release();
    res.status(500).json({ message: "Error al crear o enviar la notificación" });
  }
};

// POST /api/notificaciones/broadcast/mis-alumnos
export const broadcastToMyStudents = async (req, res) => {
  const profId = req.userId;
  const role = normRole(req.userRole);
  if (role !== "profesor") {
    return res.status(403).json({ message: "Sólo profesores pueden hacer broadcast a sus alumnos." });
  }

  const { titulo, cuerpo, tipo = "aviso", linkUrl = null, metadata = null } = req.body || {};
  if (!titulo || !cuerpo) {
    return res.status(400).json({ message: "titulo y cuerpo son obligatorios" });
  }

  const conn = await pool.getConnection();
  try {
    const [alumnos] = await conn.query(
      `SELECT id FROM usuarios
       WHERE rol IN ('estudiante','alumno') AND profesor_asignado = ? AND estado <> 'inactivo'`,
      [profId]
    );
    if (alumnos.length === 0) {
      conn.release();
      return res.status(400).json({ message: "No tienes alumnos asignados." });
    }

    await conn.beginTransaction();

    const [insN] = await conn.query(
      `INSERT INTO notifications (titulo, cuerpo, tipo, link_url, metadata)
       VALUES (?, ?, ?, ?, ?)`,
      [titulo, cuerpo, tipo, linkUrl, metadata ? JSON.stringify(metadata) : null]
    );
    const notifId = insN.insertId;

    const values = alumnos.map(a => [notifId, a.id]);
    await conn.query(
      `INSERT INTO notification_recipients (notification_id, user_id)
       VALUES ?`,
      [values]
    );

    await conn.commit(); conn.release();
    res.status(201).json({ id: notifId, recipients: alumnos.length });
  } catch (e) {
    console.error("💥 broadcastToMyStudents", e);
    await conn.rollback(); conn.release();
    res.status(500).json({ message: "Error en broadcast" });
  }
};
