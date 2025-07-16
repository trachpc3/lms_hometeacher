import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "secreto_super_seguro";

export const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(403).json({ message: "Acceso denegado, token no proporcionado" });
    }

    try {
        const decoded = jwt.verify(token, SECRET);
        req.user = decoded;
        // console.log("👤 Usuario verificado:", decoded);
        next();
    } catch (error) {
        res.status(401).json({ message: "Token inválido o expirado" });
    }
};

export const requireRole = (roles = []) => {
    return (req, res, next) => {
        if (!roles.includes(req.user?.rol)) {
            return res.status(403).json({ message: "Permisos insuficientes" });
        }
        next();
    };
};
