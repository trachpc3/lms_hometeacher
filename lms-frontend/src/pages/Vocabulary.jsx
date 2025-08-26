import { API_BASE_URL } from '../config';
import { useState, useRef, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Mic, HelpCircle, X } from "lucide-react";
import logo from "../assets/loog.png";

const VocabularyItem = ({
  word,
  translation,
  audio_url,
  onPlay,
  onStartRecording,
  onStopRecording,
  isRecording,
  heard,
}) => (
  <div
    className={`flex items-center justify-between p-4 rounded-lg shadow transition ${
      heard ? "bg-green-200" : "bg-gray-100 hover:bg-gray-200"
    }`}
  >
    <span
      className={`text-lg font-semibold cursor-pointer ${heard ? "text-green-800" : "text-black"}`}
      onClick={() => onPlay(word, audio_url)}
    >
      {word}
    </span>
    <p className="text-sm text-gray-800 mt-1">{translation}</p>
    <button
      className={`p-2 rounded-full transition ${
        isRecording ? "bg-red-500 text-white" : "bg-blue-500 text-white"
      }`}
      onMouseDown={() => onStartRecording(word)}
      onMouseUp={() => onStopRecording(word, audio_url)}
      aria-pressed={isRecording}
    >
      <Mic size={20} />
    </button>
  </div>
);

const Vocabulary = () => {
  const { unitId } = useParams();
  const [words, setWords] = useState([]);
  const [progress, setProgress] = useState(0);
  const [heardWords, setHeardWords] = useState(new Set());
  const [recordingWord, setRecordingWord] = useState(null);
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  const [error, setError] = useState(null);

  const mediaRecorder = useRef(null);
  const recordedChunks = useRef([]);
  const audioStream = useRef(null);

  useEffect(() => {
    const fetchVocabulary = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/vocabulary/${unitId}`, {
          credentials: "include", // ✅ Envía cookies con el token
        });

        if (!response.ok) {
          throw new Error(`Error en la API: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error("La respuesta de la API no tiene el formato esperado");
        }

        setWords(data);
      } catch (error) {
        console.error("Error fetching vocabulary:", error);
        setError(error.message);
      }
    };

    fetchVocabulary();
  }, [unitId]);

  const playAudio = (word, url) => {
    if (!url) {
      console.warn("No hay archivo de audio para:", word);
      return;
    }

    const validExtensions = [".mp3", ".wav", ".ogg"];
    if (!validExtensions.some((ext) => url.toLowerCase().endsWith(ext))) {
      console.warn("Extensión de audio no válida:", url);
      return;
    }

    const fullUrl = `/uploads/vocabulary/unit${unitId}/${url}`;
    const audio = new Audio(encodeURI(fullUrl));
    audio.volume = 1;

    audio.play().catch((err) => {
      console.error("❌ Error al reproducir audio:", err);
    });
  };

  const startRecording = async (word) => {
    setRecordingWord(word);
    recordedChunks.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioStream.current = stream;
      mediaRecorder.current = new MediaRecorder(stream);

      mediaRecorder.current.ondataavailable = (event) => {
        if (event.data.size > 0) recordedChunks.current.push(event.data);
      };

      mediaRecorder.current.start();
    } catch (error) {
      console.error("Error accediendo al micrófono:", error);
    }
  };

  const stopRecording = (word, originalAudio) => {
    if (mediaRecorder.current) {
      mediaRecorder.current.stop();

      mediaRecorder.current.onstop = () => {
        const audioBlob = new Blob(recordedChunks.current, { type: "audio/wav" });
        const recordedAudioURL = URL.createObjectURL(audioBlob);
        const recordedAudio = new Audio(recordedAudioURL);
        recordedAudio.play();

        recordedAudio.onended = () => {
          playAudio(word, originalAudio);
        };

        setHeardWords((prev) => new Set([...prev, word]));
        setProgress((prev) => prev + 1);
      };

      if (audioStream.current) {
        audioStream.current.getTracks().forEach((track) => track.stop());
      }
    }

    setRecordingWord(null);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <header className="sticky top-0 w-full bg-white shadow-md flex items-center justify-between px-6 py-4 border-b z-50">
        <Link to="/home" className="flex items-center gap-4">
          <img src={logo} alt="Logo" className="h-10 w-auto cursor-pointer" />
          <h1 className="text-2xl font-bold text-gray-800">Unit {unitId}: Vocabulary</h1>
        </Link>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsTutorialOpen(true)}
            className="flex items-center gap-2 bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            <HelpCircle size={20} />
            Tutorial
          </button>
          <Link
            to={`/unidad/${unitId}`}
            className="flex items-center gap-2 bg-gray-300 text-gray-800 font-semibold px-4 py-2 rounded-lg hover:bg-gray-400 transition"
          >
            <ArrowLeft size={24} />
            Volver
          </Link>
          <Link
            to={`/unidad/${unitId}/speaking`}
            className="flex items-center gap-2 bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Siguiente
            <ArrowRight size={20} />
          </Link>
        </div>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center px-6 relative">
        {error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="bg-white shadow-lg rounded-xl p-8 max-w-6xl w-full text-center border">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {words.map((word) => (
                <VocabularyItem
                  key={word.id}
                  {...word}
                  onPlay={playAudio}
                  onStartRecording={startRecording}
                  onStopRecording={stopRecording}
                  isRecording={recordingWord === word.word}
                  heard={heardWords.has(word.word)}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {isTutorialOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center relative">
            <button
              onClick={() => setIsTutorialOpen(false)}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
            >
              <X size={24} />
            </button>
            <h2 className="text-xl font-bold mb-4">¿Cómo funciona?</h2>
            <p className="text-gray-700 mb-4">
              Haz clic en una palabra para escucharla. Mantén presionado el micrófono para grabarte y suelta para comparar.
            </p>
            <button
              onClick={() => setIsTutorialOpen(false)}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Vocabulary;
