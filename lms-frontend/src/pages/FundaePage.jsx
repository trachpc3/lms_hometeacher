import React from "react";
import FundaeForm from "../components/FundaeForm";

const FundaePage = () => (
  <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
    <div className="max-w-md w-full bg-white shadow p-6 rounded">
      <h2 className="text-xl font-bold mb-4">📤 Enviar Participante a FUNDAE</h2>
      <FundaeForm />
    </div>
  </div>
);

export default FundaePage;
