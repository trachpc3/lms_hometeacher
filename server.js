import express from "express";
import cors from "cors";
import path from "path";
import "dotenv/config";

import { verifyToken } from "./middlewares/authMiddleware.js";

// ✅ Servir archivos subidos
import { serveUploads } from "./middlewares/serverUploads.js";

// ✅ Rutas
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
import fundaeRoutes from './routes/fundaeRoutes.js';
import speakingRoutes from "./routes/speakingRoutes.js";
import actividadesRoutes from "./routes/actividadesRoutes.js";
import productiveSkillsRoutes from "./routes/productiveSkillsRoutes.js";
import testnivelRoutes from "./routes/testnivelRoutes.js"; // ✅ Agregado

const app = express();

// ✅ Lista de orígenes permitidos

const allowedOrigins = [
  "http://localhost:5173",
  "http://86.109.171.91:4173",
  "https://nuevohome.campusvirtualhometeacher.es",
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
}));

// ✅ Middleware para respuestas CORS más explícitas (útil en entornos mixtos como Vite)
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, cache-control");
  next();
});
// ✅ Preflight OPTIONS
app.options("*", (req, res) => {
  res.sendStatus(200);
});

// ✅ JSON Body Parser
app.use(express.json({ limit: "50mb" }));

// ✅ Archivos estáticos
app.use(express.static(path.join(process.cwd(), "public")));

// ✅ Servir archivos subidos
app.use("/uploads", express.static(path.join(process.cwd(), "public/uploads")));

// ✅ Rutas API
app.use("/api/auth", authRoutes);
app.use("/api/unidades", unidadesRoutes);
app.use("/api/sentences", sentencesRoutes);
app.use("/api/situations", situationsRoutes);
app.use("/api/listening", listeningRoutes);
app.use("/api/grammar", grammarRoutes);
app.use("/api/vocabulary", vocabularyRoutes);
app.use("/api/writing", writingRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/alumnos", alumnosRoutes);
app.use("/api/renovaciones", renovacionesRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api", processRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/fundae", fundaeRoutes);
app.use("/api/speaking", speakingRoutes);
app.use("/api/actividades", actividadesRoutes);
app.use("/api/productive-skills", productiveSkillsRoutes);
app.use("/api/testnivel", testnivelRoutes); // ✅ Ruta del test

// ✅ Error handler genérico
app.use((err, req, res, next) => {
  console.error("💥 Error interno:", err);
  res.status(500).json({ error: "Error interno del servidor" });
});

// ✅ Mostrar rutas registradas en consola
app._router.stack.forEach((r) => {
  if (r.route && r.route.path) {
    console.log(`🔹 Ruta registrada: ${r.route.path}`);
  }
});

// ✅ Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});
