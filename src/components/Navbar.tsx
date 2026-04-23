'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

const navLinks = [
  { label: 'Home',     href: '/' },
  { label: 'About',    href: '/about' },
  { label: 'Solution', href: '/solutions' },
  { label: 'Products',  href: '/products' },
  { label: 'Careers',  href: '/careers' },
  { label: 'Blog',     href: '/blog' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()

  // Determine active link from current URL path
  // For hash links like '#faq', fall back to matching by href equality
  const getActiveLabel = () => {
    // Exact path match first (e.g. '/about' → 'About')
    const matched = navLinks.find((link) => {
      if (link.href.startsWith('#')) return false
      if (link.href === '/') return pathname === '/'
      return pathname === link.href || pathname.startsWith(link.href + '/')
    })
    return matched?.label ?? 'Home'
  }

  const activeLink = getActiveLabel()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        transition: 'background 0.4s ease, box-shadow 0.4s ease, padding 0.3s ease',
        background: scrolled
          ? 'rgba(8,8,8,0.96)'
          : 'transparent',
        backdropFilter: scrolled ? 'blur(14px)' : 'none',
        borderBottom: scrolled
          ? '1px solid rgba(176,58,46,0.15)'
          : '1px solid transparent',
        boxShadow: scrolled
          ? '0 4px 40px rgba(0,0,0,0.5)'
          : 'none',
        paddingBlock: scrolled ? '0.75rem' : '1.25rem',
      }}
    >
      <div
        className="container-allbotix"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* ── Logo ── */}
        <Link href={'/'}>
          <Image
            src="/logo.png"
            alt="Allbotix Logo"
            width={120}
            height={80}
          />
        </Link>

        {/* ── Desktop Nav ── */}
        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '2rem',
          }}
          className="desktop-nav"
        >
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '0.65rem',
                fontWeight: 600,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color:
                  activeLink === link.label
                    ? 'var(--red-bright)'
                    : 'var(--text-secondary)',
                transition: 'color 0.2s',
                position: 'relative',
                paddingBottom: '4px',
              }}
              onMouseEnter={(e) =>
                ((e.target as HTMLElement).style.color = 'var(--text-primary)')
              }
              onMouseLeave={(e) =>
                ((e.target as HTMLElement).style.color =
                  activeLink === link.label
                    ? 'var(--red-bright)'
                    : 'var(--text-secondary)')
              }
            >
              {link.label}
              {activeLink === link.label && (
                <span
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '1px',
                    background: 'var(--red-bright)',
                    boxShadow: '0 0 6px var(--red-glow)',
                  }}
                />
              )}
            </Link>
          ))}
        </nav>

        {/* ── CTA Button ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link
            href="/contacts"
            className="btn-primary"
            style={{ fontSize: '0.62rem', padding: '0.6rem 1.4rem' }}
          >
            Contact Us
          </Link>

          {/* Hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            className="hamburger-btn"
            style={{
              display: 'none',
              flexDirection: 'column',
              gap: '5px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px',
            }}
          >
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                style={{
                  display: 'block',
                  width: '22px',
                  height: '2px',
                  background:
                    i === 1 && menuOpen
                      ? 'var(--red-bright)'
                      : 'var(--text-primary)',
                  borderRadius: '2px',
                  transition: 'all 0.3s',
                  transform:
                    menuOpen && i === 0
                      ? 'translateY(7px) rotate(45deg)'
                      : menuOpen && i === 2
                      ? 'translateY(-7px) rotate(-45deg)'
                      : menuOpen && i === 1
                      ? 'scaleX(0)'
                      : 'none',
                }}
              />
            ))}
          </button>
        </div>
      </div>

      {/* ── Mobile Menu ── */}
      {menuOpen && (
        <div
          style={{
            background: 'rgba(8,8,8,0.98)',
            borderTop: '1px solid var(--border)',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
          }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '0.7rem',
                fontWeight: 600,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color:
                  activeLink === link.label
                    ? 'var(--red-bright)'
                    : 'var(--text-secondary)',
                padding: '0.5rem 0',
                borderBottom: '1px solid var(--border-soft)',
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .hamburger-btn { display: flex !important; }
        }
      `}</style>
    </header>
  )
}