'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

// ─── FAQ data ─────────────────────────────────────────────────────────────────
const faqs = [
  {
    q: 'What types of robots does Allbotix build?',
    a: 'From Smart Autonomous Mobile Robots (AMRs) for warehousing, to precision industrial arms, cleaning bots, AI-powered inspection systems, and collaborative cobots — every system is engineered for your industry.',
    tags: ['AMR', 'Cobot', 'Industrial'],
  },
  {
    q: 'How do your robots integrate with existing systems?',
    a: 'Plug-and-play integration with ERP, WMS, and SCADA via standard APIs and IoT protocols. Our engineers handle environment mapping, sensor calibration, and software deployment with zero disruption to operations.',
    tags: ['API', 'IoT', 'ERP / WMS'],
  },
  {
    q: 'Are Allbotix robots safe around human workers?',
    a: 'All cobots and AMRs carry multi-layer safety systems: LiDAR obstacle detection, force-torque sensors, emergency stops, and real-time path re-planning. Fully ISO 10218 and ISO/TS 15066 compliant.',
    tags: ['ISO Certified', 'LiDAR', 'Safety'],
  },
  {
    q: 'Which industries do you serve?',
    a: 'Manufacturing, warehousing, food & beverage, healthcare, education, electronics, government, defence, and retail. Our modular design adapts precisely to the regulatory requirements of each sector.',
    tags: ['Manufacturing', 'Healthcare', 'Logistics'],
  },
  {
    q: 'How long does a deployment take?',
    a: 'Three phases: site assessment (2–4 weeks), hardware and software setup (1–3 weeks), and staff training plus go-live support (1 week). Multi-robot fleet deployments may vary. Full roadmap provided before any commitment.',
    tags: ['3 Phases', 'Fast Setup'],
  },
  {
    q: 'Do you offer 24/7 support after deployment?',
    a: 'Every Allbotix deployment includes a 24/7 premium support plan. Remote diagnostics monitor robot health in real time. On-site engineers handle scheduled maintenance, emergency response, and firmware updates.',
    tags: ['24/7', 'Remote Diagnostics'],
  },
  {
    q: 'Can your AI adapt to our specific workflows?',
    a: 'Our robots run adaptive AI models that learn your facility layout, demand patterns, and task logic over time — using reinforcement learning and real-time sensor feedback to continuously optimise routing and cycle times.',
    tags: ['Adaptive AI', 'Reinforcement Learning'],
  },
  {
    q: 'What ROI can we expect from an Allbotix deployment?',
    a: 'Most clients achieve full ROI within 18–36 months. Throughput gains of 35–70% and error rates reduced by over 90% in precision tasks. A detailed free ROI projection is included with every initial consultation.',
    tags: ['35–70% Gains', 'Free Audit'],
  },
]

