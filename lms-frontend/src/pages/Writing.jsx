import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Loader2, HelpCircle } from "lucide-react";
import axios from "axios";
import logo from "../assets/loog.png";

const Writing = () => {
  const { unitId } = useParams();
  const [text, setText] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  const handleCorrection = async () => {
    if (!text.trim()) {
      setFeedback("Por favor, escribe un texto antes de corregir.");
      return;
    }
    setLoading(true);
    setFeedback("");
    try {
      const response = await axios.post("http://localhost:5000/api/writing/correct-writing", { text });
      setFeedback(response.data.correctedText);
    } catch (error) {
      setFeedback("Error al corregir el texto. Inténtalo de nuevo más tarde.");
    }
    setLoading(false);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <header className="sticky top-0 w-full bg-white shadow-md flex items-center justify-between px-6 py-4 border-b z-50">
        <Link to="/home" className="flex items-center gap-4">
          <img src={logo} alt="Logo" className="h-10 w-auto cursor-pointer" />
          <h1 className="text-2xl font-bold text-gray-800">Unit {unitId}: Writing</h1>
        </Link>
        <div className="flex items-center gap-4">
          <button
            className="flex items-center gap-2 bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            <HelpCircle size={20} />
            Tutorial
          </button>
          <Link to={`/unidad/${unitId}/previous`} className="flex items-center gap-2 bg-gray-300 text-gray-800 font-semibold px-4 py-2 rounded-lg hover:bg-gray-400 transition">
            <ArrowLeft size={24} />
            Volver
          </Link>
          <Link to={`/unidad/${unitId}/next`} className="flex items-center gap-2 bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition">
            Siguiente
            <ArrowRight size={20} />
          </Link>
        </div>
      </header>

      <div className="flex flex-col items-center p-6 bg-white shadow-lg rounded-lg max-w-4xl mx-auto flex-1">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Writing Activity</h1>
        <p className="text-lg text-gray-600 mb-6">
          Escribe una redacción sobre <strong>el tiempo en tu ciudad</strong>. Luego, haz clic en
          "Enviar a tu tutor" para recibir sugerencias de gramática y ortografía.
        </p>

        <textarea
          className="w-full h-48 p-4 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
          placeholder="Escribe aquí tu redacción..."
          value={text}
          onChange={handleTextChange}
        ></textarea>

        <button
          onClick={handleCorrection}
          className="mt-4 bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg shadow transition flex items-center gap-2"
          disabled={loading}
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : "Enviar a tu tutor"}
        </button>

        {feedback && (
          <div className="mt-6 p-4 bg-gray-100 border rounded-lg shadow w-full">
            <h2 className="text-lg font-semibold">Corrección:</h2>
            <p className="text-gray-700 mt-2">{feedback}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Writing;
