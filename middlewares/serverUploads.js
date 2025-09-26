// middlewares/serverUploads.js

import path from "path";
import fs from "fs";
import mime from "mime-types";

const uploadsPath = path.join(process.cwd(), "uploads");

// ✅ Sirve archivos solo a usuarios autenticados
export const serveUploads = (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "No autorizado" });
  }

  const requestedFile = path.join(
    uploadsPath,
    req.params.folder || "",
    req.params.filename
  );

  // 🔐 Seguridad: evita traversal (..)
  if (!requestedFile.startsWith(uploadsPath)) {
    return res.status(403).send("Acceso prohibido");
  }

  if (!fs.existsSync(requestedFile)) {
    return res.status(404).send("Archivo no encontrado");
  }

  const mimeType = mime.lookup(requestedFile) || "application/octet-stream";
  res.setHeader("Content-Type", mimeType);

  // ✅ Enviar el archivo al cliente como stream
  const fileStream = fs.createReadStream(requestedFile);
  fileStream.pipe(res);
};
