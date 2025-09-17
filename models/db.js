// models/db.js
import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: "utf8mb4", // ✅
});

// ⚙️ Inicialización de sesión (promise API)
(async () => {
  try {
    const conn = await pool.getConnection();
    // En MariaDB: collation moderna que ya pusimos en el servidor/tabla
    await conn.query("SET NAMES utf8mb4 COLLATE utf8mb4_uca1400_ai_ci");
    conn.release();
    // console.log("✅ DB session init OK");
  } catch (e) {
    console.error("⚠️ DB session init failed:", e?.message || e);
  }
})();

export default pool;
