import React, { useState } from "react";

const AccionMasivaModal = ({ open, onClose, onConfirm, seleccionados }) => {
  const [accion, setAccion] = useState("");
  const [valor, setValor] = useState("");

  if (!open) return null;

  const acciones = [
    { value: "eliminar", label: "Eliminar" },
    { value: "estado", label: "Cambiar estado" },
    { value: "estado_formacion", label: "Cambiar estado de formación" },
    { value: "curso", label: "Asignar curso" },
  ];

  const opcionesEstado = [
    { value: "activo", label: "Activo" },
    { value: "inactivo", label: "Inactivo" },
  ];

  const opcionesEstadoFormacion = [
    { value: "demo", label: "Demo" },
    { value: "matriculado", label: "Matriculado" },
    { value: "baja", label: "Baja" },
  ];

  // Supongo que tienes una lista de cursos fijos que puedes definir aquí:
  const opcionesCursos = [
    { value: 1, label: "Curso A (ID 1)" },
    { value: 2, label: "Curso B (ID 2)" },
    { value: 3, label: "Curso C (ID 3)" },
    // añadir los que tengas
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!accion) {
      alert("Seleccione una acción");
      return;
    }
    // si acción es eliminar, valor puede estar vacío
    if (
      accion === "estado" ||
      accion === "estado_formacion" ||
      accion === "curso"
    ) {
      if (!valor) {
        alert("Seleccione un valor para la acción");
        return;
      }
    }
    onConfirm(accion, valor);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-11/12 max-w-md">
        <h2 className="text-xl font-bold mb-4">Acción masiva</h2>
        <p className="mb-2">Seleccionados: {seleccionados.length}</p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Acción</label>
            <select
              value={accion}
              onChange={(e) => {
                setAccion(e.target.value);
                setValor(""); // resetear valor al cambiar acción
              }}
              className="w-full border p-2 rounded-lg"
            >
              <option value="">-- Seleccionar acción --</option>
              {acciones.map((a) => (
                <option key={a.value} value={a.value}>
                  {a.label}
                </option>
              ))}
            </select>
          </div>

          {accion === "estado" && (
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Nuevo estado
              </label>
              <select
                value={valor}
                onChange={(e) => setValor(e.target.value)}
                className="w-full border p-2 rounded-lg"
              >
                <option value="">-- Seleccionar estado --</option>
                {opcionesEstado.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {accion === "estado_formacion" && (
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Nuevo estado de formación
              </label>
              <select
                value={valor}
                onChange={(e) => setValor(e.target.value)}
                className="w-full border p-2 rounded-lg"
              >
                <option value="">-- Seleccionar estado de formación --</option>
                {opcionesEstadoFormacion.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {accion === "curso" && (
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Curso</label>
              <select
                value={valor}
                onChange={(e) => setValor(e.target.value)}
                className="w-full border p-2 rounded-lg"
              >
                <option value="">-- Seleccionar curso --</option>
                {opcionesCursos.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
            >
              Confirmar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AccionMasivaModal;
