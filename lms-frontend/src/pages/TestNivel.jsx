import { useTestNivel } from "../hooks/useTestNivel";
import { BookText, ChevronRight } from "lucide-react";
import logo from "../assets/loog.png";
import { Phone, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";

export default function TestNivel() {
  const navigate = useNavigate();
  const {
    preguntaActual,
    responder,
    finalizado,
    nivelFinal,
    reset,
    loading,
    total,
    current,
  } = useTestNivel();

  if (loading) return <div className="text-center py-10">Cargando...</div>;

  if (finalizado) {
  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50">
      <Header navigate={navigate} />
      <div className="mt-16 bg-white p-8 rounded-3xl shadow-xl text-center max-w-md animate-fade-in">
        <div className="text-blue-600 mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-16 h-16 mx-auto"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold mb-2">
          ¡Nivel estimado alcanzado!
        </h2>
        <p className="text-gray-700 mb-6">
          Según tus respuestas, tu nivel recomendado es:{" "}
          <span className="text-blue-600 font-semibold">{nivelFinal}</span>.
        </p>
        <p className="text-sm text-gray-500 mb-6">
          Te recomendamos comenzar por el curso <strong>{nivelFinal}</strong>,
          o elegir uno combinado si quieres reforzar.
        </p>
        <button
          onClick={reset}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          Volver a empezar
        </button>
      </div>
    </div>
  );
}


  return (
    <div className="min-h-screen bg-gray-50">
      <Header navigate={navigate} />

      <div className="flex flex-col items-center mt-10 px-4">
        {/* Progreso */}
        <div className="w-full max-w-md mb-4">
          <div className="h-2 bg-gray-300 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 transition-all duration-500"
              style={{ width: `${((current + 1) / total) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-md">
          <div className="flex items-center gap-2 mb-4 text-lg font-medium text-gray-800">
            <BookText className="w-6 h-6 text-blue-600" />
            <span>{preguntaActual.question}</span>
          </div>

          <div className="space-y-3">
            {["a", "b", "c", "d"]
              .filter((key) => preguntaActual[`option_${key}`])
              .map((key, index) => (
                <button
                  key={key}
                  onClick={() => responder(key.toUpperCase())}
                  className={clsx(
                    "flex items-center justify-between w-full border px-4 py-2 rounded-lg transition-all duration-200",
                    "hover:bg-blue-50 hover:border-blue-400 hover:text-blue-600",
                    "text-left text-gray-800 border-gray-300"
                  )}
                >
                  <span>{preguntaActual[`option_${key}`]}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const Header = ({ navigate }) => (
  <header className="bg-white shadow-md px-4 py-1 flex justify-between items-center w-full border-b border-gray-300">
    <img src={logo} alt="Logo" className="h-16 w-auto" />
    <div className="flex items-center gap-4">
      <a
        href="https://calendly.com/hometeacher-empresas"
        target="_blank"
        rel="noopener noreferrer"
        className="bg-blue-600 text-white font-semibold px-4 py-2 rounded-md hover:bg-blue-700 transition flex items-center gap-2"
      >
        <Phone size={18} />
        ¿Te llamamos?
      </a>
      <a
        href="https://calendly.com/hometeacher-empresas"
        target="_blank"
        rel="noopener noreferrer"
        className="border border-blue-600 text-blue-600 font-semibold px-4 py-2 rounded-md hover:bg-blue-600 hover:text-white transition flex items-center gap-2"
      >
        <Phone size={18} />
        ¿Necesitas financiación?
      </a>
      <button
        onClick={() => navigate("/home")}
        className="w-10 h-10 flex items-center justify-center border border-blue-600 rounded-full text-blue-600 hover:bg-blue-600 hover:text-white transition"
      >
        <X size={24} />
      </button>
    </div>
  </header>
);
