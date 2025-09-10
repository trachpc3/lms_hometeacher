// src/config.js

// ▶︎ En .env de prod pon VITE_API_BASE_URL=/api y VITE_API_UPLOADS_URL=/uploads
const RAW_API     = import.meta.env.VITE_API_BASE_URL     || "/api";
const RAW_UPLOADS = import.meta.env.VITE_API_UPLOADS_URL  || "/uploads";

// Convierte a absoluta si empieza por "/"
const toAbs = (base) => {
  if (!base) return window.location.origin;
  if (/^https?:\/\//i.test(base)) return base.replace(/\/$/, "");
  // relativo (ej. "/api" o "/uploads")
  return `${window.location.origin}${base}`.replace(/\/$/, "");
};

export const API_BASE_URL     = toAbs(RAW_API);     // p.ej. https://nuevo.../api
export const API_UPLOADS_URL  = toAbs(RAW_UPLOADS); // p.ej. https://nuevo.../uploads

export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";
export const FACEBOOK_APP_ID  = import.meta.env.VITE_FACEBOOK_APP_ID || "";

/* ---------- Helpers ---------- */
const trim = (s) => String(s || "").replace(/^\/+|\/+$/g, "");
export const joinUrl = (base, path = "") => `${trim(base)}/${trim(path)}`;
export const withCB  = (u) => (u.includes("?") ? `${u}&t=${Date.now()}` : `${u}?t=${Date.now()}`);

/** Construye URL de API: buildApiUrl("/sentences/1") → https://host/api/sentences/1 */
export const buildApiUrl = (path) => joinUrl(API_BASE_URL, path);

/**
 * Construye URL de uploads desde filename o path.
 * - Acepta URL absoluta → la devuelve tal cual + cache-buster.
 * - Acepta cosas como: "user_12.jpg", "/uploads/user_12.jpg", "avatars/foto.png", "listening/unit1/001.mp3"
 * - Si no hay valor → usa fallback "avatars/default-profile.jpg"
 */
export const buildUploadSrc = (raw, { defaultPath = "avatars/default-profile.jpg" } = {}) => {
  if (!raw) return withCB(joinUrl(API_UPLOADS_URL, defaultPath));

  const val = String(raw).trim();
  if (/^https?:\/\//i.test(val)) return withCB(val);

  // quita prefijo /uploads si viene incluido
  const withoutUploads = val.replace(/^\/?uploads\//i, "");

  // si trae subcarpetas, respétalas; si es sólo nombre, asumimos avatar
  const finalPath = withoutUploads.includes("/")
    ? withoutUploads
    : `avatars/${withoutUploads}`;

  return withCB(joinUrl(API_UPLOADS_URL, finalPath));
};
