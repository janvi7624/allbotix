'use client'

import Link from 'next/link'
import { steps } from '@/data/processes'

export default function ProcessSection() {
  return (
    <section
      id="process"
      style={{
        position: 'relative',
        paddingBlock: '6rem',
        background: 'var(--bg-900)',
        overflow: 'hidden',
        borderTop: '1px solid var(--border-soft)',
      }}
    >
      {/* Watermark */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '-1rem',
          left: '50%',
          transform: 'translateX(-50%)',
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
        }}
      >
        <span className="watermark-text">Process</span>
      </div>

      {/* Ambient glow */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: '-10%',
          top: '30%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(176,58,46,0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div className="container-allbotix" style={{ position: 'relative', zIndex: 2 }}>

        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            gap: '2rem',
            marginBottom: '4rem',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ maxWidth: '520px' }}>
            <div className="section-tag">How We Work</div>
            <h2 className="section-title">
              Where Innovation <span>Meets</span>
              <br />Automation.
            </h2>
          </div>

          <Link href="#contact" className="btn-outline" style={{ flexShrink: 0 }}>
            Get Started
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"/>
              <polyline points="12 5 19 12 12 19"/>
            </svg>
          </Link>
        </div>

        {/* Steps grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1.5px',
            background: 'var(--border)',
            border: '1px solid var(--border)',
            borderRadius: '6px',
            overflow: 'hidden',
          }}
          className="process-grid"
        >
          {steps.map((step, i) => (
            <div
              key={step.title}
              style={{
                background: 'var(--bg-card)',
                padding: '2.5rem 2rem',
                position: 'relative',
                overflow: 'hidden',
                transition: 'background 0.3s',
                cursor: 'default',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = 'var(--bg-700)'
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = 'var(--bg-card)'
              }}
            >
              {/* Top accent — active on first */}
              {i === 0 && (
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '2px',
                    background: 'linear-gradient(90deg, var(--red-bright), transparent)',
                  }}
                />
              )}

              {/* Connector line between cards (not on last) */}
              {i < steps.length - 1 && (
                <div
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    top: '3.5rem',
                    right: 0,
                    width: '1.5px',
                    height: '28px',
                    background: 'linear-gradient(to bottom, var(--red-bright), transparent)',
                    opacity: 0.35,
                  }}
                />
              )}

              {/* Step number watermark */}
              <div
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1.25rem',
                  fontFamily: 'var(--font-display)',
                  fontSize: '3.5rem',
                  fontWeight: 900,
                  color: 'transparent',
                  WebkitTextStroke: '1px rgba(176,58,46,0.08)',
                  lineHeight: 1,
                  pointerEvents: 'none',
                  userSelect: 'none',
                }}
              >
                {step.number}
              </div>

              {/* Icon */}
              <div className="icon-circle" style={{ marginBottom: '1.5rem' }}>
                {step.icon}
              </div>

              {/* Step label */}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontFamily: 'var(--font-display)',
                  fontSize: '0.58rem',
                  fontWeight: 700,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: 'var(--red-bright)',
                  marginBottom: '0.65rem',
                }}
              >
                <span
                  style={{
                    display: 'inline-block',
                    width: '18px',
                    height: '1px',
                    background: 'var(--red-bright)',
                  }}
                />
                Step {step.number}
              </div>

              {/* Title */}
              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  marginBottom: '1rem',
                  letterSpacing: '0.04em',
                  lineHeight: 1.4,
                }}
              >
                {step.title}
              </h3>

              {/* Description */}
              <p
                style={{
                  fontSize: '0.86rem',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.9,
                  fontFamily: 'var(--font-light)',
                }}
              >
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Responsive */}
      <style>{`
        @media (max-width: 860px) {
          .process-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  )
}