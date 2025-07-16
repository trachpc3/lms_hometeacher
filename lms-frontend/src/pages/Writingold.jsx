import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react"; // Icono para volver

const Writing = () => {
  // Frases con huecos y pistas
  const textData = [
    { sentence: "Last summer, I", hint: "(travel)", correct: "traveled" },
    { sentence: "to Spain with my family. We", hint: "(stay)", correct: "stayed" },
    { sentence: "in a small hotel near the beach. Every day, we", hint: "(go)", correct: "went" },
    { sentence: "to the beach and", hint: "(swim)", correct: "swam" },
    { sentence: "in the sea. It", hint: "(be)", correct: "was" },
    { sentence: "very sunny and warm, so we", hint: "(have)", correct: "had" },
    { sentence: "a great time!", hint: "", correct: "" }, // Última parte sin input
  ];

  // Estado para respuestas
  const [answers, setAnswers] = useState(textData.map(() => ""));
  const [results, setResults] = useState([]);

  // Función para manejar cambios en los inputs
  const handleChange = (index, value) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  // Función para comprobar respuestas
  const checkAnswers = () => {
    const newResults = textData.map((item, index) => ({
      correct: item.correct.toLowerCase() === answers[index].toLowerCase(),
      correctAnswer: item.correct,
    }));
    setResults(newResults);
  };

  return (
    <div className="max-w-4xl mx-auto p-10 bg-white shadow-lg rounded-lg">
      {/* Botón de volver */}
      <Link to="/unidad-1" className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow transition mb-6">
        <ArrowLeft size={24} />
        <span className="text-lg font-semibold">Volver</span>
      </Link>

      <h1 className="text-4xl font-bold text-gray-800 mb-4">Writing Activity</h1>
      <p className="text-lg text-gray-600 mb-6">
        Completa el siguiente párrafo con la forma correcta de los verbos en paréntesis.
      </p>

      {/* Texto con inputs */}
      <div className="text-xl text-gray-800 leading-relaxed">
        {textData.map((item, index) => (
          <span key={index} className="mr-2">
            {item.sentence}{" "}
            {item.hint && (
              <>
                <span className="text-gray-500">({item.hint})</span>{" "}
                <input
                  type="text"
                  value={answers[index]}
                  onChange={(e) => handleChange(index, e.target.value)}
                  className={`border-b-2 px-2 focus:outline-none ${
                    results.length > 0 ? (results[index].correct ? "border-green-500" : "border-red-500") : "border-gray-500"
                  }`}
                />
              </>
            )}
          </span>
        ))}
      </div>

      {/* Botón para comprobar respuestas */}
      <button
        onClick={checkAnswers}
        className="mt-6 bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg shadow transition"
      >
        Comprobar respuestas
      </button>

      {/* Resultados */}
      {results.length > 0 && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold text-gray-700">Corrección:</h2>
          <ul className="mt-2">
            {results.map((result, index) => (
              <li key={index} className={`text-lg ${result.correct ? "text-green-600" : "text-red-600"}`}>
                {result.correct ? "✔️ Correcto" : `❌ Incorrecto - Respuesta correcta: ${result.correctAnswer}`}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Writing;
