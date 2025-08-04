import { API_BASE_URL } from '../config';
const API_URL = API_BASE_URL;

export const getImagePath = (imagen) => {
  if (!imagen || imagen === "default-profile.jpg") {
    return `${API_URL}/uploads/default-profile.jpg`;
  }

  // Si ya es una URL absoluta, devuélvela tal cual
  if (imagen.startsWith("http")) {
    return imagen;
  }

  // Timestamp para evitar cache
  const timestamp = `?t=${Date.now()}`;

  // Si ya empieza con /uploads
  if (imagen.startsWith("/uploads")) {
    return `${API_URL}${imagen}${timestamp}`;
  }

  // Si solo viene el nombre de archivo
  return `${API_URL}/uploads/${imagen}${timestamp}`;
};
