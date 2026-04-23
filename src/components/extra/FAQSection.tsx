'use client'

import { useState } from 'react'
import Link from 'next/link'

const faqs = [
  {
    q: 'What industries do your robotic solutions support?',
    a: 'Our robotic systems serve a wide range of industries including manufacturing, food & beverage, medical & cosmetics, electronics, education, and large-scale industrial operations. We tailor every solution to the specific demands of your sector.',
  },
  {
    q: 'How long does installation and setup take?',
    a: 'Installation timelines vary by project scope. A single-unit deployment typically takes 3–5 business days, while multi-facility enterprise rollouts are planned over 4–8 weeks with dedicated project management support.',
  },
  {
    q: 'Do you offer training for our staff after deployment?',
    a: 'Absolutely. Every package includes comprehensive onboarding training for your operators and technicians. Premium and above plans also include ongoing refresher sessions and access to our digital learning portal.',
  },
  {
    q: 'Can your robots be integrated with our existing systems?',
    a: 'Yes. Our robotic units are designed with open APIs and support industry-standard protocols (MQTT, OPC-UA, REST). Our engineering team handles end-to-end integration with your existing ERP, MES, or SCADA platforms.',
  },
  {
    q: 'What happens if a unit malfunctions or breaks down?',
    a: 'All plans include remote diagnostics and over-the-air firmware updates. On-site response times depend on your plan — Basic within 48 hours, Premium within 24 hours, and Enterprise within 4 hours with a guaranteed SLA.',
  },
  {
    q: 'Is there a minimum contract period?',
    a: 'Our monthly plans have no minimum lock-in and can be cancelled anytime. Annual plans offer a 20% discount and include priority hardware replacement. Enterprise contracts are negotiated individually based on scope.',
  },
]

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i)

  return (
    <>
      {/* ── FAQ Section ── */}
      <section
        id="faq"
        style={{
          position: 'relative',
          paddingBlock: '6rem',
          background: 'var(--bg-900)',
          overflow: 'hidden',
          borderTop: '1px solid var(--border-soft)',
        }}
      >
        {/* Ambient glow */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            bottom: '0',
            left: '0',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(176,58,46,0.06) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        <div
          className="container-allbotix"
          style={{ position: 'relative', zIndex: 2 }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1.6fr',
              gap: '5rem',
              alignItems: 'flex-start',
            }}
            className="faq-grid"
          >
            {/* ── Left panel ── */}
            <div style={{ position: 'sticky', top: '7rem' }} className="faq-sticky">
              <div className="section-tag">Got Questions?</div>
              <h2
                className="section-title"
                style={{ marginBottom: '1.25rem' }}
              >
                Frequently Ask <span>Questions.</span>
              </h2>
              <div className="red-divider" />
              <p
                style={{
                  fontSize: '0.92rem',
                  lineHeight: 1.9,
                  color: 'var(--text-secondary)',
                  marginBottom: '2.5rem',
                }}
              >
                Can't find what you're looking for? Our support team is
                available around the clock to answer any specific questions
                about your robotic deployment.
              </p>

              {/* Contact card */}
              <div
                className="card-dark"
                style={{
                  padding: '1.75rem',
                  marginBottom: '1.25rem',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    marginBottom: '1rem',
                  }}
                >
                  <div className="icon-circle">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 8.81a19.79 19.79 0 01-3.07-8.63A2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92v2z" />
                    </svg>
                  </div>
                  <div>
                    <p
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        letterSpacing: '0.15em',
                        color: 'var(--text-muted)',
                        textTransform: 'uppercase',
                        marginBottom: '2px',
                      }}
                    >
                      Call Us Anytime
                    </p>
                    <p
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '0.9rem',
                        fontWeight: 700,
                        color: 'var(--text-primary)',
                      }}
                    >
                      +1 (800) ALLBOTIX-01
                    </p>
                  </div>
                </div>
                <p
                  style={{
                    fontSize: '0.82rem',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.7,
                  }}
                >
                  Our engineering support line is available 24/7 for Premium
                  and Enterprise clients.
                </p>
              </div>

              <Link href="#contact" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                Send Us a Message
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </Link>
            </div>

            {/* ── Right — Accordion ── */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1px',
                background: 'var(--border)',
                border: '1px solid var(--border)',
                borderRadius: '6px',
                overflow: 'hidden',
              }}
            >
              {faqs.map((faq, i) => {
                const isOpen = openIndex === i
                return (
                  <div
                    key={i}
                    style={{
                      background: isOpen ? 'var(--bg-700)' : 'var(--bg-card)',
                      transition: 'background 0.3s',
                    }}
                  >
                    {/* Question row */}
                    <button
                      onClick={() => toggle(i)}
                      aria-expanded={isOpen}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '1.5rem',
                        padding: '1.5rem 1.75rem',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        textAlign: 'left',
                      }}
                    >
                      <span
                        style={{
                          fontFamily: 'var(--font-display)',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          color: isOpen
                            ? 'var(--red-bright)'
                            : 'var(--text-primary)',
                          letterSpacing: '0.03em',
                          lineHeight: 1.5,
                          transition: 'color 0.25s',
                          flex: 1,
                        }}
                      >
                        {/* Number prefix */}
                        <span
                          style={{
                            color: 'var(--red-bright)',
                            marginRight: '10px',
                            fontWeight: 700,
                            opacity: isOpen ? 1 : 0.5,
                          }}
                        >
                          {String(i + 1).padStart(2, '0')}.
                        </span>
                        {faq.q}
                      </span>

                      {/* Toggle icon */}
                      <span
                        style={{
                          flexShrink: 0,
                          width: '28px',
                          height: '28px',
                          border: `1px solid ${isOpen ? 'var(--red-bright)' : 'var(--border)'}`,
                          borderRadius: '4px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: isOpen ? 'var(--red-soft)' : 'transparent',
                          transition: 'all 0.25s',
                        }}
                      >
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke={isOpen ? 'var(--red-bright)' : 'var(--text-muted)'}
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          style={{
                            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                            transition: 'transform 0.3s',
                          }}
                        >
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </span>
                    </button>

                    {/* Answer panel */}
                    <div
                      style={{
                        maxHeight: isOpen ? '300px' : '0',
                        overflow: 'hidden',
                        transition: 'max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                      }}
                    >
                      <div
                        style={{
                          padding: '0 1.75rem 1.75rem',
                          borderTop: '1px solid rgba(176,58,46,0.12)',
                          paddingTop: '1.25rem',
                        }}
                      >
                        <p
                          style={{
                            fontFamily: 'var(--font-light)',
                            fontSize: '0.9rem',
                            color: 'var(--text-secondary)',
                            lineHeight: 1.9,
                          }}
                        >
                          {faq.a}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── Newsletter Section ── */}
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
        {/* Decorative lines */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '2px',
            background:
              'linear-gradient(90deg, transparent, var(--red-bright), transparent)',
            opacity: 0.4,
          }}
        />

        {/* Glow center */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '700px',
            height: '300px',
            borderRadius: '50%',
            background:
              'radial-gradient(ellipse, rgba(176,58,46,0.06) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        <div
          className="container-allbotix"
          style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}
        >
          {/* Heading */}
          <div
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              fontWeight: 900,
              color: 'var(--text-primary)',
              letterSpacing: '0.05em',
              marginBottom: '0.5rem',
            }}
          >
            <span style={{ color: 'var(--red-bright)' }}>N</span>
            ewsletter
            <span style={{ color: 'var(--red-bright)' }}>.</span>
          </div>

          <p
            style={{
              fontSize: '0.92rem',
              color: 'var(--text-secondary)',
              maxWidth: '460px',
              margin: '0 auto 2.5rem',
              lineHeight: 1.9,
            }}
          >
            Sign up for our newsletter to get information, news, insight, or
            promotions delivered straight to your inbox.
          </p>

          {/* Form */}
          <form
            onSubmit={(e) => e.preventDefault()}
            style={{
              display: 'flex',
              gap: '0',
              maxWidth: '500px',
              margin: '0 auto',
              border: '1px solid var(--border)',
              borderRadius: '6px',
              overflow: 'hidden',
              background: 'var(--bg-card)',
            }}
          >
            <input
              type="email"
              placeholder="Enter your email address..."
              required
              style={{
                flex: 1,
                padding: '0.9rem 1.25rem',
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-light)',
                fontSize: '0.88rem',
              }}
            />
            <button
              type="submit"
              className="btn-primary"
              style={{
                borderRadius: 0,
                clipPath: 'none',
                padding: '0.9rem 1.5rem',
                fontSize: '0.62rem',
                flexShrink: 0,
              }}
            >
              Subscribe
            </button>
          </form>

          {/* Trust note */}
          <p
            style={{
              marginTop: '1.25rem',
              fontFamily: 'var(--font-light)',
              fontSize: '0.75rem',
              color: 'var(--text-muted)',
            }}
          >
            No spam, ever. Unsubscribe at any time.{' '}
            <Link
              href="#"
              style={{ color: 'var(--red-bright)', textDecoration: 'underline' }}
            >
              Privacy Policy
            </Link>
          </p>
        </div>
      </section>

      {/* Responsive */}
      <style>{`
        @media (max-width: 860px) {
          .faq-grid {
            grid-template-columns: 1fr !important;
            gap: 3rem !important;
          }
          .faq-sticky {
            position: static !important;
          }
        }
      `}</style>
    </>
  )
}