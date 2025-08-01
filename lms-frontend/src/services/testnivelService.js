import api from "../api";

export const getTestQuestions = async (level, cantidad = 5) => {
  try {
    const { data } = await api.get(`/testnivel/questions?level=${level}&cantidad=${cantidad}`);
    return data;
  } catch (err) {
    console.error("Error al obtener preguntas", err);
    return { questions: [] };
  }
};

export const submitTestResult = async (level_result) => {
  try {
    await api.post("/testnivel/submit", { level_result });
  } catch (err) {
    console.error("Error al enviar resultado del test", err);
  }
};