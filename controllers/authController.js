import bcrypt from "bcryptjs";
import pool from "../models/db.js";
import crypto from "crypto";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../utils/jwt.js";

// ⚙️ Base para la cookie httpOnly del refresh
const cookieBase = {
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.COOKIE_SECURE === "true", // en HTTPS true
  path: "/api/auth/refresh", // solo viaja al endpoint de refresh
};

// === LOGIN TRADICIONAL ===
export const login = async (req, res) => {
  const { email, password } = req.body;
  console.log("🟡 Intentando login con:", { email });

  try {
    const [rows] = await pool.query("SELECT * FROM usuarios WHERE email = ?", [email]);
    if (rows.length === 0) return res.status(404).json({ message: "Usuario no encontrado" });

    const user = rows[0];
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) return res.status(401).json({ message: "Contraseña incorrecta" });

    await registrarLogin(user.id, req);

    // 🔑 Tokens
    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);

    // 🍪 Set-Cookie httpOnly (7d por defecto)
    res.cookie("refreshToken", refreshToken, { ...cookieBase, maxAge: msToNumber(process.env.JWT_REFRESH_EXPIRES || "7d") });

    // ▶️ Respuesta: access token en body, user normalizado
    return res.json({ token: accessToken, user: formatearUsuario(user) });
  } catch (error) {
    console.error("💥 Error en login:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

// === LOGIN CON GOOGLE ===
export const loginGoogle = async (req, res) => {
  const { access_token } = req.body;
  if (!access_token) return res.status(400).json({ message: "Token de Google no proporcionado" });

  try {
    const response = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: { Authorization: `Bearer ${access_token}` },
    });
    if (!response.ok) throw new Error("Token inválido o expirado (Google)");

    const { email, name, picture } = await response.json();
    if (!email || !name) throw new Error("Faltan datos del usuario de Google");

    const user = await buscarOCrearUsuario({ email, nombre: name, imagen: picture });
    await registrarLogin(user.id, req);

    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);
    res.cookie("refreshToken", refreshToken, { ...cookieBase, maxAge: msToNumber(process.env.JWT_REFRESH_EXPIRES || "7d") });

    return res.json({ token: accessToken, user: formatearUsuario(user) });
  } catch (error) {
    console.error("💥 Error en loginGoogle:", error.message);
    return res.status(500).json({ message: "Error al autenticar con Google" });
  }
};

// === LOGIN CON FACEBOOK (Meta) ===
export const loginMeta = async (req, res) => {
  const { access_token } = req.body;
  if (!access_token) return res.status(400).json({ message: "Token de Meta no proporcionado" });

  try {
    const response = await fetch(
      `https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${access_token}`
    );
    if (!response.ok) throw new Error("Token inválido o expirado (Meta)");

    const { email, name, picture } = await response.json();
    if (!email || !name) throw new Error("Faltan datos del usuario de Facebook");

    const user = await buscarOCrearUsuario({ email, nombre: name, imagen: picture?.data?.url });
    await registrarLogin(user.id, req);

    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);
    res.cookie("refreshToken", refreshToken, { ...cookieBase, maxAge: msToNumber(process.env.JWT_REFRESH_EXPIRES || "7d") });

    return res.json({ token: accessToken, user: formatearUsuario(user) });
  } catch (error) {
    console.error("💥 Error en loginMeta:", error.message);
    return res.status(500).json({ message: "Error al autenticar con Facebook" });
  }
};

// 🔁 REFRESH: devuelve un nuevo access token usando la cookie httpOnly
export const refresh = async (req, res) => {
  try {
    const rt = req.cookies?.refreshToken;
    if (!rt) return res.status(401).json({ message: "No refresh token" });

    const payload = verifyRefreshToken(rt); // lanza si inválido/expirado

    // (opcional) verifica usuario activo
    const [rows] = await pool.query("SELECT * FROM usuarios WHERE id = ?", [payload.sub]);
    const user = rows[0];
    if (!user) return res.status(401).json({ message: "Usuario no válido" });

    // Emitimos nuevo access
    const newAccess = signAccessToken(user);
    return res.json({ token: newAccess });
  } catch (err) {
    return res.status(401).json({ message: "Refresh inválido o expirado" });
  }
};

// 🚪 LOGOUT: borra cookie httpOnly
export const logout = async (req, res) => {
  try {
    res.clearCookie("refreshToken", { path: "/api/auth/refresh" });
    return res.status(204).end();
  } catch (error) {
    return res.status(500).json({ message: "Error al cerrar sesión" });
  }
};

// === OLVIDÉ MI CONTRASEÑA ===
export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email requerido" });

  try {
    const [rows] = await pool.query("SELECT * FROM usuarios WHERE email = ?", [email]);
    const user = rows[0];
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    const token = crypto.randomBytes(32).toString("hex");
    const expires = Date.now() + 15 * 60 * 1000; // 15 minutos

    await pool.query("UPDATE usuarios SET reset_token = ?, reset_token_expira = ? WHERE id = ?", [
      token,
      expires,
      user.id,
    ]);

    // ⚠️ En producción genera URL con tu dominio
    const resetUrl = `http://localhost:5173/restablecer-contraseña?token=${token}`;
    console.log("📧 Enlace de recuperación:", resetUrl);

    return res.json({ message: "Enlace de recuperación enviado (simulado)" });
  } catch (error) {
    console.error("💥 Error en forgotPassword:", error);
    return res.status(500).json({ message: "Error al generar enlace de recuperación" });
  }
};

