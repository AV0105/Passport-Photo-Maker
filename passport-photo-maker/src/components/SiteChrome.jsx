import { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import logo from '../assets/Logo.svg';

const NAV_LINKS = [
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Guarantee', href: '#guarantee' },
  { label: 'Data collection', href: '#data-collection' },
  { label: 'About', href: '#about' },
];

const GUIDE_LINKS = [
  { label: 'Make it at home', href: '#/guide/home' },
  { label: 'With a mobile phone', href: '#/guide/mobile' },
  { label: 'With Android', href: '#/guide/android' },
  { label: 'With iPhone', href: '#/guide/iphone' },
  { label: 'Photo checklist', href: '#/guide/photo-tips' },
];

export function SiteHeader({ onStart, current }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [guidesOpen, setGuidesOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 14);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false); setGuidesOpen(false); }, [current]);

  const goHome = (e) => {
    e.preventDefault();
    window.location.hash = '#';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className={`lp-nav ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="lp-nav-inner">
        <a href="#" className="brand" onClick={goHome}>
          <img src={logo} className="brand-logo" alt="" aria-hidden="true" />
          
          Passport Photo Maker
        </a>

        <nav className="nav-links" aria-label="Primary">
          {NAV_LINKS.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setMobileOpen(false)}>{l.label}</a>
          ))}

          <div
            className="dropdown"
            onMouseEnter={() => setGuidesOpen(true)}
            onMouseLeave={() => setGuidesOpen(false)}
          >
            <button
              className="drop-trigger"
              aria-expanded={guidesOpen}
              aria-haspopup="true"
              onClick={() => setGuidesOpen((v) => !v)}
            >
              Guides
              <ChevronDown size={14} />
            </button>
            {guidesOpen && (
              <div className="drop-menu" role="menu">
                {GUIDE_LINKS.map((l) => (
                  <a key={l.href} href={l.href} onClick={() => { setGuidesOpen(false); setMobileOpen(false); }}>{l.label}</a>
                ))}
              </div>
            )}
          </div>
        </nav>

        <div className="nav-cta">
          <button className="btn btn-primary" onClick={onStart}>Create my photo</button>
        </div>

        <button
          className={`burger ${mobileOpen ? 'open' : ''}`}
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((v) => !v)}
        >
          <span /><span /><span />
        </button>
      </div>

      {mobileOpen && (
        <nav className="mobile-menu" aria-label="Mobile">
          <button className="btn btn-primary btn-block" onClick={onStart}>Create my photo</button>
          {NAV_LINKS.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setMobileOpen(false)}>{l.label}</a>
          ))}
          <div className="mobile-group">
            <span className="mobile-group-label">Guides</span>
            {GUIDE_LINKS.map((l) => (
              <a key={l.href} href={l.href} onClick={() => setMobileOpen(false)}>{l.label}</a>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}

export function SiteFooter({ onStart }) {
  return (
    <footer className="lp-footer">
      <div className="footer-grid">
        <div className="footer-brand">
          <a href="#" className="brand" onClick={(e) => { e.preventDefault(); window.location.hash = '#'; window.scrollTo(0,0); }}>
            <img src={logo} className="brand-logo" alt="" aria-hidden="true" />Passport Photo Maker
          </a>
          <p>Free, private, on-device passport &amp; ID photo generation.</p>
        </div>
        <div className="footer-col">
          <h4>Product</h4>
          <a href="#how-it-works">How it works</a>
          <a href="#guarantee">Guarantee</a>
          <button className="footer-link" onClick={onStart}>Create a photo</button>
        </div>
        <div className="footer-col">
          <h4>Guides</h4>
          <a href="#/guide/home">At home</a>
          <a href="#/guide/mobile">Mobile phone</a>
          <a href="#/guide/android">Android</a>
          <a href="#/guide/iphone">iPhone</a>
          <a href="#/guide/photo-tips">Photo checklist</a>
        </div>
        <div className="footer-col">
          <h4>Company</h4>
          <a href="#data-collection">Data collection</a>
          <a href="#about">About</a>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Passport Photo Maker.</span>
        <span className="footer-disclaimer"> All processing happens in your browser.</span>
      </div>
    </footer>
  );
}