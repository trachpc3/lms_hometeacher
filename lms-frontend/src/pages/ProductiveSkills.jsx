import { API_BASE_URL } from '../config';
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
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
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  // Helpers para parsear respuestas “raras”
  const parseJSONSafe = (raw) => {
    try { return raw ? JSON.parse(raw) : null; } catch { return null; }
  };
  const getToken = () =>
    localStorage.getItem("token") || localStorage.getItem("accessToken") || "";

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setErrorMsg("");

      const token = getToken();
      if (!token) {
        setErrorMsg("No hay token. Inicia sesión de nuevo.");
        setLoading(false);
        return;
      }

      try {
        // 1) Obtener la actividad ProductiveSkills de la unidad
        const actRes = await fetch(
          `${API_BASE_URL}/actividades/unidad/${unitId}/productiveSkills`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            credentials: "include",
          }
        );

        const actRaw = await actRes.text();
        if (!actRes.ok) {
          throw new Error(
            `No se pudo cargar la actividad (status ${actRes.status}): ${actRaw}`
          );
        }

        const actData = parseJSONSafe(actRaw) || {};
        // puede venir como objeto { id, ... } o array [ {id,...} ]
        const actividad =
          Array.isArray(actData) ? actData[0] : actData;

        if (!actividad?.id) {
          throw new Error("La API no devolvió un 'id' de actividad.");
        }

        setActividadId(actividad.id);

        // 2) Intentar prompts por actividadId primero
        let promptsData = null;

        // a) /productiveSkills/:actividadId/prompts
        try {
          const p1 = await fetch(
            `${API_BASE_URL}/productiveSkills/${actividad.id}/prompts`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              credentials: "include",
            }
          );
          const raw1 = await p1.text();
          if (p1.ok) {
            promptsData = parseJSONSafe(raw1);
          } else {
            // Si es 404 probamos el fallback por unidad:
            if (p1.status !== 404) {
              console.warn("⚠️ prompts por actividad devolvió error:", p1.status, raw1);
            }
          }
        } catch (e) {
          console.warn("⚠️ Error fetch prompts por actividadId:", e);
        }

        // b) fallback: /actividades/unidad/:unitId/productiveSkills/prompts
        if (!promptsData) {
          const p2 = await fetch(
            `${API_BASE_URL}/actividades/unidad/${unitId}/productiveSkills/prompts`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              credentials: "include",
            }
          );
          const raw2 = await p2.text();
          if (!p2.ok) {
            throw new Error(
              `No se pudieron cargar los prompts (status ${p2.status}): ${raw2}`
            );
          }
          promptsData = parseJSONSafe(raw2);
        }

        // Normalizar forma { writing, speaking }
        let writing = "";
        let speaking = "";

        if (promptsData) {
          // casos típicos
          writing =
            promptsData.writing ||
            promptsData.escritura ||
            promptsData.topicWriting ||
            promptsData?.writingTopic ||
            "";
          speaking =
            promptsData.speaking ||
            promptsData.oral ||
            promptsData.topicSpeaking ||
            promptsData?.speakingTopic ||
            "";

          // por si viene como array
          if (!writing && Array.isArray(promptsData)) {
            const w = promptsData.find((x) => x.tipo?.toLowerCase().includes("writing"));
            const s = promptsData.find((x) => x.tipo?.toLowerCase().includes("speaking"));
            writing = w?.texto || w?.topic || writing;
            speaking = s?.texto || s?.topic || speaking;
          }
        }

        setPrompts({
          writing: writing || "No hay topic de escritura disponible.",
          speaking: speaking || "No hay topic de expresión oral disponible.",
        });
      } catch (err) {
        console.error("❌ Error ProductiveSkills:", err);
        setErrorMsg(err.message || "Error desconocido al cargar la actividad.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [unitId]);

  const handleWritingSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setCorrectedText(null);
      setShowSuccessModal(true);
    }, 1000);
  };

  const startRecording = async () => {
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        console.warn("⚠️ getUserMedia no disponible en este navegador/dispositivo.");
        return;
      }
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
          <h1 className="text-2xl font-bold text-gray-800">
            Unit {unitId}: Productive Skills
          </h1>
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

          {/* Estados de carga / error */}
          {loading && (
            <p className="text-center text-gray-500">Cargando actividad…</p>
          )}

          {!loading && errorMsg && (
            <div className="p-4 rounded-lg border border-red-200 bg-red-50 text-red-700">
              <p className="font-semibold">No se pudo cargar la actividad.</p>
              <p className="text-sm mt-1">{errorMsg}</p>
            </div>
          )}

          {/* 🗒️ Prompts */}
          {!loading && !errorMsg && (
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-xl shadow-sm">
              <h2 className="text-xl font-bold text-blue-800 mb-2">📝 Writing Topic:</h2>
              <p className="text-gray-700">{prompts.writing || "—"}</p>
              <hr className="my-4" />
              <h2 className="text-xl font-bold text-red-700 mb-2">🎤 Speaking Topic:</h2>
              <p className="text-gray-700">{prompts.speaking || "—"}</p>
            </div>
          )}

          {/* Selección de tareas */}
          {!loading && !errorMsg && !view && (
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
          {view === "writing" && !loading && !errorMsg && (
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
          {view === "speaking" && !loading && !errorMsg && (
            <div className="space-y-4 text-center">
              <h2 className="text-2xl font-bold text-gray-800">Speaking Task</h2>
              <p className="text-gray-600">Tienes un máximo de 2 minutos para grabar tu respuesta.</p>

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
