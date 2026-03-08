

// ── FÁCIL (10 pares) ────────────────────────────────────────────────────────
const EASY_PAIRS = [
  { id: 1,  type: "person", level: "easy", front: "Adán",         back: "Primer hombre creado por Dios" },
  { id: 2,  type: "person", level: "easy", front: "Noé",          back: "Construyó un arca por mandato de Dios" },
  { id: 3,  type: "person", level: "easy", front: "Abraham",      back: "Padre de la fe" },
  { id: 4,  type: "person", level: "easy", front: "Isaac",        back: "Hijo de la promesa" },
  { id: 5,  type: "person", level: "easy", front: "Jacob",        back: "Luchó con Dios" },
  { id: 6,  type: "person", level: "easy", front: "Moisés",       back: "Liberó al pueblo de Israel de Egipto" },
  { id: 7,  type: "person", level: "easy", front: "David",        back: "Venció al gigante Goliat" },
  { id: 8,  type: "person", level: "easy", front: "Jesús",        back: "Murió en la cruz por nuestros pecados" },
  { id: 9,  type: "person", level: "easy", front: "Pedro",        back: "Negó a Jesús tres veces" },
  { id: 10, type: "person", level: "easy", front: "Pablo",        back: "Apóstol a los gentiles" },
];

// ── MEDIO (15 pares) ────────────────────────────────────────────────────────
const MEDIUM_PAIRS = [
  { id: 11, type: "person", level: "medium", front: "José",             back: "Gobernador de Egipto" },
  { id: 12, type: "person", level: "medium", front: "Josué",            back: "Conquistador de Canaán" },
  { id: 13, type: "person", level: "medium", front: "Booz",             back: "Redentor de Rut" },
  { id: 14, type: "person", level: "medium", front: "Elcana",           back: "Padre de Samuel" },
  { id: 15, type: "person", level: "medium", front: "Salomón",          back: "Rey sabio de Israel" },
  { id: 16, type: "person", level: "medium", front: "Sansón",           back: "Juez de gran fuerza" },
  { id: 17, type: "person", level: "medium", front: "Zacarías",         back: "Padre de Juan el Bautista" },
  { id: 18, type: "person", level: "medium", front: "Juan",             back: "El discípulo amado" },
  { id: 19, type: "person", level: "medium", front: "Esteban",          back: "Primer mártir cristiano" },
  { id: 20, type: "person", level: "medium", front: "Elías",            back: "Fue llevado al cielo en un carro de fuego" },
  { id: 21, type: "person", level: "medium", front: "Daniel",           back: "Fue protegido en el foso de los leones" },
  { id: 22, type: "person", level: "medium", front: "Oseas",            back: "Profeta del amor fiel" },
  { id: 23, type: "couple", level: "medium", front: "Adán y Eva",       back: "Primera pareja humana" },
  { id: 24, type: "couple", level: "medium", front: "Abraham y Sara",   back: "Padres de Isaac" },
  { id: 25, type: "couple", level: "medium", front: "Isaac y Rebeca",   back: "Padres de Esaú y Jacob" },
];

// ── DIFÍCIL (15 pares) ──────────────────────────────────────────────────────
const HARD_PAIRS = [
  { id: 26, type: "couple", level: "hard", front: "Jacob y Lea",               back: "Padres de varios patriarcas" },
  { id: 27, type: "couple", level: "hard", front: "Jacob y Raquel",            back: "Padres de José y Benjamín" },
  { id: 28, type: "couple", level: "hard", front: "Booz y Rut",                back: "Antepasados de David" },
  { id: 29, type: "couple", level: "hard", front: "Elcana y Ana",              back: "Padres del profeta Samuel" },
  { id: 30, type: "couple", level: "hard", front: "David y Mical",             back: "Una de las esposas de David" },
  { id: 31, type: "couple", level: "hard", front: "David y Betsabé",           back: "Padres del rey Salomón" },
  { id: 32, type: "couple", level: "hard", front: "Sansón y Dalila",           back: "Dalila traicionó a Sansón" },
  { id: 33, type: "couple", level: "hard", front: "Oseas y Gomer",             back: "Matrimonio símbolo de redención" },
  { id: 34, type: "couple", level: "hard", front: "Acab y Jezabel",            back: "Reyes malvados de Israel" },
  { id: 35, type: "couple", level: "hard", front: "José y María",              back: "Padres terrenales de Jesús" },
  { id: 36, type: "couple", level: "hard", front: "Zacarías e Isabel",         back: "Padres de Juan el Bautista" },
  { id: 37, type: "couple", level: "hard", front: "Priscila y Aquila",         back: "Matrimonio misionero" },
  { id: 38, type: "couple", level: "hard", front: "Ananías y Safira",          back: "Mintieron al Espíritu Santo" },
  { id: 39, type: "couple", level: "hard", front: "Herodes Antipas y Herodías",back: "Mandaron decapitar a Juan" },
  { id: 40, type: "person", level: "hard", front: "José (padre adoptivo)",     back: "Padre adoptivo de Jesús" },
];

// ── Export agrupado ─────────────────────────────────────────────────────────
export const PAIRS_BY_LEVEL = {
  easy:   EASY_PAIRS,
  medium: MEDIUM_PAIRS,
  hard:   HARD_PAIRS,
};

/** Acceso plano a todos los pares (útil para búsquedas/tests) */
export const ALL_PAIRS = [...EASY_PAIRS, ...MEDIUM_PAIRS, ...HARD_PAIRS];