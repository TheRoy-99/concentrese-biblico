import { useState } from "react";

export default function StartScreen({ onStart }) {
  const [players, setPlayers] = useState(["", ""]);
  const [error, setError] = useState("");

  const handleChange = (index, value) => {
    const updated = [...players];
    updated[index] = value;
    setPlayers(updated);
  };

  const addPlayer = () => {
    if (players.length < 6) setPlayers([...players, ""]);
  };

  const removePlayer = (index) => {
    if (players.length > 2) {
      const updated = players.filter((_, i) => i !== index);
      setPlayers(updated);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = players.map(p => p.trim()).filter(p => p !== "");
    if (trimmed.length < 2) {
      setError("Debe haber al menos 2 jugadores.");
      return;
    }
    setError("");
    onStart(trimmed);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-200 to-indigo-300 p-4">
      <h1 className="text-4xl font-bold text-white mb-6">Concéntrese Bíblico</h1>
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md space-y-4">
        <h2 className="text-xl font-semibold text-gray-700 mb-2">Ingresa los nombres de los jugadores:</h2>
        
        {players.map((player, index) => (
          <div key={index} className="flex items-center gap-2">
            <input
              type="text"
              value={player}
              onChange={(e) => handleChange(index, e.target.value)}
              placeholder={`Jugador ${index + 1}`}
              className="flex-1 p-2 border border-gray-300 rounded"
              required
            />
            {players.length > 2 && (
              <button
                type="button"
                onClick={() => removePlayer(index)}
                className="text-red-500 hover:text-red-700"
              >
                ✕
              </button>
            )}
          </div>
        ))}

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <div className="flex justify-between mt-4">
          <button
            type="button"
            onClick={addPlayer}
            disabled={players.length >= 6}
            className="px-3 py-1 bg-indigo-200 text-indigo-700 rounded hover:bg-indigo-300"
          >
            Añadir jugador
          </button>

          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Iniciar juego
          </button>
        </div>
      </form>
    </div>
  );
}
