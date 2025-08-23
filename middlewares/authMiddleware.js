// middlewares/authMiddleware.js
import jwt from "jsonwebtoken";

// Usa el secreto de access (y, si no existe, cae al viejo JWT_SECRET)
const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET || "secreto_super_seguro";

// Verifica token y expone userId/rol en req
export const verifyToken = (req, res, next) => {
  const auth = req.headers.authorization || "";
  const hasBearer = auth.startsWith("Bearer ");
  if (!hasBearer) {
    return res.status(401).json({ message: "Acceso denegado, token no proporcionado" });
  }

  const token = auth.slice(7);
  try {
    const payload = jwt.verify(token, ACCESS_SECRET);
    // compatibilidad: tokens nuevos usan `sub`, antiguos `id`
    req.userId = payload.sub || payload.id;
    req.userRole = payload.rol;
    req.user = payload;   // deja el payload por si lo usas en otros sitios
    req.token = token;
    return next();
  } catch {
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
