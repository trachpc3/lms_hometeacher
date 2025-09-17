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
  charset: "utf8mb4", // ✅ nivel conexión
});

// ✅ Forzar collation/charset en CADA conexión creada por el pool
pool.on?.("connection", (conn) => {
  conn.query("SET NAMES utf8mb4 COLLATE utf8mb4_uca1400_ai_ci").catch((e) => {
    console.error("SET NAMES failed:", e?.message || e);
  });
});

export default pool;
