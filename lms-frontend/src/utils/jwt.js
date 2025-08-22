import jwt from "jsonwebtoken";

const ACCESS_EXPIRES_IN = process.env.JWT_ACCESS_EXPIRES || "15m";
const REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES || "7d";

export function signAccessToken(user) {
  const payload = { sub: user.id, rol: user.rol };
  return jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: ACCESS_EXPIRES_IN });
}

export function signRefreshToken(user) {
  const payload = { sub: user.id, typ: "refresh" };
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: REFRESH_EXPIRES_IN });
}

export function verifyRefreshToken(token) {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
}
