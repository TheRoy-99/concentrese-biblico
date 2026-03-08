<div align="center">

# ✦ Concéntrese Bíblico ✦

*Memoriza la Palabra de Dios — jugando*

---

![React](https://img.shields.io/badge/React-18-61dafb?style=flat-square&logo=react&logoColor=white&labelColor=20232a)
![Vite](https://img.shields.io/badge/Vite-5-646cff?style=flat-square&logo=vite&logoColor=white&labelColor=1a1a2e)
![Tailwind](https://img.shields.io/badge/Tailwind-CSS-38bdf8?style=flat-square&logo=tailwindcss&logoColor=white&labelColor=0f172a)
![License](https://img.shields.io/badge/Licencia-MIT-c9a84c?style=flat-square&labelColor=1a1005)

<br/>

> *"Todo lo puedo en Cristo que me fortalece"*
> — Filipenses 4:13

<br/>

</div>

---

## 📖 ¿Qué es?

**Concéntrese Bíblico** es un juego de memoria por parejas inspirado en el clásico juego de concentración, diseñado especialmente para comunidades de fe, grupos juveniles e iglesias.

Los jugadores voltean cartas para encontrar parejas que van desde **personajes individuales y su descripción bíblica** hasta **parejas y matrimonios del Antiguo y Nuevo Testamento** — todo con una estética manuscrita dorada sobre fondo oscuro, pensada para proyectarse en pantalla grande.

<br/>

## ✨ Características

| Característica | Descripción |
|---|---|
| 🃏 **45 pares bíblicos** | 3 niveles con personajes únicos por nivel — sin repetición |
| 👥 **Modo multijugador** | 1 a 4 equipos con nombres personalizados y puntaje en vivo |
| 💡 **Sistema de pistas** | Resalta el par correcto por 1 segundo — con límite por nivel |
| 🥇 **Medallas** | Oro / Plata / Bronce según eficiencia de movimientos |
| 🔄 **Persistencia de sesión** | Si se recarga la página, la partida se recupera automáticamente |
| ⊕ **Modo proyección** | Zoom con un clic para proyectores e iglesias |
| ⏱️ **Cronómetro libre** | Sin presión — juega a tu ritmo |
| ♿ **Accesible** | Navegación por teclado y ARIA labels |

<br/>

## 🗂️ Estructura del proyecto

```
src/
├── data/
│   ├── biblePairs.js      ← 45 pares tipados y particionados por nivel
│   ├── gameConfig.js      ← Constantes: niveles, colores, medallas, versículos
│   └── gameUtils.js       ← Funciones puras: barajar, calcular medalla, persistencia
│
├── context/
│   └── GameContext.jsx    ← Estado global (useReducer) + persistencia de sesión
│
├── hooks/
│   ├── useGameEngine.js   ← Lógica: flip, match, pistas, victoria, timer
│   └── useStopwatch.js    ← Cronómetro aislado y reutilizable
│
├── components/
│   ├── Card.jsx           ← Carta individual (presentacional puro)
│   ├── GameBoard.jsx      ← Grilla de cartas
│   ├── HUD.jsx            ← Barra de estado (tiempo, pares, movimientos)
│   ├── TeamsHUD.jsx       ← Strip de puntajes por equipo
│   ├── MenuScreen.jsx     ← Pantalla de inicio
│   ├── GameScreen.jsx     ← Pantalla de juego
│   ├── ResultScreen.jsx   ← Resultados con medalla
│   ├── AppHeader.jsx      ← Encabezado decorativo
│   └── AuthorFooter.jsx   ← Crédito de autor
│
├── styles/
│   ├── global.css         ← Variables, overlay, modal, animaciones base
│   └── card.css           ← Flip 3D, estados matched/shake/hint
│
├── App.jsx                ← Router + modo proyección
└── main.jsx               ← Entry point con <GameProvider>
```

<br/>

## 🎮 Niveles y pares

| Nivel | Pares | Personajes | Pistas | Medalla Oro | Medalla Plata |
|:---:|:---:|---|:---:|:---:|:---:|
| 🕊️ **Fácil** | 10 | Adán, Noé, Abraham, Moisés, David, Jesús... | 3 | ≤ 12 mov. | ≤ 17 mov. |
| ⚔️ **Medio** | 15 | Jacob, José, Daniel, Elías, Rut, Ester... | 4 | ≤ 18 mov. | ≤ 25 mov. |
| 🔥 **Difícil** | 15 | Sansón & Dalila, Acab & Jezabel, Priscila & Aquila... | 5 | ≤ 20 mov. | ≤ 28 mov. |

> Los pares de tipo **couple** (parejas bíblicas) tienen un estilo visual diferente al de personajes individuales — borde dorado más intenso y badge `PAREJA`.

<br/>

## 🚀 Instalación y uso

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/concentrese-biblico.git
cd concentrese-biblico

# Instalar dependencias
npm install

# Iniciar en desarrollo
npm run dev

# Construir para producción
npm run build
```

<br/>

## 🏗️ Patrones de diseño

Este proyecto aplica una arquitectura limpia de React con los siguientes patrones:

### Context + useReducer (Redux-lite)
Todo el estado del juego vive en un único reducer central. Los componentes nunca manejan estado local del juego — solo despachan acciones.

```
GameProvider
  └─ useReducer(gameReducer, initialState)
       ├─ START_GAME / GO_TO_MENU
       ├─ FLIP_CARD / RESOLVE_PAIR / REJECT_PAIR
       ├─ SET_MISMATCH / USE_HINT / CLEAR_HINT
       ├─ TICK / TOGGLE_PAUSE
       └─ GAME_WON / RESTORE_SESSION
```

### Separación presentacional / contenedor
- **Presentacionales** (`Card`, `AppHeader`, `AuthorFooter`): solo reciben props → JSX
- **Contenedores** (`GameBoard`, `HUD`, `TeamsHUD`, etc.): leen contexto y llaman al engine

### Custom hooks
| Hook | Responsabilidad |
|---|---|
| `useGame()` | Acceso al contexto (state + dispatch) |
| `useGameEngine()` | Efectos, lógica de acciones, timer |
| `useStopwatch()` | Solo lectura del tiempo formateado |

### Single Source of Truth
- `biblePairs.js` → todos los datos del juego
- `gameConfig.js` → todas las constantes (colores, medallas, niveles, versículos)
- `gameUtils.js` → funciones puras sin dependencias de React (testeables)

<br/>

## 💾 Persistencia de sesión

Al recargar la página accidentalmente, el juego recupera automáticamente:

- ✅ Posición de todas las cartas en el tablero
- ✅ Pares ya encontrados
- ✅ Puntajes de cada equipo
- ✅ Movimientos y tiempo transcurrido
- ✅ Pistas restantes

La partida se muestra en pausa con un modal de confirmación para que el jugador decida si continuar, iniciar nueva partida o ir al menú.

> Se usa `sessionStorage` (no `localStorage`) para que al *cerrar* el navegador sí se borre la sesión, evitando que queden partidas antiguas guardadas indefinidamente.

<br/>

## ➕ Agregar nuevos pares

Abre `src/data/biblePairs.js` y añade a la sección correspondiente:

```js
{
  id:    46,           // debe ser único en toda la lista
  type:  "person",     // "person" | "couple"
  level: "medium",     // "easy" | "medium" | "hard"
  front: "Nehemías",
  back:  "Reconstruyó los muros de Jerusalén",
}
```

El juego lo tomará automáticamente — no hay que modificar nada más.

<br/>

## 🖥️ Uso para proyección

El botón **⊕ zoom** en el HUD activa el modo proyección: aumenta el tamaño base de fuente al 118%, y como todo el diseño usa unidades relativas (`clamp`, `rem`, `em`), **todo el contenido escala proporcionalmente** — cartas, textos, HUD y puntajes.

Recomendaciones para proyector:
- Resolución mínima recomendada: `1280 × 720`
- Usar navegador en pantalla completa (`F11`)
- Activar zoom antes de proyectar

<br/>

## 🧩 Tecnologías

- **React 18** — UI declarativa con hooks
- **Vite** — bundler ultrarrápido
- **CSS puro** — sin frameworks de UI, diseño propio
- **Cinzel + Crimson Pro** — tipografía manuscrita con personalidad bíblica
- **sessionStorage** — persistencia ligera de sesión

<br/>

---

<div align="center">

## ✦

*Diseñado con fe por **Roy M.***

*Que este juego sea una herramienta para conocer y amar la Palabra de Dios.*

<br/>

</div>
