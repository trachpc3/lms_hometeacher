import { API_BASE_URL } from '../config';
import { useState, useRef, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  HelpCircle,
  Mic,
  Volume2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import logo from "../assets/loog.png";
import TutorialModal from "../components/TutorialModal";

const ITEMS_PER_PAGE = 6;

const SentenceItem = ({
  sentence,
  onPlay,
  onStartRecording,
  onStopRecording,
  isRecording,
  heard,
}) => (
  <div
    className={`flex flex-col gap-2 p-4 rounded-3xl shadow-xl border transition-all duration-300 ${
      heard ? "bg-green-100" : "bg-white hover:-translate-y-1 hover:shadow-2xl"
    }`}
  >
    <div className="flex items-center justify-between">
      <span
        className={`text-lg font-semibold cursor-pointer ${
          heard ? "text-green-700" : "text-gray-900"
        }`}
        onClick={() => onPlay(sentence.sentence_text, sentence.audio)}
      >
        {sentence.sentence_text}
      </span>
      {sentence.audio &&
        [".mp3", ".wav", ".ogg"].some((ext) => sentence.audio.toLowerCase().endsWith(ext)) && (
          <button
            className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full"
            onClick={() => onPlay(sentence.sentence_text, sentence.audio)}
          >
            <Volume2 size={20} />
          </button>
        )}
    </div>
    <p className="text-sm text-gray-700 italic pl-1">{sentence.translation}</p>
    <button
      className={`flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition ${
        isRecording ? "bg-red-600 text-white" : "bg-blue-500 text-white hover:bg-blue-600"
      }`}
      onMouseDown={() => onStartRecording(sentence.sentence_text)}
      onMouseUp={() => onStopRecording(sentence.sentence_text, sentence.audio)}
      aria-pressed={isRecording}
    >
      <Mic size={18} />
      {isRecording ? "Grabando..." : "Grabar"}
    </button>
  </div>
);

const Practice = () => {
  const { unitId } = useParams();
  const [sentences, setSentences] = useState([]);
  const [progress, setProgress] = useState(0);
  const [heardSentences, setHeardSentences] = useState(new Set());
  const [recordingSentence, setRecordingSentence] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);

  const mediaRecorder = useRef(null);
  const recordedChunks = useRef([]);
  const audioStream = useRef(null);

 useEffect(() => {
  const fetchSentences = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/sentences/${unitId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        credentials: "include",
      });

      if (!response.ok) {
        console.error("❌ Error de autenticación:", response.status);
        return;
      }

      const data = await response.json();
      setSentences(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("❌ Error fetching sentences:", error);
    }
  };

  fetchSentences();
}, [unitId]);


const playAudio = (sentenceText, filename) => {
  console.log("🧪 sentenceText:", sentenceText);
  console.log("🧪 filename:", filename);

  if (!filename) {
    console.warn("⚠️ No se proporcionó filename.");
    return;
  }

  const validExtensions = [".mp3", ".wav", ".ogg"];
  if (!validExtensions.some((ext) => filename.toLowerCase().endsWith(ext))) {
    console.warn("⚠️ Extensión no válida:", filename);
    return;
  }

  const fullUrl = `${API_BASE_URL}/uploads/practice/unit${unitId}/${filename}`;
  console.log("🔊 Reproduciendo:", fullUrl);

  const audio = new Audio(encodeURI(fullUrl));
  audio.volume = 1;

  audio.play().catch((err) => {
    console.error("❌ Error al reproducir audio:", err);
  });
};


  const validExtensions = [".mp3", ".wav", ".ogg"];
  if (!validExtensions.some((ext) => filename.toLowerCase().endsWith(ext))) {
    console.warn("Extensión no válida:", filename);
    return;
  }

  const fullUrl = `/uploads/practice/unit${unitId}/${filename}`;
  console.log("🔊 Reproduciendo audio:", fullUrl);

  const audio = new Audio(encodeURI(fullUrl));
  audio.volume = 1;

  audio.play().catch((err) => {
    console.error("❌ Error al reproducir audio:", err);
  });
};



  const startRecording = async (sentenceText) => {
    setRecordingSentence(sentenceText);
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

  const stopRecording = (sentenceText, originalAudio) => {
    if (mediaRecorder.current) {
      mediaRecorder.current.stop();
      mediaRecorder.current.onstop = () => {
        const audioBlob = new Blob(recordedChunks.current, { type: "audio/wav" });
        const recordedAudioURL = URL.createObjectURL(audioBlob);

        const recordedAudio = new Audio(recordedAudioURL);
        recordedAudio.play();
        recordedAudio.onended = () => {
          playAudio(sentenceText, originalAudio);
        };

        setHeardSentences((prev) => new Set([...prev, sentenceText]));
        setProgress((prev) => prev + 1);
      };

      if (audioStream.current) {
        audioStream.current.getTracks().forEach((track) => track.stop());
      }
    }
    setRecordingSentence(null);
  };

  const totalPages = Math.ceil((sentences.length - ITEMS_PER_PAGE) / ITEMS_PER_PAGE);
  const paginatedSentences =
    currentPage === 0
      ? sentences
      : sentences.slice(
          ITEMS_PER_PAGE + (currentPage - 1) * ITEMS_PER_PAGE,
          ITEMS_PER_PAGE + currentPage * ITEMS_PER_PAGE
        );

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-white">
      <header className="sticky top-0 w-full bg-white shadow-md flex items-center justify-between px-6 py-4 border-b z-50">
        <Link to="/home" className="flex items-center gap-4">
          <img src={logo} alt="Logo" className="h-10 w-auto cursor-pointer" />
          <h1 className="text-2xl font-bold text-gray-800">
            Unit {unitId}: Practice
          </h1>
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
            to={`/unidad/${unitId}/listening`}
            className="flex items-center gap-2 bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Siguiente
            <ArrowRight size={20} />
          </Link>
        </div>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center px-6 relative py-8">
        {currentPage > 0 && (
          <button
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 p-3 bg-gray-300 rounded-full hover:bg-gray-400 transition"
          >
            <ChevronLeft size={24} />
          </button>
        )}
        <div className="bg-white shadow-xl rounded-3xl p-8 max-w-6xl w-full border border-gray-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {paginatedSentences.map((sentence, index) => (
              <SentenceItem
                key={index}
                sentence={sentence}
                onPlay={playAudio}
                onStartRecording={startRecording}
                onStopRecording={stopRecording}
                isRecording={recordingSentence === sentence.sentence_text}
                heard={heardSentences.has(sentence.sentence_text)}
              />
            ))}
          </div>
        </div>
        {currentPage < totalPages && (
          <button
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 p-3 bg-gray-300 rounded-full hover:bg-gray-400 transition"
          >
            <ChevronRight size={24} />
          </button>
        )}
      </div>

      <TutorialModal
        open={isTutorialOpen}
        onClose={() => setIsTutorialOpen(false)}
        title="¿Cómo aprovechar esta actividad?"
        description="Graba tu pronunciación y compárala con la original para mejorar tu fluidez."
        points={[
          "Escucha atentamente la pronunciación nativa.",
          "Graba tu voz manteniendo el ritmo y entonación.",
          "Compárala con el audio original y repite si es necesario.",
        ]}
      />
    </div>
  );
};

export default Practice;
