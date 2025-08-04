import { API_BASE_URL } from '../config';
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import {
  CheckCircle,
  Mic,
  Pencil,
  HelpCircle,
  ArrowLeft,
} from "lucide-react";
import logo from "../assets/loog.png";
import TutorialModal from "../components/TutorialModal";

const ProductiveSkills = () => {
  const { unitId } = useParams();
  const userId = localStorage.getItem("userId") || 1;

  const [actividadId, setActividadId] = useState(null);
  const [prompts, setPrompts] = useState({ writing: "", speaking: "" });
  const [writingText, setWritingText] = useState("");
  const [correctedText, setCorrectedText] = useState(null);
  const [view, setView] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);

  const [recording, setRecording] = useState(false);
  const [recorder, setRecorder] = useState(null);
  const [recordingUrl, setRecordingUrl] = useState(null);
  const [recordingTimeout, setRecordingTimeout] = useState(null);

  const [showSuccessModal, setShowSuccessModal] = useState(false);


  useEffect(() => {
    const fetchActividadId = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/actividades/unidad/${unitId}/productiveSkills`);
        const actividad = await res.json();
        setActividadId(actividad.id);
      } catch (err) {
        console.error("❌ Error cargando actividad ProductiveSkills:", err.message);
      }
    };

    const fetchPrompts = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/actividades/unidad/${unitId}/productiveSkills/prompts`);
        const data = await res.json();
        setPrompts(data);
      } catch (err) {
        console.error("❌ Error cargando prompts:", err.message);
      }
    };

    fetchActividadId();
    fetchPrompts();
  }, [unitId]);

  const handleWritingSubmit = () => {
  setIsSubmitting(true);

  setTimeout(() => {
    setIsSubmitting(false);
    setCorrectedText(null); // Puedes dejarlo en null o mostrar un mensaje si lo prefieres
    setShowSuccessModal(true); // Muestra el modal de confirmación
  }, 1000); // Simula una espera de 1 segundo
};

  


  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const chunks = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        setRecordingUrl(url);
        stream.getTracks().forEach((track) => track.stop());
        setRecorder(null);
      };

      mediaRecorder.start();
      setRecorder(mediaRecorder);
      setRecording(true);

      const timeout = setTimeout(() => {
        mediaRecorder.stop();
        setRecording(false);
      }, 2 * 60 * 1000); // 2 minutos

      setRecordingTimeout(timeout);
    } catch (err) {
      console.error("🎙️ No se pudo acceder al micrófono:", err);
    }
  };

  const stopRecording = () => {
    if (recorder) recorder.stop();
    if (recordingTimeout) clearTimeout(recordingTimeout);
    setRecording(false);
  };

  const handleAudioSubmit = () => {
    setShowSuccessModal(true);

  };

  const clearAudio = () => {
    setRecordingUrl(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-white">
      <header className="sticky top-0 bg-white shadow-md flex justify-between px-6 py-4 border-b z-50">
        <Link to="/home" className="flex items-center gap-4">
          <img src={logo} alt="Logo" className="h-10" />
          <h1 className="text-2xl font-bold text-gray-800">Unit {unitId}: Productive Skills</h1>
        </Link>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsTutorialOpen(true)}
            className="flex items-center gap-2 bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            <HelpCircle size={20} /> Tutorial
          </button>
          <Link
            to={`/unidad/${unitId}`}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg font-semibold hover:bg-gray-400 flex items-center gap-2"
          >
            <ArrowLeft size={24} /> Volver
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-6">
        <div className="bg-white shadow-lg rounded-xl p-6 max-w-4xl w-full border space-y-6">
          {/* 🗒️ Prompts */}
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-xl shadow-sm">
            <h2 className="text-xl font-bold text-blue-800 mb-2">📝 Writing Topic:</h2>
            <p className="text-gray-700">{prompts.writing || "Cargando tema de escritura..."}</p>
            <hr className="my-4" />
            <h2 className="text-xl font-bold text-red-700 mb-2">🎤 Speaking Topic:</h2>
            <p className="text-gray-700">{prompts.speaking || "Cargando tema de expresión oral..."}</p>
          </div>

          {/* Selección de tareas */}
          {!view && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <button
                onClick={() => setView("writing")}
                className="bg-blue-600 text-white p-6 rounded-2xl shadow-lg flex flex-col items-center hover:bg-blue-700"
              >
                <Pencil size={48} />
                <span className="mt-4 text-xl font-semibold">Start Writing Task</span>
              </button>
              <button
                onClick={() => setView("speaking")}
                className="bg-red-600 text-white p-6 rounded-2xl shadow-lg flex flex-col items-center hover:bg-red-700"
              >
                <Mic size={48} />
                <span className="mt-4 text-xl font-semibold">Start Speaking Task</span>
              </button>
            </div>
          )}

          {/* ✍️ Writing */}
          {view === "writing" && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-800">Writing Task</h2>
              <textarea
                value={writingText}
                onChange={(e) => setWritingText(e.target.value)}
                className="w-full h-40 p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400"
                placeholder="Write your answer here..."
              />
              <div className="flex gap-3 flex-wrap">
              <button
  onClick={handleWritingSubmit}
  disabled={isSubmitting || writingText.trim() === ""}
  className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-50"
>
  {isSubmitting ? "Enviando..." : "Enviar tarea"}
</button>
  
                <button
                  onClick={() => setWritingText("")}
                  className="bg-gray-300 text-gray-800 px-6 py-3 rounded-xl hover:bg-gray-400"
                >
                  Borrar todo
                </button>
                <button
                  onClick={() => setView(null)}
                  className="bg-yellow-100 text-yellow-900 px-6 py-3 rounded-xl hover:bg-yellow-200"
                >
                  Cambiar tarea
                </button>
              </div>

              {correctedText && (
                <div className="mt-6 p-4 border border-green-400 bg-green-50 rounded-xl">
                  <h3 className="font-bold text-green-800 mb-2 flex items-center gap-2">
                    <CheckCircle className="text-green-600" /> Corrected Text
                  </h3>
                  <p className="text-gray-700 whitespace-pre-line">{correctedText}</p>
                </div>
              )}
            </div>
          )}

          {/* 🎤 Speaking */}
          {view === "speaking" && (
  <div className="space-y-4 text-center">
    <h2 className="text-2xl font-bold text-gray-800">Speaking Task</h2>
    <p className="text-gray-600">Tienes un máximo de 2 minutos para grabar tu respuesta.</p>

    {/* 🔴 Indicador de grabación */}
    {recording && (
      <div className="flex items-center justify-center gap-3 text-red-600 font-semibold text-lg animate-pulse">
        <div className="w-3 h-3 bg-red-600 rounded-full animate-ping"></div>
        Grabando...
      </div>
    )}

    <div className="flex flex-wrap justify-center gap-4">
      <button
        onClick={startRecording}
        disabled={recording}
        className="bg-red-600 text-white px-6 py-3 rounded-xl hover:bg-red-700 disabled:opacity-50"
      >
        🎙️ Grabar
      </button>
      <button
        onClick={stopRecording}
        disabled={!recording}
        className="bg-gray-600 text-white px-6 py-3 rounded-xl hover:bg-gray-700 disabled:opacity-50"
      >
        ⏹️ Parar
      </button>
      <button
        onClick={() => setView(null)}
        className="bg-yellow-100 text-yellow-900 px-6 py-3 rounded-xl hover:bg-yellow-200"
      >
        Cambiar tarea
      </button>
    </div>

    {/* 🎧 Reproductor + acciones */}
    {recordingUrl && (
      <div className="mt-4 space-y-2">
        <audio controls src={recordingUrl} className="w-full max-w-md mx-auto" />
        <div className="flex justify-center gap-4 flex-wrap mt-2">
          <button
            onClick={handleAudioSubmit}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Enviar audio
          </button>
          <button
            onClick={clearAudio}
            className="bg-gray-300 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-400"
          >
            Borrar grabación
          </button>
        </div>
      </div>
    )}
  </div>
)}

        </div>
        {showSuccessModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-2xl shadow-xl max-w-sm w-full text-center animate-fade-in">
      <CheckCircle className="text-green-500 mx-auto" size={48} />
      <h2 className="text-xl font-bold text-gray-800 mt-4">¡Tarea enviada!</h2>
      <p className="text-gray-600 mt-2">Tu respuesta ha sido enviada para revisión del tutor.</p>
      <button
        onClick={() => setShowSuccessModal(false)}
        className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
      >
        Cerrar
      </button>
    </div>
  </div>
)}

      </main>

      <TutorialModal
        open={isTutorialOpen}
        onClose={() => setIsTutorialOpen(false)}
        title="¿Cómo aprovechar esta actividad?"
        description="Elige si quieres practicar tu escritura o expresión oral, completa la tarea y recibirás feedback."
        points={[
          "Selecciona 'Writing' o 'Speaking' para comenzar.",
          "Sigue las instrucciones y envía tu respuesta al tutor.",
          "Tu progreso se marcará como completado automáticamente.",
        ]}
      />
    </div>
  );
};

export default ProductiveSkills;