// ─── Single animated FAQ card ─────────────────────────────────────────────────
function FAQCard({
  item,
  index,
  isOpen,
  onToggle,
  entryVisible,
}: {
  item: (typeof faqs)[0]
  index: number
  isOpen: boolean
  onToggle: () => void
  entryVisible: boolean
}) {
  return (
    <div
      className={`faq-card${isOpen ? ' faq-card--open' : ''}`}
      style={{
        opacity: entryVisible ? 1 : 0,
        transform: entryVisible ? 'translateY(0)' : 'translateY(22px)',
        transition: `opacity 0.55s ease ${index * 0.07}s, transform 0.55s ease ${index * 0.07}s`,
      }}
      onClick={onToggle}
    >
      {/* Corner accents — appear on hover / open via CSS */}
      <span className="faq-corner faq-corner--tl" aria-hidden="true" />
      <span className="faq-corner faq-corner--br" aria-hidden="true" />

      {/* Scan shimmer */}
      <span className="faq-scan" aria-hidden="true" />

      {/* Question row */}
      <div className="faq-top">
        <span className="faq-num">{String(index + 1).padStart(2, '0')}</span>
        <p className="faq-question">{item.q}</p>
        <button
          className="faq-toggle"
          aria-expanded={isOpen}
          aria-label={isOpen ? 'Collapse answer' : 'Expand answer'}
          onClick={e => { e.stopPropagation(); onToggle() }}
        >
          <svg
            width="10" height="10"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
      </div>

      {/* Animated divider */}
      <div className="faq-divider" aria-hidden="true" />

      {/* Expandable body */}
      <div className="faq-body">
        <div className="faq-body-inner">
          <div className="faq-answer-wrap">
            {/* Red left bar that draws down */}
            <span className="faq-bar" aria-hidden="true" />
            {/* Pulsing dot indicator */}
            <span className="faq-dot" aria-hidden="true" />
            <p className="faq-answer">{item.a}</p>
          </div>
          {/* Tag pills */}
          <div className="faq-tags">
            {item.tags.map(tag => (
              <span key={tag} className="faq-tag-pill">{tag}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Main FAQ Section ─────────────────────────────────────────────────────────
export default function FAQSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [visible, setVisible]   = useState(false)
  const [openIdx, setOpenIdx]   = useState<number | null>(null)

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold: 0.07 }
    )
    if (sectionRef.current) obs.observe(sectionRef.current)
    return () => obs.disconnect()
  }, [])

  const toggle = (i: number) => setOpenIdx(p => (p === i ? null : i))

  const mid  = Math.ceil(faqs.length / 2)
  const colL = faqs.slice(0, mid)
  const colR = faqs.slice(mid)

  return (
    <>
      <style>{`
        /* ── Section shell ── */
        .faq-section {
          position: relative;
          padding-block: 6rem;
          background: var(--bg-900);
          border-top: 1px solid var(--border-soft);
          overflow: hidden;
        }
        .faq-glow {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          animation: faqGlowPulse 5s ease-in-out infinite;
        }
        @keyframes faqGlowPulse {
          0%,100% { opacity: 0.55; transform: scale(1); }
          50%      { opacity: 1;   transform: scale(1.1); }
        }
        .faq-watermark {
          position: absolute;
          bottom: -3rem; left: 50%;
          transform: translateX(-50%);
          white-space: nowrap;
          pointer-events: none;
        }
        .faq-inner { position: relative; z-index: 2; }

        /* ── Header ── */
        .faq-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 2rem;
          margin-bottom: 3rem;
          flex-wrap: wrap;
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.65s ease, transform 0.65s ease;
        }
        .faq-header.faq-header--visible {
          opacity: 1;
          transform: translateY(0);
        }

        /* ── Grid ── */
        .faq-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }
        @media (max-width: 860px) {
          .faq-grid { grid-template-columns: 1fr; }
        }

        /* ── Card base ── */
        .faq-card {
          position: relative;
          background: var(--bg-card);
          border: 1px solid var(--border-soft);
          border-radius: 6px;
          overflow: hidden;
          cursor: pointer;
          transition:
            border-color 0.3s,
            transform 0.38s cubic-bezier(0.23,1,0.32,1),
            box-shadow 0.38s;
        }
        .faq-card:hover {
          border-color: rgba(232,57,42,0.3);
          transform: translateY(-2px);
          box-shadow: 0 12px 36px rgba(0,0,0,0.35), 0 0 18px rgba(176,58,46,0.06);
        }
        .faq-card.faq-card--open {
          border-color: rgba(232,57,42,0.5);
          box-shadow: 0 16px 44px rgba(0,0,0,0.4), 0 0 24px rgba(176,58,46,0.08);
        }

        /* ── Corner accents ── */
        .faq-corner {
          position: absolute;
          width: 0; height: 0;
          border-style: solid;
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.3s;
        }
        .faq-card:hover .faq-corner,
        .faq-card.faq-card--open .faq-corner { opacity: 1; }
        .faq-corner--tl {
          top: -1px; left: -1px;
          border-width: 20px 20px 0 0;
          border-color: var(--red-bright) transparent transparent transparent;
        }
        .faq-corner--br {
          bottom: -1px; right: -1px;
          border-width: 0 0 20px 20px;
          border-color: transparent transparent var(--red-bright) transparent;
        }

        /* ── Scan shimmer ── */
        .faq-scan {
          position: absolute;
          top: 0; left: -100%;
          width: 55%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(232,57,42,0.045), transparent);
          pointer-events: none;
        }
        .faq-card:hover .faq-scan {
          left: 150%;
          transition: left 0.6s ease;
        }

        /* ── Question row ── */
        .faq-top {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 1.25rem 1.25rem 1rem;
          position: relative;
        }
        .faq-num {
          flex-shrink: 0;
          width: 30px; height: 30px;
          border-radius: 6px;
          background: rgba(232,57,42,0.09);
          display: flex; align-items: center; justify-content: center;
          font-family: var(--font-display);
          font-size: 0.62rem;
          font-weight: 700;
          color: var(--red-bright);
          letter-spacing: 0.04em;
          transition: background 0.25s, transform 0.35s cubic-bezier(0.23,1,0.32,1);
        }
        .faq-card:hover .faq-num,
        .faq-card.faq-card--open .faq-num {
          background: rgba(232,57,42,0.18);
          transform: scale(1.1);
        }
        .faq-question {
          flex: 1;
          font-family: var(--font-display);
          font-size: 0.84rem;
          font-weight: 700;
          color: var(--text-primary);
          line-height: 1.45;
          letter-spacing: 0.02em;
          transition: color 0.22s;
          padding-right: 4px;
        }
        .faq-card:hover .faq-question,
        .faq-card.faq-card--open .faq-question { color: var(--red-bright); }

        /* ── Toggle button ── */
        .faq-toggle {
          flex-shrink: 0;
          width: 24px; height: 24px;
          border-radius: 50%;
          border: 1px solid var(--border-soft);
          background: none;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          color: var(--text-secondary);
          transition:
            background 0.25s,
            border-color 0.25s,
            color 0.25s,
            transform 0.4s cubic-bezier(0.23,1,0.32,1);
        }
        .faq-card.faq-card--open .faq-toggle {
          background: rgba(232,57,42,0.12);
          border-color: rgba(232,57,42,0.4);
          color: var(--red-bright);
          transform: rotate(45deg);
        }

        /* ── Divider draws in when open ── */
        .faq-divider {
          height: 1px;
          background: var(--border-soft);
          margin: 0 1.25rem;
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.38s cubic-bezier(0.23,1,0.32,1);
        }
        .faq-card.faq-card--open .faq-divider { transform: scaleX(1); }

        /* ── Accordion body ── */
        .faq-body {
          display: grid;
          grid-template-rows: 0fr;
          transition: grid-template-rows 0.4s cubic-bezier(0.23,1,0.32,1);
        }
        .faq-card.faq-card--open .faq-body { grid-template-rows: 1fr; }
        .faq-body-inner { overflow: hidden; }

        .faq-answer-wrap {
          position: relative;
          padding: 1rem 1.25rem 0.5rem;
        }

        /* Red left bar draws down on open */
        .faq-bar {
          position: absolute;
          left: 1.25rem; top: 1rem; bottom: 0.5rem;
          width: 2px;
          border-radius: 2px;
          background: var(--red-bright);
          transform: scaleY(0);
          transform-origin: top;
          transition: transform 0.42s cubic-bezier(0.23,1,0.32,1) 0.06s;
        }
        .faq-card.faq-card--open .faq-bar { transform: scaleY(1); }

        /* Pulsing dot — top-right of answer area */
        .faq-dot {
          position: absolute;
          top: 1.1rem; right: 1.25rem;
          width: 5px; height: 5px;
          border-radius: 50%;
          background: var(--red-bright);
          opacity: 0;
          transition: opacity 0.25s 0.2s;
        }
        .faq-card.faq-card--open .faq-dot {
          opacity: 1;
          animation: faqDotPulse 1.8s ease-in-out infinite;
        }
        @keyframes faqDotPulse {
          0%,100% { transform: scale(1); opacity: 0.7; }
          50%      { transform: scale(1.8); opacity: 1; }
        }

        .faq-answer {
          font-size: 0.83rem;
          color: var(--text-secondary);
          line-height: 1.85;
          padding-left: 14px;
          margin: 0;
          opacity: 0;
          transform: translateY(6px);
          transition: opacity 0.32s 0.18s, transform 0.32s 0.18s;
        }
        .faq-card.faq-card--open .faq-answer {
          opacity: 1;
          transform: translateY(0);
        }

        /* ── Tag pills ── */
        .faq-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          padding: 0.75rem 1.25rem 1.1rem;
          opacity: 0;
          transform: translateY(5px);
          transition: opacity 0.28s 0.26s, transform 0.28s 0.26s;
        }
        .faq-card.faq-card--open .faq-tags {
          opacity: 1;
          transform: translateY(0);
        }
        .faq-tag-pill {
          font-family: var(--font-display);
          font-size: 0.58rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 3px 9px;
          border-radius: 4px;
          background: rgba(232,57,42,0.08);
          color: var(--red-bright);
          border: 1px solid rgba(232,57,42,0.15);
          transition: background 0.2s, border-color 0.2s;
        }
        .faq-tag-pill:hover {
          background: rgba(232,57,42,0.16);
          border-color: rgba(232,57,42,0.3);
        }

        /* ── Footer row ── */
        .faq-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1.5rem;
          margin-top: 2.5rem;
          padding-top: 2rem;
          border-top: 1px solid var(--border-soft);
          flex-wrap: wrap;
          opacity: 0;
          transform: translateY(14px);
          transition: opacity 0.5s ease 0.55s, transform 0.5s ease 0.55s;
        }
        .faq-footer.faq-footer--visible {
          opacity: 1;
          transform: translateY(0);
        }
        .faq-footer-text {
          font-size: 0.83rem;
          color: var(--text-secondary);
          line-height: 1.6;
        }
        .faq-footer-text strong {
          color: var(--text-primary);
          font-weight: 700;
        }
      `}</style>

      <section className="faq-section" ref={sectionRef} id="faq">

        {/* Glows */}
        <div className="faq-glow" aria-hidden="true" style={{
          top: '8%', right: '-8%',
          width: '460px', height: '460px',
          background: 'radial-gradient(circle, rgba(176,58,46,0.07) 0%, transparent 70%)',
        }} />
        <div className="faq-glow" aria-hidden="true" style={{
          bottom: '5%', left: '-6%',
          width: '360px', height: '360px',
          background: 'radial-gradient(circle, rgba(176,58,46,0.05) 0%, transparent 70%)',
          animationDelay: '1.8s',
        }} />

        {/* Watermark */}
        <div className="faq-watermark" aria-hidden="true">
          <span className="watermark-text">FAQ</span>
        </div>

        <div className="container-allbotix faq-inner">

          {/* Header */}
          <div className={`faq-header${visible ? ' faq-header--visible' : ''}`}>
            <div>
              <div className="section-tag">Got Questions?</div>
              <h2 className="section-title">
                Everything You Need to <span>Know.</span>
              </h2>
            </div>
            <Link href="/contact" className="btn-outline" style={{ flexShrink: 0 }}>
              Contact Us
            </Link>
          </div>

          {/* Card grid — two columns */}
          <div className="faq-grid">
            {/* Left column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {colL.map((item, i) => (
                <FAQCard
                  key={item.q}
                  item={item}
                  index={i}
                  isOpen={openIdx === i}
                  onToggle={() => toggle(i)}
                  entryVisible={visible}
                />
              ))}
            </div>

            {/* Right column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {colR.map((item, i) => (
                <FAQCard
                  key={item.q}
                  item={item}
                  index={mid + i}
                  isOpen={openIdx === mid + i}
                  onToggle={() => toggle(mid + i)}
                  entryVisible={visible}
                />
              ))}
            </div>
          </div>

          {/* Footer CTA */}
          <div className={`faq-footer${visible ? ' faq-footer--visible' : ''}`}>
            <p className="faq-footer-text">
              <strong>Still have questions?</strong>{' '}
              Our robotics engineers are ready to help you find the right solution.
            </p>
            <Link href="/contacts" className="btn-primary" style={{ flexShrink: 0 }}>
              Talk to an Expert
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5"
                strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"/>
                <polyline points="12 5 19 12 12 19"/>
              </svg>
            </Link>
          </div>

        </div>
      </section>
    </>
  )
}