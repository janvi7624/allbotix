'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { solutions } from '@/data/solutions'

/* ─── Types ──────────────────────────────────────────────────────────────── */
type DeployedSolution = { name: string; role: string }
type SolutionDetail = {
  headline: string
  overview: string
  deployedSolutions: DeployedSolution[]
  capabilities: string[]
  impact: string[]
}
type Solution = (typeof solutions)[0] & { uid: string; detail: SolutionDetail }

/* ─── Icons ──────────────────────────────────────────────────────────────── */
function ArrowLeftIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
    </svg>
  )
}
function CheckIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  )
}
function RobotIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="10" rx="2"/>
      <path d="M12 2v4M9 11V7a3 3 0 016 0v4"/>
      <circle cx="8.5" cy="16" r="1"/><circle cx="15.5" cy="16" r="1"/>
      <path d="M9 19h6"/>
    </svg>
  )
}
function BoltIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
    </svg>
  )
}
function TargetIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
    </svg>
  )
}

/* ─── Deployed Solution Card ─────────────────────────────────────────────── */
function DeployedCard({ item, index, visible }: { item: DeployedSolution; index: number; visible: boolean }) {
  const cardRef  = useRef<HTMLDivElement>(null)
  const shineRef = useRef<HTMLDivElement>(null)
  const [hovered, setHovered] = useState(false)

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current; if (!el) return
    const r = el.getBoundingClientRect()
    const dx = (e.clientX - r.left - r.width  / 2) / (r.width  / 2)
    const dy = (e.clientY - r.top  - r.height / 2) / (r.height / 2)
    el.style.transform = `perspective(600px) rotateX(${-dy * 10}deg) rotateY(${dx * 10}deg) scale3d(1.03,1.03,1.03) translateZ(6px)`
    if (shineRef.current) {
      const px = ((e.clientX - r.left) / r.width)  * 100
      const py = ((e.clientY - r.top)  / r.height) * 100
      shineRef.current.style.background = `radial-gradient(circle at ${px}% ${py}%, rgba(var(--red-accent-rgb),0.12) 0%, transparent 60%)`
      shineRef.current.style.opacity = '1'
    }
  }
  const onLeave = () => {
    if (cardRef.current) cardRef.current.style.transform = 'perspective(600px) rotateX(0) rotateY(0) scale3d(1,1,1) translateZ(0)'
    if (shineRef.current) shineRef.current.style.opacity = '0'
    setHovered(false)
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={onMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={onLeave}
      style={{
        position: 'relative', overflow: 'hidden', borderRadius: '10px',
        border: `1px solid ${hovered ? 'rgba(var(--red-dark-rgb),0.45)' : 'rgba(var(--red-dark-rgb),0.15)'}`,
        background: hovered ? 'var(--bg-700)' : 'var(--bg-card)',
        padding: '1.25rem 1.5rem',
        transformStyle: 'preserve-3d', cursor: 'default',
        transition: 'transform 0.45s cubic-bezier(0.23,1,0.32,1), border-color 0.3s, box-shadow 0.4s, background 0.3s',
        boxShadow: hovered ? '0 20px 50px rgba(var(--black-rgb),0.5), 0 0 24px rgba(var(--red-dark-rgb),0.12)' : '0 4px 16px rgba(var(--black-rgb),0.25)',
        opacity: visible ? 1 : 0,
        translate: visible ? '0 0' : '0 30px',
        filter: visible ? 'none' : 'blur(4px)',
        transitionProperty: 'transform, border-color, box-shadow, background, opacity, translate, filter',
        transitionDuration: '0.45s, 0.3s, 0.4s, 0.3s, 0.6s, 0.6s, 0.6s',
        transitionDelay: `0s, 0s, 0s, 0s, ${index * 0.1 + 0.1}s, ${index * 0.1 + 0.1}s, ${index * 0.1 + 0.1}s`,
      }}
    >
      <div ref={shineRef} aria-hidden="true" style={{ position:'absolute', inset:0, borderRadius:'10px', pointerEvents:'none', opacity:0, transition:'opacity 0.3s', zIndex:1 }} />

      {/* Bottom accent bar */}
      <div style={{ position:'absolute', bottom:0, left:0, right:0, height:'2px', background:'linear-gradient(90deg,var(--red-bright),transparent)', borderRadius:'0 0 10px 10px', transform: hovered ? 'scaleX(1)' : 'scaleX(0)', transformOrigin:'left', transition:'transform 0.4s cubic-bezier(0.23,1,0.32,1)' }} />

      <div style={{ display:'flex', alignItems:'flex-start', gap:'0.85rem', position:'relative', zIndex:2 }}>
        {/* Icon box */}
        <div style={{ width:'38px', height:'38px', flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center', borderRadius:'8px', border:'1px solid rgba(var(--red-dark-rgb),0.3)', background: hovered ? 'rgba(var(--red-dark-rgb),0.18)' : 'rgba(var(--red-dark-rgb),0.07)', color:'var(--red-bright)', transition:'background 0.3s, transform 0.45s cubic-bezier(0.23,1,0.32,1)', transform: hovered ? 'translateZ(18px) scale(1.1)' : 'translateZ(0)', filter: hovered ? 'drop-shadow(0 0 6px rgba(var(--red-dark-rgb),0.5))' : 'none' }}>
          <RobotIcon />
        </div>
        <div style={{ transform: hovered ? 'translateZ(10px)' : 'translateZ(0)', transition:'transform 0.45s cubic-bezier(0.23,1,0.32,1)' }}>
          <p style={{ fontFamily:'var(--font-display)', fontSize:'0.78rem', fontWeight:700, color:'var(--text-primary)', letterSpacing:'0.04em', marginBottom:'3px' }}>{item.name}</p>
          <p style={{ fontFamily:'var(--font-light)', fontSize:'0.71rem', color:'var(--text-muted)', lineHeight:1.55 }}>{item.role}</p>
        </div>
      </div>
    </div>
  )
}

/* ─── Stat pill ──────────────────────────────────────────────────────────── */
function StatPill({ value, label, delay }: { value: string; label: string; delay: number }) {
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true) }, { threshold: 0.3 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  return (
    <div ref={ref} style={{ textAlign:'center', padding:'1.5rem 1rem', borderRadius:'10px', border:'1px solid rgba(var(--red-dark-rgb),0.18)', background:'rgba(var(--red-dark-rgb),0.04)', opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(20px)', transition: `opacity 0.6s ease ${delay}s, transform 0.6s ease ${delay}s` }}>
      <p style={{ fontFamily:'var(--font-display)', fontSize:'clamp(1.6rem,3vw,2.2rem)', fontWeight:900, color:'var(--red-bright)', letterSpacing:'-0.02em', lineHeight:1, marginBottom:'6px' }}>{value}</p>
      <p style={{ fontFamily:'var(--font-display)', fontSize:'0.52rem', letterSpacing:'0.18em', textTransform:'uppercase', color:'var(--text-muted)' }}>{label}</p>
    </div>
  )
}

/* ─── Main Page ──────────────────────────────────────────────────────────── */
export default function SolutionDetailPage() {
  const params = useParams()
  const uid = params?.uid as string

  const solution = solutions.find(s => (s as any).uid === uid) as Solution | undefined

  const [mounted, setMounted] = useState(false)
  const [heroVisible, setHeroVisible] = useState(false)
  const [bodyVisible, setBodyVisible] = useState(false)
  const bodyRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
    const t = setTimeout(() => setHeroVisible(true), 60)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setBodyVisible(true) }, { threshold: 0.05 })
    if (bodyRef.current) obs.observe(bodyRef.current)
    return () => obs.disconnect()
  }, [mounted])

  /* ── 404 ── */
  if (!solution || !solution.detail) {
    return (
      <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'1.5rem', background:'var(--bg-900)' }}>
        <p style={{ fontFamily:'var(--font-display)', fontSize:'1.1rem', color:'var(--text-muted)', letterSpacing:'0.08em' }}>Solution not found.</p>
        <Link href="/solutions" className="btn-outline" style={{ display:'flex', alignItems:'center', gap:'8px' }}>
          <ArrowLeftIcon /> Back to Solutions
        </Link>
      </div>
    )
  }

  const { detail } = solution

  /* ── Stat pills derived from data ── */
  const stats = [
    { value: `${detail.deployedSolutions.length}`, label: 'Robots Deployed' },
    { value: `${detail.capabilities.length}+`,     label: 'Key Capabilities' },
    { value: `${detail.impact.length}`,             label: 'Business Outcomes' },
    { value: '24/7',                                label: 'Support Coverage' },
  ]

  return (
    <>
      <style>{`
        @keyframes sdFadeUp   { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes sdSlideIn  { from{opacity:0;transform:translateX(-16px)} to{opacity:1;transform:translateX(0)} }
        @keyframes sdScanline { 0%{top:-4%;opacity:0.5} 100%{top:108%;opacity:0} }
        @keyframes sdRingCW   { to{transform:rotate(360deg)} }
        @keyframes sdRingCCW  { to{transform:rotate(-360deg)} }
        @keyframes sdGlowPulse{ 0%,100%{opacity:0.55;transform:scale(1)} 50%{opacity:1;transform:scale(1.1)} }
        @keyframes sdFloat    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }

        /* Section blocks */
        .sd-section {
          padding: 3rem 0;
          border-top: 1px solid rgba(var(--red-dark-rgb),0.1);
        }
        .sd-section:first-child { border-top: none; }

        .sd-section-label {
          font-family: var(--font-display);
          font-size: 0.5rem; letter-spacing: 0.22em; text-transform: uppercase;
          color: var(--red-bright); margin-bottom: 6px;
        }
        .sd-section-title {
          font-family: var(--font-display);
          font-size: clamp(1.3rem, 2.8vw, 2rem);
          font-weight: 900; color: var(--text-primary);
          letter-spacing: 0.02em; line-height: 1.15; margin-bottom: 8px;
        }
        .sd-section-sub {
          font-family: var(--font-light);
          font-size: 0.85rem; color: var(--text-secondary); line-height: 1.85;
          max-width: 640px;
        }

        /* Capability row */
        .sd-cap-row {
          display: flex; align-items: flex-start; gap: 12px;
          padding: 12px 16px; border-radius: 8px;
          border: 1px solid rgba(var(--red-dark-rgb),0.12);
          background: rgba(var(--red-dark-rgb),0.03);
          font-family: var(--font-light); font-size: 0.82rem;
          color: var(--text-secondary); line-height: 1.6;
          transition: border-color 0.25s, background 0.25s, transform 0.25s;
        }
        .sd-cap-row:hover {
          border-color: rgba(var(--red-dark-rgb),0.32);
          background: rgba(var(--red-dark-rgb),0.07);
          transform: translateX(4px);
        }
        .sd-cap-dot {
          width: 5px; height: 5px; border-radius: 50%;
          background: var(--red-bright); flex-shrink: 0; margin-top: 7px;
        }

        /* Impact row */
        .sd-impact-row {
          display: flex; align-items: flex-start; gap: 12px;
          padding: 14px 18px; border-radius: 10px;
          border: 1px solid rgba(var(--red-dark-rgb),0.15);
          background: rgba(var(--red-dark-rgb),0.04);
          transition: border-color 0.25s, background 0.25s, box-shadow 0.25s, transform 0.25s;
        }
        .sd-impact-row:hover {
          border-color: rgba(var(--red-dark-rgb),0.38);
          background: rgba(var(--red-dark-rgb),0.09);
          box-shadow: 0 8px 28px rgba(var(--black-rgb),0.3), 0 0 16px rgba(var(--red-dark-rgb),0.1);
          transform: translateY(-2px);
        }
        .sd-impact-check {
          width: 22px; height: 22px; flex-shrink: 0;
          border-radius: 50%; border: 1px solid rgba(var(--red-dark-rgb),0.4);
          background: rgba(var(--red-dark-rgb),0.1); color: var(--red-bright);
          display: flex; align-items: center; justify-content: center;
          margin-top: 1px;
        }

        /* Stats grid */
        .sd-stats-grid {
          display: grid; grid-template-columns: repeat(4,1fr); gap: 1rem;
        }
        @media(max-width:680px) { .sd-stats-grid { grid-template-columns: repeat(2,1fr); } }
        @media(max-width:400px) { .sd-stats-grid { grid-template-columns: 1fr; } }

        /* Deployed grid */
        .sd-deployed-grid {
          display: grid; grid-template-columns: repeat(auto-fill, minmax(260px,1fr)); gap: 1rem;
          margin-top: 1.5rem;
        }

        /* Caps + Impact two-col */
        .sd-two-col {
          display: grid; grid-template-columns: 1fr 1fr; gap: 2.5rem; align-items: start;
        }
        @media(max-width:760px) { .sd-two-col { grid-template-columns: 1fr; } }

        /* CTA card */
        .sd-cta-card {
          padding: clamp(1.5rem,4vw,3rem); border-radius: 16px;
          border: 1px solid rgba(var(--red-dark-rgb),0.18);
          background: rgba(var(--red-dark-rgb),0.04);
          text-align: center; position: relative; overflow: hidden;
        }

        /* Related nav */
        .sd-related-grid {
          display: grid; grid-template-columns: repeat(auto-fill, minmax(220px,1fr)); gap: 1rem;
          margin-top: 1.5rem;
        }
        .sd-related-card {
          display: flex; align-items: center; gap: 12px;
          padding: 1rem 1.25rem; border-radius: 10px;
          border: 1px solid rgba(var(--red-dark-rgb),0.15);
          background: var(--bg-card); text-decoration: none;
          transition: border-color 0.25s, background 0.25s, transform 0.25s, box-shadow 0.25s;
        }
        .sd-related-card:hover {
          border-color: rgba(var(--red-dark-rgb),0.45);
          background: var(--bg-700);
          transform: translateY(-3px);
          box-shadow: 0 12px 36px rgba(var(--black-rgb),0.4), 0 0 18px rgba(var(--red-dark-rgb),0.1);
        }
        .sd-related-icon {
          width: 36px; height: 36px; flex-shrink: 0;
          border-radius: 7px; display: flex; align-items: center; justify-content: center;
          background: rgba(var(--red-dark-rgb),0.08); border: 1px solid rgba(var(--red-dark-rgb),0.2);
          color: var(--red-bright);
        }
        .sd-related-card:hover .sd-related-icon {
          background: rgba(var(--red-dark-rgb),0.18);
          filter: drop-shadow(0 0 6px rgba(var(--red-dark-rgb),0.4));
        }

        /* Breadcrumb */
        .sd-breadcrumb {
          display: flex; align-items: center; gap: 8px;
          font-family: var(--font-display); font-size: 0.55rem;
          letter-spacing: 0.14em; text-transform: uppercase; color: var(--text-muted);
        }
        .sd-breadcrumb a { color: var(--text-muted); text-decoration: none; transition: color 0.2s; }
        .sd-breadcrumb a:hover { color: var(--red-bright); }
        .sd-breadcrumb-sep { color: rgba(var(--red-dark-rgb),0.35); }
      `}</style>

      <main style={{ background:'var(--bg-900)', minHeight:'100vh', paddingBottom:'6rem' }}>

        {/* ── Decorative bg glows ── */}
        <div aria-hidden="true" style={{ position:'fixed', top:'8%', right:'-8%', width:'480px', height:'480px', borderRadius:'50%', background:'radial-gradient(circle,rgba(var(--red-dark-rgb),0.06) 0%,transparent 70%)', pointerEvents:'none', zIndex:0, animation:'sdGlowPulse 6s ease-in-out infinite' }} />
        <div aria-hidden="true" style={{ position:'fixed', bottom:'12%', left:'-6%', width:'380px', height:'380px', borderRadius:'50%', background:'radial-gradient(circle,rgba(var(--red-dark-rgb),0.04) 0%,transparent 70%)', pointerEvents:'none', zIndex:0, animation:'sdGlowPulse 8s ease-in-out 2s infinite' }} />

        {/* ── Hero Banner ── */}
        <div style={{ position:'relative', overflow:'hidden', paddingTop:'clamp(120px, 12vw, 120px)' }}>

          {/* Gradient overlay */}
          <div style={{ position:'absolute', inset:0, background:'linear-gradient(to bottom, rgba(var(--overlay-light-rgb),0.3) 0%, rgba(var(--overlay-light-rgb),0.1) 40%, rgba(var(--overlay-light-rgb),0.96) 100%)' }} />

          {/* Scanline */}
          <div aria-hidden="true" style={{ position:'absolute', left:0, right:0, height:'2px', background:'linear-gradient(90deg,transparent,rgba(var(--red-dark-rgb),0.5),transparent)', animation:'sdScanline 4s linear infinite', pointerEvents:'none', zIndex:3 }} />

          {/* Decorative rings */}
          <div aria-hidden="true" style={{ position:'absolute', bottom:'15%', right:'5%', width:'200px', height:'200px', borderRadius:'50%', border:'1px solid rgba(var(--red-dark-rgb),0.1)', animation:'sdRingCW 18s linear infinite', pointerEvents:'none', zIndex:2 }} />
          <div aria-hidden="true" style={{ position:'absolute', bottom:'12%', right:'7%', width:'140px', height:'140px', borderRadius:'50%', border:'1px solid rgba(var(--red-dark-rgb),0.07)', animation:'sdRingCCW 12s linear infinite', pointerEvents:'none', zIndex:2 }} />

          {/* Floating icon (large) */}
          <div aria-hidden="true" style={{ position:'absolute', top:'50%', right:'8%', transform:'translateY(-50%)', width:'180px', height:'180px', display:'flex', alignItems:'center', justifyContent:'center', opacity:0.06, animation:'sdFloat 5s ease-in-out infinite', pointerEvents:'none', zIndex:1 }}>
            <div style={{ width:'100%', height:'100%', color:'var(--red-bright)' }}>{solution.icon}</div>
          </div>

          {/* Hero content */}
          <div className="container-allbotix" style={{ position:'relative', zIndex:4, display:'flex', flexDirection:'column', justifyContent:'flex-end', paddingBottom:'3rem' }}>

            {/* Breadcrumb */}
            <div className="sd-breadcrumb" style={{ animation: heroVisible ? 'sdFadeUp 0.5s ease 0.05s both' : 'none', marginBottom:'14px' }}>
              <Link href="/">Home</Link>
              <span className="sd-breadcrumb-sep">›</span>
              <Link href="/solutions">Solutions</Link>
              <span className="sd-breadcrumb-sep">›</span>
              <span style={{ color:'var(--red-bright)' }}>{solution.title}</span>
            </div>

            {/* Category badge */}
            <div style={{ display:'flex', flexWrap:'wrap', gap:'8px', marginBottom:'14px', animation: heroVisible ? 'sdFadeUp 0.5s ease 0.1s both' : 'none' }}>
              <span style={{ padding:'4px 14px', borderRadius:'100px', border: '1px solid rgba(var(--navy-rgb),0.25)', background: 'rgba(var(--white-rgb),0.55)', color: 'var(--navy)', fontFamily:'var(--font-display)', fontSize:'0.5rem', letterSpacing:'0.2em', textTransform:'uppercase', backdropFilter:'blur(6px)' }}>
                Industry Solution
              </span>
              <span style={{ padding:'4px 14px', borderRadius:'100px', background:'rgba(var(--white-rgb),0.7)', border:'1px solid rgba(var(--navy-rgb),0.25)', fontFamily:'var(--font-display)', fontSize:'0.5rem', letterSpacing:'0.2em', textTransform:'uppercase', color:'var(--navy)', backdropFilter:'blur(6px)' }}>
                {detail.deployedSolutions.length} Robots
              </span>
            </div>

            {/* Title */}
            <h1 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(2rem,5vw,3.8rem)', fontWeight:900, color:'var(--navy-deep)', lineHeight:0.95, letterSpacing:'-0.02em', marginBottom:'14px', animation: heroVisible ? 'sdFadeUp 0.55s ease 0.15s both' : 'none' }}>
              {solution.title}
            </h1>

            {/* Red divider */}
            <div style={{ width:'48px', height:'2px', background:'linear-gradient(90deg,var(--red-bright),transparent)', marginBottom:'14px', animation: heroVisible ? 'sdFadeUp 0.5s ease 0.2s both' : 'none' }} />

            {/* Headline */}
            <p style={{ maxWidth:'580px', fontFamily:'var(--font-display)', fontSize:'1rem', fontWeight:600, color:'var(--navy)', letterSpacing:'0.02em', lineHeight:1.5, marginBottom:'10px', animation: heroVisible ? 'sdFadeUp 0.5s ease 0.23s both' : 'none' }}>
              {detail.headline}
            </p>

            {/* Overview */}
            <p style={{ maxWidth:'580px', fontFamily:'var(--font-light)', fontSize:'0.9rem', color:'rgba(var(--navy-rgb),0.78)', lineHeight:1.85, animation: heroVisible ? 'sdFadeUp 0.5s ease 0.27s both' : 'none' }}>
              {detail.overview}
            </p>

            {/* Stat pills */}
            <div style={{ display:'flex', flexWrap:'wrap', gap:'8px', marginTop:'1.5rem', animation: heroVisible ? 'sdFadeUp 0.5s ease 0.32s both' : 'none' }}>
              {[
                `${detail.deployedSolutions.length} Solutions Deployed`,
                `${detail.capabilities.length} Key Capabilities`,
                `${detail.impact.length} Business Outcomes`,
              ].map(spec => (
                <span key={spec} style={{ display:'inline-flex', alignItems:'center', gap:'6px', padding:'5px 14px', borderRadius:'100px', border:'1px solid rgba(var(--navy-rgb),0.2)', background:'rgba(var(--white-rgb),0.65)', fontFamily:'var(--font-display)', fontSize:'0.6rem', color:'var(--navy)', letterSpacing:'0.04em', backdropFilter:'blur(6px)' }}>
                  <span style={{ width:'3px', height:'3px', borderRadius:'50%', background:'var(--red-bright)', flexShrink:0 }} />
                  {spec}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ── Body ── */}
        <div ref={bodyRef} className="container-allbotix" style={{ position:'relative', zIndex:2, paddingTop:'3rem' }}>

          {/* Back + CTA bar */}
          <div className="sd-cta-bar" style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:'1rem', flexWrap:'wrap', marginBottom:'3rem', opacity: bodyVisible ? 1 : 0, transform: bodyVisible ? 'translateY(0)' : 'translateY(20px)', transition:'opacity 0.6s ease 0.1s, transform 0.6s ease 0.1s' }}>
            <Link href="/solutions" className="btn-outline" style={{ display:'flex', alignItems:'center', gap:'8px' }}>
              <ArrowLeftIcon /> All Solutions
            </Link>
            <div style={{ display:'flex', gap:'10px', flexWrap:'wrap' }}>
              <Link href="#contact" className="btn-primary" style={{ fontSize:'0.62rem', display:'flex', alignItems:'center', gap:'8px' }}>
                Request a Demo
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </Link>
            </div>
          </div>

          {/* ── Stats Row ── */}
          <div className="sd-section" style={{ borderTop:'none', marginBottom:'1rem', opacity: bodyVisible ? 1 : 0, transition:'opacity 0.6s ease 0.15s' }}>
            <div className="sd-stats-grid">
              {stats.map((s, i) => <StatPill key={s.label} value={s.value} label={s.label} delay={i * 0.1 + 0.2} />)}
            </div>
          </div>

          {/* ── Deployed Solutions ── */}
          <div className="sd-section" style={{ opacity: bodyVisible ? 1 : 0, transition:'opacity 0.6s ease 0.2s' }}>
            <div className="sd-section-label">Allbotix Solutions Deployed</div>
            <h2 className="sd-section-title">Robots Powering This Solution</h2>
            <p className="sd-section-sub">Our purpose-built robotics lineup deployed specifically for {solution.title.toLowerCase()} environments.</p>
            <div className="sd-deployed-grid">
              {detail.deployedSolutions.map((ds, i) => (
                <DeployedCard key={ds.name} item={ds} index={i} visible={bodyVisible} />
              ))}
            </div>
          </div>

          {/* ── Capabilities + Impact (two-col) ── */}
          <div className="sd-section">
            <div className="sd-two-col">

              {/* Capabilities */}
              <div style={{ opacity: bodyVisible ? 1 : 0, transform: bodyVisible ? 'translateX(0)' : 'translateX(-20px)', transition:'opacity 0.6s ease 0.3s, transform 0.6s ease 0.3s' }}>
                <div className="sd-section-label">Capabilities</div>
                <h2 className="sd-section-title" style={{ fontSize:'clamp(1.1rem,2.2vw,1.55rem)' }}>Key Capabilities</h2>
                <p className="sd-section-sub" style={{ marginBottom:'1.5rem' }}>What our robotic systems are engineered to do.</p>
                <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
                  {detail.capabilities.map((cap, i) => (
                    <div
                      key={i}
                      className="sd-cap-row"
                      style={{ opacity: bodyVisible ? 1 : 0, transform: bodyVisible ? 'translateX(0)' : 'translateX(-12px)', transition: `opacity 0.5s ease ${i * 0.07 + 0.35}s, transform 0.5s ease ${i * 0.07 + 0.35}s, border-color 0.25s, background 0.25s` }}
                    >
                      <span className="sd-cap-dot" />
                      {cap}
                    </div>
                  ))}
                </div>
              </div>

              {/* Business Impact */}
              <div style={{ opacity: bodyVisible ? 1 : 0, transform: bodyVisible ? 'translateX(0)' : 'translateX(20px)', transition:'opacity 0.6s ease 0.35s, transform 0.6s ease 0.35s' }}>
                <div className="sd-section-label">Business Impact</div>
                <h2 className="sd-section-title" style={{ fontSize:'clamp(1.1rem,2.2vw,1.55rem)' }}>Measurable Outcomes</h2>
                <p className="sd-section-sub" style={{ marginBottom:'1.5rem' }}>Real-world results our clients achieve with Allbotix.</p>
                <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
                  {detail.impact.map((imp, i) => (
                    <div
                      key={i}
                      className="sd-impact-row"
                      style={{ opacity: bodyVisible ? 1 : 0, transform: bodyVisible ? 'translateY(0)' : 'translateY(12px)', transition: `opacity 0.5s ease ${i * 0.09 + 0.4}s, transform 0.5s ease ${i * 0.09 + 0.4}s, border-color 0.25s, background 0.25s, box-shadow 0.25s` }}
                    >
                      <div className="sd-impact-check"><CheckIcon /></div>
                      <p style={{ fontFamily:'var(--font-light)', fontSize:'0.82rem', color:'var(--text-secondary)', lineHeight:1.65 }}>{imp}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* ── Other Solutions ── */}
          {solutions.filter(s => (s as any).uid !== uid).length > 0 && (
            <div className="sd-section" style={{ opacity: bodyVisible ? 1 : 0, transition:'opacity 0.6s ease 0.5s' }}>
              <div className="sd-section-label">Explore More</div>
              <h2 className="sd-section-title">Other Solutions</h2>
              <p className="sd-section-sub">Discover how Allbotix transforms other industries.</p>
              <div className="sd-related-grid">
                {solutions
                  .filter(s => (s as any).uid !== uid)
                  .map((s, i) => (
                    <Link
                      key={(s as any).uid}
                      href={`/solutions/${(s as any).uid}`}
                      className="sd-related-card"
                      style={{ opacity: bodyVisible ? 1 : 0, transform: bodyVisible ? 'translateY(0)' : 'translateY(16px)', transition: `opacity 0.5s ease ${i * 0.07 + 0.55}s, transform 0.5s ease ${i * 0.07 + 0.55}s, border-color 0.25s, background 0.25s, box-shadow 0.25s` }}
                    >
                      <div className="sd-related-icon">
                        <div style={{ width:'18px', height:'18px' }}>{s.icon}</div>
                      </div>
                      <div style={{ minWidth:0 }}>
                        <p style={{ fontFamily:'var(--font-display)', fontSize:'0.72rem', fontWeight:700, color:'var(--text-primary)', letterSpacing:'0.03em', marginBottom:'2px', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{s.title}</p>
                        <p style={{ fontFamily:'var(--font-light)', fontSize:'0.64rem', color:'var(--text-muted)', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden', lineHeight:1.5 }}>{s.desc}</p>
                      </div>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(var(--red-dark-rgb),0.5)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink:0 }}>
                        <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                      </svg>
                    </Link>
                  ))}
              </div>
            </div>
          )}

          {/* ── Bottom CTA ── */}
          <div className="sd-cta-card" style={{ marginTop:'5rem', opacity: bodyVisible ? 1 : 0, transition:'opacity 0.6s ease 0.6s' }}>
            <div aria-hidden="true" style={{ position:'absolute', inset:0, background:'radial-gradient(circle at 50% 50%,rgba(var(--red-dark-rgb),0.07) 0%,transparent 70%)', pointerEvents:'none' }} />
            <div style={{ position:'relative', zIndex:1 }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'8px', marginBottom:'10px' }}>
                <div style={{ width:'32px', height:'32px', borderRadius:'50%', border:'1px solid rgba(var(--red-dark-rgb),0.35)', background:'rgba(var(--red-dark-rgb),0.08)', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--red-bright)', animation:'sdFloat 3s ease-in-out infinite' }}>
                  <BoltIcon />
                </div>
              </div>
              <div className="sd-section-label" style={{ textAlign:'center', marginBottom:'10px' }}>Get Started</div>
              <h2 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(1.4rem,3vw,2.2rem)', fontWeight:900, color:'var(--text-primary)', letterSpacing:'0.02em', marginBottom:'12px' }}>
                Ready to Deploy <span style={{ color:'var(--red-bright)' }}>{solution.title}</span> Automation?
              </h2>
              <p style={{ fontFamily:'var(--font-light)', fontSize:'0.88rem', color:'var(--text-secondary)', maxWidth:'480px', margin:'0 auto 2rem', lineHeight:1.85 }}>
                Our engineers are ready to walk you through a live demo and design the right robotic configuration for your operation.
              </p>
              <div style={{ display:'flex', gap:'12px', justifyContent:'center', flexWrap:'wrap' }}>
                <Link href="#contact" className="btn-primary" style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                  Request a Consultation
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                </Link>
                <Link href="/solutions" className="btn-outline" style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                  <TargetIcon /> All Solutions
                </Link>
              </div>
            </div>
          </div>

        </div>
      </main>
    </>
  )
}