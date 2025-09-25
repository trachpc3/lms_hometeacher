import { useState, useEffect, useRef } from "react";
import { api } from "../../lib/api";
import { API_BASE_URL } from "../../config";

const RolePlay = ({ actividadId }) => {
  const [dialogue, setDialogue] = useState(null);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [userRole, setUserRole] = useState(null);
  const [recordings, setRecordings] = useState({});
  const [isRecording, setIsRecording] = useState(false);
  const [replaying, setReplaying] = useState(false);
  const [replayIndex, setReplayIndex] = useState(0);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const replayEndRef = useRef(null);

  useEffect(() => {
    const fetchDialogue = async () => {
      try {
        const data = await api.get(`/speaking/${actividadId}`);
        setDialogue(data);
        setCurrentLineIndex(0);
        setRecordings({});
        setUserRole(null);
      } catch (err) {
        console.error("❌ Error al obtener diálogo:", err.message);
      }
    };

    if (actividadId) fetchDialogue();
  }, [actividadId]);

  useEffect(() => {
    if (replayEndRef.current) {
      replayEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [replayIndex]);

  const currentLine = dialogue?.lines?.[currentLineIndex];
  const isUserTurn = currentLine?.speaker === userRole;

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        audioChunksRef.current.push(e.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const audioUrl = URL.createObjectURL(audioBlob);
        setRecordings((prev) => ({
          ...prev,
          [currentLineIndex]: audioUrl,
        }));
        setTimeout(() => setCurrentLineIndex((i) => i + 1), 500);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error("❌ Error al iniciar grabación:", err.message);
    }
  };

  const handleStopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  const handlePlayAudio = (fileName) => {
    if (!fileName) return;
    const baseUrl = API_BASE_URL.replace("/api", "");
    const audioUrl = `${baseUrl}/uploads/speaking/${fileName}`;
    const audio = new Audio(audioUrl);

    audio.onended = () => {
      setTimeout(() => setCurrentLineIndex((i) => i + 1), 500);
    };

    audio.play().catch((err) => console.error("❌ Reproducción fallida:", err));
  };

  const handleStart = (role) => {
    setUserRole(role);
    setCurrentLineIndex(0);
  };

  const handleReplayFullDialogue = () => {
    setReplaying(true);
    setReplayIndex(0);

    const playNext = (i) => {
      if (i >= dialogue.lines.length) {
        setTimeout(() => setReplaying(false), 1000);
        return;
      }

      const line = dialogue.lines[i];
      const userAudio = recordings[i];
      const url = userAudio
        ? userAudio
        : `${API_BASE_URL.replace("/api", "")}/uploads/speaking/${line.audio_url}`;

      const audio = new Audio(url);
      audio.onended = () => {
        setReplayIndex(i + 1);
        setTimeout(() => playNext(i + 1), 500);
      };
      audio.play();
    };

    playNext(0);
  };

  const renderBubble = (line, index) => {
    const isLeft = line.speaker !== userRole;
    return (
      <div
        key={index}
        className={`flex items-start gap-3 ${isLeft ? "justify-start" : "justify-end"}`}
      >
        {isLeft && (
          <img
            src={`/images/${line.speaker.toLowerCase()}.png`}
            alt={line.speaker}
            className="w-10 h-10 rounded-full border"
          />
        )}
        <div
          className={`rounded-xl px-5 py-3 max-w-[75%] shadow bg-white text-gray-800 text-sm border ${
            isLeft ? "rounded-bl-none" : "rounded-br-none"
          }`}
        >
          <p className="font-semibold text-xs text-gray-500 mb-1">{line.speaker}</p>
          <p>{line.texto}</p>
        </div>
        {!isLeft && (
          <img
            src={`/images/${line.speaker.toLowerCase()}.png`}
            alt={line.speaker}
            className="w-10 h-10 rounded-full border"
          />
        )}
      </div>
    );
  };

  if (!dialogue) return <p className="text-center">Loading dialogue...</p>;

  if (!userRole) {
    const personajes = [...new Set(dialogue.lines.map((line) => line.speaker))];
    return (
      <div className="text-center space-y-6">
        <h2 className="text-xl font-bold">Choose your character</h2>
        <div className="flex justify-center gap-8">
          {personajes.map((name) => (
            <button
              key={name}
              onClick={() => handleStart(name)}
              className="flex flex-col items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              <img
                src={`/images/${name.toLowerCase()}.png`}
                alt={name}
                className="w-16 h-16 rounded-full mb-2 border"
              />
              Play as {name}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (replaying) {
    return (
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-center text-blue-700">▶️ Replaying dialogue...</h2>
        <div className="bg-gray-100 p-4 rounded-xl max-h-[400px] overflow-y-auto space-y-4 border shadow">
          {dialogue.lines.slice(0, replayIndex + 1).map((line, i) => renderBubble(line, i))}
          <div ref={replayEndRef} />
        </div>
      </div>
    );
  }

  if (currentLineIndex >= dialogue.lines.length) {
    return (
      <div className="text-center space-y-4">
        <h2 className="text-xl font-bold">🎉 Dialogue finished!</h2>
        <div className="flex justify-center gap-4">
          <button
            onClick={handleReplayFullDialogue}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            🔁 Replay Full Dialogue
          </button>
          <button
            onClick={() => setUserRole(null)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            🔄 Restart Activity
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-center mb-2">
        Your character: <span className="text-blue-700">{userRole}</span>
      </h2>

      <div className="bg-gray-100 p-4 rounded-xl space-y-4 border shadow max-h-[400px] overflow-y-auto">
        {dialogue.lines.slice(0, currentLineIndex).map((line, i) => renderBubble(line, i))}
        <div ref={replayEndRef} />
        {currentLine && renderBubble(currentLine, currentLineIndex)}

        <div className="mt-4">
          {isUserTurn ? (
            <div className="flex gap-4">
              <button
                onClick={handleStartRecording}
                disabled={isRecording}
                className="bg-red-600 text-white px-4 py-2 rounded disabled:opacity-50"
              >
                🎙️ Record
              </button>
              <button
                onClick={handleStopRecording}
                disabled={!isRecording}
                className="bg-gray-600 text-white px-4 py-2 rounded disabled:opacity-50"
              >
                ⏹️ Stop
              </button>
            </div>
          ) : (
            <button
              onClick={() => handlePlayAudio(currentLine.audio_url)}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              ▶️ Listen
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default RolePlay;
