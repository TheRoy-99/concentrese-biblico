/**
 * AuthorFooter.jsx
 * Crédito de autor fijo al pie de la pantalla.
 */

import { AUTHOR } from "../data/gameConfig";

export default function AuthorFooter() {
  return (
    <footer className="author" aria-label={`Diseñado por ${AUTHOR}`}>
      Diseñado con fe por <span>{AUTHOR}</span>&nbsp;&nbsp;✦&nbsp;&nbsp;Concéntrese Bíblico
    </footer>
  );
}