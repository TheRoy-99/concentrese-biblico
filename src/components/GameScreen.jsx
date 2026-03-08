
import { useGame } from "../context/GameContext";
import { useGameEngine } from "../hooks/useGameEngine";
import { VERSES } from "../data/gameConfig";
import HUD from "./HUD";
import TeamsHUD from "./TeamsHUD";
import GameBoard from "./GameBoard";

export default function GameScreen({ zoom, setZoom }) {
  const { state, sessionRestored }    = useGame();
  const { togglePause, goToMenu, startGame } = useGameEngine();
  const { paused }                    = state;

  return (
    <>
      <TeamsHUD />
      <HUD zoom={zoom} setZoom={setZoom} />
      <GameBoard />

      {/* ── Pausa normal ── */}
      {paused && !sessionRestored && (
        <div className="overlay" role="dialog" aria-modal="true">
          <div className="modal" onClick={e => e.stopPropagation()}>
            <span className="modal-emoji">⏸</span>
            <p className="modal-title">Pausa</p>
            <p className="modal-verse">{VERSES.pause}</p>
            <div className="btn-group">
              <button className="btn btn-primary"   onClick={togglePause}>Continuar</button>
              <button className="btn btn-secondary" onClick={goToMenu}>Menú</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Sesión restaurada tras recarga ── */}
      {paused && sessionRestored && (
        <div className="overlay" role="dialog" aria-modal="true">
          <div className="modal" onClick={e => e.stopPropagation()}>
            <span className="modal-emoji">🔄</span>
            <p className="modal-title">Partida restaurada</p>
            <p className="modal-verse">
              Tu progreso fue recuperado automáticamente.{"\n"}
              ¡Puedes continuar donde lo dejaste!
            </p>
            <div className="btn-group">
              <button className="btn btn-primary"   onClick={togglePause}>Continuar</button>
              <button className="btn btn-secondary" onClick={startGame}>Nueva partida</button>
              <button className="btn btn-secondary" onClick={goToMenu}>Menú</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}