'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

const stats = [
  {
    value: '21K+',
    numericTarget: 21,
    suffix: 'K+',
    isDecimal: false,
    label: 'Projects Done',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    ),
  },
  {
    value: '17K+',
    numericTarget: 17,
    suffix: 'K+',
    isDecimal: false,
    label: 'Happy Clients',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 00-3-3.87"/>
        <path d="M16 3.13a4 4 0 010 7.75"/>
      </svg>
    ),
  },
  {
    value: '37K+',
    numericTarget: 37,
    suffix: 'K+',
    isDecimal: false,
    label: 'Parts Delivered',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="3" width="15" height="13" rx="2"/>
        <path d="M16 8h4l3 4v4h-7V8z"/>
        <circle cx="5.5" cy="18.5" r="2.5"/>
        <circle cx="18.5" cy="18.5" r="2.5"/>
      </svg>
    ),
  },
  {
    value: '4.7',
    numericTarget: 47,
    suffix: '',
    isDecimal: true,
    label: 'Average Rating',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
    ),
  },
]

// ─── Animated number component ───────────────────────────────────────────────
function AnimatedNumber({
  target,
  suffix,
  isDecimal,
  started,
  delay = 0,
}: {
  target: number
  suffix: string
  isDecimal: boolean
  started: boolean
  delay?: number
}) {
  const [display, setDisplay] = useState(isDecimal ? '0.0' : '0')
  const rafRef = useRef<number | null>(null)
  const hasRun = useRef(false)

  useEffect(() => {
    if (!started || hasRun.current) return
    hasRun.current = true

    const duration = 2200
    let startTime: number | null = null

    const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t))

    const timer = setTimeout(() => {
      const tick = (now: number) => {
        if (!startTime) startTime = now
        const elapsed = now - startTime
        const progress = Math.min(elapsed / duration, 1)
        const eased = easeOutExpo(progress)
        const current = Math.floor(eased * target)
        setDisplay(isDecimal ? (current / 10).toFixed(1) + suffix : current + suffix)
        if (progress < 1) {
          rafRef.current = requestAnimationFrame(tick)
        } else {
          setDisplay(isDecimal ? (target / 10).toFixed(1) + suffix : target + suffix)
        }
      }
      rafRef.current = requestAnimationFrame(tick)
    }, delay)

    return () => {
      clearTimeout(timer)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [started, target, suffix, isDecimal, delay])

  return <>{display}</>
}

// ─── Single stat card with 3D tilt ───────────────────────────────────────────
function StatCard({
  stat,
  index,
  started,
}: {
  stat: (typeof stats)[0]
  index: number
  started: boolean
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const shineRef = useRef<HTMLDivElement>(null)
  const [hovered, setHovered] = useState(false)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const dx = (e.clientX - cx) / (rect.width / 2)
    const dy = (e.clientY - cy) / (rect.height / 2)
    const rotX = -dy * 12
    const rotY = dx * 12
    card.style.transform = `perspective(700px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.04,1.04,1.04)`

    if (shineRef.current) {
      const px = ((e.clientX - rect.left) / rect.width) * 100
      const py = ((e.clientY - rect.top) / rect.height) * 100
      shineRef.current.style.background = `radial-gradient(circle at ${px}% ${py}%, rgba(232,57,42,0.10) 0%, transparent 60%)`
      shineRef.current.style.opacity = '1'
    }
  }

  const handleMouseLeave = () => {
    const card = cardRef.current
    if (!card) return
    card.style.transform = 'perspective(700px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)'
    if (shineRef.current) shineRef.current.style.opacity = '0'
    setHovered(false)
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        background: hovered ? 'var(--bg-700, rgba(22,14,14,0.98))' : 'rgba(11,11,11,0.95)',
        padding: '2.25rem 1.75rem',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: '0.75rem',
        cursor: 'default',
        overflow: 'hidden',
        transformStyle: 'preserve-3d',
        transition: 'transform 0.45s cubic-bezier(0.23,1,0.32,1), background 0.3s, box-shadow 0.4s',
        boxShadow: hovered
          ? '0 20px 60px rgba(0,0,0,0.6), 0 0 30px rgba(232,57,42,0.12), inset 0 1px 0 rgba(232,57,42,0.15)'
          : 'none',
        /* entrance */
        animation: `cardIn 0.6s cubic-bezier(0.23,1,0.32,1) ${index * 0.12 + 0.1}s both`,
      }}
    >
      {/* Shine overlay */}
      <div
        ref={shineRef}
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          opacity: 0,
          transition: 'opacity 0.3s',
        }}
      />

      {/* Top accent on first card */}
      {index === 0 && (
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: 0, left: 0, right: 0,
            height: '2px',
            background: 'linear-gradient(90deg, var(--red-bright), transparent)',
          }}
        />
      )}

      {/* Floating icon */}
      <div
        style={{
          width: '40px',
          height: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--red-bright)',
          opacity: 0.85,
          animation: `floatIcon 3s ease-in-out ${index * 0.4}s infinite`,
          transformStyle: 'preserve-3d',
        }}
      >
        <svg
          style={{
            width: '22px',
            height: '22px',
            stroke: 'var(--red-bright)',
            fill: 'none',
            strokeWidth: 1.5,
            filter: 'drop-shadow(0 0 6px rgba(232,57,42,0.55))',
          }}
          viewBox="0 0 24 24"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {stat.icon.props.children}
        </svg>
      </div>

      {/* Ghost depth value */}
      <span
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: '2rem',
          left: '1.75rem',
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(1.8rem, 3vw, 2.4rem)',
          fontWeight: 900,
          color: 'rgba(232,57,42,0.055)',
          userSelect: 'none',
          pointerEvents: 'none',
          transform: 'translateY(4px) translateX(4px)',
          letterSpacing: '0.02em',
        }}
      >
        {stat.value}
      </span>

      {/* Animated value */}
      <p
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(1.8rem, 3vw, 2.4rem)',
          fontWeight: 900,
          color: 'var(--text-primary)',
          lineHeight: 1,
          letterSpacing: '0.02em',
          transform: 'translateZ(20px)',
          textShadow: '0 0 20px rgba(240,236,232,0.08)',
        }}
      >
        <AnimatedNumber
          target={stat.numericTarget}
          suffix={stat.suffix}
          isDecimal={stat.isDecimal}
          started={started}
          delay={index * 150}
        />
      </p>

      {/* Label */}
      <p
        style={{
          fontFamily: 'var(--font-light)',
          fontSize: '0.78rem',
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          fontWeight: 300,
        }}
      >
        {stat.label}
      </p>

      {/* Red divider */}
      <div className="red-divider" style={{ marginBottom: 0 }} />
    </div>
  )
}

