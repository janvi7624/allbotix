'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

const plans = [
  {
    name: 'Basic Package',
    price: '49',
    period: '/month',
    desc: 'Perfect for small businesses exploring robotics automation for the first time.',
    featured: false,
    features: [
      '1 Robotic Unit',
      'Basic AI Integration',
      'Email Support',
      '8/5 Monitoring',
      '2 Revisions/month',
      '1 Site Installation',
    ],
    cta: 'Get Started',
  },
  {
    name: 'Premium Package',
    price: '79',
    period: '/month',
    desc: 'Ideal for growing businesses that need reliable automation with premium support.',
    featured: true,
    badge: 'Most Popular',
    features: [
      '3 Robotic Units',
      'Advanced AI Integration',
      'Priority Support',
      '16/7 Monitoring',
      '5 Revisions/month',
      '3 Site Installations',
      'Analytics Dashboard',
    ],
    cta: 'Get Premium',
  },
  {
    name: 'Export Package',
    price: '99',
    period: '/month',
    desc: 'Built for established businesses scaling automation across multiple facilities.',
    featured: false,
    features: [
      '6 Robotic Units',
      'Full AI Suite',
      'Dedicated Manager',
      '20/7 Monitoring',
      'Unlimited Revisions',
      '6 Site Installations',
      'Custom Integrations',
    ],
    cta: 'Get Started',
  },
  {
    name: 'Enterprise Package',
    price: '199',
    period: '/month',
    desc: 'Full-scale robotic deployment for large enterprises with custom requirements.',
    featured: false,
    features: [
      'Unlimited Units',
      'Custom AI Development',
      '24/7 Dedicated Team',
      'Real-time Monitoring',
      'Unlimited Revisions',
      'Global Installations',
      'SLA Guarantee',
      'White-label Options',
    ],
    cta: 'Contact Sales',
  },
]

const CheckIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ flexShrink: 0 }}
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

// ─── Animated price number ────────────────────────────────────────────────────
function AnimatedPrice({ price, started, delay = 0 }: { price: string; started: boolean; delay?: number }) {
  const target = parseInt(price, 10)
  const [display, setDisplay] = useState('0')
  const hasRun = useRef(false)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    if (!started || hasRun.current) return
    hasRun.current = true
    const duration = 1800
    let startTime: number | null = null
    const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t))

    const timer = setTimeout(() => {
      const tick = (now: number) => {
        if (!startTime) startTime = now
        const elapsed = now - startTime
        const progress = Math.min(elapsed / duration, 1)
        setDisplay(String(Math.floor(easeOutExpo(progress) * target)))
        if (progress < 1) {
          rafRef.current = requestAnimationFrame(tick)
        } else {
          setDisplay(price)
        }
      }
      rafRef.current = requestAnimationFrame(tick)
    }, delay)

    return () => {
      clearTimeout(timer)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [started, target, price, delay])

  return <>{display}</>
}

