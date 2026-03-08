/**
 * TeamsHUD.jsx
 * Franja de puntajes por equipo, solo visible en modo multijugador.
 */

import { useGame } from "../context/GameContext";
import { TEAM_COLORS } from "../data/gameConfig";

export default function TeamsHUD() {
  const { state } = useGame();
  const { teamCount, teamNames, teamScores, activeTeam } = state;

  if (teamCount <= 1) return null;

  return (
    <div className="teams-hud" role="status" aria-live="polite">
      {Array.from({ length: teamCount }).map((_, i) => {
        const color  = TEAM_COLORS[i];
        const active = activeTeam === i;
        return (
          <div
            key={i}
            className={`team-pill${active ? " active" : ""}`}
            style={{
              background:  color.bg,
              borderColor: active ? color.border : "transparent",
            }}
            aria-current={active ? "true" : undefined}
          >
            <div className="team-dot" style={{ background: color.dot }} />
            <span style={{ fontFamily: "'Cinzel', serif", fontSize: ".7rem" }}>
              {teamNames[i]}
            </span>
            <span
              className="tp-score"
              style={{ color: color.dot }}
              aria-label={`${teamScores[i]} pares`}
            >
              {teamScores[i]}
            </span>
          </div>
        );
      })}
    </div>
  );
}