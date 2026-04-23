'use client'

import { useEffect, useRef, useState } from 'react'
import { ACTIVITIES, ACTIVITY_CATEGORIES, type ActivityCategory } from '@/data/activities'

/* ─── Floating Orb background ────────────────────────────────────────────── */
function OrbField() {
  return (
    <div aria-hidden="true" style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
      {[
        { size: 500, top: '10%',  left: '-8%',  dur: 7,  delay: 0   },
        { size: 380, top: '55%',  right: '-6%', dur: 9,  delay: 1.5 },
        { size: 260, top: '30%',  left: '45%',  dur: 11, delay: 3   },
      ].map((o, i) => (
        <div key={i} style={{
          position: 'absolute',
          width: `${o.size}px`,
          height: `${o.size}px`,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(176,58,46,0.06) 0%, transparent 70%)',
          top: o.top,
          left: (o as any).left,
          right: (o as any).right,
          animation: `orbFloat ${o.dur}s ease-in-out ${o.delay}s infinite`,
        }}/>
      ))}
    </div>
  )
}

/* ─── Category pill ──────────────────────────────────────────────────────── */
const CATEGORY_COLORS: Record<string, { bg: string; border: string; text: string; glow: string }> = {
  all:     { bg: 'rgba(176,58,46,0.12)',  border: 'rgba(176,58,46,0.5)',  text: 'var(--red-bright)',  glow: 'rgba(176,58,46,0.3)'  },
  fun:     { bg: 'rgba(176,58,46,0.1)',   border: 'rgba(176,58,46,0.4)',  text: 'var(--red-bright)',  glow: 'rgba(176,58,46,0.25)' },
  tech:    { bg: 'rgba(56,119,220,0.1)',  border: 'rgba(56,119,220,0.4)', text: '#5b9ef5',            glow: 'rgba(56,119,220,0.2)' },
  indoor:  { bg: 'rgba(29,158,117,0.1)',  border: 'rgba(29,158,117,0.4)', text: '#2ec99a',            glow: 'rgba(29,158,117,0.2)' },
  outdoor: { bg: 'rgba(186,117,23,0.1)',  border: 'rgba(186,117,23,0.4)', text: '#e8a832',            glow: 'rgba(186,117,23,0.2)' },
}

const CARD_ACCENT: Record<string, { line: string; dot: string; badge: string }> = {
  fun:     { line: 'var(--red-bright)',  dot: 'rgba(176,58,46,0.8)',  badge: 'rgba(176,58,46,0.08)'  },
  tech:    { line: '#378add',            dot: 'rgba(56,119,220,0.8)', badge: 'rgba(56,119,220,0.08)' },
  indoor:  { line: '#1d9e75',            dot: 'rgba(29,158,117,0.8)', badge: 'rgba(29,158,117,0.08)' },
  outdoor: { line: '#ba7517',            dot: 'rgba(186,117,23,0.8)', badge: 'rgba(186,117,23,0.08)' },
}

