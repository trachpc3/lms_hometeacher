import bcrypt from "bcryptjs";
import pool from "../models/db.js"; 

// ✅ Agregar un alumno
export const addAlumno = async (req, res) => {
    console.log("📥 Datos recibidos en el backend:", req.body); 

    const { nombre, apellidos, telefono, email, password, profesor, curso, estado_formacion, observaciones } = req.body;

    if (!nombre || !apellidos || !email || !password || !profesor || !curso || !estado_formacion) {
        console.log("❌ Faltan datos obligatorios:", { nombre, apellidos, email, password, profesor, curso, estado_formacion });
        return res.status(400).json({ message: "Todos los campos obligatorios deben completarse." });
    }

    try {
        console.log("✅ Todos los campos están presentes. Insertando en la BD...");
        
        const hashedPassword = await bcrypt.hash(password, 10);
        const [result] = await pool.query(
            "INSERT INTO usuarios (nombre, apellidos, telefono, email, password, rol, profesor_asignado, curso_matriculado, estado_formacion, observaciones) VALUES (?, ?, ?, ?, ?, 'estudiante', ?, ?, ?, ?)",
            [nombre, apellidos, telefono, email, hashedPassword, profesor, curso, estado_formacion, observaciones]
        );

        console.log("✅ Usuario agregado con éxito, ID:", result.insertId);
        return res.status(201).json({ message: "Alumno agregado correctamente", id: result.insertId });

    } catch (error) {
        console.error("💥 Error al agregar alumno:", error);
        return res.status(500).json({ message: "Error interno del servidor" });
    }
};

// ✅ Obtener alumnos
export const getAlumnos = async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM usuarios WHERE rol = 'estudiante'");
        res.json(rows);
    } catch (error) {
        console.error("💥 Error al obtener alumnos:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

// ✅ Actualizar un alumno
export const updateAlumno = async (req, res) => {
    const { id } = req.params;
    console.log("📥 Datos recibidos en el backend:", req.body); // ✅ Verificar qué datos llegan

    if (!req.body || Object.keys(req.body).length === 0) {
        console.log("⚠️ No se recibió ningún dato en el cuerpo de la solicitud.");
        return res.status(400).json({ message: "No se recibieron datos para actualizar." });
    }

    const { nombre, apellidos, telefono, email, password, profesor, curso, estado_formacion, observaciones } = req.body;

    if (!nombre || !apellidos || !email || !profesor || !curso || !estado_formacion) {
        console.log("❌ Faltan datos obligatorios:", { nombre, apellidos, email, profesor, curso, estado_formacion });
        return res.status(400).json({ message: "Todos los campos obligatorios deben completarse." });
    }

    try {
        console.log("🔄 Actualizando alumno con ID:", id);

        let hashedPassword = password;
        if (password && !password.startsWith("$2b$")) {
            hashedPassword = await bcrypt.hash(password, 10);
        }

        const [result] = await pool.query(
            "UPDATE usuarios SET nombre = ?, apellidos = ?, telefono = ?, email = ?, password = ?, profesor_asignado = ?, curso_matriculado = ?, estado_formacion = ?, observaciones = ? WHERE id = ?",
            [nombre, apellidos, telefono, email, hashedPassword, profesor, curso, estado_formacion, observaciones, id]
        );

        if (result.affectedRows === 0) {
            console.log("❌ Alumno no encontrado.");
            return res.status(404).json({ message: "Alumno no encontrado." });
        }

        console.log("✅ Alumno actualizado correctamente.");
        res.json({ message: "Alumno actualizado correctamente." });

    } catch (error) {
        console.error("💥 Error al actualizar alumno:", error);
        res.status(500).json({ message: "Error interno del servidor." });
    }
};


// ✅ Eliminar un alumno
export const deleteAlumno = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: "El ID del alumno es obligatorio." });
    }

    try {
        const [result] = await pool.query("DELETE FROM usuarios WHERE id = ?", [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Alumno no encontrado." });
        }

        res.json({ message: "Alumno eliminado correctamente." });

    } catch (error) {
        console.error("💥 Error al eliminar alumno:", error);
        res.status(500).json({ message: "Error interno del servidor." });
    }
};
