'use client'

import Link from 'next/link'
import { useEffect, useRef } from 'react'
import { solutions } from '@/data/solutions'

export default function SolutionsCarousel({
  speed = 38,
}: {
  speed?: number
}) {
  const trackLeftRef  = useRef<HTMLDivElement>(null)
  const trackRightRef = useRef<HTMLDivElement>(null)
  const rafRef        = useRef<number>(0)
  const posRef        = useRef(0)
  const pausedRef     = useRef(false)

  const half     = Math.ceil(solutions.length / 2)
  const colA     = solutions.slice(0, half)
  const colB     = solutions.slice(half)
  const doubledA = [...colA, ...colA, ...colA]
  const doubledB = [...colB, ...colB, ...colB]

  useEffect(() => {
    const trackL = trackLeftRef.current
    const trackR = trackRightRef.current
    if (!trackL || !trackR) return

    const GAP = 16
    let setHeightL = 0
    let setHeightR = 0

    const measure = () => {
      const chL = Array.from(trackL.children) as HTMLElement[]
      const chR = Array.from(trackR.children) as HTMLElement[]
      if (chL.length) setHeightL = chL.slice(0, colA.length).reduce((a, el) => a + el.offsetHeight + GAP, 0)
      if (chR.length) setHeightR = chR.slice(0, colB.length).reduce((a, el) => a + el.offsetHeight + GAP, 0)
    }

    requestAnimationFrame(() => { measure() })

    let last = performance.now()
    const tick = (now: number) => {
      const dt = (now - last) / 1000
      last = now
      if (!pausedRef.current) {
        posRef.current += speed * dt
        if (setHeightL > 0 && posRef.current >= setHeightL) posRef.current -= setHeightL
        trackL.style.transform = `translateY(-${posRef.current}px)`
        if (setHeightR > 0) {
          const rPos = posRef.current % setHeightR
          trackR.style.transform = `translateY(${rPos - setHeightR}px)`
        }
      }
      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)

    const ro = new ResizeObserver(measure)
    ro.observe(trackL)
    ro.observe(trackR)

    return () => {
      cancelAnimationFrame(rafRef.current)
      ro.disconnect()
    }
  }, [speed, colA.length, colB.length])

  return (
    <>
      <style>{`
        .sc-section {
          position: relative;
          background: var(--bg-800);
          border-top: 1px solid var(--border-soft);
          overflow: hidden;
          padding-block: 6rem;
        }
        .sc-glow-l, .sc-glow-r {
          position: absolute; border-radius: 50%; pointer-events: none;
          animation: scGlow 5s ease-in-out infinite;
        }
        .sc-glow-l { top: 10%; left: -10%; width: 520px; height: 520px; background: radial-gradient(circle, rgba(176,58,46,0.08) 0%, transparent 70%); }
        .sc-glow-r { bottom: 5%; right: -8%; width: 420px; height: 420px; background: radial-gradient(circle, rgba(176,58,46,0.06) 0%, transparent 70%); animation-delay: 1.5s; }
        @keyframes scGlow { 0%,100% { opacity: 0.6; transform: scale(1); } 50% { opacity: 1; transform: scale(1.08); } }
        .sc-watermark { position: absolute; bottom: -3rem; left: 50%; transform: translateX(-50%); white-space: nowrap; pointer-events: none; }
        .sc-inner { position: relative; z-index: 2; }

        .sc-header {
          display: flex; align-items: flex-end; justify-content: space-between;
          gap: 2rem; margin-bottom: 3.5rem; flex-wrap: wrap;
          animation: scHeaderIn 0.7s ease-out 0.05s both;
        }
        @keyframes scHeaderIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

        .sc-stage {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 1.5rem; height: 580px; position: relative;
        }
        @media (max-width: 680px) {
          .sc-stage { grid-template-columns: 1fr; height: 480px; }
          .sc-col-right { display: none; }
        }

        .sc-col {
          position: relative; overflow: hidden;
          border-radius: 6px; border: 1px solid var(--border); background: var(--bg-900);
        }
        .sc-col::before, .sc-col::after {
          content: ''; position: absolute; left: 0; right: 0; height: 100px;
          pointer-events: none; z-index: 3;
        }
        .sc-col::before { top: 0; background: linear-gradient(to bottom, var(--bg-800), transparent); }
        .sc-col::after  { bottom: 0; background: linear-gradient(to top, var(--bg-800), transparent); }

        .sc-track { display: flex; flex-direction: column; gap: 16px; padding: 1rem; will-change: transform; }

        /* Card is now a <Link> */
        .sc-card {
          display: block; text-decoration: none;
          background: var(--bg-card); border: 1px solid var(--border-soft);
          border-radius: 6px; padding: 1.75rem 1.75rem 1.4rem;
          cursor: pointer; position: relative; overflow: hidden; flex-shrink: 0;
          transition: background 0.25s, border-color 0.3s, transform 0.3s, box-shadow 0.3s;
        }
        .sc-card::after {
          content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, var(--red-bright), transparent);
          transform: scaleX(0); transform-origin: left;
          transition: transform 0.38s cubic-bezier(0.23,1,0.32,1);
        }
        .sc-card:hover {
          background: var(--bg-700); border-color: rgba(176,58,46,0.28);
          transform: translateY(-3px);
          box-shadow: 0 16px 40px rgba(0,0,0,0.45), 0 0 20px rgba(176,58,46,0.07);
        }
        .sc-card:hover::after { transform: scaleX(1); }

        .sc-card-num {
          position: absolute; top: 0.9rem; right: 1.1rem;
          font-family: var(--font-display); font-size: 2.5rem; font-weight: 900;
          color: transparent; -webkit-text-stroke: 1px rgba(176,58,46,0.08);
          line-height: 1; pointer-events: none; user-select: none;
          transition: -webkit-text-stroke 0.3s;
        }
        .sc-card:hover .sc-card-num { -webkit-text-stroke: 1px rgba(176,58,46,0.2); }

        .sc-card-icon {
          width: 42px; height: 42px; border-radius: 6px;
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 1rem; background: rgba(176,58,46,0.12);
          color: var(--red-bright); flex-shrink: 0;
          transition: background 0.25s, filter 0.25s;
        }
        .sc-card:hover .sc-card-icon { background: rgba(176,58,46,0.2); filter: drop-shadow(0 0 7px rgba(232,57,42,0.4)); }

        .sc-card-title {
          font-family: var(--font-display); font-size: 0.86rem; font-weight: 700;
          color: var(--text-primary); letter-spacing: 0.04em; margin: 0 0 0.55rem; line-height: 1.4;
        }
        .sc-card-desc {
          font-size: 0.83rem; color: var(--text-secondary); line-height: 1.8; margin: 0 0 1.1rem;
          display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
        }
        .sc-card-cta {
          display: inline-flex; align-items: center; gap: 5px;
          font-family: var(--font-display); font-size: 0.6rem; font-weight: 700;
          letter-spacing: 0.16em; text-transform: uppercase; color: var(--red-bright);
          transition: gap 0.22s;
        }
        .sc-card:hover .sc-card-cta { gap: 9px; }

        .sc-hint {
          display: flex; justify-content: center; margin-top: 2rem;
          font-family: var(--font-display); font-size: 0.56rem;
          letter-spacing: 0.18em; text-transform: uppercase;
          color: var(--text-secondary); opacity: 0.4;
        }
      `}</style>

      <section className="sc-section" id="solutions-carousel">
        <div className="sc-glow-l" aria-hidden="true" />
        <div className="sc-glow-r" aria-hidden="true" />
        <div className="sc-watermark" aria-hidden="true">
          <span className="watermark-text">Solutions</span>
        </div>

        <div className="container-allbotix sc-inner">

          <div className="sc-header">
            <div>
              <div className="section-tag">What We Offer</div>
              <h2 className="section-title">
                Unleashing Potential, One <span>Allbotix</span>
                <br />at a Time.
              </h2>
            </div>
            <Link href="/solutions" className="btn-outline" style={{ flexShrink: 0 }}>
              View All Solutions
            </Link>
          </div>

          <div
            className="sc-stage"
            onMouseEnter={() => { pausedRef.current = true }}
            onMouseLeave={() => { pausedRef.current = false }}
          >
            {/* Left — scrolls UP */}
            <div className="sc-col sc-col-left">
              <div className="sc-track" ref={trackLeftRef}>
                {doubledA.map((sol, i) => (
                  <Link
                    href={`/solutions/${sol.uid}`}
                    className="sc-card"
                    key={`L-${sol.uid}-${i}`}
                  >
                    <span className="sc-card-num">
                      {String((i % colA.length) + 1).padStart(2, '0')}
                    </span>
                    <div className="sc-card-icon">{sol.icon}</div>
                    <p className="sc-card-title">{sol.title}</p>
                    <p className="sc-card-desc">{sol.desc}</p>
                    <span className="sc-card-cta">
                      Explore Solution
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12"/>
                        <polyline points="12 5 19 12 12 19"/>
                      </svg>
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Right — scrolls DOWN */}
            <div className="sc-col sc-col-right">
              <div className="sc-track" ref={trackRightRef}>
                {doubledB.map((sol, i) => (
                  <Link
                    href={`/solutions/${sol.uid}`}
                    className="sc-card"
                    key={`R-${sol.uid}-${i}`}
                  >
                    <span className="sc-card-num">
                      {String((i % colB.length) + 1).padStart(2, '0')}
                    </span>
                    <div className="sc-card-icon">{sol.icon}</div>
                    <p className="sc-card-title">{sol.title}</p>
                    <p className="sc-card-desc">{sol.desc}</p>
                    <span className="sc-card-cta">
                      Explore Solution
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12"/>
                        <polyline points="12 5 19 12 12 19"/>
                      </svg>
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <p className="sc-hint">Hover to pause · Click to explore</p>

        </div>
      </section>
    </>
  )
}