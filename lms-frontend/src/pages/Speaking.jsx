// src/components/speaking/RolePlay.jsx
import { useEffect, useState, useMemo } from "react";
import { API_BASE_URL } from "../../config";

/**
 * Props:
 *  - actividadId (number)  -> id de la actividad speaking
 *  - items (array)         -> opcional: si ya vienen desde el padre
 *  - meta (object)         -> opcional: info básica de la actividad
 */
export default function RolePlay({ actividadId, items = [], meta = null }) {
  const [dialogo, setDialogo] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Token desde localStorage (mismo que usas en el resto del front)
  const token = useMemo(
    () => localStorage.getItem("token") || localStorage.getItem("accessToken") || "",
    []
  );

  useEffect(() => {
    // Si el padre ya pasa items válidos, úsalo y no pidas a la API
    if (Array.isArray(items) && items.length > 0) {
      setDialogo({ items, meta });
      setError(null);
      setLoading(false);
      return;
    }

    if (!actividadId) return;

    const fetchDialogo = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!token) {
          throw new Error("No hay token. Inicia sesión.");
        }

        const common = {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // ← CLAVE
          },
          credentials: "include",
        };

        // 1) Intento principal: /speaking/:id
        let res = await fetch(`${API_BASE_URL}/speaking/${actividadId}`, common);
        let raw = await res.text();

        if (res.status === 401) {
          throw new Error(`No autorizado (401): ${raw || "token ausente/expirado"}`);
        }

        // Algunos backends devuelven 404 en esta y exponen /speaking/:id/items:
        if (res.status === 404) {
          // 2) Intento alternativo: /speaking/:id/items
          const resItems = await fetch(`${API_BASE_URL}/speaking/${actividadId}/items`, common);
          const rawItems = await resItems.text();

          if (!resItems.ok) {
            throw new Error(
              `No se pudo cargar el diálogo. ${resItems.status}: ${rawItems || "sin cuerpo"}`
            );
          }

          const jsonItems = rawItems ? JSON.parse(rawItems) : null;
          const list =
            Array.isArray(jsonItems)
              ? jsonItems
              : Array.isArray(jsonItems?.items)
              ? jsonItems.items
              : Array.isArray(jsonItems?.data)
              ? jsonItems.data
              : [];

          setDialogo({ items: list, meta });
          return;
        }

        if (!res.ok) {
          throw new Error(`Error ${res.status}: ${raw || "sin cuerpo"}`);
        }

        const json = raw ? JSON.parse(raw) : null;

        // Normaliza: puede venir {items:[...]} o un array directo
        const list =
          Array.isArray(json) ? json :
          Array.isArray(json?.items) ? json.items :
          Array.isArray(json?.data) ? json.data : [];

        setDialogo({ items: list, meta: meta || (json && typeof json === "object" ? json : null) });
      } catch (e) {
        console.error("❌ Error al obtener diálogo:", e);
        setError(e.message || "Error desconocido");
      } finally {
        setLoading(false);
      }
    };

    fetchDialogo();
  }, [actividadId, token, meta, items]);

  if (loading) {
    return <p className="text-center text-gray-500">Cargando diálogo...</p>;
  }

  if (error) {
    return (
      <div className="p-4 rounded-lg border border-red-200 bg-red-50 text-red-700">
        <p className="font-semibold">No se pudo cargar el diálogo.</p>
        <p className="text-sm mt-1">{error}</p>
      </div>
    );
  }

  if (!dialogo || !Array.isArray(dialogo.items) || dialogo.items.length === 0) {
    return <p className="text-center text-gray-500">No hay contenido de diálogo disponible.</p>;
  }

  // ⚠️ Render muy básico de ejemplo. Adáptalo a tu UI real.
  return (
    <div className="space-y-3">
      {dialogo.items.map((linea, i) => (
        <div key={i} className="p-3 rounded-lg border bg-gray-50">
          <div className="text-sm text-gray-500">{linea.speaker || linea.personaje || "Speaker"}</div>
          <div className="font-medium text-gray-800">{linea.text || linea.line || linea.sentence}</div>
          {linea.audio && (
            <audio className="mt-2 w-full" controls src={linea.audio} />
          )}
        </div>
      ))}
    </div>
  );
}
