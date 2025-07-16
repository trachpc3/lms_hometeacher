import bcrypt from "bcryptjs";
import pool from "./models/db.js"; // Conexión reutilizando db.js

async function insertarUsuarios() {
    const usuarios = [
        { nombre: "Admin Principal", email: "admin@lms.com", password: "admin123", rol: "administrador" },
        { nombre: "Ana", email: "ana@lms.com", password: "profesor123", rol: "profesor" },
        { nombre: "Pepe", email: "pepe@lms.com", password: "alumno123", rol: "estudiante" },
        { nombre: "Javi", email: "javi@lms.com", password: "1234", rol: "administrador" },
    ];

    for (const usuario of usuarios) {
        const hashedPassword = await bcrypt.hash(usuario.password, 10);

        await pool.query(
            `INSERT INTO usuarios (nombre, email, password, rol, metodo_registro) 
             VALUES (?, ?, ?, ?, ?)`,
            [usuario.nombre, usuario.email, hashedPassword, usuario.rol, "manual"]
        );

        console.log(`✅ Usuario ${usuario.nombre} insertado correctamente`);
    }

    console.log("🚀 Todos los usuarios base fueron insertados.");
    process.exit();
}

insertarUsuarios().catch((err) => {
    console.error("💥 Error al insertar usuarios:", err);
    process.exit(1);
});
