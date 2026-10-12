import { useEffect, useState } from 'react';
import './LandingPage.css';
import { SiteHeader, SiteFooter } from './SiteChrome.jsx';
import {
  Scissors, Wand2, Ruler, Lock, Globe, ArrowRight,
  Home, Smartphone, Settings2, Camera, Check, Target, Handshake,
} from 'lucide-react';
import heroPhoto from '../assets/hero-passport.png';   // ← your image


/* ---------- content data ---------- */
const GUIDES = [
  {
    slug: 'home',
    id: 'guide-home',
    icon: Home,
    title: 'Make it at home',
    blurb: 'No studio needed — a window and a plain wall do the job.',
    tips: [
      'Stand facing a window for soft, even daylight.',
      'Use a plain white or off-white wall as the backdrop.',
      'Hold the camera at eye level, about 1.5 m away.',
      'Neutral expression, eyes open and clearly visible.',
    ],
  },
  {
    slug: 'mobile',
    id: 'guide-mobile',
    icon: Smartphone,
    title: 'With any mobile phone',
    blurb: 'Modern phones are more than good enough for a sharp result.',
    tips: [
      'Use the rear camera — it is sharper than the selfie lens.',
      'Tap the screen to focus on the face and lock exposure.',
      'Don’t zoom; step back and let this tool crop for you.',
      'Shoot portrait orientation with space above the head.',
    ],
  },
  {
    slug: 'android',
    id: 'guide-android',
    icon: Settings2,
    title: 'With an Android phone',
    blurb: 'Turn off the “enhancing” modes that soften your face.',
    tips: [
      'Open Camera → Photo mode, and disable Beauty/filters.',
      'Turn off Portrait/bokeh so the background stays even.',
      'Hold steady or lean the phone on a surface; use a timer.',
      'Disable the watermark in your camera settings.',
    ],
  },
  {
    slug: 'iphone',
    id: 'guide-iphone',
    icon: Camera,
    title: 'With an iPhone',
    blurb: 'Keep it simple — the default 1× lens is the best choice.',
    tips: [
      'Use the built-in Camera app at 1×, not Portrait mode.',
      'Press and hold the face to set AE/AF Lock.',
      'Turn off Live Photo if it introduces motion blur.',
      'Keep the whole head in frame — this tool crops to size.',
    ],
  },
];

const HOW_STEPS = [
  { n: '01', t: 'Upload a photo', d: 'Drop in any picture — even a casual selfie works.' },
  { n: '02', t: 'Auto check', d: 'We detect the face and check resolution, sharpness and framing.' },
  { n: '03', t: 'Pick a format', d: 'Choose your country or document preset for the right dimensions.' },
  { n: '04', t: 'Crop & download', d: 'Fine-tune the frame, then export a pixel-perfect result.' },
];

const GUIDE_LINKS = [
  { label: 'Make it at home', href: '#/guide/home' },
  { label: 'With a mobile phone', href: '#/guide/mobile' },
  { label: 'With Android', href: '#/guide/android' },
  { label: 'With iPhone', href: '#/guide/iphone' },
  { label: 'Photo checklist', href: '#/guide/photo-tips' },
];

