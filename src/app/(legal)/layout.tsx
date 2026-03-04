import Link from 'next/link';

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0d0d0d] text-[#e8e8e8]" style={{ fontFamily: "'Inter', -apple-system, sans-serif" }}>
      <div className="green-line" />
      <nav className="landing-nav">
        <Link href="/" className="nav-logo">
          <div className="nav-logo-icon">Fd</div>
          <span className="nav-logo-text">FontDrop</span>
        </Link>
        <ul className="nav-links">
          <li><Link href="/#pricing" className="nav-download">Download</Link></li>
          <li><Link href="/account" className="nav-account">My Account</Link></li>
        </ul>
      </nav>
      <main className="legal-page">
        <div className="legal-container">
          {children}
        </div>
      </main>
      <footer className="landing-footer">
        <div className="footer-brand">
          <div className="fi">Fd</div>FontDrop
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
