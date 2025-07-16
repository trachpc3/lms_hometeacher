import express from "express";
import cors from "cors";
import path from "path";
import "dotenv/config";
import { verifyToken } from "./middlewares/authMiddleware.js";
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
import processRoutes from "./routes/processRoutes.js"; // JSON processor route
import usersRoutes from "./routes/usersRoutes.js";
import fundaeRoutes from './routes/fundaeRoutes.js';
import speakingRoutes from "./routes/speakingRoutes.js";
import actividadesRoutes from "./routes/actividadesRoutes.js";
import productiveSkillsRoutes from "./routes/productiveSkillsRoutes.js";



const app = express();
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "http://localhost:5173";

// ✅ CORS
app.use(
    cors({
        origin: FRONTEND_ORIGIN,
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true,
    })
);

// ✅ Headers CORS globales (extra)
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", FRONTEND_ORIGIN);
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.header("Access-Control-Allow-Credentials", "true");
    next();
});

// ✅ Preflight (OPTIONS)
app.options("*", (req, res) => {
    res.sendStatus(200);
});

// ✅ JSON Body Parser
app.use(express.json({ limit: "50mb" }));

// ✅ Archivos estáticos
app.use(express.static(path.join(process.cwd(), "public")));

// ✅ Servir archivos subidos
// app.use("/uploads", verifyToken, serveUploads);
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
app.use("/api", processRoutes); // Otros endpoints como procesamiento JSON
app.use("/api/users", usersRoutes);
app.use('/api/fundae', fundaeRoutes);
app.use("/api/speaking", speakingRoutes);
app.use("/api/actividades", actividadesRoutes);
app.use("/api/productive-skills", productiveSkillsRoutes);




// ✅ Error handler
app.use((err, req, res, next) => {
    console.error("💥 Error interno:", err);
    res.status(500).json({ error: "Error interno del servidor" });
});

// ✅ Mostrar rutas registradas (debug)
app._router.stack.forEach((r) => {
    if (r.route && r.route.path) {
        console.log(`🔹 Ruta registrada: ${r.route.path}`);
    }
});

// ✅ Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Servidor corriendo en http://localhost:${PORT}`));