// ─── Single pricing card ──────────────────────────────────────────────────────
function PricingCard({
  plan,
  index,
  started,
}: {
  plan: (typeof plans)[0]
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
    const rotX = -dy * 9
    const rotY = dx * 9
    card.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.03,1.03,1.03) translateY(-4px)`

    if (shineRef.current) {
      const px = ((e.clientX - rect.left) / rect.width) * 100
      const py = ((e.clientY - rect.top) / rect.height) * 100
      shineRef.current.style.background = `radial-gradient(circle at ${px}% ${py}%, rgba(var(--red-accent-rgb),0.09) 0%, transparent 55%)`
      shineRef.current.style.opacity = '1'
    }
  }

  const handleMouseLeave = () => {
    const card = cardRef.current
    if (!card) return
    card.style.transform = plan.featured
      ? 'perspective(900px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1) translateY(-6px)'
      : 'perspective(900px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1) translateY(0)'
    if (shineRef.current) shineRef.current.style.opacity = '0'
    setHovered(false)
  }

  const baseTransform = plan.featured
    ? 'perspective(900px) translateY(-6px)'
    : 'perspective(900px) translateY(0)'

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        position: 'relative',
        background: plan.featured ? 'var(--bg-700)' : 'var(--bg-card)',
        border: plan.featured
          ? '1px solid var(--red-bright)'
          : hovered
          ? '1px solid rgba(var(--red-dark-rgb),0.45)'
          : '1px solid var(--border)',
        borderRadius: '6px',
        padding: '2.25rem 1.75rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        boxShadow: plan.featured
          ? '0 0 50px rgba(var(--red-dark-rgb),0.18), 0 20px 60px rgba(var(--black-rgb),0.5)'
          : hovered
          ? '0 20px 50px rgba(var(--black-rgb),0.5), 0 0 28px rgba(var(--red-dark-rgb),0.10)'
          : 'none',
        transform: baseTransform,
        transformStyle: 'preserve-3d',
        transition: 'transform 0.45s cubic-bezier(0.23,1,0.32,1), box-shadow 0.4s, border 0.3s',
        willChange: 'transform',
        animation: `pricingCardIn 0.65s cubic-bezier(0.23,1,0.32,1) ${index * 0.13 + 0.1}s both`,
      }}
    >
      {/* Mouse-tracking shine */}
      <div
        ref={shineRef}
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '6px',
          pointerEvents: 'none',
          opacity: 0,
          transition: 'opacity 0.3s',
          zIndex: 1,
        }}
      />

      {/* Featured top bar */}
      {plan.featured && (
        <div
          style={{
            position: 'absolute',
            top: 0, left: 0, right: 0,
            height: '3px',
            background: 'linear-gradient(90deg, var(--red-bright), var(--red-dim))',
            borderRadius: '6px 6px 0 0',
          }}
        />
      )}

      {/* Corner glow for featured */}
      {plan.featured && (
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: '-1px', right: '-1px',
            width: '80px', height: '80px',
            background: 'radial-gradient(circle at top right, rgba(var(--red-accent-rgb),0.2) 0%, transparent 70%)',
            borderRadius: '0 6px 0 0',
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Badge */}
      {plan.badge && (
        <div
          style={{
            position: 'absolute',
            top: '-13px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'var(--red-bright)',
            color: 'var(--white)',
            fontFamily: 'var(--font-display)',
            fontSize: '0.58rem',
            fontWeight: 700,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            padding: '4px 14px',
            borderRadius: '20px',
            whiteSpace: 'nowrap',
            boxShadow: '0 0 14px var(--red-glow)',
            animation: 'badgePulse 2.5s ease-in-out infinite',
            zIndex: 10,
          }}
        >
          {plan.badge}
        </div>
      )}

      {/* Plan name */}
      <div style={{ position: 'relative', zIndex: 2 }}>
        <h3
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '0.72rem',
            fontWeight: 700,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: plan.featured ? 'var(--red-bright)' : 'var(--text-secondary)',
            marginBottom: '0.85rem',
            transform: 'translateZ(10px)',
          }}
        >
          {plan.name}
        </h3>

        {/* Price */}
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            gap: '3px',
            marginBottom: '0.75rem',
            transform: 'translateZ(18px)',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '0.9rem',
              fontWeight: 600,
              color: 'var(--text-secondary)',
            }}
          >
            $
          </span>
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '2.6rem',
              fontWeight: 900,
              color: 'var(--text-primary)',
              lineHeight: 1,
              textShadow: plan.featured ? '0 0 30px rgba(var(--red-accent-rgb),0.25)' : 'none',
              minWidth: '3.5ch',
              display: 'inline-block',
            }}
          >
            <AnimatedPrice price={plan.price} started={started} delay={index * 180 + 300} />
          </span>
          <span
            style={{
              fontFamily: 'var(--font-light)',
              fontSize: '0.8rem',
              color: 'var(--text-muted)',
            }}
          >
            {plan.period}
          </span>
        </div>

        <p
          style={{
            fontSize: '0.82rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.7,
          }}
        >
          {plan.desc}
        </p>
      </div>

      {/* Divider */}
      <div
        style={{
          height: '1px',
          background: plan.featured ? 'rgba(var(--red-dark-rgb),0.25)' : 'var(--border-soft)',
          position: 'relative',
          zIndex: 2,
        }}
      />

      {/* Features */}
      <ul
        style={{
          listStyle: 'none',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          flex: 1,
          position: 'relative',
          zIndex: 2,
        }}
      >
        {plan.features.map((feat, fi) => (
          <li
            key={feat}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontFamily: 'var(--font-light)',
              fontSize: '0.85rem',
              color: 'var(--text-secondary)',
              animation: `featureIn 0.4s ease-out ${index * 0.13 + fi * 0.055 + 0.4}s both`,
            }}
          >
            <span
              style={{
                color: 'var(--red-bright)',
                filter: 'drop-shadow(0 0 4px rgba(var(--red-accent-rgb),0.5))',
              }}
            >
              <CheckIcon />
            </span>
            {feat}
          </li>
        ))}
      </ul>

      {/* CTA */}
      <Link
        href="#contact"
        className={plan.featured ? 'btn-primary' : 'btn-outline'}
        style={{
          textAlign: 'center',
          justifyContent: 'center',
          marginTop: 'auto',
          fontSize: '0.65rem',
          padding: '0.7rem 1.25rem',
          position: 'relative',
          zIndex: 2,
          transform: 'translateZ(12px)',
          transition: 'transform 0.2s, box-shadow 0.2s',
        }}
      >
        {plan.cta}
      </Link>
    </div>
  )
}

// ─── Main section ─────────────────────────────────────────────────────────────
export default function PricingSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true)
          observer.disconnect()
        }
      },
      { threshold: 0.15 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      id="pricing"
      ref={sectionRef}
      style={{
        position: 'relative',
        paddingBlock: '6rem',
        background: 'var(--bg-800)',
        overflow: 'hidden',
        borderTop: '1px solid var(--border-soft)',
      }}
    >
      <style>{`
        @keyframes pricingCardIn {
          from {
            opacity: 0;
            transform: perspective(900px) translateY(40px) rotateX(16deg) scale3d(0.96,0.96,0.96);
          }
          to {
            opacity: 1;
            transform: perspective(900px) translateY(0) rotateX(0deg) scale3d(1,1,1);
          }
        }
        @keyframes featureIn {
          from { opacity: 0; transform: translateX(-10px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes badgePulse {
          0%,100% { box-shadow: 0 0 10px rgba(var(--red-accent-rgb),0.5); }
          50%      { box-shadow: 0 0 22px rgba(var(--red-accent-rgb),0.85); }
        }
        @keyframes ambientFloat {
          0%,100% { transform: translateX(-50%) translateY(0) scale(1); opacity: 0.7; }
          50%      { transform: translateX(-50%) translateY(-20px) scale(1.08); opacity: 1; }
        }
        @keyframes headerIn {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 1100px) {
          .pricing-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 580px) {
          .pricing-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* Animated ambient glow */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '5%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '700px',
          height: '350px',
          borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(var(--red-dark-rgb),0.09) 0%, transparent 70%)',
          pointerEvents: 'none',
          animation: 'ambientFloat 6s ease-in-out infinite',
        }}
      />

      {/* Secondary corner glows */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: '10%', left: '-5%',
          width: '300px', height: '300px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(var(--red-dark-rgb),0.05) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '15%', right: '-5%',
          width: '250px', height: '250px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(var(--red-dark-rgb),0.04) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div className="container-allbotix" style={{ position: 'relative', zIndex: 2 }}>
        {/* Header */}
        <div
          style={{
            textAlign: 'center',
            marginBottom: '4rem',
            animation: 'headerIn 0.7s ease-out 0.05s both',
          }}
        >
          <div className="section-tag" style={{ justifyContent: 'center' }}>
            Pricing Plans
          </div>
          <h2 className="section-title" style={{ marginBottom: '1rem' }}>
            Unleashing Potential, One <span>Allbotix</span>
            <br />
            at a Time.
          </h2>
          <p
            style={{
              fontSize: '0.95rem',
              maxWidth: '480px',
              margin: '0 auto',
              lineHeight: 1.9,
              color: 'var(--text-secondary)',
            }}
          >
            Choose the plan that fits your business scale. All packages
            include our core robotics platform with free onboarding support.
          </p>
        </div>

        {/* Pricing cards — perspective wrapper */}
        <div style={{ perspective: '1400px' }}>
          <div
            className="pricing-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '1.25rem',
              alignItems: 'stretch',
            }}
          >
            {plans.map((plan, i) => (
              <PricingCard key={plan.name} plan={plan} index={i} started={started} />
            ))}
          </div>
        </div>

        {/* Bottom note */}
        <p
          style={{
            textAlign: 'center',
            marginTop: '2.5rem',
            fontFamily: 'var(--font-light)',
            fontSize: '0.82rem',
            color: 'var(--text-muted)',
            animation: 'headerIn 0.6s ease-out 0.7s both',
          }}
        >
          All plans include a{' '}
          <span style={{ color: 'var(--red-bright)' }}>14-day free trial</span>
          . No credit card required. Cancel anytime.
        </p>
      </div>
    </section>
  )
}