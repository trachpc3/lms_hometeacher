// util/jwt.js

// utils/jwt.js
import jwt from "jsonwebtoken";

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || "access_secret_super_seguro";
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "refresh_secret_super_seguro";

// Expiraciones
const ACCESS_EXPIRES = process.env.JWT_ACCESS_EXPIRES || "15m"; // normalmente 15 min
const REFRESH_EXPIRES = process.env.JWT_REFRESH_EXPIRES || "7d"; // normalmente 7 días

// 🔑 Firmar Access Token
export function signAccessToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      rol: user.rol,
      email: user.email,
    },
    ACCESS_SECRET,
    { expiresIn: ACCESS_EXPIRES }
  );
}

// 🔑 Firmar Refresh Token
export function signRefreshToken(user) {
  return jwt.sign(
    {
      sub: user.id,
    },
    REFRESH_SECRET,
    { expiresIn: REFRESH_EXPIRES }
  );
}

// 🔎 Verificar Refresh Token
export function verifyRefreshToken(token) {
  return jwt.verify(token, REFRESH_SECRET);
}

