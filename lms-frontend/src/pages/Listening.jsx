import { API_BASE_URL } from '../config';
import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  HelpCircle,
  X,
  PlayCircle,
  Headphones,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../assets/loog.png";

const Listening = () => {
  const { unitId } = useParams();
  const [quiz, setQuiz] = useState([]);
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/listening/${unitId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        const data = await response.json();

        if (!Array.isArray(data)) {
          console.error("❌ API no devolvió un array:", data);
          return;
        }

        setQuiz(data);
      } catch (error) {
        console.error("Error cargando preguntas de listening:", error);
      }
    };

    fetchQuestions();
  }, [unitId]);

  const handleAnswer = (questionId, optionIndex) => {
    setQuiz((prevQuiz) =>
      prevQuiz.map((q) =>
        q.id === questionId ? { ...q, selected: optionIndex, answered: true } : q
      )
    );
  };

  const playAudio = (filename) => {
    if (!filename) {
      console.warn("🎧 Archivo de audio no disponible");
      return;
    }

    const validExtensions = [".mp3", ".wav", ".ogg"];
    if (!validExtensions.some((ext) => filename.toLowerCase().endsWith(ext))) {
      console.warn("⚠️ Extensión no válida:", filename);
      return;
    }

const fullUrl = `${API_BASE_URL}/uploads/listening/unit${unitId}/${filename}`;
    
    console.log("🔊 Reproduciendo audio:", fullUrl);

    const audio = new Audio(encodeURI(fullUrl));
    audio.volume = 1;
    audio.play().catch((err) => {
      console.error("❌ Error al reproducir audio:", err);
    });
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-b from-blue-50 to-white">
      <header className="sticky top-0 w-full bg-white shadow-md flex items-center justify-between px-6 py-4 border-b z-50">
        <Link to="/home" className="flex items-center gap-4">
          <img src={logo} alt="Logo" className="h-10 w-auto cursor-pointer" />
          <h1 className="text-2xl font-bold text-gray-800">Unit {unitId}: Listening</h1>
        </Link>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsTutorialOpen(true)}
            className="flex items-center gap-2 bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            <HelpCircle size={20} />
            Tutorial
          </button>

          <Link to={`/unidad/${unitId}`} className="flex items-center gap-2 bg-gray-300 text-gray-800 font-semibold px-4 py-2 rounded-lg hover:bg-gray-400 transition">
            <ArrowLeft size={24} />
            Volver
          </Link>

          <Link to={`/unidad/${unitId}/grammar`} className="flex items-center gap-2 bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition">
            Siguiente
            <ArrowRight size={20} />
          </Link>
        </div>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-10">
        <div className="bg-white shadow-xl rounded-3xl p-10 max-w-4xl w-full border border-blue-100">
          <div className="space-y-6">
            {quiz.map((q, index) => (
              <div key={q.id} className="p-6 bg-gray-50 rounded-xl border shadow-md">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg font-bold text-gray-700">Pregunta {index + 1}</h2>
                </div>

                <button
                  className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition mb-4"
                  onClick={() => playAudio(q.audio)}
                >
                  <PlayCircle size={24} />
                  Reproducir Audio
                </button>

                <div className="space-y-2">
                  {q.options.map((option, i) => (
                    <motion.label
                      key={i}
                      className={`block p-3 rounded-lg cursor-pointer border transition text-left font-medium text-gray-700 ${
                        q.selected === i
                          ? option.correct
                            ? "bg-green-100 border-green-600"
                            : "bg-red-100 border-red-600"
                          : "border-gray-300 hover:bg-gray-100"
                      }`}
                      whileHover={{ scale: 1.02 }}
                    >
                      <input
                        type="radio"
                        name={`question-${q.id}`}
                        className="hidden"
                        onChange={() => handleAnswer(q.id, i)}
                      />
                      {option.text}
                    </motion.label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isTutorialOpen && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsTutorialOpen(false)}
          >
            <motion.div
              className="bg-white p-6 rounded-2xl shadow-xl max-w-lg text-center relative"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button onClick={() => setIsTutorialOpen(false)} className="absolute top-2 right-2 bg-gray-200 hover:bg-gray-300 text-gray-600 p-2 rounded-full">
                <X size={18} />
              </button>
              <div className="flex items-center justify-center gap-2 mb-4">
                <Headphones className="text-blue-500" size={28} />
                <h2 className="text-2xl font-bold text-gray-800">¿Cómo aprovechar esta actividad?</h2>
              </div>
              <p className="text-gray-700 mb-4 text-base">
                Escucha atentamente el audio de cada pregunta y selecciona la respuesta que mejor se ajuste.
              </p>
              <ul className="text-left list-disc list-inside space-y-2 text-gray-600">
                <li>Escucha el audio una o dos veces antes de responder.</li>
                <li>Fíjate en palabras clave o expresiones comunes.</li>
                <li>Piensa en el contexto para elegir la mejor opción.</li>
              </ul>
              <div className="mt-6 text-center">
                <button
                  onClick={() => setIsTutorialOpen(false)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  ¡Entendido!
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Listening;