/* ─── Activity Card ──────────────────────────────────────────────────────── */
function ActivityCard({
  activity,
  index,
  visible,
}: {
  activity: typeof ACTIVITIES[0]
  index: number
  visible: boolean
}) {
  const cardRef  = useRef<HTMLDivElement>(null)
  const shineRef = useRef<HTMLDivElement>(null)
  const [hovered, setHovered] = useState(false)
  const accent = CARD_ACCENT[activity.category]
  const col    = CATEGORY_COLORS[activity.category]

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current; if (!el) return
    const r = el.getBoundingClientRect()
    const dx = (e.clientX - r.left - r.width  / 2) / (r.width  / 2)
    const dy = (e.clientY - r.top  - r.height / 2) / (r.height / 2)
    el.style.transform = `perspective(800px) rotateX(${-dy * 8}deg) rotateY(${dx * 8}deg) scale3d(1.03,1.03,1.03) translateZ(8px)`
    if (shineRef.current) {
      const px = ((e.clientX - r.left) / r.width)  * 100
      const py = ((e.clientY - r.top)  / r.height) * 100
      shineRef.current.style.background = `radial-gradient(circle at ${px}% ${py}%, rgba(232,57,42,0.09) 0%, transparent 55%)`
      shineRef.current.style.opacity = '1'
    }
  }
  const onLeave = () => {
    if (cardRef.current) cardRef.current.style.transform = 'perspective(800px) rotateX(0) rotateY(0) scale3d(1,1,1) translateZ(0)'
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
        position: 'relative',
        background: hovered ? 'rgba(22,14,14,0.98)' : 'var(--bg-card)',
        border: `1px solid ${hovered ? 'rgba(176,58,46,0.45)' : 'rgba(176,58,46,0.14)'}`,
        borderRadius: '14px',
        overflow: 'hidden',
        padding: '1.75rem 1.5rem 1.5rem',
        transformStyle: 'preserve-3d',
        cursor: 'default',
        transition: 'transform 0.45s cubic-bezier(0.23,1,0.32,1), border-color 0.3s, box-shadow 0.4s, background 0.3s',
        boxShadow: hovered
          ? `0 22px 55px rgba(0,0,0,0.6), 0 0 30px ${col.glow}`
          : '0 4px 20px rgba(0,0,0,0.25)',
        opacity: visible ? 1 : 0,
        translate: visible ? '0 0' : '0 44px',
        filter: visible ? 'none' : 'blur(5px)',
        transitionProperty: 'transform,border-color,box-shadow,background,opacity,translate,filter',
        transitionDuration: '0.45s,0.3s,0.4s,0.3s,0.6s,0.6s,0.6s',
        transitionDelay: `0s,0s,0s,0s,${index * 0.07 + 0.05}s,${index * 0.07 + 0.05}s,${index * 0.07 + 0.05}s`,
      }}
    >
      {/* Shine overlay */}
      <div ref={shineRef} aria-hidden="true" style={{ position: 'absolute', inset: 0, borderRadius: '14px', pointerEvents: 'none', opacity: 0, transition: 'opacity 0.3s', zIndex: 1 }}/>

      {/* Top colour accent line */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: `linear-gradient(90deg, ${accent.line}, transparent)` }}/>

      {/* Hover bottom sweep */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '2px',
        background: `linear-gradient(90deg, ${accent.line}, transparent)`,
        transform: hovered ? 'scaleX(1)' : 'scaleX(0)',
        transformOrigin: 'left',
        transition: 'transform 0.4s cubic-bezier(0.23,1,0.32,1)',
      }}/>

      {/* Corner glow */}
      <div aria-hidden="true" style={{
        position: 'absolute', top: 0, right: 0, width: '100px', height: '100px',
        background: `radial-gradient(circle at top right, ${col.glow.replace('0.2)', '0.12)')}, transparent 70%)`,
        borderRadius: '0 14px 0 0', pointerEvents: 'none',
        opacity: hovered ? 1 : 0, transition: 'opacity 0.4s',
      }}/>

      {/* Category badge */}
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: '5px',
        padding: '3px 10px', borderRadius: '100px',
        background: col.bg, border: `1px solid ${col.border}`,
        marginBottom: '1rem', position: 'relative', zIndex: 2,
      }}>
        <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: accent.dot, flexShrink: 0, animation: 'actDot 2.2s ease-in-out infinite' }}/>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.48rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: col.text }}>{activity.tag}</span>
      </div>

      {/* Icon */}
      <div className="icon-circle" style={{
        marginBottom: '1rem',
        position: 'relative', zIndex: 2,
        transform: hovered ? 'translateZ(20px) scale(1.1)' : 'translateZ(0) scale(1)',
        transition: 'transform 0.45s cubic-bezier(0.23,1,0.32,1)',
        animation: `floatIcon 3.5s ease-in-out ${index * 0.3}s infinite`,
        filter: hovered ? `drop-shadow(0 0 10px ${col.glow})` : 'none',
      }}>
        {activity.icon}
      </div>

      {/* Title */}
      <h3 style={{
        fontFamily: 'var(--font-display)',
        fontSize: '0.9rem', fontWeight: 700,
        color: 'var(--text-primary)',
        marginBottom: '0.6rem', letterSpacing: '0.03em', lineHeight: 1.3,
        position: 'relative', zIndex: 2,
        transform: hovered ? 'translateZ(14px)' : 'translateZ(0)',
        transition: 'transform 0.45s cubic-bezier(0.23,1,0.32,1)',
      }}>
        {activity.title}
      </h3>

      {/* Desc */}
      <p style={{
        fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.8,
        marginBottom: '1.25rem', position: 'relative', zIndex: 2,
      }}>
        {activity.desc}
      </p>

      {/* Footer meta */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'relative', zIndex: 2,
        borderTop: '1px solid rgba(176,58,46,0.1)', paddingTop: '0.85rem',
        marginTop: 'auto',
      }}>
        {/* Participants */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ display: 'flex' }}>
            {Array.from({ length: Math.min(activity.participants, 4) }).map((_, j) => (
              <div key={j} style={{
                width: '20px', height: '20px', borderRadius: '50%',
                background: `rgba(176,58,46,${0.15 + j * 0.08})`,
                border: '1.5px solid rgba(176,58,46,0.3)',
                marginLeft: j === 0 ? 0 : '-6px',
                zIndex: 4 - j,
                position: 'relative',
                transition: 'transform 0.3s',
              }}/>
            ))}
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.52rem', letterSpacing: '0.1em', color: 'var(--text-muted)' }}>
            {activity.participants}+ people
          </span>
        </div>
        {/* Frequency pill */}
        <span style={{
          padding: '3px 10px', borderRadius: '100px',
          background: accent.badge,
          border: `1px solid ${col.border.replace('0.4)', '0.2)')}`,
          fontFamily: 'var(--font-display)', fontSize: '0.48rem',
          letterSpacing: '0.14em', textTransform: 'uppercase', color: col.text,
        }}>
          {activity.freq}
        </span>
      </div>
    </div>
  )
}

