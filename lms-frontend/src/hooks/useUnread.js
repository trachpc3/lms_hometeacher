// src/hooks/useUnread.js
import { useEffect, useState } from "react";
import { API_BASE_URL } from "@/config";

export function useUnread() {
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [unreadNotifs, setUnreadNotifs] = useState(0);

  useEffect(() => {
    let ignore = false;

    async function fetchCounts() {
      try {
        const resMsgs = await fetch(`${API_BASE_URL}/mensajes/unread-count`, {
          credentials: "include",
        });
        const { unread: msgs } = await resMsgs.json();
        if (!ignore) setUnreadMessages(msgs);

        // 👇 si tienes endpoint para notifs
        const resNotifs = await fetch(`${API_BASE_URL}/notificaciones/unread-count`, {
          credentials: "include",
        });
        const { unread: notifs } = await resNotifs.json();
        if (!ignore) setUnreadNotifs(notifs);
      } catch (e) {
        console.error("❌ Error al obtener contadores:", e);
      }
    }

    fetchCounts();
    const interval = setInterval(fetchCounts, 30000); // refresca cada 30s
    return () => {
      ignore = true;
      clearInterval(interval);
    };
  }, []);

  return { unreadMessages, unreadNotifs };
}
