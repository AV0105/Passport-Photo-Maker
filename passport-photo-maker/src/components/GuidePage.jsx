import { useEffect, useMemo } from 'react';
import { Lightbulb, AlertTriangle, Info } from 'lucide-react';
import { guides, guideIndex } from '../data/guideContent.js';
import { SiteHeader, SiteFooter } from './SiteChrome.jsx';
import './GuidePage.css';

function estimateReadingTime(blocks) {
  let words = 0;
  for (const b of blocks) {
    if (b.text) words += b.text.split(/\s+/).length;
    if (b.items) for (const it of b.items) words += it.split(/\s+/).length;
  }
  return Math.max(1, Math.ceil(words / 220));
}

function Block({ b }) {
  switch (b.type) {
    case 'p': return <p>{b.text}</p>;

    case 'h2':
      return (
        <div className="gp-section" id={b.id}>
          <h2>{b.text}</h2>
          {b.image && (
            <figure className="gp-figure">
              <img
                src={b.image}
                alt={b.caption || b.text}
                loading="lazy"
                decoding="async"
              />
              {b.caption && <figcaption>{b.caption}</figcaption>}
            </figure>
          )}
        </div>
      );

    case 'h3': return <h3 id={b.id}>{b.text}</h3>;
    case 'ul': return <ul>{b.items.map((t, i) => <li key={i}>{t}</li>)}</ul>;
    case 'ol': return <ol>{b.items.map((t, i) => <li key={i}>{t}</li>)}</ol>;

    case 'callout': {
      const Icon = b.kind === 'warn' ? AlertTriangle : b.kind === 'note' ? Info : Lightbulb;
      return (
        <aside className={`callout callout-${b.kind || 'tip'}`} role="note">
          <span className="callout-icon" aria-hidden="true"><Icon size={18} /></span>
          <div className="callout-body">{b.text}</div>
        </aside>
      );
    }

    default: return null;
  }
}

export default function GuidePage({ slug, onStart, onGoHome }) {
  const guide = guides[slug];
  const readingTime = useMemo(() => guide ? estimateReadingTime(guide.blocks) : 1, [guide]);

  // Build TOC from h2 blocks
  const toc = useMemo(() => {
    if (!guide) return [];
    return guide.blocks.filter((b) => b.type === 'h2' && b.id);
  }, [guide]);

  // Scroll to top on route change
  useEffect(() => { window.scrollTo(0, 0); }, [slug]);

  if (!guide) {
    return (
      <div className="lp">
        <SiteHeader onStart={onStart} current={`#/guide/${slug}`} />
        <main className="gp-error">
          <h1>Guide not found</h1>
          <p>We don't have a guide at that URL.</p>
          <div className="gp-error-actions">
            <button className="btn btn-primary" onClick={onGoHome}>Back to home</button>
          </div>
        </main>
        <SiteFooter onStart={onStart} />
      </div>
    );
  }

  return (
    <div className="lp">
      <SiteHeader onStart={onStart} current={`#/guide/${slug}`} />

      <main className="gp">
        <div className="gp-breadcrumb">
          <a href="#" onClick={(e) => { e.preventDefault(); onGoHome(); }}>Home</a>
          <span aria-hidden="true">/</span>
          <a href="#/guide/home" onClick={(e) => { if (slug === 'home') e.preventDefault(); }}>Guides</a>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{guide.title}</span>
        </div>

        <header className="gp-hero">
          <h1 className="gp-title">{guide.title}</h1>
          <p className="gp-subtitle">{guide.subtitle}</p>
        </header>

        <div className="gp-layout">
          <aside className="gp-toc" aria-label="Table of contents">
            <h4>On this page</h4>
            <ul>
              {toc.map((t) => (
                <li key={t.id}><a href={`#${t.id}`}>{t.text}</a></li>
              ))}
              <li><a href="#related">Related guides</a></li>
            </ul>
          </aside>

          <article className="gp-article">
            {guide.blocks.map((b, i) => <Block key={i} b={b} />)}

            <section className="gp-related" id="related">
              <h2>Related guides</h2>
              <div className="gp-related-grid">
                {guideIndex.filter((g) => g.slug !== slug).slice(0, 3).map((g) => (
                  <a key={g.slug} href={`#/guide/${g.slug}`} className="gp-related-card">
                    <h3>{g.title}</h3>
                    <p>{g.desc}</p>
                  </a>
                ))}
              </div>
            </section>
          </article>
        </div>

        <section className="gp-cta">
          <h2>Ready to make your photo?</h2>
          <p>Upload a photo and get a pixel-perfect passport result in seconds.</p>
          <button className="btn btn-light btn-lg" onClick={onStart}>Upload image &amp; start</button>
        </section>
      </main>

      <SiteFooter onStart={onStart} />
    </div>
  );
}