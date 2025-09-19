// src/hooks/useUnread.js
import { useEffect, useState } from "react";
import { API_BASE_URL } from "@/config";

async function authedFetch(url, options = {}) {
  // 1) intenta con el token actual
  const token = localStorage.getItem("token");
  let res = await fetch(url, {
    ...options,
    credentials: "include",
    headers: {
      ...(options.headers || {}),
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  // 2) si 401, intenta refresh y reintenta 1 vez
  if (res.status === 401) {
    const r2 = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });
    if (r2.ok) {
      const { token: newToken } = await r2.json().catch(() => ({}));
      if (newToken) localStorage.setItem("token", newToken);

      // reintento
      res = await fetch(url, {
        ...options,
        credentials: "include",
        headers: {
          ...(options.headers || {}),
          "Content-Type": "application/json",
          ...(newToken ? { Authorization: `Bearer ${newToken}` } : {}),
        },
      });
    }
  }

  return res;
}

export function useUnread() {
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [unreadNotifs, setUnreadNotifs] = useState(0);

  useEffect(() => {
    let ignore = false;

    async function fetchCounts() {
      try {
        // Mensajes sin leer
        const r1 = await authedFetch(`${API_BASE_URL}/mensajes/unread-count`);
        if (r1.ok) {
          const { unread } = await r1.json();
          if (!ignore) setUnreadMessages(Number(unread || 0));
        } else {
          console.warn("unread-count mensajes:", r1.status);
        }

        // Notificaciones sin leer (si aún no hay endpoint, quedará en 0)
        // const r2 = await authedFetch(`${API_BASE_URL}/notificaciones/unread-count`);
        // if (r2.ok) {
        //   const { unread } = await r2.json();
        //   if (!ignore) setUnreadNotifs(Number(unread || 0));
        // }
      } catch (e) {
        console.error("❌ useUnread error:", e);
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
