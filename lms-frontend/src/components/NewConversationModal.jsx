// src/components/NewConversationModal.jsx
import { useEffect, useState } from "react";
import { Search, X, ChevronLeft, ChevronRight, MessageSquarePlus } from "lucide-react";
import { searchAlumnos } from "@/services/searchService";

export default function NewConversationModal({ open, onClose, onPick }) {
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState([]);
  const [pages, setPages] = useState(1);

  useEffect(() => {
    if (!open) return;
    let ignore = false;
    setLoading(true);
    (async () => {
      try {
        const { alumnos, pages: p } = await searchAlumnos({ q, page, limit: 8 });
        if (!ignore) {
          setRows(alumnos);
          setPages(p);
        }
      } catch (e) {
        console.error(e);
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => { ignore = true; };
  }, [open, q, page]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b p-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <MessageSquarePlus size={18} /> Nueva conversación
          </h3>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100">
            <X size={18} />
          </button>
        </div>

        <div className="p-4">
          {/* Buscador */}
          <div className="relative">
            <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
            <input
              autoFocus
              value={q}
              onChange={(e) => { setQ(e.target.value); setPage(1); }}
              placeholder="Buscar alumno por nombre o email…"
              className="w-full pl-9 pr-3 py-2 rounded-lg border"
            />
          </div>

          {/* Lista */}
          <div className="mt-4 min-h-[220px]">
            {loading ? (
              <div className="text-sm text-gray-500">Cargando…</div>
            ) : rows.length === 0 ? (
              <div className="text-sm text-gray-500">No se encontraron alumnos.</div>
            ) : (
              <ul className="divide-y">
                {rows.map((a) => (
                  <li key={a.id} className="py-2 flex items-center justify-between">
                    <div className="min-w-0">
                      <div className="font-medium truncate">
                        {a.nombre} {a.apellidos}
                      </div>
                      <div className="text-xs text-gray-500 truncate">
                        {a.email} · {a.curso_nombre || a.curso_matriculado || "Sin curso"}
                      </div>
                    </div>
                    <button
                      onClick={() => onPick({ userId: a.id, role: "estudiante", nombre: `${a.nombre} ${a.apellidos}` })}
                      className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700"
                    >
                      Iniciar chat
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Paginación */}
          {pages > 1 && (
            <div className="mt-3 flex items-center justify-end gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 rounded-lg border hover:bg-gray-50 disabled:opacity-50"
                title="Anterior"
              >
                <ChevronLeft size={18} />
              </button>
              <span className="text-sm text-gray-600">
                Página <b>{page}</b> de <b>{pages}</b>
              </span>
              <button
                onClick={() => setPage((p) => Math.min(pages, p + 1))}
                disabled={page === pages}
                className="p-2 rounded-lg border hover:bg-gray-50 disabled:opacity-50"
                title="Siguiente"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
