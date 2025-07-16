import { useState, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Mic, HelpCircle, X } from "lucide-react";
import logo from "../assets/loog.png";
import helenImg from "/images/mine.png";
import juliaImg from "/images/moni.png";

const characters = [
  { id: "helen", name: "Helen", image: helenImg },
  { id: "julia", name: "Julia", image: juliaImg },
];

const dialogue = [
  { speaker: "Helen", audio: "/audios/helen1.mp3", text: "Hello Julia, how are you?", image: helenImg },
  { speaker: "Julia", audio: "/audios/julia1.mp3", text: "I'm fine, Helen. What about you?", image: juliaImg },
  { speaker: "Helen", audio: "/audios/helen2.mp3", text: "I'm good too. Are you ready for the trip?", image: helenImg },
  { speaker: "Julia", audio: "/audios/julia2.mp3", text: "Yes! I can't wait. It will be amazing!", image: juliaImg },
  { speaker: "Helen", audio: "/audios/helen3.mp3", text: "I know! Have you packed everything?", image: helenImg },
  { speaker: "Julia", audio: "/audios/julia3.mp3", text: "Almost! Just need to grab my charger.", image: juliaImg },
  { speaker: "Helen", audio: "/audios/helen4.mp3", text: "Good idea! We don’t want dead phones!", image: helenImg },
  { speaker: "Julia", audio: "/audios/julia4.mp3", text: "Haha, exactly! Let’s meet at the airport at 6 AM?", image: juliaImg }
];

const CharacterSelection = () => {
  const { unitId } = useParams();
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [currentTurn, setCurrentTurn] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  const audioRef = useRef(null);
  const mediaRecorder = useRef(null);
  const recordedChunks = useRef([]);

  const handleCharacterSelection = (char) => {
    setSelectedCharacter(char);
    setCurrentTurn(0);
  };

  const startRecording = async () => {
    setIsRecording(true);
    recordedChunks.current = [];
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      mediaRecorder.current.ondataavailable = (event) => {
        if (event.data.size > 0) recordedChunks.current.push(event.data);
      };
      mediaRecorder.current.start();
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (mediaRecorder.current) {
      mediaRecorder.current.stop();
      mediaRecorder.current.onstop = () => {
        const audioBlob = new Blob(recordedChunks.current, { type: "audio/wav" });
        const recordedAudioURL = URL.createObjectURL(audioBlob);
        const recordedAudio = new Audio(recordedAudioURL);
        recordedAudio.play();
        recordedAudio.onended = () => {
          if (currentTurn < dialogue.length - 1) {
            setTimeout(() => {
              setCurrentTurn((prev) => prev + 1);
              if (audioRef.current) {
                audioRef.current.src = dialogue[currentTurn + 1].audio;
                audioRef.current.play();
              }
            }, 1000);
          }
        };
      };
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <header className="sticky top-0 w-full bg-white shadow-md flex items-center justify-between px-6 py-4 border-b z-50">
        <Link to="/home" className="flex items-center gap-4">
          <img src={logo} alt="Logo" className="h-10 w-auto cursor-pointer" />
          <h1 className="text-2xl font-bold text-gray-800">Unit {unitId}: Speaking</h1>
        </Link>
        <div className="flex items-center gap-4">
          <button onClick={() => setIsTutorialOpen(true)} className="flex items-center gap-2 bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition">
            <HelpCircle size={20} />
            Tutorial
          </button>
          <Link to={`/unidad/${unitId}/practice`} className="flex items-center gap-2 bg-gray-300 text-gray-800 font-semibold px-4 py-2 rounded-lg hover:bg-gray-400 transition">
            <ArrowLeft size={24} />
            Volver
          </Link>
          <Link to={`/unidad/${unitId}/next`} className="flex items-center gap-2 bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition">
            Siguiente
            <ArrowRight size={20} />
          </Link>
        </div>
      </header>

      <div className="flex flex-col items-center p-6 bg-white shadow-lg rounded-lg max-w-2xl mx-auto flex-1">
        {!selectedCharacter ? (
          <>
            <h1 className="text-3xl font-bold text-gray-800">Choose Your Role</h1>
            <div className="flex gap-6 mt-6">
              {characters.map((char) => (
                <motion.div key={char.id} className="cursor-pointer" onClick={() => handleCharacterSelection(char)}>
                  <img src={char.image} alt={char.name} className="w-40 h-40 rounded-full border-2 border-gray-300 hover:border-blue-500" />
                  <p className="text-center mt-2 font-semibold text-gray-800">{char.name}</p>
                </motion.div>
              ))}
            </div>
          </>
        ) : (
          <div className="w-full flex flex-col gap-4 mt-6">
            {dialogue.slice(0, currentTurn + 1).map((entry, index) => (
              <div key={index} className={`flex items-center gap-4 p-4 rounded-lg shadow-md ${entry.speaker === selectedCharacter.name ? 'flex-row-reverse' : ''}`}>
                <img src={entry.image} alt={entry.speaker} className="w-12 h-12 rounded-full" />
                <div className="bg-gray-200 p-3 rounded-lg max-w-sm flex items-center">
                  <p className="font-semibold text-blue-600 mr-2">{entry.speaker}</p>
                  <p>{entry.text}</p>
                  {entry.speaker === selectedCharacter.name && (
                    <button className={`ml-3 p-2 rounded-full transition ${isRecording ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'}`} onMouseDown={startRecording} onMouseUp={stopRecording}>
                      <Mic size={20} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CharacterSelection;
