'use client'

import Link from 'next/link'
import { footerLinks, socialIcons } from '@/data/footer'
import Image from 'next/image'

export default function Footer() {
  return (
    <footer
      style={{
        background: 'var(--bg-800)',
        borderTop: '1px solid var(--border)',
        paddingTop: '4rem',
      }}
    >
      <style>{`
        .footer-social-btn {
          width: 40px;
          height: 40px;
          border-radius: 8px;
          border: 1px solid rgba(176,58,46,0.2);
          background: rgba(176,58,46,0.04);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-muted);
          text-decoration: none;
          transition: border-color 0.25s, background 0.25s, color 0.25s, transform 0.25s, box-shadow 0.25s;
        }
        .footer-social-btn:hover {
          border-color: var(--red-bright) !important;
          background: rgba(176,58,46,0.12) !important;
          color: var(--red-bright) !important;
          transform: translateY(-3px) !important;
          box-shadow: 0 8px 20px rgba(176,58,46,0.2) !important;
        }

        @media (max-width: 900px) {
          .footer-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 560px) {
          .footer-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <div className="container-allbotix">

        {/* ── Top Grid ── */}
        <div
          className="footer-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: '1.6fr repeat(3, 1fr)',
            gap: '3rem',
            paddingBottom: '3rem',
            borderBottom: '1px solid var(--border-soft)',
          }}
        >
          {/* Brand column */}
          <div>
            <Link href={'/'}>
              <Image
                src="/logo.png"
                alt="Allbotix Logo"
                width={120}
                height={80}
              />
            </Link>

            <p
              style={{
                fontSize: '0.9rem',
                lineHeight: 1.8,
                color: 'var(--text-secondary)',
                maxWidth: '280px',
                marginBottom: '1.75rem',
              }}
            >
              Empowering tomorrow's industries with cutting-edge robotic solutions.
              One team. One robot. Limitless possibilities.
            </p>

            {/* Social icons — same style as contact page */}
            <div style={{ display: 'flex', gap: '10px' }}>
              {socialIcons.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-social-btn"
                  aria-label={s.label}
                >
                  <span style={{ width: '16px', height: '16px', display: 'flex' }}>
                    {s.svg}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <h4
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: 'var(--text-primary)',
                  marginBottom: '1.25rem',
                  paddingBottom: '0.75rem',
                  borderBottom: '1px solid var(--border)',
                }}
              >
                {heading}
              </h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      style={{
                        fontFamily: 'var(--font-light)',
                        fontSize: '0.88rem',
                        color: 'var(--text-secondary)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        transition: 'color 0.2s, gap 0.2s',
                      }}
                      onMouseEnter={(e) => {
                        const el = e.currentTarget as HTMLElement
                        el.style.color = 'var(--red-bright)'
                        el.style.gap = '10px'
                      }}
                      onMouseLeave={(e) => {
                        const el = e.currentTarget as HTMLElement
                        el.style.color = 'var(--text-secondary)'
                        el.style.gap = '6px'
                      }}
                    >
                      <span
                        style={{
                          display: 'inline-block',
                          width: '5px',
                          height: '1px',
                          background: 'var(--red-bright)',
                          flexShrink: 0,
                        }}
                      />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── Bottom Bar ── */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingBlock: '1.5rem',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <p
            style={{
              fontFamily: 'var(--font-light)',
              fontSize: '0.8rem',
              color: 'var(--text-muted)',
            }}
          >
            © {new Date().getFullYear()}{' '}
            <span style={{ color: 'var(--red-bright)' }}>Allbotix Technologies</span>. All rights reserved.
          </p>

          <div style={{ display: 'flex', gap: '1.5rem' }}>
            {['Privacy Policy', 'Terms of Service', 'Sitemap'].map((item) => (
              <Link
                key={item}
                href="#"
                style={{
                  fontFamily: 'var(--font-light)',
                  fontSize: '0.78rem',
                  color: 'var(--text-muted)',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLElement).style.color = 'var(--red-bright)')
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLElement).style.color = 'var(--text-muted)')
                }
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}