// src/utils/getAvatarUrl.js
import { API_BASE_URL } from "@/config";

const ORIGIN = API_BASE_URL.replace(/\/api\/?$/, "");
const DEFAULT = "/assets/img/default-profile.png";

export function getAvatarUrl(imagen) {
  // 1) Sin imagen o marcadores antiguos => asset público
  if (
    !imagen ||
    imagen === "default-profile.png" ||
    imagen === "/default-profile.png" ||
    imagen === "/default-profile.jpg"
  ) {
    return DEFAULT;
  }

  // 2) URL absoluta
  if (/^https?:\/\//i.test(imagen)) {
    return imagen.includes("?") ? `${imagen}&t=${Date.now()}` : `${imagen}?t=${Date.now()}`;
  }

  // 3) Si el backend ya envía un asset del frontend, no tocar
  if (imagen.startsWith("/assets/")) {
    return imagen; // no ORIGIN, no cache-buster
  }

  // 4) Si ya es una ruta pública del backend
  if (imagen.startsWith("/uploads/")) {
    return `${ORIGIN}${imagen}?t=${Date.now()}`;
  }

  // 5) Nombre suelto (user_12.jpg) -> avatars del backend
  const clean = imagen.replace(/^\/+/, "");
  return `${ORIGIN}/uploads/avatars/${clean}?t=${Date.now()}`;
}
