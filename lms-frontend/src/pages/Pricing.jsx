import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { X, Phone } from "lucide-react";
import logo from "../assets/loog.png";

const Pricing = () => {
    const navigate = useNavigate();

    // 🔓 Página pública → eliminamos la redirección obligatoria
    // Si quisieras redirigir SOLO si está logueado, usa el código alternativo

    const calculateDiscount = (oldPrice, finalPrice) => {
        if (!oldPrice || !finalPrice) return null;
        return Math.round(((oldPrice - finalPrice) / oldPrice) * 100);
    };

    const monthlyPlans = [
        {
            name: "Nivel B1",
            price: "84,25 €",
            oldPrice: 1300,
            finalPrice: 900,
            features: [
                "72 unidades",
                "12 meses de Tutorización",
                "Consultas ilimitadas por tutoría",
                "Palabras aprendidas: 2428",
            ],
        },
        {
            name: "Nivel B1+B2",
            price: "60,49 €",
            oldPrice: 1600,
            finalPrice: 1200,
            mostPopular: true,
            features: [
                "144 unidades",
                "24 meses de Tutorización",
                "Consultas ilimitadas por tutoría",
                "Palabras aprendidas: 4518",
            ],
        },
        {
            name: "Nivel B2",
            price: "84,25 €",
            oldPrice: 1300,
            finalPrice: 900,
            features: [
                "72 unidades",
                "12 meses de Tutorización",
                "Consultas ilimitadas por tutoría",
                "Palabras aprendidas: 2090",
            ],
        },
    ];

    const printYearly = [];

    const [currentMode, setCurrentMode] = useState("monthly");
    const activePlans = currentMode === "monthly" ? monthlyPlans : printYearly;

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <header className="bg-white shadow-md px-4 py-1 flex justify-between items-center w-full border-b border-gray-300">
                <img src={logo} alt="Logo" className="h-16 w-auto" />

                <div className="flex items-center gap-4">
                    <a
                        href="https://calendly.com/hometeacher-empresas"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-blue-600 text-white font-semibold px-4 py-2 rounded-md hover:bg-blue-700 transition flex items-center gap-2"
                    >
                        <Phone size={18} />
                        ¿Te llamamos?
                    </a>

                    <a
                        href="https://calendly.com/hometeacher-empresas"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="border border-blue-600 text-blue-600 font-semibold px-4 py-2 rounded-md hover:bg-blue-600 hover:text-white transition flex items-center gap-2"
                    >
                        <Phone size={18} />
                        ¿Necesitas financiación?
                    </a>

                    <button
                        onClick={() => {
                            const u = localStorage.getItem("user");
                            navigate(u ? "/home" : "/login");
                        }}
                        className="w-10 h-10 flex items-center justify-center border border-blue-600 rounded-full text-blue-600 hover:bg-blue-600 hover:text-white transition"
                    >
                        <X size={24} />
                    </button>
                </div>
            </header>

            <div className="text-center mt-6">
                <h1 className="text-3xl font-bold text-gray-900">
                    Elige el nivel que deseas alcanzar y el plan más cómodo
                </h1>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {activePlans.map((plan) => {
                    const discount =
                        currentMode === "monthly" &&
                        plan.oldPrice &&
                        plan.finalPrice
                            ? calculateDiscount(plan.oldPrice, plan.finalPrice)
                            : null;

                    return (
                        <div
                            key={plan.name}
                            className={`relative flex flex-col justify-between overflow-hidden bg-white shadow-lg ${
                                plan.mostPopular ? "border-blue-600" : "border-gray-200"
                            }`}
                            style={{
                                borderRadius: "30px 0 30px 0",
                                border: "1px solid #e5e7eb",
                                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                            }}
                        >
                            <div className="h-8 w-full bg-red-600"></div>

                            <div className="p-6 flex-1 flex flex-col justify-between relative">
                                {plan.mostPopular && (
                                    <span className="absolute top-2 right-2 bg-blue-600 text-white text-xs font-bold uppercase px-3 py-1 rounded-full">
                                        Más popular
                                    </span>
                                )}

                                <h3 className="text-lg font-bold">{plan.name}</h3>

                                <div className="flex justify-between items-center mt-2">
                                    <p className="text-2xl font-bold">
                                        {plan.price}
                                        <span className="text-sm"> / mes</span>
                                    </p>
                                </div>

                                <ul className="mt-4 space-y-2 text-sm text-gray-600">
                                    {plan.features.map((f, i) => (
                                        <li key={i}>✅ {f}</li>
                                    ))}
                                </ul>
                            </div>

                            <div className="h-8 w-full" style={{ backgroundColor: "#003087" }}></div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Pricing;
