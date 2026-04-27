'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRef, useEffect, useState, useCallback } from 'react'
import { ROBOTS } from '@/data/robots'

const N = ROBOTS.length
function mod(n: number, m: number) { return ((n % m) + m) % m }

type Robot = typeof ROBOTS[0]
type RobotWithIndex = Robot & { index: number }

/* ─── Shared modal CSS ───────────────────────────────────────────────────── */
const MODAL_STYLES = `
  @keyframes robo-pulse     { 0%,100%{opacity:0.35} 50%{opacity:1} }
  @keyframes robo-ringCW    { to{transform:rotate(360deg)} }
  @keyframes robo-ringCCW   { to{transform:rotate(-360deg)} }
  @keyframes robo-scanModal { 0%{top:-3%;opacity:0.6} 100%{top:106%;opacity:0} }
  @keyframes robo-floatUD   { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-14px)} }
  @keyframes robo-fadeUp    { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:translateY(0)} }
  @keyframes robo-slideIn   { from{opacity:0;transform:translateX(-16px)} to{opacity:1;transform:translateX(0)} }

  .robo-close-btn {
    width:40px;height:40px;border-radius:50%;
    border:1px solid rgba(var(--red-dark-rgb),0.3);background:rgba(var(--red-dark-rgb),0.08);
    display:flex;align-items:center;justify-content:center;
    cursor:pointer;transition:all 0.25s;flex-shrink:0;
  }
  .robo-close-btn:hover { background:rgba(var(--red-dark-rgb),0.22);border-color:var(--red-bright);transform:rotate(90deg);box-shadow:0 0 18px rgba(var(--red-dark-rgb),0.35); }

  .robo-nav-btn {
    width:40px;height:40px;border-radius:50%;
    border:1px solid rgba(var(--red-dark-rgb),0.25);background:rgba(var(--red-dark-rgb),0.06);
    display:flex;align-items:center;justify-content:center;
    cursor:pointer;transition:all 0.25s;flex-shrink:0;
  }
  .robo-nav-btn:hover { background:rgba(var(--red-dark-rgb),0.18);border-color:var(--red-bright);box-shadow:0 0 14px rgba(var(--red-dark-rgb),0.3); }

  .robo-thumb {
    cursor:pointer;border-radius:8px;overflow:hidden;
    border:1px solid rgba(var(--red-dark-rgb),0.15);transition:all 0.28s;flex-shrink:0;
  }
  .robo-thumb:hover  { border-color:rgba(var(--red-dark-rgb),0.55);transform:translateY(-2px); }
  .robo-thumb.active { border-color:var(--red-bright);box-shadow:0 0 14px rgba(var(--red-dark-rgb),0.4); }

  /* sections */
  .robo-detail-section { padding:2rem 0;border-top:1px solid rgba(var(--red-dark-rgb),0.1); }
  .robo-section-label  { font-family:var(--font-display);font-size:0.5rem;letter-spacing:0.22em;text-transform:uppercase;color:var(--red-bright);margin-bottom:4px; }
  .robo-section-title  { font-family:var(--font-display);font-size:1.1rem;font-weight:700;color:var(--text-primary);letter-spacing:0.02em;line-height:1.25;margin-bottom:6px; }
  .robo-section-subtitle { font-family:var(--font-light);font-size:0.78rem;color:var(--text-secondary);line-height:1.7; }

  .robo-feature-row {
    display:flex;align-items:flex-start;gap:10px;
    padding:9px 12px;border-radius:8px;
    border:1px solid rgba(var(--red-dark-rgb),0.12);background:rgba(var(--red-dark-rgb),0.04);
    font-family:var(--font-display);font-size:0.7rem;
    color:var(--text-secondary);letter-spacing:0.03em;line-height:1.5;
    animation:robo-slideIn 0.4s ease both;
  }
  .robo-feature-dot { width:4px;height:4px;border-radius:50%;background:var(--red-bright);flex-shrink:0;margin-top:5px; }

  .robo-img-block {
    position:relative;border-radius:12px;overflow:hidden; width:90%;
    border:1px solid rgba(var(--red-dark-rgb),0.2);background:rgba(var(--red-dark-rgb),0.03);aspect-ratio:4/3;
  }

  /* models grid */
  .robo-model-card {
    border-radius:10px;overflow:hidden;
    border:1px solid rgba(var(--red-dark-rgb),0.15);background:rgba(var(--red-dark-rgb),0.04);
    transition:all 0.28s;cursor:default;
  }
  .robo-model-card:hover { border-color:rgba(var(--red-dark-rgb),0.5);box-shadow:0 0 20px rgba(var(--red-dark-rgb),0.12);transform:translateY(-3px); }
  .robo-model-grid { display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:12px; }

  /* PDF button — shared gradient style for all spec sheet CTAs */
  .robo-pdf-btn {
    display:inline-flex;align-items:center;gap:6px;
    padding:8px 16px;border-radius:8px;
    border:1px solid transparent;
    background:linear-gradient(135deg,var(--red-bright),var(--amber));
    color:#ffffff;font-family:var(--font-display);
    font-size:0.58rem;letter-spacing:0.12em;text-transform:uppercase;
    text-decoration:none;transition:all 0.25s;white-space:nowrap;cursor:pointer;
    width:fit-content;
  }
  .robo-pdf-btn:hover { box-shadow:0 0 18px rgba(var(--red-dark-rgb),0.45);transform:translateY(-1px); }
  .robo-pdf-btn:active { transform:translateY(0); }

  /* Larger variant for standalone CTAs (e.g. packaging section) */
  .robo-pdf-btn-lg {
    padding:14px 32px;border-radius:10px;
    font-size:0.62rem;letter-spacing:0.16em;gap:8px;
  }

  /* use-case accordion */
  .robo-usecase-row {
    border:1px solid rgba(var(--red-dark-rgb),0.15);border-radius:10px;overflow:hidden;
    margin-bottom:8px;transition:border-color 0.22s;
  }
  .robo-usecase-row.open { border-color:rgba(var(--red-dark-rgb),0.45); }
  .robo-usecase-header {
    display:flex;align-items:center;justify-content:space-between;gap:12px;
    padding:12px 16px;cursor:pointer;background:rgba(var(--red-dark-rgb),0.04);transition:background 0.2s;
  }
  .robo-usecase-header:hover { background:rgba(var(--red-dark-rgb),0.08); }
  .robo-usecase-chevron { transition:transform 0.28s; flex-shrink:0; }
  .robo-usecase-chevron.open { transform:rotate(180deg); }
  .robo-usecase-body { padding:0 16px 14px; }

  /* industry tag pills */
  .robo-industry-tag {
    display:inline-flex;align-items:center;gap:5px;
    padding:4px 10px;border-radius:100px;
    border:1px solid rgba(var(--red-dark-rgb),0.2);background:rgba(var(--red-dark-rgb),0.05);
    font-family:var(--font-display);font-size:0.58rem;color:var(--text-muted);letter-spacing:0.06em;
  }

  /* packaging */
  .robo-pkg-item { padding:10px 14px;border-radius:8px;border:1px solid rgba(var(--red-dark-rgb),0.15);background:rgba(var(--red-dark-rgb),0.04);animation:robo-slideIn 0.4s ease both; }
  .robo-pkg-title { font-family:var(--font-display);font-size:0.72rem;font-weight:700;color:var(--text-primary);letter-spacing:0.06em;margin-bottom:3px; }
  .robo-pkg-desc  { font-family:var(--font-display);font-size:0.62rem;color:var(--text-muted);line-height:1.55; }

  .robo-spec-pill {
    display:inline-flex;align-items:center;gap:6px;padding:6px 12px;border-radius:100px;
    border:1px solid rgba(var(--red-dark-rgb),0.18);background:rgba(var(--red-dark-rgb),0.05);
    font-family:var(--font-display);font-size:0.62rem;color:var(--text-secondary);letter-spacing:0.04em;
  }
  .robo-cta-btn {
    display:inline-flex;align-items:center;gap:8px;padding:10px 22px;border-radius:8px;
    border:1px solid rgba(var(--red-dark-rgb),0.45);
    background:linear-gradient(135deg,rgba(var(--red-dark-rgb),0.2),rgba(var(--red-dark-rgb),0.08));
    color:var(--text-primary);font-family:var(--font-display);font-size:0.66rem;
    letter-spacing:0.14em;text-transform:uppercase;cursor:pointer;transition:all 0.25s;text-decoration:none;
  }
  .robo-cta-btn:hover { background:rgba(var(--red-dark-rgb),0.28);box-shadow:0 0 20px rgba(var(--red-dark-rgb),0.3); }

  .robo-grid-2 { display:grid;grid-template-columns:35fr 65fr;gap:1.5rem;align-items:start; }
  @media(max-width:680px) { .robo-grid-2 { grid-template-columns:1fr; } }

  /* ─── Responsive modal layout ───────────────────────────────────────── */
  .robo-modal-topbar {
    display:flex;align-items:center;justify-content:space-between;gap:1rem;
    padding:0.9rem 1.75rem;border-bottom:1px solid rgba(var(--red-dark-rgb),0.12);flex-shrink:0;
  }
  .robo-modal-topbar-status { font-family:var(--font-display);font-size:0.55rem;letter-spacing:0.2em;text-transform:uppercase;color:var(--red-bright);white-space:nowrap; }
  .robo-modal-topbar-name {
    font-family:var(--font-display);font-size:0.72rem;font-weight:700;color:var(--text-primary);
    letter-spacing:0.06em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:220px;
  }

  .robo-modal-hero {
    display:grid;grid-template-columns:65fr 35fr;gap:2rem;
    padding:2rem 2.5rem 0;align-items:center;
  }
  .robo-modal-hero-img-col { display:flex;align-items:center;justify-content:center;position:relative;min-height:300px; }
  .robo-modal-image-wrap { width:400px;height:290px;max-width:100%;border-radius:18px;overflow:hidden;border:1px solid rgba(var(--red-dark-rgb),0.4);box-shadow:0 0 50px rgba(var(--red-dark-rgb),0.15),0 30px 70px rgba(var(--black-rgb),0.55);position:relative; }
  .robo-modal-ring-1    { width:240px;height:240px; }
  .robo-modal-ring-2    { width:340px;height:340px; }
  .robo-modal-ring-glow { width:380px;height:380px; }

  .robo-modal-body-padding { padding:0 2.5rem 2.5rem; }
  .robo-modal-fleet { width:min(175px,20vw);flex-shrink:0;border-left:1px solid rgba(var(--red-dark-rgb),0.1);padding:1.25rem 0.875rem;display:flex;flex-direction:column;gap:8px;overflow-y:auto; }

  @media(max-width:900px) {
    .robo-modal-topbar       { padding:0.7rem 1rem;gap:0.75rem; }
    .robo-modal-topbar-name  { max-width:140px;font-size:0.66rem; }
    .robo-modal-hero         { grid-template-columns:1fr;gap:1.25rem;padding:1.5rem 1.25rem 0; }
    .robo-modal-hero-img-col { min-height:240px; }
    .robo-modal-image-wrap   { width:320px;height:232px; }
    .robo-modal-ring-1       { width:200px;height:200px; }
    .robo-modal-ring-2       { width:280px;height:280px; }
    .robo-modal-ring-glow    { width:320px;height:320px; }
    .robo-modal-body-padding { padding:0 1.25rem 1.5rem; }
    .robo-detail-section     { padding:1.5rem 0; }
    .robo-modal-fleet        { display:none; }
  }
  @media(max-width:560px) {
    .robo-modal-topbar         { padding:0.5rem 0.75rem;gap:0.5rem; }
    .robo-modal-topbar-status  { font-size:0.5rem;letter-spacing:0.16em; }
    .robo-modal-topbar-name    { max-width:100px;font-size:0.6rem; }
    .robo-modal-hero           { padding:1rem 0.75rem 0; }
    .robo-modal-hero-img-col   { min-height:200px; }
    .robo-modal-image-wrap     { width:260px;height:188px;border-radius:14px; }
    .robo-modal-ring-1         { width:160px;height:160px; }
    .robo-modal-ring-2         { width:220px;height:220px; }
    .robo-modal-ring-glow      { width:260px;height:260px; }
    .robo-modal-body-padding   { padding:0 0.75rem 1rem; }
    .robo-section-title        { font-size:1rem; }
    .robo-model-grid           { grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:10px; }
  }
`

