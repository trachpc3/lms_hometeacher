// controllers/alumnosController.js
import bcrypt from "bcryptjs";
import pool from "../models/db.js";
import { resolveCursoId } from "../utils/cursos.js";

/** ✅ Crear alumno */
export const addAlumno = async (req, res) => {
  try {
    const {
      nombre, apellidos, telefono, email, password,
      profesor, curso_id, curso,
      estado_formacion, observaciones
    } = req.body;

    if (!nombre || !apellidos || !email || !password || !profesor || (!curso_id && !curso) || !estado_formacion) {
      return res.status(400).json({ message: "Todos los campos obligatorios deben completarse." });
    }

    const [exists] = await pool.query("SELECT id FROM usuarios WHERE email = ? LIMIT 1", [email]);
    if (exists.length) {
      return res.status(409).json({ message: "El email ya está registrado." });
    }

    const resolvedCursoId = await resolveCursoId(pool, { curso_id, curso_nombre: curso });
    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      `INSERT INTO usuarios
       (nombre, apellidos, telefono, email, password, rol, profesor_asignado, curso_id, estado_formacion, observaciones, estado)
       VALUES (?, ?, ?, ?, ?, 'estudiante', ?, ?, ?, ?, 'activo')`,
      [nombre, apellidos, telefono, email, hashedPassword, profesor, resolvedCursoId, estado_formacion, observaciones]
    );

    return res.status(201).json({ message: "Alumno agregado correctamente", id: result.insertId });
  } catch (error) {
    console.error("💥 Error al agregar alumno:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

/** ✅ Obtener alumnos con paginación y filtros */
export const getAlumnos = async (req, res) => {
  try {
    const where = ["u.rol = 'estudiante'"];
    const params = [];

    const mine = String(req.query.mine || "").toLowerCase();
    const onlyMine = req.userRole === "profesor" && (mine === "1" || mine === "true");
    if (onlyMine) {
      where.push("u.profesor_asignado = ?");
      params.push(req.userId);
    }

    if (req.query.estado) {
      where.push("u.estado = ?");
      params.push(req.query.estado);
    }

    if (req.query.estado_formacion) {
      where.push("u.estado_formacion = ?");
      params.push(req.query.estado_formacion);
    }

    if (req.query.q) {
      const q = `%${req.query.q}%`;
      where.push("(u.nombre LIKE ? OR u.apellidos LIKE ? OR u.email LIKE ?)");
      params.push(q, q, q);
    }

    // Paginación
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const whereSQL = where.length ? `WHERE ${where.join(" AND ")}` : "";

    // Total filtrado
    const [[{ total }]] = await pool.query(
      `SELECT COUNT(*) AS total
       FROM usuarios u
       LEFT JOIN cursos c ON c.id = u.curso_id
       ${whereSQL}`,
      params
    );

    // Alumnos paginados
    const [rows] = await pool.query(
      `SELECT
        u.id,
        u.nombre,
        u.apellidos,
        u.email,
        u.telefono,
        u.imagen,
        u.estado,
        u.estado_formacion,
        u.progreso_global,
        u.profesor_asignado,
        u.curso_id,
        c.nombre AS curso_nombre,
        u.curso_matriculado,
        u.fecha_registro,
        u.fecha_baja,
        u.ultima_sesion
      FROM usuarios u
      LEFT JOIN cursos c ON c.id = u.curso_id
      ${whereSQL}
      ORDER BY u.nombre ASC, u.id DESC
      LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    const pages = Math.ceil(total / limit);

    return res.json({ alumnos: rows, total, page, pages });
  } catch (error) {
    console.error("💥 Error al obtener alumnos:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

/** ✅ Actualizar alumno */
export const updateAlumno = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: "ID requerido" });
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: "No se recibieron datos para actualizar." });
    }

    if (req.userRole === "profesor") {
      const [[own]] = await pool.query(
        "SELECT id FROM usuarios WHERE id=? AND profesor_asignado=? AND rol='estudiante' LIMIT 1",
        [id, req.userId]
      );
      if (!own) return res.status(403).json({ message: "No puedes modificar alumnos de otro profesor." });
    }

    const payload = { ...req.body };
    if (payload.curso || payload.curso_id) {
      const resolved = await resolveCursoId(pool, { curso_id: payload.curso_id, curso_nombre: payload.curso });
      payload.curso_id = resolved;
      delete payload.curso;
    }

    const allowed = new Set([
      "nombre", "apellidos", "telefono", "email", "password",
      "profesor_asignado", "curso_id", "estado_formacion", "observaciones", "estado"
    ]);

    const fields = [];
    const params = [];

    if (payload.email) {
      const [dup] = await pool.query("SELECT id FROM usuarios WHERE email = ? AND id <> ? LIMIT 1", [payload.email, id]);
      if (dup.length) return res.status(409).json({ message: "El email ya está en uso." });
    }

    for (const [k, v] of Object.entries(payload)) {
      if (!allowed.has(k)) continue;
      if (k === "password") {
        if (!v) continue;
        const hashed = String(v).startsWith("$2b$") ? v : await bcrypt.hash(String(v), 10);
        fields.push("password = ?");
        params.push(hashed);
      } else {
        fields.push(`${k} = ?`);
        params.push(v);
      }
    }

    if (!fields.length) return res.status(400).json({ message: "Sin cambios." });

    const [result] = await pool.query(
      `UPDATE usuarios SET ${fields.join(", ")} WHERE id = ? AND rol='estudiante'`,
      [...params, id]
    );

    if (!result.affectedRows) return res.status(404).json({ message: "Alumno no encontrado." });

    res.json({ message: "Alumno actualizado correctamente." });
  } catch (error) {
    console.error("💥 Error al actualizar alumno:", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
};

/** ✅ Soft delete */
export const deleteAlumno = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: "El ID del alumno es obligatorio." });

    if (req.userRole === "profesor") {
      const [[own]] = await pool.query(
        "SELECT id FROM usuarios WHERE id=? AND profesor_asignado=? AND rol='estudiante' LIMIT 1",
        [id, req.userId]
      );
      if (!own) return res.status(403).json({ message: "No puedes eliminar alumnos de otro profesor." });
    }

    const [result] = await pool.query(
      "UPDATE usuarios SET estado='inactivo', fecha_baja = NOW() WHERE id = ? AND rol='estudiante'",
      [id]
    );

    if (!result.affectedRows) return res.status(404).json({ message: "Alumno no encontrado." });

    res.json({ message: "Alumno desactivado correctamente." });
  } catch (error) {
    console.error("💥 Error al desactivar alumno:", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
};
