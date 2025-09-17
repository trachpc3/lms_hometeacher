import pool from "../models/db.js";

// Devuelve lista de profesores: id, nombre, apellidos, email (o lo que uses)
export const getProfesores = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, nombre, apellidos FROM usuarios WHERE rol = 'profesor' AND estado = 'activo'"
    );
    res.json(rows);
  } catch (error) {
    console.error("Error al obtener profesores:", error);
    res.status(500).json({ message: "Error interno al obtener profesores" });
  }
};
