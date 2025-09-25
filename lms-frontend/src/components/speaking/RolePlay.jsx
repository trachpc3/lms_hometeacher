import { useState, useEffect, useRef } from "react";
import { api } from "../../lib/api"; // ✅ usamos api.get en lugar de fetch
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

    audio.play().catch((err) => console.error("❌
