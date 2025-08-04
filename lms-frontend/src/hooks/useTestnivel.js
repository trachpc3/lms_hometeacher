import { useEffect, useState } from "react";
import { getTestQuestions, submitTestResult } from "../services/testnivelService";

const niveles = ["A1", "A2", "B1", "B2"];

  const useTestnivel = () => {
  const [nivelIndex, setNivelIndex] = useState(0);
  const [preguntas, setPreguntas] = useState([]);
  const [current, setCurrent] = useState(0);
  const [aciertos, setAciertos] = useState(0);
  const [finalizado, setFinalizado] = useState(false);
  const [nivelFinal, setNivelFinal] = useState(null);
  const [loading, setLoading] = useState(true);

  const nivelActual = niveles[nivelIndex];
  const preguntaActual = preguntas[current];

  // 🔁 Carga preguntas cuando cambia el nivel o se hace reset
  useEffect(() => {
    if (finalizado) return; // no cargar preguntas si ya terminó

    const cargar = async () => {
      setLoading(true);
      try {
        const res = await getTestQuestions(nivelActual, 5);
        setPreguntas(res.questions || []);
        setCurrent(0);
        setAciertos(0);
      } catch (err) {
        setPreguntas([]);
        console.error("❌ Error al cargar preguntas:", err);
      } finally {
        setLoading(false);
      }
    };

    cargar();
  }, [nivelIndex, finalizado]);

  // ✅ Procesa respuesta
  const responder = (opcion) => {
    const pregunta = preguntas[current];
    if (!pregunta) return;

    if (opcion === pregunta.correct_option) {
      setAciertos((prev) => prev + 1);
    }

    const siguiente = current + 1;
    if (siguiente < preguntas.length) {
      setCurrent(siguiente);
    } else {
      evaluarNivel();
    }
  };

  // 📊 Evalúa si sube de nivel o termina
  const evaluarNivel = () => {
    if (aciertos >= 4 && nivelIndex < niveles.length - 1) {
      setNivelIndex((prev) => prev + 1);
    } else {
      terminar(niveles[nivelIndex]);
    }
  };

  // 🧾 Finaliza test
  const terminar = async (nivel) => {
    setFinalizado(true);
    setNivelFinal(nivel);
    try {
      await submitTestResult(nivel);
    } catch (err) {
      console.error("❌ Error al enviar resultado:", err);
    }
  };

  // 🔄 Reiniciar test desde cero
  const reset = () => {
    setNivelIndex(0);
    setPreguntas([]);
    setCurrent(0);
    setAciertos(0);
    setFinalizado(false);
    setNivelFinal(null);
    setLoading(true); // Para que entre al useEffect y recargue
  };

  return {
    nivelActual,
    preguntaActual,
    responder,
    finalizado,
    nivelFinal,
    reset,
    loading,
    current,
    total: preguntas.length,
  };
};

export default useTestnivel;
