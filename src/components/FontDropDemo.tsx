'use client';

import { useState, useEffect } from 'react';

type DemoState = 'idle' | 'clickBubble' | 'movingToText' | 'selecting' | 'captured' | 'searching' | 'verifying' | 'found';

export default function FontDropDemo() {
  const [state, setState] = useState<DemoState>('idle');
  const [showResult, setShowResult] = useState(false);
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];
    const run = () => {
      setState('idle');
      setShowResult(false);
      timers.push(setTimeout(() => setState('clickBubble'), 1200));
      timers.push(setTimeout(() => setState('movingToText'), 2400));
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
  const txt: Record<DemoState, string> = { idle: 'Fd', clickBubble: '📷', movingToText: 'Select\nthe font', selecting: 'Select\nthe font', captured: 'Drop it!', searching: 'Searching', verifying: 'Verifying', found: 'Found!' };
  const brd: Record<DemoState, string> = { idle: '#1ed760', clickBubble: '#1ed760', movingToText: '#1ed760', selecting: '#1ed760', captured: '#1ed760', searching: '#F59E0B', verifying: '#F59E0B', found: '#1ed760' };
  const bg: Record<DemoState, string> = { idle: 'rgba(30,30,30,0.95)', clickBubble: 'rgba(30,50,30,0.95)', movingToText: 'rgba(30,50,30,0.95)', selecting: 'rgba(30,50,30,0.95)', captured: 'rgba(30,50,30,0.95)', searching: 'rgba(40,35,20,0.95)', verifying: 'rgba(40,35,20,0.95)', found: 'rgba(20,40,20,0.95)' };

  const isSelecting = state === 'selecting';
  const isCaptured = state === 'captured' || state === 'searching' || state === 'verifying' || state === 'found';
  const bt = txt[state];
  const bc = brd[state];

  // Cursor phases
  let cursorClass = '';
  if (state === 'idle') cursorClass = 'phase-idle';
  else if (state === 'clickBubble') cursorClass = 'phase-click';
  else if (state === 'movingToText') cursorClass = 'phase-move';
  else if (state === 'selecting') cursorClass = 'phase-select';
  else cursorClass = 'phase-hide';

  // Bubble pulse on click
  const bubbleClicked = state === 'clickBubble';

  return (
    <div className="fd-wrap">
      <style>{`
        .fd-wrap { max-width: 720px; margin: 0 auto; }

        /* ── Window ── */
        .fd-win {
          background: #1a1a1a;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.06);
          position: relative;
        }

        .fd-bar {
          display: flex;
          align-items: center;
          padding: 12px 16px;
          background: #2a2a2a;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          gap: 8px;
        }

        .fd-dots { display: flex; gap: 6px; margin-right: 12px; }
        .fd-d { width: 10px; height: 10px; border-radius: 50%; }
        .fd-dr { background: #ff5f57; }
        .fd-dy { background: #febc2e; }
        .fd-dg { background: #28c840; }

        .fd-nav { display: flex; gap: 4px; margin-right: 8px; }
        .fd-nb { width: 22px; height: 22px; border-radius: 4px; background: rgba(255,255,255,0.05); display: flex; align-items: center; justify-content: center; color: #555; font-size: 13px; }

        .fd-url {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 6px;
          background: #1a1a1a;
          border-radius: 6px;
          padding: 5px 12px;
          font-size: 11px;
          color: #666;
          border: 1px solid rgba(255,255,255,0.08);
        }
        .fd-url .lk { color: #1ed760; font-size: 10px; }
        .fd-url span { color: #aaa; }

        /* ── Content area ── */
        .fd-body {
          position: relative;
          min-height: 340px;
          background: radial-gradient(circle at 20% 50%, rgba(30,215,96,0.03) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(99,102,241,0.02) 0%, transparent 50%), #111;
          padding: 24px;
        }

        /* ── Poster (centered) ── */
        .fd-poster {
          width: 260px;
          height: 260px;
          background: linear-gradient(145deg, #0f1923, #1a2a3a);
          border-radius: 12px;
          overflow: hidden;
          position: relative;
          box-shadow: 0 4px 20px rgba(0,0,0,0.4);
          border: 1px solid rgba(255,255,255,0.06);
          margin: 0 auto;
        }

        .fd-poster-bg {
          position: absolute; inset: 0;
          background: radial-gradient(circle at 30% 20%, rgba(30,215,96,0.08) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(99,102,241,0.06) 0%, transparent 50%);
        }

        .fd-pc {
          position: relative;
          padding: 20px 18px;
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .fd-pb { font-size: 7px; letter-spacing: 1.5px; text-transform: uppercase; color: rgba(255,255,255,0.3); font-weight: 600; margin-bottom: 14px; }
        .fd-ps { font-size: 10px; color: rgba(255,255,255,0.45); margin-bottom: 4px; font-weight: 500; }

        .fd-ph {
          font-family: 'Georgia', serif;
          font-size: 28px;
          font-weight: 700;
          color: #fff;
          line-height: 1.15;
          margin-bottom: 8px;
          position: relative;
        }

        .fd-psub { font-size: 9px; color: rgba(255,255,255,0.35); line-height: 1.5; margin-bottom: auto; }
        .fd-pcta { font-size: 9px; font-weight: 600; color: #1ed760; margin-top: 10px; }
        .fd-pf { display: flex; justify-content: space-between; align-items: center; margin-top: 8px; padding-top: 8px; border-top: 1px solid rgba(255,255,255,0.05); }
        .fd-pl { font-size: 9px; font-weight: 800; color: rgba(255,255,255,0.5); letter-spacing: 1px; }
        .fd-pds { display: flex; gap: 3px; }
        .fd-pds i { width: 3px; height: 3px; border-radius: 50%; background: rgba(255,255,255,0.15); display: block; }
        .fd-pds i:first-child { background: #1ed760; }

        /* ── Selection ── */
        .fd-sel {
          position: absolute;
          top: -4px; left: -6px; right: -6px; bottom: -4px;
          border: 2px solid #1ed760;
          border-radius: 4px;
          background: rgba(30,215,96,0.08);
          opacity: 0;
          transform: scaleX(0);
          transform-origin: left;
          transition: opacity 0.3s, transform 0.5s cubic-bezier(0.4,0,0.2,1);
          pointer-events: none;
          z-index: 5;
        }
        .fd-sel.on { opacity: 1; transform: scaleX(1); }
        .fd-sel.done { opacity: 0; transform: scaleX(0.8) translateX(40px); transition: opacity 0.4s, transform 0.5s; }
        .fd-sel-h { position: absolute; inset: -4px; }
        .fd-sel-h::before, .fd-sel-h::after { content:''; position: absolute; width: 7px; height: 7px; border-radius: 50%; background: #1ed760; box-shadow: 0 0 5px rgba(30,215,96,0.5); }
        .fd-sel-h::before { top: -3px; left: -3px; }
        .fd-sel-h::after { bottom: -3px; right: -3px; }
        .fd-sel-l { position: absolute; top: -18px; right: 0; font-size: 7px; color: #1ed760; font-weight: 600; background: rgba(30,215,96,0.15); padding: 1px 5px; border-radius: 3px; }

        /* ── Flash ── */
        .fd-fl { position: absolute; inset: 0; background: rgba(30,215,96,0.15); border-radius: 12px; opacity: 0; z-index: 6; pointer-events: none; }
        .fd-fl.on { animation: fd-flash 0.4s ease-out; }
        @keyframes fd-flash { 0% { opacity: 0.6; } 100% { opacity: 0; } }

        /* ── Cursor (in window body) ── */
        .fd-cur {
          position: absolute;
          width: 20px;
          height: 20px;
          z-index: 20;
          pointer-events: none;
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.6));
          opacity: 0;
        }

        .fd-cur.phase-idle {
          bottom: 20px; right: 60px;
          opacity: 0;
          animation: fd-c-appear 0.6s 0.4s ease forwards;
        }
        @keyframes fd-c-appear {
          0% { opacity: 0; transform: translate(20px, 10px); }
          100% { opacity: 1; transform: translate(0, 0); }
        }

        .fd-cur.phase-click {
          bottom: 20px; right: 60px;
          opacity: 1;
          animation: fd-c-click 0.5s ease forwards;
        }
        @keyframes fd-c-click {
          0% { transform: scale(1); }
          30% { transform: scale(0.85); }
          60% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }

        .fd-cur.phase-move {
          opacity: 1;
          animation: fd-c-move 1.2s ease-in-out forwards;
        }
        @keyframes fd-c-move {
          0% { bottom: 20px; right: 60px; }
          100% { top: 105px; left: 80px; bottom: auto; right: auto; }
        }

        .fd-cur.phase-select {
          opacity: 1;
          top: 105px;
          animation: fd-c-sel 1.3s ease-in-out forwards;
        }
        @keyframes fd-c-sel {
          0% { left: 80px; }
          100% { left: 340px; }
        }

        .fd-cur.phase-hide {
          opacity: 0;
          transition: opacity 0.3s;
        }

        /* ── Bubble (bottom right) ── */
        .fd-bub {
          position: absolute;
          bottom: 16px;
          right: 20px;
          width: 72px;
          height: 72px;
          z-index: 10;
        }

        .fd-bub-glow {
          position: absolute;
          inset: -14px;
          border-radius: 50%;
          pointer-events: none;
          transition: box-shadow 0.4s;
        }

        .fd-bub-spin {
          position: absolute;
          inset: -8px;
          border-radius: 50%;
          opacity: 0;
          transition: opacity 0.3s;
        }
        .fd-bub-spin.on { opacity: 1; animation: fd-spin 1.2s linear infinite; }
        .fd-bub-spin::before {
          content: '';
          position: absolute; inset: 0;
          border-radius: 50%;
          border: 3px solid transparent;
          border-top-color: #F59E0B;
          border-right-color: rgba(245,158,11,0.3);
          filter: drop-shadow(0 0 4px rgba(245,158,11,0.25));
        }
        @keyframes fd-spin { to { transform: rotate(360deg); } }

        .fd-bub-circle {
          width: 72px; height: 72px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          transition: background 0.4s, border-color 0.4s, box-shadow 0.4s;
          z-index: 2;
        }

        .fd-bub-circle.pulse {
          animation: fd-bub-pulse 0.4s ease;
        }
        @keyframes fd-bub-pulse {
          0% { transform: scale(1); }
          40% { transform: scale(0.9); }
          100% { transform: scale(1); }
        }

        .fd-bub-txt {
          font-family: -apple-system, BlinkMacSystemFont, sans-serif;
          font-weight: 800;
          text-align: center;
          line-height: 1.15;
          user-select: none;
          transition: color 0.4s, font-size 0.3s;
        }

        /* ── Result card (left of bubble) ── */
        .fd-res {
          position: absolute;
          bottom: 10px;
          right: 104px;
          background: #fff;
          border-radius: 16px;
          padding: 14px;
          width: 185px;
          box-shadow: 0 6px 24px rgba(0,0,0,0.3);
          opacity: 0;
          transform: translateX(14px) scale(0.95);
          transition: opacity 0.4s ease, transform 0.4s ease;
          color: #1a1a1a;
          z-index: 15;
        }
        .fd-res.vis { opacity: 1; transform: translateX(0) scale(1); }

        .fd-res-x { width: 18px; height: 18px; border-radius: 50%; background: #f3f4f6; border: 1px solid #e5e7eb; display: flex; align-items: center; justify-content: center; font-size: 9px; color: #9ca3af; margin-left: auto; margin-bottom: 5px; }
        .fd-res-l { font-size: 7px; font-weight: 600; letter-spacing: 1.5px; color: #9ca3af; text-transform: uppercase; margin-bottom: 2px; }
        .fd-res-f { font-size: 20px; font-weight: 800; color: #1a1a1a; line-height: 1.1; margin-bottom: 3px; font-family: 'Georgia', serif; }
        .fd-res-m { display: flex; align-items: center; gap: 6px; font-size: 9px; color: #6b7280; margin-bottom: 3px; }
        .fd-bdg { padding: 1px 5px; border-radius: 4px; font-size: 7px; font-weight: 700; letter-spacing: 0.5px; }
        .fd-bdg-p { background: #fef3c7; color: #d97706; }
        .fd-buy { display: block; width: 100%; padding: 5px; background: #F59E0B; color: #fff; border: none; border-radius: 7px; font-size: 10px; font-weight: 700; text-align: center; margin: 6px 0; }
        .fd-cld { font-size: 8px; color: #6b7280; font-style: italic; margin-bottom: 5px; }
        .fd-div { height: 2px; background: linear-gradient(90deg, #1ed760, #6ee7b7); border-radius: 2px; margin: 6px 0; }
        .fd-ah { font-size: 7px; font-weight: 600; letter-spacing: 1.5px; color: #9ca3af; text-transform: uppercase; margin-bottom: 4px; }
        .fd-ai { display: flex; align-items: center; justify-content: space-between; background: #f9fafb; border: 1px solid #f3f4f6; border-radius: 7px; padding: 5px 7px; margin-bottom: 3px; }
        .fd-an { font-size: 10px; font-weight: 700; color: #1a1a1a; }
        .fd-as { font-size: 7px; color: #9ca3af; }
        .fd-ag { background: #1ed760; color: #fff; border: none; border-radius: 5px; padding: 3px 8px; font-size: 9px; font-weight: 700; }

        /* ── Dock ── */
        .fd-dock {
          display: flex; align-items: center; justify-content: center;
          padding: 6px 16px; background: #1a1a1a; border-top: 1px solid rgba(255,255,255,0.06); gap: 16px;
        }
        .fd-di { display: flex; flex-direction: column; align-items: center; gap: 1px; }
        .fd-dic { width: 28px; height: 28px; border-radius: 6px; background: rgba(255,255,255,0.06); display: flex; align-items: center; justify-content: center; font-size: 13px; }
        .fd-dic.act { background: rgba(30,215,96,0.15); box-shadow: 0 2px 8px rgba(30,215,96,0.2); font-size: 11px; font-weight: 800; color: #1ed760; }
        .fd-did { width: 3px; height: 3px; border-radius: 50%; background: #1ed760; margin-top: 2px; }

        @media (max-width: 700px) {
          .fd-poster { width: 220px; height: 240px; }
          .fd-res { width: 170px; right: 96px; }
          .fd-bub { width: 60px; height: 60px; }
          .fd-bub-circle { width: 60px; height: 60px; }
        }
      `}</style>

      <div className="fd-win">
        {/* Title bar */}
        <div className="fd-bar">
          <div className="fd-dots"><div className="fd-d fd-dr" /><div className="fd-d fd-dy" /><div className="fd-d fd-dg" /></div>
          <div className="fd-nav"><div className="fd-nb">‹</div><div className="fd-nb">›</div></div>
          <div className="fd-url"><span className="lk">🔒</span><span>dribbble.com</span>/shots/brand-identity</div>
        </div>

        {/* Body */}
        <div className="fd-body">
          {/* Poster */}
          <div className="fd-poster">
            <div className="fd-poster-bg" />
            <div className="fd-pc">
              <div className="fd-pb">brand studio · 2026</div>
              <div className="fd-ps">Introducing</div>
              <div className="fd-ph">
                The Art of<br />Typography
                <div className={`fd-sel ${isSelecting ? 'on' : ''} ${isCaptured ? 'done' : ''}`}>
                  <div className="fd-sel-h" />
                  <div className="fd-sel-l">⌘⇧F</div>
                </div>
              </div>
              <div className="fd-psub">Discover the perfect typeface for every project.</div>
              <div className="fd-pcta">Explore Collection →</div>
              <div className="fd-pf">
                <div className="fd-pl">STUDIO</div>
                <div className="fd-pds"><i /><i /><i /></div>
              </div>
            </div>
            <div className={`fd-fl ${isCaptured ? 'on' : ''}`} />
          </div>

          {/* Cursor */}
          <svg className={`fd-cur ${cursorClass}`} viewBox="0 0 24 24" fill="white" stroke="black" strokeWidth="1">
            <path d="M5 3l3.6 16.5L12 13l6.4 2.5L5 3z" />
          </svg>

          {/* Bubble */}
          <div className="fd-bub">
            <div className="fd-bub-glow" style={{ boxShadow: `0 0 20px ${bc}44, 0 0 40px ${bc}22` }} />
            <div className={`fd-bub-spin ${isSpinning ? 'on' : ''}`} />
            <div className={`fd-bub-circle ${bubbleClicked ? 'pulse' : ''}`} style={{ background: bg[state], border: `3px solid ${isSpinning ? bc + '40' : bc}`, boxShadow: state === 'found' ? `0 0 14px ${bc}66` : 'none' }}>
              <span className="fd-bub-txt" style={{ color: bc, fontSize: bt.length <= 3 ? '20px' : bt.length <= 9 ? '10px' : '9px', whiteSpace: 'pre-line' }}>{bt}</span>
            </div>
          </div>

          {/* Result (left of bubble) */}
          <div className={`fd-res ${showResult ? 'vis' : ''}`}>
            <div className="fd-res-x">✕</div>
            <div className="fd-res-l">DETECTED FONT</div>
            <div className="fd-res-f">Georgia</div>
            <div className="fd-res-m">Confidence: high <span className="fd-bdg fd-bdg-p">PAID</span></div>
            <div style={{ fontSize: '9px', color: '#9ca3af' }}>serif</div>
            <div className="fd-buy">🛒 BUY</div>
            <div className="fd-cld">Could also be  Playfair Display</div>
            <div className="fd-div" />
            <div className="fd-ah">FREE ALTERNATIVES</div>
            {[{ n: 'Lora', s: '93%' }, { n: 'Merriweather', s: '89%' }, { n: 'Libre Baskerville', s: '85%' }].map(a => (
              <div className="fd-ai" key={a.n}><div><div className="fd-an">{a.n}</div><div className="fd-as">Google Fonts · {a.s}</div></div><div className="fd-ag">GET</div></div>
            ))}
          </div>
        </div>

        {/* Dock */}
        <div className="fd-dock">
          <div className="fd-di"><div className="fd-dic">🔍</div></div>
          <div className="fd-di"><div className="fd-dic">📁</div></div>
          <div className="fd-di"><div className="fd-dic">🌐</div></div>
          <div className="fd-di"><div className="fd-dic">✉️</div></div>
          <div className="fd-di"><div className="fd-dic act">Fd</div><div className="fd-did" /></div>
          <div className="fd-di"><div className="fd-dic">⚙️</div></div>
        </div>
      </div>
    </div>
  );
}
