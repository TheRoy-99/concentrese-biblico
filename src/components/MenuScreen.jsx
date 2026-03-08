/**
 * MenuScreen.jsx
 * Pantalla de inicio: selector de equipos, dificultad y botón de inicio.
 */

import { useGame } from "../context/GameContext";
import { useGameEngine } from "../hooks/useGameEngine";
import { DIFFICULTY_CONFIG, TEAM_COLORS } from "../data/gameConfig";

export default function MenuScreen() {
  const { state }                              = useGame();
  const { startGame, setLevel, setTeamCount, setTeamName } = useGameEngine();
  const { level, teamCount, teamNames, bestMoves } = state;

  const diffEntries = Object.entries(DIFFICULTY_CONFIG);

  return (
    <div className="menu-screen">

      {/* ── Modo de juego ── */}
      <p className="section-label">Modo de juego</p>
      <div className="teams-box">
        <div className="mode-strip">
          {[1, 2, 3, 4].map(n => (
            <button
              key={n}
              className={`mode-btn${teamCount === n ? " sel" : ""}`}
              onClick={() => setTeamCount(n)}
              aria-pressed={teamCount === n}
            >
              {n === 1 ? "Individual" : `${n} Equipos`}
            </button>
          ))}
        </div>

        {Array.from({ length: teamCount }).map((_, i) => (
          <div className="team-row" key={i}>
            <div className="team-dot" style={{ background: TEAM_COLORS[i].dot }} />
            <input
              className="team-input"
              value={teamNames[i]}
              onChange={e => setTeamName(i, e.target.value)}
              placeholder={`Equipo ${i + 1}`}
              maxLength={20}
              aria-label={`Nombre del equipo ${i + 1}`}
            />
          </div>
        ))}
      </div>

      {/* ── Dificultad ── */}
      <p className="section-label">Dificultad</p>
      <div className="diff-grid">
        {diffEntries.map(([key, d]) => (
          <button
            key={key}
            className={`diff-btn${level === key ? " active" : ""}`}
            onClick={() => setLevel(key)}
            aria-pressed={level === key}
          >
            <span className="diff-icon" aria-hidden>{d.icon}</span>
            {d.label}
            <span className="diff-sub">
              {d.pairs.length} pares · {d.hintsAllowed} pistas
            </span>
          </button>
        ))}
      </div>

      {/* Mejor registro */}
      {bestMoves[level] && (
        <p className="badge">
          ✦ Mejor registro — {DIFFICULTY_CONFIG[level].label}: {bestMoves[level]} movimientos
        </p>
      )}

      <button className="start-btn" onClick={startGame}>
        COMENZAR EL JUEGO
      </button>
    </div>
  );
}