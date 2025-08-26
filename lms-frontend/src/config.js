// src/config.js

// Lee env
const RAW_API = import.meta.env.VITE_API_BASE_URL || "http://86.109.171.91/api";
const RAW_UPLOADS = import.meta.env.VITE_API_UPLOADS_URL || "http://86.109.171.91/uploads";

// Convierte a absoluta si empieza por "/"
const toAbs = (base) => {
  if (!base) return window.location.origin;
  if (/^https?:\/\//i.test(base)) return base.replace(/\/$/, "");
  // relativo (ej. "/api" o "/uploads")
  return `${window.location.origin}${base}`.replace(/\/$/, "");
};

export const API_BASE_URL = toAbs(RAW_API);          // p.ej. http://86.109.171.91/api
export const API_UPLOADS_URL = toAbs(RAW_UPLOADS);   // p.ej. http://86.109.171.91/uploads

export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";
export const FACEBOOK_APP_ID = import.meta.env.VITE_FACEBOOK_APP_ID || "";

/* ---------- Helpers útiles en todo el front ---------- */
const trim = (s) => String(s || "").replace(/^\/+|\/+$/g, "");
export const joinUrl = (base, path = "") => `${trim(base)}/${trim(path)}`;
export const withCB = (u) => (u.includes("?") ? `${u}&t=${Date.now()}` : `${u}?t=${Date.now()}`);

/** Construye URL de API: buildApiUrl("/sentences/1") → http://host/api/sentences/1 */
export const buildApiUrl = (path) => joinUrl(API_BASE_URL, path);

/** Construye URL de uploads desde filename o path:
 * - buildUploadSrc("ana.png")
 * - buildUploadSrc("/uploads/ana.png")
 * - buildUploadSrc("profiles/ana.png")
 */
export const buildUploadSrc = (raw) => {
  if (!raw) return withCB(joinUrl(API_UPLOADS_URL, "default-profile.jpg"));
  if (/^https?:\/\//i.test(raw)) return withCB(raw);
  const fname = String(raw).replace(/^\/?uploads\//, ""); // quita prefijo duplicado
  return withCB(joinUrl(API_UPLOADS_URL, fname));
};
