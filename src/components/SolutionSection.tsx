'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { solutions } from '@/data/solutions'

// ─── Single solution card with 3D tilt + detail preview ──────────────────────
function SolutionCard({
  solution,
  index,
  visible,
}: {
  solution: (typeof solutions)[0]
  index: number
  visible: boolean
}) {
  const cardRef  = useRef<HTMLDivElement>(null)
  const shineRef = useRef<HTMLDivElement>(null)
  const [hovered, setHovered] = useState(false)
  const [expanded, setExpanded] = useState(false)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    const dx = (e.clientX - (rect.left + rect.width  / 2)) / (rect.width  / 2)
    const dy = (e.clientY - (rect.top  + rect.height / 2)) / (rect.height / 2)
    card.style.transform = `perspective(800px) rotateX(${-dy * 8}deg) rotateY(${dx * 8}deg) scale3d(1.03,1.03,1.03) translateZ(8px)`
    if (shineRef.current) {
      const px = ((e.clientX - rect.left) / rect.width)  * 100
      const py = ((e.clientY - rect.top)  / rect.height) * 100
      shineRef.current.style.background = `radial-gradient(circle at ${px}% ${py}%, rgba(var(--red-accent-rgb),0.09) 0%, transparent 58%)`
      shineRef.current.style.opacity = '1'
    }
  }

  const handleMouseLeave = () => {
    const card = cardRef.current
    if (!card) return
    card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1) translateZ(0)'
    if (shineRef.current) shineRef.current.style.opacity = '0'
    setHovered(false)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const detail = (solution as any).detail as {
    headline: string
    overview: string
    deployedSolutions: { name: string; role: string }[]
    capabilities: string[]
    impact: string[]
  } | undefined

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        background: hovered ? 'var(--bg-700)' : 'var(--bg-card)',
        padding: '2.25rem 2rem',
        position: 'relative',
        cursor: 'pointer',
        overflow: 'hidden',
        transformStyle: 'preserve-3d',
        transition: 'transform 0.45s cubic-bezier(0.23,1,0.32,1), background 0.3s, box-shadow 0.4s',
        boxShadow: hovered
          ? '0 24px 60px rgba(var(--black-rgb),0.55), 0 0 28px rgba(var(--red-dark-rgb),0.10), inset 0 1px 0 rgba(var(--red-accent-rgb),0.08)'
          : 'none',
        display: 'flex',
        flexDirection: 'column',
        willChange: 'transform',
        opacity:   visible ? 1 : 0,
        animation: visible ? `solutionCardIn 0.65s cubic-bezier(0.23,1,0.32,1) ${index * 0.1 + 0.05}s both` : 'none',
      }}
    >
      {/* Shine */}
      <div ref={shineRef} aria-hidden="true" style={{ position:'absolute', inset:0, pointerEvents:'none', opacity:0, transition:'opacity 0.3s', zIndex:1 }} />

      {/* Top accent on first card */}
      {index === 0 && (
        <div style={{ position:'absolute', top:0, left:0, right:0, height:'2px', background:'linear-gradient(90deg, var(--red-bright), transparent)' }} />
      )}

      {/* Hover bottom bar */}
      <div style={{ position:'absolute', bottom:0, left:0, right:0, height:'2px', background:'linear-gradient(90deg, var(--red-bright), transparent)', transform: hovered ? 'scaleX(1)' : 'scaleX(0)', transformOrigin:'left', transition:'transform 0.4s cubic-bezier(0.23,1,0.32,1)' }} />

      {/* Number watermark */}
      <div aria-hidden="true" style={{ position:'absolute', top:'1rem', right:'1.25rem', fontFamily:'var(--font-display)', fontSize:'3rem', fontWeight:900, color:'transparent', WebkitTextStroke: hovered ? '1px rgba(var(--red-dark-rgb),0.18)' : '1px rgba(var(--red-dark-rgb),0.08)', lineHeight:1, pointerEvents:'none', userSelect:'none', transition:'all 0.4s', transform: hovered ? 'translateZ(6px) scale(1.05)' : 'translateZ(0) scale(1)' }}>
        {String(index + 1).padStart(2, '0')}
      </div>

      {/* Icon */}
      <div className="icon-circle" style={{ marginBottom:'1.5rem', position:'relative', zIndex:2, transform: hovered ? 'translateZ(22px) scale(1.1)' : 'translateZ(0) scale(1)', transition:'transform 0.45s cubic-bezier(0.23,1,0.32,1)', animation:`floatIcon 3.5s ease-in-out ${index * 0.35}s infinite`, filter: hovered ? 'drop-shadow(0 0 10px rgba(var(--red-accent-rgb),0.45))' : 'none' }}>
        {solution.icon}
      </div>

      {/* Title */}
      <h3 style={{ fontFamily:'var(--font-display)', fontSize:'0.85rem', fontWeight:700, color:'var(--text-primary)', marginBottom:'0.85rem', letterSpacing:'0.04em', lineHeight:1.4, position:'relative', zIndex:2, transform: hovered ? 'translateZ(14px)' : 'translateZ(0)', transition:'transform 0.45s cubic-bezier(0.23,1,0.32,1)' }}>
        {solution.title}
      </h3>

      {/* Headline (detail subtitle) */}
      {detail && (
        <p style={{ fontFamily:'var(--font-display)', fontSize:'0.62rem', letterSpacing:'0.08em', color:'var(--red-bright)', marginBottom:'0.6rem', position:'relative', zIndex:2, opacity: hovered ? 1 : 0.7, transition:'opacity 0.3s' }}>
          {detail.headline}
        </p>
      )}

      {/* Description */}
      <p style={{ fontSize:'0.86rem', color:'var(--text-secondary)', lineHeight:1.85, marginBottom:'1.25rem', position:'relative', zIndex:2 }}>
        {solution.desc}
      </p>

      {/* ── Expandable detail panel ── */}
      {detail && (
        <div style={{ position:'relative', zIndex:2 }}>
          {/* Toggle */}
          <button
            onClick={e => { e.preventDefault(); setExpanded(p => !p) }}
            style={{ display:'flex', alignItems:'center', gap:'6px', background:'none', border:'none', cursor:'pointer', padding:'0', marginBottom: expanded ? '1rem' : '1.25rem', fontFamily:'var(--font-display)', fontSize:'0.58rem', fontWeight:700, letterSpacing:'0.14em', textTransform:'uppercase', color: expanded ? 'var(--red-bright)' : 'var(--text-muted)', transition:'color 0.25s' }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transition:'transform 0.3s', transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>
              <polyline points="6 9 12 15 18 9"/>
            </svg>
            {expanded ? 'Hide Details' : 'View Details'}
          </button>

          {/* Collapsible content */}
          <div className={`sol-detail-panel${expanded ? ' open' : ''}`}>
            <div className="sol-detail-inner">

              {/* Deployed Solutions */}
              <div style={{ marginBottom:'1rem' }}>
                <p style={{ fontFamily:'var(--font-display)', fontSize:'0.5rem', letterSpacing:'0.2em', textTransform:'uppercase', color:'var(--red-bright)', marginBottom:'0.5rem' }}>Solutions Deployed</p>
                <div style={{ display:'flex', flexDirection:'column', gap:'5px' }}>
                  {detail.deployedSolutions.map(ds => (
                    <div key={ds.name} style={{ display:'flex', gap:'8px', alignItems:'flex-start', padding:'6px 10px', borderRadius:'6px', background:'rgba(var(--red-dark-rgb),0.04)', border:'1px solid rgba(var(--red-dark-rgb),0.1)' }}>
                      <span style={{ width:'4px', height:'4px', borderRadius:'50%', background:'var(--red-bright)', flexShrink:0, marginTop:'5px' }} />
                      <div>
                        <p style={{ fontFamily:'var(--font-display)', fontSize:'0.65rem', fontWeight:700, color:'var(--text-primary)', letterSpacing:'0.03em' }}>{ds.name}</p>
                        <p style={{ fontFamily:'var(--font-light)', fontSize:'0.62rem', color:'var(--text-muted)', lineHeight:1.5 }}>{ds.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Capabilities */}
              <div style={{ marginBottom:'1rem' }}>
                <p style={{ fontFamily:'var(--font-display)', fontSize:'0.5rem', letterSpacing:'0.2em', textTransform:'uppercase', color:'var(--red-bright)', marginBottom:'0.5rem' }}>Key Capabilities</p>
                <div style={{ display:'flex', flexDirection:'column', gap:'4px' }}>
                  {detail.capabilities.map((cap, i) => (
                    <div key={i} style={{ display:'flex', gap:'8px', alignItems:'flex-start' }}>
                      <span style={{ width:'3px', height:'3px', borderRadius:'50%', background:'rgba(var(--red-dark-rgb),0.6)', flexShrink:0, marginTop:'6px' }} />
                      <p style={{ fontFamily:'var(--font-light)', fontSize:'0.72rem', color:'var(--text-secondary)', lineHeight:1.6 }}>{cap}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Business Impact */}
              <div style={{ marginBottom:'1.25rem' }}>
                <p style={{ fontFamily:'var(--font-display)', fontSize:'0.5rem', letterSpacing:'0.2em', textTransform:'uppercase', color:'var(--red-bright)', marginBottom:'0.5rem' }}>Business Impact</p>
                <div style={{ display:'flex', flexDirection:'column', gap:'4px' }}>
                  {detail.impact.map((imp, i) => (
                    <div key={i} style={{ display:'flex', gap:'8px', alignItems:'flex-start' }}>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--red-bright)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink:0, marginTop:'3px' }}>
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                      <p style={{ fontFamily:'var(--font-light)', fontSize:'0.72rem', color:'var(--text-secondary)', lineHeight:1.6 }}>{imp}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* CTA */}
      <Link
        href={`/solutions/${(solution as any).uid}`}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: hovered ? '10px' : '8px',
          fontFamily: 'var(--font-display)',
          fontSize: '0.6rem',
          fontWeight: 700,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          marginTop: 'auto',
          color: hovered ? '#fff' : 'var(--red-bright)',
          background: hovered
            ? 'linear-gradient(135deg, var(--red-bright) 0%, var(--red-dark) 100%)'
            : 'transparent',
          border: '1px solid',
          borderColor: hovered ? 'transparent' : 'rgba(var(--red-dark-rgb),0.35)',
          borderRadius: '4px',
          padding: '0.5rem 0.85rem',
          transition: 'gap 0.25s, color 0.25s, background 0.3s, border-color 0.3s, box-shadow 0.3s',
          boxShadow: hovered
            ? '0 4px 18px rgba(var(--red-dark-rgb),0.45)'
            : 'none',
          position: 'relative',
          zIndex: 2,
          transform: hovered ? 'translateZ(16px)' : 'translateZ(0)',
          cursor: 'pointer',
          textDecoration: 'none',
          whiteSpace: 'nowrap',
          width: 'fit-content',
        }}
      >
        Full Solution Details
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, transform: hovered ? 'translateX(3px)' : 'translateX(0)', transition: 'transform 0.25s' }}>
          <line x1="5" y1="12" x2="19" y2="12"/>
          <polyline points="12 5 19 12 12 19"/>
        </svg>
      </Link>
    </div>
  )
}

// ─── Main export ──────────────────────────────────────────────────────────────
export default function SolutionSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold: 0.1 }
    )
    if (sectionRef.current) obs.observe(sectionRef.current)
    return () => obs.disconnect()
  }, [])

  return (
    <>
      <style>{`
        @keyframes solutionCardIn {
          from { opacity: 0; transform: perspective(800px) translateY(36px) rotateX(14deg) scale3d(0.97,0.97,0.97); }
          to   { opacity: 1; transform: perspective(800px) translateY(0) rotateX(0deg) scale3d(1,1,1); }
        }
        @keyframes floatIcon {
          0%,100% { transform: translateY(0) translateZ(0); }
          50%      { transform: translateY(-5px) translateZ(8px); }
        }
        @keyframes headerSlideIn {
          from { opacity: 0; transform: translateY(22px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes glowPulse {
          0%,100% { opacity: 0.6; transform: scale(1); }
          50%      { opacity: 1;   transform: scale(1.1); }
        }

        /* Collapsible detail panel */
        .sol-detail-panel {
          display: grid;
          grid-template-rows: 0fr;
          transition: grid-template-rows 0.38s cubic-bezier(0.23,1,0.32,1);
        }
        .sol-detail-panel.open {
          grid-template-rows: 1fr;
        }
        .sol-detail-inner {
          overflow: hidden;
        }

        @media (max-width: 900px) {
          .solutions-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 560px) {
          .solutions-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <section
        id="solutions"
        ref={sectionRef}
        style={{ position:'relative', paddingBlock:'6rem', background:'var(--bg-800)', overflow:'hidden', borderTop:'1px solid var(--border-soft)' }}
      >
        {/* Watermark */}
        <div aria-hidden="true" style={{ position:'absolute', bottom:'-2rem', left:'50%', transform:'translateX(-50%)', whiteSpace:'nowrap', pointerEvents:'none' }}>
          <span className="watermark-text">Solutions</span>
        </div>

        {/* Ambient glows */}
        <div aria-hidden="true" style={{ position:'absolute', top:'20%', right:'-10%', width:'500px', height:'500px', borderRadius:'50%', background:'radial-gradient(circle, rgba(var(--red-dark-rgb),0.07) 0%, transparent 70%)', pointerEvents:'none', animation:'glowPulse 5s ease-in-out infinite' }} />
        <div aria-hidden="true" style={{ position:'absolute', bottom:'10%', left:'-8%', width:'350px', height:'350px', borderRadius:'50%', background:'radial-gradient(circle, rgba(var(--red-dark-rgb),0.05) 0%, transparent 70%)', pointerEvents:'none', animation:'glowPulse 6s ease-in-out 1s infinite' }} />

        <div className="container-allbotix" style={{ position:'relative', zIndex:2 }}>

          {/* Header */}
          <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', gap:'2rem', marginBottom:'3.5rem', flexWrap:'wrap', animation:'headerSlideIn 0.7s ease-out 0.05s both' }}>
            <div>
              <div className="section-tag">What We Offer</div>
              <h2 className="section-title">
                Unleashing Potential, One <span>Allbotix</span>
                <br />at a Time.
              </h2>
            </div>
            <Link href="/" className="btn-outline" style={{ flexShrink:0 }}>
              Back to Home
            </Link>
          </div>

          {/* Grid */}
          <div style={{ perspective:'1200px' }}>
            <div
              className="solutions-grid"
              style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:'1.5px', background:'var(--border)', border:'1px solid var(--border)', borderRadius:'6px', overflow:'visible' }}
            >
              {solutions.map((solution, i) => (
                <SolutionCard key={solution.title} solution={solution} index={i} visible={visible} />
              ))}
            </div>
          </div>

        </div>
      </section>
    </>
  )
}