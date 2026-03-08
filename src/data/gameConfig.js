
import { PAIRS_BY_LEVEL } from "./biblePairs";

// ── Configuración por nivel ─────────────────────────────────────────────────
export const DIFFICULTY_CONFIG = {
  easy: {
    key:          "easy",
    label:        "Fácil",
    icon:         "🕊️",
    pairs:        PAIRS_BY_LEVEL.easy,         // 10 pares
    cols:         5,                           // columnas del tablero
    hintsAllowed: 3,
    // Umbrales de medalla (movimientos)
    medalMoves:   { gold: 12, silver: 17 },
  },
  medium: {
    key:          "medium",
    label:        "Medio",
    icon:         "⚔️",
    pairs:        PAIRS_BY_LEVEL.medium,       // 15 pares
    cols:         6,
    hintsAllowed: 4,
    medalMoves:   { gold: 18, silver: 25 },
  },
  hard: {
    key:          "hard",
    label:        "Difícil",
    icon:         "🔥",
    pairs:        PAIRS_BY_LEVEL.hard,         // 15 pares
    cols:         6,
    hintsAllowed: 5,
    medalMoves:   { gold: 20, silver: 28 },
  },
};

// ── Colores por equipo ──────────────────────────────────────────────────────
export const TEAM_COLORS = [
  { bg: "rgba(26,92,58,.22)",   border: "#2d8a5e", dot: "#2d8a5e", name: "Esmeralda" },
  { bg: "rgba(42,100,150,.22)", border: "#4a90d9", dot: "#4a90d9", name: "Zafiro"    },
  { bg: "rgba(160,50,50,.22)",  border: "#c0392b", dot: "#d65c5c", name: "Rubí"      },
  { bg: "rgba(180,120,30,.22)", border: "#e67e22", dot: "#f39c12", name: "Ámbar"     },
];

// ── Versículos ──────────────────────────────────────────────────────────────
export const VERSES = {
  win: [
    `"Todo lo puedo en Cristo que me fortalece" — Fil. 4:13`,
    `"Mas gracias sean dadas a Dios, que nos da la victoria" — 1 Co. 15:57`,
    `"El que comenzó en vosotros la buena obra, la perfeccionará" — Fil. 1:6`,
  ],
  pause: `"Estad quietos y sabed que yo soy Dios" — Salmos 46:10`,
};

// ── Medallas ────────────────────────────────────────────────────────────────
export const MEDALS = {
  gold:   { icon: "🥇", label: "ORO",    color: "#f5c842" },
  silver: { icon: "🥈", label: "PLATA",  color: "#c0c0c0" },
  bronze: { icon: "🥉", label: "BRONCE", color: "#cd7f32" },
};

// ── Autor ───────────────────────────────────────────────────────────────────
export const AUTHOR = "Roy M.";

// ── localStorage key ────────────────────────────────────────────────────────
export const STORAGE_KEY = "concentrese_best_v1";

// ── Clave para guardar sesión activa ────────────────────────────────────────
export const SESSION_KEY = "concentrese_session_v1";