/* ---------- tiny helper: scroll-reveal ---------- */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.lp [data-reveal]');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || !('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('revealed'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('revealed');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

/* ---------- sub-components ---------- */
function HeroVisual() {
  return (
    <div className="shot-wrap">
      <div className="shot">
        <img
          src={heroPhoto}
          alt="Illustration showing a portrait transformed into a passport photo"
          className="shot-img"
        />
      </div>
      <div className="shot-labels" aria-label="Photo preview features">
        <span className="chip"><Scissors size={14} /> Auto crop</span>
        <span className="chip"><Wand2 size={14} /> Background removed</span>
        <span className="chip"><Ruler size={14} /> 35 × 45 mm</span>
      </div>
    </div>
  );
}

/* ---------- main ---------- */
export default function LandingPage({ onStart }) {
  useReveal();
    useEffect(() => {
        const hash = window.location.hash;
        // Only handle simple anchors like #about, not routes like #/guide/home
        if (hash && hash.startsWith('#') && !hash.startsWith('#/')) {
        const id = hash.slice(1);
        const el = document.getElementById(id);
        if (el) {
            // Small delay ensures the DOM is painted before scrolling
            const t = setTimeout(() => {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 60);
            return () => clearTimeout(t);
        }
        }
    }, []);
    
  return (
    <div className="lp" id="top">
      <SiteHeader onStart={onStart} current={window.location.hash || '#'} />

      {/* ============ HERO ============ */}
      <section className="hero">
        <div className="hero-grid">
          <div className="hero-copy" data-reveal>
            <span className="kicker">Free · On-device · No sign-up</span>
            <h1 className="hero-title">
              Generate passport<br />size photos<span className="accent">.</span>
            </h1>
            <p className="hero-desc">
              Upload a photo and our browser-based tool detects the face, removes the
              background, corrects lighting and crops to official dimensions — all on
              your device. Nothing is uploaded, nothing is stored.
            </p>
            <div className="hero-actions">
              <button className="btn btn-primary btn-lg" onClick={onStart}>
                Upload image &amp; start
                <ArrowRight size={18} />
              </button>
              <a className="btn btn-ghost btn-lg" href="#how-it-works">How it works</a>
            </div>
            <ul className="trust-row">
                <li><Lock size={16} /> 100% local processing</li>
                <li><Ruler size={16} /> Exact pixel dimensions</li>
                <li><Globe size={16} /> 8+ country presets</li>
            </ul>
          </div>

          <div className="hero-visual" data-reveal data-delay>
            <HeroVisual />
          </div>
        </div>
      </section>

      {/* ============ HOW IT WORKS ============ */}
      <section className="section" id="how-it-works">
        <div className="section-head" data-reveal>
          <span className="kicker">How it works</span>
          <h2>From selfie to passport photo in four steps</h2>
        </div>
        <div className="steps">
          {HOW_STEPS.map((s, i) => (
            <div className="step-card" key={s.n} data-reveal style={{ transitionDelay: `${i * 70}ms` }}>
              <span className="step-num">{s.n}</span>
              <h3>{s.t}</h3>
              <p>{s.d}</p>
            </div>
          ))}
        </div>
        <div className="how-cta" data-reveal>
          <button className="btn btn-primary" onClick={onStart}>Try it now — it's free</button>
        </div>
      </section>

      {/* ============ GUIDES ============ */}
      <section className="section section-tinted" id="guides">
        <div className="section-head" data-reveal>
          <span className="kicker">Guides</span>
          <h2>Take a great passport photo, wherever you are</h2>
          <p className="section-sub">Practical, device-specific tips so the photo you upload is already a good one.</p>
        </div>
        <div className="guides">
        {GUIDES.map((g, i) => (
            <a
            key={g.id}
            href={`#/guide/${g.slug}`}
            className="guide-card"
            data-reveal
            style={{ transitionDelay: `${i * 60}ms` }}
            >
            <span className="guide-icon" aria-hidden="true"><g.icon size={26} /></span>
            <h3>{g.title}</h3>
            <p className="guide-blurb">{g.blurb}</p>
            <span className="guide-read">Read guide →</span>
            </a>
        ))}
        </div>
      </section>

      {/* ============ PHOTO TIPS ============ */}
      <section className="section" id="photo-tips">
        <div className="tips-wrap" data-reveal>
          <div className="tips-copy">
            <span className="kicker">How to take a photo</span>
            <h2>The checklist every passport photo must pass</h2>
            <p>Follow these rules and the built-in validation is far more likely to accept your photo on the first try.</p>
          </div>
          <ul className="tips-list">
            <li><span className="check-badge"><Check size={13} strokeWidth={3} /></span> Even, soft lighting with no harsh shadows on the face or background</li>
            <li><span className="check-badge"><Check size={13} strokeWidth={3} /></span> Plain, light-coloured background — white or off-white is safest</li>
            <li><span className="check-badge"><Check size={13} strokeWidth={3} /></span> Face the camera directly with a neutral expression</li>
            <li><span className="check-badge"><Check size={13} strokeWidth={3} /></span> Both eyes open and visible; hair kept off the face</li>
            <li><span className="check-badge"><Check size={13} strokeWidth={3} /></span> No glasses glare, no hats (unless worn for religious reasons)</li>
            <li><span className="check-badge"><Check size={13} strokeWidth={3} /></span> High enough resolution — the tool warns you if it's too low</li>
          </ul>
        </div>
      </section>

      {/* ============ GUARANTEE ============ */}
      <section className="section section-dark" id="guarantee">
        <div className="section-head light" data-reveal>
          <span className="kicker">Our guarantee</span>
          <h2>What we promise — and what we don't</h2>
        </div>
        <div className="guarantees">
          <div className="g-card" data-reveal>
            <span className="g-icon"><Lock size={26} /></span>
            <h3>Privacy guarantee</h3>
            <p>Your photo never leaves your device. There is no upload, no server and no account processing happens entirely in your browser.</p>
          </div>
          <div className="g-card" data-reveal style={{ transitionDelay: '80ms' }}>
            <span className="g-icon"><Target size={26} /></span>
            <h3>Precision guarantee</h3>
            <p>The exported image matches the exact pixel dimensions and aspect ratio of the preset you select, every time.</p>
          </div>
          <div className="g-card" data-reveal style={{ transitionDelay: '160ms' }}>
            <span className="g-icon"><Handshake size={26} /></span>
            <h3>Honesty promise</h3>
            <p>We help you prepare a well-formed photo - always verify official requirements.</p>
          </div>
        </div>
      </section>

      {/* ============ DATA COLLECTION ============ */}
      <section className="section" id="data-collection">
        <div className="data-wrap" data-reveal>
          <div className="section-head">
            <span className="kicker">Data collection</span>
            <h2>We collect nothing</h2>
          </div>
          <div className="data-grid">
            <div className="data-item"><strong>Your photo</strong><span>Never uploaded, stored or transmitted. It lives only in memory while you edit.</span></div>
            <div className="data-item"><strong>Accounts &amp; email</strong><span>None required. No login, no registration, no tracking of who you are.</span></div>
            <div className="data-item"><strong>Analytics</strong><span>We do not run analytics on your images or send photo data anywhere.</span></div>
            <div className="data-item"><strong>AI models</strong><span>The face-detection model may be downloaded once from a CDN and cached. The image itself is never sent.</span></div>
          </div>
        </div>
      </section>

      {/* ============ ABOUT ============ */}
      <section className="section section-tinted" id="about">
        <div className="about-wrap" data-reveal>
          <span className="kicker">About</span>
          <h2>A fast, private way to make passport photos</h2>
          <p>
            Passport Photo Maker is a browser-only tool built for one job: turning an ordinary
            photo into a correctly-sized passport or ID photo. It runs fully on your device using
            on-device face detection and the Canvas API — so it is fast, free, and private by design.
          </p>
          <p className="about-note">
            The tool prepares your photo to match the selected preset, but acceptance is always up
            to the issuing authority. Check their latest official requirements before you submit.
          </p>
        </div>
      </section>

      {/* ============ FINAL CTA ============ */}
      <section className="cta-band">
        <div className="cta-inner" data-reveal>
          <h2>Ready when you are.</h2>
          <p>Upload a photo and get a pixel-perfect passport photo in seconds.</p>
          <button className="btn btn-light btn-lg" onClick={onStart}>Upload image &amp; start</button>
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <SiteFooter onStart={onStart} />
    </div>
  );
}