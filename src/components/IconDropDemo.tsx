'use client';

import { useState, useEffect } from 'react';

type DemoState = 'idle' | 'clickBubble' | 'movingToIcon' | 'selecting' | 'captured' | 'searching' | 'verifying' | 'found';

export default function IconDropDemo() {
  const [state, setState] = useState<DemoState>('idle');
  const [showResult, setShowResult] = useState(false);
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];
    const run = () => {
      setState('idle');
      setShowResult(false);
      timers.push(setTimeout(() => setState('clickBubble'), 1200));
      timers.push(setTimeout(() => setState('movingToIcon'), 2400));
      timers.push(setTimeout(() => setState('selecting'), 3800));
      timers.push(setTimeout(() => setState('captured'), 5300));
      timers.push(setTimeout(() => setState('searching'), 6200));
      timers.push(setTimeout(() => setState('verifying'), 8500));
      timers.push(setTimeout(() => { setState('found'); setShowResult(true); }, 10500));
      timers.push(setTimeout(() => { setShowResult(false); setState('idle'); setCycle(c => c + 1); }, 16000));
    };
    run();
    return () => timers.forEach(clearTimeout);
  }, [cycle]);

  const isSpinning = state === 'searching' || state === 'verifying';
  const txt: Record<DemoState, string> = {
    idle: 'Id',
    clickBubble: '📷',
    movingToIcon: 'Select\nthe icon',
    selecting: 'Select\nthe icon',
    captured: 'Got it!',
    searching: 'Searching',
    verifying: 'Matching',
    found: 'Found!'
  };
  const brd: Record<DemoState, string> = {
    idle: '#6C63FF', clickBubble: '#6C63FF', movingToIcon: '#6C63FF',
    selecting: '#6C63FF', captured: '#6C63FF', searching: '#a78bfa',
    verifying: '#a78bfa', found: '#6C63FF'
  };
  const bg: Record<DemoState, string> = {
    idle: 'rgba(20,18,40,0.95)', clickBubble: 'rgba(30,25,60,0.95)',
    movingToIcon: 'rgba(30,25,60,0.95)', selecting: 'rgba(30,25,60,0.95)',
    captured: 'rgba(30,25,60,0.95)', searching: 'rgba(35,28,65,0.95)',
    verifying: 'rgba(35,28,65,0.95)', found: 'rgba(20,18,50,0.95)'
  };

  const isSelecting = state === 'selecting';
  const isCaptured = ['captured','searching','verifying','found'].includes(state);
  const bt = txt[state];
  const bc = brd[state];
  const bubbleClicked = state === 'clickBubble';

  let cursorClass = '';
  if (state === 'idle') cursorClass = 'phase-idle';
  else if (state === 'clickBubble') cursorClass = 'phase-click';
  else if (state === 'movingToIcon') cursorClass = 'phase-move';
  else if (state === 'selecting') cursorClass = 'phase-select';
  else cursorClass = 'phase-hide';

  return (
    <div className="id-wrap">
      <style>{`
        .id-wrap { max-width: 720px; margin: 0 auto; }

        .id-win {
          background: #f5f5f7;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(108,99,255,0.2), 0 0 0 1px rgba(108,99,255,0.1);
          position: relative;
        }

        .id-bar {
          display: flex; align-items: center; padding: 12px 16px;
          background: #ececec; border-bottom: 1px solid rgba(0,0,0,0.08); gap: 8px;
        }
        .id-dots { display: flex; gap: 6px; margin-right: 12px; }
        .id-d { width: 10px; height: 10px; border-radius: 50%; }
        .id-dr { background: #ff5f57; } .id-dy { background: #febc2e; } .id-dg { background: #28c840; }
        .id-nav { display: flex; gap: 4px; margin-right: 8px; }
        .id-nb { width: 22px; height: 22px; border-radius: 4px; background: rgba(0,0,0,0.06); display: flex; align-items: center; justify-content: center; color: #999; font-size: 13px; }
        .id-url {
          flex: 1; display: flex; align-items: center; gap: 6px;
          background: #fff; border-radius: 6px; padding: 5px 12px;
          font-size: 11px; color: #888; border: 1px solid rgba(0,0,0,0.08);
        }
        .id-url .lk { color: #6C63FF; font-size: 10px; }
        .id-url span { color: #555; }

        .id-body {
          position: relative; min-height: 340px;
          background: radial-gradient(circle at 20% 50%, rgba(108,99,255,0.04) 0%, transparent 50%),
                      radial-gradient(circle at 80% 50%, rgba(167,139,250,0.03) 0%, transparent 50%), #fff;
          padding: 24px;
        }

        /* Figma-like design canvas */
        .id-canvas {
          width: 280px; height: 280px;
          background: #fafafa;
          border-radius: 8px;
          border: 1px solid #e5e5e5;
          position: relative;
          margin: 0 auto;
          box-shadow: 0 2px 12px rgba(0,0,0,0.06);
          overflow: hidden;
        }
        .id-canvas-grid {
          position: absolute; inset: 0;
          background-image: linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px);
          background-size: 20px 20px;
        }
        .id-canvas-label {
          position: absolute; top: 8px; left: 10px;
          font-size: 8px; color: #999; font-weight: 600; letter-spacing: 1px;
        }

        /* Icon cards on canvas */
        .id-icons-grid {
          position: absolute; top: 28px; left: 12px; right: 12px;
          display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px;
        }
        .id-ic {
          width: 52px; height: 52px; background: #f0eeff;
          border-radius: 10px; display: flex; align-items: center; justify-content: center;
          border: 1px solid #e0dbff; transition: all 0.2s;
        }
        .id-ic.highlight { background: #e8e4ff; border-color: #6C63FF; box-shadow: 0 0 0 2px rgba(108,99,255,0.2); }
        .id-ic svg { width: 24px; height: 24px; }

        /* Selection box */
        .id-sel {
          position: absolute; top: 26px; left: 14px; width: 56px; height: 56px;
          border: 2px solid #6C63FF; border-radius: 6px;
          background: rgba(108,99,255,0.08);
          opacity: 0; transform: scale(0.8);
          transition: opacity 0.3s, transform 0.4s cubic-bezier(0.34,1.56,.64,1);
          pointer-events: none; z-index: 5;
        }
        .id-sel.on { opacity: 1; transform: scale(1); }
        .id-sel.done { opacity: 0; transform: scale(0.8) translateY(-10px); transition: opacity 0.3s, transform 0.4s; }
        .id-sel::before, .id-sel::after {
          content: ''; position: absolute; width: 6px; height: 6px;
          border-radius: 50%; background: #6C63FF;
        }
        .id-sel::before { top: -3px; left: -3px; }
        .id-sel::after { bottom: -3px; right: -3px; }

        /* Flash */
        .id-fl { position: absolute; inset: 0; background: rgba(108,99,255,0.12); border-radius: 8px; opacity: 0; z-index: 6; pointer-events: none; }
        .id-fl.on { animation: id-flash 0.4s ease-out; }
        @keyframes id-flash { 0% { opacity: 0.5; } 100% { opacity: 0; } }

        /* Cursor */
        .id-cur {
          position: absolute; width: 20px; height: 20px; z-index: 20;
          pointer-events: none; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3)); opacity: 0;
        }
        .id-cur.phase-idle { bottom: 28px; right: 28px; opacity: 0; animation: id-c-appear 0.6s 0.4s ease forwards; }
        @keyframes id-c-appear { 0% { opacity: 0; } 100% { opacity: 1; } }
        .id-cur.phase-click { bottom: 28px; right: 28px; opacity: 1; animation: id-c-click 0.5s ease forwards; }
        @keyframes id-c-click { 0% { transform: scale(1); } 30% { transform: scale(0.85); } 60% { transform: scale(1.05); } 100% { transform: scale(1); } }
        .id-cur.phase-move { opacity: 1; animation: id-c-move 1.2s ease-in-out forwards; }
        @keyframes id-c-move { 0% { bottom: 28px; right: 28px; top: auto; left: auto; } 100% { bottom: auto; right: auto; top: 88px; left: 108px; } }
        .id-cur.phase-select { opacity: 1; top: 88px; left: 108px; animation: id-c-sel 1.3s ease-in-out forwards; }
        @keyframes id-c-sel { 0% { top: 88px; left: 108px; } 100% { top: 148px; left: 168px; } }
        .id-cur.phase-hide { opacity: 0; transition: opacity 0.3s; }

        /* Bubble */
        .id-bub { position: absolute; bottom: 16px; right: 20px; width: 72px; height: 72px; z-index: 10; }
        .id-bub-glow { position: absolute; inset: -14px; border-radius: 50%; pointer-events: none; transition: box-shadow 0.4s; }
        .id-bub-spin { position: absolute; inset: -8px; border-radius: 50%; opacity: 0; transition: opacity 0.3s; }
        .id-bub-spin.on { opacity: 1; animation: id-spin 1.2s linear infinite; }
        .id-bub-spin::before {
          content: ''; position: absolute; inset: 0; border-radius: 50%;
          border: 3px solid transparent;
          border-top-color: #a78bfa; border-right-color: rgba(167,139,250,0.3);
          filter: drop-shadow(0 0 4px rgba(167,139,250,0.3));
        }
        @keyframes id-spin { to { transform: rotate(360deg); } }
        .id-bub-circle {
          width: 72px; height: 72px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          position: relative; transition: background 0.4s, border-color 0.4s, box-shadow 0.4s; z-index: 2;
        }
        .id-bub-circle.pulse { animation: id-bub-pulse 0.4s ease; }
        @keyframes id-bub-pulse { 0% { transform: scale(1); } 40% { transform: scale(0.9); } 100% { transform: scale(1); } }
        .id-bub-txt {
          font-family: -apple-system, BlinkMacSystemFont, sans-serif;
          font-weight: 800; text-align: center; line-height: 1.15;
          user-select: none; transition: color 0.4s, font-size 0.3s;
        }

        /* Result card */
        .id-res {
          position: absolute; bottom: 10px; right: 104px;
          background: #fff; border-radius: 16px; padding: 14px; width: 195px;
          box-shadow: 0 6px 32px rgba(108,99,255,0.15), 0 0 0 1px rgba(108,99,255,0.08);
          opacity: 0; transform: translateX(14px) scale(0.95);
          transition: opacity 0.4s ease, transform 0.4s ease;
          color: #1a1a1a; z-index: 15;
        }
        .id-res.vis { opacity: 1; transform: translateX(0) scale(1); }

        .id-res-top { display: flex; align-items: flex-start; gap: 10px; margin-bottom: 10px; }
        .id-res-preview {
          width: 44px; height: 44px; background: #f0eeff; border-radius: 10px;
          border: 1px solid #d4d0ff; display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .id-res-l { font-size: 7px; font-weight: 700; letter-spacing: 1.5px; color: #9ca3af; text-transform: uppercase; margin-bottom: 2px; }
        .id-res-name { font-size: 16px; font-weight: 800; color: #1a1a1a; line-height: 1.1; margin-bottom: 4px; }
        .id-res-badges { display: flex; gap: 4px; }
        .id-bdg { padding: 2px 7px; border-radius: 20px; font-size: 8px; font-weight: 600; background: #f0eeff; color: #6C63FF; border: 1px solid #d4d0ff; }

        .id-btns { display: flex; gap: 6px; margin-bottom: 6px; }
        .id-btn-main { flex: 1; padding: 7px; border-radius: 8px; background: #6C63FF; color: #fff; border: none; font-size: 9px; font-weight: 800; letter-spacing: 0.5px; cursor: pointer; }
        .id-btn-sec { flex: 1; padding: 7px; border-radius: 8px; background: transparent; color: #6C63FF; border: 1.5px solid #6C63FF; font-size: 9px; font-weight: 700; cursor: pointer; }
        .id-btns-sm { display: flex; gap: 4px; margin-bottom: 8px; }
        .id-btn-code { flex: 1; padding: 5px; border-radius: 6px; background: #f5f5f7; color: #666; border: none; font-size: 8px; font-weight: 600; cursor: pointer; }

        .id-div { height: 1px; background: #f0eeff; margin: 6px 0; }
        .id-matches-h { font-size: 7px; font-weight: 700; letter-spacing: 1.5px; color: #9ca3af; text-transform: uppercase; margin-bottom: 5px; }
        .id-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 3px; }
        .id-mc { width: 100%; aspect-ratio: 1; background: #f5f5f7; border-radius: 6px; display: flex; align-items: center; justify-content: center; }
        .id-mc:first-child { background: #f0eeff; border: 1px solid #d4d0ff; }
        .id-mc svg { width: 16px; height: 16px; }
      `}</style>

      <div className="id-win">
        {/* Title bar */}
        <div className="id-bar">
          <div className="id-dots"><div className="id-d id-dr"/><div className="id-d id-dy"/><div className="id-d id-dg"/></div>
          <div className="id-nav"><div className="id-nb">‹</div><div className="id-nb">›</div></div>
          <div className="id-url"><span className="lk">🔒</span><span>figma.com</span>/design/dashboard-ui</div>
        </div>

        {/* Body */}
        <div className="id-body">
          {/* Figma canvas */}
          <div className="id-canvas">
            <div className="id-canvas-grid"/>
            <div className="id-canvas-label">UI Components / Icons</div>
            <div className="id-icons-grid">
              {[
                // home
                <svg key="home" viewBox="0 0 24 24" fill="none" stroke="#6C63FF" strokeWidth="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
                // search
                <svg key="search" viewBox="0 0 24 24" fill="none" stroke="#6C63FF" strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
                // settings
                <svg key="settings" viewBox="0 0 24 24" fill="none" stroke="#6C63FF" strokeWidth="1.5"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>,
                // user
                <svg key="user" viewBox="0 0 24 24" fill="none" stroke="#6C63FF" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
                // bell
                <svg key="bell" viewBox="0 0 24 24" fill="none" stroke="#6C63FF" strokeWidth="1.5"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>,
                // heart
                <svg key="heart" viewBox="0 0 24 24" fill="none" stroke="#6C63FF" strokeWidth="1.5"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>,
                // mail
                <svg key="mail" viewBox="0 0 24 24" fill="none" stroke="#6C63FF" strokeWidth="1.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
                // calendar
                <svg key="cal" viewBox="0 0 24 24" fill="none" stroke="#6C63FF" strokeWidth="1.5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
              ].map((icon, i) => (
                <div key={i} className={`id-ic ${isSelecting && i === 0 ? 'highlight' : ''}`}>{icon}</div>
              ))}
            </div>
            <div className={`id-sel ${isSelecting ? 'on' : ''} ${isCaptured ? 'done' : ''}`}/>
            <div className={`id-fl ${isCaptured ? 'on' : ''}`}/>
          </div>

          {/* Cursor */}
          <svg className={`id-cur ${cursorClass}`} viewBox="0 0 24 24" fill="#333" stroke="white" strokeWidth="0.8">
            <path d="M5 3l3.6 16.5L12 13l6.4 2.5L5 3z" />
          </svg>

          {/* Bubble */}
          <div className="id-bub">
            <div className="id-bub-glow" style={{ boxShadow: `0 0 20px ${bc}44, 0 0 40px ${bc}22` }}/>
            <div className={`id-bub-spin ${isSpinning ? 'on' : ''}`}/>
            <div className={`id-bub-circle ${bubbleClicked ? 'pulse' : ''}`} style={{
              background: bg[state],
              border: `3px solid ${isSpinning ? bc + '60' : bc}`,
              boxShadow: state === 'found' ? `0 0 14px ${bc}66` : 'none'
            }}>
              <span className="id-bub-txt" style={{
                color: bc,
                fontSize: bt.length <= 3 ? '20px' : bt.length <= 9 ? '10px' : '9px',
                whiteSpace: 'pre-line'
              }}>{bt}</span>
            </div>
          </div>

          {/* Result card */}
          <div className={`id-res ${showResult ? 'vis' : ''}`}>
            <div className="id-res-top">
              <div className="id-res-preview">
                <svg viewBox="0 0 24 24" fill="none" stroke="#6C63FF" strokeWidth="1.5" width="26" height="26">
                  <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
                  <polyline points="9 22 9 12 15 12 15 22"/>
                </svg>
              </div>
              <div>
                <div className="id-res-l">DETECTED ICON</div>
                <div className="id-res-name">Home</div>
                <div className="id-res-badges">
                  <span className="id-bdg">Lucide</span>
                  <span className="id-bdg">outline</span>
                </div>
              </div>
            </div>
            <div className="id-btns">
              <button className="id-btn-main">COPY SVG</button>
              <button className="id-btn-sec">OPEN PACK ↗</button>
            </div>
            <div className="id-btns-sm">
              <button className="id-btn-code">&lt;/&gt; COPY REACT</button>
              <button className="id-btn-code">&lt;/&gt; COPY HTML</button>
            </div>
            <div className="id-div"/>
            <div className="id-matches-h">Matches (24)</div>
            <div className="id-grid">
              {[0,1,2,3,4,5,6,7].map(i => (
                <div key={i} className="id-mc">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#6C63FF" strokeWidth="1.5" width="16" height="16">
                    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
                  </svg>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Dock */}
        <div className="id-dock">
          <style>{`.id-dock{display:flex;align-items:center;justify-content:center;padding:6px 16px;background:#f5f5f7;border-top:1px solid rgba(0,0,0,0.06);gap:16px}.id-di{display:flex;flex-direction:column;align-items:center;gap:1px}.id-dic{width:28px;height:28px;border-radius:6px;background:rgba(0,0,0,0.04);display:flex;align-items:center;justify-content:center;font-size:13px}.id-dic.act{background:rgba(108,99,255,0.12);box-shadow:0 2px 8px rgba(108,99,255,0.2);font-size:11px;font-weight:800;color:#6C63FF}.id-did{width:3px;height:3px;border-radius:50%;background:#6C63FF;margin-top:2px}`}</style>
          <div className="id-di"><div className="id-dic">🔍</div></div>
          <div className="id-di"><div className="id-dic">📁</div></div>
          <div className="id-di"><div className="id-dic">🌐</div></div>
          <div className="id-di"><div className="id-dic">✉️</div></div>
          <div className="id-di"><div className="id-dic act">Id</div><div className="id-did"/></div>
          <div className="id-di"><div className="id-dic">⚙️</div></div>
        </div>
      </div>
    </div>
  );
}
