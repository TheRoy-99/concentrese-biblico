
import { DIFFICULTY_CONFIG, MEDALS } from "../data/gameConfig";

/**
 * Construye el mazo barajado a partir de los pares del nivel.
 * Cada par genera DOS cartas:
 *   card "-a"  → muestra `front` (nombre / pareja)
 *   card "-b"  → muestra `back`  (descripción / rol)
 * Ambas comparten `matchId` para identificar el par.
 *
 * @param {string} level  "easy" | "medium" | "hard"
 * @returns {Card[]}
 */
export function buildDeck(level) {
  const pairs = DIFFICULTY_CONFIG[level].pairs;
  const cards = pairs.flatMap(pair => [
    {
      uniqueId:  `${pair.id}-a`,
      matchId:   pair.id,
      type:      pair.type,
      content:   pair.front,
      side:      "front",
    },
    {
      uniqueId:  `${pair.id}-b`,
      matchId:   pair.id,
      type:      pair.type,
      content:   pair.back,
      side:      "back",
    },
  ]);
  // Fisher-Yates shuffle
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }
  return cards;
}

/**
 * Calcula la medalla según movimientos y nivel.
 * @param {number} moves
 * @param {string} level
 * @returns {{ icon, label, color }}
 */
export function calcMedal(moves, level) {
  const { gold, silver } = DIFFICULTY_CONFIG[level].medalMoves;
  if (moves <= gold)   return MEDALS.gold;
  if (moves <= silver) return MEDALS.silver;
  return MEDALS.bronze;
}

/**
 * Formatea segundos como "MM:SS".
 * @param {number} totalSeconds
 * @returns {string}
 */
export function formatTime(totalSeconds) {
  const m = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
  const s = (totalSeconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

/**
 * Calcula precisión como porcentaje.
 * @param {number} pairsFound
 * @param {number} moves
 * @returns {number}  0–100
 */
export function calcAccuracy(pairsFound, moves) {
  if (moves === 0) return 100;
  return Math.round((pairsFound / moves) * 100);
}

/**
 * Retorna un elemento aleatorio de un array.
 * @template T
 * @param {T[]} arr
 * @returns {T}
 */
export function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Lee el record de mejores movimientos desde localStorage.
 * @param {string} storageKey
 * @returns {Record<string, number>}
 */
export function loadBestMoves(storageKey) {
  try {
    return JSON.parse(localStorage.getItem(storageKey) || "{}");
  } catch {
    return {};
  }
}

/**
 * Guarda el record de mejores movimientos en localStorage.
 * @param {string} storageKey
 * @param {Record<string, number>} best
 */
export function saveBestMoves(storageKey, best) {
  try {
    localStorage.setItem(storageKey, JSON.stringify(best));
  } catch {
    // localStorage puede estar deshabilitado en algunos entornos
  }
}

// ── Persistencia de sesión activa ──────────────────────────────────────────

/**
 * Campos del estado que se persisten en sesión.
 * NO guardamos: hintGlows, mismatched, paused, result
 * (estados transitorios que no tienen sentido al recargar)
 */
const SESSION_FIELDS = [
  "screen", "level", "teamCount", "teamNames",
  "cards", "matched", "moves", "teamScores", "activeTeam",
  "elapsed", "hintsLeft",
];

/**
 * Guarda el estado de juego activo en sessionStorage.
 * Usa sessionStorage (se borra al cerrar la pestaña) en vez de
 * localStorage para no acumular partidas viejas indefinidamente.
 * @param {string} key
 * @param {object} state
 */
export function saveSession(key, state) {
  try {
    const snapshot = {};
    SESSION_FIELDS.forEach(f => { snapshot[f] = state[f]; });
    sessionStorage.setItem(key, JSON.stringify(snapshot));
  } catch { /* sin acceso a storage */ }
}

/**
 * Recupera sesión guardada. Retorna null si no existe o está corrupta.
 * Solo restaura si había una partida en curso (screen === "game").
 * @param {string} key
 * @returns {object|null}
 */
export function loadSession(key) {
  try {
    const raw = sessionStorage.getItem(key);
    if (!raw) return null;
    const data = JSON.parse(raw);
    // Solo restaurar si había partida activa
    if (data.screen !== "game") return null;
    // Validar que el mazo no esté vacío
    if (!Array.isArray(data.cards) || data.cards.length === 0) return null;
    return data;
  } catch {
    return null;
  }
}

/**
 * Borra la sesión guardada (al terminar la partida o volver al menú).
 * @param {string} key
 */
export function clearSession(key) {
  try { sessionStorage.removeItem(key); } catch { /* noop */ }
}