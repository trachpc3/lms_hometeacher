// src/pages/Pricing.jsx
import { useNavigate } from "react-router-dom";
import { Phone } from "lucide-react";
import logo from "../assets/loog.png";

const plans = [
  {
    name: "Nivel B1",
    price: "84,25 € / mes",
    oldPrice: "1300 €",
    finalPrice: "900 €",
    badge: null,
    duration: "12 meses de tutorización",
    features: [
      "72 unidades",
      "Consultas ilimitadas por tutoría",
      "Palabras aprendidas: 2428",
    ],
  },
  {
    name: "Nivel B1 + B2",
    price: "60,49 € / mes",
    oldPrice: "1600 €",
    finalPrice: "1200 €",
    badge: "Más popular",
    duration: "24 meses de tutorización",
    features: [
      "144 unidades",
      "Consultas ilimitadas por tutoría",
      "Palabras aprendidas: 4518",
    ],
  },
  {
    name: "Nivel B2",
    price: "84,25 € / mes",
    oldPrice: "1300 €",
    finalPrice: "900 €",
    badge: null,
    duration: "12 meses de tutorización",
    features: [
      "72 unidades",
      "Consultas ilimitadas por tutoría",
      "Palabras aprendidas: 2090",
    ],
  },
];

export default function Pricing() {
  const navigate = useNavigate();

  return (
    <div className="bg-white min-h-screen text-gray-800">
      {/* Header */}
      <header className="flex justify-between items-center p-6 border-b shadow-sm sticky top-0 bg-white z-10">
        <img src={logo} alt="Logo" className="h-12" />
        <div className="flex gap-4 items-center">
          <a
            href="https://calendly.com/hometeacher-empresas"
            target="_blank"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2"
          >
            <Phone size={18} /> Habla con nosotros
          </a>
          <button
            onClick={() => {
              const u = localStorage.getItem("user");
              navigate(u ? "/home" : "/login");
            }}
            className="text-sm text-blue-600 border border-blue-600 hover:bg-blue-600 hover:text-white px-4 py-2 rounded-lg"
          >
            Entrar al campus
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="text-center py-16 px-4">
        <h1 className="text-4xl font-bold mb-4 text-gray-900">
          Elige tu nivel y empieza hoy mismo
        </h1>
        <br></br>
        <br></br>
      </section>

      {/* Pricing Cards */}
      <section className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 pb-24">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`relative bg-white rounded-2xl border p-6 shadow-xl flex flex-col justify-between hover:scale-[1.02] transition-transform duration-300 ease-in-out ${
              plan.badge ? "border-blue-600" : "border-gray-200"
            }`}
          >
            {plan.badge && (
              <span className="absolute top-4 right-4 bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
                {plan.badge}
              </span>
            )}

            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-1">{plan.name}</h3>
              <p className="text-3xl font-bold text-blue-600">{plan.price}</p>
              <p className="text-sm text-gray-500 mt-1">{plan.duration}</p>

              <div className="mt-4 space-y-1 text-sm text-gray-600">
                {plan.features.map((f, i) => (
                  <p key={i}>✅ {f}</p>
                ))}
              </div>

              <div className="mt-4">
                <p className="text-gray-500 text-sm line-through">Pago único: {plan.oldPrice}</p>
                <p className="text-green-600 font-semibold">Ahora: {plan.finalPrice}</p>
              </div>
            </div>

            <button className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition">
              Seleccionar plan
            </button>
          </div>
        ))}
      </section>

      {/* Footer call to action */}
      <footer className="text-center pb-10">
        <p className="text-gray-500 text-sm">© {new Date().getFullYear()} HomeTeacher. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}
