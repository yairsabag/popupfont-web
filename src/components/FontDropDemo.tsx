'use client';

import { useState, useEffect } from 'react';

type DemoState = 'idle' | 'selecting' | 'captured' | 'searching' | 'verifying' | 'found';

export default function FontDropDemo() {
  const [state, setState] = useState<DemoState>('idle');
  const [showResult, setShowResult] = useState(false);
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];
    const run = () => {
      setState('idle');
      setShowResult(false);

      timers.push(setTimeout(() => setState('selecting'), 1800));
      timers.push(setTimeout(() => setState('captured'), 3500));
      timers.push(setTimeout(() => setState('searching'), 4500));
      timers.push(setTimeout(() => setState('verifying'), 7000));
      timers.push(setTimeout(() => {
        setState('found');
        setShowResult(true);
      }, 9000));
      timers.push(setTimeout(() => {
        setShowResult(false);
        setState('idle');
        setCycle(c => c + 1);
      }, 15000));
    };

    run();
    return () => timers.forEach(clearTimeout);
  }, [cycle]);

  const isSpinning = state === 'searching' || state === 'verifying';
  const bubbleText = {
    idle: 'Fd',
    selecting: 'Fd',
    captured: 'Drop it!',
    searching: 'Searching',
    verifying: 'Verifying',
    found: 'Found!',
  }[state];

  const borderColor = {
    idle: '#1ed760',
    selecting: '#1ed760',
    captured: '#1ed760',
    searching: '#F59E0B',
    verifying: '#F59E0B',
    found: '#1ed760',
  }[state];

  const bgColor = {
    idle: 'rgba(30,30,30,0.95)',
    selecting: 'rgba(30,30,30,0.95)',
    captured: 'rgba(30,50,30,0.95)',
    searching: 'rgba(40,35,20,0.95)',
    verifying: 'rgba(40,35,20,0.95)',
    found: 'rgba(20,40,20,0.95)',
  }[state];

  const isSelecting = state === 'selecting';
  const isCaptured = state === 'captured';

  return (
    <div className="fd-demo">
      <style>{`
        .fd-demo {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          justify-content: center;
          min-height: 340px;
          padding: 16px;
          position: relative;
        }

        /* ── Poster / Ad ── */
        .fd-poster {
          width: 220px;
          height: 280px;
          background: linear-gradient(145deg, #0f1923, #1a2a3a);
          border-radius: 16px;
          overflow: hidden;
          position: relative;
          flex-shrink: 0;
          box-shadow: 0 4px 24px rgba(0,0,0,0.4);
          border: 1px solid rgba(255,255,255,0.06);
        }

        .fd-poster-bg {
          position: absolute;
          inset: 0;
          background: 
            radial-gradient(circle at 30% 20%, rgba(30,215,96,0.08) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(99,102,241,0.06) 0%, transparent 50%);
        }

        .fd-poster-content {
          position: relative;
          padding: 24px 18px;
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .fd-poster-badge {
          font-size: 7px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: rgba(255,255,255,0.35);
          font-weight: 600;
          margin-bottom: 16px;
        }

        .fd-poster-small {
          font-size: 11px;
          color: rgba(255,255,255,0.5);
          margin-bottom: 6px;
          font-weight: 500;
        }

        .fd-poster-headline {
          font-family: 'Georgia', serif;
          font-size: 28px;
          font-weight: 700;
          color: #fff;
          line-height: 1.15;
          margin-bottom: 8px;
          position: relative;
        }

        .fd-poster-sub {
          font-size: 10px;
          color: rgba(255,255,255,0.4);
          line-height: 1.5;
          margin-bottom: auto;
        }

        .fd-poster-cta {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 10px;
          font-weight: 600;
          color: #1ed760;
          margin-top: 12px;
        }

        .fd-poster-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 10px;
          padding-top: 10px;
          border-top: 1px solid rgba(255,255,255,0.06);
        }

        .fd-poster-logo {
          font-size: 10px;
          font-weight: 800;
          color: rgba(255,255,255,0.6);
          letter-spacing: 1px;
        }

        .fd-poster-dots {
          display: flex;
          gap: 3px;
        }

        .fd-poster-dots span {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: rgba(255,255,255,0.2);
        }

        .fd-poster-dots span:first-child {
          background: #1ed760;
        }

        /* ── Selection box ── */
        .fd-selection {
          position: absolute;
          top: -4px;
          left: -6px;
          right: -6px;
          bottom: -4px;
          border: 2px solid #1ed760;
          border-radius: 4px;
          background: rgba(30, 215, 96, 0.08);
          opacity: 0;
          transform: scaleX(0);
          transform-origin: left;
          transition: opacity 0.3s, transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          pointer-events: none;
          z-index: 5;
        }

        .fd-selection.active {
          opacity: 1;
          transform: scaleX(1);
        }

        .fd-selection.captured {
          opacity: 0;
          transform: scaleX(0.8) translateX(40px);
          transition: opacity 0.4s, transform 0.5s;
        }

        .fd-selection-handles {
          position: absolute;
          inset: -4px;
        }

        .fd-selection-handles::before,
        .fd-selection-handles::after {
          content: '';
          position: absolute;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #1ed760;
          box-shadow: 0 0 6px rgba(30,215,96,0.5);
        }

        .fd-selection-handles::before { top: -4px; left: -4px; }
        .fd-selection-handles::after { bottom: -4px; right: -4px; }

        .fd-selection-label {
          position: absolute;
          top: -20px;
          right: 0;
          font-size: 8px;
          color: #1ed760;
          font-weight: 600;
          letter-spacing: 0.5px;
          background: rgba(30,215,96,0.15);
          padding: 2px 6px;
          border-radius: 3px;
        }

        /* ── Cursor ── */
        .fd-cursor {
          position: absolute;
          width: 14px;
          height: 14px;
          z-index: 10;
          opacity: 0;
          transition: opacity 0.3s;
          filter: drop-shadow(0 1px 2px rgba(0,0,0,0.5));
        }

        .fd-cursor.visible {
          opacity: 1;
          animation: fd-cursor-move 1.7s ease-in-out forwards;
        }

        @keyframes fd-cursor-move {
          0% { top: 25%; left: 55%; }
          25% { top: 30%; left: 10%; }
          75% { top: 42%; left: 85%; }
          100% { top: 42%; left: 85%; opacity: 0; }
        }

        /* ── Captured flash ── */
        .fd-flash {
          position: absolute;
          inset: 0;
          background: rgba(30, 215, 96, 0.15);
          border-radius: 16px;
          opacity: 0;
          z-index: 6;
          pointer-events: none;
        }

        .fd-flash.active {
          animation: fd-flash-anim 0.4s ease-out;
        }

        @keyframes fd-flash-anim {
          0% { opacity: 0.6; }
          100% { opacity: 0; }
        }

        /* ── Bubble ── */
        .fd-bubble-wrap {
          position: relative;
          width: 100px;
          height: 100px;
          flex-shrink: 0;
          align-self: center;
        }

        .fd-bubble-circle {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          transition: background 0.4s, border-color 0.4s, box-shadow 0.4s;
          z-index: 2;
        }

        .fd-bubble-text {
          font-family: -apple-system, BlinkMacSystemFont, sans-serif;
          font-weight: 800;
          text-align: center;
          transition: color 0.4s, font-size 0.3s;
          line-height: 1.15;
          user-select: none;
        }

        .fd-spinner {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 92px;
          height: 92px;
          margin-top: -46px;
          margin-left: -46px;
          border-radius: 50%;
          z-index: 1;
          opacity: 0;
          transition: opacity 0.3s;
        }

        .fd-spinner.active {
          opacity: 1;
          animation: fd-spin 1.2s linear infinite;
        }

        .fd-spinner::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 50%;
          border: 3px solid transparent;
          border-top-color: #F59E0B;
          border-right-color: rgba(245, 158, 11, 0.3);
          filter: drop-shadow(0 0 4px rgba(245,158,11,0.25));
        }

        @keyframes fd-spin {
          to { transform: rotate(360deg); }
        }

        .fd-glow {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 110px;
          height: 110px;
          margin-top: -55px;
          margin-left: -55px;
          border-radius: 50%;
          z-index: 0;
          pointer-events: none;
          transition: box-shadow 0.4s;
        }

        /* ── Result card ── */
        .fd-result {
          background: #fff;
          border-radius: 18px;
          padding: 16px;
          width: 200px;
          box-shadow: 0 6px 28px rgba(0,0,0,0.3);
          opacity: 0;
          transform: translateX(-16px) scale(0.95);
          transition: opacity 0.4s ease, transform 0.4s ease;
          color: #1a1a1a;
          flex-shrink: 0;
          align-self: center;
        }

        .fd-result.visible {
          opacity: 1;
          transform: translateX(0) scale(1);
        }

        .fd-result-close {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #f3f4f6;
          border: 1px solid #e5e7eb;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          color: #9ca3af;
          margin-left: auto;
          margin-bottom: 6px;
        }

        .fd-result-label {
          font-size: 8px;
          font-weight: 600;
          letter-spacing: 1.5px;
          color: #9ca3af;
          text-transform: uppercase;
          margin-bottom: 3px;
        }

        .fd-result-font {
          font-size: 22px;
          font-weight: 800;
          color: #1a1a1a;
          line-height: 1.1;
          margin-bottom: 4px;
          font-family: -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .fd-result-meta {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 10px;
          color: #6b7280;
          margin-bottom: 4px;
        }

        .fd-badge {
          padding: 1px 6px;
          border-radius: 4px;
          font-size: 8px;
          font-weight: 700;
          letter-spacing: 0.5px;
        }

        .fd-badge-paid { background: #fef3c7; color: #d97706; }

        .fd-buy-btn {
          display: block;
          width: 100%;
          padding: 6px;
          background: #F59E0B;
          color: #fff;
          border: none;
          border-radius: 8px;
          font-size: 11px;
          font-weight: 700;
          text-align: center;
          margin: 8px 0;
        }

        .fd-could {
          font-size: 9px;
          color: #6b7280;
          font-style: italic;
          margin-bottom: 6px;
        }

        .fd-divider {
          height: 2px;
          background: linear-gradient(90deg, #1ed760, #6ee7b7);
          border-radius: 2px;
          margin: 8px 0;
        }

        .fd-alt-h {
          font-size: 8px;
          font-weight: 600;
          letter-spacing: 1.5px;
          color: #9ca3af;
          text-transform: uppercase;
          margin-bottom: 5px;
        }

        .fd-alt {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #f9fafb;
          border: 1px solid #f3f4f6;
          border-radius: 8px;
          padding: 6px 8px;
          margin-bottom: 3px;
        }

        .fd-alt-name {
          font-size: 11px;
          font-weight: 700;
          color: #1a1a1a;
        }

        .fd-alt-sub {
          font-size: 8px;
          color: #9ca3af;
        }

        .fd-alt-get {
          background: #1ed760;
          color: #fff;
          border: none;
          border-radius: 6px;
          padding: 3px 10px;
          font-size: 10px;
          font-weight: 700;
        }

        @media (max-width: 700px) {
          .fd-demo { flex-direction: column; align-items: center; }
          .fd-poster { width: 200px; height: 260px; }
          .fd-result { width: 200px; }
        }
      `}</style>

      {/* ── Poster ── */}
      <div className="fd-poster">
        <div className="fd-poster-bg" />
        <div className="fd-poster-content">
          <div className="fd-poster-badge">dribbble.com / brand studio</div>
          <div className="fd-poster-small">Introducing</div>
          <div className="fd-poster-headline">
            The Art of
            <br />
            Typography
            {/* Selection box */}
            <div className={`fd-selection ${isSelecting ? 'active' : ''} ${isCaptured ? 'captured' : ''}`}>
              <div className="fd-selection-handles" />
              <div className="fd-selection-label">⌘⇧F</div>
            </div>
          </div>
          <div className="fd-poster-sub">
            Discover the perfect typeface for every project.
            Precision meets creativity.
          </div>
          <div className="fd-poster-cta">Explore Collection →</div>
          <div className="fd-poster-footer">
            <div className="fd-poster-logo">STUDIO</div>
            <div className="fd-poster-dots">
              <span /><span /><span />
            </div>
          </div>
        </div>

        {/* Cursor */}
        <svg className={`fd-cursor ${isSelecting ? 'visible' : ''}`} viewBox="0 0 24 24" fill="white" stroke="black" strokeWidth="1">
          <path d="M5 3l3.6 16.5L12 13l6.4 2.5L5 3z" />
        </svg>

        {/* Flash on capture */}
        <div className={`fd-flash ${isCaptured ? 'active' : ''}`} />
      </div>

      {/* ── Bubble ── */}
      <div className="fd-bubble-wrap">
        <div
          className="fd-glow"
          style={{ boxShadow: `0 0 24px ${borderColor}44, 0 0 48px ${borderColor}22` }}
        />

        <div className={`fd-spinner ${isSpinning ? 'active' : ''}`} />

        <div
          className="fd-bubble-circle"
          style={{
            background: bgColor,
            border: `3px solid ${isSpinning ? borderColor + '40' : borderColor}`,
            boxShadow: state === 'found' ? `0 0 16px ${borderColor}66` : 'none',
          }}
        >
          <span
            className="fd-bubble-text"
            style={{
              color: borderColor,
              fontSize: (bubbleText?.length ?? 0) <= 3 ? '22px' : (bubbleText?.length ?? 0) <= 8 ? '12px' : '10px',
            }}
          >
            {bubbleText}
          </span>
        </div>
      </div>

      {/* ── Result ── */}
      <div className={`fd-result ${showResult ? 'visible' : ''}`}>
        <div className="fd-result-close">✕</div>
        <div className="fd-result-label">DETECTED FONT</div>
        <div className="fd-result-font">Georgia</div>
        <div className="fd-result-meta">
          Confidence: high
          <span className="fd-badge fd-badge-paid">PAID</span>
        </div>
        <div style={{ fontSize: '10px', color: '#9ca3af' }}>serif</div>
        <div className="fd-buy-btn">🛒 BUY</div>
        <div className="fd-could">Could also be  Playfair Display</div>
        <div className="fd-divider" />
        <div className="fd-alt-h">FREE ALTERNATIVES</div>
        {[
          { name: 'Lora', sim: '93%' },
          { name: 'Merriweather', sim: '89%' },
          { name: 'Libre Baskerville', sim: '85%' },
        ].map((alt) => (
          <div className="fd-alt" key={alt.name}>
            <div>
              <div className="fd-alt-name">{alt.name}</div>
              <div className="fd-alt-sub">Google Fonts · {alt.sim}</div>
            </div>
            <div className="fd-alt-get">GET</div>
          </div>
        ))}
      </div>
    </div>
  );
}
