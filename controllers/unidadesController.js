import pool from "../models/db.js";

// 🔐 GET /api/unidades?nivel=Beginners
export const getUnidadesConProgreso = async (req, res, next) => {
  const { nivel } = req.query;
  const userId = req.user?.id;
  const userRol = req.user?.rol;

  if (!nivel) {
    return res.status(400).json({ success: false, message: "Falta el parámetro 'nivel'" });
  }

  try {
    // 🔍 Obtener estado de formación del usuario
    const [[{ estado_formacion }]] = await pool.query(
      "SELECT estado_formacion FROM usuarios WHERE id = ?",
      [userId]
    );

    // ✅ Permitir acceso total a administradores
    if (userRol === "administrador") {
      console.log("🛡️ Acceso autorizado: administrador");
    }
    // 🔒 Restringir demo solo a nivel Beginners
    else if (estado_formacion === "demo" && nivel !== "Beginners") {
      return res.status(403).json({ message: "Acceso restringido para cuenta demo" });
    }
    // 🔓 Verificación de matrícula activa
    else if (estado_formacion === "matriculado") {
      const [matriculas] = await pool.query(
        "SELECT id FROM matriculas WHERE alumno_id = ? AND nivel_id = ? AND estado = 'activa'",
        [userId, nivel]
      );

      if (matriculas.length === 0) {
        return res.status(403).json({ message: "No tienes acceso a este nivel" });
      }
    }

    console.log("🔍 Nivel recibido en la API:", nivel);

    const query = `
      SELECT u.id, u.nivel, u.titulo,
             COALESCE(p.actividad_id, 0) AS actividad_id,
             COALESCE(p.completado, 0) AS completado
      FROM unidades u
      LEFT JOIN progreso_unidades p 
        ON u.id = p.unidad_id
      WHERE u.nivel = ?
      ORDER BY u.id;
    `;

    const [rows] = await pool.query(query, [nivel]);
    console.log("📡 Datos enviados al frontend:", rows);

    res.json(rows);
  } catch (err) {
    console.error("❌ Error en getUnidadesConProgreso:", err);
    res.status(500).json({ success: false, message: "Error interno del servidor", error: err.message });
  }
};

// 🔍 GET /api/unidades/:unitId
export const getUnidadById = async (req, res, next) => {
  const { unitId } = req.params;
  const userId = req.user?.id;
  const userRol = req.user?.rol;

  try {
    const [[{ estado_formacion }]] = await pool.query(
      "SELECT estado_formacion FROM usuarios WHERE id = ?",
      [userId]
    );

    // Buscar la unidad
    const [[unidad]] = await pool.query(
      "SELECT id, nivel FROM unidades WHERE id = ? LIMIT 1",
      [unitId]
    );

    if (!unidad) {
      return res.status(404).json({ message: "Unidad no encontrada" });
    }

    // 🔒 Restricción para cuentas demo
    if (userRol !== "administrador" && estado_formacion === "demo") {
      if (!(unidad.nivel === "Beginners" && unidad.id === 1)) {
        console.warn(`🚫 Demo sin acceso: unidad ${unidad.id} del nivel ${unidad.nivel}`);
        return res.status(403).json({ message: "Acceso restringido para cuenta demo" });
      }
    }

    // ✅ Permitir acceso sin restricciones a administradores

    // Obtener el título de la unidad
    const [rows] = await pool.query(
      "SELECT titulo FROM unidades WHERE id = ? LIMIT 1",
      [unitId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Unidad no encontrada" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error("❌ Error en getUnidadById:", err);
    res.status(500).json({ message: "Error interno del servidor", error: err.message });
  }
};



