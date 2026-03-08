/**
 * main.jsx — punto de entrada
 * Envuelve App en GameProvider para que todo el árbol
 * tenga acceso al contexto del juego.
 */

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { GameProvider } from "./context/GameContext";
import App from "./App";
import "./styles/global.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <GameProvider>
      <App />
    </GameProvider>
  </StrictMode>
);