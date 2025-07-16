import { Lightbulb, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const TutorialModal = ({ open, onClose, title, description, points = [] }) => {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="relative bg-white rounded-2xl shadow-xl max-w-lg w-full p-6"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              aria-label="Cerrar tutorial"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <Lightbulb className="text-yellow-500" size={28} />
              <h2 className="text-xl font-semibold text-gray-800">
                {title || "¿Cómo aprovechar esta actividad?"}
              </h2>
            </div>

            {description && (
              <p className="text-gray-600 mb-4">{description}</p>
            )}

            {points.length > 0 && (
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                {points.map((point, index) => (
                  <li key={index}>{point}</li>
                ))}
              </ul>
            )}

            <div className="mt-6 text-center">
              <button
                onClick={onClose}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                ¡Entendido!
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default TutorialModal;
