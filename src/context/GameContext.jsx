import { createContext, useContext, useReducer, useEffect } from "react";
import { DIFFICULTY_CONFIG, STORAGE_KEY, SESSION_KEY } from "../data/gameConfig";
import {
  buildDeck, loadBestMoves, saveBestMoves,
  saveSession, loadSession, clearSession,
} from "../data/gameUtils";

// ── Action types ──────────────────────────────────────────────────────────────
export const ACTIONS = {
  GO_TO_MENU:     "GO_TO_MENU",
  START_GAME:     "START_GAME",
  SET_LEVEL:      "SET_LEVEL",
  SET_TEAM_COUNT: "SET_TEAM_COUNT",
  SET_TEAM_NAME:  "SET_TEAM_NAME",
  FLIP_CARD:      "FLIP_CARD",
  RESOLVE_PAIR:   "RESOLVE_PAIR",
  SET_MISMATCH:   "SET_MISMATCH",
  REJECT_PAIR:    "REJECT_PAIR",
  USE_HINT:       "USE_HINT",
  CLEAR_HINT:     "CLEAR_HINT",
  TICK:           "TICK",
  TOGGLE_PAUSE:   "TOGGLE_PAUSE",
  GAME_WON:       "GAME_WON",
  RESTORE_SESSION:"RESTORE_SESSION",
};

// ── Estado base (sin sesión) ──────────────────────────────────────────────────
const BASE_STATE = {
  screen:     "menu",
  level:      "medium",
  teamCount:  1,
  teamNames:  ["Equipo 1", "Equipo 2", "Equipo 3", "Equipo 4"],
  cards:      [],
  flipped:    [],
  matched:    [],
  mismatched: [],
  moves:      0,
  teamScores: [0, 0, 0, 0],
  activeTeam: 0,
  elapsed:    0,
  paused:     false,
  hintsLeft:  0,
  hintGlows:  [],
  bestMoves:  loadBestMoves(STORAGE_KEY),
  result:     null,
};

// Intenta recuperar sesión al iniciar
function buildInitialState() {
  const session = loadSession(SESSION_KEY);
  if (!session) return BASE_STATE;
  return {
    ...BASE_STATE,
    ...session,
    // Estos siempre se resetean al recargar
    flipped:    [],
    mismatched: [],
    hintGlows:  [],
    paused:     true,   // ← auto-pausado para que el jugador vea que se restauró
    result:     null,
  };
}

// ── Reducer ───────────────────────────────────────────────────────────────────
function gameReducer(state, action) {
  switch (action.type) {

    case ACTIONS.GO_TO_MENU:
      clearSession(SESSION_KEY);
      return { ...state, screen: "menu", paused: false };

    case ACTIONS.SET_LEVEL:
      return { ...state, level: action.payload };

    case ACTIONS.SET_TEAM_COUNT:
      return { ...state, teamCount: action.payload };

    case ACTIONS.SET_TEAM_NAME: {
      const names = [...state.teamNames];
      names[action.payload.index] = action.payload.name;
      return { ...state, teamNames: names };
    }

    case ACTIONS.START_GAME: {
      const { level } = state;
      clearSession(SESSION_KEY);
      return {
        ...state,
        screen:     "game",
        cards:      buildDeck(level),
        flipped:    [],
        matched:    [],
        mismatched: [],
        moves:      0,
        teamScores: [0, 0, 0, 0],
        activeTeam: 0,
        elapsed:    0,
        paused:     false,
        hintsLeft:  DIFFICULTY_CONFIG[level].hintsAllowed,
        hintGlows:  [],
        result:     null,
      };
    }

    case ACTIONS.RESTORE_SESSION:
      // Acción interna — solo para forzar re-render tras montar
      return { ...state };

    case ACTIONS.FLIP_CARD: {
      const { uniqueId } = action.payload;
      if (state.flipped.length >= 2)        return state;
      if (state.flipped.includes(uniqueId)) return state;
      if (state.mismatched.length > 0)      return state;
      return { ...state, flipped: [...state.flipped, uniqueId], hintGlows: [] };
    }

    case ACTIONS.RESOLVE_PAIR: {
      const { matchId } = action.payload;
      const scores = [...state.teamScores];
      scores[state.activeTeam] += 1;
      return {
        ...state,
        flipped:    [],
        mismatched: [],
        matched:    [...state.matched, matchId],
        moves:      state.moves + 1,
        teamScores: scores,
      };
    }

    case ACTIONS.SET_MISMATCH:
      return { ...state, mismatched: action.payload.ids, moves: state.moves + 1 };

    case ACTIONS.REJECT_PAIR: {
      const nextTeam = state.teamCount > 1
        ? (state.activeTeam + 1) % state.teamCount : 0;
      return { ...state, flipped: [], mismatched: [], activeTeam: nextTeam };
    }

    case ACTIONS.USE_HINT:
      if (state.hintsLeft <= 0) return state;
      return { ...state, hintsLeft: state.hintsLeft - 1, hintGlows: action.payload.glowIds };

    case ACTIONS.CLEAR_HINT:
      return { ...state, hintGlows: [] };

    case ACTIONS.TICK:
      if (state.paused) return state;
      return { ...state, elapsed: state.elapsed + 1 };

    case ACTIONS.TOGGLE_PAUSE:
      return { ...state, paused: !state.paused };

    case ACTIONS.GAME_WON: {
      const { moves, elapsed, level, hintsLeft } = state;
      const hintsUsed = DIFFICULTY_CONFIG[level].hintsAllowed - hintsLeft;
      const prev      = state.bestMoves[level];
      let bestMoves   = state.bestMoves;
      if (!prev || moves < prev) {
        bestMoves = { ...state.bestMoves, [level]: moves };
        saveBestMoves(STORAGE_KEY, bestMoves);
      }
      clearSession(SESSION_KEY);
      return {
        ...state, screen: "result", bestMoves,
        result: {
          moves, elapsed, hintsUsed,
          teamScores: [...state.teamScores],
          totalPairs: DIFFICULTY_CONFIG[level].pairs.length,
        },
      };
    }

    default:
      return state;
  }
}

// ── Acciones que disparan guardado de sesión ──────────────────────────────────
const PERSIST_ACTIONS = new Set([
  ACTIONS.FLIP_CARD, ACTIONS.RESOLVE_PAIR, ACTIONS.REJECT_PAIR,
  ACTIONS.SET_MISMATCH, ACTIONS.USE_HINT, ACTIONS.TICK,
  ACTIONS.START_GAME, ACTIONS.TOGGLE_PAUSE,
]);

// ── Context ───────────────────────────────────────────────────────────────────
const GameContext = createContext(null);

export function GameProvider({ children }) {
  const [state, rawDispatch] = useReducer(gameReducer, undefined, buildInitialState);

  // Wrapper: guarda sesión automáticamente tras cada acción relevante
  function dispatch(action) {
    rawDispatch(action);
    // El guardado ocurre en el efecto de abajo (después del re-render)
  }

  // Guardar sesión tras cada cambio de estado de juego
  useEffect(() => {
    if (state.screen === "game") {
      saveSession(SESSION_KEY, state);
    }
  });  // sin deps → corre tras cada render (barato, ~1ms)

  // Banner de sesión restaurada: auto-pausar con mensaje ya lo hace el reducer
  const sessionRestored = state.screen === "game" && state.paused
    && state.elapsed > 0 && state.matched.length > 0;

  return (
    <GameContext.Provider value={{ state, dispatch, sessionRestored }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame debe usarse dentro de <GameProvider>");
  return ctx;
}