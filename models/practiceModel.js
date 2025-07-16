import pool from "../db.js";  // Asegúrate de que el archivo `database.js` tiene la conexión a MySQL

export const insertPracticeData = async (data) => {
    try {
        if (data.length === 0) {
            console.log("⚠️ No hay datos para insertar en la BD.");
            return;
        }

        const sql = `
            INSERT INTO practice (unidad_id, actividad_id, word, translation, audio_url) 
            VALUES ?
        `;
        const values = data.map(row => [row.unidad_id, row.actividad_id, row.word, row.translation, row.audio_url]);

        console.log("📝 Insertando datos en la BD:", values);

        const [result] = await pool.query(sql, [values]);

        console.log(`✅ ${result.affectedRows} filas insertadas en la base de datos.`);
    } catch (error) {
        console.error("❌ Error al insertar en la BD:", error);
    }
};