// ─── Main section ─────────────────────────────────────────────────────────────
export default function StatsSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [counterStarted, setCounterStarted] = useState(false)

  // Start counters when section enters viewport
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setCounterStarted(true)
          observer.disconnect()
        }
      },
      { threshold: 0.25 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      id="stats"
      ref={sectionRef}
      style={{
        position: 'relative',
        overflow: 'hidden',
        borderTop: '1px solid var(--border-soft)',
      }}
    >
      {/* Keyframe styles */}
      <style>{`
        @keyframes cardIn {
          from { opacity: 0; transform: perspective(700px) translateY(30px) rotateX(14deg); }
          to   { opacity: 1; transform: perspective(700px) translateY(0) rotateX(0deg); }
        }
        @keyframes floatIcon {
          0%,100% { transform: translateY(0) translateZ(0); }
          50%      { transform: translateY(-6px) translateZ(10px); }
        }
        @keyframes pulseGlow {
          from { opacity: 0.55; transform: scale(1); }
          to   { opacity: 1;    transform: scale(1.06); }
        }
        @keyframes topLineAnim {
          0%   { width: 0; opacity: 0; }
          100% { width: 200px; opacity: 0.6; }
        }
        @media (max-width: 768px) {
          .stats-row { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 480px) {
          .stats-row { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>

      <div
        style={{
          position: 'relative',
          paddingBlock: '5rem',
          background: `
            linear-gradient(135deg, rgba(8,8,8,0.96) 0%, rgba(14,8,8,0.93) 50%, rgba(8,8,8,0.96) 100%),
            repeating-linear-gradient(45deg, rgba(176,58,46,0.015) 0px, rgba(176,58,46,0.015) 1px, transparent 1px, transparent 20px)
          `,
        }}
      >
        {/* Ambient pulsing glow */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(176,58,46,0.09) 0%, transparent 70%)',
            pointerEvents: 'none',
            animation: 'pulseGlow 4s ease-in-out infinite alternate',
          }}
        />

        {/* Top border accent */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            height: '1px',
            background: 'linear-gradient(90deg, transparent, var(--red-bright), transparent)',
            animation: 'topLineAnim 1s ease-out 0.2s both',
          }}
        />

        <div className="container-allbotix" style={{ position: 'relative', zIndex: 2 }}>

          {/* Headline */}
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <div className="section-tag" style={{ justifyContent: 'center' }}>
              Our Impact
            </div>
            <h2 className="section-title" style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)' }}>
              Brilliant innovation for your <span>business.</span>
            </h2>
          </div>

          {/* Stats grid — perspective container */}
          <div
            style={{ perspective: '1200px' }}
          >
            <div
              className="stats-row"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '1.5px',
                background: 'var(--border)',
                border: '1px solid var(--border)',
                borderRadius: '6px',
                overflow: 'hidden',
              }}
            >
              {stats.map((stat, i) => (
                <StatCard
                  key={stat.label}
                  stat={stat}
                  index={i}
                  started={counterStarted}
                />
              ))}
            </div>
          </div>

          {/* Bottom CTA row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1.5rem',
              marginTop: '3rem',
              flexWrap: 'wrap',
            }}
          >
            <p
              style={{
                fontFamily: 'var(--font-light)',
                fontSize: '0.88rem',
                color: 'var(--text-secondary)',
                textAlign: 'center',
              }}
            >
              Trusted by industry leaders across 40+ countries.
            </p>
            <Link href="#services" className="btn-primary" style={{ fontSize: '0.62rem', padding: '0.6rem 1.4rem' }}>
              Explore Services
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"/>
                <polyline points="12 5 19 12 12 19"/>
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}