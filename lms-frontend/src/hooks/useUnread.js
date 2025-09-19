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
        const r1 = await fetch(`${API_BASE_URL}/mensajes/unread-count`, { credentials: "include" });
        if (r1.ok) {
          const { unread } = await r1.json();
          if (!ignore) setUnreadMessages(Number(unread || 0));
        }

        // Si aún no tienes endpoint de notifs, déjalo en 0
        // const r2 = await fetch(`${API_BASE_URL}/notificaciones/unread-count`, { credentials: "include" });
        // if (r2.ok) {
        //   const { unread } = await r2.json();
        //   if (!ignore) setUnreadNotifs(Number(unread || 0));
        // }
      } catch (e) {
        console.error("useUnread error:", e);
      }
    }

    fetchCounts();
    const id = setInterval(fetchCounts, 30000);
    return () => { ignore = true; clearInterval(id); };
  }, []);

  return { unreadMessages, unreadNotifs };
}
