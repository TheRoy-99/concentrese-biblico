/**
 * App.jsx
 * - useGameEngine() montado UNA sola vez.
 * - Modo proyección (zoom) activable con botón ⛶ en el HUD.
 *   Pasa `zoomMode` como clase al .app para que todo escale.
 */

import { useState } from "react";
import { useGame } from "./context/GameContext";
import { useGameEngine } from "./hooks/useGameEngine";

import AppHeader    from "./components/AppHeader";
import MenuScreen   from "./components/MenuScreen";
import GameScreen   from "./components/GameScreen";
import ResultScreen from "./components/ResultScreen";
import AuthorFooter from "./components/AuthorFooter";

import "./styles/global.css";

/* Exportamos el contexto de zoom para que HUD lo use */
export let setGlobalZoom = () => {};

const LAYOUT_CSS = `
  /* ─────────────────────── BOARD ─────────────────────── */
  .board { display:grid; gap:.55rem; width:100%; max-width:1060px; }
  .card-wrapper { min-width:0; min-height:0; }

  /* ─────────────────────── HUD ────────────────────────── */
  .hud {
    display:flex; align-items:center; justify-content:space-between;
    width:100%; max-width:1060px; margin-bottom:.85rem; gap:.5rem; flex-wrap:wrap;
  }
  .hud-card {
    background:rgba(201,168,76,.12); border:1.5px solid rgba(201,168,76,.55);
    border-radius:10px; padding:.5rem 1rem;
    display:flex; flex-direction:column; align-items:center;
    min-width:80px; flex:1; max-width:130px;
    box-shadow:0 2px 12px rgba(0,0,0,.4);
  }
  .hud-label {
    font-family:'Cinzel',serif; font-size:clamp(.42rem,.8vw,.55rem);
    letter-spacing:.2em; color:#c9a84c; text-transform:uppercase; margin-bottom:.12rem;
  }
  .hud-value {
    font-family:'Cinzel',serif; font-size:clamp(1rem,1.8vw,1.35rem); font-weight:700;
    color:#f5e6b8; font-variant-numeric:tabular-nums;
    text-shadow:0 0 8px rgba(245,230,184,.3);
  }
  .ctrl-row { display:flex; gap:.4rem; align-items:center; }
  .icon-btn {
    background:rgba(201,168,76,.12); border:1.5px solid rgba(201,168,76,.55);
    border-radius:9px; padding:.45rem .8rem; cursor:pointer; color:#e8c97e;
    transition:all .2s; font-family:'Cinzel',serif;
    font-size:clamp(.6rem,1.1vw,.78rem); letter-spacing:.08em;
    box-shadow:0 2px 8px rgba(0,0,0,.4);
  }
  .icon-btn:hover {
    background:rgba(201,168,76,.25); border-color:#e8c97e;
    transform:translateY(-2px); box-shadow:0 4px 14px rgba(0,0,0,.5);
  }
  .icon-btn:disabled { opacity:.3; cursor:default; transform:none; }
  .hint-btn { border-color:rgba(91,163,208,.7); color:#7ec8e8; }
  .hint-btn:hover { background:rgba(42,100,150,.25); border-color:#7ec8e8; }
  .zoom-btn { border-color:rgba(201,168,76,.6); }
  .zoom-btn.on { background:rgba(201,168,76,.28); border-color:#e8c97e; color:#fff8e7; }

  /* ─────────────────────── ZOOM MODE ─────────────────── */
  /* Cuando .zoom-mode está en .app, todo escala vía CSS variables */
  .zoom-mode .hud-label  { font-size:clamp(.55rem,1.1vw,.75rem); }
  .zoom-mode .hud-value  { font-size:clamp(1.3rem,2.2vw,1.8rem); }
  .zoom-mode .icon-btn   { font-size:clamp(.72rem,1.3vw,.95rem); padding:.55rem 1rem; }
  .zoom-mode .team-pill  { font-size:clamp(.82rem,1.4vw,1rem); padding:.4rem 1.2rem; }
  .zoom-mode .board      { gap:.7rem; }

  /* ─────────────────────── TEAMS ─────────────────────── */
  .teams-hud {
    display:flex; gap:.5rem; flex-wrap:wrap; justify-content:center;
    width:100%; max-width:1060px; margin-bottom:.85rem;
  }
  .team-pill {
    display:flex; align-items:center; gap:.5rem; border-radius:99px;
    padding:.35rem 1rem; border:2px solid transparent;
    font-family:'Cinzel',serif; font-size:clamp(.65rem,1.1vw,.78rem);
    letter-spacing:.07em; transition:all .3s; flex:1; min-width:110px;
    justify-content:center; max-width:200px; background:rgba(255,255,255,.04);
  }
  .team-pill.active {
    box-shadow:0 0 18px rgba(201,168,76,.4); transform:scale(1.05);
    background:rgba(201,168,76,.1);
  }
  .team-pill .tp-score { font-size:clamp(.9rem,1.5vw,1.1rem); font-weight:700; margin-left:.25rem; }
  .team-dot { width:10px; height:10px; border-radius:50%; flex-shrink:0; }

  /* ─────────────────────── MODAL ─────────────────────── */
  .modal-emoji { font-size:clamp(2.2rem,4vw,3.2rem); display:block; margin-bottom:.7rem; }
  .modal-title {
    font-family:'Cinzel',serif; font-size:clamp(1.3rem,2.5vw,1.8rem); font-weight:900;
    background:linear-gradient(130deg,#c9a84c,#f5e6b8);
    -webkit-background-clip:text; -webkit-text-fill-color:transparent;
    background-clip:text; margin-bottom:.4rem;
  }
  .modal-verse {
    font-style:italic; color:rgba(232,201,126,.85);
    font-size:clamp(.82rem,1.4vw,1rem); margin-bottom:1.3rem; line-height:1.55;
  }
  .medal-wrap { margin-bottom:.9rem; }
  .medal-icon { font-size:clamp(2.5rem,5vw,3.6rem); display:block; animation:medalDrop .5s .15s cubic-bezier(.34,1.56,.64,1) both; }
  @keyframes medalDrop { from{opacity:0;transform:translateY(-18px) scale(.6)} to{opacity:1;transform:translateY(0) scale(1)} }
  .medal-label { font-family:'Cinzel',serif; font-size:clamp(.8rem,1.4vw,1rem); letter-spacing:.24em; margin-top:.2rem; }
  .stats-grid { display:grid; grid-template-columns:1fr 1fr; gap:.65rem; margin-bottom:1.1rem; }
  .stat-box { background:rgba(201,168,76,.1); border:1.5px solid rgba(201,168,76,.45); border-radius:9px; padding:.65rem; }
  .stat-lbl { font-family:'Cinzel',serif; font-size:clamp(.44rem,.8vw,.55rem); letter-spacing:.2em; color:#c9a84c; }
  .stat-val { font-family:'Cinzel',serif; font-size:clamp(1.1rem,1.8vw,1.4rem); color:#f5e6b8; font-weight:700; }
  .team-result {
    display:flex; align-items:center; justify-content:space-between;
    border-radius:9px; padding:.55rem .9rem; margin-bottom:.45rem;
    border:1.5px solid rgba(201,168,76,.25); background:rgba(255,255,255,.03);
  }
  .team-result.winner { border-color:#c9a84c; background:rgba(201,168,76,.12); box-shadow:0 0 12px rgba(201,168,76,.2); }
  .tr-name  { font-family:'Cinzel',serif; font-size:clamp(.75rem,1.3vw,.88rem); letter-spacing:.07em; color:#f5f0e8; }
  .tr-score { font-family:'Cinzel',serif; font-size:clamp(.95rem,1.5vw,1.1rem); font-weight:700; }

  /* ─────────────────────── MENU ──────────────────────── */
  .menu-screen { max-width:520px; width:100%; animation:fadeUp .55s ease both; }
  .teams-box { background:rgba(201,168,76,.07); border:1.5px solid rgba(201,168,76,.4); border-radius:12px; padding:1.2rem; margin-bottom:1.2rem; }
  .mode-strip { display:flex; gap:.5rem; margin-bottom:.9rem; justify-content:center; flex-wrap:wrap; }
  .mode-btn {
    background:none; border:1.5px solid rgba(201,168,76,.4); border-radius:7px;
    padding:.38rem .95rem; color:rgba(232,201,126,.75); cursor:pointer;
    font-family:'Cinzel',serif; font-size:clamp(.6rem,1vw,.72rem); letter-spacing:.1em; transition:all .2s;
  }
  .mode-btn:hover,.mode-btn.sel { border-color:#e8c97e; color:#f5e6b8; background:rgba(201,168,76,.15); }
  .team-row { display:flex; align-items:center; gap:.6rem; margin-bottom:.55rem; }
  .team-row:last-child { margin-bottom:0; }
  .team-input {
    flex:1; background:rgba(255,255,255,.06); border:1.5px solid rgba(201,168,76,.4);
    border-radius:7px; padding:.44rem .75rem; color:#f5f0e8;
    font-family:'Crimson Pro',serif; font-size:clamp(.85rem,1.4vw,.95rem);
    outline:none; transition:border-color .2s;
  }
  .team-input::placeholder { color:rgba(201,168,76,.45); }
  .team-input:focus { border-color:#e8c97e; background:rgba(255,255,255,.09); }
  .diff-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:.7rem; margin-bottom:1.1rem; }
  .diff-btn {
    background:rgba(201,168,76,.06); border:1.5px solid rgba(201,168,76,.4);
    border-radius:10px; padding:.9rem .4rem; cursor:pointer; color:#e8c97e;
    font-family:'Cinzel',serif; font-size:clamp(.72rem,1.1vw,.85rem);
    letter-spacing:.07em; transition:all .25s;
    display:flex; flex-direction:column; align-items:center; gap:.3rem;
    position:relative; overflow:hidden;
  }
  .diff-btn::before { content:''; position:absolute; inset:0; background:linear-gradient(135deg,rgba(201,168,76,.12),transparent); opacity:0; transition:opacity .25s; }
  .diff-btn:hover::before,.diff-btn.active::before { opacity:1; }
  .diff-btn:hover,.diff-btn.active { border-color:#e8c97e; color:#f5e6b8; transform:translateY(-2px); box-shadow:0 6px 20px rgba(0,0,0,.5); }
  .diff-icon { font-size:clamp(1.2rem,2vw,1.6rem); }
  .diff-sub { font-size:clamp(.55rem,.9vw,.65rem); opacity:.7; font-family:'Crimson Pro',serif; font-style:italic; letter-spacing:0; }
  .start-btn {
    width:100%; background:linear-gradient(130deg,#8a6a18,#d4a83c,#f0d080,#d4a83c,#8a6a18);
    background-size:300% 100%; border:none; border-radius:11px;
    padding:1.05rem 2rem; font-family:'Cinzel',serif;
    font-size:clamp(.88rem,1.5vw,1.05rem); font-weight:700;
    letter-spacing:.18em; color:#0d0800; cursor:pointer; transition:all .3s;
    animation:shimmer 5s ease infinite;
    box-shadow:0 4px 20px rgba(0,0,0,.5), 0 0 16px rgba(201,168,76,.25);
  }
  .start-btn:hover { transform:translateY(-2px); box-shadow:0 8px 28px rgba(0,0,0,.6), 0 0 24px rgba(201,168,76,.4); }

  /* ─────────────────────── SHARED ────────────────────── */
  .badge {
    display:block; text-align:center;
    background:rgba(201,168,76,.12); border:1.5px solid rgba(201,168,76,.5);
    border-radius:99px; padding:.22rem .9rem;
    font-family:'Cinzel',serif; font-size:clamp(.52rem,.9vw,.62rem);
    letter-spacing:.16em; color:#e8c97e; margin-bottom:.9rem;
  }
  .btn-group { display:flex; gap:.7rem; justify-content:center; flex-wrap:wrap; }
  .btn {
    font-family:'Cinzel',serif; font-size:clamp(.68rem,1.1vw,.8rem);
    letter-spacing:.12em; border-radius:9px; padding:.75rem 1.4rem;
    cursor:pointer; border:none; transition:all .25s; font-weight:700;
  }
  .btn:hover { transform:translateY(-2px); filter:brightness(1.12); }
  .btn-primary { background:linear-gradient(130deg,#8a6a18,#d4a83c); color:#0d0800; box-shadow:0 4px 14px rgba(0,0,0,.4); }
  .btn-secondary { background:rgba(201,168,76,.1); border:1.5px solid rgba(201,168,76,.5); color:#e8c97e; box-shadow:0 4px 14px rgba(0,0,0,.3); }
  .section-label {
    font-family:'Cinzel',serif; font-size:clamp(.58rem,.95vw,.7rem);
    letter-spacing:.3em; color:#c9a84c; text-transform:uppercase;
    margin-bottom:.85rem; text-align:center;
  }

  /* ─────────────────────── AUTHOR ────────────────────── */
  .author {
    position:fixed; bottom:0; left:0; right:0; text-align:center; padding:.55rem 1rem;
    background:linear-gradient(0deg,rgba(10,7,0,.98),rgba(10,7,0,.7),transparent);
    font-style:italic; font-size:clamp(.68rem,1vw,.78rem); color:rgba(201,168,76,.55);
    letter-spacing:.14em; pointer-events:none; z-index:10;
  }
  .author span { color:#c9a84c; font-weight:600; }

  /* ─────────────────────── HEADER ────────────────────── */
  .header { text-align:center; margin-bottom:1.2rem; }
  .header::before {
    content:'✦'; display:block; color:#e8c97e; font-size:clamp(1.1rem,2vw,1.5rem);
    margin-bottom:.4rem; opacity:.9; animation:glow 3s ease-in-out infinite;
    text-shadow:0 0 10px rgba(232,201,126,.6);
  }
  .title {
    font-family:'Cinzel',serif;
    font-size:clamp(1.6rem,4vw,3.2rem);
    font-weight:900; letter-spacing:.07em; line-height:1.05;
    background:linear-gradient(130deg,#b8891a 0%,#e8c97e 40%,#fff8e7 60%,#c9a84c 100%);
    -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
    filter:drop-shadow(0 2px 4px rgba(0,0,0,.5));
  }
  .subtitle {
    font-style:italic; color:rgba(232,201,126,.8);
    font-size:clamp(.78rem,1.2vw,1rem); margin-top:.22rem; letter-spacing:.2em;
  }
  .ornament { display:flex; align-items:center; gap:1rem; margin:.6rem auto 0; width:fit-content; }
  .ornament-line { width:clamp(45px,6vw,80px); height:1px; background:linear-gradient(90deg,transparent,#c9a84c,transparent); }
  .ornament-sym { color:#e8c97e; font-size:clamp(.7rem,1.2vw,.9rem); opacity:.9; }

  @media(max-width:640px){
    .modal { padding:1.8rem 1.3rem; }
    .hud-card { min-width:65px; }
    .board { gap:.35rem; }
  }
  @media(min-width:1400px){
    .board { max-width:1200px; }
    .hud, .teams-hud { max-width:1200px; }
  }
`;

export default function App() {
  const { state }  = useGame();
  const { screen } = state;
  const [zoom, setZoom] = useState(false);

  // Exponer setter para que HUD pueda usarlo
  setGlobalZoom = setZoom;

  useGameEngine();

  return (
    <>
      <style>{LAYOUT_CSS}</style>
      <div className={`app${zoom ? " zoom-mode" : ""}`}>
        <AppHeader />
        {screen === "menu"   && <MenuScreen />}
        {screen === "game"   && <GameScreen zoom={zoom} setZoom={setZoom} />}
        {screen === "result" && <ResultScreen />}
      </div>
      <AuthorFooter />
    </>
  );
}