'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import { ROBOTS } from '@/data/robots'

type Robot = typeof ROBOTS[0]

/* ─── Helpers ────────────────────────────────────────────────────────────── */
function PdfIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="12" y1="18" x2="12" y2="12" /><line x1="9" y1="15" x2="15" y2="15" />
    </svg>
  )
}

function ArrowLeftIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
    </svg>
  )
}

/* ─── Models Grid ────────────────────────────────────────────────────────── */
function ModelsSection({ robot }: { robot: Robot }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const models = (robot as any).models as Array<{
    id: string; name: string; src: string; alt: string; desc?: string; pdfLink?: string
  }> | undefined
  if (!models?.length) return null

  return (
    <section className="rd-section">
      <div className="rd-section-label">Available Models</div>
      <h2 className="rd-section-title">Choose Your Configuration</h2>
      <p className="rd-section-sub">Select the model that best fits your operational requirements.</p>
      <div className="rd-model-grid">
        {models.map(m => (
          <div key={m.id} className="rd-model-card">
            <div style={{ position: 'relative', height: '140px', overflow: 'hidden' }}>
              <Image src={m.src} alt={m.alt} fill style={{ objectFit: 'cover' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(var(--bg-map-rgb),0.8) 0%,transparent 55%)' }} />
              <p style={{ position: 'absolute', bottom: '10px', left: '12px', right: '12px', fontFamily: 'var(--font-display)', fontSize: '0.78rem', fontWeight: 700, color: 'var(--white)', letterSpacing: '0.05em' }}>{m.name}</p>
            </div>
            <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {m.desc && <p style={{ fontFamily: 'var(--font-light)', fontSize: '0.72rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>{m.desc}</p>}
              {m.pdfLink && (
                <a href={m.pdfLink} target="_blank" rel="noopener noreferrer" className="rd-pdf-btn">
                  <PdfIcon /> Spec Sheet
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ─── Use-cases Accordion (AMR) ──────────────────────────────────────────── */
function UseCasesSection({ robot }: { robot: Robot }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const useCases = (robot as any).useCases as Array<{
    id: string; title: string; subtitle: string; imgSrc: string; imgAlt: string;
    features: string[]; industries: string[]
  }> | undefined
  const [openIdx, setOpenIdx] = useState<number | null>(0)
  if (!useCases?.length) return null

  return (
    <section className="rd-section">
      <div className="rd-section-label">Use Cases</div>
      <h2 className="rd-section-title">Industry Applications</h2>
      <p className="rd-section-sub" style={{ marginBottom: '1.5rem' }}>
        Explore how our robots are deployed across industries and workflows.
      </p>
      {useCases.map((uc, i) => {
        const isOpen = openIdx === i
        return (
          <div key={uc.id} className={`rd-accordion${isOpen ? ' open' : ''}`}>
            <button className="rd-accordion-hd" onClick={() => setOpenIdx(isOpen ? null : i)}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                <span style={{ width: '7px', height: '7px', borderRadius: '50%', flexShrink: 0, transition: 'background 0.22s', background: isOpen ? 'var(--red-bright)' : 'rgba(var(--red-dark-rgb),0.35)' }} />
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.85rem', fontWeight: 700, color: isOpen ? 'var(--text-primary)' : 'var(--text-secondary)', letterSpacing: '0.02em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{uc.title}</span>
              </div>
              <svg className={`rd-chevron${isOpen ? ' open' : ''}`} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
            {isOpen && (
              <div className="rd-accordion-body">
                <div className="rd-usecase-grid">
                  <div style={{ position: 'relative', borderRadius: '10px', overflow: 'hidden', aspectRatio: '4/3', border: '1px solid rgba(var(--red-dark-rgb),0.2)' }}>
                    <Image src={uc.imgSrc} alt={uc.imgAlt} fill style={{ objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(var(--bg-map-rgb),0.65) 0%,transparent 60%)' }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <p style={{ fontFamily: 'var(--font-light)', fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.75 }}>{uc.subtitle}</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {uc.features.map(f => (
                        <div key={f} className="rd-feature-row">
                          <span className="rd-feature-dot" />{f}
                        </div>
                      ))}
                    </div>
                    {uc.industries?.length > 0 && (
                      <div>
                        <p style={{ fontFamily: 'var(--font-display)', fontSize: '0.48rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '8px' }}>Industries</p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                          {uc.industries.map(ind => (
                            <span key={ind} className="rd-tag">
                              <span style={{ width: '3px', height: '3px', borderRadius: '50%', background: 'var(--red-bright)', flexShrink: 0 }} />
                              {ind}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )
      })}
    </section>
  )
}

/* ─── Generic Detail Section ─────────────────────────────────────────────── */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function DetailSection({ sectionKey, section, delay = 0 }: { sectionKey: string; section: any; delay?: number }) {
  const isPackaging  = sectionKey === 'packaging'
  const isIndustries = sectionKey === 'industries'

  return (
    <section className="rd-section" style={{ animationDelay: `${delay}s` }}>
      <div className="rd-detail-grid">
        {/* image */}
        <div className="rd-img-block">
          <Image src={section.imgSrc} alt={section.imgAlt} fill style={{ objectFit: 'cover' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(var(--bg-map-rgb),0.55) 0%,transparent 60%)' }} />
          <div style={{ position: 'absolute', bottom: '12px', left: '14px', padding: '4px 14px', borderRadius: '100px', background: 'rgba(var(--bg-map-rgb),0.8)', border: '1px solid rgba(var(--red-dark-rgb),0.35)', backdropFilter: 'blur(6px)' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.5rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--red-bright)' }}>{section.sectionLabel}</span>
          </div>
        </div>

        {/* content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <div className="rd-section-label">{section.sectionLabel}</div>
            <h3 className="rd-section-title" style={{ fontSize: 'clamp(1.1rem,2.5vw,1.55rem)' }}>{section.title}</h3>
            <p className="rd-section-sub">{section.subtitle}</p>
          </div>
          <div style={{ height: '1px', background: 'linear-gradient(90deg,rgba(var(--red-dark-rgb),0.4),transparent)' }} />

          {/* features */}
          {!isPackaging && !isIndustries && section.features && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
              {(section.features as string[]).map(feat => (
                <div key={feat} className="rd-feature-row">
                  <span className="rd-feature-dot" />{feat}
                </div>
              ))}
            </div>
          )}

          {/* industry tags */}
          {isIndustries && section.features && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {(section.features as string[]).map(feat => (
                <span key={feat} className="rd-tag">
                  <span style={{ width: '3px', height: '3px', borderRadius: '50%', background: 'var(--red-bright)', flexShrink: 0 }} />
                  {feat}
                </span>
              ))}
            </div>
          )}

          {/* packaging */}
          {isPackaging && section.includes && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {(section.includes as { item: string; detail: string }[]).map(inc => (
                <div key={inc.item} className="rd-pkg-item">
                  <p className="rd-pkg-title">{inc.item}</p>
                  <p className="rd-pkg-desc">{inc.detail}</p>
                </div>
              ))}
              {section.ctaLink && (
                <a href={section.ctaLink} target="_blank" rel="noopener noreferrer" className="rd-pdf-btn" style={{ marginTop: '6px', width: 'fit-content' }}>
                  <PdfIcon />{section.ctaLabel ?? 'Download Spec Sheet'}
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

/* ─── Sticky Sidebar Nav ─────────────────────────────────────────────────── */
function SidebarNav({ robot, activeSection }: { robot: Robot; activeSection: string }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const r = robot as any
  const SECTION_KEYS = ['display', 'navigation', 'voiceAssistant', 'industries', 'parcelTray', 'packaging'] as const
  const populated = SECTION_KEYS.filter(k => r[k] != null)
  const hasModels   = Array.isArray(r.models)   && r.models.length > 0
  const hasUseCases = Array.isArray(r.useCases) && r.useCases.length > 0

  const labels: Record<string, string> = {
    display: 'Core Capability',
    navigation: 'Mobility',
    voiceAssistant: 'Interaction',
    industries: 'Industries',
    parcelTray: 'Utility',
    packaging: "What's Included",
    models: 'Models',
    useCases: 'Use Cases',
  }

  const all = [
    ...populated,
    ...(hasModels ? ['models'] : []),
    ...(hasUseCases ? ['useCases'] : []),
  ]

  return (
    <nav className="rd-sidebar-nav">
      <p style={{ fontFamily: 'var(--font-display)', fontSize: '0.48rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '12px' }}>Contents</p>
      {all.map(key => (
        <a
          key={key}
          href={`#rd-${key}`}
          className={`rd-nav-item${activeSection === key ? ' active' : ''}`}
        >
          <span className="rd-nav-dot" />
          {labels[key] ?? key}
        </a>
      ))}
    </nav>
  )
}

/* ─── Main Page ──────────────────────────────────────────────────────────── */
export default function RobotDetailPage() {
  const params = useParams()
  const uid = params?.uid as string

  const robot = ROBOTS.find(r => r.uid === uid) ?? null
  const [mounted, setMounted] = useState(false)
  const [activeSection, setActiveSection] = useState('display')
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => { setMounted(true) }, [])

  // Intersection observer for sidebar highlight
  useEffect(() => {
    const sections = document.querySelectorAll('[data-rd-section]')
    if (!sections.length) return
    const io = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) setActiveSection(e.target.getAttribute('data-rd-section') ?? '')
        })
      },
      { rootMargin: '-30% 0px -60% 0px' }
    )
    sections.forEach(s => io.observe(s))
    return () => io.disconnect()
  }, [mounted, robot])

  if (!robot) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', background: 'var(--bg-900)' }}>
        <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: 'var(--text-muted)', letterSpacing: '0.1em' }}>Robot not found.</p>
        <Link href="/robots" className="btn-outline"><ArrowLeftIcon /> Back to Fleet</Link>
      </div>
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const r = robot as any
  const SECTION_KEYS = ['display', 'navigation', 'voiceAssistant', 'industries', 'parcelTray', 'packaging'] as const
  const populatedSections = SECTION_KEYS.filter(k => r[k] != null)

  return (
    <>
      <style>{`
        @keyframes rd-fadeUp   { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes rd-slideIn  { from{opacity:0;transform:translateX(-14px)} to{opacity:1;transform:translateX(0)} }
        @keyframes rd-pulse    { 0%,100%{opacity:0.35} 50%{opacity:1} }
        @keyframes rd-scanline { 0%{top:-4%;opacity:0.55} 100%{top:108%;opacity:0} }
        @keyframes rd-floatUD  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
        @keyframes rd-ringCW   { to{transform:rotate(360deg)} }
        @keyframes rd-ringCCW  { to{transform:rotate(-360deg)} }

        .rd-section {
          padding: 3.5rem 0;
          border-top: 1px solid rgba(var(--red-dark-rgb),0.1);
          animation: rd-fadeUp 0.55s ease both;
        }
        .rd-section:first-child { border-top: none; }

        .rd-section-label {
          font-family: var(--font-display);
          font-size: 0.5rem; letter-spacing: 0.22em; text-transform: uppercase;
          color: var(--red-bright); margin-bottom: 6px;
        }
        .rd-section-title {
          font-family: var(--font-display);
          font-size: clamp(1.5rem, 3.5vw, 2.4rem);
          font-weight: 900; color: var(--text-primary);
          letter-spacing: 0.02em; line-height: 1.1; margin-bottom: 8px;
        }
        .rd-section-sub {
          font-family: var(--font-light);
          font-size: 0.85rem; color: var(--text-secondary); line-height: 1.85;
        }

        .rd-detail-grid {
          display: grid; grid-template-columns: 38fr 62fr;
          gap: 2.5rem; align-items: start; margin-top: 1.5rem;
        }
        @media(max-width:780px) { .rd-detail-grid { grid-template-columns: 1fr; } }

        .rd-img-block {
          position: relative; border-radius: 14px; overflow: hidden;
          border: 1px solid rgba(var(--red-dark-rgb),0.2); background: rgba(var(--red-dark-rgb),0.03);
          aspect-ratio: 4/3;
        }

        .rd-feature-row {
          display: flex; align-items: flex-start; gap: 10px;
          padding: 10px 14px; border-radius: 8px;
          border: 1px solid rgba(var(--red-dark-rgb),0.12); background: rgba(var(--red-dark-rgb),0.04);
          font-family: var(--font-display); font-size: 0.72rem;
          color: var(--text-secondary); letter-spacing: 0.03em; line-height: 1.5;
        }
        .rd-feature-dot {
          width: 4px; height: 4px; border-radius: 50%;
          background: var(--red-bright); flex-shrink: 0; margin-top: 6px;
        }

        .rd-tag {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 5px 12px; border-radius: 100px;
          border: 1px solid rgba(var(--red-dark-rgb),0.2); background: rgba(var(--red-dark-rgb),0.05);
          font-family: var(--font-display); font-size: 0.62rem;
          color: var(--text-secondary); letter-spacing: 0.04em;
        }

        .rd-pdf-btn {
          display: inline-flex; align-items: center; gap: 7px;
          padding: 7px 16px; border-radius: 7px;
          border: 1px solid rgba(var(--red-dark-rgb),0.4); background: rgba(var(--red-dark-rgb),0.08);
          color: var(--red-bright); font-family: var(--font-display);
          font-size: 0.58rem; letter-spacing: 0.12em; text-transform: uppercase;
          text-decoration: none; transition: all 0.22s;
        }
        .rd-pdf-btn:hover { background: rgba(var(--red-dark-rgb),0.2); box-shadow: 0 0 16px rgba(var(--red-dark-rgb),0.28); }

        .rd-pkg-item {
          padding: 12px 16px; border-radius: 9px;
          border: 1px solid rgba(var(--red-dark-rgb),0.15); background: rgba(var(--red-dark-rgb),0.04);
        }
        .rd-pkg-title { font-family: var(--font-display); font-size: 0.75rem; font-weight: 700; color: var(--text-primary); letter-spacing: 0.05em; margin-bottom: 4px; }
        .rd-pkg-desc  { font-family: var(--font-display); font-size: 0.64rem; color: var(--text-muted); line-height: 1.6; }

        .rd-model-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(190px, 1fr)); gap: 14px; margin-top: 1.25rem; }
        .rd-model-card {
          border-radius: 11px; overflow: hidden;
          border: 1px solid rgba(var(--red-dark-rgb),0.15); background: rgba(var(--red-dark-rgb),0.04);
          transition: all 0.28s;
        }
        .rd-model-card:hover { border-color: rgba(var(--red-dark-rgb),0.5); box-shadow: 0 0 22px rgba(var(--red-dark-rgb),0.12); transform: translateY(-3px); }

        /* Accordion */
        .rd-accordion { border: 1px solid rgba(var(--red-dark-rgb),0.15); border-radius: 11px; overflow: hidden; margin-bottom: 10px; transition: border-color 0.22s; }
        .rd-accordion.open { border-color: rgba(var(--red-dark-rgb),0.45); }
        .rd-accordion-hd {
          display: flex; align-items: center; justify-content: space-between; gap: 12px;
          padding: 14px 18px; cursor: pointer; width: 100%;
          background: rgba(var(--red-dark-rgb),0.04); transition: background 0.2s; border: none; text-align: left;
        }
        .rd-accordion-hd:hover { background: rgba(var(--red-dark-rgb),0.09); }
        .rd-chevron { transition: transform 0.28s; flex-shrink: 0; color: var(--text-muted); }
        .rd-chevron.open { transform: rotate(180deg); color: var(--red-bright); }
        .rd-accordion-body { padding: 0 18px 18px; }
        .rd-usecase-grid { display: grid; grid-template-columns: 32fr 68fr; gap: 1.5rem; margin-top: 14px; }
        @media(max-width:640px) { .rd-usecase-grid { grid-template-columns: 1fr; } }

        /* Sidebar nav */
        .rd-sidebar-nav {
          position: sticky; top: 6rem; display: flex; flex-direction: column; gap: 4px;
        }
        .rd-nav-item {
          display: flex; align-items: center; gap: 9px;
          padding: 7px 10px; border-radius: 7px;
          font-family: var(--font-display); font-size: 0.62rem;
          letter-spacing: 0.1em; text-transform: uppercase;
          color: var(--text-muted); text-decoration: none;
          transition: all 0.22s; border: 1px solid transparent;
        }
        .rd-nav-item:hover { color: var(--red-bright); background: rgba(var(--red-dark-rgb),0.06); }
        .rd-nav-item.active { color: var(--red-bright); background: rgba(var(--red-dark-rgb),0.1); border-color: rgba(var(--red-dark-rgb),0.22); }
        .rd-nav-dot { width: 5px; height: 5px; border-radius: 50%; background: rgba(var(--red-dark-rgb),0.3); flex-shrink: 0; transition: background 0.22s; }
        .rd-nav-item.active .rd-nav-dot,
        .rd-nav-item:hover  .rd-nav-dot { background: var(--red-bright); }

        /* Layout */
        .rd-layout { display: grid; grid-template-columns: 180px 1fr; gap: 3rem; align-items: start; }
        @media(max-width:960px) { .rd-layout { grid-template-columns: 1fr; } .rd-sidebar-nav { display: none; } }

        /* Breadcrumb */
        .rd-breadcrumb {
          display: flex; align-items: center; gap: 8px;
          font-family: var(--font-display); font-size: 0.58rem;
          letter-spacing: 0.12em; text-transform: uppercase; color: var(--text-muted);
        }
        .rd-breadcrumb a { color: var(--text-muted); text-decoration: none; transition: color 0.2s; }
        .rd-breadcrumb a:hover { color: var(--red-bright); }
        .rd-breadcrumb-sep { color: rgba(var(--red-dark-rgb),0.35); }

        /* CTA bar */
        .rd-cta-bar {
          display: flex; align-items: center; justify-content: space-between;
          gap: 1rem; flex-wrap: wrap; margin-bottom: 3rem;
        }
        .rd-cta-actions { display: flex; gap: 10px; flex-wrap: wrap; }
        @media(max-width: 540px) {
          .rd-cta-bar { flex-direction: column; align-items: stretch; gap: 0.75rem; }
          .rd-cta-actions { flex-direction: column; gap: 0.75rem; }
          .rd-cta-btn { justify-content: center !important; text-align: center; width: 100%; box-sizing: border-box; }
        }
      `}</style>

      <main style={{ background: 'var(--bg-900)', minHeight: '100vh', paddingBottom: '6rem' }}>

        {/* ── Decorative bg glows ── */}
        <div aria-hidden="true" style={{ position: 'fixed', top: '10%', right: '-10%', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(var(--red-dark-rgb),0.06) 0%,transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />
        <div aria-hidden="true" style={{ position: 'fixed', bottom: '15%', left: '-8%', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(var(--red-dark-rgb),0.04) 0%,transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

        {/* ── Hero Banner ── */}
        <div style={{ position: 'relative', overflow: 'hidden', paddingTop:'clamp(120px, 12vw, 120px)' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(var(--overlay-light-rgb),0.3) 0%, rgba(var(--overlay-light-rgb),0.1) 40%, rgba(var(--overlay-light-rgb),0.96) 100%)' }} />

          {/* scan line */}
          <div aria-hidden="true" style={{ position: 'absolute', left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg,transparent,rgba(var(--red-dark-rgb),0.5),transparent)', animation: 'rd-scanline 4s linear infinite', pointerEvents: 'none', zIndex: 3 }} />

          {/* rings */}
          <div aria-hidden="true" style={{ position: 'absolute', bottom: '20%', right: '8%', width: '220px', height: '220px', borderRadius: '50%', border: '1px solid rgba(var(--red-dark-rgb),0.1)', animation: 'rd-ringCW 18s linear infinite', pointerEvents: 'none', zIndex: 2 }} />
          <div aria-hidden="true" style={{ position: 'absolute', bottom: '18%', right: '10%', width: '160px', height: '160px', borderRadius: '50%', border: '1px solid rgba(var(--red-dark-rgb),0.07)', animation: 'rd-ringCCW 12s linear infinite', pointerEvents: 'none', zIndex: 2 }} />

          {/* hero content */}
          <div className="container-allbotix" style={{ position: 'relative', zIndex: 4, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', paddingBottom: '3rem'}}>
            {/* breadcrumb */}
            <div className="rd-breadcrumb" style={{ animation: mounted ? 'rd-fadeUp 0.5s ease 0.05s both' : 'none', marginBottom: '14px' }}>
              <Link href="/">Home</Link>
              <span className="rd-breadcrumb-sep">›</span>
              <Link href="/products">Products</Link>
              <span className="rd-breadcrumb-sep">›</span>
              <span style={{ color: 'var(--red-bright)' }}>{robot.name}</span>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px', animation: mounted ? 'rd-fadeUp 0.5s ease 0.1s both' : 'none' }}>
              <span style={{ padding: '4px 13px', borderRadius: '100px', background: 'rgba(var(--red-dark-rgb),0.12)', border: '1px solid rgba(var(--red-dark-rgb),0.45)', fontFamily: 'var(--font-display)', fontSize: '0.5rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--red-dark)', backdropFilter: 'blur(6px)' }}>{robot.category}</span>
              <span style={{ padding: '4px 13px', borderRadius: '100px', background: 'rgba(var(--white-rgb),0.7)', border: '1px solid rgba(var(--navy-rgb),0.25)', fontFamily: 'var(--font-display)', fontSize: '0.5rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--navy)', backdropFilter: 'blur(6px)' }}>{robot.tag}</span>
              {r.modelNumber && (
                <span style={{ padding: '4px 13px', borderRadius: '100px', background: 'rgba(var(--white-rgb),0.7)', border: '1px solid rgba(var(--navy-rgb),0.2)', fontFamily: 'var(--font-display)', fontSize: '0.5rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--navy)', backdropFilter: 'blur(6px)' }}>{r.modelNumber}</span>
              )}
            </div>

            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem,5vw,3.8rem)', fontWeight: 900, color: 'var(--navy-deep)', lineHeight: 0.95, letterSpacing: '-0.02em', marginBottom: '14px', animation: mounted ? 'rd-fadeUp 0.55s ease 0.15s both' : 'none' }}>
              {robot.name}
            </h1>
            <div style={{ width: '48px', height: '2px', background: 'linear-gradient(90deg,var(--red-bright),transparent)', marginBottom: '14px', animation: mounted ? 'rd-fadeUp 0.5s ease 0.2s both' : 'none' }} />
            <p style={{ maxWidth: '560px', fontFamily: 'var(--font-light)', fontSize: '0.9rem', color: 'rgba(var(--navy-rgb),0.78)', lineHeight: 1.85, animation: mounted ? 'rd-fadeUp 0.5s ease 0.25s both' : 'none' }}>
              {robot.desc}
            </p>

            {/* spec pills */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '14px', animation: mounted ? 'rd-fadeUp 0.5s ease 0.3s both' : 'none' }}>
              {robot.specs.map(spec => (
                <span key={spec} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '5px 13px', borderRadius: '100px', border: '1px solid rgba(var(--navy-rgb),0.2)', background: 'rgba(var(--white-rgb),0.65)', fontFamily: 'var(--font-display)', fontSize: '0.62rem', color: 'var(--navy)', letterSpacing: '0.04em', backdropFilter: 'blur(6px)' }}>
                  <span style={{ width: '3px', height: '3px', borderRadius: '50%', background: 'var(--red-bright)', flexShrink: 0 }} />
                  {spec}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ── Body ── */}
        <div className="container-allbotix" style={{ position: 'relative', zIndex: 2, paddingTop: '3rem' }}>

          {/* back + CTA bar */}
          <div className="rd-cta-bar" style={{ animation: mounted ? 'rd-fadeUp 0.5s ease 0.35s both' : 'none' }}>
            <Link href="/robots" className="btn-outline rd-cta-btn" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ArrowLeftIcon /> Back to Fleet
            </Link>
            <div className="rd-cta-actions">
              {r.packaging?.ctaLink && (
                <a href={r.packaging.ctaLink} target="_blank" rel="noopener noreferrer" className="btn-outline rd-cta-btn" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.6rem' }}>
                  <PdfIcon /> Download Spec Sheet
                </a>
              )}
              <Link href="#contact" className="btn-primary rd-cta-btn" style={{ fontSize: '0.62rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                Request a Demo
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
              </Link>
            </div>
          </div>

          {/* sidebar + content layout */}
          <div className="rd-layout" ref={contentRef}>

            {/* Sticky sidebar */}
            <SidebarNav robot={robot} activeSection={activeSection} />

            {/* Sections */}
            <div>
              {populatedSections.map((key, i) => (
                <div key={key} id={`rd-${key}`} data-rd-section={key}>
                  <DetailSection sectionKey={key} section={r[key]} delay={i * 0.06} />
                </div>
              ))}

              {/* Models */}
              {Array.isArray(r.models) && r.models.length > 0 && (
                <div id="rd-models" data-rd-section="models">
                  <ModelsSection robot={robot} />
                </div>
              )}

              {/* Use Cases */}
              {Array.isArray(r.useCases) && r.useCases.length > 0 && (
                <div id="rd-useCases" data-rd-section="useCases">
                  <UseCasesSection robot={robot} />
                </div>
              )}
            </div>
          </div>

          {/* ── Bottom CTA ── */}
          <div style={{ marginTop: '5rem', padding: '3rem', borderRadius: '16px', border: '1px solid rgba(var(--red-dark-rgb),0.15)', background: 'rgba(var(--red-dark-rgb),0.04)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 50%,rgba(var(--red-dark-rgb),0.07) 0%,transparent 70%)', pointerEvents: 'none' }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div className="rd-section-label" style={{ textAlign: 'center', marginBottom: '10px' }}>Get Started</div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem,3vw,2.4rem)', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '0.02em', marginBottom: '12px' }}>
                Ready to Deploy <span style={{ color: 'var(--red-bright)' }}>{robot.name}</span>?
              </h2>
              <p style={{ fontFamily: 'var(--font-light)', fontSize: '0.88rem', color: 'var(--text-secondary)', maxWidth: '480px', margin: '0 auto 2rem', lineHeight: 1.85 }}>
                Our engineers are ready to walk you through a live demo and help you find the right configuration for your operation.
              </p>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link href="#contact" className="btn-primary">
                  Request a Consultation
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                </Link>
                <Link href="/products" className="btn-outline">
                  Browse More Robots
                </Link>
              </div>
            </div>
          </div>

        </div>
      </main>
    </>
  )
}