import fs from "fs";
import csvParser from "csv-parser";
import { load } from "cheerio";
import { parse } from "json2csv";
import path from "path";
import { insertPracticeData } from "../models/practiceModel.js"; // ⬅️ Importamos la función de la BD

export const processCSV = async (req, res) => {
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
                console.log("🔹 Fila leída:", row);

                if (row.contents) {
                    const { texts, audioUrls } = extractTextAndAudio(row.contents);
                    console.log("📌 Textos extraídos:", texts);
                    console.log("🎵 Audios extraídos:", audioUrls);

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
            .on("end", async () => {
                console.log("✅ Procesamiento completado. Registros extraídos:", results.length);

                if (results.length === 0) {
                    return res.status(400).json({ error: "No se extrajo ningún dato del CSV" });
                }

                // 📌 **1️⃣ Guardar el CSV en `uploads/processed/`**
                const outputDir = "uploads/processed";
                if (!fs.existsSync(outputDir)) {
                    fs.mkdirSync(outputDir, { recursive: true });
                }

                const outputFilePath = path.join(outputDir, "processed_practice.csv");
                const csvOutput = parse(results, { fields: ["unidad_id", "actividad_id", "word", "translation", "audio_url"] });

                fs.writeFileSync(outputFilePath, csvOutput);
                console.log("✅ Archivo CSV generado:", outputFilePath);

                // 📌 **2️⃣ Insertar datos en la base de datos**
                await insertPracticeData(results);

                // 📌 **3️⃣ Descargar el archivo CSV**
                res.download(outputFilePath, "processed_practice.csv", () => {
                    console.log("✅ Archivo procesado guardado en:", outputFilePath);
                });
            });
    } catch (error) {
        console.error("❌ Error procesando el archivo:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

// 🔹 **Extraer textos y URLs de audio**
const extractTextAndAudio = (html) => {
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

// 🔹 **Extraer el ID de la unidad desde "Practice X"**
const extractUnitId = (name) => {
    const match = name.match(/Practice (\d+)/);
    return match ? parseInt(match[1], 10) : null;
};
