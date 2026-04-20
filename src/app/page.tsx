'use client';

import { useState } from 'react';
import FontDropDemo from '@/components/FontDropDemo';
import Link from 'next/link';

const CheckIcon = () => (
  <div className="pcheck">
    <svg viewBox="0 0 12 12"><polyline points="2 6 5 9 10 3" /></svg>
  </div>
);

const features = [
  { title: 'Screen Capture', desc: 'One click to capture any area of your screen. Select the text you want to identify.', icon: 'capture' },
  { title: 'Image Drop', desc: 'Drag and drop any image onto the floating bubble — screenshots, photos, or mockups.', icon: 'image' },
  { title: 'AI-Powered Recognition', desc: 'GPT vision + 990,000+ font database. Identifies fonts in any language — Latin, Cyrillic, Arabic, CJK, and more.', icon: 'ai' },
  { title: 'Free Alternatives', desc: 'Get 3 free alternatives from Google Fonts with similarity scores for every match.', icon: 'free' },
  { title: 'One-Click Download', desc: 'Free fonts download instantly. Paid fonts link directly to the foundry page.', icon: 'download' },
  { title: 'Multi-Language Support', desc: 'Identifies fonts in any script — Latin, Cyrillic, Arabic, Chinese, Japanese, Korean, and more.', icon: 'hebrew' },
  { title: 'Floating Bubble', desc: 'Always-on-top desktop bubble. Drag anywhere. There when you need it.', icon: 'bubble' },
  { title: 'Paste from Clipboard', desc: 'Copy any screenshot, press Cmd+V on the bubble. Works with any tool.', icon: 'clipboard' },
];

const featureIcons: Record<string, React.ReactNode> = {
  capture: <svg viewBox="0 0 48 48" fill="none"><rect x="6" y="6" width="36" height="36" rx="4" stroke="#1ed760" strokeWidth="2"/><path d="M18 18l6-6 6 6" stroke="#1ed760" strokeWidth="2"/><circle cx="24" cy="28" r="6" stroke="#1ed760" strokeWidth="2"/></svg>,
  image: <svg viewBox="0 0 48 48" fill="none"><rect x="8" y="8" width="32" height="32" rx="4" stroke="#1ed760" strokeWidth="2"/><path d="M16 32l8-10 6 6 4-8" stroke="#1ed760" strokeWidth="2"/></svg>,
  ai: <svg viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="16" stroke="#1ed760" strokeWidth="2"/><path d="M20 20c0-2.2 1.8-4 4-4s4 1.8 4 4-4 8-4 8" stroke="#1ed760" strokeWidth="2"/><circle cx="24" cy="34" r="1.5" fill="#1ed760"/></svg>,
  free: <svg viewBox="0 0 48 48" fill="none"><path d="M12 24h24M24 12v24" stroke="#1ed760" strokeWidth="2"/><circle cx="24" cy="24" r="16" stroke="#1ed760" strokeWidth="2"/></svg>,
  download: <svg viewBox="0 0 48 48" fill="none"><path d="M24 8v24" stroke="#1ed760" strokeWidth="2"/><path d="M16 24l8 8 8-8" stroke="#1ed760" strokeWidth="2"/><path d="M8 36h32" stroke="#1ed760" strokeWidth="2"/></svg>,
  hebrew: <svg viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="14" stroke="#1ed760" strokeWidth="2"/><ellipse cx="24" cy="24" rx="8" ry="14" stroke="#1ed760" strokeWidth="2"/><line x1="10" y1="24" x2="38" y2="24" stroke="#1ed760" strokeWidth="2"/></svg>,
  bubble: <svg viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="14" stroke="#1ed760" strokeWidth="2"/><circle cx="24" cy="24" r="6" fill="#1ed760" opacity=".2"/><circle cx="24" cy="24" r="3" fill="#1ed760"/></svg>,
  clipboard: <svg viewBox="0 0 48 48" fill="none"><rect x="8" y="12" width="32" height="24" rx="3" stroke="#1ed760" strokeWidth="2"/><path d="M16 24h16M16 30h10" stroke="#1ed760" strokeWidth="2"/></svg>,
};

