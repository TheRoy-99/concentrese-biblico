/**
 * ResultScreen.jsx
 * Pantalla de resultado: medalla, stats, puntajes por equipo y acciones.
 */

import { useGame } from "../context/GameContext";
import { useGameEngine } from "../hooks/useGameEngine";
import { TEAM_COLORS, VERSES } from "../data/gameConfig";
import { calcMedal, calcAccuracy, formatTime, pickRandom } from "../data/gameUtils";

export default function ResultScreen() {
  const { state }              = useGame();
  const { startGame, goToMenu } = useGameEngine();

  const {
    level, teamCount, teamNames,
    bestMoves, result,
  } = state;

  if (!result) return null;

  const { moves, elapsed, hintsUsed, teamScores, totalPairs } = result;

  const medal    = calcMedal(moves, level);
  const accuracy = calcAccuracy(totalPairs, moves);
  const verse    = pickRandom(VERSES.win);

  // Equipo ganador (multijugador)
  const winnerIdx = teamCount > 1
    ? teamScores.indexOf(Math.max(...teamScores.slice(0, teamCount)))
    : null;

  return (
    <div className="overlay" role="dialog" aria-modal="true" aria-label="Resultado del juego">
      <div className="modal">

        <span className="modal-emoji" aria-hidden>🏆</span>

        {/* ── Medalla ── */}
        <div className="medal-wrap" aria-label={`Medalla de ${medal.label}`}>
          <span className="medal-icon" aria-hidden>{medal.icon}</span>
          <p className="medal-label" style={{ color: medal.color }}>
            MEDALLA DE {medal.label}
          </p>
        </div>

        <p className="modal-title">¡Completado!</p>
        <p className="modal-verse">{verse}</p>

        {/* ── Puntajes por equipo ── */}
        {teamCount > 1 && (
          <div className="team-results" style={{ marginBottom: "1rem" }}>
            {Array.from({ length: teamCount })
              .map((_, i) => ({ i, score: teamScores[i] }))
              .sort((a, b) => b.score - a.score)
              .map(({ i, score }) => (
                <div
                  key={i}
                  className={`team-result${i === winnerIdx ? " winner" : ""}`}
                >
                  <span className="tr-name">
                    {i === winnerIdx && <span aria-hidden style={{ marginRight: ".35rem" }}>👑</span>}
                    {teamNames[i]}
                  </span>
                  <span className="tr-score" style={{ color: TEAM_COLORS[i].dot }}>
                    {score} par{score !== 1 ? "es" : ""}
                  </span>
                </div>
              ))}
          </div>
        )}

        {/* ── Estadísticas ── */}
        <div className="stats-grid">
          <div className="stat-box">
            <div className="stat-lbl">Movimientos</div>
            <div className="stat-val">{moves}</div>
          </div>
          <div className="stat-box">
            <div className="stat-lbl">Tiempo total</div>
            <div className="stat-val">{formatTime(elapsed)}</div>
          </div>
          <div className="stat-box">
            <div className="stat-lbl">Precisión</div>
            <div className="stat-val">{accuracy}%</div>
          </div>
          <div className="stat-box">
            <div className="stat-lbl">Pistas usadas</div>
            <div className="stat-val">{hintsUsed}</div>
          </div>
        </div>

        {/* Mejor registro */}
        {bestMoves[level] && (
          <p className="badge">✦ Mejor registro: {bestMoves[level]} movimientos</p>
        )}

        {/* Acciones */}
        <div className="btn-group">
          <button className="btn btn-primary"   onClick={startGame}>Jugar de nuevo</button>
          <button className="btn btn-secondary" onClick={goToMenu}>Menú</button>
        </div>

      </div>
    </div>
  );
}