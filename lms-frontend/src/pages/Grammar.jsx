import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, HelpCircle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../assets/loog.png";
import avatar from "/avatarhome2.png";

const Grammar = () => {
  const { unitId } = useParams();
  const [videoUrl, setVideoUrl] = useState("");
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);

  useEffect(() => {
    const fetchGrammarData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/grammar/${unitId}`);
        const data = await response.json();
        setVideoUrl(data.video_url);
      } catch (error) {
        console.error("Error fetching grammar data:", error);
      }
    };

    fetchGrammarData();
  }, [unitId]);

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <header className="sticky top-0 w-full bg-white shadow-md flex items-center justify-between px-6 py-4 border-b z-50">
        <Link to="/home" className="flex items-center gap-4">
          <img src={logo} alt="Logo" className="h-10 w-auto cursor-pointer" />
          <h1 className="text-2xl font-bold text-gray-800">Unit {unitId}: Grammar</h1>
        </Link>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsTutorialOpen(true)}
            className="flex items-center gap-2 bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            <HelpCircle size={20} />
            Tutorial
          </button>

          <Link to={`/unidad/${unitId}`} className="flex items-center gap-2 bg-gray-300 text-gray-800 font-semibold px-4 py-2 rounded-lg hover:bg-gray-400 transition">
            <ArrowLeft size={24} />
            Volver
          </Link>

          <Link to={`/unidad/${unitId}/assessment`} className="flex items-center gap-2 bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition">
            Siguiente
            <ArrowRight size={20} />
          </Link>
        </div>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="bg-white shadow-lg rounded-xl p-8 max-w-4xl w-full text-center border">
          <iframe
            src={videoUrl}
            width="960"
            height="450"
            frameBorder="0"
            allow="autoplay; fullscreen"
            allowFullScreen
            className="w-full rounded-lg"
          ></iframe>
        </div>
      </div>

      <AnimatePresence>
        {isTutorialOpen && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsTutorialOpen(false)}
          >
            <motion.div
              className="bg-white p-6 rounded-lg shadow-lg max-w-4xl w-full relative overflow-auto max-h-[90vh]"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button onClick={() => setIsTutorialOpen(false)} className="absolute top-2 right-2 bg-gray-200 hover:bg-gray-300 text-gray-600 p-2 rounded-full">
                <X size={18} />
              </button>
              <h2 className="text-2xl font-bold text-gray-800">Explicación Gramatical</h2>
              <p className="font-semibold mt-2">Los pronombres personales y el verbo <i>to be</i> en simple present afirmativo</p>
              <div className="flex">
                <div className="flex-1">
                  <table className="w-full border-collapse border border-gray-300 mt-4">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border border-gray-300 p-2">Singular</th>
                        <th className="border border-gray-300 p-2">Plural</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr><td className="border border-gray-300 p-2">I - yo</td><td className="border border-gray-300 p-2">we - nosotros</td></tr>
                      <tr><td className="border border-gray-300 p-2">you - tú, usted</td><td className="border border-gray-300 p-2">you - vosotros, ustedes</td></tr>
                      <tr><td className="border border-gray-300 p-2">he, she, it - él, ella, ello</td><td className="border border-gray-300 p-2">they - ellos, ellas</td></tr>
                    </tbody>
                  </table>
                  <h3 className="mt-6 text-2xl font-bold">El verbo "to be"</h3>
                  <table className="w-full border-collapse border border-gray-300 mt-4">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border border-gray-300 p-2">Persona</th>
                        <th className="border border-gray-300 p-2">Verbo</th>
                        <th className="border border-gray-300 p-2">Traducción</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr><td className="border border-gray-300 p-2">I</td><td className="border border-gray-300 p-2">am</td><td className="border border-gray-300 p-2">yo soy / yo estoy</td></tr>
                      <tr><td className="border border-gray-300 p-2">you</td><td className="border border-gray-300 p-2">are</td><td className="border border-gray-300 p-2">tú eres / tú estás</td></tr>
                      <tr><td className="border border-gray-300 p-2">he, she, it</td><td className="border border-gray-300 p-2">is</td><td className="border border-gray-300 p-2">él, ella, ello es / está</td></tr>
                    </tbody>
                  </table>
                </div>
                <div className="w-1/3 flex items-center justify-center">
                  <img src={avatar} alt="Avatar" className="w-48" />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Grammar;
