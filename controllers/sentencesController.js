import { getSentencesByUnitAndActivity } from "../models/sentences.js";

export const getSentencesByUnit = async (req, res) => {
  try {
    const { unidadId } = req.params;
    const actividadId = 2; // ID de "Practice"

    const sentences = await getSentencesByUnitAndActivity(unidadId, actividadId);
    res.json(sentences);
  } catch (error) {
    console.error("Error fetching sentences:", error);
    res.status(500).json({ error: "Error fetching sentences" });
  }
};
