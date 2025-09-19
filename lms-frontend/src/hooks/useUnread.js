// src/hooks/useUnread.js
import { useEffect, useRef, useState, useCallback } from "react";
import { API_BASE_URL } from "@/config";

// Helper: fetch con token + refresh en 401
async function authedFetch(url, options = {}) {
  const token = localStorage.getItem("token");
  const init = {
    ...options,
    credentials: "include",
    headers: {
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  };

  let res = await fetch(url, init);

  // Si no autorizado, intenta refresh 1 vez
  if (res.status === 401) {
    const r2 = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });
    if (r2.ok) {
      const { token: newToken } = await r2.json().catch(() => ({}));
      if (newToken) localStorage.setItem("token", newToken);

      res = await fetch(url, {
        ...init,
        headers: {
          ...(options.headers || {}),
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
  const isMounted = useRef(true);
  const fetchingRef = useRef(false);

  const safeSet = useCallback((setter) => {
    if (isMounted.current) setter();
  }, []);

  const fetchCounts = useCallback(async () => {
    if (fetchingRef.current) return; // evita solapes
    fetchingRef.current = true;

    try {
      // Mensajes
      const r1 = await authedFetch(`${API_BASE_URL}/mensajes/unread-count`);
      if (r1.ok) {
        const { unread } = await r1.json();
        safeSet(() => setUnreadMessages(Number(unread || 0)));
      } else {
        // Opcional: log suave
        // console.warn("[useUnread] mensajes/unread-count:", r1.status);
      }

      // Notificaciones
      const r2 = await authedFetch(`${API_BASE_URL}/notificaciones/unread-count`);
      if (r2.ok) {
        const { unread } = await r2.json();
        safeSet(() => setUnreadNotifs(Number(unread || 0)));
      } else {
        // console.warn("[useUnread] notificaciones/unread-count:", r2.status);
      }
    } catch (e) {
      // console.error("[useUnread] fetchCounts error:", e);
    } finally {
      fetchingRef.current = false;
    }
  }, [safeSet]);

  // Exponer una forma de refrescar manualmente
  const refreshCounts = useCallback(() => {
    fetchCounts();
  }, [fetchCounts]);

  useEffect(() => {
    isMounted.current = true;
    fetchCounts();

    // Intervalo de auto-refresh
    const id = setInterval(fetchCounts, 15000);

    // Refresca al volver a la pestaña o foco
    const onVisibility = () => {
      if (document.visibilityState === "visible") fetchCounts();
    };
    const onFocus = () => fetchCounts();

    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("focus", onFocus);

    return () => {
      isMounted.current = false;
      clearInterval(id);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("focus", onFocus);
    };
  }, [fetchCounts]);

  return { unreadMessages, unreadNotifs, refreshCounts };
}
