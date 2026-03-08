/**
 * useStopwatch.js
 * Hook aislado para el cronómetro — reutilizable en cualquier componente.
 * El GameEngine ya maneja el tick vía dispatch, pero este hook
 * puede usarse para mostrar el tiempo sin acoplar al contexto.
 */

import { formatTime } from "../data/gameUtils";
import { useGame } from "../context/GameContext";

export function useStopwatch() {
  const { state } = useGame();
  return {
    elapsed:      state.elapsed,
    elapsedLabel: formatTime(state.elapsed),
  };
}