const sources = [
  { name: 'Google Fonts', count: '1,900+ free', color: '#4285F4', icon: <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#4285F4" strokeWidth="1.5"><path d="M4 7V4h16v3M9 20h6M12 4v16"/></svg> },
  { name: 'WhatFontIs', count: '990K+ indexed', color: '#FF6B35', icon: <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#FF6B35" strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg> },
  { name: 'Adobe Fonts', count: '25K+ premium', color: '#FF0000', icon: <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#FF0000" strokeWidth="1.5"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg> },
  { name: 'Fontshare', count: '100+ free families', color: '#fff', icon: <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/></svg> },
  { name: 'MyFonts', count: '270K+ commercial', color: '#E91E8C', icon: <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#E91E8C" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/></svg> },
];

const pricingPlans = [
  { name: 'Free Trial', price: '0', period: '30 days', devices: '1 Computer', popular: false, btnText: 'Download & Start Trial', features: ['Full access to all features', 'Unlimited identifications', 'AI-powered recognition', 'Free font downloads', 'Multi-language support'] },
  { name: 'Basic', price: '9', period: 'per month', devices: '2 Computers', popular: true, btnText: 'Purchase', features: ['Full access to all features', 'Unlimited identifications', 'AI-powered recognition', 'Free font downloads', 'Multi-language support', 'Subscription management'] },
  { name: 'Pro', price: '15', period: 'per month', devices: '3 Computers', popular: false, btnText: 'Purchase', features: ['Full access to all features', 'Unlimited identifications', 'AI-powered recognition', 'Free font downloads', 'Multi-language support', 'Up to 3 devices'] },
];

const faqItems = [
  { q: 'I get a warning when opening the app. What should I do?', a: 'This is normal on macOS. Right-click the app → Open → confirm. Enable Screen Recording in System Settings → Privacy & Security.' },
  { q: 'How accurate is the font identification?', a: 'AI + 990,000+ fonts. Above 90% for clear images. For rare fonts, we show closest matches and free alternatives.' },
  { q: 'What languages does it support?', a: 'FontDrop identifies fonts in any script — Latin, Cyrillic, Arabic, Chinese, Japanese, Korean, Hebrew, and more.' },
  { q: 'How much does it cost?', a: 'Free 30-day trial. Basic $9/mo (2 computers), Pro $15/mo (3 computers). Cancel anytime.' },
  { q: 'Is Windows supported?', a: 'macOS 12+ only for now. Windows coming soon.' },
  { q: 'How is fontdrop different from WhatTheFont?', a: 'Native desktop bubble, no browser needed. AI + databases, multi-language support, free alternatives for every match.' },
];

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-[#e8e8e8]" style={{ fontFamily: "'Inter', -apple-system, sans-serif" }}>
      {/* Green line */}
      <div className="green-line" />

      {/* Nav */}
      <nav className="landing-nav">
        <Link href="/" className="nav-logo">
          <div className="nav-logo-icon">Fd</div>
          <span className="nav-logo-text">FontDrop</span>
        </Link>
        <ul className="nav-links">
          <li><a href="#pricing" className="nav-download">Download</a></li>
          <li><a href="#sources">Supported Sources</a></li>
          <li><a href="#features">Features</a></li>
          <li><a href="#video">Tutorials</a></li>
          <li><a href="#pricing">Pricing</a></li>
          <li><a href="#contact">Contact</a></li>
          <li><a href="#faq">Help</a></li>
          <li><Link href="/account" className="nav-account">My Account</Link></li>
        </ul>
      </nav>

      {/* Hero */}
      <section className="hero">
        <div className="hero-content">
          <h1>Professional App for Identifying Fonts from Any Image or Screenshot</h1>
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
          <FontDropDemo />
        </div>
      </section>

      <div className="section-divider" />

      {/* Sources */}
      <section id="sources" className="landing-section">
        <div className="section-inner">
          <h2 className="section-title">Supported Font Sources</h2>
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
          <p className="section-subtitle">Learn how to get the most out of fontdrop</p>
          <div className="video-card">
            <div className="video-play">
              <svg viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3" /></svg>
            </div>
            <div className="video-label">Watch fontdrop in Action</div>
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
                <Link href="/signup">
                  <button className="pricing-btn">{plan.btnText}</button>
                </Link>
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
            <a href="mailto:support@fontdrop.app" className="contact-card">
              <div className="contact-icon">✉️</div>
              <h4>Email</h4>
              <p>support@fontdrop.app</p>
            </a>
            <a href="#" className="contact-card">
              <div className="contact-icon">💬</div>
              <h4>Live Chat</h4>
              <p>Chat with our team</p>
            </a>
            <a href="#" className="contact-card">
              <div className="contact-icon">🐦</div>
              <h4>Instergram</h4>
              <p>@fontdropapp</p>
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
          <div className="fi">Fd</div>fontdrop
        </div>
        <div className="footer-links">
          <Link href="/privacy">Privacy Policy</Link>
          <Link href="/terms">Terms of Service</Link>
          <Link href="/refund">Refund Policy</Link>
        </div>
        <div className="footer-copy">Professional font identification for designers</div>
      </footer>
    </div>
  );
}
