import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-hot-toast";
import { enviarParticipanteFundae } from "../services/fundaeService";

const FundaeForm = () => {
  const formik = useFormik({
    initialValues: {
      nombre: "",
      dni: "",
      cursoId: "",
    },
    validationSchema: Yup.object({
  nombre: Yup.string()
    .min(3, "Debe tener al menos 3 caracteres")
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]+$/, "Solo letras y espacios")
    .required("El nombre es obligatorio"),

  dni: Yup.string()
    .matches(/^\d{8}[A-Z]$/, "Formato de DNI inválido (ej: 12345678Z)")
    .required("El DNI es obligatorio"),

  cursoId: Yup.string()
    .min(5, "ID demasiado corto")
    .matches(/^[A-Za-z0-9\-]+$/, "Solo letras, números o guiones")
    .required("El ID del curso es obligatorio"),
}),

    onSubmit: async (values, { resetForm }) => {
      try {
        const result = await enviarParticipanteFundae(values);
        toast.success(result.message || "Participante enviado correctamente");
        resetForm();
      } catch (err) {
        toast.error(err.message || "Error al enviar a FUNDAE");
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4">
      {["nombre", "dni", "cursoId"].map((field) => (
        <div key={field}>
          <input
            name={field}
            type="text"
            placeholder={
              field === "cursoId"
                ? "ID del curso"
                : field === "dni"
                ? "DNI"
                : "Nombre completo"
            }
            value={formik.values[field]}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`w-full border p-2 rounded ${
              formik.touched[field] && formik.errors[field]
                ? "border-red-500"
                : ""
            }`}
          />
          {formik.touched[field] && formik.errors[field] && (
            <p className="text-red-500 text-sm">{formik.errors[field]}</p>
          )}
        </div>
      ))}

      <button
        type="submit"
        disabled={formik.isSubmitting}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
      >
        {formik.isSubmitting ? "Enviando..." : "Enviar a FUNDAE"}
      </button>
    </form>
  );
};

export default FundaeForm;
