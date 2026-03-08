/**
 * AppHeader.jsx
 * Encabezado decorativo — título, subtítulo y ornamento dorado.
 * Componente puramente presentacional, sin estado.
 */

export default function AppHeader() {
  return (
    <header className="header">
      <h1 className="title">Concéntrese Bíblico</h1>
      <p className="subtitle">Memoriza la Palabra de Dios</p>
      <div className="ornament">
        <div className="ornament-line" />
        <span className="ornament-sym" aria-hidden>✦ ✦ ✦</span>
        <div className="ornament-line" />
      </div>
    </header>
  );
}