'use client';

import { useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
const IconDropDemo = dynamic(() => import('@/components/IconDropDemo'), { ssr: false });

const CheckIcon = () => (
  <div className="pcheck">
    <svg viewBox="0 0 12 12"><polyline points="2 6 5 9 10 3" /></svg>
  </div>
);

const features = [
  { title: 'Screen Capture', desc: 'One click to capture any area of your screen. Select the icon you want to identify — from any app, website, or mockup.', icon: 'capture' },
  { title: 'Image Drop', desc: 'Drag and drop any image onto the floating bubble — screenshots, Figma exports, or design files.', icon: 'image' },
  { title: 'AI-Powered Recognition', desc: 'CLIP visual AI + 200,000+ icon database. Identifies icons from any pack instantly with no internet delay.', icon: 'ai' },
  { title: 'Copy SVG Instantly', desc: 'One click to copy the SVG source. Clean, optimized, ready to paste into your code or Figma.', icon: 'svg' },
  { title: 'Copy React Import', desc: 'Get the exact import statement for lucide-react, heroicons, tabler, phosphor and more. Paste and ship.', icon: 'react' },
  { title: 'Browse Full Pack', desc: 'Explore the entire icon pack of any match. Find the perfect variant — outline, fill, solid, duotone.', icon: 'browse' },
  { title: 'Floating Bubble', desc: 'Always-on-top desktop bubble. Drag anywhere on your screen. There when you need it, gone when you don\'t.', icon: 'bubble' },
  { title: 'Style Matching', desc: 'Find the same icon across multiple packs. Switch between heroicons, tabler, lucide without losing consistency.', icon: 'style' },
];

const featureIcons: Record<string, React.ReactNode> = {
  capture: <svg viewBox="0 0 48 48" fill="none"><rect x="6" y="6" width="36" height="36" rx="4" stroke="#6C63FF" strokeWidth="2"/><path d="M18 18l6-6 6 6" stroke="#6C63FF" strokeWidth="2"/><circle cx="24" cy="28" r="6" stroke="#6C63FF" strokeWidth="2"/></svg>,
  image:   <svg viewBox="0 0 48 48" fill="none"><rect x="8" y="8" width="32" height="32" rx="4" stroke="#6C63FF" strokeWidth="2"/><path d="M16 32l8-10 6 6 4-8" stroke="#6C63FF" strokeWidth="2"/></svg>,
  ai:      <svg viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="16" stroke="#6C63FF" strokeWidth="2"/><path d="M20 20c0-2.2 1.8-4 4-4s4 1.8 4 4-4 8-4 8" stroke="#6C63FF" strokeWidth="2"/><circle cx="24" cy="34" r="1.5" fill="#6C63FF"/></svg>,
  svg:     <svg viewBox="0 0 48 48" fill="none"><path d="M10 24h28M24 10v28" stroke="#6C63FF" strokeWidth="2"/><rect x="14" y="14" width="20" height="20" rx="3" stroke="#6C63FF" strokeWidth="2"/></svg>,
  react:   <svg viewBox="0 0 48 48" fill="none"><ellipse cx="24" cy="24" rx="18" ry="8" stroke="#6C63FF" strokeWidth="2"/><ellipse cx="24" cy="24" rx="18" ry="8" stroke="#6C63FF" strokeWidth="2" transform="rotate(60 24 24)"/><ellipse cx="24" cy="24" rx="18" ry="8" stroke="#6C63FF" strokeWidth="2" transform="rotate(120 24 24)"/><circle cx="24" cy="24" r="3" fill="#6C63FF"/></svg>,
  browse:  <svg viewBox="0 0 48 48" fill="none"><rect x="6" y="6" width="14" height="14" rx="2" stroke="#6C63FF" strokeWidth="2"/><rect x="28" y="6" width="14" height="14" rx="2" stroke="#6C63FF" strokeWidth="2"/><rect x="6" y="28" width="14" height="14" rx="2" stroke="#6C63FF" strokeWidth="2"/><rect x="28" y="28" width="14" height="14" rx="2" stroke="#6C63FF" strokeWidth="2"/></svg>,
  bubble:  <svg viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="14" stroke="#6C63FF" strokeWidth="2"/><circle cx="24" cy="24" r="6" fill="#6C63FF" opacity=".2"/><circle cx="24" cy="24" r="3" fill="#6C63FF"/></svg>,
  style:   <svg viewBox="0 0 48 48" fill="none"><circle cx="16" cy="24" r="8" stroke="#6C63FF" strokeWidth="2"/><circle cx="32" cy="24" r="8" stroke="#6C63FF" strokeWidth="2"/><path d="M20 24h8" stroke="#6C63FF" strokeWidth="2"/></svg>,
};

const sources = [
  { name: 'Lucide', count: '1,700+ icons', color: '#F5A623', icon: <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#F5A623" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M8 12l2.5 2.5L16 9"/></svg> },
  { name: 'Heroicons', count: '292 icons', color: '#7C3AED', icon: <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="1.5"><path d="M3 12l9-9 9 9M5 10v9h5v-6h4v6h5v-9"/></svg> },
  { name: 'Tabler', count: '5,000+ icons', color: '#0EA5E9', icon: <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#0EA5E9" strokeWidth="1.5"><rect x="4" y="4" width="7" height="7" rx="1"/><rect x="13" y="4" width="7" height="7" rx="1"/><rect x="4" y="13" width="7" height="7" rx="1"/><rect x="13" y="13" width="7" height="7" rx="1"/></svg> },
  { name: 'Phosphor', count: '9,000+ icons', color: '#EC4899', icon: <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#EC4899" strokeWidth="1.5"><circle cx="12" cy="12" r="8"/><path d="M9 9h6v4a3 3 0 01-6 0V9z"/></svg> },
  { name: 'Material', count: '15,000+ icons', color: '#4285F4', icon: <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#4285F4" strokeWidth="1.5"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg> },
  { name: '+ 30 more', count: '200k+ total', color: '#6C63FF', icon: <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#6C63FF" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 8v8M8 12h8"/></svg> },
];

const pricingPlans = [
  { name: 'Free Trial', price: '0', period: '30 days', devices: '1 Computer', popular: false, btnText: 'Download & Start Trial', features: ['Full access to all features', 'Unlimited identifications', 'AI-powered recognition', 'Copy SVG, React & HTML', 'Browse 200k+ icons'] },
  { name: 'Basic', price: '9', period: 'per month', devices: '2 Computers', popular: true, btnText: 'Purchase', features: ['Full access to all features', 'Unlimited identifications', 'AI-powered recognition', 'Copy SVG, React & HTML', 'Browse 200k+ icons', 'Subscription management'] },
  { name: 'Pro', price: '15', period: 'per month', devices: '3 Computers', popular: false, btnText: 'Purchase', features: ['Full access to all features', 'Unlimited identifications', 'AI-powered recognition', 'Copy SVG, React & HTML', 'Browse 200k+ icons', 'Up to 3 devices'] },
];

const faqItems = [
  { q: 'I get a warning when opening the app. What should I do?', a: 'This is normal on macOS. Right-click the app → Open → confirm. Enable Screen Recording in System Settings → Privacy & Security.' },
  { q: 'How accurate is the icon identification?', a: 'Our CLIP visual AI achieves 90%+ accuracy on clean icon images. For ambiguous icons we show the closest visual matches across multiple packs.' },
  { q: 'Which icon packs are supported?', a: 'IconDrop supports 30+ packs including Lucide, Heroicons, Tabler, Phosphor, Material Symbols, MDI, Remix Icons, and more — 200,000+ icons total.' },
  { q: 'Can I copy the React import directly?', a: 'Yes. IconDrop generates the exact import for lucide-react, @heroicons/react, @tabler/icons-react, phosphor-react and more. Just click Copy React.' },
  { q: 'Is Windows supported?', a: 'macOS 12+ only for now. Windows coming soon.' },
  { q: 'How is IconDrop different from searching Iconify directly?', a: 'You start from a visual — a screenshot or design file. No need to know the icon name. IconDrop identifies it and puts the SVG or React import in your clipboard in one click.' },
];

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-[#e8e8e8]" style={{ fontFamily: "'Inter', -apple-system, sans-serif" }}>
      <div className="purple-line" />

      {/* Nav */}
      <nav className="landing-nav">
        <a href="/" className="nav-logo">
          <div className="nav-logo-icon">Id</div>
          <span className="nav-logo-text">IconDrop</span>
        </a>
        <ul className="nav-links">
          <li><a href="#pricing" className="nav-download">Download</a></li>
          <li><a href="#sources">Icon Packs</a></li>
          <li><a href="#features">Features</a></li>
          <li><a href="#video">Tutorials</a></li>
          <li><a href="#pricing">Pricing</a></li>
          <li><a href="#contact">Contact</a></li>
          <li><a href="#faq">Help</a></li>
        </ul>
      </nav>

      {/* Hero */}
      <section className="hero">
        <div className="hero-content">
          <h1>Identify Any Icon from a Screenshot — Copy SVG or React in One Click</h1>
          <p className="hero-sub">Download now for 30 days free trial</p>
          <div className="download-buttons">
            <a href="https://github.com/yairsabag/fontdrop-releases/releases/download/v1.0.1/FontDrop-1.0.0-Installer.dmg" className="download-btn">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
              <div><span className="download-btn-small">Download for</span><span className="download-btn-big">MacOS</span></div>
            </a>
            <a href="#" className="download-btn disabled">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 12V6.75l6-1.32v6.48L3 12zm6.5 0l.01 6.68L3 17.25V12h6.5zm.99-6.7L23.5 3v9h-13V5.3zM23.5 12v9l-13.01-2.12V12h13.01z"/></svg>
              <div><span className="download-btn-small">Download for</span><span className="download-btn-big">Windows</span></div>
            </a>
          </div>
        </div>
        <div className="hero-mockup">
          <IconDropDemo />
        </div>
      </section>

      <div className="section-divider" />

      {/* Sources */}
      <section id="sources" className="landing-section">
        <div className="section-inner">
          <h2 className="section-title">Supported Icon Packs</h2>
          <p className="section-subtitle">200,000+ icons across 30+ packs — all identified instantly</p>
          <div className="sources-grid">
            {sources.map((s) => (
              <div key={s.name} className="source-card">
                <div className="source-card-icon">{s.icon}</div>
                <div className="source-card-name">{s.name}</div>
                <div className="source-card-count">{s.count}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* Features */}
      <section id="features" className="landing-section">
        <div className="section-inner">
          <h2 className="section-title">Powerful Features</h2>
          <div className="features-grid">
            {features.map((f) => (
              <div key={f.title} className="feature-card">
                <div className="feature-card-icon">{featureIcons[f.icon]}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* Video */}
      <section id="video" className="landing-section">
        <div className="section-inner">
          <h2 className="section-title">Video Tutorial</h2>
          <p className="section-subtitle">See how IconDrop fits into your design workflow</p>
          <div className="video-card">
            <div className="video-play">
              <svg viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3" /></svg>
            </div>
            <div className="video-label">Watch IconDrop in Action</div>
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* Pricing */}
      <section id="pricing" className="landing-section">
        <div className="section-inner">
          <h2 className="section-title">Choose Your Plan</h2>
          <div className="pricing-grid">
            {pricingPlans.map((plan) => (
              <div key={plan.name} className={`pricing-card ${plan.popular ? 'popular' : ''}`}>
                {plan.popular && <div className="popular-badge">Most Popular</div>}
                <h3>{plan.name}</h3>
                <div className="pricing-amount"><span className="cur">$</span>{plan.price}</div>
                <div className="pricing-period">{plan.period}</div>
                <div className="pricing-devices">{plan.devices}</div>
                <button className="pricing-btn">{plan.btnText}</button>
                <div className="pricing-fl">Features you&apos;ll love:</div>
                <ul>
                  {plan.features.map((feat) => (
                    <li key={feat}><CheckIcon />{feat}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* FAQ */}
      <section id="faq" className="landing-section">
        <div className="section-inner">
          <h2 className="section-title">Frequently Asked Questions</h2>
          <div className="faq-list">
            {faqItems.map((item, i) => (
              <div key={i} className={`faq-item ${openFaq === i ? 'open' : ''}`}>
                <button className="faq-question-btn" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  {item.q}
                  <svg className="faq-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
                <div className={`faq-answer ${openFaq === i ? 'open' : ''}`}>
                  <div className="faq-answer-inner">{item.a}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* Contact */}
      <section id="contact" className="landing-section">
        <div className="section-inner">
          <h2 className="section-title">Get in Touch</h2>
          <div className="contact-grid">
            <a href="mailto:support@icondrop.app" className="contact-card">
              <div className="contact-icon">✉️</div>
              <h4>Email</h4>
              <p>support@icondrop.app</p>
            </a>
            <a href="#" className="contact-card">
              <div className="contact-icon">💬</div>
              <h4>Live Chat</h4>
              <p>Chat with our team</p>
            </a>
            <a href="#" className="contact-card">
              <div className="contact-icon">📸</div>
              <h4>Instagram</h4>
              <p>@icondropapp</p>
            </a>
            <a href="#" className="contact-card">
              <div className="contact-icon">📱</div>
              <h4>WhatsApp</h4>
              <p>Updates group</p>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-brand">
          <div className="fi">Id</div>icondrop
        </div>
        <div className="footer-links">
          <a href="/privacy">Privacy Policy</a>
          <a href="/terms">Terms of Service</a>
          <a href="/refund">Refund Policy</a>
        </div>
        <div className="footer-copy">Professional icon identification for designers &amp; developers</div>
      </footer>
    </div>
  );
}
