// controllers/mensajesController.js
import pool from "../models/db.js";

/* =========================
   Helpers internos
========================= */

const ROLES = new Set(["estudiante", "profesor"]);

function normalizeRole(role) {
  if (!role) return null;
  const r = String(role).toLowerCase();
  if (r === "administrador" || r === "admin") return "profesor";
  if (r === "alumno") return "estudiante";
  return r;
}

/**
 * Normaliza la imagen de usuario para el frontend:
 * - null, '/default-profile.png', '/default-profile.jpg' -> asset público del frontend
 * - absoluta (http/https) -> tal cual
 * - comienza con '/uploads' -> tal cual (ya es ruta pública del back)
 * - nombre simple ('user_12.jpg') -> lo exponemos como '/uploads/avatars/<nombre>'
 */
function normalizeImage(imagen) {
  if (!imagen) return "/assets/img/default-profile.png";

  const val = String(imagen).trim();

  // 🟢 Casos default antiguos o inconsistentes -> asset público
  if (
    val === "/default-profile.png" ||
    val === "/default-profile.jpg" ||
    val.endsWith("/assets/img/default-profile.png")
  ) {
    return "/assets/img/default-profile.png";
  }

  // 🟢 Si ya es URL absoluta
  if (/^https?:\/\//i.test(val)) return val;

  // 🟢 Si YA es un asset del frontend, NO toques
  if (val.startsWith("/assets/")) return val;

  // 🟢 Si ya es ruta pública del backend, respétala
  if (val.startsWith("/uploads/")) return val;

  // 🟢 Nombre suelto (user_12.jpg) -> a carpeta avatars del backend
  return `/uploads/avatars/${val.replace(/^\/+/, "")}`;
}


async function getAssignedProfessorId(conn, studentId) {
  const [[row]] = await conn.query(
    `SELECT profesor_asignado AS profesorId
     FROM usuarios
     WHERE id = ? AND rol IN ('estudiante','alumno') AND estado <> 'inactivo'
     LIMIT 1`,
    [studentId]
  );
  return row?.profesorId || null;
}

async function userExists(conn, userId, role) {
  const norm = normalizeRole(role);
  if (!ROLES.has(norm)) return null;
  const [[u]] = await conn.query(
    `SELECT id, nombre, imagen, rol, estado
     FROM usuarios
     WHERE id = ? AND rol IN ('estudiante','alumno','profesor','administrador')
     LIMIT 1`,
    [userId]
  );
  if (!u) return null;
  return { ...u, rol: normalizeRole(u.rol) };
}

async function findExistingConversation(conn, aId, aRole, bId, bRole) {
  const [[row]] = await conn.query(
    `SELECT c.id
     FROM conversations c
     JOIN conversation_participants p1
       ON p1.conversation_id = c.id AND p1.user_id = ? AND p1.user_role = ?
     JOIN conversation_participants p2
       ON p2.conversation_id = c.id AND p2.user_id = ? AND p2.user_role = ?
     WHERE c.type = 'one_to_one'
     LIMIT 1`,
    [aId, aRole, bId, bRole]
  );
  return row?.id || null;
}

async function getPeerInfoBulk(conn, myId, myRole, convIds) {
  if (!convIds.length) return {};

  const [parts] = await conn.query(
    `SELECT conversation_id, user_id, user_role
     FROM conversation_participants
     WHERE conversation_id IN (?)`,
    [convIds]
  );

  const mapPeer = new Map();
  const idsByRole = { estudiante: new Set(), profesor: new Set() };

  for (const p of parts) {
    if (p.user_id === myId && p.user_role === myRole) continue;
    mapPeer.set(p.conversation_id, { id: p.user_id, role: normalizeRole(p.user_role) });
    idsByRole[normalizeRole(p.user_role)]?.add(p.user_id);
  }

  const allIds = [...idsByRole.estudiante, ...idsByRole.profesor];
  if (!allIds.length) return {};

  const [rows] = await conn.query(
    `SELECT id, nombre, imagen, rol
     FROM usuarios
     WHERE id IN (?)`,
    [allIds]
  );

  const byKey = new Map(rows.map(r => [`${normalizeRole(r.rol)}:${r.id}`, r]));

  const out = {};
  for (const [cid, peer] of mapPeer.entries()) {
    const k = `${peer.role}:${peer.id}`;
    const u = byKey.get(k);
    out[cid] = {
      id: peer.id,
      role: peer.role,
      nombre: u?.nombre || null,
      imagen: normalizeImage(u?.imagen || null), // 👈 NORMALIZA AQUÍ
    };
  }
  return out;
}

/* =========================
   Controladores públicos
========================= */

/**
 * POST /api/mensajes/start
 */
export const startConversation = async (req, res) => {
  const myId = req.userId;
  const myRole = normalizeRole(req.userRole);

  const { toUserId, toRole: rawToRole = "estudiante" } = req.body || {};
  const toRole = normalizeRole(rawToRole);

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    let otherId = null;
    let otherRole = null;

    if (myRole === "estudiante") {
      const profesorId = await getAssignedProfessorId(conn, myId);
      if (!profesorId) {
        await conn.rollback(); conn.release();
        return res.status(400).json({ message: "No tienes profesor asignado." });
      }
      otherId = profesorId;
      otherRole = "profesor";
    } else if (myRole === "profesor") {
      if (!toUserId) {
        await conn.rollback(); conn.release();
        return res.status(400).json({ message: "toUserId es obligatorio." });
      }
      otherId = Number(toUserId);
      otherRole = toRole;
      if (!ROLES.has(otherRole)) {
        await conn.rollback(); conn.release();
        return res.status(400).json({ message: "toRole inválido." });
      }
    } else {
      await conn.rollback(); conn.release();
      return res.status(403).json({ message: "Rol no permitido." });
    }

    const other = await userExists(conn, otherId, otherRole);
    if (!other || other.estado === "inactivo") {
      await conn.rollback(); conn.release();
      return res.status(404).json({ message: "Destinatario no encontrado o inactivo." });
    }
    otherRole = other.rol; // normalizado

    const existingId = await findExistingConversation(conn, myId, myRole, otherId, otherRole);
    if (existingId) {
      await conn.commit(); conn.release();
      return res.json({ conversationId: existingId, created: false });
    }

    const [ins] = await conn.query(
      `INSERT INTO conversations (type) VALUES ('one_to_one')`
    );
    const conversationId = ins.insertId;

    await conn.query(
      `INSERT INTO conversation_participants (conversation_id, user_id, user_role)
       VALUES (?, ?, ?), (?, ?, ?)`,
      [conversationId, myId, myRole, conversationId, otherId, otherRole]
    );

    await conn.commit(); conn.release();
    return res.status(201).json({ conversationId, created: true });
  } catch (err) {
    console.error("💥 startConversation error:", err);
    await conn.rollback(); conn.release();
    return res.status(500).json({ message: "Error al iniciar conversación." });
  }
};

