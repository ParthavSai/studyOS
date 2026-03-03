import { useState, useEffect, useRef, useCallback } from "react";

// ============================================================
// GLOBAL STYLES (injected into <head>)
// ============================================================
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --bg: #f0f4ff;
      --surface: rgba(255,255,255,0.72);
      --surface-hover: rgba(255,255,255,0.9);
      --border: rgba(99,102,241,0.12);
      --border-strong: rgba(99,102,241,0.25);
      --text: #1e1b4b;
      --text-2: #4c4980;
      --text-3: #8b89b0;
      --accent: #6366f1;
      --accent-2: #8b5cf6;
      --accent-3: #ec4899;
      --accent-glow: rgba(99,102,241,0.25);
      --green: #10b981;
      --yellow: #f59e0b;
      --red: #ef4444;
      --orange: #f97316;
      --shadow: 0 4px 24px rgba(99,102,241,0.10);
      --shadow-lg: 0 12px 48px rgba(99,102,241,0.18);
      --radius: 20px;
      --radius-sm: 12px;
      --sidebar-w: 240px;
    }

    .dark {
      --bg: #080c1a;
      --surface: rgba(15,20,45,0.8);
      --surface-hover: rgba(20,28,60,0.95);
      --border: rgba(99,102,241,0.18);
      --border-strong: rgba(99,102,241,0.35);
      --text: #e8e6ff;
      --text-2: #9d9bc8;
      --text-3: #5a587a;
      --accent-glow: rgba(99,102,241,0.35);
      --shadow: 0 4px 24px rgba(0,0,0,0.4);
      --shadow-lg: 0 12px 48px rgba(0,0,0,0.6);
    }

    html, body, #root { height: 100%; width: 100%; }

    body {
      font-family: 'DM Sans', sans-serif;
      background: var(--bg);
      color: var(--text);
      transition: background 0.4s, color 0.4s;
      overflow: hidden;
    }

    /* Animated mesh background */
    body::before {
      content: '';
      position: fixed;
      inset: 0;
      background: 
        radial-gradient(ellipse 80% 60% at 20% -10%, rgba(99,102,241,0.12) 0%, transparent 60%),
        radial-gradient(ellipse 60% 50% at 80% 110%, rgba(139,92,246,0.10) 0%, transparent 60%),
        radial-gradient(ellipse 50% 40% at 50% 50%, rgba(236,72,153,0.05) 0%, transparent 70%);
      pointer-events: none;
      z-index: 0;
    }

    .dark body::before {
      background: 
        radial-gradient(ellipse 80% 60% at 20% -10%, rgba(99,102,241,0.2) 0%, transparent 60%),
        radial-gradient(ellipse 60% 50% at 80% 110%, rgba(139,92,246,0.15) 0%, transparent 60%),
        radial-gradient(ellipse 50% 40% at 50% 50%, rgba(236,72,153,0.08) 0%, transparent 70%);
    }

    /* Scrollbar */
    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: var(--border-strong); border-radius: 4px; }

    /* Glass card */
    .glass {
      background: var(--surface);
      backdrop-filter: blur(20px) saturate(1.8);
      -webkit-backdrop-filter: blur(20px) saturate(1.8);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      box-shadow: var(--shadow);
      transition: all 0.3s cubic-bezier(0.4,0,0.2,1);
    }
    .glass:hover { box-shadow: var(--shadow-lg); }

    /* Typography */
    h1,h2,h3,h4,h5 { font-family: 'Syne', sans-serif; }

    /* Button base */
    .btn {
      display: inline-flex; align-items: center; gap: 6px;
      padding: 8px 16px; border-radius: 12px; font-size: 13px;
      font-weight: 500; cursor: pointer; border: none; outline: none;
      transition: all 0.2s cubic-bezier(0.4,0,0.2,1);
      font-family: 'DM Sans', sans-serif;
    }
    .btn:active { transform: scale(0.97); }
    .btn-primary {
      background: linear-gradient(135deg, var(--accent), var(--accent-2));
      color: white;
      box-shadow: 0 4px 15px var(--accent-glow);
    }
    .btn-primary:hover { box-shadow: 0 6px 25px var(--accent-glow); transform: translateY(-1px); }
    .btn-ghost {
      background: transparent;
      color: var(--text-2);
      border: 1px solid var(--border);
    }
    .btn-ghost:hover { background: var(--surface); color: var(--text); border-color: var(--border-strong); }
    .btn-danger { background: rgba(239,68,68,0.1); color: var(--red); border: 1px solid rgba(239,68,68,0.2); }
    .btn-danger:hover { background: rgba(239,68,68,0.2); }

    /* Input */
    .input {
      width: 100%; padding: 10px 14px; border-radius: 12px;
      border: 1px solid var(--border); background: var(--surface);
      color: var(--text); font-size: 14px; font-family: 'DM Sans', sans-serif;
      outline: none; transition: all 0.2s;
      backdrop-filter: blur(10px);
    }
    .input:focus { border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-glow); }
    .input::placeholder { color: var(--text-3); }

    /* Select */
    select.input { cursor: pointer; }
    select.input option { background: var(--bg); color: var(--text); }

    /* Animations */
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes slideIn { from { opacity: 0; transform: translateX(-20px); } to { opacity: 1; transform: translateX(0); } }
    @keyframes scaleIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
    @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.5; } }
    @keyframes spin { to { transform: rotate(360deg); } }
    @keyframes glow { 0%,100% { box-shadow: 0 0 20px var(--accent-glow); } 50% { box-shadow: 0 0 40px var(--accent-glow), 0 0 80px rgba(99,102,241,0.15); } }
    @keyframes progressFill { from { width: 0; } to { width: var(--target-w); } }
    @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
    @keyframes ring-fill { from { stroke-dashoffset: 283; } to { stroke-dashoffset: var(--dash); } }

    .animate-fadein { animation: fadeIn 0.4s ease forwards; }
    .animate-slidein { animation: slideIn 0.4s ease forwards; }
    .animate-scalein { animation: scaleIn 0.3s ease forwards; }
    .animate-float { animation: float 3s ease-in-out infinite; }
    .animate-glow { animation: glow 2s ease-in-out infinite; }
    .animate-pulse-slow { animation: pulse 2s ease-in-out infinite; }

    /* Sidebar */
    .sidebar {
      width: var(--sidebar-w);
      height: 100vh;
      position: fixed;
      left: 0; top: 0;
      padding: 24px 16px;
      display: flex;
      flex-direction: column;
      gap: 4px;
      z-index: 100;
      border-right: 1px solid var(--border);
      background: var(--surface);
      backdrop-filter: blur(30px);
    }

    .nav-item {
      display: flex; align-items: center; gap: 10px;
      padding: 10px 14px; border-radius: 14px;
      cursor: pointer; font-size: 13.5px; font-weight: 500;
      color: var(--text-2); transition: all 0.2s;
      border: 1px solid transparent;
      white-space: nowrap;
    }
    .nav-item:hover { background: var(--surface-hover); color: var(--text); border-color: var(--border); }
    .nav-item.active {
      background: linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.1));
      color: var(--accent);
      border-color: var(--border-strong);
      box-shadow: 0 2px 12px var(--accent-glow);
    }

    /* Main content */
    .main-content {
      margin-left: var(--sidebar-w);
      height: 100vh;
      overflow-y: auto;
      padding: 28px;
      position: relative;
      z-index: 1;
    }

    /* Tag pill */
    .tag {
      display: inline-flex; align-items: center; gap: 4px;
      padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 600;
      letter-spacing: 0.02em; text-transform: uppercase;
    }

    /* Priority badges */
    .pri-high { background: rgba(239,68,68,0.12); color: var(--red); }
    .pri-medium { background: rgba(245,158,11,0.12); color: var(--yellow); }
    .pri-low { background: rgba(16,185,129,0.12); color: var(--green); }

    /* Progress bar */
    .prog-bar {
      height: 6px; border-radius: 99px;
      background: var(--border);
      overflow: hidden;
    }
    .prog-fill {
      height: 100%; border-radius: 99px;
      background: linear-gradient(90deg, var(--accent), var(--accent-2));
      transition: width 0.6s cubic-bezier(0.4,0,0.2,1);
    }

    /* Checkbox */
    .checkbox {
      width: 18px; height: 18px; border-radius: 6px;
      border: 2px solid var(--border-strong);
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; transition: all 0.2s; flex-shrink: 0;
    }
    .checkbox.checked {
      background: linear-gradient(135deg, var(--accent), var(--accent-2));
      border-color: transparent;
    }

    /* Modal overlay */
    .modal-overlay {
      position: fixed; inset: 0; z-index: 1000;
      background: rgba(0,0,0,0.5);
      backdrop-filter: blur(4px);
      display: flex; align-items: center; justify-content: center;
      padding: 20px;
      animation: fadeIn 0.2s ease;
    }
    .modal {
      width: 100%; max-width: 480px;
      background: var(--bg);
      border: 1px solid var(--border-strong);
      border-radius: 24px;
      padding: 28px;
      animation: scaleIn 0.3s ease;
      box-shadow: var(--shadow-lg);
    }

    /* Habit grid */
    .habit-cell {
      width: 26px; height: 26px; border-radius: 6px;
      border: 1px solid var(--border);
      cursor: pointer; transition: all 0.15s;
    }
    .habit-cell.done {
      background: linear-gradient(135deg, var(--accent), var(--accent-2));
      border-color: transparent;
      box-shadow: 0 2px 8px var(--accent-glow);
    }
    .habit-cell:hover:not(.done) { border-color: var(--accent); background: var(--accent-glow); }

    /* Pomodoro ring */
    .timer-ring { transform: rotate(-90deg); }
    .timer-ring-circle {
      fill: none;
      stroke-width: 8;
      stroke-linecap: round;
      transition: stroke-dashoffset 1s linear;
    }

    /* Markdown preview */
    .md-preview h1 { font-size: 1.5em; margin: 0.5em 0; font-family: 'Syne', sans-serif; }
    .md-preview h2 { font-size: 1.25em; margin: 0.5em 0; font-family: 'Syne', sans-serif; }
    .md-preview h3 { font-size: 1.1em; margin: 0.4em 0; }
    .md-preview p { margin: 0.4em 0; line-height: 1.6; }
    .md-preview ul, .md-preview ol { margin: 0.4em 0 0.4em 1.5em; }
    .md-preview li { margin: 0.2em 0; }
    .md-preview code { background: var(--border); padding: 2px 6px; border-radius: 4px; font-size: 0.9em; }
    .md-preview pre { background: var(--border); padding: 12px; border-radius: 8px; overflow-x: auto; }
    .md-preview blockquote { border-left: 3px solid var(--accent); padding-left: 12px; color: var(--text-2); margin: 0.4em 0; }
    .md-preview strong { font-weight: 600; }
    .md-preview em { font-style: italic; }
    .md-preview hr { border: none; border-top: 1px solid var(--border); margin: 1em 0; }
    .md-preview a { color: var(--accent); text-decoration: underline; }

    /* Calendar */
    .cal-day {
      aspect-ratio: 1; border-radius: 10px; border: 1px solid transparent;
      display: flex; flex-direction: column; align-items: center; justify-content: flex-start;
      padding: 4px; cursor: pointer; transition: all 0.15s; font-size: 12px;
      overflow: hidden;
    }
    .cal-day:hover { border-color: var(--accent); background: rgba(99,102,241,0.05); }
    .cal-day.today { background: linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.1)); border-color: var(--accent); }
    .cal-day.other-month { opacity: 0.35; }
    .cal-dot { width: 5px; height: 5px; border-radius: 50%; flex-shrink: 0; }

    /* Scrollable panel */
    .scroll-panel { overflow-y: auto; }
    .scroll-panel::-webkit-scrollbar { width: 3px; }

    /* Stats card */
    .stat-card { position: relative; overflow: hidden; }
    .stat-card::after {
      content: '';
      position: absolute; bottom: -20px; right: -20px;
      width: 80px; height: 80px; border-radius: 50%;
      background: radial-gradient(circle, var(--accent-glow) 0%, transparent 70%);
    }

    /* Countdown urgency */
    .urgent-high { color: var(--red); }
    .urgent-medium { color: var(--yellow); }
    .urgent-low { color: var(--green); }

    /* Mobile responsive */
    @media (max-width: 768px) {
      :root { --sidebar-w: 0px; }

      .sidebar {
        transform: translateX(-100%);
        transition: transform 0.35s cubic-bezier(0.4,0,0.2,1);
        z-index: 300;
        width: 260px !important;
        box-shadow: 4px 0 40px rgba(0,0,0,0.25);
      }
      .sidebar.open { transform: translateX(0); }

      .main-content {
        margin-left: 0 !important;
        padding: 72px 16px 90px !important;
      }

      .mobile-menu-btn { display: flex !important; }

      /* Stack dashboard grid to single column */
      .dash-grid { grid-template-columns: 1fr !important; }

      /* Stack notes layout vertically */
      .notes-layout { grid-template-columns: 1fr !important; height: auto !important; }

      /* Section header wraps on small screens */
      .section-header { flex-wrap: wrap; gap: 8px; }

      /* Make modals full-width on small screens */
      .modal { padding: 20px !important; border-radius: 20px !important; }

      /* Shrink stat cards */
      .stat-card p[style*="28px"] { font-size: 22px !important; }
    }

    .mobile-menu-btn { display: none; }

    /* Drag handle */
    .drag-handle { cursor: grab; color: var(--text-3); }
    .drag-handle:active { cursor: grabbing; }

    /* Focus mode */
    .focus-overlay {
      position: fixed; inset: 0; z-index: 2000;
      background: rgba(8,12,26,0.95);
      backdrop-filter: blur(20px);
      display: flex; align-items: center; justify-content: center;
      flex-direction: column; gap: 24px;
      animation: fadeIn 0.3s ease;
    }

    /* Tooltip */
    [data-tip] { position: relative; }
    [data-tip]::after {
      content: attr(data-tip);
      position: absolute; bottom: calc(100% + 6px); left: 50%;
      transform: translateX(-50%);
      background: var(--text); color: var(--bg);
      padding: 4px 8px; border-radius: 6px; font-size: 11px;
      white-space: nowrap; pointer-events: none;
      opacity: 0; transition: opacity 0.2s;
    }
    [data-tip]:hover::after { opacity: 1; }

    textarea.input { resize: none; }

    .section-header {
      display: flex; align-items: center; justify-content: space-between;
      margin-bottom: 20px;
    }
    .section-title {
      font-family: 'Syne', sans-serif;
      font-size: 22px; font-weight: 700;
      background: linear-gradient(135deg, var(--text), var(--text-2));
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    }

    .empty-state {
      display: flex; flex-direction: column; align-items: center;
      gap: 12px; padding: 40px 20px; color: var(--text-3);
      text-align: center;
    }
    .empty-icon { font-size: 40px; opacity: 0.4; }

    /* PDF preview */
    .pdf-embed { width: 100%; height: 500px; border-radius: 12px; border: 1px solid var(--border); }

    /* Streak fire */
    @keyframes fireFlicker { 0%,100% { transform: scaleY(1) rotate(-2deg); } 50% { transform: scaleY(1.05) rotate(2deg); } }
    .streak-fire { display: inline-block; animation: fireFlicker 0.8s ease-in-out infinite; }
  `}</style>
);

// ============================================================
// ICONS (inline SVG components)
// ============================================================
const Icon = ({ name, size = 16, style = {} }) => {
  const icons = {
    home: <><rect x="3" y="9" width="18" height="13" rx="2"/><polyline points="3 9 12 2 21 9"/></>,
    todo: <><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></>,
    calendar: <><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></>,
    pdf: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></>,
    timer: <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>,
    habit: <><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></>,
    exam: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></>,
    notes: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></>,
    sun: <><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></>,
    moon: <><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></>,
    plus: <><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>,
    trash: <><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></>,
    edit: <><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></>,
    check: <><polyline points="20 6 9 17 4 12"/></>,
    x: <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>,
    search: <><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></>,
    upload: <><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></>,
    arrow_l: <><polyline points="15 18 9 12 15 6"/></>,
    arrow_r: <><polyline points="9 18 15 12 9 6"/></>,
    menu: <><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></>,
    play: <><polygon points="5 3 19 12 5 21 5 3"/></>,
    pause: <><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></>,
    skip: <><polygon points="5 4 15 12 5 20 5 4"/><line x1="19" y1="5" x2="19" y2="19"/></>,
    reset: <><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-4.5"/></>,
    fire: <path d="M12 2C12 2 8 6 8 10a4 4 0 0 0 8 0c0-1.5-.5-3-1-4 0 0-1 2-2 2-1 0-1.5-1-1.5-2 0-1 .5-2 .5-4z" fill="currentColor" stroke="none"/>,
    bolt: <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill="currentColor" stroke="none"/>,
    star: <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>,
    info: <><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></>,
    drag: <><circle cx="9" cy="5" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="19" r="1"/></>,
    tag: <><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></>,
    clock: <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>,
    target: <><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
      {icons[name]}
    </svg>
  );
};

// ============================================================
// STORAGE HELPERS
// ============================================================
const LS = {
  get: (key, def = null) => {
    try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : def; } catch { return def; }
  },
  set: (key, val) => { try { localStorage.setItem(key, JSON.stringify(val)); } catch {} },
};

// ============================================================
// QUOTES
// ============================================================
const QUOTES = [
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "It always seems impossible until it's done.", author: "Nelson Mandela" },
  { text: "Education is the most powerful weapon.", author: "Nelson Mandela" },
  { text: "Learning is not attained by chance.", author: "Abigail Adams" },
  { text: "The beautiful thing about learning is nobody can take it away.", author: "B.B. King" },
  { text: "An investment in knowledge pays the best interest.", author: "Benjamin Franklin" },
  { text: "Live as if you were to die tomorrow. Learn as if you were to live forever.", author: "Gandhi" },
  { text: "The more that you read, the more things you will know.", author: "Dr. Seuss" },
];

// ============================================================
// MARKDOWN RENDERER (simple)
// ============================================================
function renderMarkdown(text) {
  if (!text) return '';
  let html = text
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code>$1</code>')
    .replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/^(\d+)\. (.+)$/gm, '<li>$2</li>')
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank">$1</a>')
    .replace(/^---$/gm, '<hr>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br>');
  return `<p>${html}</p>`;
}

// ============================================================
// DASHBOARD
// ============================================================
function Dashboard({ todos, habits, exams, pomodoroStats }) {
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  const quote = QUOTES[today.getDate() % QUOTES.length];

  const todayTodos = todos.filter(t => t.dueDate === todayStr && !t.done);
  const doneTodos = todos.filter(t => t.done);
  const totalTodos = todos.length;
  const progress = totalTodos ? Math.round((doneTodos.length / totalTodos) * 100) : 0;

  const upcomingExams = exams
    .map(e => ({ ...e, daysLeft: Math.ceil((new Date(e.date) - today) / 86400000) }))
    .filter(e => e.daysLeft >= 0)
    .sort((a, b) => a.daysLeft - b.daysLeft)
    .slice(0, 3);

  const todayFocus = pomodoroStats[todayStr] || 0;

  // Habit streak summary
  const todayHabits = habits.filter(h => h.done?.[todayStr]);
  const habitRate = habits.length ? Math.round((todayHabits.length / habits.length) * 100) : 0;

  // Ring
  const circumference = 2 * Math.PI * 45;
  const dash = circumference - (circumference * progress) / 100;

  return (
    <div className="animate-fadein">
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <p style={{ color: 'var(--text-3)', fontSize: 13, marginBottom: 4 }}>
              {today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
            <h1 style={{ fontSize: 30, fontWeight: 800, background: 'linear-gradient(135deg, var(--text), var(--accent))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Good {today.getHours() < 12 ? 'Morning' : today.getHours() < 17 ? 'Afternoon' : 'Evening'} 👋
            </h1>
          </div>
          {/* Quote */}
          <div className="glass animate-float" style={{ maxWidth: 280, padding: '12px 16px' }}>
            <p style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.5, fontStyle: 'italic' }}>"{quote.text}"</p>
            <p style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 4 }}>— {quote.author}</p>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 24 }}>
        {[
          { label: "Overall Progress", value: `${progress}%`, sub: `${doneTodos.length}/${totalTodos} tasks`, icon: 'target', color: 'var(--accent)' },
          { label: "Focus Today", value: `${todayFocus}m`, sub: `${Math.floor(todayFocus / 25)} sessions`, icon: 'timer', color: 'var(--accent-2)' },
          { label: "Habits Done", value: `${todayHabits.length}/${habits.length}`, sub: `${habitRate}% rate`, icon: 'bolt', color: 'var(--green)' },
          { label: "Next Exam", value: upcomingExams[0] ? `${upcomingExams[0].daysLeft}d` : '—', sub: upcomingExams[0]?.name || 'No exams', icon: 'exam', color: 'var(--orange)' },
        ].map((s, i) => (
          <div key={i} className="glass stat-card animate-fadein" style={{ padding: '18px 20px', animationDelay: `${i * 0.08}s`, '--accent-glow': s.color === 'var(--accent)' ? 'rgba(99,102,241,0.2)' : 'transparent' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontSize: 11, color: 'var(--text-3)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>{s.label}</p>
                <p style={{ fontSize: 28, fontWeight: 800, fontFamily: 'Syne', color: s.color }}>{s.value}</p>
                <p style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 2 }}>{s.sub}</p>
              </div>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: `${s.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color }}>
                <Icon name={s.icon} size={18} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main grid */}
      <div className="dash-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Progress ring + today's tasks */}
        <div className="glass" style={{ padding: 24, gridRow: 'span 1' }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-2)', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Today's Tasks</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 20 }}>
            <svg width="100" height="100" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="var(--border)" strokeWidth="8"/>
              <circle
                cx="50" cy="50" r="45" fill="none"
                stroke="url(#ringGrad)" strokeWidth="8" strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={dash}
                className="timer-ring"
                style={{ transition: 'stroke-dashoffset 1s ease' }}
              />
              <defs>
                <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#6366f1"/>
                  <stop offset="100%" stopColor="#8b5cf6"/>
                </linearGradient>
              </defs>
              <text x="50" y="46" textAnchor="middle" fill="var(--text)" fontSize="18" fontWeight="700" fontFamily="Syne">{progress}%</text>
              <text x="50" y="60" textAnchor="middle" fill="var(--text-3)" fontSize="9" fontFamily="DM Sans">complete</text>
            </svg>
            <div style={{ flex: 1 }}>
              {todayTodos.length === 0 ? (
                <p style={{ color: 'var(--text-3)', fontSize: 13 }}>No tasks due today 🎉</p>
              ) : (
                todayTodos.slice(0, 4).map(t => (
                  <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: t.priority === 'high' ? 'var(--red)' : t.priority === 'medium' ? 'var(--yellow)' : 'var(--green)', flexShrink: 0 }} />
                    <p style={{ fontSize: 13, color: 'var(--text-2)' }}>{t.text}</p>
                  </div>
                ))
              )}
              {todayTodos.length > 4 && <p style={{ fontSize: 12, color: 'var(--text-3)' }}>+{todayTodos.length - 4} more</p>}
            </div>
          </div>
        </div>

        {/* Upcoming exams */}
        <div className="glass" style={{ padding: 24 }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-2)', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Upcoming Exams</p>
          {upcomingExams.length === 0 ? (
            <div className="empty-state" style={{ padding: '20px 0' }}>
              <span className="empty-icon">🎓</span>
              <span style={{ fontSize: 13 }}>No upcoming exams</span>
            </div>
          ) : (
            upcomingExams.map(e => (
              <div key={e.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 600 }}>{e.name}</p>
                  <p style={{ fontSize: 12, color: 'var(--text-3)' }}>{e.subject}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: 20, fontWeight: 800, fontFamily: 'Syne', color: e.daysLeft <= 3 ? 'var(--red)' : e.daysLeft <= 7 ? 'var(--yellow)' : 'var(--green)' }}>
                    {e.daysLeft}d
                  </p>
                  <p style={{ fontSize: 11, color: 'var(--text-3)' }}>left</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Habit summary */}
        <div className="glass" style={{ padding: 24 }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-2)', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Habit Pulse</p>
          <div className="prog-bar" style={{ marginBottom: 12 }}>
            <div className="prog-fill" style={{ width: `${habitRate}%` }} />
          </div>
          <p style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 12 }}>{habitRate}% done today</p>
          {habits.slice(0, 4).map(h => (
            <div key={h.id} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: h.done?.[todayStr] ? 'var(--green)' : 'var(--border-strong)' }} />
              <p style={{ fontSize: 13, color: h.done?.[todayStr] ? 'var(--text)' : 'var(--text-3)' }}>{h.name}</p>
              {h.done?.[todayStr] && <span style={{ marginLeft: 'auto', color: 'var(--green)', fontSize: 12 }}>✓</span>}
            </div>
          ))}
        </div>

        {/* Focus stats */}
        <div className="glass" style={{ padding: 24 }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-2)', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Focus This Week</p>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 80 }}>
            {Array.from({ length: 7 }).map((_, i) => {
              const d = new Date(today);
              d.setDate(today.getDate() - (6 - i));
              const key = d.toISOString().split('T')[0];
              const mins = pomodoroStats[key] || 0;
              const maxMins = 120;
              const h = Math.min((mins / maxMins) * 100, 100);
              const isToday = key === todayStr;
              return (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <div style={{ width: '100%', height: 70, display: 'flex', alignItems: 'flex-end' }}>
                    <div style={{
                      width: '100%', height: `${Math.max(h, 4)}%`, borderRadius: '4px 4px 2px 2px',
                      background: isToday ? 'linear-gradient(180deg, var(--accent), var(--accent-2))' : 'var(--border)',
                      transition: 'height 0.5s ease',
                    }} />
                  </div>
                  <p style={{ fontSize: 9, color: isToday ? 'var(--accent)' : 'var(--text-3)' }}>
                    {d.toLocaleDateString('en-US', { weekday: 'narrow' })}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// TODO LIST
// ============================================================
function TodoList({ todos, setTodos }) {
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchQ, setSearchQ] = useState('');
  const [dragIdx, setDragIdx] = useState(null);

  const defaultForm = { text: '', priority: 'medium', tags: '', dueDate: '', done: false };
  const [form, setForm] = useState(defaultForm);

  const filtered = todos.filter(t => {
    if (filter === 'active') return !t.done;
    if (filter === 'done') return t.done;
    return true;
  }).filter(t => t.text.toLowerCase().includes(searchQ.toLowerCase()));

  const activeTodos = todos.filter(t => !t.done);
  const doneTodos = todos.filter(t => t.done);
  const progress = todos.length ? Math.round((doneTodos.length / todos.length) * 100) : 0;

  const openAdd = () => { setForm(defaultForm); setEditItem(null); setShowModal(true); };
  const openEdit = (t) => { setForm({ text: t.text, priority: t.priority, tags: t.tags || '', dueDate: t.dueDate || '', done: t.done }); setEditItem(t.id); setShowModal(true); };
  const save = () => {
    if (!form.text.trim()) return;
    if (editItem) {
      setTodos(todos.map(t => t.id === editItem ? { ...t, ...form } : t));
    } else {
      setTodos([{ id: Date.now(), ...form }, ...todos]);
    }
    setShowModal(false);
  };
  const toggleDone = (id) => setTodos(todos.map(t => t.id === id ? { ...t, done: !t.done } : t));
  const del = (id) => setTodos(todos.filter(t => t.id !== id));

  const onDragStart = (i) => setDragIdx(i);
  const onDragOver = (e, i) => { e.preventDefault(); };
  const onDrop = (i) => {
    if (dragIdx === null || dragIdx === i) return;
    const arr = [...filtered];
    const [item] = arr.splice(dragIdx, 1);
    arr.splice(i, 0, item);
    const ids = arr.map(t => t.id);
    setTodos(prev => {
      const rest = prev.filter(t => !ids.includes(t.id));
      return [...arr, ...rest];
    });
    setDragIdx(null);
  };

  return (
    <div className="animate-fadein">
      <div className="section-header">
        <h2 className="section-title">Smart To-Do</h2>
        <button className="btn btn-primary" onClick={openAdd}><Icon name="plus" size={14}/>New Task</button>
      </div>

      {/* Progress */}
      <div className="glass" style={{ padding: '16px 20px', marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontSize: 13, color: 'var(--text-2)' }}>{doneTodos.length} of {todos.length} completed</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--accent)' }}>{progress}%</span>
        </div>
        <div className="prog-bar"><div className="prog-fill" style={{ width: `${progress}%` }} /></div>
      </div>

      {/* Search & Filter */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, position: 'relative', minWidth: 180 }}>
          <Icon name="search" size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)' }} />
          <input className="input" placeholder="Search tasks…" value={searchQ} onChange={e => setSearchQ(e.target.value)} style={{ paddingLeft: 36 }} />
        </div>
        {['all','active','done'].map(f => (
          <button key={f} className={`btn ${filter === f ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setFilter(f)} style={{ textTransform: 'capitalize' }}>{f}</button>
        ))}
      </div>

      {/* Task list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {filtered.length === 0 && (
          <div className="glass empty-state"><span className="empty-icon">✅</span><span>No tasks here</span></div>
        )}
        {filtered.map((t, i) => (
          <div
            key={t.id}
            className="glass animate-fadein"
            draggable
            onDragStart={() => onDragStart(i)}
            onDragOver={e => onDragOver(e, i)}
            onDrop={() => onDrop(i)}
            style={{
              padding: '14px 18px',
              display: 'flex', alignItems: 'center', gap: 12,
              opacity: t.done ? 0.6 : 1,
              animationDelay: `${i * 0.04}s`,
              cursor: 'default',
              border: dragIdx === i ? '1px solid var(--accent)' : undefined,
            }}
          >
            <Icon name="drag" size={14} style={{ color: 'var(--text-3)', cursor: 'grab' }} />
            <div className={`checkbox ${t.done ? 'checked' : ''}`} onClick={() => toggleDone(t.id)}>
              {t.done && <Icon name="check" size={11} style={{ color: 'white' }} />}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 14, fontWeight: 500, textDecoration: t.done ? 'line-through' : 'none', color: t.done ? 'var(--text-3)' : 'var(--text)' }}>{t.text}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4, flexWrap: 'wrap' }}>
                <span className={`tag pri-${t.priority}`}>{t.priority}</span>
                {t.tags && t.tags.split(',').map(tag => tag.trim()).filter(Boolean).map(tag => (
                  <span key={tag} className="tag" style={{ background: 'var(--border)', color: 'var(--text-2)' }}>{tag}</span>
                ))}
                {t.dueDate && <span style={{ fontSize: 11, color: 'var(--text-3)', display: 'flex', alignItems: 'center', gap: 3 }}><Icon name="clock" size={11}/>Due {t.dueDate}</span>}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
              <button className="btn btn-ghost" style={{ padding: '6px 8px' }} onClick={() => openEdit(t)}><Icon name="edit" size={13}/></button>
              <button className="btn btn-danger" style={{ padding: '6px 8px' }} onClick={() => del(t.id)}><Icon name="trash" size={13}/></button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ fontFamily: 'Syne', fontSize: 18 }}>{editItem ? 'Edit Task' : 'New Task'}</h3>
              <button className="btn btn-ghost" style={{ padding: '6px 8px' }} onClick={() => setShowModal(false)}><Icon name="x" size={16}/></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <input className="input" placeholder="Task description…" value={form.text} onChange={e => setForm({ ...form, text: e.target.value })} autoFocus />
              <select className="input" value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}>
                <option value="low">🟢 Low Priority</option>
                <option value="medium">🟡 Medium Priority</option>
                <option value="high">🔴 High Priority</option>
              </select>
              <input className="input" placeholder="Tags (comma separated)" value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} />
              <input className="input" type="date" value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })} />
              <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setShowModal(false)}>Cancel</button>
                <button className="btn btn-primary" style={{ flex: 1 }} onClick={save}>Save Task</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// CALENDAR
// ============================================================
function Calendar({ todos, setTodos }) {
  const [view, setView] = useState('month');
  const [current, setCurrent] = useState(new Date());
  const [selected, setSelected] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState('');

  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDay = (year, month) => new Date(year, month, 1).getDay();

  const year = current.getFullYear();
  const month = current.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDay(year, month);

  const tasksByDate = {};
  todos.forEach(t => {
    if (t.dueDate) {
      if (!tasksByDate[t.dueDate]) tasksByDate[t.dueDate] = [];
      tasksByDate[t.dueDate].push(t);
    }
  });

  const addTask = () => {
    if (!newTask.trim() || !selected) return;
    setTodos(prev => [...prev, { id: Date.now(), text: newTask, priority: 'medium', tags: '', dueDate: selected, done: false }]);
    setNewTask(''); setShowModal(false);
  };

  const cells = [];
  for (let i = 0; i < firstDay; i++) {
    const d = new Date(year, month, -(firstDay - 1 - i));
    cells.push({ day: d.getDate(), date: d.toISOString().split('T')[0], otherMonth: true });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d);
    cells.push({ day: d, date: date.toISOString().split('T')[0], otherMonth: false });
  }
  while (cells.length % 7 !== 0) {
    const d = new Date(year, month + 1, cells.length - daysInMonth - firstDay + 1);
    cells.push({ day: d.getDate(), date: d.toISOString().split('T')[0], otherMonth: true });
  }

  const priorityColor = (p) => p === 'high' ? '#ef4444' : p === 'medium' ? '#f59e0b' : '#10b981';

  // Weekly view: get current week
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay());
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    return d;
  });

  return (
    <div className="animate-fadein">
      <div className="section-header">
        <h2 className="section-title">Calendar</h2>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className={`btn ${view === 'month' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setView('month')}>Month</button>
          <button className={`btn ${view === 'week' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setView('week')}>Week</button>
        </div>
      </div>

      <div className="glass" style={{ padding: 24 }}>
        {/* Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <button className="btn btn-ghost" style={{ padding: '8px 10px' }} onClick={() => setCurrent(new Date(year, month - 1, 1))}><Icon name="arrow_l" size={16}/></button>
          <h3 style={{ fontFamily: 'Syne', fontSize: 18 }}>{current.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h3>
          <button className="btn btn-ghost" style={{ padding: '8px 10px' }} onClick={() => setCurrent(new Date(year, month + 1, 1))}><Icon name="arrow_r" size={16}/></button>
        </div>

        {view === 'month' && (
          <>
            {/* Day headers */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: 8 }}>
              {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => (
                <div key={d} style={{ textAlign: 'center', fontSize: 11, fontWeight: 700, color: 'var(--text-3)', padding: '4px 0', letterSpacing: '0.05em' }}>{d}</div>
              ))}
            </div>
            {/* Days grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
              {cells.map((cell, i) => {
                const tasks = tasksByDate[cell.date] || [];
                const isToday = cell.date === todayStr;
                return (
                  <div
                    key={i}
                    className={`cal-day ${isToday ? 'today' : ''} ${cell.otherMonth ? 'other-month' : ''}`}
                    onClick={() => { setSelected(cell.date); setShowModal(true); }}
                    style={{ minHeight: 64 }}
                  >
                    <span style={{ fontSize: 12, fontWeight: isToday ? 700 : 400, color: isToday ? 'var(--accent)' : 'var(--text)' }}>{cell.day}</span>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 2, marginTop: 2, width: '100%' }}>
                      {tasks.slice(0, 3).map(t => (
                        <div key={t.id} className="cal-dot" style={{ background: priorityColor(t.priority) }} />
                      ))}
                      {tasks.length > 3 && <span style={{ fontSize: 9, color: 'var(--text-3)' }}>+{tasks.length - 3}</span>}
                    </div>
                    {tasks.slice(0, 1).map(t => (
                      <p key={t.id} style={{ fontSize: 9, color: 'var(--text-2)', width: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.text}</p>
                    ))}
                  </div>
                );
              })}
            </div>
          </>
        )}

        {view === 'week' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 8 }}>
            {weekDays.map((d, i) => {
              const dateStr = d.toISOString().split('T')[0];
              const tasks = tasksByDate[dateStr] || [];
              const isToday = dateStr === todayStr;
              return (
                <div key={i} className={`glass ${isToday ? '' : ''}`} style={{
                  padding: 12, minHeight: 140, border: isToday ? '2px solid var(--accent)' : '1px solid var(--border)',
                  cursor: 'pointer', background: isToday ? 'rgba(99,102,241,0.05)' : undefined
                }} onClick={() => { setSelected(dateStr); setShowModal(true); }}>
                  <div style={{ textAlign: 'center', marginBottom: 8 }}>
                    <p style={{ fontSize: 10, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {d.toLocaleDateString('en-US', { weekday: 'short' })}
                    </p>
                    <p style={{ fontSize: 20, fontWeight: 700, fontFamily: 'Syne', color: isToday ? 'var(--accent)' : 'var(--text)' }}>{d.getDate()}</p>
                  </div>
                  {tasks.map(t => (
                    <div key={t.id} style={{ padding: '3px 6px', borderRadius: 6, background: `${priorityColor(t.priority)}22`, marginBottom: 3 }}>
                      <p style={{ fontSize: 10, color: priorityColor(t.priority), overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.text}</p>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Tasks for selected day modal */}
      {showModal && selected && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <h3 style={{ fontFamily: 'Syne', fontSize: 17 }}>{new Date(selected + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</h3>
              <button className="btn btn-ghost" style={{ padding: '6px 8px' }} onClick={() => setShowModal(false)}><Icon name="x" size={15}/></button>
            </div>
            <div style={{ maxHeight: 200, overflowY: 'auto', marginBottom: 16 }}>
              {(tasksByDate[selected] || []).length === 0 ? (
                <p style={{ color: 'var(--text-3)', fontSize: 13, textAlign: 'center', padding: '16px 0' }}>No tasks for this day</p>
              ) : (
                (tasksByDate[selected] || []).map(t => (
                  <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: priorityColor(t.priority), flexShrink: 0 }} />
                    <span style={{ fontSize: 13, textDecoration: t.done ? 'line-through' : 'none', color: t.done ? 'var(--text-3)' : 'var(--text)' }}>{t.text}</span>
                  </div>
                ))
              )}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <input className="input" placeholder="Add task for this day…" value={newTask} onChange={e => setNewTask(e.target.value)} onKeyDown={e => e.key === 'Enter' && addTask()} />
              <button className="btn btn-primary" onClick={addTask}><Icon name="plus" size={14}/></button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// PDF MANAGER
// ============================================================
function PDFManager() {
  const [pdfs, setPdfs] = useState(() => LS.get('studyos_pdfs', []));
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [preview, setPreview] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef();

  useEffect(() => {
    // Don't persist large PDFs to localStorage to avoid quota errors
    const meta = pdfs.map(p => ({ ...p, data: undefined }));
    LS.set('studyos_pdfs', meta);
  }, [pdfs]);

  const addPDF = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const newPdf = {
        id: Date.now(), name: file.name,
        subject: 'General', size: (file.size / 1024).toFixed(1) + ' KB',
        uploadedAt: new Date().toLocaleDateString(),
        data: e.target.result,
      };
      setPdfs(prev => [newPdf, ...prev]);
    };
    reader.readAsDataURL(file);
  };

  const handleFiles = (files) => Array.from(files).filter(f => f.type === 'application/pdf').forEach(addPDF);

  const handleDrop = (e) => {
    e.preventDefault(); setDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  const filtered = pdfs.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) &&
    (category === 'All' || p.subject === category)
  );

  const subjects = ['All', ...new Set(pdfs.map(p => p.subject))];

  const updateSubject = (id, subject) => setPdfs(pdfs.map(p => p.id === id ? { ...p, subject } : p));
  const deletePdf = (id) => { if (preview?.id === id) setPreview(null); setPdfs(pdfs.filter(p => p.id !== id)); };

  return (
    <div className="animate-fadein">
      <div className="section-header">
        <h2 className="section-title">PDF Manager</h2>
        <button className="btn btn-primary" onClick={() => fileRef.current?.click()}><Icon name="upload" size={14}/>Upload</button>
        <input ref={fileRef} type="file" accept=".pdf" multiple style={{ display: 'none' }} onChange={e => handleFiles(e.target.files)} />
      </div>

      {/* Drop zone */}
      <div
        className="glass"
        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        style={{
          border: `2px dashed ${dragOver ? 'var(--accent)' : 'var(--border)'}`,
          borderRadius: 20, padding: '24px', textAlign: 'center', marginBottom: 20,
          background: dragOver ? 'rgba(99,102,241,0.05)' : undefined,
          transition: 'all 0.2s', cursor: 'pointer'
        }}
        onClick={() => fileRef.current?.click()}
      >
        <Icon name="upload" size={28} style={{ color: 'var(--accent)', marginBottom: 8 }} />
        <p style={{ color: 'var(--text-2)', fontSize: 14 }}>Drop PDFs here or click to upload</p>
        <p style={{ color: 'var(--text-3)', fontSize: 12, marginTop: 4 }}>Stored in your browser</p>
      </div>

      {/* Search & filter */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, position: 'relative', minWidth: 180 }}>
          <Icon name="search" size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)' }} />
          <input className="input" placeholder="Search PDFs…" value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 36 }} />
        </div>
        {subjects.map(s => (
          <button key={s} className={`btn ${category === s ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setCategory(s)}>{s}</button>
        ))}
      </div>

      {preview ? (
        <div className="glass" style={{ padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
            <h3 style={{ fontFamily: 'Syne', fontSize: 16 }}>{preview.name}</h3>
            <button className="btn btn-ghost" onClick={() => setPreview(null)}><Icon name="x" size={15}/>Close</button>
          </div>
          {preview.data ? (
            <embed src={preview.data} className="pdf-embed" type="application/pdf" />
          ) : (
            <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-3)' }}>
              <p>Preview not available (PDF data not stored to save browser storage)</p>
            </div>
          )}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
          {filtered.length === 0 && (
            <div className="glass empty-state" style={{ gridColumn: '1/-1' }}>
              <span className="empty-icon">📄</span>
              <span>No PDFs yet. Upload your study materials!</span>
            </div>
          )}
          {filtered.map(p => (
            <div key={p.id} className="glass animate-scalein" style={{ padding: 18 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 12 }}>
                <div style={{ width: 44, height: 56, borderRadius: 10, background: 'linear-gradient(135deg, rgba(239,68,68,0.15), rgba(239,68,68,0.05))', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon name="pdf" size={22} style={{ color: 'var(--red)' }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 13, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</p>
                  <p style={{ fontSize: 11, color: 'var(--text-3)' }}>{p.size} · {p.uploadedAt}</p>
                </div>
              </div>
              <select className="input" value={p.subject} onChange={e => updateSubject(p.id, e.target.value)} style={{ fontSize: 12, padding: '6px 10px', marginBottom: 10 }}>
                {['General','Math','Physics','Chemistry','Biology','History','Literature','Computer Science','Economics'].map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <div style={{ display: 'flex', gap: 6 }}>
                <button className="btn btn-primary" style={{ flex: 1, fontSize: 12, padding: '7px 10px' }} onClick={() => setPreview(p)}>Preview</button>
                <button className="btn btn-danger" style={{ padding: '7px 10px' }} onClick={() => deletePdf(p.id)}><Icon name="trash" size={12}/></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================
// POMODORO TIMER
// ============================================================
function PomodoroTimer({ onFocusUpdate }) {
  const [mode, setMode] = useState('focus'); // focus | break | long
  const [running, setRunning] = useState(false);
  const [settings, setSettings] = useState({ focus: 25, shortBreak: 5, longBreak: 15 });
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [sessions, setSessions] = useState(0);
  const [focusMins, setFocusMins] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const intervalRef = useRef();

  const totalTime = (mode === 'focus' ? settings.focus : mode === 'break' ? settings.shortBreak : settings.longBreak) * 60;
  const progress = 1 - timeLeft / totalTime;
  const circumference = 2 * Math.PI * 90;
  const dash = circumference - circumference * progress;

  useEffect(() => {
    setTimeLeft(totalTime);
    setRunning(false);
  }, [mode, settings]);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            clearInterval(intervalRef.current);
            setRunning(false);
            if (mode === 'focus') {
              const newSessions = sessions + 1;
              setSessions(newSessions);
              const todayStr = new Date().toISOString().split('T')[0];
              const newMins = focusMins + settings.focus;
              setFocusMins(newMins);
              onFocusUpdate(todayStr, newMins);
            }
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [running, mode]);

  const mins = String(Math.floor(timeLeft / 60)).padStart(2, '0');
  const secs = String(timeLeft % 60).padStart(2, '0');

  const reset = () => { setRunning(false); setTimeLeft(totalTime); };
  const skip = () => { setRunning(false); setMode(mode === 'focus' ? 'break' : 'focus'); };

  const modeLabels = { focus: '🎯 Focus', break: '☕ Short Break', long: '🌙 Long Break' };
  const modeColors = { focus: 'var(--accent)', break: 'var(--green)', long: 'var(--accent-2)' };

  const TimerContent = (
    <>
      <div style={{ display: 'flex', gap: 8, marginBottom: 32, justifyContent: 'center', flexWrap: 'wrap' }}>
        {Object.entries(modeLabels).map(([key, label]) => (
          <button key={key} className={`btn ${mode === key ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setMode(key)}>{label}</button>
        ))}
      </div>

      <div style={{ position: 'relative', width: 220, height: 220, margin: '0 auto 32px' }}>
        <svg width="220" height="220" viewBox="0 0 220 220" className="timer-ring" style={{ position: 'absolute', inset: 0 }}>
          <circle cx="110" cy="110" r="90" fill="none" stroke="var(--border)" strokeWidth="8"/>
          <circle
            cx="110" cy="110" r="90" fill="none"
            stroke={modeColors[mode]} strokeWidth="8" strokeLinecap="round"
            strokeDasharray={circumference} strokeDashoffset={dash}
            className="timer-ring-circle"
          />
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <p style={{ fontSize: 52, fontWeight: 800, fontFamily: 'Syne', color: modeColors[mode], letterSpacing: '-2px', lineHeight: 1 }}>{mins}:{secs}</p>
          <p style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 6, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{modeLabels[mode]}</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginBottom: 32 }}>
        <button className="btn btn-ghost" style={{ padding: '12px 14px' }} onClick={reset}><Icon name="reset" size={18}/></button>
        <button className="btn btn-primary" style={{ padding: '12px 36px', fontSize: 16 }} onClick={() => setRunning(!running)}>
          <Icon name={running ? 'pause' : 'play'} size={20}/>{running ? 'Pause' : 'Start'}
        </button>
        <button className="btn btn-ghost" style={{ padding: '12px 14px' }} onClick={skip}><Icon name="skip" size={18}/></button>
      </div>

      <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: 24, fontWeight: 800, fontFamily: 'Syne', color: 'var(--accent)' }}>{sessions}</p>
          <p style={{ fontSize: 11, color: 'var(--text-3)' }}>Sessions</p>
        </div>
        <div style={{ width: 1, background: 'var(--border)' }} />
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: 24, fontWeight: 800, fontFamily: 'Syne', color: 'var(--accent-2)' }}>{focusMins}</p>
          <p style={{ fontSize: 11, color: 'var(--text-3)' }}>Focus mins</p>
        </div>
        <div style={{ width: 1, background: 'var(--border)' }} />
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: 24, fontWeight: 800, fontFamily: 'Syne', color: 'var(--green)' }}>{Math.floor(sessions / 4)}</p>
          <p style={{ fontSize: 11, color: 'var(--text-3)' }}>Long breaks</p>
        </div>
      </div>
    </>
  );

  if (focusMode) {
    return (
      <div className="focus-overlay">
        <div style={{ textAlign: 'center', padding: 40 }}>
          <p style={{ color: 'var(--text-3)', fontSize: 14, marginBottom: 24, letterSpacing: '0.2em', textTransform: 'uppercase' }}>Focus Mode</p>
          {TimerContent}
          <button className="btn btn-ghost" style={{ marginTop: 24 }} onClick={() => setFocusMode(false)}>Exit Focus Mode</button>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fadein">
      <div className="section-header">
        <h2 className="section-title">Pomodoro Timer</h2>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-ghost" onClick={() => setShowSettings(!showSettings)}>⚙️ Settings</button>
          <button className="btn btn-primary" onClick={() => setFocusMode(true)}><Icon name="bolt" size={14}/>Focus Mode</button>
        </div>
      </div>

      {showSettings && (
        <div className="glass animate-fadein" style={{ padding: 20, marginBottom: 20 }}>
          <p style={{ fontWeight: 600, marginBottom: 12 }}>Timer Settings</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            {[['focus', 'Focus (min)'], ['shortBreak', 'Short Break'], ['longBreak', 'Long Break']].map(([key, label]) => (
              <div key={key}>
                <label style={{ fontSize: 12, color: 'var(--text-3)', display: 'block', marginBottom: 6 }}>{label}</label>
                <input className="input" type="number" min="1" max="120" value={settings[key]}
                  onChange={e => setSettings({ ...settings, [key]: +e.target.value })} />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="glass" style={{ padding: '40px 20px', textAlign: 'center' }}>
        {TimerContent}
      </div>
    </div>
  );
}

// ============================================================
// HABIT TRACKER
// ============================================================
function HabitTracker() {
  const [habits, setHabits] = useState(() => LS.get('studyos_habits', []));
  const [showModal, setShowModal] = useState(false);
  const [newHabit, setNewHabit] = useState({ name: '', icon: '⭐', color: '#6366f1' });

  useEffect(() => { LS.set('studyos_habits', habits); }, [habits]);

  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];

  // Last 21 days
  const days = Array.from({ length: 21 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (20 - i));
    return d.toISOString().split('T')[0];
  });

  const toggle = (hid, day) => {
    setHabits(habits.map(h => {
      if (h.id !== hid) return h;
      const done = { ...(h.done || {}) };
      done[day] = !done[day];
      return { ...h, done };
    }));
  };

  const getStreak = (habit) => {
    let streak = 0;
    const d = new Date(today);
    while (true) {
      const key = d.toISOString().split('T')[0];
      if (!habit.done?.[key]) break;
      streak++;
      d.setDate(d.getDate() - 1);
    }
    return streak;
  };

  const addHabit = () => {
    if (!newHabit.name.trim()) return;
    setHabits([...habits, { id: Date.now(), ...newHabit, done: {} }]);
    setNewHabit({ name: '', icon: '⭐', color: '#6366f1' });
    setShowModal(false);
  };

  const ICONS = ['⭐','📚','🏃','💧','🧘','✍️','🎵','🥗','😴','💪','🧠','🎯'];

  return (
    <div className="animate-fadein">
      <div className="section-header">
        <h2 className="section-title">Habit Tracker</h2>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}><Icon name="plus" size={14}/>New Habit</button>
      </div>

      {habits.length === 0 ? (
        <div className="glass empty-state"><span className="empty-icon">🌱</span><span>Start building habits today!</span></div>
      ) : (
        <div className="glass" style={{ padding: 24, overflowX: 'auto' }}>
          {/* Date headers */}
          <div style={{ display: 'grid', gridTemplateColumns: '180px repeat(21, 26px)', gap: 4, alignItems: 'center', marginBottom: 16 }}>
            <div />
            {days.map(d => {
              const date = new Date(d + 'T12:00:00');
              return (
                <div key={d} style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: 9, color: d === todayStr ? 'var(--accent)' : 'var(--text-3)', fontWeight: d === todayStr ? 700 : 400 }}>
                    {date.toLocaleDateString('en-US', { weekday: 'narrow' })}
                  </p>
                  <p style={{ fontSize: 9, color: d === todayStr ? 'var(--accent)' : 'var(--text-3)' }}>
                    {date.getDate()}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Habits */}
          {habits.map(h => {
            const streak = getStreak(h);
            const total = Object.values(h.done || {}).filter(Boolean).length;
            return (
              <div key={h.id} style={{ display: 'grid', gridTemplateColumns: '180px repeat(21, 26px)', gap: 4, alignItems: 'center', marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 18 }}>{h.icon}</span>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontSize: 13, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{h.name}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      {streak > 0 && <><span className="streak-fire">🔥</span><span style={{ fontSize: 11, color: 'var(--orange)' }}>{streak}</span></>}
                      <span style={{ fontSize: 10, color: 'var(--text-3)' }}>{total} done</span>
                    </div>
                  </div>
                  <button onClick={() => setHabits(habits.filter(x => x.id !== h.id))} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)', padding: '2px 4px' }}>
                    <Icon name="x" size={12}/>
                  </button>
                </div>
                {days.map(d => (
                  <div
                    key={d}
                    className={`habit-cell ${h.done?.[d] ? 'done' : ''}`}
                    onClick={() => toggle(h.id, d)}
                    title={d}
                  />
                ))}
              </div>
            );
          })}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <h3 style={{ fontFamily: 'Syne', fontSize: 17 }}>New Habit</h3>
              <button className="btn btn-ghost" style={{ padding: '6px 8px' }} onClick={() => setShowModal(false)}><Icon name="x" size={15}/></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <input className="input" placeholder="Habit name…" value={newHabit.name} onChange={e => setNewHabit({ ...newHabit, name: e.target.value })} autoFocus />
              <div>
                <p style={{ fontSize: 12, color: 'var(--text-3)', marginBottom: 8 }}>Pick an icon</p>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {ICONS.map(ic => (
                    <button key={ic} onClick={() => setNewHabit({ ...newHabit, icon: ic })}
                      style={{ width: 36, height: 36, borderRadius: 8, border: `2px solid ${newHabit.icon === ic ? 'var(--accent)' : 'var(--border)'}`, background: 'none', cursor: 'pointer', fontSize: 18 }}>
                      {ic}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setShowModal(false)}>Cancel</button>
                <button className="btn btn-primary" style={{ flex: 1 }} onClick={addHabit}>Add Habit</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// EXAM COUNTDOWN
// ============================================================
function ExamCountdown() {
  const [exams, setExams] = useState(() => LS.get('studyos_exams', []));
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', subject: '', date: '', notes: '' });

  useEffect(() => { LS.set('studyos_exams', exams); }, [exams]);

  const today = new Date();
  const enriched = exams.map(e => {
    const d = Math.ceil((new Date(e.date) - today) / 86400000);
    return { ...e, daysLeft: d };
  }).sort((a, b) => a.daysLeft - b.daysLeft);

  const add = () => {
    if (!form.name || !form.date) return;
    setExams([...exams, { id: Date.now(), ...form }]);
    setForm({ name: '', subject: '', date: '', notes: '' });
    setShowModal(false);
  };

  const getUrgency = (d) => {
    if (d < 0) return { label: 'Past', color: 'var(--text-3)', bg: 'var(--border)' };
    if (d <= 3) return { label: 'Critical', color: '#ef4444', bg: 'rgba(239,68,68,0.1)' };
    if (d <= 7) return { label: 'Urgent', color: '#f97316', bg: 'rgba(249,115,22,0.1)' };
    if (d <= 14) return { label: 'Soon', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' };
    return { label: 'Upcoming', color: '#10b981', bg: 'rgba(16,185,129,0.1)' };
  };

  return (
    <div className="animate-fadein">
      <div className="section-header">
        <h2 className="section-title">Exam Countdown</h2>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}><Icon name="plus" size={14}/>Add Exam</button>
      </div>

      {enriched.length === 0 ? (
        <div className="glass empty-state"><span className="empty-icon">🎓</span><span>No exams added yet</span></div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {enriched.map(e => {
            const u = getUrgency(e.daysLeft);
            const prog = e.daysLeft >= 0 ? Math.max(0, Math.min(100, 100 - (e.daysLeft / 30) * 100)) : 100;
            return (
              <div key={e.id} className="glass animate-scalein" style={{ padding: 22, position: 'relative', overflow: 'hidden', border: e.daysLeft <= 3 && e.daysLeft >= 0 ? '1px solid rgba(239,68,68,0.3)' : undefined }}>
                {e.daysLeft <= 3 && e.daysLeft >= 0 && (
                  <div className="animate-pulse-slow" style={{ position: 'absolute', top: 12, right: 12, width: 8, height: 8, borderRadius: '50%', background: 'var(--red)' }} />
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                  <div>
                    <p style={{ fontSize: 16, fontWeight: 700, fontFamily: 'Syne', marginBottom: 4 }}>{e.name}</p>
                    {e.subject && <span className="tag" style={{ background: 'var(--border)', color: 'var(--text-2)' }}>{e.subject}</span>}
                  </div>
                  <button className="btn btn-danger" style={{ padding: '6px 8px', flexShrink: 0 }} onClick={() => setExams(exams.filter(x => x.id !== e.id))}><Icon name="trash" size={12}/></button>
                </div>
                <div style={{ textAlign: 'center', marginBottom: 16 }}>
                  <p style={{ fontSize: 56, fontWeight: 900, fontFamily: 'Syne', color: u.color, lineHeight: 1 }}>
                    {e.daysLeft < 0 ? 'Past' : e.daysLeft === 0 ? 'Today!' : e.daysLeft}
                  </p>
                  {e.daysLeft >= 0 && <p style={{ fontSize: 12, color: 'var(--text-3)' }}>{e.daysLeft === 0 ? 'Good luck!' : 'days remaining'}</p>}
                </div>
                <div style={{ marginBottom: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-3)', marginBottom: 4 }}>
                    <span>Urgency</span>
                    <span style={{ color: u.color }}>{u.label}</span>
                  </div>
                  <div className="prog-bar">
                    <div style={{ height: '100%', width: `${prog}%`, borderRadius: 99, background: u.color, transition: 'width 0.6s ease' }} />
                  </div>
                </div>
                <p style={{ fontSize: 11, color: 'var(--text-3)' }}>
                  📅 {new Date(e.date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </p>
                {e.notes && <p style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 8 }}>{e.notes}</p>}
              </div>
            );
          })}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <h3 style={{ fontFamily: 'Syne', fontSize: 17 }}>Add Exam</h3>
              <button className="btn btn-ghost" style={{ padding: '6px 8px' }} onClick={() => setShowModal(false)}><Icon name="x" size={15}/></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <input className="input" placeholder="Exam name…" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} autoFocus />
              <input className="input" placeholder="Subject" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} />
              <input className="input" type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
              <textarea className="input" placeholder="Notes (optional)" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows={2} />
              <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setShowModal(false)}>Cancel</button>
                <button className="btn btn-primary" style={{ flex: 1 }} onClick={add}>Add Exam</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// NOTES
// ============================================================
function Notes() {
  const [notes, setNotes] = useState(() => LS.get('studyos_notes', []));
  const [active, setActive] = useState(null);
  const [search, setSearch] = useState('');
  const [preview, setPreview] = useState(false);
  const autoSaveRef = useRef();

  useEffect(() => { LS.set('studyos_notes', notes); }, [notes]);

  const newNote = () => {
    const n = { id: Date.now(), title: 'Untitled Note', content: '', updatedAt: new Date().toISOString() };
    setNotes(prev => [n, ...prev]);
    setActive(n);
    setPreview(false);
  };

  const update = (field, val) => {
    setActive(a => {
      const updated = { ...a, [field]: val, updatedAt: new Date().toISOString() };
      clearTimeout(autoSaveRef.current);
      autoSaveRef.current = setTimeout(() => {
        setNotes(prev => prev.map(n => n.id === updated.id ? updated : n));
      }, 400);
      return updated;
    });
  };

  const del = (id) => {
    setNotes(notes.filter(n => n.id !== id));
    if (active?.id === id) setActive(null);
  };

  const filtered = notes.filter(n =>
    n.title.toLowerCase().includes(search.toLowerCase()) ||
    n.content.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="animate-fadein notes-layout" style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 20, height: 'calc(100vh - 120px)' }}>
      {/* Sidebar */}
      <div className="glass" style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12, overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 className="section-title" style={{ fontSize: 18 }}>Notes</h2>
          <button className="btn btn-primary" style={{ padding: '6px 10px', fontSize: 12 }} onClick={newNote}><Icon name="plus" size={13}/></button>
        </div>
        <div style={{ position: 'relative' }}>
          <Icon name="search" size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)' }}/>
          <input className="input" placeholder="Search notes…" value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 32, fontSize: 13 }}/>
        </div>
        <div className="scroll-panel" style={{ flex: 1 }}>
          {filtered.length === 0 && (
            <p style={{ fontSize: 13, color: 'var(--text-3)', textAlign: 'center', padding: '20px 0' }}>No notes</p>
          )}
          {filtered.map(n => (
            <div
              key={n.id}
              onClick={() => { setActive(n); setPreview(false); }}
              style={{
                padding: '10px 12px', borderRadius: 12, cursor: 'pointer', marginBottom: 4,
                background: active?.id === n.id ? 'linear-gradient(135deg, rgba(99,102,241,0.12), rgba(139,92,246,0.08))' : 'transparent',
                border: `1px solid ${active?.id === n.id ? 'var(--border-strong)' : 'transparent'}`,
                transition: 'all 0.15s',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 4 }}>
                <p style={{ fontSize: 13, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>{n.title || 'Untitled'}</p>
                <button onClick={e => { e.stopPropagation(); del(n.id); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)', padding: '0 2px', flexShrink: 0 }}>
                  <Icon name="x" size={12}/>
                </button>
              </div>
              <p style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {n.content.substring(0, 50) || 'Empty note'}
              </p>
              <p style={{ fontSize: 10, color: 'var(--text-3)', marginTop: 3 }}>
                {new Date(n.updatedAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Editor */}
      {active ? (
        <div className="glass" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <input
              value={active.title}
              onChange={e => update('title', e.target.value)}
              style={{ flex: 1, background: 'none', border: 'none', outline: 'none', fontSize: 22, fontWeight: 700, fontFamily: 'Syne', color: 'var(--text)' }}
              placeholder="Note title…"
            />
            <div style={{ display: 'flex', gap: 8 }}>
              <button className={`btn ${!preview ? 'btn-primary' : 'btn-ghost'}`} style={{ fontSize: 12, padding: '6px 12px' }} onClick={() => setPreview(false)}>Edit</button>
              <button className={`btn ${preview ? 'btn-primary' : 'btn-ghost'}`} style={{ fontSize: 12, padding: '6px 12px' }} onClick={() => setPreview(true)}>Preview</button>
            </div>
          </div>
          <p style={{ fontSize: 11, color: 'var(--text-3)', marginBottom: 12 }}>
            Auto-saved · Last updated {new Date(active.updatedAt).toLocaleTimeString()}
          </p>
          <div style={{ flex: 1, overflow: 'hidden' }}>
            {preview ? (
              <div className="md-preview scroll-panel" style={{ height: '100%', overflowY: 'auto', lineHeight: 1.7, color: 'var(--text-2)', fontSize: 14 }}
                dangerouslySetInnerHTML={{ __html: renderMarkdown(active.content) }} />
            ) : (
              <textarea
                className="input scroll-panel"
                value={active.content}
                onChange={e => update('content', e.target.value)}
                placeholder={"Start typing... Markdown supported!\n\n# Heading\n**bold** *italic*\n- List item\n> Quote\n`code`"}
                style={{ width: '100%', height: '100%', resize: 'none', fontFamily: 'DM Mono, monospace', fontSize: 14, lineHeight: 1.7 }}
              />
            )}
          </div>
          <p style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 8 }}>Supports Markdown: # ## **bold** *italic* `code` - lists {'>'} quotes</p>
        </div>
      ) : (
        <div className="glass" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="empty-state">
            <span style={{ fontSize: 56 }}>📝</span>
            <p style={{ fontFamily: 'Syne', fontSize: 18, fontWeight: 700 }}>No note selected</p>
            <p style={{ color: 'var(--text-3)', fontSize: 14 }}>Create a note or pick one from the list</p>
            <button className="btn btn-primary" onClick={newNote}><Icon name="plus" size={14}/>New Note</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// MAIN APP
// ============================================================
export default function StudyOS() {
  const [dark, setDark] = useState(() => LS.get('studyos_dark', false));
  const [page, setPage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [todos, setTodos] = useState(() => LS.get('studyos_todos', []));
  const [exams, setExams] = useState(() => LS.get('studyos_exams', []));
  const [habits, setHabits] = useState(() => LS.get('studyos_habits', []));
  const [pomodoroStats, setPomodoroStats] = useState(() => LS.get('studyos_focus', {}));

  // Sync state to LS
  useEffect(() => { LS.set('studyos_todos', todos); }, [todos]);
  useEffect(() => { LS.set('studyos_exams', exams); }, [exams]);
  useEffect(() => { LS.set('studyos_habits', habits); }, [habits]);
  useEffect(() => { LS.set('studyos_focus', pomodoroStats); }, [pomodoroStats]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    LS.set('studyos_dark', dark);
  }, [dark]);

  const onFocusUpdate = useCallback((dateStr, mins) => {
    setPomodoroStats(prev => ({ ...prev, [dateStr]: (prev[dateStr] || 0) + mins }));
  }, []);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'home' },
    { id: 'todo', label: 'To-Do List', icon: 'todo' },
    { id: 'calendar', label: 'Calendar', icon: 'calendar' },
    { id: 'pdfs', label: 'PDF Manager', icon: 'pdf' },
    { id: 'pomodoro', label: 'Focus Timer', icon: 'timer' },
    { id: 'habits', label: 'Habits', icon: 'habit' },
    { id: 'exams', label: 'Exam Countdown', icon: 'exam' },
    { id: 'notes', label: 'Notes', icon: 'notes' },
  ];

  const renderPage = () => {
    switch (page) {
      case 'dashboard': return <Dashboard todos={todos} habits={habits} exams={exams} pomodoroStats={pomodoroStats} />;
      case 'todo': return <TodoList todos={todos} setTodos={setTodos} />;
      case 'calendar': return <Calendar todos={todos} setTodos={setTodos} />;
      case 'pdfs': return <PDFManager />;
      case 'pomodoro': return <PomodoroTimer onFocusUpdate={onFocusUpdate} />;
      case 'habits': return <HabitTracker />;
      case 'exams': return <ExamCountdown />;
      case 'notes': return <Notes />;
      default: return null;
    }
  };

  return (
    <div style={{ height: '100vh', width: '100vw', position: 'relative' }}>
      <GlobalStyles />

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        {/* Logo */}
        <div style={{ padding: '4px 8px 20px', borderBottom: '1px solid var(--border)', marginBottom: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div className="animate-glow" style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, var(--accent), var(--accent-2))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="star" size={18} style={{ color: 'white', fill: 'white' }} />
            </div>
            <div>
              <p style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 16, background: 'linear-gradient(135deg, var(--accent), var(--accent-2))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>StudyOS</p>
              <p style={{ fontSize: 10, color: 'var(--text-3)' }}>Your study companion</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1 }}>
          {navItems.map(item => (
            <div
              key={item.id}
              className={`nav-item ${page === item.id ? 'active' : ''}`}
              onClick={() => { setPage(item.id); setSidebarOpen(false); }}
            >
              <Icon name={item.icon} size={16} />
              {item.label}
            </div>
          ))}
        </nav>

        {/* Bottom */}
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 8px' }}>
            <span style={{ fontSize: 12, color: 'var(--text-3)' }}>{dark ? '🌙 Dark' : '☀️ Light'}</span>
            <button
              onClick={() => setDark(!dark)}
              style={{
                width: 44, height: 24, borderRadius: 12, border: 'none', cursor: 'pointer',
                background: dark ? 'linear-gradient(135deg, var(--accent), var(--accent-2))' : 'var(--border)',
                position: 'relative', transition: 'all 0.3s', flexShrink: 0,
              }}
            >
              <div style={{
                position: 'absolute', top: 3, left: dark ? 23 : 3, width: 18, height: 18,
                borderRadius: '50%', background: 'white', transition: 'left 0.3s',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10,
              }}>{dark ? '🌙' : '☀️'}</div>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile header bar */}
      <div className="mobile-menu-btn" style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200, background: 'var(--surface)', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--border)', padding: '12px 16px', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button className="btn btn-ghost" style={{ padding: '8px 10px' }} onClick={() => setSidebarOpen(!sidebarOpen)}>
            <Icon name="menu" size={18}/>
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg, var(--accent), var(--accent-2))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="star" size={13} style={{ color: 'white', fill: 'white' }} />
            </div>
            <span style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 15, background: 'linear-gradient(135deg, var(--accent), var(--accent-2))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>StudyOS</span>
          </div>
        </div>
        <button onClick={() => setDark(!dark)} style={{ width: 40, height: 22, borderRadius: 11, border: 'none', cursor: 'pointer', background: dark ? 'linear-gradient(135deg, var(--accent), var(--accent-2))' : 'var(--border)', position: 'relative', transition: 'all 0.3s', flexShrink: 0 }}>
          <div style={{ position: 'absolute', top: 2, left: dark ? 19 : 2, width: 18, height: 18, borderRadius: '50%', background: 'white', transition: 'left 0.3s', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10 }}>{dark ? '🌙' : '☀️'}</div>
        </button>
      </div>

      {/* Mobile overlay — sits above main content, below sidebar */}
      {sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 250, backdropFilter: 'blur(3px)' }} />
      )}

      {/* Main content */}
      <main className="main-content" style={{ position: 'relative', zIndex: 1 }}>
        {renderPage()}
      </main>

      {/* Mobile bottom nav bar */}
      <div className="mobile-menu-btn" style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 200,
        background: 'var(--surface)', backdropFilter: 'blur(24px) saturate(1.8)',
        WebkitBackdropFilter: 'blur(24px) saturate(1.8)',
        borderTop: '1px solid var(--border)', padding: '8px 4px 18px',
        justifyContent: 'space-around', alignItems: 'center',
      }}>
        {[
          { id: 'dashboard', icon: 'home',    label: 'Home'   },
          { id: 'todo',      icon: 'todo',    label: 'Tasks'  },
          { id: 'pomodoro',  icon: 'timer',   label: 'Focus'  },
          { id: 'notes',     icon: 'notes',   label: 'Notes'  },
          { id: 'habits',    icon: 'habit',   label: 'Habits' },
        ].map(item => (
          <button key={item.id} onClick={() => { setPage(item.id); setSidebarOpen(false); }} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
            background: 'none', border: 'none', cursor: 'pointer', padding: '4px 10px', borderRadius: 12,
            color: page === item.id ? 'var(--accent)' : 'var(--text-3)',
            transition: 'all 0.2s', minWidth: 52,
          }}>
            <div style={{
              width: 34, height: 34, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: page === item.id ? 'rgba(99,102,241,0.15)' : 'transparent',
              transition: 'all 0.2s',
              transform: page === item.id ? 'scale(1.1)' : 'scale(1)',
            }}>
              <Icon name={item.icon} size={18} />
            </div>
            <span style={{ fontSize: 10, fontWeight: page === item.id ? 700 : 400, letterSpacing: '0.01em' }}>{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