// === RESETEO DE CONTRASEÑA ===
export const resetPassword = async (req, res) => {
  const { token, nuevaPassword } = req.body;
  if (!token || !nuevaPassword) {
    return res.status(400).json({ message: "Token y nueva contraseña requeridos" });
  }

  try {
    const [rows] = await pool.query("SELECT * FROM usuarios WHERE reset_token = ?", [token]);
    const user = rows[0];
    if (!user) return res.status(400).json({ message: "Token inválido o inexistente" });

    if (Date.now() > user.reset_token_expira) {
      return res.status(400).json({ message: "El token ha expirado" });
    }

    const hashed = await bcrypt.hash(nuevaPassword, 10);
    await pool.query(
      "UPDATE usuarios SET password = ?, reset_token = NULL, reset_token_expira = NULL WHERE id = ?",
      [hashed, user.id]
    );

    return res.json({ message: "Contraseña actualizada correctamente" });
  } catch (error) {
    console.error("💥 Error en resetPassword:", error);
    return res.status(500).json({ message: "Error al actualizar la contraseña" });
  }
};

// === REGISTRO MANUAL DE USUARIO DEMO ===
export const register = async (req, res) => {
  const { nombre, apellidos, email, telefono, curso_matriculado } = req.body;

  if (!nombre || !apellidos || !email || !telefono || !curso_matriculado) {
    return res.status(400).json({ message: "Todos los campos son obligatorios" });
  }

  const telefonoRegex = /^[0-9\s()+-]{7,20}$/;
  if (!telefonoRegex.test(telefono)) {
    return res.status(400).json({ message: "Número de teléfono no válido" });
  }

  try {
    const [existe] = await pool.query("SELECT id FROM usuarios WHERE email = ?", [email]);
    if (existe.length > 0) {
      return res.status(409).json({ message: "El correo ya está registrado" });
    }

    const passwordFija = await bcrypt.hash("Hometeacher", 10);
    const [result] = await pool.query(
      `INSERT INTO usuarios 
       (nombre, apellidos, email, password, telefono, curso_matriculado, estado_formacion, profesor_asignado, metodo_registro, rol) 
       VALUES (?, ?, ?, ?, ?, ?, 'demo', 0, 'manual', 'estudiante')`,
      [nombre, apellidos, email, passwordFija, telefono, curso_matriculado]
    );

    console.log(`📨 Email simulado: Bienvenido ${nombre}, acceso demo creado.`);
    return res.status(201).json({ message: "Usuario demo registrado correctamente", id: result.insertId });
  } catch (error) {
    console.error("💥 Error en register:", error);
    return res.status(500).json({ message: "Error al registrar usuario demo" });
  }
};

// === HELPERS ===
const buscarOCrearUsuario = async ({ email, nombre, imagen }) => {
  const [rows] = await pool.query("SELECT * FROM usuarios WHERE email = ?", [email]);
  if (rows.length > 0) return rows[0];

  const [result] = await pool.query(
    "INSERT INTO usuarios (nombre, email, imagen, rol) VALUES (?, ?, ?, 'alumno')",
    [nombre, email, imagen || "/mine.png"]
  );

  return {
    id: result.insertId,
    nombre,
    email,
    imagen: imagen || "/mine.png",
    rol: "alumno",
  };
};

const registrarLogin = async (usuarioId, req) => {
  await pool.query("INSERT INTO logins (usuario_id, ip, dispositivo) VALUES (?, ?, ?)", [
    usuarioId,
    req.ip || "Desconocido",
    req.headers["user-agent"] || "Desconocido",
  ]);
};

// 🧰 Utilidad local para parsear duraciones estilo "7d" → ms
function msToNumber(str) {
  if (typeof str === "number") return str;
  const m = String(str).match(/^(\d+)(ms|s|m|h|d)$/i);
  if (!m) return 7 * 24 * 60 * 60 * 1000;
  const n = parseInt(m[1], 10);
  const unit = m[2].toLowerCase();
  const mul = { ms: 1, s: 1e3, m: 6e4, h: 36e5, d: 864e5 }[unit];
  return n * mul;
}

function formatearUsuario(user) {
  let imagenFinal;
  if (!user.imagen || user.imagen === "/default-profile.png") {
    imagenFinal = "/images/default-profile.jpg";
  } else if (String(user.imagen).startsWith("http")) {
    imagenFinal = user.imagen;
  } else {
    imagenFinal = `/uploads/${String(user.imagen).replace(/^\/uploads\//, "")}`;
  }
  return {
    id: user.id,
    nombre: user.nombre,
    email: user.email,
    rol: user.rol,
    estado_formacion: user.estado_formacion,
    fecha_registro: user.fecha_registro,
    imagen: imagenFinal,
  };
}