/* ─── Marquee ticker ─────────────────────────────────────────────────────── */
function ActivityTicker() {
  const items = ['Game Fridays', 'Hack Sprints', 'Weekend Treks', 'Tech Talks', 'Cricket Sundays', 'Yoga & Mindfulness', 'Movie Nights', 'Demo Days', 'Book Club', 'Annual Retreat', 'Volunteering Days', 'AI Research Club']
  const line = items.join('  ·  ')
  return (
    <div style={{ overflow: 'hidden', borderTop: '1px solid rgba(176,58,46,0.12)', borderBottom: '1px solid rgba(176,58,46,0.12)', paddingBlock: '10px', background: 'rgba(176,58,46,0.03)', position: 'relative', zIndex: 2 }}>
      <div style={{ display: 'flex', animation: 'tickerScroll 30s linear infinite', whiteSpace: 'nowrap', width: 'max-content' }}>
        {[line, line].map((t, i) => (
          <span key={i} style={{ fontFamily: 'var(--font-display)', fontSize: '0.55rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(250, 189, 183, 0.55)', paddingInline: '2rem' }}>{t}</span>
        ))}
      </div>
    </div>
  )
}

/* ─── Stats strip ────────────────────────────────────────────────────────── */
function StatsStrip({ started }: { started: boolean }) {
  const stats = [
    { target: 16, suffix: '+', label: 'Activities' },
    { target: 4,  suffix: '',  label: 'Categories' },
    { target: 95, suffix: '%', label: 'Participation' },
    { target: 52, suffix: '+', label: 'Events / Year' },
  ]
  const [vals, setVals] = useState(stats.map(() => 0))
  const done = useRef(false)

  useEffect(() => {
    if (!started || done.current) return
    done.current = true
    stats.forEach((s, i) => {
      setTimeout(() => {
        const dur = 1600, start = performance.now()
        const ease = (t: number) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
        const tick = (now: number) => {
          const p = Math.min((now - start) / dur, 1)
          setVals(prev => { const n = [...prev]; n[i] = Math.floor(ease(p) * s.target); return n })
          if (p < 1) requestAnimationFrame(tick)
          else setVals(prev => { const n = [...prev]; n[i] = s.target; return n })
        }
        requestAnimationFrame(tick)
      }, i * 200)
    })
  }, [started])

  return (
    <div style={{
      display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '1px', background: 'rgba(176,58,46,0.12)',
      border: '1px solid rgba(176,58,46,0.12)',
      borderRadius: '10px', overflow: 'hidden', marginBottom: '3.5rem',
    }}>
      {stats.map((s, i) => (
        <div key={s.label} style={{
          background: 'rgba(10,8,8,0.95)', padding: '1.5rem 1rem', textAlign: 'center',
          opacity: started ? 1 : 0,
          transform: started ? 'translateY(0)' : 'translateY(16px)',
          transition: `opacity 0.6s ease ${i * 0.1 + 0.1}s, transform 0.6s ease ${i * 0.1 + 0.1}s`,
        }}>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem,3vw,2.2rem)', fontWeight: 900, color: 'var(--text-primary)', lineHeight: 1, margin: 0 }}>
            {vals[i]}{s.suffix}
          </p>
          <p style={{ fontFamily: 'var(--font-light)', fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.12em', marginTop: '4px' }}>{s.label}</p>
        </div>
      ))}
    </div>
  )
}

/* ─── Main export ────────────────────────────────────────────────────────── */
export default function ActivitiesSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const heroRef    = useRef<HTMLDivElement>(null)
  const statsRef   = useRef<HTMLDivElement>(null)

  const [sectionVisible, setSectionVisible] = useState(false)
  const [heroVisible,    setHeroVisible]    = useState(false)
  const [statsStarted,   setStatsStarted]   = useState(false)
  const [activeFilter,   setActiveFilter]   = useState<ActivityCategory | 'all'>('all')
  const [prevFilter,     setPrevFilter]     = useState<ActivityCategory | 'all'>('all')
  const [animKey,        setAnimKey]        = useState(0)

  const filtered = activeFilter === 'all'
    ? ACTIVITIES
    : ACTIVITIES.filter(a => a.category === activeFilter)

  const handleFilter = (key: ActivityCategory | 'all') => {
    if (key === activeFilter) return
    setPrevFilter(activeFilter)
    setActiveFilter(key)
    setAnimKey(k => k + 1)
  }

  useEffect(() => {
    const make = (el: Element | null, setter: (v: boolean) => void, th = 0.08) => {
      if (!el) return
      const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setter(true); io.disconnect() } }, { threshold: th })
      io.observe(el); return () => io.disconnect()
    }
    const c1 = make(sectionRef.current, setSectionVisible)
    const c2 = make(heroRef.current,    setHeroVisible, 0.15)
    const c3 = make(statsRef.current,   setStatsStarted, 0.2)
    return () => { c1?.(); c2?.(); c3?.() }
  }, [])

  return (
    <div style={{ background: 'var(--bg-900)', overflow: 'hidden' }}>
      <style>{`
        @keyframes floatIcon    { 0%,100%{transform:translateY(0) translateZ(0)} 50%{transform:translateY(-5px) translateZ(8px)} }
        @keyframes orbFloat     { 0%,100%{opacity:0.5;transform:scale(1) translate(0,0)} 50%{opacity:0.9;transform:scale(1.08) translate(8px,-10px)} }
        @keyframes tickerScroll { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        @keyframes actDot       { 0%,100%{opacity:0.5;transform:scale(1)} 50%{opacity:1;transform:scale(1.6)} }
        @keyframes ringSpinCW   { to{transform:translate(-50%,-50%) rotate(360deg)} }
        @keyframes ringSpinCCW  { to{transform:translate(-50%,-50%) rotate(-360deg)} }
        @keyframes heroSlideUp  { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
        @keyframes lineGrow     { from{width:0;opacity:0} to{opacity:1} }
        @keyframes filterPop    { from{opacity:0;transform:scale(0.92) translateY(6px)} to{opacity:1;transform:scale(1) translateY(0)} }
        @keyframes cardFlyIn    { from{opacity:0;transform:perspective(800px) translateY(36px) rotateX(12deg) scale(0.97)} to{opacity:1;transform:perspective(800px) translateY(0) rotateX(0) scale(1)} }
        @keyframes scanline     { 0%{top:-3%;opacity:0.5} 100%{top:110%;opacity:0} }
        @keyframes glowPulse    { 0%,100%{opacity:0.6;transform:scale(1)} 50%{opacity:1;transform:scale(1.1)} }
        @keyframes borderPulse  { 0%,100%{border-color:rgba(176,58,46,0.18);box-shadow:none} 50%{border-color:rgba(176,58,46,0.45);box-shadow:0 0 24px rgba(176,58,46,0.1)} }
        @keyframes shimmerMove  { 0%{background-position:-600px 0} 100%{background-position:600px 0} }
        @keyframes countIn      { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }

        @media(max-width:900px) { .act-grid{grid-template-columns:repeat(2,1fr)!important} }
        @media(max-width:560px) { .act-grid{grid-template-columns:1fr!important} .act-stats{grid-template-columns:repeat(2,1fr)!important} .act-filters{gap:6px!important} }
      `}</style>

      {/* ══ HERO ══════════════════════════════════════════════════════════════ */}
      <section style={{
        position: 'relative',
        minHeight: '55vh',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden',
        paddingBlock: '7rem 5rem',
        background: 'radial-gradient(ellipse 80% 55% at 50% 40%, rgba(176,58,46,0.1) 0%, transparent 70%), var(--bg-900)',
      }}>
        <OrbField/>

        {/* Decorative rings */}
        <div aria-hidden="true" style={{ position: 'absolute', width: '650px', height: '650px', borderRadius: '50%', border: '1px dashed rgba(176,58,46,0.08)', top: '50%', left: '50%', animation: 'ringSpinCW 35s linear infinite', pointerEvents: 'none' }}/>
        <div aria-hidden="true" style={{ position: 'absolute', width: '420px', height: '420px', borderRadius: '50%', border: '1px solid rgba(176,58,46,0.12)', top: '50%', left: '50%', animation: 'ringSpinCCW 22s linear infinite', pointerEvents: 'none' }}/>
        <div aria-hidden="true" style={{ position: 'absolute', width: '220px', height: '220px', borderRadius: '50%', border: '1px dotted rgba(176,58,46,0.18)', top: '50%', left: '50%', animation: 'ringSpinCW 14s linear infinite', pointerEvents: 'none' }}/>

        {/* Corner brackets */}
        {[
          { top: '5rem', left: '2rem',  borderTop: true,  borderLeft: true  },
          { top: '5rem', right: '2rem', borderTop: true,  borderRight: true },
          { bottom: '3rem', left: '2rem',  borderBottom: true, borderLeft: true  },
          { bottom: '3rem', right: '2rem', borderBottom: true, borderRight: true },
        ].map((b, i) => (
          <div key={i} aria-hidden="true" style={{
            position: 'absolute', width: '36px', height: '36px', opacity: 0.4,
            ...(b.top ? { top: b.top } : { bottom: (b as any).bottom }),
            ...(b.left ? { left: (b as any).left } : { right: (b as any).right }),
            borderTop:    (b as any).borderTop    ? '1px solid var(--red-bright)' : undefined,
            borderBottom: (b as any).borderBottom ? '1px solid var(--red-bright)' : undefined,
            borderLeft:   (b as any).borderLeft   ? '1px solid var(--red-bright)' : undefined,
            borderRight:  (b as any).borderRight  ? '1px solid var(--red-bright)' : undefined,
          }}/>
        ))}

        {/* Scanline */}
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 1 }}>
          <div style={{ position: 'absolute', left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, transparent, rgba(176,58,46,0.3), transparent)', animation: 'scanline 5s linear infinite' }}/>
        </div>

        <div ref={heroRef} className="container-allbotix" style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
          <div style={{ opacity: heroVisible ? 1 : 0, transform: heroVisible ? 'translateY(0)' : 'translateY(18px)', transition: 'opacity 0.6s ease 0.05s, transform 0.6s ease 0.05s' }}>
            <div className="section-tag" style={{ justifyContent: 'center', marginBottom: '1.25rem' }}>Life at Allbotix</div>
          </div>

          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.4rem, 6.5vw, 5rem)',
            fontWeight: 900, lineHeight: 1.05, letterSpacing: '0.02em',
            color: 'var(--text-primary)', marginBottom: '1.5rem',
            opacity: heroVisible ? 1 : 0,
            transform: heroVisible ? 'translateY(0)' : 'translateY(26px)',
            transition: 'opacity 0.7s ease 0.12s, transform 0.7s ease 0.12s',
          }}>
            Where Work Meets <span style={{ color: 'var(--red-bright)', textShadow: '0 0 50px rgba(176,58,46,0.4)' }}>Play.</span>
          </h1>

          <div style={{ width: '55px', height: '2px', background: 'linear-gradient(90deg, var(--red-bright), transparent)', margin: '0 auto 1.5rem', opacity: heroVisible ? 1 : 0, animation: heroVisible ? 'lineGrow 0.8s ease 0.3s both' : 'none' }}/>

          <p style={{
            maxWidth: '500px', margin: '0 auto 2.5rem',
            fontSize: '0.97rem', lineHeight: 1.9, color: 'var(--text-secondary)',
            opacity: heroVisible ? 1 : 0, transform: heroVisible ? 'translateY(0)' : 'translateY(18px)',
            transition: 'opacity 0.6s ease 0.25s, transform 0.6s ease 0.25s',
          }}>
            From weekend hackathons to mountain treks — our team culture is built on curiosity, energy and genuine human connection.
          </p>

          {/* Category quick-links */}
          <div style={{
            display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap',
            opacity: heroVisible ? 1 : 0, transform: heroVisible ? 'translateY(0)' : 'translateY(14px)',
            transition: 'opacity 0.6s ease 0.35s, transform 0.6s ease 0.35s',
          }}>
            {ACTIVITY_CATEGORIES.slice(1).map(cat => {
              const c = CATEGORY_COLORS[cat.key]
              return (
                <button key={cat.key}
                  onClick={() => {
                    document.getElementById('activities-grid')?.scrollIntoView({ behavior: 'smooth' })
                    handleFilter(cat.key)
                  }}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '7px',
                    padding: '8px 16px', borderRadius: '100px',
                    background: c.bg, border: `1px solid ${c.border}`,
                    cursor: 'pointer', transition: 'all 0.25s',
                    fontFamily: 'var(--font-display)', fontSize: '0.58rem',
                    letterSpacing: '0.14em', textTransform: 'uppercase', color: c.text,
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = c.border.replace('0.4)', '0.18)'); (e.currentTarget as HTMLElement).style.boxShadow = `0 0 20px ${c.glow}` }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = c.bg; (e.currentTarget as HTMLElement).style.boxShadow = 'none' }}
                >
                  <span style={{ width: '14px', height: '14px', color: c.text }}>{cat.icon}</span>
                  {cat.label}
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* ══ TICKER ════════════════════════════════════════════════════════════ */}
      <ActivityTicker/>

      {/* ══ MAIN SECTION ══════════════════════════════════════════════════════ */}
      <section id="activities-grid" ref={sectionRef} style={{ position: 'relative', paddingBlock: '5rem 6rem', background: 'var(--bg-800)', overflow: 'hidden', borderTop: '1px solid var(--border-soft)' }}>
        <OrbField/>

        {/* Watermark */}
        <div aria-hidden="true" style={{ position: 'absolute', bottom: '-2rem', left: '50%', transform: 'translateX(-50%)', whiteSpace: 'nowrap', pointerEvents: 'none', fontFamily: 'var(--font-display)', fontSize: 'clamp(5rem,14vw,10rem)', fontWeight: 900, color: 'transparent', WebkitTextStroke: '1px rgba(176,58,46,0.04)', letterSpacing: '0.05em', lineHeight: 1, userSelect: 'none' }}>CULTURE</div>

        <div className="container-allbotix" style={{ position: 'relative', zIndex: 2 }}>

          {/* Section header */}
          <div style={{
            textAlign: 'center', marginBottom: '2.5rem',
            opacity: sectionVisible ? 1 : 0, transform: sectionVisible ? 'translateY(0)' : 'translateY(22px)',
            filter: sectionVisible ? 'none' : 'blur(4px)',
            transition: 'opacity 0.7s ease, transform 0.7s ease, filter 0.7s ease',
          }}>
            <div className="section-tag" style={{ justifyContent: 'center' }}>Team Activities</div>
            <h2 className="section-title">Our <span>Culture</span> in Action.</h2>
          </div>

          {/* Stats */}
          <div ref={statsRef} className="act-stats">
            <StatsStrip started={statsStarted}/>
          </div>

          {/* Filter bar */}
          <div className="act-filters" style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: '8px', flexWrap: 'wrap', marginBottom: '3rem',
            opacity: sectionVisible ? 1 : 0,
            transform: sectionVisible ? 'translateY(0)' : 'translateY(14px)',
            transition: 'opacity 0.6s ease 0.2s, transform 0.6s ease 0.2s',
          }}>
            {ACTIVITY_CATEGORIES.map(cat => {
              const isActive = cat.key === activeFilter
              const c = CATEGORY_COLORS[cat.key]
              return (
                <button
                  key={cat.key}
                  onClick={() => handleFilter(cat.key)}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '7px',
                    padding: '9px 18px', borderRadius: '100px',
                    background: isActive ? c.bg : 'rgba(176,58,46,0.03)',
                    border: `1px solid ${isActive ? c.border : 'rgba(176,58,46,0.15)'}`,
                    cursor: 'pointer',
                    transition: 'all 0.25s cubic-bezier(0.23,1,0.32,1)',
                    fontFamily: 'var(--font-display)', fontSize: '0.58rem',
                    letterSpacing: '0.14em', textTransform: 'uppercase',
                    color: isActive ? c.text : 'var(--text-muted)',
                    boxShadow: isActive ? `0 0 20px ${c.glow}` : 'none',
                    transform: isActive ? 'scale(1.04)' : 'scale(1)',
                  }}
                  onMouseEnter={e => { if (!isActive) { (e.currentTarget as HTMLElement).style.borderColor = c.border; (e.currentTarget as HTMLElement).style.color = c.text } }}
                  onMouseLeave={e => { if (!isActive) { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(176,58,46,0.15)'; (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)' } }}
                >
                  <span style={{ width: '13px', height: '13px', flexShrink: 0 }}>{cat.icon}</span>
                  {cat.label}
                  {isActive && <span style={{ background: c.border, width: '5px', height: '5px', borderRadius: '50%', animation: 'actDot 1.8s ease-in-out infinite' }}/>}
                </button>
              )
            })}
          </div>

          {/* Grid */}
          <div key={animKey} className="act-grid" style={{
            display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '1.25rem', perspective: '1200px',
          }}>
            {filtered.map((activity, i) => (
              <ActivityCard key={activity.id} activity={activity} index={i} visible={sectionVisible}/>
            ))}
          </div>

          {/* Culture banner */}
          {/* <div style={{
            marginTop: '4rem', padding: '3rem',
            background: 'linear-gradient(135deg, rgba(176,58,46,0.08), rgba(176,58,46,0.03))',
            border: '1px solid rgba(176,58,46,0.2)', borderRadius: '14px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            flexWrap: 'wrap', gap: '2rem',
            animation: 'borderPulse 5s ease-in-out infinite',
            opacity: sectionVisible ? 1 : 0,
            transform: sectionVisible ? 'translateY(0)' : 'translateY(28px)',
            transition: 'opacity 0.7s ease 0.55s, transform 0.7s ease 0.55s',
            position: 'relative', overflow: 'hidden',
          }}>
            <div aria-hidden="true" style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, var(--red-bright), transparent)', animation: 'shimmerMove 3.5s linear infinite', backgroundSize: '600px 100%' }}/>
            <div>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: '0.55rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--red-bright)', marginBottom: '6px' }}>Join the Team</p>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.1rem,3vw,1.7rem)', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '0.02em' }}>Want to Be Part of the Fun?</h3>
              <p style={{ fontFamily: 'var(--font-light)', fontSize: '0.86rem', color: 'var(--text-secondary)', marginTop: '8px', maxWidth: '400px', lineHeight: 1.75 }}>
                Our culture is our strength. If this sounds like your kind of team, we'd love to meet you.
              </p>
            </div>
            <a href="/careers" className="btn-primary" style={{ flexShrink: 0, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              View Open Roles
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </a>
          </div> */}

        </div>
      </section>
    </div>
  )
}