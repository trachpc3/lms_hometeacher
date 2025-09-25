import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useCountdown24h } from "../../hooks/useCountdown24h";

const CountdownBanner = ({ startTime }) => {
  const remainingTime = useCountdown24h(startTime);
  const [notified, setNotified] = useState(() => localStorage.getItem("demoExpiredNotified") === "true");

  const user = JSON.parse(localStorage.getItem("user"));
  if (!user || user.estado_formacion !== "demo") return null;

  useEffect(() => {
    if (remainingTime === 0 && !notified) {
      toast.error("⏰ Tu acceso demo ha finalizado");
      localStorage.setItem("demoExpiredNotified", "true");
      setNotified(true);
    }
  }, [remainingTime, notified]);

  if (remainingTime <= 0) return null;

  return (
    <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-2 rounded text-sm text-center mb-4 animate-pulse">
      ✅ Bienvenido, estás conectad@ como <strong>alumn@ de prueba</strong>.
    </div>
  );
};

export default CountdownBanner;