/**
 * GET /api/mensajes
 */
export const listConversations = async (req, res) => {
  const myId = req.userId;
  const myRole = normalizeRole(req.userRole);

  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.query(
      `SELECT c.id, c.last_message_at, p.last_read_message_id
       FROM conversation_participants p
       JOIN conversations c ON c.id = p.conversation_id
       WHERE p.user_id = ? AND p.user_role = ?
       ORDER BY COALESCE(c.last_message_at, c.updated_at) DESC`,
      [myId, myRole]
    );

    const convIds = rows.map(r => r.id);
    const peerMap = await getPeerInfoBulk(conn, myId, myRole, convIds);

    let lastByConv = {};
    if (convIds.length) {
      const [last] = await conn.query(
        `SELECT m.*
         FROM messages m
         JOIN (
           SELECT conversation_id, MAX(id) AS max_id
           FROM messages
           WHERE conversation_id IN (?)
           GROUP BY conversation_id
         ) t ON t.conversation_id = m.conversation_id AND t.max_id = m.id`,
        [convIds]
      );
      for (const m of last) lastByConv[m.conversation_id] = m;
    }

    let unreadByConv = {};
    if (convIds.length) {
      const [unr] = await conn.query(
        `SELECT m.conversation_id, COUNT(*) AS unread
         FROM messages m
         JOIN conversation_participants p
           ON p.conversation_id = m.conversation_id
          AND p.user_id = ? AND p.user_role = ?
         WHERE m.conversation_id IN (?)
           AND m.id > COALESCE(p.last_read_message_id, 0)
           AND NOT (m.sender_id = ? AND m.sender_role = ?)
         GROUP BY m.conversation_id`,
        [myId, myRole, convIds, myId, myRole]
      );
      for (const u of unr) unreadByConv[u.conversation_id] = Number(u.unread);
    }

    const conversations = rows.map(r => ({
      id: r.id,
      lastMessageAt: r.last_message_at,
      unread: unreadByConv[r.id] || 0,
      peer: peerMap[r.id] || null, // 👈 peer.imagen ya viene normalizada
      lastMessage: lastByConv[r.id]
        ? {
            id: lastByConv[r.id].id,
            body: lastByConv[r.id].body,
            senderId: lastByConv[r.id].sender_id,
            senderRole: normalizeRole(lastByConv[r.id].sender_role),
            createdAt: lastByConv[r.id].created_at,
          }
        : null,
    }));

    conn.release();
    return res.json({ conversations });
  } catch (err) {
    console.error("💥 listConversations error:", err);
    conn.release();
    return res.status(500).json({ message: "Error al listar conversaciones." });
  }
};

/**
 * GET /api/mensajes/:conversationId
 */
