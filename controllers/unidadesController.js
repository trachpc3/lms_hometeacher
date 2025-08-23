// controllers/unidadesController.js
import pool from "../models/db.js";

/**
 * GET /api/unidades?nivel=Beginners
 * Requiere JWT (verifyToken)
 */
export const getUnidadesConProgreso = async (req, res) => {
  // Compatibilidad: middleware nuevo expone req.userId/req.userRole
  const userId = req.userId ?? req.user?.id ?? null;
  const userRol = req.userRole ?? req.user?.rol ?? null;
  const { nivel } = req.query;

  if (!nivel) {
    return res.status(400).json({ success: false, message: "Falta el parámetro 'nivel'" });
  }
  if (!userId) {
    return res.status(401).json({ success: false, message: "Token inválido o expirado" });
  }

  try {
    // 1) Estado de formación del usuario (defensivo)
    const [estadoRows] = await pool.query(
      "SELECT estado_formacion FROM usuarios WHERE id = ? LIMIT 1",
      [userId]
    );
    const estado_formacion = estadoRows?.[0]?.estado_formacion ?? null;

    // 2) Autorización por rol/estado
    const isAdmin = userRol === "administrador" || userRol === "gestion" || userRol === "profesor";

    if (!isAdmin) {
      if (estado_formacion === "demo" && nivel !== "Beginners") {
        return res.status(403).json({ message: "Acceso restringido para cuenta demo" });
      }

      if (estado_formacion === "matriculado") {
        // ⚠️ Ajusta este CHECK a tu esquema real:
        // Si tu tabla `matriculas` guarda el NIVEL como texto, usa `nivel = ?`
        // Si guarda un ID numérico, tendrás que mapear "Beginners" → id de nivel.
        const [matriculas] = await pool.query(
          "SELECT id FROM matriculas WHERE alumno_id = ? AND (nivel = ? OR nivel_id = ?) AND estado = 'activa' LIMIT 1",
          [userId, nivel, nivel] // si nivel_id es numérico, cambia el 2º parámetro por el id correcto
        );
        if (matriculas.length === 0) {
          return res.status(403).json({ message: "No tienes acceso a este nivel" });
        }
      }
    }

    // 3) Unidades + progreso del usuario (filtrando por usuario!)
    // ⚠️ Ajusta `p.usuario_id` al nombre de la columna real en tu tabla de progreso.
    const query = `
      SELECT 
        u.id,
        u.nivel,
        u.titulo,
        COALESCE(p.actividad_id, 0)   AS actividad_id,
        COALESCE(p.completado, 0)     AS completado
      FROM unidades u
      LEFT JOIN progreso_unidades p
        ON u.id = p.unidad_id
       AND p.usuario_id = ?           -- 👈 filtra por el alumno actual
      WHERE u.nivel = ?
      ORDER BY u.id ASC
    `;
    const [rows] = await pool.query(query, [userId, nivel]);

    return res.json(rows);
  } catch (err) {
    console.error("❌ Error en getUnidadesConProgreso:", err);
    return res
      .status(500)
      .json({ success: false, message: "Error interno del servidor", error: err.message });
  }
};

/**
 * GET /api/unidades/:unitId
 * Requiere JWT (verifyToken)
 */
export const getUnidadById = async (req, res) => {
  const userId = req.userId ?? req.user?.id ?? null;
  const userRol = req.userRole ?? req.user?.rol ?? null;
  const { unitId } = req.params;

  if (!userId) {
    return res.status(401).json({ message: "Token inválido o expirado" });
  }

  try {
    // Estado formación
    const [estadoRows] = await pool.query(
      "SELECT estado_formacion FROM usuarios WHERE id = ? LIMIT 1",
      [userId]
    );
    const estado_formacion = estadoRows?.[0]?.estado_formacion ?? null;

    // Buscar la unidad (defensivo)
    const [unidadRows] = await pool.query(
      "SELECT id, nivel, titulo FROM unidades WHERE id = ? LIMIT 1",
      [unitId]
    );
    const unidad = unidadRows?.[0];
    if (!unidad) {
      return res.status(404).json({ message: "Unidad no encontrada" });
    }

    // Reglas de acceso
    const isAdmin = userRol === "administrador" || userRol === "gestion" || userRol === "profesor";

    if (!isAdmin) {
      if (estado_formacion === "demo") {
        // ⚠️ Ajusta esta regla de demo según tu negocio
        const allowed = unidad.nivel === "Beginners" && Number(unidad.id) === 1;
        if (!allowed) {
          console.warn(`🚫 Demo sin acceso: unidad ${unidad.id} del nivel ${unidad.nivel}`);
          return res.status(403).json({ message: "Acceso restringido para cuenta demo" });
        }
      }

      if (estado_formacion === "matriculado") {
        // Igual que arriba, ajusta a tu esquema real
        const [matriculas] = await pool.query(
          "SELECT id FROM matriculas WHERE alumno_id = ? AND (nivel = ? OR nivel_id = ?) AND estado = 'activa' LIMIT 1",
          [userId, unidad.nivel, unidad.nivel] // cambia el último si `nivel_id` es numérico
        );
        if (matriculas.length === 0) {
          return res.status(403).json({ message: "No tienes acceso a esta unidad" });
        }
      }
    }

    // Devuelve la unidad (si necesitas más campos, añádelos en el SELECT)
    return res.json({ id: unidad.id, titulo: unidad.titulo, nivel: unidad.nivel });
  } catch (err) {
    console.error("❌ Error en getUnidadById:", err);
    return res.status(500).json({ message: "Error interno del servidor", error: err.message });
  }
};
