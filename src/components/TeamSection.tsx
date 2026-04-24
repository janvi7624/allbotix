'use client'

import Link from 'next/link'
import { useRef, useState, useEffect } from 'react'
import { TEAM, VALUES } from '@/data/team'

/* ─── Particle background ────────────────────────────────────────────────── */
function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return
    const ctx = canvas.getContext('2d')!
    // Read brand colour from CSS variable so it stays in sync with the design token
    const redRgb = '176,58,46'
    let w = canvas.offsetWidth, h = canvas.offsetHeight
    canvas.width = w; canvas.height = h
    const pts = Array.from({ length: 60 }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.6 + 0.4, o: Math.random() * 0.45 + 0.1,
    }))
    let raf: number
    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy
        if (p.x < 0) p.x = w; if (p.x > w) p.x = 0
        if (p.y < 0) p.y = h; if (p.y > h) p.y = 0
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${redRgb},${p.o})`; ctx.fill()
      })
      for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) {
        const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y, d = Math.sqrt(dx * dx + dy * dy)
        if (d < 100) { ctx.beginPath(); ctx.strokeStyle = `rgba(${redRgb},${0.1 * (1 - d / 100)})`; ctx.lineWidth = 0.5; ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y); ctx.stroke() }
      }
      raf = requestAnimationFrame(draw)
    }
    draw()
    const resize = () => { w = canvas.offsetWidth; h = canvas.offsetHeight; canvas.width = w; canvas.height = h }
    window.addEventListener('resize', resize)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
  }, [])
  return <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }} />
}

/* ─── 3D Flip Card ───────────────────────────────────────────────────────── */
function TeamCard({ member, visible }: { member: typeof TEAM[0]; visible: boolean }) {
  const [flipped, setFlipped] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const shineRef = useRef<HTMLDivElement>(null)
  const [hovered, setHovered] = useState(false)

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (flipped) return
    const el = cardRef.current; if (!el) return
    const r = el.getBoundingClientRect()
    const dx = (e.clientX - r.left - r.width / 2) / (r.width / 2)
    const dy = (e.clientY - r.top - r.height / 2) / (r.height / 2)
    el.style.setProperty('--rx', `${-dy * 10}deg`)
    el.style.setProperty('--ry', `${dx * 10}deg`)
    if (shineRef.current) {
      const px = ((e.clientX - r.left) / r.width) * 100
      const py = ((e.clientY - r.top) / r.height) * 100
      shineRef.current.style.background = `radial-gradient(circle at ${px}% ${py}%, var(--red-glow) 0%, transparent 62%)`
      shineRef.current.style.opacity = '1'
    }
  }
  const onLeave = () => {
    const el = cardRef.current; if (!el) return
    el.style.setProperty('--rx', '0deg'); el.style.setProperty('--ry', '0deg')
    if (shineRef.current) shineRef.current.style.opacity = '0'
    setHovered(false)
  }

  return (
    <div
      style={{
        opacity: visible ? 1 : 0,
        translate: visible ? '0 0' : '0 50px',
        filter: visible ? 'none' : 'blur(6px)',
        transition: `opacity 0.7s ease ${member.index * 0.15 + 0.1}s, translate 0.7s ease ${member.index * 0.15 + 0.1}s, filter 0.7s ease ${member.index * 0.15 + 0.1}s`,
        perspective: '900px',
      }}
    >
      <div
        ref={cardRef}
        onMouseMove={onMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={onLeave}
        onClick={() => setFlipped(p => !p)}
        style={{
          '--rx': '0deg', '--ry': '0deg',
          position: 'relative',
          width: '100%',
          height: '440px',
          transformStyle: 'preserve-3d',
          transform: flipped
            ? 'rotateY(180deg)'
            : 'perspective(900px) rotateX(var(--rx)) rotateY(var(--ry))',
          transition: flipped
            ? 'transform 0.7s cubic-bezier(0.23,1,0.32,1)'
            : 'transform 0.45s cubic-bezier(0.23,1,0.32,1)',
          cursor: 'pointer',
        } as React.CSSProperties}
      >

        {/* ── FRONT ── */}
        <div style={{
          position: 'absolute', inset: 0,
          backfaceVisibility: 'hidden',
          borderRadius: '14px', overflow: 'hidden',
          border: `1px solid ${hovered && !flipped ? 'var(--copper-border)' : 'var(--border-soft)'}`,
          background: 'var(--bg-card)',
          boxShadow: hovered && !flipped
            ? '0 28px 70px rgba(var(--black-rgb),0.65), 0 0 36px var(--red-glow)'
            : '0 8px 30px rgba(var(--black-rgb),0.35)',
          transition: 'border-color 0.3s, box-shadow 0.4s',
        }}>
          {/* Shine */}
          <div ref={shineRef} aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0, transition: 'opacity 0.3s', zIndex: 3 }} />

          {/* Top gradient bar */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg,var(--red-bright),var(--red-dim),transparent)', zIndex: 4 }} />

          {/* Scanline */}
          <div aria-hidden="true" style={{ position: 'absolute', inset: 0, overflow: 'hidden', zIndex: 2, pointerEvents: 'none' }}>
            <div style={{ position: 'absolute', left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg,transparent,var(--red-soft),transparent)', animation: `scanline 4s linear ${member.index * 0.8}s infinite` }} />
          </div>

          {/* Photo */}
          <div style={{ position: 'relative', height: '260px', overflow: 'hidden' }}>
            <div style={{
              position: 'absolute', inset: 0,
              backgroundImage: `url(${member.img})`,
              backgroundSize: 'cover', backgroundPosition: 'center top',
              transform: hovered && !flipped ? 'scale(1.06)' : 'scale(1)',
              transition: 'transform 0.6s cubic-bezier(0.23,1,0.32,1)',
            }} />
            {/* Gradient overlay */}
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(var(--overlay-dark-rgb),0.92) 0%,rgba(var(--overlay-dark-rgb),0.3) 50%,transparent 100%)' }} />
            {/* Dept tag */}
            <div style={{ position: 'absolute', top: '12px', left: '12px', padding: '4px 12px', borderRadius: '100px', background: 'rgba(var(--overlay-dark-rgb),0.8)', border: '1px solid var(--copper-border)', backdropFilter: 'blur(8px)', zIndex: 2 }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.5rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--red-bright)' }}>{member.dept}</span>
            </div>
            {/* Flip hint */}
            <div style={{ position: 'absolute', top: '12px', right: '12px', padding: '4px 10px', borderRadius: '100px', background: 'var(--red-soft)', border: '1px solid var(--copper-border)', zIndex: 2, opacity: hovered && !flipped ? 1 : 0, transition: 'opacity 0.3s' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.45rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--red-bright)' }}>Tap to flip</span>
            </div>
          </div>

          {/* Info */}
          <div style={{ padding: '1.5rem 1.5rem 1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--red-bright)', flexShrink: 0, boxShadow: '0 0 8px var(--red-glow)', animation: 'dotPulse 2s ease-in-out infinite' }} />
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.52rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--red-bright)' }}>{member.tag}</span>
            </div>
            <h3 style={{
              fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '0.03em', marginBottom: '4px', lineHeight: 1.1,
              transform: hovered && !flipped ? 'translateZ(14px)' : 'translateZ(0)',
              transition: 'transform 0.4s cubic-bezier(0.23,1,0.32,1)',
            }}>{member.name}</h3>
            <p style={{ fontFamily: 'var(--font-light)', fontSize: '0.78rem', color: 'var(--text-muted)', letterSpacing: '0.06em' }}>{member.role}</p>
            {/* Accent line */}
            <div style={{ height: '1px', marginTop: '1rem', background: 'linear-gradient(90deg,var(--red-bright),transparent)', transform: hovered && !flipped ? 'scaleX(1)' : 'scaleX(0)', transformOrigin: 'left', transition: 'transform 0.4s cubic-bezier(0.23,1,0.32,1)' }} />
          </div>
        </div>

        {/* ── BACK ── */}
        <div style={{
          position: 'absolute', inset: 0,
          backfaceVisibility: 'hidden',
          transform: 'rotateY(180deg)',
          borderRadius: '14px', overflow: 'hidden',
          border: '1px solid var(--copper-border)',
          background: 'linear-gradient(var(--copper-tale),var(--bg-800))',
          boxShadow: '0 28px 70px rgba(var(--black-rgb),0.7), 0 0 40px var(--red-glow)',
          display: 'flex', flexDirection: 'column', padding: '2rem 1.75rem',
          gap: '1.25rem',
        }}>
          {/* Corner glow */}
          <div aria-hidden="true" style={{ position: 'absolute', top: '-1px', right: '-1px', width: '120px', height: '120px', background: 'radial-gradient(circle at top right,var(--copper-glow) 0%,transparent 70%)', borderRadius: '0 14px 0 0', pointerEvents: 'none' }} />
          <div aria-hidden="true" style={{ position: 'absolute', bottom: '-1px', left: '-1px', width: '100px', height: '100px', background: 'radial-gradient(circle at bottom left,var(--red-soft) 0%,transparent 70%)', borderRadius: '0 0 0 14px', pointerEvents: 'none' }} />

          {/* Top bar */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg,transparent,var(--red-bright),transparent)' }} />

          <div>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.5rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--red-bright)' }}>{member.tag}</span>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '0.02em', lineHeight: 0.95, marginTop: '6px' }}>{member.name}</h3>
            <div style={{ width: '36px', height: '2px', background: 'linear-gradient(90deg,var(--red-bright),transparent)', marginTop: '10px' }} />
          </div>

          <p style={{ fontFamily: 'var(--font-light)', fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.85 }}>{member.bio}</p>

          <div>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '0.5rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.65rem' }}>Expertise</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {member.skills.map(s => (
                <span key={s} style={{ padding: '4px 10px', borderRadius: '100px', border: '1px solid var(--copper-border)', background: 'var(--copper-soft)', fontFamily: 'var(--font-display)', fontSize: '0.52rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--copper)' }}>{s}</span>
              ))}
            </div>
          </div>

          <div style={{ marginTop: 'auto', display: 'flex', gap: '10px' }}>
            <a href={`mailto:${member.social.email}`} style={{ flex: 1, padding: '10px', background: 'linear-gradient(135deg,var(--red-soft),var(--copper-soft))', border: '1px solid var(--copper-border)', borderRadius: '8px', textAlign: 'center', fontFamily: 'var(--font-display)', fontSize: '0.55rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--red-bright)', textDecoration: 'none', transition: 'all 0.25s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--red-soft)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 0 20px var(--red-glow)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'linear-gradient(135deg,var(--red-soft),var(--copper-soft))'; (e.currentTarget as HTMLElement).style.boxShadow = 'none' }}
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
              Email
            </a>
            <a href={member.social.linkedin} style={{ flex: 1, padding: '10px', background: 'var(--copper-soft)', border: '1px solid var(--border)', borderRadius: '8px', textAlign: 'center', fontFamily: 'var(--font-display)', fontSize: '0.55rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-muted)', textDecoration: 'none', transition: 'all 0.25s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--copper-border)'; (e.currentTarget as HTMLElement).style.color = 'var(--red-bright)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)' }}
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z M4 6a2 2 0 100-4 2 2 0 000 4z" /></svg>
              LinkedIn
            </a>
            <button onClick={e => { e.stopPropagation(); setFlipped(false) }} style={{ width: '40px', flexShrink: 0, background: 'var(--copper-soft)', border: '1px solid var(--border)', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', transition: 'all 0.25s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--copper-border)'; (e.currentTarget as HTMLElement).style.color = 'var(--red-bright)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)' }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 102.13-9.36L1 10" /></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── Value card ─────────────────────────────────────────────────────────── */
function ValueCard({ item, index, visible }: { item: typeof VALUES[0]; index: number; visible: boolean }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const shineRef = useRef<HTMLDivElement>(null)
  const [hovered, setHovered] = useState(false)

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current; if (!el) return
    const r = el.getBoundingClientRect()
    const dx = (e.clientX - r.left - r.width / 2) / (r.width / 2)
    const dy = (e.clientY - r.top - r.height / 2) / (r.height / 2)
    el.style.transform = `perspective(700px) rotateX(${-dy * 9}deg) rotateY(${dx * 9}deg) scale3d(1.04,1.04,1.04) translateZ(8px)`
    if (shineRef.current) {
      const px = ((e.clientX - r.left) / r.width) * 100, py = ((e.clientY - r.top) / r.height) * 100
      shineRef.current.style.background = `radial-gradient(circle at ${px}% ${py}%,var(--red-glow) 0%,transparent 58%)`
      shineRef.current.style.opacity = '1'
    }
  }
  const onLeave = () => {
    if (cardRef.current) cardRef.current.style.transform = 'perspective(700px) rotateX(0) rotateY(0) scale3d(1,1,1) translateZ(0)'
    if (shineRef.current) shineRef.current.style.opacity = '0'
    setHovered(false)
  }

  return (
    <div ref={cardRef} onMouseMove={onMove} onMouseEnter={() => setHovered(true)} onMouseLeave={onLeave}
      style={{
        position: 'relative', padding: '2rem 1.75rem',
        background: hovered ? 'var(--bg-900)' : 'var(--bg-card)',
        border: `1px solid ${hovered ? 'var(--copper-border)' : 'var(--border-soft)'}`,
        borderRadius: '12px', overflow: 'hidden',
        transformStyle: 'preserve-3d', cursor: 'default',
        transition: 'transform 0.45s cubic-bezier(0.23,1,0.32,1),border-color 0.3s,box-shadow 0.4s,background 0.3s',
        boxShadow: hovered ? '0 24px 60px rgba(var(--black-rgb),0.6),0 0 28px var(--red-glow)' : 'none',
        opacity: visible ? 1 : 0, translate: visible ? '0 0' : '0 36px', filter: visible ? 'none' : 'blur(4px)',
        transitionProperty: 'transform,border-color,box-shadow,background,opacity,translate,filter',
        transitionDuration: '0.45s,0.3s,0.4s,0.3s,0.6s,0.6s,0.6s',
        transitionDelay: `0s,0s,0s,0s,${index * 0.1 + 0.2}s,${index * 0.1 + 0.2}s,${index * 0.1 + 0.2}s`,
      }}
    >
      <div ref={shineRef} aria-hidden="true" style={{ position: 'absolute', inset: 0, borderRadius: '12px', pointerEvents: 'none', opacity: 0, transition: 'opacity 0.3s', zIndex: 1 }} />
      <div
        className="icon-circle"
        style={{
          marginBottom: '1rem',
          position: 'relative',
          zIndex: 2,
          transform: hovered ? 'translateZ(16px) scale(1.1)' : 'translateZ(0) scale(1)',
          transition: 'transform 0.4s cubic-bezier(0.23,1,0.32,1)',
          animation: `floatIcon 3.5s ease-in-out ${index * 0.35}s infinite`,
          filter: hovered ? 'drop-shadow(0 0 10px var(--red-glow))' : 'none',
        }}
      >{item.icon}</div>      <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.6rem', letterSpacing: '0.04em', transform: hovered ? 'translateZ(12px)' : 'translateZ(0)', transition: 'transform 0.4s cubic-bezier(0.23,1,0.32,1)', position: 'relative', zIndex: 2 }}>{item.title}</h4>
      <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.75, position: 'relative', zIndex: 2 }}>{item.desc}</p>
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg,var(--red-bright),transparent)', transform: hovered ? 'scaleX(1)' : 'scaleX(0)', transformOrigin: 'left', transition: 'transform 0.4s cubic-bezier(0.23,1,0.32,1)' }} />
    </div>
  )
}

/* ─── Stats counter ──────────────────────────────────────────────────────── */
function StatCounter({ target, suffix, label, started, delay }: { target: number; suffix: string; label: string; started: boolean; delay: number }) {
  const [val, setVal] = useState(0)
  const done = useRef(false)
  useEffect(() => {
    if (!started || done.current) return
    done.current = true
    const t = setTimeout(() => {
      const dur = 1800, start = performance.now()
      const ease = (t: number) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
      const tick = (now: number) => {
        const p = Math.min((now - start) / dur, 1)
        setVal(Math.floor(ease(p) * target))
        if (p < 1) requestAnimationFrame(tick); else setVal(target)
      }
      requestAnimationFrame(tick)
    }, delay)
    return () => clearTimeout(t)
  }, [started, target, delay])
  return (
    <div style={{ textAlign: 'center' }}>
      <p style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 900, color: 'var(--text-primary)', lineHeight: 1, letterSpacing: '0.02em' }}>
        {val}{suffix}
      </p>
      <p style={{ fontFamily: 'var(--font-light)', fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.12em', marginTop: '6px' }}>{label}</p>
    </div>
  )
}

/* ─── Main page ──────────────────────────────────────────────────────────── */
export default function TeamSection() {
  const heroRef = useRef<HTMLDivElement>(null)
  const teamRef = useRef<HTMLElement>(null)
  const valRef = useRef<HTMLElement>(null)
  const statsRef = useRef<HTMLElement>(null)

  const [heroVisible, setHeroVisible] = useState(false)
  const [teamVisible, setTeamVisible] = useState(false)
  const [valVisible, setValVisible] = useState(false)
  const [statsStarted, setStatsStarted] = useState(false)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    const make = (el: Element | null, setter: (v: boolean) => void, th = 0.1) => {
      if (!el) return
      const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setter(true); io.disconnect() } }, { threshold: th })
      io.observe(el); return () => io.disconnect()
    }
    const c1 = make(heroRef.current, setHeroVisible, 0.15)
    const c2 = make(teamRef.current, setTeamVisible, 0.08)
    const c3 = make(valRef.current, setValVisible, 0.1)
    const c4 = make(statsRef.current, setStatsStarted, 0.2)
    return () => { c1?.(); c2?.(); c3?.(); c4?.() }
  }, [])

  return (
    <div style={{ background: 'var(--bg-900)', minHeight: '100vh' }}>
      <style>{`
        @keyframes scanline   { 0%{top:-3%;opacity:0.55} 100%{top:108%;opacity:0} }
        @keyframes dotPulse   { 0%,100%{opacity:0.45;transform:scale(1)} 50%{opacity:1;transform:scale(1.5)} }
        @keyframes glowFloat  { 0%,100%{opacity:0.5;transform:scale(1)} 50%{opacity:0.9;transform:scale(1.1)} }
        @keyframes heroFadeUp { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
        @keyframes lineGrow   { from{width:0;opacity:0} to{opacity:1} }
        @keyframes ringCW     { to{transform:translate(-50%,-50%) rotate(360deg)} }
        @keyframes ringCCW    { to{transform:translate(-50%,-50%) rotate(-360deg)} }
        @keyframes floatY     { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
        @keyframes floatIcon  { 0%,100%{transform:translateY(0) translateZ(0)} 50%{transform:translateY(-5px) translateZ(8px)} }
        @keyframes statIn     { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes borderPulse{
          0%,100%{box-shadow:0 0 0 0 transparent;border-color:var(--border);}
          50%{box-shadow:0 0 28px var(--red-glow);border-color:var(--copper-border);}
        }
        @keyframes shimmer {
          0%{background-position:-600px 0}
          100%{background-position:600px 0}
        }

        @media(max-width:900px){ .team-grid{grid-template-columns:repeat(2,1fr)!important} .val-grid{grid-template-columns:repeat(2,1fr)!important} }
        @media(max-width:560px){ .team-grid{grid-template-columns:1fr!important} .val-grid{grid-template-columns:1fr!important} .stats-row{grid-template-columns:repeat(2,1fr)!important} }
      `}</style>

      {/* ══ HERO ══════════════════════════════════════════════════════════════ */}
      <section style={{ position: 'relative', minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', paddingBlock: '8rem 6rem', background: `radial-gradient(ellipse 80% 60% at 50% 40%,var(--red-soft) 0%,transparent 70%),var(--bg-900)` }}>
        <ParticleField />

        {/* Rings */}
        <div aria-hidden="true" style={{ position: 'absolute', width: '600px', height: '600px', borderRadius: '50%', border: '1px dashed var(--red-soft)', top: '50%', left: '50%', animation: 'ringCW 30s linear infinite', pointerEvents: 'none' }} />
        <div aria-hidden="true" style={{ position: 'absolute', width: '400px', height: '400px', borderRadius: '50%', border: '1px solid var(--border)', top: '50%', left: '50%', animation: 'ringCCW 20s linear infinite', pointerEvents: 'none' }} />

        {/* Corner brackets */}
        <div aria-hidden="true" style={{ position: 'absolute', top: '5rem', left: '2rem', width: '40px', height: '40px', borderTop: '1px solid var(--red-bright)', borderLeft: '1px solid var(--red-bright)', opacity: 0.45 }} />
        <div aria-hidden="true" style={{ position: 'absolute', bottom: '3rem', right: '2rem', width: '40px', height: '40px', borderBottom: '1px solid var(--red-bright)', borderRight: '1px solid var(--red-bright)', opacity: 0.45 }} />

        <div ref={heroRef} className="container-allbotix" style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
          <div style={{ opacity: heroVisible ? 1 : 0, transform: heroVisible ? 'translateY(0)' : 'translateY(20px)', transition: 'opacity 0.6s ease 0.05s,transform 0.6s ease 0.05s' }}>
            <div className="section-tag" style={{ justifyContent: 'center', marginBottom: '1.25rem' }}>The People Behind The Machines</div>
          </div>

          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.5rem,7vw,5.5rem)',
            fontWeight: 900, lineHeight: 1.05, letterSpacing: '0.02em',
            color: 'var(--text-primary)', marginBottom: '1.5rem',
            opacity: heroVisible ? 1 : 0,
            transform: heroVisible ? 'translateY(0)' : 'translateY(28px)',
            transition: 'opacity 0.7s ease 0.12s,transform 0.7s ease 0.12s',
          }}>
            Meet the <span style={{ color: 'var(--red-bright)', textShadow: '0 0 50px var(--red-glow)' }}>Minds</span><br />
            Shaping Tomorrow.
          </h1>

          <div style={{ width: '60px', height: '2px', background: 'linear-gradient(90deg,var(--red-bright),transparent)', margin: '0 auto 1.5rem', opacity: heroVisible ? 1 : 0, animation: heroVisible ? 'lineGrow 0.7s ease 0.3s both' : 'none' }} />

          <p style={{
            maxWidth: '520px', margin: '0 auto 2.5rem',
            fontSize: '1rem', lineHeight: 1.9, color: 'var(--text-secondary)',
            opacity: heroVisible ? 1 : 0, transform: heroVisible ? 'translateY(0)' : 'translateY(18px)',
            transition: 'opacity 0.6s ease 0.25s,transform 0.6s ease 0.25s',
          }}>
            A small team with enormous ambition — engineers, strategists, and innovators united by one mission: to make intelligent automation accessible to every industry.
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', opacity: heroVisible ? 1 : 0, transform: heroVisible ? 'translateY(0)' : 'translateY(16px)', transition: 'opacity 0.6s ease 0.35s,transform 0.6s ease 0.35s' }}>
            <Link href="#team" className="btn-primary">
              Meet the Team
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
            </Link>
            <Link href="#contact" className="btn-outline">Work With Us</Link>
          </div>
        </div>
      </section>

      {/* ══ STATS BAR ════════════════════════════════════════════════════════ */}
      <section ref={statsRef} style={{ position: 'relative', borderTop: '1px solid var(--border-soft)', borderBottom: '1px solid var(--border-soft)', background: 'var(--red-soft)', paddingBlock: '3rem', overflow: 'hidden' }}>
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(45deg,var(--red-soft) 0px,var(--red-soft) 1px,transparent 1px,transparent 22px)', pointerEvents: 'none' }} />
        <div className="container-allbotix" style={{ position: 'relative', zIndex: 2 }}>
          <div
            className="stats-row"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4,1fr)',
              gap: '1.5px',
              background: 'var(--border)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              overflow: 'hidden'
            }}
          >
            {[
              { target: 15, suffix: '+', label: 'Years Experience' },
              { target: 3, suffix: '', label: 'Core Team Members' },
              { target: 40, suffix: '+', label: 'Countries Served' },
              { target: 21, suffix: 'K+', label: 'Projects Delivered' },
            ].map((s, i) => {
              const isHovered = hoveredIndex === i;

              return (
                <div
                  key={s.label}
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  style={{
                    padding: '2rem 1.5rem',
                    background: isHovered
                      ? 'var(--bg-700)'
                      : 'var(--bg-card)',
                    border: `1px solid ${isHovered
                        ? 'rgba(var(--red-dark-rgb),0.45)'
                        : 'rgba(var(--red-dark-rgb),0.15)'
                      }`,
                    transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
                    boxShadow: isHovered
                      ? '0 8px 20px rgba(var(--red-dark-rgb),0.15)'
                      : 'none',

                    opacity: statsStarted ? 1 : 0,
                    transition: `
            opacity 0.6s ease ${i * 0.12 + 0.1}s,
            transform 0.25s ease,
            background 0.25s ease,
            border 0.25s ease,
            box-shadow 0.25s ease
          `
                  }}
                >
                  <StatCounter
                    target={s.target}
                    suffix={s.suffix}
                    label={s.label}
                    started={statsStarted}
                    delay={i * 180}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══ TEAM CARDS ═══════════════════════════════════════════════════════ */}
      <section id="team" ref={teamRef} style={{ position: 'relative', paddingBlock: '6rem', background: 'var(--bg-800)', overflow: 'hidden', borderTop: '1px solid var(--border-soft)' }}>
        <div aria-hidden="true" style={{ position: 'absolute', top: '15%', right: '-8%', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle,var(--red-soft) 0%,transparent 70%)', pointerEvents: 'none', animation: 'glowFloat 6s ease-in-out infinite' }} />
        <div aria-hidden="true" style={{ position: 'absolute', bottom: '15%', left: '-8%', width: '380px', height: '380px', borderRadius: '50%', background: 'radial-gradient(circle,var(--copper-soft) 0%,transparent 70%)', pointerEvents: 'none', animation: 'glowFloat 8s ease-in-out 2s infinite' }} />
        {/* Watermark */}
        <div aria-hidden="true" style={{ position: 'absolute', bottom: '-2rem', left: '50%', transform: 'translateX(-50%)', whiteSpace: 'nowrap', pointerEvents: 'none', fontFamily: 'var(--font-display)', fontSize: 'clamp(5rem,14vw,10rem)', fontWeight: 900, color: 'transparent', WebkitTextStroke: '1px var(--red-soft)', letterSpacing: '0.05em', lineHeight: 1, userSelect: 'none' }}>TEAM</div>

        <div className="container-allbotix" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem', opacity: teamVisible ? 1 : 0, transform: teamVisible ? 'translateY(0)' : 'translateY(24px)', filter: teamVisible ? 'none' : 'blur(3px)', transition: 'opacity 0.7s ease,transform 0.7s ease,filter 0.7s ease' }}>
            <div className="section-tag" style={{ justifyContent: 'center' }}>Our People</div>
            <h2 className="section-title" style={{ marginBottom: '0.75rem' }}>The Architects of <span>Automation.</span></h2>
            <p style={{ maxWidth: '460px', margin: '0 auto', fontSize: '0.9rem', lineHeight: 1.85, color: 'var(--text-secondary)' }}>
              Click any card to reveal the full profile, expertise, and contact details.
            </p>
            {/* Flip hint badge */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginTop: '1rem', padding: '6px 16px', borderRadius: '100px', background: 'var(--red-soft)', border: '1px solid var(--copper-border)' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--red-bright)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 102.13-9.36L1 10" /></svg>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.55rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--red-bright)' }}>Click cards to flip</span>
            </div>
          </div>

          <div className="team-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '2rem', perspective: '1200px' }}>
            {TEAM.map(member => <TeamCard key={member.name} member={member} visible={teamVisible} />)}
          </div>

          {/* Join banner */}
          <div style={{
            marginTop: '4rem', padding: '3rem',
            background: `linear-gradient(135deg,rgba(var(--red-dark-rgb),0.08),rgba(var(--red-dark-rgb),0.03))`,
            border: `1px solid rgba(var(--red-dark-rgb),0.2)`, borderRadius: '14px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '2rem',
            animation: 'borderPulse 5s ease-in-out infinite',
            opacity: teamVisible ? 1 : 0, transform: teamVisible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'opacity 0.7s ease 0.5s,transform 0.7s ease 0.5s',
            position: 'relative', overflow: 'hidden',
          }}>
            <div aria-hidden="true" style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg,transparent,var(--red-bright),transparent)', animation: 'shimmer 3s linear infinite', backgroundSize: '600px 100%' }} />
            <div>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: '0.58rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--red-bright)', marginBottom: '6px' }}>We're Growing</p>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.2rem,3vw,1.8rem)', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '0.02em' }}>Want to Join the Allbotix Team?</h3>
              <p style={{ fontFamily: 'var(--font-light)', fontSize: '0.88rem', color: 'var(--text-secondary)', marginTop: '8px', maxWidth: '420px', lineHeight: 1.7 }}>
                We're always looking for brilliant minds passionate about robotics, AI, and automation. Come build the future with us.
              </p>
            </div>
            <Link href="/careers" className="btn-primary" style={{ flexShrink: 0 }}>
              Join Team
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ══ VALUES ═══════════════════════════════════════════════════════════ */}
      <section ref={valRef} style={{ position: 'relative', paddingBlock: '6rem', background: 'var(--bg-900)', overflow: 'hidden', borderTop: '1px solid var(--border-soft)' }}>
        <div aria-hidden="true" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', whiteSpace: 'nowrap', pointerEvents: 'none', fontFamily: 'var(--font-display)', fontSize: 'clamp(5rem,14vw,10rem)', fontWeight: 900, color: 'transparent', WebkitTextStroke: `1px rgba(var(--red-dark-rgb),0.04)`, letterSpacing: '0.05em', lineHeight: 1, userSelect: 'none' }}>VALUES</div>

        <div className="container-allbotix" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem', opacity: valVisible ? 1 : 0, transform: valVisible ? 'translateY(0)' : 'translateY(22px)', transition: 'opacity 0.7s ease,transform 0.7s ease' }}>
            <div className="section-tag" style={{ justifyContent: 'center' }}>What Drives Us</div>
            <h2 className="section-title">Built on <span>Principles.</span></h2>
          </div>
          <div className="val-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1.5rem', perspective: '1200px' }}>
            {VALUES.map((item, i) => <ValueCard key={item.title} item={item} index={i} visible={valVisible} />)}
          </div>
        </div>
      </section>

      {/* ══ CTA ══════════════════════════════════════════════════════════════ */}
      <section style={{ position: 'relative', paddingBlock: '5rem', background: 'var(--bg-800)', overflow: 'hidden', borderTop: '1px solid var(--border-soft)', textAlign: 'center' }}>
        <ParticleField />
        <div aria-hidden="true" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '600px', height: '300px', borderRadius: '50%', background: `radial-gradient(ellipse,rgba(var(--red-dark-rgb),0.09) 0%,transparent 70%)`, pointerEvents: 'none', animation: 'glowFloat 5s ease-in-out infinite' }} />
        <div className="container-allbotix" style={{ position: 'relative', zIndex: 2 }}>
          <div className="section-tag" style={{ justifyContent: 'center', marginBottom: '1rem' }}>Ready to Automate?</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem,4vw,3rem)', fontWeight: 900, color: 'var(--text-primary)', lineHeight: 1.2, marginBottom: '1.25rem' }}>
            Let's build the future <span style={{ color: 'var(--red-bright)' }}>together.</span>
          </h2>
          <p style={{ fontFamily: 'var(--font-light)', fontSize: '0.95rem', color: 'var(--text-secondary)', maxWidth: '440px', margin: '0 auto 2.5rem', lineHeight: 1.9 }}>
            Partner with Allbotix to deploy intelligent robotic systems that elevate your business and shape tomorrow.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="#contact" className="btn-primary">
              Get in Touch
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
            </Link>
            <Link href="/robots" className="btn-outline">Explore Our Robots</Link>
          </div>
        </div>
      </section>
    </div>
  )
}