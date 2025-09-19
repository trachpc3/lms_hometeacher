// src/utils/getAvatarUrl.js
import { API_BASE_URL } from "@/config";

// Quita "/api" del final para obtener el origen base del backend
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

  // 2) Si ya es URL absoluta (CDN, Google, etc.)
  if (/^https?:\/\//i.test(imagen)) {
    return imagen.includes("?") ? `${imagen}&t=${Date.now()}` : `${imagen}?t=${Date.now()}`;
  }

  // 3) Si el backend ya nos manda la ruta del asset público, respétala
  if (imagen.startsWith("/assets/")) {
    return imagen; // no añadir ORIGIN ni cache-buster
  }

  // 4) Si viene en formato público del backend (/uploads/...), respétalo
  if (imagen.startsWith("/uploads/")) {
    return `${ORIGIN}${imagen}?t=${Date.now()}`;
  }

  // 5) Nombre suelto (user_12.jpg) => compón como avatar en el backend
  const clean = imagen.replace(/^\/+/, "");
  return `${ORIGIN}/uploads/avatars/${clean}?t=${Date.now()}`;
}
