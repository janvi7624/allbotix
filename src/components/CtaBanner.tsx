'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

export default function CtaBanner() {
  const ctaRef = useRef<HTMLElement>(null)
  const [ctaVisible, setCtaVisible] = useState(false)

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setCtaVisible(true); obs.disconnect() } },
      { threshold: 0.15 }
    )
    if (ctaRef.current) obs.observe(ctaRef.current)
    return () => obs.disconnect()
  }, [])

  return (
    <>
      <style>{`
        @keyframes glowPulse {
          0%,100% { opacity: 0.6; transform: scale(1); }
          50%      { opacity: 1;   transform: scale(1.1); }
        }
        @keyframes robotFloat {
          0%,100% { transform: translateY(-50%) translateX(0); }
          50%      { transform: translateY(calc(-50% - 14px)) translateX(-6px); }
        }
        @keyframes ctaLineGrow {
          from { width: 0; opacity: 0; }
          to   { width: 200px; opacity: 0.5; }
        }
        @keyframes headerSlideIn {
          from { opacity: 0; transform: translateY(22px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <section
        ref={ctaRef}
        style={{
          position: 'relative',
          paddingBlock: '6rem',
          background: 'var(--bg-900)',
          overflow: 'hidden',
          borderTop: '1px solid var(--border-soft)',
        }}
      >
        {/* Robot watermark */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            right: '5%', top: '50%',
            transform: 'translateY(-50%)',
            opacity: 0.08,
            pointerEvents: 'none',
            animation: 'robotFloat 6s ease-in-out infinite',
          }}
        >
          <svg
            viewBox="0 0 200 280"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ width: '300px', height: '420px' }}
          >
            <rect x="60" y="20" width="80" height="70" rx="12" fill="var(--red-dark)"/>
            <rect x="75" y="38" width="18" height="12" rx="3" fill="var(--white)"/>
            <rect x="107" y="38" width="18" height="12" rx="3" fill="var(--white)"/>
            <rect x="88" y="90" width="24" height="16" rx="4" fill="var(--red-dark)"/>
            <rect x="45" y="106" width="110" height="100" rx="10" fill="var(--red-dark)"/>
            <rect x="18" y="110" width="24" height="80" rx="8" fill="var(--red-dark)"/>
            <rect x="158" y="110" width="24" height="80" rx="8" fill="var(--red-dark)"/>
            <rect x="58" y="206" width="34" height="64" rx="8" fill="var(--red-dark)"/>
            <rect x="108" y="206" width="34" height="64" rx="8" fill="var(--red-dark)"/>
          </svg>
        </div>

        {/* Left ambient glow */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            left: '-5%', top: '50%',
            transform: 'translateY(-50%)',
            width: '400px', height: '400px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(var(--red-dark-rgb),0.10) 0%, transparent 70%)',
            pointerEvents: 'none',
            animation: 'glowPulse 4s ease-in-out infinite',
          }}
        />

        {/* Top divider line */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: 0, left: '50%',
            transform: 'translateX(-50%)',
            height: '1px',
            background: 'linear-gradient(90deg, transparent, var(--red-bright), transparent)',
            animation: ctaVisible ? 'ctaLineGrow 0.8s ease-out 0.2s both' : 'none',
          }}
        />

        <div
          className="container-allbotix"
          style={{
            position: 'relative',
            zIndex: 2,
            textAlign: 'center',
            animation: ctaVisible ? 'headerSlideIn 0.7s ease-out 0.1s both' : 'none',
          }}
        >
          <div className="section-tag" style={{ justifyContent: 'center' }}>
            Join The Future
          </div>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2rem, 4.5vw, 3.2rem)',
              fontWeight: 900,
              color: 'var(--text-primary)',
              lineHeight: 1.2,
              marginBottom: '1.25rem',
              maxWidth: '600px',
              margin: '0 auto 1.25rem',
            }}
          >
            Let&apos;s make the world a{' '}
            <span style={{ color: 'var(--red-bright)' }}>better place.</span>
          </h2>
          <p
            style={{
              fontSize: '0.95rem',
              color: 'var(--text-secondary)',
              maxWidth: '480px',
              margin: '0 auto 2.5rem',
              lineHeight: 1.9,
            }}
          >
            Partner with Allbotix to build intelligent robotic systems that
            elevate your industry and shape a smarter tomorrow.
          </p>
          <div
            style={{
              display: 'flex',
              gap: '1rem',
              justifyContent: 'center',
              flexWrap: 'wrap',
              animation: ctaVisible ? 'headerSlideIn 0.6s ease-out 0.35s both' : 'none',
            }}
          >
            <Link href="/contacts" className="btn-primary">
              Get Started Today
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"/>
                <polyline points="12 5 19 12 12 19"/>
              </svg>
            </Link>
            <Link href="/solutions" className="btn-outline">
              Learn More
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}