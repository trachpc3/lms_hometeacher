import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

export const correctWriting = async (req, res) => {
  const { text } = req.body;

  console.log("📩 Solicitud recibida en /correct-writing");
  console.log("Texto recibido:", text);

  if (!text) {
    console.error("❌ No se recibió texto en la solicitud.");
    return res.status(400).json({ error: "El texto no puede estar vacío." });
  }

  try {
    console.log("🔗 Enviando solicitud a OpenAI...");

    const response = await axios.post(
      OPENAI_API_URL,
      {
        model: "gpt-3.5-turbo-16k",
 // 🔄 Cambio de modelo a 3.5-turbo
        messages: [
          {
            role: "system",
            content:
              "Corrige el siguiente texto en inglés, mejorando gramática, ortografía y fluidez. Mantén el significado original y proporciona sugerencias de mejora.",
          },
          { role: "user", content: text },
        ],
        temperature: 0.5,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Respuesta de OpenAI recibida:", response.data);

    res.json({ correctedText: response.data.choices[0].message.content });
  } catch (error) {
    console.error("❌ Error al corregir el texto:");

    if (error.response) {
      console.error("Código de estado:", error.response.status);
      console.error("Respuesta de OpenAI:", error.response.data);
    } else {
      console.error("Error desconocido:", error.message);
    }

    res.status(500).json({ error: "Error en el servidor al procesar la corrección." });
  }
};
