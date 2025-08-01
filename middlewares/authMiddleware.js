import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "secreto_super_seguro";

// Middleware para verificar el token y exponer el usuario
export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(403).json({ message: "Acceso denegado, token no proporcionado" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;       // { id, rol, ... }
    req.token = token;        // útil para futuros webhooks/logs
    next();
  } catch (error) {
    res.status(401).json({ message: "Token inválido o expirado" });
  }
};

// Middleware adicional para validar roles
export const requireRole = (roles = []) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.rol)) {
      return res.status(403).json({ message: "Permisos insuficientes" });
    }
    next();
  };
};
