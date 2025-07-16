const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

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
