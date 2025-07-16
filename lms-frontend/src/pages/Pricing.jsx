import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { X, Phone } from "lucide-react";
import logo from "../assets/loog.png";

const Pricing = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (!storedUser) {
            navigate("/login");
        }
    }, [navigate]);

    const calculateDiscount = (oldPrice, finalPrice) => {
        if (!oldPrice || !finalPrice) return null;
        return Math.round(((oldPrice - finalPrice) / oldPrice) * 100);
    };

    const monthlyPlans = [
        {
            name: "Nivel B1",
            price: "56,25 €",
            oldPrice: 950,
            finalPrice: 600,
            features: ["72 unidades", "Up to 1,000 subscribers", "Basic analytics", "48-hour support response time"]
        },
        {
            name: "Nivel B1+B2",
            price: "70,25 €",
            oldPrice: 1600,
            finalPrice: 750,
            mostPopular: true,
            features: ["144 unidades", "Unlimited subscribers", "Advanced analytics", "1-hour dedicated support"]
        },
        {
            name: "Nivel B2",
            price: "56,25 €",
            oldPrice: 950,
            finalPrice: 750,
            features: ["72 unidades", "Up to 1,000 subscribers", "Basic analytics", "48-hour support response time"]
        }
    ];

    const yearlyPlans = [
        {
            name: "Nivel B1",
            price: "650 €",
            features: ["5 products", "Up to 1,000 subscribers", "Basic analytics", "48-hour support response time"]
        },
        {
            name: "Nivel B1+B2",
            price: "1100 €",
            mostPopular: true,
            features: ["Unlimited products", "Unlimited subscribers", "Advanced analytics", "1-hour dedicated support", "Marketing automations", "Custom reporting tools"]
        },
        {
            name: "Nivel B2",
            price: "650 €",
            features: ["5 products", "Up to 1,000 subscribers", "Basic analytics", "48-hour support response time"]
        }
    ];

    const [currentMode, setCurrentMode] = useState("monthly");

    const activePlans = currentMode === "monthly" ? monthlyPlans : yearlyPlans;

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
            onClick={() => navigate("/home")}
            className="w-10 h-10 flex items-center justify-center border border-blue-600 rounded-full text-blue-600 hover:bg-blue-600 hover:text-white transition"
        >
            <X size={24} />
        </button>
    </div>
</header>



            <div className="text-center mt-6">
                <h1 className="text-3xl font-bold text-gray-900">Elige el nivel que deseas alcanzar y el plan más cómodo</h1>
            </div>

            {/* Botones normales */}
            <div className="mt-10 flex gap-3 justify-center">
    <button
        onClick={() => setCurrentMode("monthly")}
        className={`px-6 py-2 rounded-md text-sm font-semibold transition ${
            currentMode === "monthly"
                ? "bg-blue-600 text-white"
                : "border border-blue-600 text-blue-600 bg-white hover:bg-blue-600 hover:text-white"
        }`}
    >
        Anual
    </button>

    {/* <button
        onClick={() => setCurrentMode("yearly")}
        className={`px-6 py-2 rounded-md text-sm font-semibold transition ${
            currentMode === "yearly"
                ? "bg-blue-600 text-white"
                : "border border-blue-600 text-blue-600 bg-white hover:bg-blue-600 hover:text-white"
        }`}
    >
        Premium
    </button> */}
</div>


            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {activePlans.map((plan) => {
                    const discount = currentMode === "monthly" && plan.oldPrice && plan.finalPrice
                        ? calculateDiscount(plan.oldPrice, plan.finalPrice)
                        : null;

                    return (
                        <div key={plan.name} className={`relative flex flex-col justify-between overflow-hidden bg-white shadow-lg ${plan.mostPopular ? "border-blue-600" : "border-gray-200"}`} style={{ borderRadius: "30px 0 30px 0", border: "1px solid #e5e7eb", boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)" }}>
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
                                        <span className="text-sm"> / {currentMode === "monthly" ? "mes" : "año"}</span>
                                    </p>

                                    {discount && (
                                        <span className="text-green-600 font-bold text-xs bg-green-100 px-2 py-1 rounded">
                                            -{discount}%
                                        </span>
                                    )}
                                </div>

                                {discount && (
                                    <div className="mt-2 flex items-center gap-3">
                                        <span className="text-gray-700">Pago Único:</span>
                                        <span className="text-gray-500 line-through">{plan.oldPrice} €</span>
                                        <span className="text-green-600 font-bold">{plan.finalPrice} €</span>
                                    </div>
                                )}

                                <button className={`mt-4 py-2 font-semibold rounded-md ${plan.mostPopular ? "bg-blue-600 text-white" : "border border-blue-600 text-blue-600 bg-white hover:bg-blue-600 hover:text-white"}`}>
                                    Seleccionar plan
                                </button>

                                <ul className="mt-4 space-y-2 text-sm text-gray-600">
                                    {plan.features.map((feature, index) => (
                                        <li key={index}>✅ {feature}</li>
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
