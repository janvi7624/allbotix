'use client'

import { useState } from 'react'

export default function NewsletterSection() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [focused, setFocused] = useState(false)

  const handleSubmit = (e: React.MouseEvent) => {
    e.preventDefault()
    if (email.trim()) {
      setSubmitted(true)
      setEmail('')
    }
  }

  return (
    <section
      id="newsletter"
      style={{
        position: 'relative',
        paddingBlock: '5rem',
        background: 'var(--bg-800)',
        borderTop: '1px solid var(--border-soft)',
        overflow: 'hidden',
      }}
    >
      {/* Watermark */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: '-2.5rem',
          left: '50%',
          transform: 'translateX(-50%)',
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
        }}
      >
        <span className="watermark-text">Newsletter</span>
      </div>

      {/* Ambient glow left */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: '-8%',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(176,58,46,0.07) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Ambient glow right */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          right: '-8%',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(176,58,46,0.05) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Corner decorators */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '1.5rem',
          left: '1.5rem',
          width: '32px',
          height: '32px',
          borderTop: '1px solid var(--red-bright)',
          borderLeft: '1px solid var(--red-bright)',
          opacity: 0.4,
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: '1.5rem',
          right: '1.5rem',
          width: '32px',
          height: '32px',
          borderBottom: '1px solid var(--red-bright)',
          borderRight: '1px solid var(--red-bright)',
          opacity: 0.4,
        }}
      />

      <div
        className="container-allbotix"
        style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}
      >
        {/* Section tag */}
        <div className="section-tag" style={{ justifyContent: 'center' }}>
          Stay Updated
        </div>

        {/* Heading */}
        <h2
          className="section-title"
          style={{
            fontSize: 'clamp(1.6rem, 3.5vw, 2.6rem)',
            marginBottom: '1rem',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: 900,
              color: 'var(--text-primary)',
              display: 'block',
              lineHeight: 1.2,
            }}
          >
            <span style={{ color: 'var(--red-bright)', fontStyle: 'italic' }}>fl</span>
            ewsletter<span style={{ color: 'var(--red-bright)' }}>.</span>
          </span>
        </h2>

        <p
          style={{
            fontSize: '0.93rem',
            color: 'var(--text-secondary)',
            maxWidth: '420px',
            margin: '0 auto 2.5rem',
            lineHeight: 1.9,
            fontFamily: 'var(--font-light)',
          }}
        >
          Sign up for our newsletter to get updates, information, insight or
          promotions.
        </p>

        {/* Form */}
        {!submitted ? (
          <div
            style={{
              display: 'flex',
              maxWidth: '480px',
              margin: '0 auto',
              gap: '0',
              position: 'relative',
            }}
          >
            {/* Email input wrapper */}
            <div
              style={{
                flex: 1,
                position: 'relative',
              }}
            >
              {/* Mail icon */}
              <span
                style={{
                  position: 'absolute',
                  left: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  display: 'flex',
                  alignItems: 'center',
                  color: focused ? 'var(--red-bright)' : 'var(--text-muted)',
                  transition: 'color 0.25s',
                  pointerEvents: 'none',
                }}
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
              </span>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                placeholder="Enter your email address"
                style={{
                  width: '100%',
                  padding: '0.85rem 1rem 0.85rem 2.75rem',
                  background: 'var(--bg-900)',
                  border: `1px solid ${focused ? 'rgba(176,58,46,0.55)' : 'var(--border)'}`,
                  borderRight: 'none',
                  borderRadius: '6px 0 0 6px',
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-light)',
                  fontSize: '0.88rem',
                  outline: 'none',
                  transition: 'border-color 0.25s',
                  clipPath: 'polygon(0 0, calc(100%) 0, 100% 100%, 8px 100%, 0 calc(100% - 8px))',
                  boxShadow: focused ? 'inset 0 0 0 1px rgba(176,58,46,0.1)' : 'none',
                }}
              />
            </div>

            {/* Submit button */}
            <button
              onClick={handleSubmit}
              className="btn-primary"
              style={{
                borderRadius: '0 6px 6px 0',
                clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)',
                padding: '0.85rem 1.5rem',
                flexShrink: 0,
                fontSize: '0.65rem',
                letterSpacing: '0.14em',
                cursor: 'pointer',
              }}
            >
              Subscribe
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="5" y1="12" x2="19" y2="12"/>
                <polyline points="12 5 19 12 12 19"/>
              </svg>
            </button>
          </div>
        ) : (
          <div
            style={{
              maxWidth: '480px',
              margin: '0 auto',
              padding: '1.25rem 2rem',
              background: 'var(--red-soft)',
              border: '1px solid var(--border)',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--red-bright)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            <p
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '0.72rem',
                fontWeight: 700,
                letterSpacing: '0.12em',
                color: 'var(--red-bright)',
                textTransform: 'uppercase',
              }}
            >
              You're subscribed! Welcome to the future.
            </p>
          </div>
        )}

        {/* Privacy note */}
        <p
          style={{
            marginTop: '1rem',
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            fontFamily: 'var(--font-light)',
          }}
        >
          No spam, ever. Unsubscribe at any time.
        </p>
      </div>
    </section>
  )
}