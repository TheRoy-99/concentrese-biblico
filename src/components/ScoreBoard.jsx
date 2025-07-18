export default function ScoreBoard({ players, scores, currentPlayerIndex }) {
  return (
    <div className="w-full max-w-6xl flex flex-wrap justify-center gap-4 mb-6 px-2">
      {players.map((player, index) => {
        const isActive = index === currentPlayerIndex;
        return (
          <div
            key={player}
            className={`flex flex-col items-center p-3 rounded-xl shadow-md text-white transition-all duration-300 
              ${isActive ? "bg-blue-700 scale-105 ring-4 ring-white" : "bg-blue-500"}`}
          >
            <span className="text-lg font-semibold">{player}</span>
            <span className="text-sm">Aciertos: {scores[player]}</span>
            {isActive && (
              <span className="text-xs mt-1 bg-white text-blue-700 px-2 py-0.5 rounded-full font-bold">
                Turno
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
