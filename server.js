// server.js
import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

import { verifyToken, logAuth } from "./middlewares/authMiddleware.js";

// Rutas
import authRoutes from "./routes/authRoutes.js";
import unidadesRoutes from "./routes/unidadesRoutes.js";
import sentencesRoutes from "./routes/sentencesRoutes.js";
import situationsRoutes from "./routes/situationsRoutes.js";
import listeningRoutes from "./routes/listeningRoutes.js";
import grammarRoutes from "./routes/grammarRoutes.js";
import vocabularyRoutes from "./routes/vocabularyRoutes.js";
import writingRoutes from "./routes/writingRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import alumnosRoutes from "./routes/alumnosRoutes.js";
import renovacionesRoutes from "./routes/renovacionesRoutes.js";
import progressRoutes from "./routes/progressRoutes.js";
import statsRoutes from "./routes/statsRoutes.js";
import processRoutes from "./routes/processRoutes.js";
import usersRoutes from "./routes/usersRoutes.js";
import fundaeRoutes from "./routes/fundaeRoutes.js";
import speakingRoutes from "./routes/speakingRoutes.js";
import actividadesRoutes from "./routes/actividadesRoutes.js";
import productiveSkillsRoutes from "./routes/productiveSkillsRoutes.js";
import testnivelRoutes from "./routes/testnivelRoutes.js";
import profesoresRoutes from "./routes/profesoresRoutes.js";
import mensajesRoutes from "./routes/mensajesRoutes.js";
import notificacionesRoutes from "./routes/notificacionesRoutes.js";

// __dirname para ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const isProd = process.env.NODE_ENV === "production";

// Trust proxy (para cookies Secure con HTTPS detrás de proxy)
app.set("trust proxy", 1);

// Parsers
app.use(express.json({ limit: "50mb" }));
app.use(cookieParser());

// ✅ Archivos estáticos
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));
app.use("/api/uploads", express.static(path.join(__dirname, "public/uploads")));
app.use(express.static(path.join(__dirname, "public")));

// ✅ CORS para desarrollo y producción
const allowedOrigins = isProd
  ? ["https://nuevo.campusvirtualhometeacher.es"]
  : [
      "http://localhost:5173",
      "http://86.109.171.91:5173",
      "http://86.109.171.91:4173",
      "http://86.109.171.91",
    ];

app.use(
  cors({
    origin(origin, cb) {
      if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
      return cb(new Error("Not allowed by CORS"));
    },
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

app.options("*", cors()); // preflight requests

// =========================
//       RUTAS API
// =========================

// Público (auth: login, google, refresh, logout, forgot/reset, register)
app.use("/api/auth", authRoutes);

// Protegidas (requieren JWT - access token)
app.use("/api/unidades", verifyToken, unidadesRoutes);
app.use("/api/sentences", verifyToken, sentencesRoutes);
app.use("/api/situations", verifyToken, situationsRoutes);
app.use("/api/listening", verifyToken, listeningRoutes);
app.use("/api/grammar", verifyToken, grammarRoutes);
app.use("/api/vocabulary", verifyToken, vocabularyRoutes);
app.use("/api/writing", verifyToken, writingRoutes);
app.use("/api/dashboard", verifyToken, dashboardRoutes);
app.use("/api/alumnos", verifyToken, alumnosRoutes);
app.use("/api/renovaciones", verifyToken, renovacionesRoutes);
app.use("/api/progress", verifyToken, progressRoutes);
app.use("/api/stats", verifyToken, statsRoutes);
app.use("/api/process", verifyToken, processRoutes);
app.use("/api/users", verifyToken, usersRoutes);
app.use("/api/fundae", verifyToken, fundaeRoutes);
app.use("/api/speaking", verifyToken, speakingRoutes);
app.use("/api/actividades", verifyToken, actividadesRoutes);
app.use("/api/productive-skills", verifyToken, productiveSkillsRoutes);
app.use("/api/testnivel", verifyToken, testnivelRoutes);
app.use("/api/profesores", verifyToken, profesoresRoutes);
app.use("/api/mensajes", verifyToken, logAuth, mensajesRoutes);
app.use("/api/notificaciones", verifyToken, notificacionesRoutes);

// Error handler genérico
app.use((err, req, res, next) => {
  console.error("💥 Error interno:", err);
  res.status(500).json({ error: "Error interno del servidor" });
});

// Log de rutas (solo en desarrollo)
if (!isProd && app._router?.stack) {
  app._router.stack.forEach((r) => {
    if (r.route && r.route.path) {
      console.log(`🔹 Ruta registrada: ${r.route.path}`);
    }
  });
}

// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});
