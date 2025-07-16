import { useEffect, useState } from "react";

export const useCountdown24h = (startTime) => {
  const [remainingTime, setRemainingTime] = useState(0);

  useEffect(() => {
    let demoStart;

    if (startTime) {
      demoStart = new Date(startTime);
    } else {
      // Usar demoStartTime almacenado o crearlo si no existe
      const stored = localStorage.getItem("demoStartTime");
      if (stored) {
        demoStart = new Date(stored);
      } else {
        demoStart = new Date();
        localStorage.setItem("demoStartTime", demoStart.toISOString());
      }
    }

    const updateRemaining = () => {
      const now = Date.now();
      const elapsed = now - demoStart.getTime();
      const diff = 24 * 60 * 60 * 1000 - elapsed;
      setRemainingTime(Math.max(diff, 0));
    };

    updateRemaining(); // Calcular de inmediato
    const interval = setInterval(updateRemaining, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  return remainingTime;
};