/* ─── PDF icon SVG ───────────────────────────────────────────────────────── */
function PdfIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="12" y1="18" x2="12" y2="12" /><line x1="9" y1="15" x2="15" y2="15" />
    </svg>
  )
}

/* ─── Models grid (Alpha Dog, Cleaning, Serving, AMR) ───────────────────── */
function ModelsSection({ robot }: { robot: Robot }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const models = (robot as any).models as Array<{
    id: string; name: string; src: string; alt: string; desc?: string; pdfLink?: string
  }> | undefined
  if (!models?.length) return null

  return (
    <div className="robo-detail-section" style={{ animation: 'robo-fadeUp 0.5s ease 0.05s both' }}>
      <p className="robo-section-label">Available Models</p>
      <p className="robo-section-title">Choose Your Configuration</p>
      <p className="robo-section-subtitle" style={{ marginBottom: '1.25rem' }}>
        Select the model that best fits your operational requirements.
      </p>
      <div className="robo-model-grid">
        {models.map((m, i) => (
          <div key={m.id} className="robo-model-card" style={{ animationDelay: `${i * 0.07}s` }}>
            {/* image */}
            <div style={{ position: 'relative', height: '240px', overflow: 'hidden' }}>
              <Image src={m.src} alt={m.alt} fill style={{ objectFit: 'cover' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(var(--bg-map-rgb),0.75) 0%,transparent 55%)' }} />
              <p style={{ position: 'absolute', bottom: '8px', left: '10px', right: '10px', fontFamily: 'var(--font-display)', fontSize: '0.72rem', fontWeight: 700, color: 'var(--white)', letterSpacing: '0.06em' }}>{m.name}</p>
            </div>
            {/* body */}
            <div style={{ padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {m.desc && (
                <p style={{ fontFamily: 'var(--font-light)', fontSize: '0.68rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{m.desc}</p>
              )}
              {m.pdfLink && (
                <a href={m.pdfLink} target="_blank" rel="noopener noreferrer" className="robo-pdf-btn">
                  <PdfIcon />
                  Spec Sheet
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─── Industries / use-cases tags section ───────────────────────────────── */
function IndustriesSection({ section, delay = 0 }: { section: { sectionLabel: string; title: string; subtitle: string; imgSrc: string; imgAlt: string; features: string[] }; delay?: number }) {
  return (
    <div className="robo-detail-section" style={{ animation: `robo-fadeUp 0.5s ease ${delay}s both` }}>
      <div className="robo-grid-2">
        {/* image */}
        <div className="robo-img-block">
          <Image src={section.imgSrc} alt={section.imgAlt} fill style={{ objectFit: 'cover' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(var(--bg-map-rgb),0.5) 0%,transparent 55%)' }} />
          <div style={{ position: 'absolute', bottom: '10px', left: '12px', padding: '4px 12px', borderRadius: '100px', background: 'rgba(var(--bg-map-rgb),0.78)', border: '1px solid rgba(var(--red-dark-rgb),0.35)', backdropFilter: 'blur(6px)' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.48rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--red-bright)' }}>{section.sectionLabel}</span>
          </div>
        </div>
        {/* content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <p className="robo-section-label">{section.sectionLabel}</p>
            <p className="robo-section-title">{section.title}</p>
            <p className="robo-section-subtitle">{section.subtitle}</p>
          </div>
          <div style={{ height: '1px', background: 'linear-gradient(90deg,rgba(var(--red-dark-rgb),0.35),transparent)' }} />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {section.features.map((feat, i) => (
              <span key={feat} className="robo-industry-tag" style={{ animationDelay: `${delay + i * 0.05}s` }}>
                <span style={{ width: '3px', height: '3px', borderRadius: '50%', background: 'var(--red-bright)', flexShrink: 0 }} />
                {feat}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── AMR use-cases accordion ────────────────────────────────────────────── */
function UseCasesSection({ robot }: { robot: Robot }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const useCases = (robot as any).useCases as Array<{
    id: string; title: string; subtitle: string; imgSrc: string; imgAlt: string;
    features: string[]; industries: string[]
  }> | undefined
  if (!useCases?.length) return null

  const [openIdx, setOpenIdx] = useState<number | null>(0)

  return (
    <div className="robo-detail-section" style={{ animation: 'robo-fadeUp 0.5s ease 0.3s both' }}>
      <p className="robo-section-label">Use Cases</p>
      <p className="robo-section-title">Industry Applications</p>
      <p className="robo-section-subtitle" style={{ marginBottom: '1.25rem' }}>
        Explore how our AMR robots are deployed across industries and workflows.
      </p>

      {useCases.map((uc, i) => {
        const isOpen = openIdx === i
        return (
          <div key={uc.id} className={`robo-usecase-row${isOpen ? ' open' : ''}`}>
            {/* header */}
            <div className="robo-usecase-header" onClick={() => setOpenIdx(isOpen ? null : i)}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: isOpen ? 'var(--red-bright)' : 'rgba(var(--red-dark-rgb),0.35)', flexShrink: 0, transition: 'background 0.22s' }} />
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.78rem', fontWeight: 700, color: isOpen ? 'var(--text-primary)' : 'var(--text-secondary)', letterSpacing: '0.03em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {uc.title}
                </span>
              </div>
              <svg className={`robo-usecase-chevron${isOpen ? ' open' : ''}`} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(var(--red-dark-rgb),0.7)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>

            {/* body */}
            {isOpen && (
              <div className="robo-usecase-body">
                <div className="robo-grid-2" style={{ marginBottom: '12px' }}>
                  {/* image */}
                  <div className="robo-img-block">
                    <Image src={uc.imgSrc} alt={uc.imgAlt} fill style={{ objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(var(--bg-map-rgb),0.5) 0%,transparent 55%)' }} />
                  </div>
                  {/* text */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <p style={{ fontFamily: 'var(--font-light)', fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>{uc.subtitle}</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {uc.features.map(f => (
                        <div key={f} className="robo-feature-row">
                          <span className="robo-feature-dot" />
                          {f}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                {/* industries */}
                {uc.industries?.length > 0 && (
                  <div>
                    <p style={{ fontFamily: 'var(--font-display)', fontSize: '0.48rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '8px' }}>Industries</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {uc.industries.map(ind => (
                        <span key={ind} className="robo-industry-tag">
                          <span style={{ width: '3px', height: '3px', borderRadius: '50%', background: 'var(--red-bright)', flexShrink: 0 }} />
                          {ind}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

/* ─── Standard detail section (image + features or packaging) ───────────── */
function DetailSection({
  sectionKey, section, delay = 0,
}: {
  sectionKey: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  section: any
  delay?: number
}) {
  const isPackaging = sectionKey === 'packaging'
  const isIndustries = sectionKey === 'industries'

  if (isIndustries) {
    return <IndustriesSection section={section} delay={delay} />
  }

  return (
    <div className="robo-detail-section" style={{ animation: `robo-fadeUp 0.5s ease ${delay}s both` }}>
      <div className="robo-grid-2">
        {/* image */}
        <div className="robo-img-block">
          <Image src={section.imgSrc} alt={section.imgAlt} fill style={{ objectFit: 'cover' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(var(--bg-map-rgb),0.5) 0%,transparent 55%)' }} />
          <div style={{ position: 'absolute', bottom: '10px', left: '12px', padding: '4px 12px', borderRadius: '100px', background: 'rgba(var(--bg-map-rgb),0.78)', border: '1px solid rgba(var(--red-dark-rgb),0.35)', backdropFilter: 'blur(6px)' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.48rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--red-bright)' }}>{section.sectionLabel}</span>
          </div>
        </div>
        {/* content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <p className="robo-section-label">{section.sectionLabel}</p>
            <p className="robo-section-title">{section.title}</p>
            <p className="robo-section-subtitle">{section.subtitle}</p>
          </div>
          <div style={{ height: '1px', background: 'linear-gradient(90deg,rgba(var(--red-dark-rgb),0.35),transparent)' }} />

          {/* features */}
          {!isPackaging && section.features && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {(section.features as string[]).map((feat: string, i: number) => (
                <div key={feat} className="robo-feature-row" style={{ animationDelay: `${delay + i * 0.06}s` }}>
                  <span className="robo-feature-dot" />{feat}
                </div>
              ))}
            </div>
          )}

          {/* packaging includes */}
          {isPackaging && section.includes && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {(section.includes as { item: string; detail: string }[]).map((inc, i) => (
                <div key={inc.item} className="robo-pkg-item" style={{ animationDelay: `${delay + i * 0.07}s` }}>
                  <p className="robo-pkg-title">{inc.item}</p>
                  <p className="robo-pkg-desc">{inc.detail}</p>
                </div>
              ))}
              {section.ctaLink && (
                <a
                  href={section.ctaLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="robo-pdf-btn robo-pdf-btn-lg"
                  style={{ marginTop: '4px' }}
                >
                  <PdfIcon />
                  {section.ctaLabel ?? 'Download Spec Sheet'}
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/* ─── All detail content for one robot ──────────────────────────────────── */
function RobotDetailContent({ robot }: { robot: Robot }) {
  // ordered section keys — industries renders after voiceAssistant, before packaging
  const SECTION_KEYS = ['display', 'navigation', 'voiceAssistant', 'industries', 'parcelTray', 'packaging'] as const
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const r = robot as any
  const populatedSections = SECTION_KEYS.filter(k => r[k] != null)
  const hasModels = Array.isArray(r.models) && r.models.length > 0
  const hasUseCases = Array.isArray(r.useCases) && r.useCases.length > 0

  return (
    <div>
      {/* ── HERO ── */}
      <div className="robo-modal-hero">
        {/* hero text */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', animation: 'robo-fadeUp 0.5s ease 0.1s both' }}>
          {/* badges */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            <span style={{ padding: '4px 12px', borderRadius: '100px', background: 'rgba(var(--red-dark-rgb),0.1)', border: '1px solid rgba(var(--red-dark-rgb),0.3)', fontFamily: 'var(--font-display)', fontSize: '0.5rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--red-bright)' }}>
              {robot.category}
            </span>
            <span style={{ padding: '4px 12px', borderRadius: '100px', background: 'rgba(var(--red-dark-rgb),0.05)', border: '1px solid rgba(var(--red-dark-rgb),0.18)', fontFamily: 'var(--font-display)', fontSize: '0.5rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
              {robot.tag}
            </span>
            {r.modelNumber && (
              <span style={{ padding: '4px 12px', borderRadius: '100px', background: 'transparent', border: '1px solid rgba(var(--red-dark-rgb),0.15)', fontFamily: 'var(--font-display)', fontSize: '0.5rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                {r.modelNumber}
              </span>
            )}
          </div>

          {/* name */}
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem,3.5vw,2.6rem)', fontWeight: 900, color: 'var(--text-primary)', lineHeight: 0.95, letterSpacing: '-0.02em', marginBottom: '10px' }}>
              {robot.name}
            </h2>
            <div style={{ width: '36px', height: '2px', background: 'linear-gradient(90deg,var(--red-bright),transparent)' }} />
          </div>

          <p style={{ fontFamily: 'var(--font-light)', fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.85 }}>
            {robot.desc}
          </p>

          {/* specs */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {robot.specs.map(spec => (
              <span key={spec} className="robo-spec-pill">
                <span style={{ width: '3px', height: '3px', borderRadius: '50%', background: 'var(--red-bright)', flexShrink: 0 }} />
                {spec}
              </span>
            ))}
          </div>

          {/* models quick count badge */}
          {hasModels && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ padding: '5px 14px', borderRadius: '100px', background: 'rgba(var(--red-dark-rgb),0.1)', border: '1px solid rgba(var(--red-dark-rgb),0.3)', fontFamily: 'var(--font-display)', fontSize: '0.56rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--red-bright)' }}>
                {r.models.length} Models Available ↓
              </span>
            </div>
          )}
        </div>
        {/* floating image */}
        <div className="robo-modal-hero-img-col">
          <div aria-hidden="true" className="robo-modal-ring-1" style={{ position: 'absolute', top: '50%', left: '50%', borderRadius: '50%', border: '1px solid rgba(var(--red-dark-rgb),0.07)', transform: 'translate(-50%,-50%)', animation: 'robo-ringCW 18s linear infinite', pointerEvents: 'none' }} />
          <div aria-hidden="true" className="robo-modal-ring-2" style={{ position: 'absolute', top: '50%', left: '50%', borderRadius: '50%', border: '1px solid rgba(var(--red-dark-rgb),0.04)', transform: 'translate(-50%,-50%)', animation: 'robo-ringCCW 26s linear infinite', pointerEvents: 'none' }} />
          <div aria-hidden="true" className="robo-modal-ring-glow" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', borderRadius: '50%', background: 'radial-gradient(circle,rgba(var(--red-dark-rgb),0.09) 0%,transparent 65%)', pointerEvents: 'none' }} />
          <div style={{ animation: 'robo-floatUD 4s ease-in-out infinite', position: 'relative', zIndex: 2, maxWidth: '100%' }}>
            <div aria-hidden="true" style={{ position: 'absolute', inset: 0, overflow: 'hidden', borderRadius: '18px', zIndex: 3, pointerEvents: 'none' }}>
              <div style={{ position: 'absolute', left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg,transparent,rgba(var(--red-dark-rgb),0.4),transparent)', animation: 'robo-scanModal 3.5s linear infinite' }} />
            </div>
            <div className="robo-modal-image-wrap">
              <Image src={robot.src} alt={robot.name} fill style={{ objectFit: 'cover' }} priority />
            </div>
          </div>
        </div>
      </div>

      {/* ── ALL SECTIONS ── */}
      <div className="robo-modal-body-padding">

        {/* Models grid — shown first after hero */}
        {hasModels && <ModelsSection robot={robot} />}

        {/* Standard + industries sections */}
        {populatedSections.map((key, idx) => (
          <DetailSection
            key={key}
            sectionKey={key}
            section={r[key]}
            delay={0.1 + idx * 0.08}
          />
        ))}

        {/* AMR use-cases accordion */}
        {hasUseCases && <UseCasesSection robot={robot} />}

        {/* Fallback specs when no sections at all */}
        {!populatedSections.length && !hasModels && !hasUseCases && (
          <div style={{ padding: '2rem 0', borderTop: '1px solid rgba(var(--red-dark-rgb),0.1)', marginTop: '2rem' }}>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '0.52rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '1rem' }}>Core Specifications</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: '8px' }}>
              {robot.specs.map((spec, i) => (
                <div key={spec} className="robo-feature-row" style={{ animationDelay: `${i * 0.07}s` }}>
                  <span className="robo-feature-dot" />{spec}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

/* ─── Fullscreen Modal ───────────────────────────────────────────────────── */
export function RobotModal({ robot, onClose }: { robot: RobotWithIndex; onClose: () => void }) {
  const [phase, setPhase] = useState<'enter' | 'open' | 'exit'>('enter')
  const [carIdx, setCarIdx] = useState(robot.index)
  const [thumbVisible, setThumbVisible] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('open'), 80)
    const t2 = setTimeout(() => setThumbVisible(true), 500)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = 0 }, [carIdx])

  const handleClose = useCallback(() => {
    setPhase('exit'); setTimeout(onClose, 480)
  }, [onClose])

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose()
      if (e.key === 'ArrowRight') setCarIdx(p => mod(p + 1, N))
      if (e.key === 'ArrowLeft') setCarIdx(p => mod(p - 1, N))
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [handleClose])

  const activeRobot = ROBOTS[carIdx]

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 999, background: 'var(--bg-800)', backdropFilter: 'blur(18px)', display: 'flex', flexDirection: 'column', opacity: phase === 'exit' ? 0 : 1, transition: 'opacity 0.45s ease', padding: '0 1rem' }}>
      <style>{MODAL_STYLES}</style>

      {/* top bar */}
      <div className="robo-modal-topbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
          <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'var(--red-bright)', animation: 'robo-pulse 2s ease-in-out infinite', boxShadow: '0 0 8px rgba(var(--red-dark-rgb),0.8)', flexShrink: 0, display: 'inline-block' }} />
          <span className="robo-modal-topbar-status">
            ROBOT PROFILE — {String(carIdx + 1).padStart(2, '0')} / {String(N).padStart(2, '0')}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, justifyContent: 'center', overflow: 'hidden', minWidth: 0 }}>
          <button className="robo-nav-btn" onClick={() => setCarIdx(p => mod(p - 1, N))} aria-label="Previous">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--navy)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
          </button>
          <span className="robo-modal-topbar-name">
            {activeRobot.name}
          </span>
          <button className="robo-nav-btn" onClick={() => setCarIdx(p => mod(p + 1, N))} aria-label="Next">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--navy)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
          </button>
        </div>
        <button className="robo-close-btn" onClick={handleClose} aria-label="Close">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--navy)" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
        </button>
      </div>

      {/* body */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', minHeight: 0 }}>
        {/* scrollable content */}
        <div ref={scrollRef} key={carIdx} style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
          <RobotDetailContent robot={activeRobot} />
        </div>

        {/* fleet strip */}
        <div className="robo-modal-fleet" style={{ opacity: thumbVisible ? 1 : 0, transform: thumbVisible ? 'translateX(0)' : 'translateX(40px)', transition: 'opacity 0.5s ease,transform 0.5s ease' }}>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: '0.47rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '2px', flexShrink: 0 }}>Fleet</p>
          {ROBOTS.map((r, i) => (
            <div key={r.name} className={`robo-thumb${i === carIdx ? ' active' : ''}`} onClick={() => setCarIdx(i)} role="button" aria-label={r.name}>
              <div style={{ position: 'relative', height: '120px' }}>
                <Image src={r.src} alt={r.name} fill style={{ objectFit: 'cover' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(var(--bg-map-rgb),0.88),transparent 55%)' }} />
                <p style={{ position: 'absolute', bottom: '6px', left: '8px', right: '4px', fontFamily: 'var(--font-display)', fontSize: '0.52rem', fontWeight: 700, color: 'rgba(var(--white-rgb),0.9)', letterSpacing: '0.05em', lineHeight: 1.2 }}>{r.name}</p>
                {i === carIdx && <div style={{ position: 'absolute', inset: 0, border: '1px solid var(--red-bright)', borderRadius: '8px', pointerEvents: 'none' }} />}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* bottom dots */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '0.8rem 1rem', borderTop: '1px solid rgba(var(--red-dark-rgb),0.08)', flexShrink: 0 }}>
        {ROBOTS.map((_, i) => (
          <div key={i} onClick={() => setCarIdx(i)} role="button"
            style={{ width: i === carIdx ? '22px' : '6px', height: '6px', borderRadius: i === carIdx ? '3px' : '50%', background: i === carIdx ? 'var(--red-bright)' : 'rgba(var(--red-dark-rgb),0.3)', cursor: 'pointer', transition: 'all 0.3s ease', boxShadow: i === carIdx ? '0 0 8px rgba(var(--red-dark-rgb),0.6)' : 'none' }}
          />
        ))}
      </div>
    </div>
  )
}

/* ─── Main Showcase Section ──────────────────────────────────────────────── */
export default function RobotShowcaseSection() {
  const [current, setCurrent] = useState(0)
  const [modalRobot, setModalRobot] = useState<RobotWithIndex | null>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const dragStart = useRef(0)
  const isDrag = useRef(false)

  const go = useCallback((idx: number) => setCurrent(mod(idx, N)), [])
  const goNext = useCallback(() => go(current + 1), [go, current])
  const goPrev = useCallback(() => go(current - 1), [go, current])
  const goTo = useCallback((i: number) => go(i), [go])

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(goNext, 2800)
  }, [goNext])

  useEffect(() => { resetTimer(); return () => { if (timerRef.current) clearInterval(timerRef.current) } }, [resetTimer])

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (modalRobot) return
      if (e.key === 'ArrowRight') { goNext(); resetTimer() }
      if (e.key === 'ArrowLeft') { goPrev(); resetTimer() }
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [goNext, goPrev, resetTimer, modalRobot])

  const onPD = (e: React.PointerEvent) => { dragStart.current = e.clientX; isDrag.current = false }
  const onPM = (e: React.PointerEvent) => { if (Math.abs(e.clientX - dragStart.current) > 8) isDrag.current = true }
  const onPU = (e: React.PointerEvent) => {
    const dx = e.clientX - dragStart.current
    if (Math.abs(dx) > 50) { dx < 0 ? goNext() : goPrev(); resetTimer() }
  }

  function cardStyle(i: number): React.CSSProperties {
    let slot = mod(i - current, N)
    if (slot > N / 2) slot -= N
    const abs = Math.abs(slot)
    if (abs > 3) return { opacity: 0, pointerEvents: 'none', zIndex: 0, transform: 'translateX(0) scale(0.4)', transition: 'all 0.55s cubic-bezier(0.4,0,0.2,1)' }
    const sizes = [1, .74, .60, .50], xSteps = [0, 220, 390, 510], opacs = [1, .88, .60, .28], tilts = [0, -8, -16, -22], zIdxs = [10, 8, 6, 4]
    const sign = slot >= 0 ? 1 : -1
    return { transform: `translateX(${sign * xSteps[abs]}px) scale(${sizes[abs]}) rotateY(${sign * tilts[abs]}deg)`, opacity: opacs[abs], zIndex: zIdxs[abs], pointerEvents: 'auto', transition: 'all 0.55s cubic-bezier(0.4,0,0.2,1)' }
  }

  const robot = ROBOTS[current]
  const openModal = useCallback((i: number) => { setModalRobot({ ...ROBOTS[i], index: i }); if (timerRef.current) clearInterval(timerRef.current) }, [])
  const closeModal = useCallback(() => { setModalRobot(null); resetTimer() }, [resetTimer])

  return (
    <>
      {modalRobot && <RobotModal robot={modalRobot} onClose={closeModal} />}

      <section id="project" style={{ position: 'relative', paddingBlock: '6rem', background: 'var(--bg-900)', overflow: 'hidden', borderTop: '1px solid var(--border-soft)' }}>
        <style>{`
          @keyframes rc-fadeUp  { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
          @keyframes rc-scanline{ 0%{top:-4%;opacity:0.5} 100%{top:108%;opacity:0} }
          @keyframes rc-pulse   { 0%,100%{opacity:0.4} 50%{opacity:1} }
          @keyframes rc-ringCW  { to{transform:translate(-50%,-50%) rotate(360deg)} }
          .rc-card-inner { transition:transform 0.35s ease; }
          .rc-card-inner:hover { transform:scale(1.03); }
          .rc-info-enter { animation:rc-fadeUp 0.45s ease both; }
          .rc-btn-nav { width:42px;height:42px;border-radius:50%;border:1px solid var(--border);background:var(--bg-card);display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all 0.25s;flex-shrink:0; }
          .rc-btn-nav:hover { border-color:var(--red-bright);background:var(--red-soft);box-shadow:0 0 18px var(--red-glow); }
          .rc-btn-nav svg { width:16px;height:16px;stroke:var(--text-secondary);fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;transition:stroke 0.2s; }
          .rc-btn-nav:hover svg { stroke:var(--red-bright); }
          .rc-dot { width:6px;height:6px;border-radius:50%;border:1px solid rgba(var(--red-dark-rgb),0.4);background:transparent;cursor:pointer;transition:all 0.25s; }
          .rc-dot.active { background:var(--red-bright);border-color:var(--red-bright);box-shadow:0 0 8px var(--red-glow);transform:scale(1.4); }
          .rc-dot:hover:not(.active) { border-color:var(--red-bright);background:var(--red-soft); }
          .rc-robo-nav-btn { display:flex;align-items:center;gap:7px;padding:6px 14px;border-radius:100px;border:1px solid rgba(var(--red-dark-rgb),0.2);background:rgba(var(--red-dark-rgb),0.05);cursor:pointer;transition:all 0.25s;flex-shrink:0;font-family:var(--font-display);font-size:0.52rem;letter-spacing:0.14em;text-transform:uppercase;color:var(--text-muted); }
          .rc-robo-nav-btn:hover,.rc-robo-nav-btn.active { border-color:rgba(var(--red-dark-rgb),0.55);background:rgba(var(--red-dark-rgb),0.12);color:var(--red-bright); }
          .rc-robo-nav-btn .dot { width:5px;height:5px;border-radius:50%;background:rgba(var(--red-dark-rgb),0.3);flex-shrink:0;transition:background 0.25s; }
          .rc-robo-nav-btn:hover .dot,.rc-robo-nav-btn.active .dot { background:var(--red-bright); }
          @media(max-width:640px){.rc-track{height:260px!important}}
        `}</style>

        <div aria-hidden="true" style={{ position: 'absolute', bottom: '-2rem', left: '50%', transform: 'translateX(-50%)', whiteSpace: 'nowrap', pointerEvents: 'none', fontFamily: 'var(--font-display)', fontSize: 'clamp(5rem,14vw,11rem)', fontWeight: 900, color: 'transparent', WebkitTextStroke: '1px rgba(var(--red-dark-rgb),0.07)', letterSpacing: '0.05em', lineHeight: 1, userSelect: 'none' }}>ROBOTS</div>
        <div aria-hidden="true" style={{ position: 'absolute', top: '20%', right: '-8%', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(var(--red-dark-rgb),0.06) 0%,transparent 70%)', pointerEvents: 'none' }} />

        <div className="container-allbotix" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '2rem', marginBottom: '3.5rem', flexWrap: 'wrap' }}>
            <div>
              <div className="section-tag">Our Fleet</div>
              <h2 className="section-title">Meet the <span>Machines</span><br />That Shape Tomorrow.</h2>
            </div>
            <Link href="/products" className="btn-outline" style={{ flexShrink: 0 }}>
              Explore All Models
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
            </Link>
          </div>

          {/* robot nav pills */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
            {ROBOTS.map((r, i) => (
              <button key={r.name} className={`rc-robo-nav-btn${i === current ? ' active' : ''}`} onClick={() => { goTo(i); resetTimer() }}>
                <span className="dot" />
                {r.name}
              </button>
            ))}
            <button className="rc-robo-nav-btn" onClick={() => openModal(current)} style={{ marginLeft: 'auto', border: '1px solid rgba(var(--red-dark-rgb),0.45)', background: 'rgba(var(--red-dark-rgb),0.1)', color: 'var(--red-bright)' }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6" /><path d="M10 14 21 3" /><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /></svg>
              Full Profile
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '2rem', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
            <div>
              <p style={{ fontFamily: 'var(--font-light)', fontSize: '0.88rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.18em', marginBottom: '4px' }}>For the</p>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem,4vw,3rem)', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '0.04em', lineHeight: 1.1 }}>
                INDUSTRY YOU <span style={{ color: 'var(--red-bright)' }}>SERVE</span>
              </h3>
            </div>
            <p style={{ maxWidth: '260px', fontFamily: 'var(--font-light)', fontSize: '0.82rem', color: 'var(--text-muted)', textAlign: 'right', lineHeight: 1.8 }}>
              We engineer machines that mirror your precision, your ambition, and your scale — because automation is not just deployed, it&apos;s mastered.
            </p>
          </div>

          {/* carousel */}
          <div ref={trackRef} className="rc-track" onPointerDown={onPD} onPointerMove={onPM} onPointerUp={onPU} style={{ position: 'relative', height: '320px', display: 'flex', alignItems: 'center', justifyContent: 'center', perspective: '1200px', cursor: 'grab', touchAction: 'pan-y' }}>
            {ROBOTS.map((r, i) => {
              const slot = (() => { let s = mod(i - current, N); if (s > N / 2) s -= N; return s })()
              const isCenter = slot === 0
              return (
                <div key={r.name} onClick={() => { if (isDrag.current) return; if (isCenter) openModal(i); else { goTo(i); resetTimer() } }} style={{ position: 'absolute', ...cardStyle(i), transformOrigin: slot >= 0 ? 'left center' : 'right center' }}>
                  <div className="rc-card-inner" style={{ width: '200px', height: isCenter ? '300px' : '260px', borderRadius: '14px', overflow: 'hidden', border: isCenter ? '1px solid rgba(var(--red-dark-rgb),0.45)' : '1px solid rgba(var(--red-dark-rgb),0.15)', background: 'var(--bg-card)', position: 'relative', cursor: isCenter ? 'pointer' : 'default' }}>
                    {isCenter && <div aria-hidden="true" style={{ position: 'absolute', left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg,transparent,rgba(var(--red-dark-rgb),0.35),transparent)', animation: 'rc-scanline 3s linear infinite', pointerEvents: 'none', zIndex: 3 }} />}
                    <Image src={r.src} alt={r.name} loading="lazy" width={200} height={300} style={{ objectFit: 'cover' }} />
                    {!isCenter && <div style={{ position: 'absolute', bottom: '10px', left: '50%', transform: 'translateX(-50%)', fontFamily: 'var(--font-display)', fontSize: '0.55rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--navy)', background: 'rgba(var(--overlay-dark-rgb),0.6)', padding: '4px 10px', borderRadius: '4px', backdropFilter: 'blur(6px)', whiteSpace: 'nowrap' }}>{r.name}</div>}
                    {isCenter && (
                      <>
                        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '1.25rem 1rem 1rem', background: 'linear-gradient(to top,rgba(var(--overlay-dark-rgb),0.92) 0%,transparent 100%)', zIndex: 4 }}>
                          <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: 'var(--red-bright)', marginBottom: '6px', animation: 'rc-pulse 2s ease-in-out infinite', boxShadow: '0 0 8px var(--red-glow)' }} />
                          <p style={{ fontFamily: 'var(--font-display)', fontSize: '0.9rem', fontWeight: 700, color: 'rgb(var(--white-rgb))', letterSpacing: '0.05em', marginBottom: '2px' }}>{r.name}</p>
                          <p style={{ fontFamily: 'var(--font-display)', fontSize: '0.55rem', color: 'var(--red-bright)', letterSpacing: '0.16em', textTransform: 'uppercase' }}>{r.tag}</p>
                        </div>
                        <div style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 5, padding: '3px 9px', borderRadius: '100px', background: 'rgba(var(--red-dark-rgb),0.2)', border: '1px solid rgba(var(--red-dark-rgb),0.4)', fontFamily: 'var(--font-display)', fontSize: '0.45rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--red-bright)', backdropFilter: 'blur(6px)' }}>TAP TO EXPAND</div>
                        <div aria-hidden="true" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '180px', height: '180px', borderRadius: '50%', border: '1px solid rgba(var(--red-dark-rgb),0.08)', pointerEvents: 'none', zIndex: 2, animation: 'rc-ringCW 12s linear infinite' }} />
                      </>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* info row */}
          <div key={current} className="rc-info-enter" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1.5rem', marginTop: '2.5rem', flexWrap: 'wrap' }}>
            <div style={{ flex: '1', minWidth: '240px' }}>
              <div className="red-divider" style={{ marginBottom: '0.75rem' }} />
              <p style={{ fontFamily: 'var(--font-light)', fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.85, maxWidth: '480px' }}>{robot.desc}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '0.75rem' }}>
                {robot.specs.map(spec => (
                  <span key={spec} style={{ padding: '4px 10px', borderRadius: '100px', border: '1px solid rgba(var(--red-dark-rgb),0.2)', background: 'rgba(var(--red-dark-rgb),0.05)', fontFamily: 'var(--font-display)', fontSize: '0.58rem', color: 'var(--text-muted)', letterSpacing: '0.04em' }}>{spec}</span>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '1rem' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.65rem', letterSpacing: '0.1em', color: 'var(--text-muted)' }}>
                <span style={{ color: 'var(--red-bright)', fontSize: '1rem', fontWeight: 700 }}>{String(current + 1).padStart(2, '0')}</span>{' / '}{String(N).padStart(2, '0')}
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="rc-btn-nav" onClick={() => { goPrev(); resetTimer() }}><svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6" /></svg></button>
                <button className="rc-btn-nav" onClick={() => { goNext(); resetTimer() }}><svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6" /></svg></button>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                {ROBOTS.map((_, i) => <div key={i} className={`rc-dot${i === current ? ' active' : ''}`} onClick={() => { goTo(i); resetTimer() }} role="button" />)}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}