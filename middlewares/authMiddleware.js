import jwt from "jsonwebtoken";

// Secreto JWT
const ACCESS_SECRET =
  process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET || "secreto_super_seguro";

// Verifica token y expone userId/rol en req
export const verifyToken = (req, res, next) => {
   console.log("📥 Headers recibidos:", req.headers);
  const auth = req.headers.authorization || "";
  const hasBearer = auth.startsWith("Bearer ");

  if (!hasBearer) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("⚠️ Token no proporcionado en cabecera Authorization");
    }
    return res.status(401).json({ message: "Acceso denegado, token no proporcionado" });
  }

  const token = auth.slice(7); // Quita "Bearer "

  try {
    const payload = jwt.verify(token, ACCESS_SECRET);

    req.userId = payload.sub || payload.id; // tokens antiguos vs nuevos
    req.userRole = payload.rol;
    req.user = payload;
    req.token = token;

    if (process.env.NODE_ENV !== "production") {
      console.log("🔐 Token verificado para user ID:", req.userId, "Rol:", req.userRole);
    }

    next();
  } catch (err) {
    console.error("❌ Error al verificar token:", err.message);
    return res.status(401).json({ message: "Token inválido o expirado" });
  }
};

// Middleware de roles
export const requireRole = (roles = []) => (req, res, next) => {
  if (!req.userRole || !roles.includes(req.userRole)) {
    return res.status(403).json({ message: "Permisos insuficientes" });
  }
  next();
};

// Middleware auxiliar opcional para debug
export const logAuth = (req, _res, next) => {
  console.log("🧩 Auth Debug:", {
    userId: req.userId,
    rol: req.userRole,
    token: req.token?.slice(0, 15) + "...",
  });
  next();
};
