'use client';

import { useState, useEffect, useRef } from "react";

const STEPS = { IDLE: 0, SELECT: 1, DRAG: 2, SCANNING: 3, RESULTS: 4, PAUSE: 5 };
const STEP_DURATIONS: Record<number, number> = { 0: 1800, 1: 1800, 2: 1400, 3: 2800, 4: 4000, 5: 1200 };

export default function FontDropDemo() {
  const [step, setStep] = useState(0);
  const [cursorPos, setCursorPos] = useState({ x: 280, y: 120 });
  const [selectBox, setSelectBox] = useState<{x:number;y:number;w:number;h:number}|null>(null);
  const [dragImage, setDragImage] = useState<{x:number;y:number;o:number;sc:number}|null>(null);
  const [scanProgress, setScanProgress] = useState(0);
  const animRef = useRef<ReturnType<typeof setTimeout>|null>(null);
  const intervalsRef = useRef<ReturnType<typeof setInterval>[]>([]);
  const clearInts = () => { intervalsRef.current.forEach(clearInterval); intervalsRef.current = []; };

  useEffect(() => {
    const run = (s: number) => {
      setStep(s);

      if (s === 1) {
        let t = 0;
        const id = setInterval(() => {
          t += 0.035;
          if (t <= 0.45) {
            const p = t / 0.45;
            const e = p < 0.5 ? 2*p*p : 1 - Math.pow(-2*p+2,2)/2;
            setCursorPos({ x: 280 + (24-280)*e, y: 120 + (95-120)*e });
          } else if (t <= 1) {
            const p = (t-0.45)/0.55;
            const e = p < 0.5 ? 2*p*p : 1 - Math.pow(-2*p+2,2)/2;
            setSelectBox({ x: 24, y: 78, w: 195*e, h: 34 });
            setCursorPos({ x: 24 + 195*e, y: 95 });
          } else clearInterval(id);
        }, 25);
        intervalsRef.current.push(id);
      }

      if (s === 2) {
        setDragImage({ x: 120, y: 95, o: 1, sc: 1 });
        let t = 0;
        const ex = 468, ey = 333;
        const id = setInterval(() => {
          t += 0.025;
          const e = Math.min(t < 0.5 ? 2*t*t : 1 - Math.pow(-2*t+2,2)/2, 1);
          setCursorPos({ x: 120+(ex-120)*e, y: 95+(ey-95)*e });
          setDragImage({ x: 120+(ex-120)*e, y: 95+(ey-95)*e, o: 1-e*0.4, sc: 1-e*0.5 });
          if (t >= 1) { clearInterval(id); setDragImage(null); setSelectBox(null); }
        }, 25);
        intervalsRef.current.push(id);
      }

      if (s === 3) {
        setScanProgress(0);
        let p = 0;
        const id = setInterval(() => { p += 0.012; setScanProgress(Math.min(p,1)); if(p>=1) clearInterval(id); }, 25);
        intervalsRef.current.push(id);
        setCursorPos({ x: 500, y: 400 });
      }

      if (s === 4) { setScanProgress(1); setCursorPos({ x: 500, y: 400 }); }

      const next = s === 5 ? 0 : s + 1;
      animRef.current = setTimeout(() => {
        if (s === 5) { setCursorPos({x:280,y:120}); setSelectBox(null); setDragImage(null); setScanProgress(0); clearInts(); }
        run(next);
      }, STEP_DURATIONS[s]);
    };
    run(0);
    return () => { if(animRef.current) clearTimeout(animRef.current); clearInts(); };
  }, []);

  const scanning = step === 3;
  const results = step === 4 || step === 5;

  return (
    <div className="demo-wrap">
      <div className="demo-box">
        {/* Browser */}
        <div className="demo-browser">
          <div className="demo-bar">
            <div className="demo-dots"><span className="demo-dot demo-dot-r" /><span className="demo-dot demo-dot-y" /><span className="demo-dot demo-dot-g" /></div>
            <div className="demo-url">dribbble.com/shots/brand-identity</div>
          </div>
          <div className="demo-content">
            <div className="demo-adH"><div className="demo-adL"><div className="demo-adLI" /><span className="demo-adLT">BRAND CO.</span></div><div className="demo-adN"><span>Work</span><span>About</span><span>Contact</span></div></div>
            <div className="demo-adB">
              <div className="demo-adT1">We Create</div>
              <div className="demo-adT2">Beautiful</div>
              <div className="demo-adT1">Experiences</div>
              <div className="demo-adSub">Award-winning design studio in NYC</div>
              <div className="demo-adBtn">View Our Work →</div>
            </div>
            <div className="demo-adC" /><div className="demo-adL1" /><div className="demo-adL2" />
            {selectBox && <div className="demo-sel" style={{left:selectBox.x,top:selectBox.y,width:selectBox.w,height:selectBox.h}} />}
          </div>
        </div>

        {/* Drag ghost */}
        {dragImage && <div className="demo-drag" style={{left:dragImage.x-50,top:dragImage.y-14,opacity:dragImage.o,transform:`scale(${dragImage.sc})`}}>Beautiful</div>}

        {/* Bubble */}
        <div className={`demo-bubArea${results ? ' demo-bubArea-res' : ''}`}>
          <div className={`demo-bub${scanning ? ' demo-bub-act' : ''}${results ? ' demo-bub-res' : ''}`}>
            {scanning && <svg className="demo-ring" viewBox="0 0 80 80" width="80" height="80"><defs><linearGradient id="rg" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#1ed760" stopOpacity="1"/><stop offset="100%" stopColor="#1ed760" stopOpacity="0"/></linearGradient></defs><circle cx="40" cy="40" r="36" fill="none" stroke="url(#rg)" strokeWidth="3" strokeLinecap="round" strokeDasharray={`${scanProgress*180} ${226-scanProgress*180}`}/></svg>}
            {!results && <div className="demo-bubIn"><span className="demo-bubLogo">Fd</span>{scanning && <div className="demo-scanTxt">Analyzing...</div>}</div>}
            {results && (
              <div className="demo-rP">
                <div className="demo-rLbl">DETECTED FONT</div>
                <div className="demo-rName">Playfair Display</div>
                <div className="demo-rMeta"><span className="demo-rConf">Confidence: high</span><span className="demo-rFree">FREE</span></div>
                <div className="demo-rType">Serif</div>
                <div className="demo-rDl"><span>↓</span> DOWNLOAD</div>
                <div className="demo-rBar"><div className="demo-rBarF" /></div>
                <div className="demo-rAH"><span className="demo-rAL">FREE ALTERNATIVES</span><span className="demo-rAC">3</span></div>
                {[{n:"Cormorant Garamond",s:"94%"},{n:"Lora",s:"89%"},{n:"EB Garamond",s:"85%"}].map(a=>(
                  <div key={a.n} className="demo-rCard">
                    <div className="demo-rCardInfo"><div className="demo-rCN">{a.n}</div><div className="demo-rCM">Google Fonts · {a.s}</div></div>
                    <div className="demo-rGet">GET</div>
                  </div>
                ))}
                <div className="demo-rCl">✕ Close</div>
              </div>
            )}
          </div>
        </div>

        {/* Cursor */}
        <div className={`demo-cursor${step===0?' demo-cursor-idle':''}`} style={{left:cursorPos.x,top:cursorPos.y}}>
          <svg width="20" height="24" viewBox="0 0 20 24" fill="none"><path d="M2 2L2 19L7 14.5L11 22L14 20.5L10 13L16 12.5L2 2Z" fill="white" stroke="#222" strokeWidth="1.5"/></svg>
        </div>

        {/* Steps */}
        <div className="demo-stepBar">
          {["Browse","Select","Drop","Identify","Result"].map((l,i)=>(
            <div key={l} className="demo-sD">
              <div className={`demo-sDI${step>=i&&step<5?' demo-sDIA':''}`} />
              <span className={`demo-sL${step>=i&&step<5?' demo-sLA':''}`}>{l}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
