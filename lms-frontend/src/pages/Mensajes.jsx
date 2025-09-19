// src/pages/Mensajes.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import { MessageSquarePlus, Send, Search } from "lucide-react";
import toast from "react-hot-toast";
import {
  startConversation,
  listConversations,
  getMessages,
  sendMessage,
  markRead,
} from "@/services/mensajesService";
import { useUser } from "@/context/UserContext";
import { getAvatarUrl } from "@/utils/getAvatarUrl";
import NewConversationModal from "@/components/NewConversationModal";
import { useLocation, useNavigate } from "react-router-dom";

// 👇 PeerAvatar con fallback
function PeerAvatar({ peer }) {
  const [err, setErr] = useState(false);
  const src = err ? "/assets/img/default-profile.png" : getAvatarUrl(peer?.imagen);

  return (
    <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-100 border">
      <img
        src={src}
        alt={peer?.nombre || "Usuario"}
        className="w-full h-full object-cover"
        onError={() => setErr(true)} // 👈 fallback automático
      />
    </div>
  );
}

export default function Mensajes() {
  const { user } = useUser(); // { id, rol, nombre, imagen }
  const [convs, setConvs] = useState([]);
  const [active, setActive] = useState(null);
  const [msgs, setMsgs] = useState([]);
  const [text, setText] = useState("");
  const [q, setQ] = useState("");
  const [loadingList, setLoadingList] = useState(true);
  const [loadingChat, setLoadingChat] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const bottomRef = useRef(null);

  const isProfesor = user?.rol === "profesor";
  const isAlumno = user?.rol === "estudiante" || user?.rol === "alumno";

  const location = useLocation();
  const navigate = useNavigate();

  // Redirige si entran a /mensajes sueltos
  useEffect(() => {
    if (location.pathname === "/mensajes") {
      if (isProfesor) navigate("/dashboard-profesor/mensajes", { replace: true });
      else if (isAlumno) navigate("/home/mensajes", { replace: true });
    }
  }, [location.pathname, isProfesor, isAlumno, navigate]);

  // Cargar conversaciones
  useEffect(() => {
    let ignore = false;
    (async () => {
      setLoadingList(true);
      try {
        console.debug("[Mensajes] listConversations:start");
        const { conversations } = await listConversations();
        if (ignore) return;
        console.debug("[Mensajes] listConversations:ok", conversations);
        setConvs(conversations);

        if (conversations.length) {
          setActive(conversations[0]);
        } else if (isAlumno) {
          try {
            await startConversation();
            const again = await listConversations();
            if (ignore) return;
            setConvs(again.conversations || []);
            setActive(again.conversations?.[0] || null);
            toast.success("Conversación con tu profesor está lista.");
          } catch (e) {
            console.error("[Mensajes] startConversation alumno FAILED", e);
            toast.error(e?.message || "No se pudo preparar la conversación con tu profesor.");
          }
        }
      } catch (e) {
        console.error("[Mensajes] listConversations FAILED", e);
        toast.error(e?.message || "No se pudieron cargar conversaciones");
      } finally {
        if (!ignore) setLoadingList(false);
      }
    })();
    return () => {
      ignore = true;
    };
  }, [isAlumno]);

  // Cargar mensajes cuando cambia la conversación activa
  useEffect(() => {
    if (!active) {
      setMsgs([]);
      return;
    }
    let ignore = false;
    (async () => {
      setLoadingChat(true);
      try {
        const { messages } = await getMessages(active.id);
        if (ignore) return;
        setMsgs(messages);
        await markRead(active.id);
        if (ignore) return;
        setConvs((prev) => prev.map((c) => (c.id === active.id ? { ...c, unread: 0 } : c)));
        setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 0);
      } catch (e) {
        console.error("[Mensajes] get/mark FAILED", e);
        toast.error(e?.message || "No se pudieron cargar los mensajes");
      } finally {
        if (!ignore) setLoadingChat(false);
      }
    })();
    return () => {
      ignore = true;
    };
  }, [active?.id]);

  const handleNew = async () => {
    if (isAlumno) {
      try {
        console.debug("[Mensajes] alumno -> startConversation()");
        await startConversation();
        const { conversations } = await listConversations();
        setConvs(conversations);
        setActive(conversations[0] || null);
        toast.success("Conversación preparada.");
      } catch (e) {
        console.error(e);
        toast.error(e?.message || "No se pudo iniciar la conversación");
      }
    } else if (isProfesor) {
      setModalOpen(true);
    }
  };

  const handlePickAlumno = async ({ userId }) => {
    try {
      await startConversation({ toUserId: userId, toRole: "estudiante" });
      const { conversations } = await listConversations();
      setConvs(conversations);
      const found = conversations.find(
        (c) => c.peer?.role === "estudiante" && c.peer?.id === userId
      );
      setActive(found || conversations[0] || null);
    } catch (e) {
      console.error(e);
      toast.error(e?.message || "No se pudo iniciar la conversación");
    } finally {
      setModalOpen(false);
    }
  };

  const handleSend = async () => {
    const body = text.trim();
    if (!body || !active) return;
    try {
      const msg = await sendMessage(active.id, body);
      setMsgs((prev) => [...prev, msg]);
      setText("");
      setConvs((prev) =>
        prev
          .map((c) =>
            c.id === active.id
              ? { ...c, lastMessage: { ...msg }, unread: 0, lastMessageAt: msg.createdAt }
              : c
          )
          .sort((a, b) => new Date(b.lastMessageAt || 0) - new Date(a.lastMessageAt || 0))
      );
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 0);
    } catch (e) {
      console.error(e);
      toast.error(e?.message || "No se pudo enviar");
    }
  };

  const filteredConvs = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return convs;
    return convs.filter((c) => {
      const nombre = (c.peer?.nombre || "").toLowerCase();
      const last = (c.lastMessage?.body || "").toLowerCase();
      return nombre.includes(term) || last.includes(term);
    });
  }, [q, convs]);

  return (
    <div className="h-full grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Lista */}
      <aside className="bg-white rounded-2xl shadow p-4 md:col-span-1 flex flex-col">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold">Mensajes</h2>
          <button
            onClick={handleNew}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700"
          >
            <MessageSquarePlus size={16} />
            Nueva
          </button>
        </div>

        <div className="relative mb-3">
          <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg border"
            placeholder="Buscar conversaciones"
          />
        </div>

        <div className="flex-1 overflow-y-auto">
          {loadingList ? (
            <p className="text-sm text-gray-500 p-2">Cargando…</p>
          ) : filteredConvs.length === 0 ? (
            <div className="text-sm text-gray-500 p-2">Aún no tienes conversaciones.</div>
          ) : (
            <ul className="space-y-1">
              {filteredConvs.map((c) => (
                <li key={c.id}>
                  <button
                    onClick={() => setActive(c)}
                    className={`w-full p-2 rounded-xl flex items-center gap-3 hover:bg-gray-50 border ${
                      active?.id === c.id ? "bg-gray-50 border-gray-200" : "border-transparent"
                    }`}
                  >
                    <PeerAvatar peer={c.peer} />
                    <div className="flex-1 min-w-0 text-left">
                      <div className="flex items-center justify-between">
                        <span className="font-medium truncate">{c.peer?.nombre || "Conversación"}</span>
                        {c.unread > 0 && (
                          <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded-full bg-red-500 text-white">
                            {c.unread > 99 ? "99+" : c.unread}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500 truncate">
                        {c.lastMessage?.body || "Sin mensajes"}
                      </div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </aside>

      {/* Chat */}
      <section className="bg-white rounded-2xl shadow p-4 md:col-span-2 flex flex-col">
        {!active ? (
          <div className="m-auto text-center text-gray-500">
            <p className="mb-2 text-lg font-medium">
              {isAlumno ? "Escribe a tu profesor" : "Inicia una conversación"}
            </p>
            <button
              onClick={handleNew}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
            >
              <MessageSquarePlus size={16} />
              Nuevo mensaje
            </button>
          </div>
        ) : (
          <>
            <div className="border-b pb-3 mb-3 flex items-center gap-3">
              <PeerAvatar peer={active.peer} />
              <div>
                <div className="font-semibold">{active.peer?.nombre || "Conversación"}</div>
                <div className="text-xs text-gray-500">{active.peer?.role}</div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2">
              {loadingChat ? (
                <p className="text-sm text-gray-500 text-center mt-6">Cargando mensajes…</p>
              ) : msgs.length === 0 ? (
                <p className="text-sm text-gray-500 text-center mt-6">Aún no hay mensajes. ¡Escribe el primero!</p>
              ) : (
                msgs.map((m) => {
                  const me = m.senderRole === user?.rol && m.senderId === user?.id;
                  return (
                    <div key={m.id} className={`flex ${me ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[75%] rounded-2xl px-3 py-2 text-sm shadow ${
                          me ? "bg-blue-600 text-white rounded-br-sm" : "bg-gray-100 text-gray-800 rounded-bl-sm"
                        }`}
                      >
                        {m.body}
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={bottomRef} />
            </div>

            <div className="mt-3 flex items-center gap-2">
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => (e.key === "Enter" ? handleSend() : null)}
                className="flex-1 rounded-xl border px-3 py-2"
                placeholder="Escribe un mensaje…"
              />
              <button
                onClick={handleSend}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
              >
                <Send size={16} />
                <span className="hidden sm:inline">Enviar</span>
              </button>
            </div>
          </>
        )}
      </section>

      {/* Modal profesor */}
      <NewConversationModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onPick={handlePickAlumno}
      />
    </div>
  );
}
