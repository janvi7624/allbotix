'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRef, useEffect, useState } from 'react'
import { ROBOTS } from '@/data/robots'

const CATEGORIES = ['All', ...Array.from(new Set(ROBOTS.map(r => r.category)))]
const N = ROBOTS.length

type Robot = typeof ROBOTS[0]
type RobotWithIndex = Robot & { index: number }

/* ─── helpers ────────────────────────────────────────────────────────────── */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getModels(robot: Robot): Array<{ id:string; name:string; src:string; alt:string; pdfLink?:string }> | null {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const m = (robot as any).models
  return Array.isArray(m) && m.length ? m : null
}

function PdfIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/>
    </svg>
  )
}

/* ─── Robot Card ─────────────────────────────────────────────────────────── */
function RobotCard({
  robot, index, visible,
}: {
  robot: RobotWithIndex
  index: number
  visible: boolean
}) {
  const cardRef  = useRef<HTMLAnchorElement>(null)
  const shineRef = useRef<HTMLDivElement>(null)
  const [hovered, setHovered] = useState(false)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current; if (!card) return
    const rect = card.getBoundingClientRect()
    const dx = (e.clientX - rect.left - rect.width / 2)  / (rect.width  / 2)
    const dy = (e.clientY - rect.top  - rect.height / 2) / (rect.height / 2)
    card.style.transform = `perspective(700px) rotateX(${-dy * 8}deg) rotateY(${dx * 8}deg) scale3d(1.03,1.03,1.03)`
    if (shineRef.current) {
      const px = ((e.clientX - rect.left) / rect.width)  * 100
      const py = ((e.clientY - rect.top)  / rect.height) * 100
      shineRef.current.style.background = `radial-gradient(circle at ${px}% ${py}%, rgba(232,57,42,0.13) 0%, transparent 60%)`
      shineRef.current.style.opacity = '1'
    }
  }
  const handleMouseLeave = () => {
    const card = cardRef.current; if (!card) return
    card.style.transform = 'perspective(700px) rotateX(0) rotateY(0) scale3d(1,1,1)'
    if (shineRef.current) shineRef.current.style.opacity = '0'
    setHovered(false)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const r = robot as any
  const models      = getModels(robot)
  const hasUseCases = Array.isArray(r.useCases) && r.useCases.length > 0
  const hasIndustries = r.industries != null

  // count all meaningful sections for the badge
  const sectionCount = (['display','navigation','voiceAssistant','industries','parcelTray','packaging'] as const)
    .filter(k => r[k] != null).length
    + (models ? 1 : 0)
    + (hasUseCases ? 1 : 0)

  return (
    <Link
      href={`/products/${robot.uid}`}
      ref={cardRef as React.Ref<HTMLAnchorElement>}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{ display: 'flex', flexDirection: 'column', textDecoration: 'none',
        position:'relative', borderRadius:'12px', overflow:'hidden',
        border: hovered ? '1px solid rgba(176,58,46,0.55)' : '1px solid rgba(176,58,46,0.15)',
        background:'var(--bg-card)', cursor:'pointer', transformStyle:'preserve-3d',
        transition:'transform 0.45s cubic-bezier(0.23,1,0.32,1), box-shadow 0.4s, border-color 0.3s',
        boxShadow: hovered ? '0 24px 60px rgba(0,0,0,0.6),0 0 30px rgba(176,58,46,0.14)' : '0 4px 20px rgba(0,0,0,0.3)',
        opacity:   visible ? 1 : 0,
        translate:  visible ? '0 0' : '0 40px',
        filter:    visible ? 'none' : 'blur(4px)',
        transitionProperty: 'transform, box-shadow, border-color, opacity, translate, filter',
        transitionDuration: '0.45s, 0.4s, 0.3s, 0.6s, 0.6s, 0.6s',
        transitionDelay:    `0s, 0s, 0s, ${index*0.07}s, ${index*0.07}s, ${index*0.07}s`,
      }}
    >
      <div ref={shineRef} aria-hidden="true" style={{ position:'absolute', inset:0, pointerEvents:'none', opacity:0, transition:'opacity 0.3s', zIndex:4 }}/>

      {hovered && (
        <div aria-hidden="true" style={{ position:'absolute', inset:0, overflow:'hidden', zIndex:3, pointerEvents:'none', borderRadius:'12px' }}>
          <div style={{ position:'absolute', left:0, right:0, height:'3px', background:'linear-gradient(90deg,transparent,rgba(176,58,46,0.4),transparent)', animation:'rc-scanline 3s linear infinite' }}/>
        </div>
      )}

      {/* ── Image area ── */}
      <div style={{ position:'relative', height:'220px', overflow:'hidden' }}>
        <Image src={robot.src} alt={robot.name} fill style={{ objectFit:'cover', transform: hovered ? 'scale(1.07)' : 'scale(1)', transition:'transform 0.6s cubic-bezier(0.23,1,0.32,1)' }}/>
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top,rgba(8,8,8,0.85) 0%,rgba(8,8,8,0.1) 60%,transparent 100%)' }}/>

        {/* category tag */}
        <div style={{ position:'absolute', top:'12px', left:'12px', padding:'4px 12px', borderRadius:'100px', background:'rgba(8,8,8,0.75)', border:'1px solid rgba(176,58,46,0.3)', backdropFilter:'blur(8px)', zIndex:2 }}>
          <span style={{ fontFamily:'var(--font-display)', fontSize:'0.5rem', letterSpacing:'0.18em', textTransform:'uppercase', color:'var(--red-bright)' }}>{robot.category}</span>
        </div>

        {/* section count badge */}
        {sectionCount > 0 && (
          <div style={{ position:'absolute', top:'12px', right:'12px', zIndex:2, padding:'4px 10px', borderRadius:'100px', background: hovered ? 'rgba(176,58,46,0.35)' : 'rgba(176,58,46,0.1)', border:'1px solid rgba(176,58,46,0.4)', backdropFilter:'blur(8px)', transition:'background 0.3s' }}>
            <span style={{ fontFamily:'var(--font-display)', fontSize:'0.48rem', letterSpacing:'0.14em', textTransform:'uppercase', color:'var(--red-bright)' }}>
              {sectionCount} sections
            </span>
          </div>
        )}

        {/* name + tag */}
        <div style={{ position:'absolute', bottom:0, left:0, right:0, padding:'1rem', zIndex:2 }}>
          <p style={{ fontFamily:'var(--font-display)', fontSize:'1.3rem', fontWeight:900, color:'#fff', letterSpacing:'0.03em', lineHeight:1, marginBottom:'2px' }}>{robot.name}</p>
          <p style={{ fontFamily:'var(--font-display)', fontSize:'0.55rem', letterSpacing:'0.18em', textTransform:'uppercase', color:'rgba(176,58,46,0.9)' }}>{robot.tag}</p>
        </div>
      </div>

      {/* ── Card body ── */}
      <div style={{ padding:'1.25rem 1.25rem 1.5rem', position:'relative', zIndex:2, transformStyle:'preserve-3d', display:'flex', flexDirection:'column', flex:1 }}>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize:'0.82rem', color:'var(--text-secondary)', lineHeight:1.75, marginBottom:'1rem', transform: hovered ? 'translateZ(6px)' : 'translateZ(0)', transition:'transform 0.4s' }}>
            {robot.desc}
          </p>

          {/* ── Models strip (with PDF links) ── */}
          {models && (
            <div style={{ marginBottom:'1rem' }}>
              <p style={{ fontFamily:'var(--font-display)', fontSize:'0.48rem', letterSpacing:'0.18em', textTransform:'uppercase', color:'var(--text-muted)', marginBottom:'8px' }}>
                {models.length} Available Models
              </p>
              <div style={{ display:'flex', flexWrap:'wrap', gap:'6px' }}>
                {models.map(m => (
                  <div
                    key={m.id}
                    style={{ display:'flex', alignItems:'center', gap:'6px', padding:'4px 10px', borderRadius:'6px', background:'rgba(176,58,46,0.05)', border:'1px solid rgba(176,58,46,0.15)' }}
                    onClick={e => e.stopPropagation()}
                  >
                    <span style={{ fontFamily:'var(--font-display)', fontSize:'0.6rem', color:'var(--text-secondary)', letterSpacing:'0.05em' }}>{m.name}</span>
                    {m.pdfLink && (
                      <a
                        href={m.pdfLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={`${m.name} spec sheet`}
                        style={{ display:'flex', alignItems:'center', color:'var(--red-bright)', lineHeight:1 }}
                      >
                        <PdfIcon/>
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Industries / use-cases indicator ── */}
          {(hasIndustries || hasUseCases) && (
            <div style={{ marginBottom:'1rem', display:'flex', flexWrap:'wrap', gap:'6px' }}>
              {hasIndustries && (
                <span style={{ padding:'3px 10px', borderRadius:'100px', background:'rgba(176,58,46,0.06)', border:'1px solid rgba(176,58,46,0.18)', fontFamily:'var(--font-display)', fontSize:'0.52rem', color:'var(--text-muted)', letterSpacing:'0.08em' }}>
                  Industries ↗
                </span>
              )}
              {hasUseCases && (
                <span style={{ padding:'3px 10px', borderRadius:'100px', background:'rgba(176,58,46,0.06)', border:'1px solid rgba(176,58,46,0.18)', fontFamily:'var(--font-display)', fontSize:'0.52rem', color:'var(--text-muted)', letterSpacing:'0.08em' }}>
                  {r.useCases.length} Use Cases ↗
                </span>
              )}
            </div>
          )}

          {/* specs grid */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'6px', marginBottom:'1.25rem' }}>
            {robot.specs.map(spec => (
              <div key={spec} style={{ display:'flex', alignItems:'center', gap:'6px', padding:'5px 8px', borderRadius:'6px', background:'rgba(176,58,46,0.04)', border:'1px solid rgba(176,58,46,0.1)' }}>
                <span style={{ width:'3px', height:'3px', borderRadius:'50%', background:'var(--red-bright)', flexShrink:0 }}/>
                <span style={{ fontFamily:'var(--font-display)', fontSize:'0.6rem', color:'var(--text-muted)', letterSpacing:'0.04em' }}>{spec}</span>
              </div>
            ))}
          </div>
        </div>
        {/* accent line */}
        <div style={{ height:'1px', background:'linear-gradient(90deg,var(--red-bright),transparent)', transform: hovered ? 'scaleX(1)' : 'scaleX(0)', transformOrigin:'left', transition:'transform 0.4s cubic-bezier(0.23,1,0.32,1)', marginBottom:'1rem' }}/>

        {/* CTA row */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <span style={{ fontFamily:'var(--font-display)', fontSize:'0.58rem', letterSpacing:'0.18em', textTransform:'uppercase', color: hovered ? 'var(--red-bright)' : 'var(--text-muted)', transition:'color 0.3s' }}>
            View Full Profile
          </span>
          <div style={{ width:'32px', height:'32px', borderRadius:'50%', border:`1px solid ${hovered ? 'var(--red-bright)' : 'rgba(176,58,46,0.25)'}`, background: hovered ? 'rgba(176,58,46,0.15)' : 'transparent', display:'flex', alignItems:'center', justifyContent:'center', transition:'all 0.3s', transform: hovered ? 'translateX(4px)' : 'translateX(0)' }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={hovered ? 'var(--red-bright)' : 'rgba(176,58,46,0.5)'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
            </svg>
          </div>
        </div>
      </div>
    </Link>
  )
}

/* ─── Main Page ──────────────────────────────────────────────────────────── */
export default function RobotsPage() {
  const sectionRef = useRef<HTMLElement>(null)
  const [visible,      setVisible]    = useState(false)
  const [activeFilter, setFilter]     = useState('All')
  const [search,       setSearch]     = useState('')

  useEffect(() => {
    const el = sectionRef.current; if (!el) return
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true) }, { threshold:0.05 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const filtered = ROBOTS
    .map((r, i) => ({ ...r, index: i }))
    .filter(r =>
      (activeFilter === 'All' || r.category === activeFilter) &&
      (search === '' ||
        r.name.toLowerCase().includes(search.toLowerCase()) ||
        r.tag.toLowerCase().includes(search.toLowerCase()) ||
        r.category.toLowerCase().includes(search.toLowerCase()))
    )

  return (
    <>
      <style>{`
        @keyframes rc-scanline { 0%{top:-4%;opacity:0.5} 100%{top:108%;opacity:0} }
        @keyframes heroFadeUp  { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
        @keyframes glowPulse   { 0%,100%{opacity:0.5;transform:scale(1)} 50%{opacity:1;transform:scale(1.08)} }
        @keyframes lineExpand  { from{width:0;opacity:0} to{width:60px;opacity:1} }

        .filter-pill {
          padding:7px 18px; border-radius:100px; cursor:pointer;
          font-family:var(--font-display); font-size:0.6rem;
          letter-spacing:0.16em; text-transform:uppercase;
          border:1px solid rgba(176,58,46,0.2); background:rgba(176,58,46,0.04);
          color:var(--text-muted); transition:all 0.25s;
        }
        .filter-pill:hover { border-color:rgba(176,58,46,0.5); background:rgba(176,58,46,0.1); color:var(--red-bright); }
        .filter-pill.active { border-color:var(--red-bright); background:rgba(176,58,46,0.18); color:var(--red-bright); box-shadow:0 0 16px rgba(176,58,46,0.25); }

        .search-input {
          background:rgba(176,58,46,0.04); border:1px solid rgba(176,58,46,0.2);
          border-radius:8px; padding:9px 16px 9px 40px;
          font-family:var(--font-display); font-size:0.72rem;
          letter-spacing:0.06em; color:var(--text-primary);
          outline:none; transition:border-color 0.25s, box-shadow 0.25s; width:220px;
        }
        .search-input::placeholder { color:var(--text-muted); }
        .search-input:focus { border-color:rgba(176,58,46,0.5); box-shadow:0 0 18px rgba(176,58,46,0.12); }

        @media (max-width:900px)  { .robots-grid { grid-template-columns:repeat(2,1fr) !important; } }
        @media (max-width:560px)  { .robots-grid { grid-template-columns:1fr !important; } .filter-row { flex-direction:column; align-items:flex-start !important; } }
      `}</style>

      <section id="robots" ref={sectionRef} style={{ position:'relative', paddingBlock:'6rem', background:'var(--bg-900)', overflow:'hidden', minHeight:'100vh' }}>
        <div aria-hidden="true" style={{ position:'absolute', top:'10%', right:'-8%', width:'500px', height:'500px', borderRadius:'50%', background:'radial-gradient(circle,rgba(176,58,46,0.07) 0%,transparent 70%)', pointerEvents:'none', animation:'glowPulse 6s ease-in-out infinite' }}/>
        <div aria-hidden="true" style={{ position:'absolute', bottom:'15%', left:'-8%', width:'420px', height:'420px', borderRadius:'50%', background:'radial-gradient(circle,rgba(176,58,46,0.05) 0%,transparent 70%)', pointerEvents:'none', animation:'glowPulse 8s ease-in-out 2s infinite' }}/>
        <div aria-hidden="true" style={{ position:'absolute', bottom:'-2rem', left:'50%', transform:'translateX(-50%)', whiteSpace:'nowrap', pointerEvents:'none', fontFamily:'var(--font-display)', fontSize:'clamp(5rem,14vw,11rem)', fontWeight:900, color:'transparent', WebkitTextStroke:'1px rgba(176,58,46,0.05)', letterSpacing:'0.05em', lineHeight:1, userSelect:'none' }}>ROBOTS</div>

        <div className="container-allbotix" style={{ position:'relative', zIndex:2 }}>

          {/* header */}
          <div style={{ marginBottom:'4rem', animation: visible ? 'heroFadeUp 0.7s ease 0.05s both' : 'none' }}>
            <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', flexWrap:'wrap', gap:'1.5rem', marginBottom:'1rem' }}>
              <div>
                <div className="section-tag">Our Fleet</div>
                <h1 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(2rem,5vw,3.5rem)', fontWeight:900, color:'var(--text-primary)', lineHeight:1.1, letterSpacing:'0.02em', marginTop:'0.5rem' }}>
                  Meet the <span style={{ color:'var(--red-bright)' }}>Machines</span><br/>That Shape Tomorrow.
                </h1>
              </div>
              <Link href="/" className="btn-outline" style={{ flexShrink:0 }}>← Back to Home</Link>
            </div>
            <div style={{ width:'60px', height:'2px', background:'linear-gradient(90deg,var(--red-bright),transparent)', animation: visible ? 'lineExpand 0.6s ease 0.3s both' : 'none' }}/>
            <p style={{ marginTop:'1rem', maxWidth:'500px', fontSize:'0.95rem', color:'var(--text-secondary)', lineHeight:1.85, animation: visible ? 'heroFadeUp 0.6s ease 0.2s both' : 'none' }}>
              Explore our full fleet of intelligent robotic systems — each engineered for a specific industry challenge, built for reliability and deployed at scale.
            </p>
          </div>

          {/* filter + search */}
          <div className="filter-row" style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:'1rem', marginBottom:'2.5rem', flexWrap:'wrap', opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(16px)', transition:'opacity 0.6s ease 0.25s, transform 0.6s ease 0.25s' }}>
            <div style={{ display:'flex', gap:'8px', flexWrap:'wrap' }}>
              {CATEGORIES.map(cat => (
                <button key={cat} className={`filter-pill${activeFilter === cat ? ' active' : ''}`} onClick={() => setFilter(cat)}>{cat}</button>
              ))}
            </div>
            <div style={{ position:'relative' }}>
              <svg style={{ position:'absolute', left:'12px', top:'50%', transform:'translateY(-50%)', pointerEvents:'none' }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(176,58,46,0.5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input className="search-input" type="text" placeholder="Search robots..." value={search} onChange={e => setSearch(e.target.value)}/>
            </div>
          </div>

          {/* count */}
          <p style={{ fontFamily:'var(--font-display)', fontSize:'0.6rem', letterSpacing:'0.18em', textTransform:'uppercase', color:'var(--text-muted)', marginBottom:'1.5rem', opacity: visible ? 1 : 0, transition:'opacity 0.5s ease 0.35s' }}>
            Showing <span style={{ color:'var(--red-bright)' }}>{filtered.length}</span> of {N} units
          </p>

          {/* grid */}
          {filtered.length > 0 ? (
            <div className="robots-grid" style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'1.5rem', perspective:'1200px' }}>
              {filtered.map((robot, i) => (
                <RobotCard key={robot.id} robot={robot} index={i} visible={visible}/>
              ))}
            </div>
          ) : (
            <div style={{ textAlign:'center', padding:'5rem 0', opacity: visible ? 1 : 0, transition:'opacity 0.5s' }}>
              <p style={{ fontFamily:'var(--font-display)', fontSize:'0.75rem', letterSpacing:'0.2em', color:'var(--text-muted)', textTransform:'uppercase' }}>No robots match your search</p>
            </div>
          )}

          {/* bottom CTA */}
          <div style={{ textAlign:'center', marginTop:'5rem', opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(24px)', transition:'opacity 0.7s ease 0.5s, transform 0.7s ease 0.5s' }}>
            <p style={{ fontFamily:'var(--font-light)', fontSize:'0.9rem', color:'var(--text-secondary)', marginBottom:'1.5rem' }}>
              Need a custom robotic solution? Our engineers are ready.
            </p>
            <Link href="#contact" className="btn-primary">
              Request a Consultation
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </Link>
          </div>

        </div>
      </section>
    </>
  )
}