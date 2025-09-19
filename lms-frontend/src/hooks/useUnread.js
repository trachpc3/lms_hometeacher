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
        // Mensajes sin leer
        const resMsgs = await fetch(`${API_BASE_URL}/mensajes/unread-count`, {
          credentials: "include",
        });
        if (resMsgs.ok) {
          const { unread } = await resMsgs.json();
          if (!ignore) setUnreadMessages(Number(unread || 0));
        }

        // Notificaciones sin leer (si no tienes endpoint, se queda en 0)
        try {
          const resNotifs = await fetch(`${API_BASE_URL}/notificaciones/unread-count`, {
            credentials: "include",
          });
          if (resNotifs.ok) {
            const { unread } = await resNotifs.json();
            if (!ignore) setUnreadNotifs(Number(unread || 0));
          }
        } catch {
          // Silencia si aún no está implementado
        }
      } catch (e) {
        console.error("❌ Error al obtener contadores:", e);
      }
    }

    fetchCounts();
    const id = setInterval(fetchCounts, 30000); // refresca cada 30s
    return () => {
      ignore = true;
      clearInterval(id);
    };
  }, []);

  return { unreadMessages, unreadNotifs };
}
