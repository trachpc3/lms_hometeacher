import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import csvParser from "csv-parser";
import { load } from "cheerio";
import { stringify } from "csv-stringify";

const router = express.Router();

// ✅ Configuración de Multer para guardar el archivo con extensión correcta
const storage = multer.diskStorage({
    destination: "uploads/",
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "-" + Date.now() + ".csv");
    },
});

const upload = multer({ storage });

// 🔹 Función para extraer textos y URLs de audios
const extractData = (html) => {
    const $ = load(html);
    let texts = [];
    let audioUrls = [];

    $("p").each((_, el) => {
        let text = $(el).text().trim();
        if (text) texts.push(text);
    });

    $("audio, source").each((_, el) => {
        let url = $(el).attr("src");
        if (url) audioUrls.push(url);
    });

    return { texts, audioUrls };
};

// 🔹 Función para extraer el ID de la unidad desde "Practice X"
const extractUnitId = (name) => {
    const match = name.match(/Practice (\d+)/);
    return match ? parseInt(match[1], 10) : null;
};

// 🔹 API para procesar el CSV
router.post("/upload-csv", upload.single("file"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No se subió ningún archivo" });
        }

        console.log("📂 Archivo recibido:", req.file.path);

        const results = [];
        const filePath = req.file.path;

        fs.createReadStream(filePath)
            .pipe(csvParser())
            .on("data", (row) => {
                if (row.contents) {
                    const { texts, audioUrls } = extractData(row.contents);

                    texts.forEach((text, index) => {
                        results.push({
                            unidad_id: extractUnitId(row.name),
                            actividad_id: 2,
                            word: text,
                            translation: "",
                            audio_url: audioUrls[index] || "",
                        });
                    });
                }
            })
            .on("end", () => {
                const outputFilePath = path.join("uploads", "processed_practice.csv");
                const writableStream = fs.createWriteStream(outputFilePath);

                stringify(results, { header: true, columns: ["unidad_id", "actividad_id", "word", "translation", "audio_url"] })
                    .pipe(writableStream)
                    .on("finish", () => {
                        console.log("✅ CSV generado:", outputFilePath);

                        res.download(outputFilePath, "processed_practice.csv", () => {
                            fs.unlinkSync(filePath);
                            fs.unlinkSync(outputFilePath);
                        });
                    });
            });
    } catch (error) {
        console.error("❌ Error procesando el archivo:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

export default router;
