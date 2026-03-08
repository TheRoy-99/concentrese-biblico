/**
 * useGameEngine.js
 * Hook central de lógica del juego.
 *
 * REGLA CRÍTICA: Este hook se llama UNA SOLA VEZ, desde App.jsx.
 * Los demás componentes (HUD, GameBoard, etc.) SOLO llaman las funciones
 * que exporta este hook — nunca lo importan para sus efectos.
 *
 * Así se evita que el timer y el win-check se ejecuten múltiples veces.
 */

import { useEffect, useRef, useCallback } from "react";
import { useGame, ACTIONS } from "../context/GameContext";
import { DIFFICULTY_CONFIG } from "../data/gameConfig";

// Refs compartidos fuera del hook para que sean verdaderamente únicos
// (el hook se llama 1 vez, pero esto es extra seguro)
const _timerRef = { current: null };
const _lockRef  = { current: false };

export function useGameEngine() {
  const { state, dispatch } = useGame();
  const {
    screen, paused,
    cards, flipped, matched,
    level, hintsLeft, teamCount,
  } = state;

  const totalPairs = DIFFICULTY_CONFIG[level].pairs.length;

  // ── Stopwatch ──────────────────────────────────────────────────────────────
  useEffect(() => {
    clearInterval(_timerRef.current);
    if (screen !== "game" || paused) return;
    _timerRef.current = setInterval(
      () => dispatch({ type: ACTIONS.TICK }),
      1000
    );
    return () => clearInterval(_timerRef.current);
  }, [screen, paused, dispatch]);

  // ── Detección de victoria ──────────────────────────────────────────────────
  useEffect(() => {
    if (screen === "game" && matched.length > 0 && matched.length === totalPairs) {
      clearInterval(_timerRef.current);
      setTimeout(() => dispatch({ type: ACTIONS.GAME_WON }), 650);
    }
  }, [matched.length, totalPairs, screen, dispatch]);

  // ── Iniciar partida ────────────────────────────────────────────────────────
  const startGame = useCallback(() => {
    _lockRef.current = false;
    dispatch({ type: ACTIONS.START_GAME });
  }, [dispatch]);

  // ── Voltear carta ──────────────────────────────────────────────────────────
  const handleCardClick = useCallback((card) => {
    if (_lockRef.current)                  return;
    if (matched.includes(card.matchId))    return;
    if (flipped.includes(card.uniqueId))   return;
    if (flipped.length >= 2)               return;

    dispatch({ type: ACTIONS.FLIP_CARD, payload: { uniqueId: card.uniqueId } });

    if (flipped.length === 1) {
      // Segunda carta — evaluar par
      _lockRef.current = true;
      const firstCard = cards.find(c => c.uniqueId === flipped[0]);
      const isMatch   = firstCard?.matchId === card.matchId;

      if (isMatch) {
        setTimeout(() => {
          dispatch({ type: ACTIONS.RESOLVE_PAIR, payload: { matchId: card.matchId } });
          _lockRef.current = false;
        }, 400);
      } else {
        // Marcar mismatch (anima shake) y luego voltear de vuelta
        dispatch({
          type:    ACTIONS.SET_MISMATCH,
          payload: { ids: [flipped[0], card.uniqueId] },
        });
        setTimeout(() => {
          dispatch({ type: ACTIONS.REJECT_PAIR });
          _lockRef.current = false;
        }, 900);
      }
    }
  }, [flipped, matched, cards, dispatch]);

  // ── Pista ──────────────────────────────────────────────────────────────────
  const useHint = useCallback(() => {
    if (hintsLeft <= 0) return;
    const unmatched = DIFFICULTY_CONFIG[level].pairs
      .filter(p => !matched.includes(p.id));
    if (!unmatched.length) return;

    const target  = unmatched[Math.floor(Math.random() * unmatched.length)];
    const glowIds = cards
      .filter(c => c.matchId === target.id && !flipped.includes(c.uniqueId))
      .map(c => c.uniqueId);

    dispatch({ type: ACTIONS.USE_HINT, payload: { glowIds } });
    setTimeout(() => dispatch({ type: ACTIONS.CLEAR_HINT }), 1300);
  }, [hintsLeft, matched, cards, level, flipped, dispatch]);

  // ── Navegación & config ────────────────────────────────────────────────────
  const goToMenu    = useCallback(() => dispatch({ type: ACTIONS.GO_TO_MENU }),    [dispatch]);
  const togglePause = useCallback(() => dispatch({ type: ACTIONS.TOGGLE_PAUSE }),  [dispatch]);
  const setLevel    = useCallback(l  => dispatch({ type: ACTIONS.SET_LEVEL,      payload: l }), [dispatch]);
  const setTeamCount= useCallback(n  => dispatch({ type: ACTIONS.SET_TEAM_COUNT, payload: n }), [dispatch]);
  const setTeamName = useCallback((i, name) =>
    dispatch({ type: ACTIONS.SET_TEAM_NAME, payload: { index: i, name } }), [dispatch]);

  return {
    startGame,
    handleCardClick,
    useHint,
    goToMenu,
    togglePause,
    setLevel,
    setTeamCount,
    setTeamName,
    totalPairs,
  };
}