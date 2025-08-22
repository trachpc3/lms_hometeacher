import express from "express";
import cors from "cors";
import path from "path";
import "dotenv/config";
import cookieParser from "cookie-parser"; // ✅ NUEVO

import { verifyToken } from "./middlewares/authMiddleware.js";

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
import fundaeRoutes from "./routes/fundaeRoutes.js";
import speakingRoutes from "./routes/speakingRoutes.js";
import actividadesRoutes from "./routes/actividadesRoutes.js";
import productiveSkillsRoutes from "./routes/productiveSkillsRoutes.js";
import testnivelRoutes from "./routes/testnivelRoutes.js";

const app = express();

// ✅ Para cookies `Secure` detrás de Nginx/HTTPS más adelante
app.set("trust proxy", 1);

// ✅ Parsers
app.use(express.json({ limit: "50mb" }));
app.use(cookieParser()); // ✅ necesario para leer refreshToken

// ========= CORS =========
// En producción iremos a MISMO ORIGEN (Nginx → /api → :5000), así que no hace falta CORS.
// En desarrollo permitimos localhost:5173 (Vite) y opcionalmente tu IP.
const isProd = process.env.NODE_ENV === "production";

if (!isProd) {
  const allowedOrigins = [
    "http://localhost:5173",
    "http://86.109.171.91:5173",
    "http://86.109.171.91:4173",
  ];

  app.use(
    cors({
      origin(origin, cb) {
        if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
        return cb(new Error("Not allowed by CORS"));
      },
      credentials: true, // por si pruebas refresh en dev
    })
  );

  // Preflight solo en dev (en prod no es necesario si es mismo origen)
  app.options("*", (req, res) => res.sendStatus(204));
}

// ✅ Archivos estáticos
app.use(express.static(path.join(process.cwd(), "public")));
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
app.use("/api/testnivel", testnivelRoutes);

// ✅ Error handler genérico
app.use((err, req, res, next) => {
  console.error("💥 Error interno:", err);
  res.status(500).json({ error: "Error interno del servidor" });
});

// ✅ Log de rutas registradas (opcional)
if (process.env.NODE_ENV !== "production" && app._router?.stack) {
  app._router.stack.forEach((r) => {
    if (r.route && r.route.path) console.log(`🔹 Ruta registrada: ${r.route.path}`);
  });
}

// ✅ Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});
