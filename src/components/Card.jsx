/**
 * Card.jsx
 * Componente presentacional puro — recibe props, no toca el contexto.
 * Responsabilidad única: renderizar una carta con sus estados visuales.
 */

import "../styles/card.css";

/**
 * @param {object}   props
 * @param {object}   props.card         — datos de la carta { uniqueId, matchId, type, content, side }
 * @param {number}   props.index        — posición en el tablero (para mostrar "Nº X")
 * @param {boolean}  props.isFlipped    — carta volteada por el jugador
 * @param {boolean}  props.isMatched    — par encontrado
 * @param {boolean}  props.isMismatch   — animación de error
 * @param {boolean}  props.isHinting    — animación de pista (brillo azul)
 * @param {function} props.onClick      — handler del clic
 */
export default function Card({
  card,
  index,
  isFlipped,
  isMatched,
  isMismatch,
  isHinting,
  onClick,
}) {
  const faceUp    = isFlipped || isMatched;
  const typeClass = card.type === "couple" ? "type-couple" : "";

  const innerClasses = [
    "card-inner",
    faceUp     ? "flipped"  : "",
    isMatched  ? "matched"  : "",
    isMismatch ? "shake"    : "",
  ].filter(Boolean).join(" ");

  return (
    <div
      className={`card-wrapper${isHinting ? " hinting" : ""}`}
      onClick={() => !faceUp && onClick(card)}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === "Enter" && !faceUp && onClick(card)}
      aria-label={faceUp ? card.content : `Carta ${index + 1}`}
      aria-pressed={faceUp}
    >
      <div className={innerClasses}>

        {/* ── Cara boca-abajo ── */}
        <div className="card-face card-front">
          <span className="card-corner tl" aria-hidden>✦</span>
          <span className="card-front-sym" aria-hidden>✦</span>
          <span className="card-front-num">Nº {index + 1}</span>
          <span className="card-corner br" aria-hidden>✦</span>
        </div>

        {/* ── Cara boca-arriba ── */}
        <div className={`card-face card-back ${typeClass}`}>
          {/*
            side === "front"  → nombre / pareja  (primario)
            side === "back"   → descripción       (se muestra en cursiva)
            Visualmente la descripción usa una fuente más pequeña
          */}
          {card.side === "front" ? (
            <span className="card-content-primary">{card.content}</span>
          ) : (
            <span className="card-content-secondary">{card.content}</span>
          )}

          {/* Badge sutil para pares de tipo "couple" */}
          {card.type === "couple" && card.side === "front" && (
            <span style={{
              position:   "absolute",
              bottom:     "6px",
              right:      "7px",
              fontSize:   ".3rem",
              fontFamily: "'Cinzel', serif",
              color:      "rgba(201,168,76,.5)",
              letterSpacing: ".1em",
            }}>
              PAREJA
            </span>
          )}
        </div>

      </div>
    </div>
  );
}