export const getMessages = async (req, res) => {
  const myId = req.userId;
  const myRole = normalizeRole(req.userRole);
  const { conversationId } = req.params;
  const { beforeId, limit = 50 } = req.query;

  const conn = await pool.getConnection();
  try {
    const [[me]] = await conn.query(
      `SELECT 1
       FROM conversation_participants
       WHERE conversation_id = ? AND user_id = ? AND user_role = ?
       LIMIT 1`,
      [conversationId, myId, myRole]
    );
    if (!me) {
      conn.release();
      return res.status(403).json({ message: "No participas en esta conversación." });
    }

    const args = [conversationId];
    let sql =
      `SELECT id, sender_id AS senderId, sender_role AS senderRole, body, created_at AS createdAt
       FROM messages
       WHERE conversation_id = ?`;
    if (beforeId) {
      sql += ` AND id < ?`;
      args.push(Number(beforeId));
    }
    sql += ` ORDER BY id DESC LIMIT ?`;
    args.push(Math.min(200, Number(limit)));

    const [rows] = await conn.query(sql, args);
    rows.forEach(m => { m.senderRole = normalizeRole(m.senderRole); });
    rows.reverse();

    conn.release();
    return res.json({ messages: rows });
  } catch (err) {
    console.error("💥 getMessages error:", err);
    conn.release();
    return res.status(500).json({ message: "Error al obtener mensajes." });
  }
};

/**
 * POST /api/mensajes/:conversationId
 */
export const sendMessage = async (req, res) => {
  const myId = req.userId;
  const myRole = normalizeRole(req.userRole);
  const { conversationId } = req.params;
  const { body } = req.body || {};

  if (!body || !String(body).trim()) {
    return res.status(400).json({ message: "Mensaje vacío." });
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [[me]] = await conn.query(
      `SELECT 1
       FROM conversation_participants
       WHERE conversation_id = ? AND user_id = ? AND user_role = ?
       LIMIT 1`,
      [conversationId, myId, myRole]
    );
    if (!me) {
      await conn.rollback(); conn.release();
      return res.status(403).json({ message: "No participas en esta conversación." });
    }

    const clean = String(body).trim();
    const [ins] = await conn.query(
      `INSERT INTO messages (conversation_id, sender_id, sender_role, body)
       VALUES (?, ?, ?, ?)`,
      [conversationId, myId, myRole, clean]
    );
    const messageId = ins.insertId;

    await conn.query(
      `UPDATE conversations
       SET last_message_at = NOW()
       WHERE id = ?`,
      [conversationId]
    );

    await conn.query(
      `UPDATE conversation_participants
       SET last_read_message_id = GREATEST(COALESCE(last_read_message_id, 0), ?)
       WHERE conversation_id = ? AND user_id = ? AND user_role = ?`,
      [messageId, conversationId, myId, myRole]
    );

    await conn.commit(); conn.release();

    return res.status(201).json({
      id: messageId,
      senderId: myId,
      senderRole: myRole,
      body: clean,
      createdAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error("💥 sendMessage error:", err);
    await conn.rollback(); conn.release();
    return res.status(500).json({ message: "Error al enviar mensaje." });
  }
};

/**
 * POST /api/mensajes/:conversationId/read
 */
export const markRead = async (req, res) => {
  const myId = req.userId;
  const myRole = normalizeRole(req.userRole);
  const { conversationId } = req.params;

  const conn = await pool.getConnection();
  try {
    const [[row]] = await conn.query(
      `SELECT MAX(id) AS maxId
       FROM messages
       WHERE conversation_id = ?`,
      [conversationId]
    );
    const maxId = row?.maxId || 0;

    await conn.query(
      `UPDATE conversation_participants
       SET last_read_message_id = GREATEST(COALESCE(last_read_message_id, 0), ?)
       WHERE conversation_id = ? AND user_id = ? AND user_role = ?`,
      [maxId, conversationId, myId, myRole]
    );

    conn.release();
    return res.json({ ok: true, lastReadMessageId: maxId });
  } catch (err) {
    console.error("💥 markRead error:", err);
    conn.release();
    return res.status(500).json({ message: "Error al marcar como leído." });
  }
};

/**
 * GET /api/mensajes/unread-count
 */
export const getUnreadCount = async (req, res) => {
  const myId = req.userId;
  const myRole = normalizeRole(req.userRole);

  const conn = await pool.getConnection();
  try {
    const [[row]] = await conn.query(
      `SELECT COALESCE(SUM(sub.unread), 0) AS total
       FROM (
         SELECT m.conversation_id, COUNT(*) AS unread
         FROM messages m
         JOIN conversation_participants p
           ON p.conversation_id = m.conversation_id
          AND p.user_id = ? AND p.user_role = ?
         WHERE m.id > COALESCE(p.last_read_message_id, 0)
           AND NOT (m.sender_id = ? AND m.sender_role = ?)
         GROUP BY m.conversation_id
       ) sub`,
      [myId, myRole, myId, myRole]
    );

    conn.release();
    return res.json({ unread: Number(row?.total || 0) });
  } catch (err) {
    console.error("💥 getUnreadCount error:", err);
    conn.release();
    return res.status(500).json({ message: "Error al obtener no leídos." });
  }
};
