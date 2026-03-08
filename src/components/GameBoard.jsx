/**
 * GameBoard.jsx
 * Renderiza la grilla de cartas.
 * Lee estado del contexto, pasa handleCardClick desde useGameEngine.
 */

import { useGame } from "../context/GameContext";
import { useGameEngine } from "../hooks/useGameEngine";
import { DIFFICULTY_CONFIG } from "../data/gameConfig";
import Card from "./Card";

export default function GameBoard() {
  const { state }          = useGame();
  const { handleCardClick } = useGameEngine();

  const { cards, flipped, matched, mismatched, hintGlows, level } = state;
  const cols = DIFFICULTY_CONFIG[level].cols;

  return (
    <div
      className="board"
      style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
      role="grid"
      aria-label="Tablero de juego"
    >
      {cards.map((card, i) => (
        <Card
          key={card.uniqueId}
          card={card}
          index={i}
          isFlipped={flipped.includes(card.uniqueId)}
          isMatched={matched.includes(card.matchId)}
          isMismatch={mismatched.includes(card.uniqueId)}
          isHinting={hintGlows.includes(card.uniqueId)}
          onClick={handleCardClick}
        />
      ))}
    </div>
  );
}