'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { features } from '@/data/solutions'

export default function TechSection() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const rafRef  = useRef<number | null>(null)
  const cur     = useRef({ x: 0, y: 0 })
  const tgt     = useRef({ x: 0, y: 0 })

  /* ─── Scroll-reveal ─── */
  useEffect(() => {
    const wrap = wrapRef.current
    if (!wrap) return
    wrap.setAttribute('data-ts-init', '')
    const timer = setTimeout(() => {
      const els = Array.from(wrap.querySelectorAll<HTMLElement>('.ts-reveal'))
      if (!('IntersectionObserver' in window)) {
        els.forEach(el => el.classList.add('ts-visible'))
        return
      }
      const io = new IntersectionObserver(
        entries => entries.forEach(e => {
          if (e.isIntersecting) { (e.target as HTMLElement).classList.add('ts-visible'); io.unobserve(e.target) }
        }),
        { threshold: 0.05 }
      )
      els.forEach(el => {
        if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add('ts-visible')
        else io.observe(el)
      })
      return () => io.disconnect()
    }, 60)
    return () => clearTimeout(timer)
  }, [])

  /* ─── 3D card mouse-tilt ─── */
  useEffect(() => {
    const card = cardRef.current
    if (!card) return
    const onMove = (e: MouseEvent) => {
      const r = card.getBoundingClientRect()
      const nx = ((e.clientX - r.left) / r.width)  * 2 - 1
      const ny = ((e.clientY - r.top)  / r.height) * 2 - 1
      tgt.current = { x: ny * -14, y: nx * 18 }
    }
    const onLeave = () => { tgt.current = { x: 0, y: 0 } }
    const tick = () => {
      const lerp = 0.07
      cur.current.x += (tgt.current.x - cur.current.x) * lerp
      cur.current.y += (tgt.current.y - cur.current.y) * lerp
      if (cardRef.current)
        cardRef.current.style.transform =
          `perspective(1000px) rotateX(${cur.current.x}deg) rotateY(${cur.current.y}deg)`
      rafRef.current = requestAnimationFrame(tick)
    }
    card.addEventListener('mousemove', onMove)
    card.addEventListener('mouseleave', onLeave)
    rafRef.current = requestAnimationFrame(tick)
    return () => {
      card.removeEventListener('mousemove', onMove)
      card.removeEventListener('mouseleave', onLeave)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <div ref={wrapRef}>
      <style>{`
        /* ─── Reveal ───────────────────────────────── */
        [data-ts-init] .ts-reveal {
          opacity: 0;
          transform: translateY(28px);
          transition: opacity 0.7s ease, transform 0.7s ease;
        }
        [data-ts-init] .ts-reveal.ts-visible        { opacity:1!important; transform:translateY(0)!important; }
        [data-ts-init] .ts-from-left                { transform:translateX(-44px)!important; }
        [data-ts-init] .ts-from-right               { transform:translateX(44px)!important; }
        [data-ts-init] .ts-from-left.ts-visible,
        [data-ts-init] .ts-from-right.ts-visible    { transform:translateX(0)!important; }
        .ts-d1{transition-delay:.08s!important}
        .ts-d2{transition-delay:.18s!important}
        .ts-d3{transition-delay:.28s!important}
        .ts-d4{transition-delay:.38s!important}
        .ts-d5{transition-delay:.50s!important}

        /* ─── 3D card container ─────────────────────── */
        .ts-card-3d {
          position: relative;
          transform-style: preserve-3d;
          will-change: transform;
          cursor: crosshair;
          isolation: isolate;
        }

        /* ─── Decorative rings ──────────────────────── */
        @keyframes ts-ringRot    { to { transform:translate(-50%,-50%) rotate(360deg);  } }
        @keyframes ts-ringRotRev { to { transform:translate(-50%,-50%) rotate(-360deg); } }
        .ts-ring-a {
          position:absolute; width:108%; height:108%;
          top:50%; left:50%;
          border-radius:50%;
          border:1px dashed var(--copper-border);
          animation:ts-ringRot 22s linear infinite;
          pointer-events:none; z-index:0;
        }
        .ts-ring-b {
          position:absolute; width:86%; height:86%;
          top:50%; left:50%;
          border-radius:50%;
          border:1px solid rgba(242,107,58,0.10);
          animation:ts-ringRotRev 15s linear infinite;
          pointer-events:none; z-index:0;
        }

        /* ─── Main visual panel ─────────────────────── */
        @keyframes ts-panelGlow {
          0%,100% { box-shadow: 0 24px 64px var(--copper-glow), 0 0 0 1px var(--copper-border); }
          50%      { box-shadow: 0 32px 80px var(--red-glow),   0 0 0 1px var(--copper-border); }
        }
        .ts-visual-panel {
          position:relative; border-radius:14px; overflow:hidden;
          aspect-ratio:4/3;
          background: linear-gradient(145deg, var(--bg-700) 0%, var(--bg-600) 100%);
          border:1px solid var(--copper-border);
          animation:ts-panelGlow 4s ease-in-out infinite;
          transform:translateZ(0);
          z-index:1;
        }
        /* corner brackets */
        .ts-visual-panel::before,
        .ts-visual-panel::after {
          content:''; position:absolute; width:18px; height:18px;
          pointer-events:none; z-index:5;
        }
        .ts-visual-panel::before {
          top:10px; left:10px;
          border-top:1.5px solid var(--red-bright);
          border-left:1.5px solid var(--red-bright);
          border-radius:2px 0 0 0;
        }
        .ts-visual-panel::after {
          bottom:10px; right:10px;
          border-bottom:1.5px solid var(--red-bright);
          border-right:1.5px solid var(--red-bright);
          border-radius:0 0 2px 0;
        }

        /* ─── Scanline ──────────────────────────────── */
        @keyframes ts-scan { 0%{top:-3%;opacity:.7} 100%{top:108%;opacity:0} }
        .ts-scanline {
          position:absolute; left:0; right:0; height:2px;
          background:linear-gradient(90deg,transparent,var(--copper-light),transparent);
          animation:ts-scan 3.5s linear infinite;
          pointer-events:none; z-index:4; opacity:.5;
        }

        /* ─── Overlay label ─────────────────────────── */
        @keyframes ts-labelSlide {
          from{opacity:0;transform:translateX(-14px)} to{opacity:1;transform:translateX(0)}
        }
        .ts-overlay-label {
          position:absolute; bottom:1rem; left:1rem;
          background:rgba(255,255,255,0.92);
          border:1px solid var(--copper-border);
          border-radius:6px; padding:.5rem .85rem;
          backdrop-filter:blur(10px);
          box-shadow:0 4px 16px var(--copper-glow);
          z-index:4;
          animation:ts-labelSlide 0.6s ease 0.8s both;
        }

        /* ─── Floating chips (3D depth via translateZ) ── */
        @keyframes ts-float1 {
          0%,100%{transform:translateZ(52px) translateY(0)}
          50%    {transform:translateZ(52px) translateY(-9px)}
        }
        @keyframes ts-float2 {
          0%,100%{transform:translateZ(44px) translateY(0)}
          50%    {transform:translateZ(44px) translateY(-7px)}
        }
        @keyframes ts-floatBadge {
          0%,100%{transform:translateZ(64px) translateY(0)}
          50%    {transform:translateZ(64px) translateY(-11px)}
        }
        .ts-chip {
          position:absolute;
          background:rgba(255,255,255,0.96);
          border:1px solid var(--copper-border);
          border-radius:10px; padding:.65rem 1rem;
          backdrop-filter:blur(14px);
          box-shadow:0 8px 28px var(--copper-glow), inset 0 1px 0 rgba(255,255,255,0.9);
          pointer-events:none; z-index:10;
        }
        .ts-chip-top  { top:-1rem; right:-1.75rem; animation:ts-float1 4.2s ease-in-out .3s infinite; }
        .ts-chip-bot  { bottom:16%; left:-1.75rem; animation:ts-float2 4.8s ease-in-out 1.1s infinite; }
        .ts-chip-lbl  { font-family:var(--font-display); font-size:.5rem; font-weight:600; letter-spacing:.14em; text-transform:uppercase; color:var(--text-muted); margin-bottom:3px; }
        .ts-chip-val  { font-family:var(--font-display); font-size:1.05rem; font-weight:800; color:var(--red-bright); line-height:1; text-shadow:0 0 14px var(--red-glow); }

        /* ─── Experience badge ──────────────────────── */
        .ts-exp-badge {
          position:absolute; bottom:-1.6rem; right:-1.6rem;
          background:linear-gradient(135deg,var(--red-bright),var(--amber));
          border-radius:10px; padding:1.2rem 1.5rem; text-align:center;
          box-shadow:0 12px 40px var(--red-glow), 0 4px 16px rgba(0,0,0,0.12);
          z-index:10;
          animation:ts-floatBadge 5s ease-in-out .7s infinite;
        }

        /* ─── SVG animations ─────────────────────────── */
        @keyframes ts-armRock  { 0%,100%{transform:rotate(0deg)} 30%{transform:rotate(-11deg)} 70%{transform:rotate(9deg)} }
        @keyframes ts-lightPls { 0%,100%{opacity:.6} 50%{opacity:1} }
        @keyframes ts-corePls  { 0%,100%{opacity:.85;r:8} 50%{opacity:1;r:10} }
        .ts-robot-arm  { transform-origin:200px 118px; animation:ts-armRock 3.5s ease-in-out infinite; }
        .ts-robot-core { animation:ts-lightPls 1.8s ease-in-out infinite; }

        /* ─── Divider ────────────────────────────────── */
        @keyframes ts-divExpand { from{width:0;opacity:0} to{width:48px;opacity:1} }
        .ts-divider { animation:ts-divExpand .6s ease .3s both; }

        /* ─── Feature 3D cards ───────────────────────── */
        .ts-feat-card {
          display:flex; gap:1rem; align-items:flex-start;
          background:var(--bg-card);
          border:1px solid var(--border);
          border-radius:10px; padding:1.1rem 1.25rem;
          transform-style:preserve-3d;
          transition:transform .35s ease, box-shadow .35s ease, border-color .35s ease;
          box-shadow:0 2px 8px rgba(0,0,0,0.04);
        }
        .ts-feat-card:hover {
          transform:translateY(-5px) translateZ(6px);
          box-shadow:0 14px 40px var(--copper-glow), 0 4px 12px rgba(0,0,0,0.06);
          border-color:var(--copper-border);
        }
        .ts-feat-card:hover .ts-icon-wrap {
          background:var(--red-soft)!important;
          box-shadow:0 0 18px var(--red-glow);
          border-color:var(--red-bright)!important;
        }
        @keyframes ts-spin { to{transform:rotate(360deg)} }
        .ts-icon-wrap { transition:background .3s,box-shadow .3s,border-color .3s; flex-shrink:0; }
        .ts-feat-card:hover .ts-icon-wrap svg { animation:ts-spin .55s ease; }

        /* ─── Responsive ─────────────────────────────── */
        @media (max-width:900px) {
          .ts-tech-grid { grid-template-columns:1fr!important; gap:4rem!important; }
          .ts-chip-top  { right:-.5rem!important; }
          .ts-chip-bot  { left:-.5rem!important; }
          .ts-exp-badge { bottom:-.5rem!important; right:-.5rem!important; }
        }
      `}</style>

      <section
        id="about"
        className="section"
        style={{
          background: 'var(--bg-800)',
          borderTop: '1px solid var(--border-soft)',
          borderBottom: '1px solid var(--border-soft)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Watermark */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%,-50%)',
            whiteSpace: 'nowrap', pointerEvents: 'none', zIndex: 0,
          }}
        >
          <span className="watermark-text">TECHNOLOGY</span>
        </div>

        {/* Background glow blobs */}
        <div aria-hidden="true" style={{ position:'absolute', top:'20%', right:'5%', width:'320px', height:'320px', borderRadius:'50%', background:'radial-gradient(circle,var(--red-soft) 0%,transparent 70%)', pointerEvents:'none', zIndex:0 }}/>
        <div aria-hidden="true" style={{ position:'absolute', bottom:'10%', left:'8%', width:'240px', height:'240px', borderRadius:'50%', background:'radial-gradient(circle,var(--copper-soft) 0%,transparent 70%)', pointerEvents:'none', zIndex:0 }}/>

        <div className="container-allbotix" style={{ position:'relative', zIndex:1 }}>
          <div
            className="ts-tech-grid"
            style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'5rem', alignItems:'center' }}
          >

            {/* ══ LEFT — 3D Visual ══ */}
            <div className="ts-reveal ts-from-left" style={{ position:'relative', paddingBottom:'1.5rem' }}>
              <div ref={cardRef} className="ts-card-3d">

                {/* Decorative rings */}
                <div className="ts-ring-a" aria-hidden="true" />
                <div className="ts-ring-b" aria-hidden="true" />

                {/* Main panel */}
                <div className="ts-visual-panel">
                  <div className="ts-scanline" />

                  <svg
                    viewBox="0 0 400 300"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ width:'100%', height:'100%', display:'block' }}
                  >
                    <defs>
                      <linearGradient id="ts-bg" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%"   stopColor="#f0f0f0"/>
                        <stop offset="100%" stopColor="#e4e4e4"/>
                      </linearGradient>
                      <linearGradient id="ts-metal" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%"   stopColor="#f5f5f5"/>
                        <stop offset="40%"  stopColor="#e0e0e0"/>
                        <stop offset="100%" stopColor="#c8c8c8"/>
                      </linearGradient>
                      <linearGradient id="ts-copper" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%"   stopColor="#f26b3a"/>
                        <stop offset="50%"  stopColor="#d4603a"/>
                        <stop offset="100%" stopColor="#c8581e"/>
                      </linearGradient>
                      <linearGradient id="ts-floor" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%"   stopColor="#d8d8d8" stopOpacity=".9"/>
                        <stop offset="100%" stopColor="#c0c0c0" stopOpacity=".4"/>
                      </linearGradient>
                      <radialGradient id="ts-glow" cx="50%" cy="50%" r="50%">
                        <stop offset="0%"   stopColor="#f26b3a" stopOpacity=".20"/>
                        <stop offset="60%"  stopColor="#d4603a" stopOpacity=".06"/>
                        <stop offset="100%" stopColor="#d4603a" stopOpacity="0"/>
                      </radialGradient>
                      <radialGradient id="ts-eye" cx="35%" cy="30%" r="65%">
                        <stop offset="0%"   stopColor="#ff9060"/>
                        <stop offset="60%"  stopColor="#f26b3a"/>
                        <stop offset="100%" stopColor="#c8501a"/>
                      </radialGradient>
                      <filter id="ts-gf">
                        <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="b"/>
                        <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
                      </filter>
                      <filter id="ts-sg">
                        <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="b"/>
                        <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
                      </filter>
                    </defs>

                    {/* Background */}
                    <rect width="400" height="300" fill="url(#ts-bg)"/>

                    {/* Perspective floor grid */}
                    {[0,1,2,3,4,5,6].map(i => (
                      <line key={`h${i}`}
                        x1={40 + i*16} y1="300" x2={180 + i*5} y2="190"
                        stroke="#d4603a" strokeWidth="0.5" opacity={0.08 + i*0.02}/>
                    ))}
                    {[0,1,2,3,4,5,6,7,8].map(i => (
                      <line key={`v${i}`}
                        x1={0} y1={215 + i*11} x2={400} y2={215 + i*11}
                        stroke="#d4603a" strokeWidth="0.5" opacity={0.04 + i*0.008}/>
                    ))}

                    {/* Glow behind robot */}
                    <ellipse cx="200" cy="200" rx="90" ry="60" fill="url(#ts-glow)"/>

                    {/* ── Worker Left ── */}
                    <ellipse cx="112" cy="262" rx="26" ry="7" fill="#c8c8c8" opacity=".6"/>
                    <rect x="96"  y="174" width="32" height="88" rx="6"  fill="url(#ts-metal)" stroke="#d4603a" strokeWidth=".6"/>
                    <circle cx="112" cy="160" r="15" fill="#d8d8d8" stroke="#c0c0c0" strokeWidth=".8"/>
                    <rect x="84"  y="184" width="14" height="44" rx="5"  fill="url(#ts-metal)"/>
                    <rect x="130" y="184" width="14" height="44" rx="5"  fill="url(#ts-metal)"/>
                    {/* helmet accent */}
                    <path d="M100 163 Q112 148 124 163" fill="#f26b3a" opacity=".75"/>
                    <rect x="104" y="154" width="16" height="8" rx="3"   fill="rgba(20,20,30,.7)"/>
                    <rect x="106" y="156" width="12" height="4" rx="1.5" fill="#f26b3a" opacity=".6">
                      <animate attributeName="opacity" values=".6;1;.6" dur="2.2s" repeatCount="indefinite"/>
                    </rect>

                    {/* ── Worker Right ── */}
                    <ellipse cx="288" cy="262" rx="26" ry="7" fill="#c8c8c8" opacity=".6"/>
                    <rect x="272" y="174" width="32" height="88" rx="6"  fill="url(#ts-metal)" stroke="#d4603a" strokeWidth=".6"/>
                    <circle cx="288" cy="160" r="15" fill="#d8d8d8" stroke="#c0c0c0" strokeWidth=".8"/>
                    <rect x="260" y="184" width="14" height="44" rx="5"  fill="url(#ts-metal)"/>
                    <rect x="306" y="184" width="14" height="44" rx="5"  fill="url(#ts-metal)"/>
                    {/* helmet accent (grey — human) */}
                    <path d="M276 163 Q288 148 300 163" fill="#a0a0a0" opacity=".65"/>
                    <rect x="280" y="154" width="16" height="8" rx="3"   fill="rgba(20,20,30,.6)"/>
                    <rect x="282" y="156" width="12" height="4" rx="1.5" fill="#888" opacity=".5"/>

                    {/* ── Central Robot ── */}
                    {/* Shadow */}
                    <ellipse cx="200" cy="264" rx="34" ry="9" fill="#b0b0b0" opacity=".5"/>
                    {/* Legs */}
                    <rect x="183" y="218" width="16" height="48" rx="5" fill="url(#ts-metal)" stroke="#d4603a" strokeWidth=".5"/>
                    <rect x="201" y="218" width="16" height="48" rx="5" fill="url(#ts-metal)" stroke="#d4603a" strokeWidth=".5"/>
                    {/* Body */}
                    <rect x="172" y="130" width="56" height="92" rx="8"  fill="#111" stroke="#f26b3a" strokeWidth="1.2"/>
                    {/* Body highlight */}
                    <rect x="173" y="130" width="5"  height="86" rx="2.5" fill="rgba(255,255,255,.08)"/>
                    {/* Chest screen */}
                    <rect x="178" y="140" width="44" height="50" rx="5"  fill="rgba(20,20,30,.9)"/>
                    <rect x="178" y="140" width="44" height="50" rx="5"  fill="none" stroke="#f26b3a" strokeWidth=".6" opacity=".5"/>
                    {/* Core orb */}
                    <circle className="ts-robot-core" cx="200" cy="162" r="12" fill="url(#ts-copper)" filter="url(#ts-sg)" opacity=".9"/>
                    <circle cx="200" cy="162" r="6"  fill="#ffa060"/>
                    <circle cx="200" cy="162" r="3"  fill="rgba(255,230,200,1)"/>
                    {/* Data lines */}
                    <line x1="183" y1="182" x2="196" y2="182" stroke="#d4603a" strokeWidth=".6" opacity=".5"/>
                    <line x1="204" y1="182" x2="217" y2="182" stroke="#d4603a" strokeWidth=".6" opacity=".5"/>
                    <line x1="183" y1="188" x2="191" y2="188" stroke="#d4603a" strokeWidth=".5" opacity=".35">
                      <animate attributeName="x2" values="191;208;191" dur="2.5s" repeatCount="indefinite"/>
                    </line>
                    {/* Shoulder joint */}
                    <circle cx="171" cy="140" r="9"  fill="url(#ts-metal)" stroke="#f26b3a" strokeWidth=".8"/>
                    <circle cx="171" cy="140" r="4.5" fill="url(#ts-copper)" opacity=".7"/>
                    <circle cx="229" cy="140" r="9"  fill="url(#ts-metal)" stroke="#f26b3a" strokeWidth=".8"/>
                    <circle cx="229" cy="140" r="4.5" fill="url(#ts-copper)" opacity=".7"/>
                    {/* Arm (animated) */}
                    <g className="ts-robot-arm">
                      <rect x="224" y="133" width="50" height="13" rx="5"  fill="url(#ts-metal)" stroke="#f26b3a" strokeWidth=".7"/>
                      <circle cx="275" cy="139" r="7"  fill="url(#ts-copper)" filter="url(#ts-gf)" opacity=".8"/>
                    </g>
                    {/* Head */}
                    <rect x="178" y="96"  width="44" height="38" rx="8"  fill="#1a1a1a" stroke="#f26b3a" strokeWidth="1"/>
                    <rect x="179" y="96"  width="4"  height="34" rx="2"  fill="rgba(255,255,255,.06)"/>
                    {/* Visor */}
                    <rect x="182" y="104" width="36" height="18" rx="4"  fill="rgba(10,10,20,.9)"/>
                    <rect x="182" y="104" width="36" height="18" rx="4"  fill="none" stroke="#f26b3a" strokeWidth=".5" opacity=".6"/>
                    {/* Eyes */}
                    <rect x="185" y="108" width="12" height="7"  rx="2.5" fill="url(#ts-eye)" filter="url(#ts-sg)"/>
                    <rect x="203" y="108" width="12" height="7"  rx="2.5" fill="url(#ts-eye)" filter="url(#ts-sg)"/>
                    <rect x="187" y="109" width="4"  height="3"  rx="1"  fill="rgba(255,255,255,.5)"/>
                    <rect x="205" y="109" width="4"  height="3"  rx="1"  fill="rgba(255,255,255,.5)"/>
                    {/* Antenna */}
                    <line x1="200" y1="96" x2="200" y2="84"  stroke="url(#ts-copper)" strokeWidth="1.5"/>
                    <circle cx="200" cy="82" r="4.5" fill="#f26b3a" filter="url(#ts-sg)">
                      <animate attributeName="opacity" values=".7;1;.7" dur="1.8s" repeatCount="indefinite"/>
                    </circle>
                    <circle cx="200" cy="82" r="2"   fill="#ffa060"/>

                    {/* Foreground radial overlay */}
                    <rect width="400" height="300" fill="url(#ts-glow)" opacity=".5"/>
                  </svg>

                  {/* Overlay label */}
                  <div className="ts-overlay-label">
                    <p style={{ fontFamily:'var(--font-display)', fontSize:'.58rem', color:'var(--red-bright)', letterSpacing:'.15em', lineHeight:1 }}>
                      INDUSTRIAL AUTOMATION
                    </p>
                  </div>
                </div>

                {/* Floating chip — top right */}
                <div className="ts-chip ts-chip-top">
                  <p className="ts-chip-lbl">Precision</p>
                  <p className="ts-chip-val">99.8%</p>
                </div>

                {/* Floating chip — bottom left */}
                <div className="ts-chip ts-chip-bot">
                  <p className="ts-chip-lbl">Uptime</p>
                  <p className="ts-chip-val">24 / 7</p>
                </div>

                {/* Experience badge */}
                <div className="ts-exp-badge">
                  <p style={{ fontFamily:'var(--font-display)', fontSize:'2rem', fontWeight:900, color:'#fff', lineHeight:1 }}>15+</p>
                  <p style={{ fontFamily:'var(--font-light)', fontSize:'.7rem', color:'rgba(255,255,255,.85)', marginTop:'4px', letterSpacing:'.08em' }}>
                    Years<br/>Experience
                  </p>
                </div>
              </div>
            </div>

            {/* ══ RIGHT — Content ══ */}
            <div className="ts-reveal ts-from-right" style={{ paddingBottom:'1.5rem' }}>

              <div className="section-tag ts-reveal ts-d1">About Our Technology</div>

              <h2 className="section-title ts-reveal ts-d2" style={{ marginBottom:'1rem' }}>
                Our Technology Help the <span>Industry.</span>
              </h2>

              <div className="red-divider ts-divider" style={{ marginBottom:'1.25rem' }} />

              <p className="ts-reveal ts-d3" style={{ marginBottom:'2rem', lineHeight:1.9, fontSize:'.95rem' }}>
                A new path forward for tomorrow's manufacturing. We deliver
                intelligent robotic systems that transform how industries operate —
                faster, smarter, and more reliably than ever before.
              </p>

              <div style={{ display:'flex', flexDirection:'column', gap:'1rem', marginBottom:'2.5rem' }}>
                {features.map((f, i) => (
                  <div
                    key={f.title}
                    className="ts-feat-card ts-reveal"
                    style={{ transitionDelay:`${0.1 + i * 0.14}s` }}
                  >
                    <div className="icon-circle ts-icon-wrap">
                      {f.icon}
                    </div>
                    <div>
                      <h4 style={{ fontFamily:'var(--font-display)', fontSize:'.85rem', fontWeight:700, color:'var(--text-primary)', marginBottom:'4px', letterSpacing:'.05em' }}>
                        {f.title}
                      </h4>
                      <p style={{ fontSize:'.87rem', lineHeight:1.75, color:'var(--text-secondary)', margin:0 }}>
                        {f.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="ts-reveal ts-d5">
                <Link href="/solutions" className="btn-primary">
                  Explore Solution
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"/>
                    <polyline points="12 5 19 12 12 19"/>
                  </svg>
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  )
}
