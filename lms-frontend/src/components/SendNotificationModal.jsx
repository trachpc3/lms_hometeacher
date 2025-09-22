import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { toast } from "react-hot-toast";
import {
  broadcastToMyStudents,
  createNotification,
} from "@/services/notificacionesService";
import { useUnread } from "@/hooks/useUnread";

const tipos = [
  { value: "aviso", label: "Aviso" },
  { value: "sistema", label: "Sistema" },
  { value: "tarea", label: "Tarea" },
  { value: "mensaje", label: "Mensaje" },
];

export default function SendNotificationModal({ open, onClose }) {
  const { refreshCounts } = useUnread();

  const [audiencia, setAudiencia] = useState("misAlumnos"); // "todos" | "misAlumnos" | "ids"
  const [idsTexto, setIdsTexto] = useState(""); // IDs separados por coma
  const [titulo, setTitulo] = useState("");
  const [cuerpo, setCuerpo] = useState("");
  const [tipo, setTipo] = useState("aviso");
  const [linkUrl, setLinkUrl] = useState("");
  const [priority, setPriority] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) {
      // reset al cerrar
      setAudiencia("misAlumnos");
      setIdsTexto("");
      setTitulo("");
      setCuerpo("");
      setTipo("aviso");
      setLinkUrl("");
      setPriority(0);
      setLoading(false);
    }
  }, [open]);

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!titulo.trim() || !cuerpo.trim()) {
      toast.error("Título y cuerpo son obligatorios");
      return;
    }

    try {
      setLoading(true);

      if (audiencia === "todos") {
        await createNotification({
          titulo: titulo.trim(),
          cuerpo: cuerpo.trim(),
          tipo,
          linkUrl: linkUrl.trim() || null,
          metadata: { priority: Number(priority) || 0 },
          recipients: "all", // el backend debe interpretar esto como "todos los alumnos"
        });
        toast.success("Aviso enviado a todos los alumnos");
      } else if (audiencia === "misAlumnos") {
        await broadcastToMyStudents({
          titulo: titulo.trim(),
          cuerpo: cuerpo.trim(),
          tipo,
          linkUrl: linkUrl.trim() || null,
          metadata: { priority: Number(priority) || 0 },
        });
        toast.success("Aviso enviado a tus alumnos");
      } else {
        // audiencia por IDs concretos
        const recipients = idsTexto
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
          .map((n) => Number(n))
          .filter((n) => Number.isInteger(n) && n > 0);

        if (recipients.length === 0) {
          toast.error("Introduce al menos un ID válido");
          setLoading(false);
          return;
        }

        await createNotification({
          titulo: titulo.trim(),
          cuerpo: cuerpo.trim(),
          tipo,
          linkUrl: linkUrl.trim() || null,
          metadata: { priority: Number(priority) || 0 },
          recipients,
        });
        toast.success(`Aviso enviado a ${recipients.length} usuarios`);
      }

      refreshCounts();
      onClose?.();
    } catch (err) {
      console.error(err);
      toast.error(err?.message || "No se pudo enviar la notificación");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b">
          <h2 className="text-lg font-semibold">Enviar notificación</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100"
            aria-label="Cerrar"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Audiencia */}
          <div>
            <label className="block text-sm font-medium mb-1">Audiencia</label>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
              <label className="inline-flex items-center gap-2">
                <input
                  type="radio"
                  name="audiencia"
                  value="todos"
                  checked={audiencia === "todos"}
                  onChange={() => setAudiencia("todos")}
                />
                <span>Todos los alumnos</span>
              </label>
              <label className="inline-flex items-center gap-2">
                <input
                  type="radio"
                  name="audiencia"
                  value="misAlumnos"
                  checked={audiencia === "misAlumnos"}
                  onChange={() => setAudiencia("misAlumnos")}
                />
                <span>Mis alumnos</span>
              </label>
              <label className="inline-flex items-center gap-2">
                <input
                  type="radio"
                  name="audiencia"
                  value="ids"
                  checked={audiencia === "ids"}
                  onChange={() => setAudiencia("ids")}
                />
                <span>Alumnos concretos</span>
              </label>
            </div>
            {audiencia === "ids" && (
              <input
                className="mt-2 w-full border rounded-lg px-3 py-2"
                placeholder="Ej: 12, 15, 18"
                value={idsTexto}
                onChange={(e) => setIdsTexto(e.target.value)}
              />
            )}
          </div>

          {/* Título */}
          <div>
            <label className="block text-sm font-medium mb-1">Título *</label>
            <input
              className="w-full border rounded-lg px-3 py-2"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              maxLength={150}
              required
            />
          </div>

          {/* Cuerpo */}
          <div>
            <label className="block text-sm font-medium mb-1">Cuerpo *</label>
            <textarea
              className="w-full border rounded-lg px-3 py-2 min-h-[100px]"
              value={cuerpo}
              onChange={(e) => setCuerpo(e.target.value)}
              required
            />
          </div>

          {/* Tipo y prioridad */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">Tipo</label>
              <select
                className="w-full border rounded-lg px-3 py-2"
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
              >
                {tipos.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Prioridad (0-9)
              </label>
              <input
                type="number"
                min={0}
                max={9}
                className="w-full border rounded-lg px-3 py-2"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              />
            </div>
          </div>

          {/* Link opcional */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Enlace (opcional)
            </label>
            <input
              className="w-full border rounded-lg px-3 py-2"
              placeholder="/home, /home/mensajes, /unidad/3"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
            />
          </div>

          {/* Acciones */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border hover:bg-gray-50"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Enviando…" : "Enviar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
