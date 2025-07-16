import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  HelpCircle,
  X,
} from "lucide-react";
import logo from "../assets/loog.png";
import shuffle from "lodash.shuffle";

const pairs = [
  { id: 1, left: "I", right: "am" },
  { id: 2, left: "He", right: "is" },
  { id: 3, left: "They", right: "are" },
];

const generateCards = () => {
  const leftCards = pairs.map((p) => ({ ...p, type: "left", value: p.left }));
  const rightCards = pairs.map((p) => ({ ...p, type: "right", value: p.right }));
  return shuffle([...leftCards, ...rightCards]);
};

const Assessment = () => {
  const { unitId } = useParams();
  const [cards, setCards] = useState(generateCards);
  const [selected, setSelected] = useState([]);
  const [matchedIds, setMatchedIds] = useState([]);

  useEffect(() => {
    if (selected.length === 2) {
      const [first, second] = selected;
      const isMatch =
        first.id === second.id && first.type !== second.type;

      setTimeout(() => {
        if (isMatch) {
          setMatchedIds((prev) => [...prev, first.id]);
        }
        setSelected([]);
      }, 800);
    }
  }, [selected]);

  const handleClick = (card) => {
    if (
      selected.length < 2 &&
      !selected.includes(card) &&
      !matchedIds.includes(card.id)
    ) {
      setSelected((prev) => [...prev, card]);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-white">
      <header className="sticky top-0 w-full bg-white shadow-md flex items-center justify-between px-6 py-4 border-b z-50">
        <Link to="/home" className="flex items-center gap-4">
          <img src={logo} alt="Logo" className="h-10 w-auto cursor-pointer" />
          <h1 className="text-2xl font-bold text-gray-800">
            Unit {unitId}: Assessment
          </h1>
        </Link>

        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition">
            <HelpCircle size={20} /> Tutorial
          </button>

          <Link
            to={`/unidad/${unitId}`}
            className="flex items-center gap-2 bg-gray-300 text-gray-800 font-semibold px-4 py-2 rounded-lg hover:bg-gray-400 transition"
          >
            <ArrowLeft size={24} /> Volver
          </Link>

          <Link
            to={`/unidad/${unitId}/vocabulary`}
            className="flex items-center gap-2 bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Siguiente <ArrowRight size={20} />
          </Link>
        </div>
      </header>

      <main className="flex-1 p-6 flex flex-col items-center justify-center">
        <h2 className="text-xl font-semibold text-gray-700 mb-6">
          Empareja cada pronombre con su forma correcta del verbo "to be"
        </h2>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4 max-w-5xl">
          {cards.map((card, index) => {
            const isSelected = selected.includes(card);
            const isMatched = matchedIds.includes(card.id);

            return (
              <div
                key={index}
                onClick={() => handleClick(card)}
                className={`w-28 h-36 cursor-pointer flex items-center justify-center rounded-2xl shadow-md text-lg font-bold transition-transform duration-300 border-2 text-gray-800 select-none
                  ${
                    isMatched || isSelected
                      ? "bg-blue-200 border-blue-400"
                      : "bg-white hover:bg-gray-100 border-gray-300"
                  }
                `}
              >
                {isMatched || isSelected ? card.value : "?"}
              </div>
            );
          })}
        </div>

        {matchedIds.length === pairs.length && (
          <p className="mt-8 text-green-600 font-semibold text-lg">
            ✅ ¡Bien hecho! Has emparejado todas las tarjetas correctamente.
          </p>
        )}
      </main>
    </div>
  );
};

export default Assessment;
