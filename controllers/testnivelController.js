import pool from "../models/db.js";
// import axios from "axios"; // Descomenta si usas webhook

export const submitTestResult = async (req, res) => {
  const userId = req.user?.id;
  const { level_result, source = "web" } = req.body;

  if (!userId) {
    return res.status(401).json({ message: "Usuario no autenticado" });
  }

  if (!["A1", "A2", "B1", "B2"].includes(level_result)) {
    return res.status(400).json({ message: "Nivel inválido" });
  }

  try {
    // 📝 Guardar resultado en la base de datos
    await pool.query(
      `INSERT INTO testnivel_results (user_id, level_result, source) 
       VALUES (?, ?, ?)`,
      [userId, level_result, source]
    );

    // ✅ (Opcional) Actualizar estado_formacion o progreso_global del usuario
    await pool.query(
      `UPDATE usuarios 
       SET estado_formacion = 'matriculado' 
       WHERE id = ? AND estado_formacion = 'demo'`,
      [userId]
    );

    // 🔗 Enviar a webhook si está habilitado
    /*
    try {
      await axios.post("https://tuwebhook.com/testnivel", {
        userId,
        level_result,
        source,
        timestamp: new Date().toISOString()
      });
    } catch (webhookError) {
      console.warn("⚠️ Webhook falló:", webhookError.message);
    }
    */

    res.status(201).json({ message: "✅ Resultado guardado correctamente" });

  } catch (error) {
    console.error("💥 Error al guardar resultado del test:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};
