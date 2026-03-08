/**
 * HUD.jsx — barra superior con botón de proyección ⛶
 */
import { useGame } from "../context/GameContext";
import { useGameEngine } from "../hooks/useGameEngine";
import { useStopwatch } from "../hooks/useStopwatch";
import { DIFFICULTY_CONFIG } from "../data/gameConfig";

export default function HUD({ zoom, setZoom }) {
  const { state }                          = useGame();
  const { useHint, togglePause, goToMenu } = useGameEngine();
  const { elapsedLabel }                   = useStopwatch();
  const { matched, moves, hintsLeft, level } = state;
  const totalPairs = DIFFICULTY_CONFIG[level].pairs.length;

  return (
    <div className="hud">
      <div className="hud-card">
        <span className="hud-label">Tiempo</span>
        <span className="hud-value">{elapsedLabel}</span>
      </div>
      <div className="hud-card">
        <span className="hud-label">Pares</span>
        <span className="hud-value">{matched.length}/{totalPairs}</span>
      </div>
      <div className="hud-card">
        <span className="hud-label">Movimientos</span>
        <span className="hud-value">{moves}</span>
      </div>
      <div className="ctrl-row">
        <button
          className="icon-btn hint-btn"
          onClick={useHint}
          disabled={hintsLeft <= 0}
          title={`Pista (${hintsLeft} restantes)`}
        >
          💡 {hintsLeft}
        </button>
        <button
          className={`icon-btn zoom-btn${zoom ? " on" : ""}`}
          onClick={() => setZoom(z => !z)}
          title={zoom ? "Modo normal" : "Modo proyección"}
        >
          {zoom ? "⊖ zoom" : "⊕ zoom"}
        </button>
        <button className="icon-btn" onClick={togglePause} title="Pausar">⏸</button>
        <button className="icon-btn" onClick={goToMenu}    title="Menú">⌂</button>
      </div>
    </div>
  );
}