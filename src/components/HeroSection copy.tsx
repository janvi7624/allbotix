'use client'

import Link from 'next/link'
import { useRef, useEffect } from 'react'

const stats = [
  { value: '21K+', label: 'Projects Done' },
  { value: '17K+', label: 'Happy Clients' },
  { value: '37K+', label: 'Parts Delivered' },
  { value: '4.7',  label: 'Average Rating' },
]

export default function HeroSection() {
  const robotRef     = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const rafRef       = useRef<number | null>(null)
  const current      = useRef({ x: 0, y: 0 })
  const target       = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const section = containerRef.current?.closest('section') as HTMLElement | null

    const onMove = (e: MouseEvent) => {
      const s = containerRef.current?.closest('section') as HTMLElement | null
      if (!s) return
      const rect = s.getBoundingClientRect()
      const nx = ((e.clientX - rect.left)  / rect.width)  * 2 - 1
      const ny = ((e.clientY - rect.top)   / rect.height) * 2 - 1
      target.current = {
        x: ny * -35,
        y: nx *  55,
      }
    }

    const onLeave = () => { target.current = { x: 0, y: 0 } }

    const tick = () => {
      const lerp = 0.06
      current.current.x += (target.current.x - current.current.x) * lerp
      current.current.y += (target.current.y - current.current.y) * lerp

      if (robotRef.current) {
        robotRef.current.style.transform =
          `perspective(400px) rotateX(${current.current.x}deg) rotateY(${current.current.y}deg)`
      }
      rafRef.current = requestAnimationFrame(tick)
    }

    section?.addEventListener('mousemove', onMove)
    section?.addEventListener('mouseleave', onLeave)
    rafRef.current = requestAnimationFrame(tick)

    return () => {
      section?.removeEventListener('mousemove', onMove)
      section?.removeEventListener('mouseleave', onLeave)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <section
      id="home"
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        overflow: 'hidden',
        paddingTop: '7rem',
        paddingBottom: '4rem',
        background: `
          radial-gradient(ellipse 80% 60% at 60% 50%, var(--red-soft) 0%, transparent 70%),
          radial-gradient(ellipse 50% 80% at 10% 50%, var(--red-soft) 0%, transparent 60%),
          var(--bg-900)
        `,
      }}
    >
      <style>{`
        @keyframes slideInLeft {
          from { opacity:0; transform:translateX(-40px); }
          to   { opacity:1; transform:translateX(0); }
        }
        @keyframes slideInRight {
          from { opacity:0; transform:translateX(60px); }
          to   { opacity:1; transform:translateX(0); }
        }
        @keyframes fadeInUp {
          from { opacity:0; transform:translateY(20px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes glitchText {
          0%   { clip-path:inset(0 0 98% 0);  transform:translateX(-4px); }
          10%  { clip-path:inset(30% 0 50% 0); transform:translateX(4px); }
          20%  { clip-path:inset(60% 0 20% 0); transform:translateX(-2px); }
          30%  { clip-path:inset(80% 0 5% 0);  transform:translateX(2px); }
          40%  { clip-path:inset(0 0 0 0);     transform:translateX(0); }
          100% { clip-path:inset(0 0 0 0);     transform:translateX(0); }
        }
        @keyframes badgePop {
          0%   { opacity:0; transform:scale(0.7) translateY(10px); }
          70%  { transform:scale(1.08) translateY(-2px); }
          100% { opacity:1; transform:scale(1) translateY(0); }
        }
        @keyframes robotFloat {
          0%,100% { transform:translateY(0px); }
          50%      { transform:translateY(-14px); }
        }
        @keyframes eyePulse {
          0%,100% { opacity:0.9; filter:drop-shadow(0 0 4px var(--red)); }
          50%      { opacity:0.5; filter:drop-shadow(0 0 14px var(--copper-light)); }
        }
        @keyframes chestPulse    { 0%,100%{opacity:0.8;} 50%{opacity:1;} }
        @keyframes chestPulseDim { 0%,100%{opacity:0.35;} 50%{opacity:0.75;} }
        @keyframes antennaGlow {
          0%,100% { filter:drop-shadow(0 0 3px var(--red)); opacity:1; }
          50%      { filter:drop-shadow(0 0 12px var(--copper-light)); opacity:0.6; }
        }
        @keyframes armSwing {
          0%,100% { transform:rotate(0deg); }
          30%      { transform:rotate(5deg); }
          70%      { transform:rotate(-5deg); }
        }
        @keyframes scanlineRobot {
          0%   { transform:translateY(-100%); opacity:0.5; }
          100% { transform:translateY(500%);  opacity:0; }
        }
        @keyframes ringRotate {
          from { transform:translate(-50%,-50%) rotate(0deg); }
          to   { transform:translate(-50%,-50%) rotate(360deg); }
        }
        @keyframes ringRotateReverse {
          from { transform:translate(-50%,-50%) rotate(0deg); }
          to   { transform:translate(-50%,-50%) rotate(-360deg); }
        }
        @keyframes cardFloat {
          0%,100% { transform:translateZ(60px) translateY(0px); }
          50%      { transform:translateZ(60px) translateY(-7px); }
        }
        @keyframes statCountUp {
          from { opacity:0; transform:translateY(12px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes hintPing {
          0%   { opacity:0.7; transform:translateX(-50%) scale(1); }
          100% { opacity:0;   transform:translateX(-50%) scale(2.2); }
        }

        .hero-tag      { animation:fadeInUp   0.6s ease 0.1s  both; }
        .hero-h1-line1 { animation:slideInLeft 0.7s ease 0.2s  both; }
        .hero-h1-line2 { animation:slideInLeft 0.7s ease 0.35s both; }
        .hero-h1-line3 { animation:slideInLeft 0.7s ease 0.5s  both; }
        .hero-sub      { animation:fadeInUp   0.7s ease 0.6s  both; }
        .hero-cta      { animation:fadeInUp   0.7s ease 0.75s both; }
        .hero-badges   { animation:fadeInUp   0.7s ease 0.9s  both; }
        .badge-item:nth-child(1) { animation:badgePop 0.5s ease 1.0s  both; }
        .badge-item:nth-child(2) { animation:badgePop 0.5s ease 1.15s both; }
        .badge-item:nth-child(3) { animation:badgePop 0.5s ease 1.3s  both; }

        .robot-col-entry { animation:slideInRight 0.9s ease 0.3s both; }

        .robot-tilt {
          transform-style: preserve-3d;
          will-change: transform;
        }
        .robot-float {
          animation: robotFloat 5s ease-in-out infinite;
          transform-style: preserve-3d;
        }

        .robot-eye-l   { animation:eyePulse      2.2s ease-in-out          infinite; }
        .robot-eye-r   { animation:eyePulse      2.2s ease-in-out 0.4s     infinite; }
        .robot-light-l { animation:chestPulse    1.8s ease-in-out          infinite; }
        .robot-light-r { animation:chestPulse    1.8s ease-in-out 0.3s     infinite; }
        .robot-light-m { animation:chestPulseDim 1.8s ease-in-out 0.6s     infinite; }
        .robot-antenna { animation:antennaGlow   2s   ease-in-out          infinite; }
        .robot-arm-l   { transform-origin:30px 115px;  animation:armSwing 4s ease-in-out       infinite; }
        .robot-arm-r   { transform-origin:170px 115px; animation:armSwing 4s ease-in-out 0.5s  infinite reverse; }
        .robot-scanline{ animation:scanlineRobot 3.2s linear infinite; }

        .ring-outer { animation:ringRotate        18s linear infinite; }
        .ring-inner { animation:ringRotateReverse 12s linear infinite; }

        .info-card-1 {
          animation:cardFloat 4s ease-in-out 0.5s infinite, fadeInUp 0.7s ease 0.8s both;
          transform-style:preserve-3d;
        }
        .info-card-2 {
          animation:cardFloat 4s ease-in-out 1.2s infinite, fadeInUp 0.7s ease 1.0s both;
          transform-style:preserve-3d;
        }

        .hint-arrow { opacity:0; animation:fadeInUp 0.5s ease 1.8s both; }
        .stat-item:nth-child(1){animation:statCountUp 0.6s ease 1.1s  both;}
        .stat-item:nth-child(2){animation:statCountUp 0.6s ease 1.25s both;}
        .stat-item:nth-child(3){animation:statCountUp 0.6s ease 1.4s  both;}
        .stat-item:nth-child(4){animation:statCountUp 0.6s ease 1.55s both;}

        @media (max-width:768px){
          .hero-grid  { grid-template-columns:1fr !important; text-align:center; }
          .stats-grid { grid-template-columns:repeat(2,1fr) !important; }
          .robot-col-entry { min-height: 460px !important; }
        }
        @media (max-width:480px){
          .stats-grid { grid-template-columns:1fr 1fr !important; }
        }
      `}</style>

      {/* Decorative line */}
      <div aria-hidden="true" style={{ position:'absolute', top:0, right:'38%', width:'1px', height:'100%', background:'linear-gradient(to bottom,transparent,var(--border) 30%,var(--border) 70%,transparent)' }}/>
      {/* Corner brackets */}
      <div aria-hidden="true" style={{ position:'absolute', top:'6rem', left:'1.5rem', width:'40px', height:'40px', borderTop:'1px solid var(--red-bright)', borderLeft:'1px solid var(--red-bright)', opacity:0.5 }}/>
      <div aria-hidden="true" style={{ position:'absolute', bottom:'3rem', right:'1.5rem', width:'40px', height:'40px', borderBottom:'1px solid var(--red-bright)', borderRight:'1px solid var(--red-bright)', opacity:0.5 }}/>

      <div ref={containerRef} className="container-allbotix" style={{ position:'relative', zIndex:2 }}>
        <div
          className="hero-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            alignItems: 'center',   /* ← vertically centers both columns */
            gap: '3rem',
            minHeight: '70vh',
          }}
        >

          {/* ── Left — Text ── */}
          <div>
            <div className="section-tag hero-tag" style={{ marginBottom:'1.5rem' }}>Robotics Technology Services</div>
            <h1 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(2.2rem,5vw,3.8rem)', fontWeight:900, lineHeight:1.1, color:'var(--text-primary)', marginBottom:'1.5rem', letterSpacing:'0.02em' }}>
              <span className="hero-h1-line1" style={{ display:'block' }}>One team.</span>
              <span className="hero-h1-line2" style={{ display:'block', color:'var(--red-bright)', textShadow:'0 0 40px var(--copper-glow)', position:'relative' }}>
                One robot.
                <span aria-hidden="true" style={{ position:'absolute', inset:0, color:'var(--red-bright)', animation:'glitchText 6s steps(1) 2s infinite', opacity:0.5, pointerEvents:'none' }}>One robot.</span>
              </span>
              <span className="hero-h1-line3" style={{ display:'block' }}>Limitless<br/>possibilities.</span>
            </h1>
            <p className="hero-sub" style={{ fontSize:'1rem', color:'var(--text-secondary)', maxWidth:'440px', lineHeight:1.9, marginBottom:'2.5rem' }}>
              Empowering tomorrow's industries with cutting-edge robotic solutions by Allbotix. Smart automation, precision engineering, and limitless innovation.
            </p>
            <div className="hero-cta" style={{ display:'flex', gap:'1rem', flexWrap:'wrap' }}>
              <Link href="/solutions" className="btn-primary">
                Discover More
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </Link>
            </div>
            <div className="hero-badges" style={{ display:'flex', alignItems:'center', gap:'1.5rem', marginTop:'2.5rem', flexWrap:'wrap' }}>
              {['Professional team','24/7 Premium Support'].map((badge) => (
                <div key={badge} className="badge-item" style={{ display:'flex', alignItems:'center', gap:'6px', fontFamily:'var(--font-light)', fontSize:'0.78rem', color:'var(--text-secondary)' }}>
                  <span style={{ width:'6px', height:'6px', borderRadius:'50%', background:'var(--red-bright)', flexShrink:0, boxShadow:'0 0 6px var(--red-glow)', display:'block' }}/>
                  {badge}
                </div>
              ))}
            </div>
          </div>

          {/* ── Right — 3D Robot ── */}
          <div
            className="robot-col-entry"
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',      /* ← vertically center the robot in its column */
              justifyContent: 'center',
              /* Fixed height so the column doesn't collapse or overflow */
              height: '560px',
            }}
          >

            {/* Rings — stay in place, not inside the tilt wrapper */}
            <div className="ring-outer" aria-hidden="true" style={{ position:'absolute', width:'440px', height:'440px', borderRadius:'50%', border:'1px dashed var(--border)', top:'50%', left:'50%' }}/>
            <div className="ring-inner" aria-hidden="true" style={{ position:'absolute', width:'330px', height:'330px', borderRadius:'50%', border:'1px solid var(--border)', top:'50%', left:'50%' }}/>
            {/* Glow */}
            <div aria-hidden="true" style={{ position:'absolute', width:'280px', height:'280px', borderRadius:'50%', background:'radial-gradient(circle,var(--red-soft) 0%,transparent 70%)', top:'50%', left:'50%', transform:'translate(-50%,-50%)' }}/>

            {/* ── 3D tilt wrapper — JS sets perspective(400px) rotateX/Y ── */}
            <div
              ref={robotRef}
              className="robot-tilt"
              style={{
                position: 'relative',
                zIndex: 2,
                /* Remove any margin/top offset — centering is handled by flex parent */
              }}
            >
              {/* Float animation child */}
              <div
                className="robot-float"
                style={{
                  width: '300px',
                  height: '400px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transformStyle: 'preserve-3d',
                  marginTop: '400px'
                  /* No extra margin — robot sits naturally in the 300×400 box */
                }}
              >

                {/* Ground shadow */}
                <div aria-hidden="true" style={{ position:'absolute', bottom:'-22px', left:'50%', transform:'translateX(-50%) translateZ(-80px)', width:'170px', height:'22px', borderRadius:'50%', background:'radial-gradient(ellipse,var(--copper-glow) 0%,transparent 70%)', filter:'blur(7px)' }}/>

                {/* ── Robot SVG ── */}
                <svg
                  viewBox="0 0 200 290"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{ width:'100%', height:'100%', filter:'drop-shadow(0 0 32px var(--red-glow))', overflow:'visible' }}
                  overflow="visible"
                >
                  <rect className="robot-scanline" x="38" y="0" width="124" height="9" fill="var(--red-soft)"/>

                  {/* HEAD */}
                  <rect x="140" y="22" width="14" height="66" rx="6" fill="var(--bg-700)" stroke="var(--red)" strokeWidth="0.8" strokeOpacity="0.6"/>
                  <rect x="142" y="35" width="8" height="18" rx="3" fill="var(--red)" opacity="0.4"/>
                  <rect x="46" y="22" width="14" height="66" rx="6" fill="var(--bg-700)" stroke="var(--red)" strokeWidth="0.8" strokeOpacity="0.6"/>
                  <rect x="60" y="20" width="80" height="70" rx="12" fill="var(--bg-600)" stroke="var(--red)" strokeWidth="1.4"/>
                  <rect x="62" y="20" width="76" height="3" rx="2" fill="var(--red)" opacity="0.15"/>
                  <rect className="robot-eye-l" x="74"  y="37" width="20" height="13" rx="3" fill="var(--red)"/>
                  <rect className="robot-eye-r" x="106" y="37" width="20" height="13" rx="3" fill="var(--red)"/>
                  <rect x="78"  y="40" width="12" height="7" rx="2" fill="var(--copper-pale)" opacity="0.65"/>
                  <rect x="110" y="40" width="12" height="7" rx="2" fill="var(--copper-pale)" opacity="0.65"/>
                  <rect x="78" y="64" width="44" height="6" rx="2" fill="var(--red)" opacity="0.6">
                    <animate attributeName="width" values="44;38;44" dur="3s" repeatCount="indefinite"/>
                    <animate attributeName="x" values="78;81;78" dur="3s" repeatCount="indefinite"/>
                  </rect>
                  <line x1="100" y1="20" x2="100" y2="4" stroke="var(--red)" strokeWidth="1.8"/>
                  <circle className="robot-antenna" cx="100" cy="3" r="4" fill="var(--red)"/>
                  <line x1="100" y1="10" x2="110" y2="6" stroke="var(--red)" strokeWidth="0.8" strokeOpacity="0.5"/>
                  <line x1="100" y1="10" x2="90"  y2="6" stroke="var(--red)" strokeWidth="0.8" strokeOpacity="0.5"/>

                  {/* NECK */}
                  <rect x="86" y="90" width="28" height="18" rx="5" fill="var(--bg-700)" stroke="var(--red)" strokeWidth="0.9" strokeOpacity="0.5"/>
                  <circle cx="91"  cy="99" r="2" fill="var(--red)" opacity="0.4"/>
                  <circle cx="109" cy="99" r="2" fill="var(--red)" opacity="0.4"/>

                  {/* BODY */}
                  <rect x="43"  y="108" width="14" height="98" rx="6" fill="var(--bg-700)" stroke="var(--red)" strokeWidth="0.8" strokeOpacity="0.5"/>
                  <rect x="143" y="108" width="14" height="98" rx="6" fill="var(--bg-700)" stroke="var(--red)" strokeWidth="0.8" strokeOpacity="0.5"/>
                  <rect x="47" y="108" width="106" height="100" rx="10" fill="var(--bg-card)" stroke="var(--red)" strokeWidth="1.3"/>
                  <rect x="64" y="120" width="72" height="54" rx="6" fill="var(--bg-600)" stroke="var(--red)" strokeWidth="0.9" strokeOpacity="0.45"/>
                  <circle className="robot-light-l" cx="82"  cy="138" r="8" fill="var(--red)"/>
                  <circle className="robot-light-m" cx="100" cy="138" r="5" fill="var(--red)"/>
                  <circle className="robot-light-r" cx="118" cy="138" r="8" fill="var(--red)"/>
                  <circle cx="82"  cy="138" r="12" fill="var(--red)" opacity="0.08"/>
                  <circle cx="118" cy="138" r="12" fill="var(--red)" opacity="0.08"/>
                  <line x1="68" y1="156" x2="132" y2="156" stroke="var(--red)" strokeWidth="0.7" strokeOpacity="0.4"/>
                  <line x1="68" y1="164" x2="110" y2="164" stroke="var(--red)" strokeWidth="0.7" strokeOpacity="0.3">
                    <animate attributeName="x2" values="110;128;110" dur="2.5s" repeatCount="indefinite"/>
                  </line>
                  <line x1="68" y1="172" x2="95" y2="172" stroke="var(--red)" strokeWidth="0.5" strokeOpacity="0.2">
                    <animate attributeName="x2" values="95;115;95" dur="3.2s" repeatCount="indefinite"/>
                  </line>

                  {/* ARMS */}
                  <g className="robot-arm-l">
                    <rect x="14" y="112" width="12" height="76" rx="5" fill="var(--bg-700)" stroke="var(--red)" strokeWidth="0.7" strokeOpacity="0.5"/>
                    <rect x="20" y="112" width="22" height="80" rx="8" fill="var(--bg-card)" stroke="var(--red)" strokeWidth="1"/>
                    <rect x="23" y="122" width="16" height="32" rx="4" fill="var(--bg-600)"/>
                    <circle cx="31" cy="158" r="6" fill="var(--bg-600)" stroke="var(--red)" strokeWidth="0.8" strokeOpacity="0.5"/>
                    <rect x="18" y="188" width="24" height="9" rx="4" fill="var(--bg-600)" stroke="var(--red)" strokeWidth="0.7" strokeOpacity="0.5"/>
                  </g>
                  <g className="robot-arm-r">
                    <rect x="174" y="112" width="12" height="76" rx="5" fill="var(--bg-700)" stroke="var(--red)" strokeWidth="0.7" strokeOpacity="0.5"/>
                    <rect x="158" y="112" width="22" height="80" rx="8" fill="var(--bg-card)" stroke="var(--red)" strokeWidth="1"/>
                    <rect x="161" y="122" width="16" height="32" rx="4" fill="var(--bg-600)"/>
                    <circle cx="169" cy="158" r="6" fill="var(--bg-600)" stroke="var(--red)" strokeWidth="0.8" strokeOpacity="0.5"/>
                    <rect x="158" y="188" width="24" height="9" rx="4" fill="var(--bg-600)" stroke="var(--red)" strokeWidth="0.7" strokeOpacity="0.5"/>
                  </g>

                  {/* LEGS */}
                  <rect x="66" y="208" width="68" height="10" rx="4" fill="var(--bg-600)" stroke="var(--red)" strokeWidth="0.7" strokeOpacity="0.35"/>
                  <rect x="54" y="218" width="10" height="66" rx="5" fill="var(--bg-700)" stroke="var(--red)" strokeWidth="0.7" strokeOpacity="0.4"/>
                  <rect x="58" y="218" width="34" height="66" rx="8" fill="var(--bg-card)" stroke="var(--red)" strokeWidth="1"/>
                  <rect x="60" y="236" width="30" height="7" rx="3" fill="var(--bg-600)" stroke="var(--red)" strokeWidth="0.6" strokeOpacity="0.4"/>
                  <rect x="136" y="218" width="10" height="66" rx="5" fill="var(--bg-700)" stroke="var(--red)" strokeWidth="0.7" strokeOpacity="0.4"/>
                  <rect x="108" y="218" width="34" height="66" rx="8" fill="var(--bg-card)" stroke="var(--red)" strokeWidth="1"/>
                  <rect x="110" y="236" width="30" height="7" rx="3" fill="var(--bg-600)" stroke="var(--red)" strokeWidth="0.6" strokeOpacity="0.4"/>
                  <rect x="48"  y="272" width="50" height="16" rx="6" fill="var(--bg-600)" stroke="var(--red)" strokeWidth="0.9" strokeOpacity="0.5"/>
                  <rect x="102" y="272" width="50" height="16" rx="6" fill="var(--bg-600)" stroke="var(--red)" strokeWidth="0.9" strokeOpacity="0.5"/>
                  <rect x="48"  y="284" width="50" height="4" rx="2" fill="var(--red)" opacity="0.12"/>
                  <rect x="102" y="284" width="50" height="4" rx="2" fill="var(--red)" opacity="0.12"/>
                </svg>

                {/* Floating info cards */}
                <div
                  className="info-card-1"
                  style={{
                    position: 'absolute',
                    top: '6%',
                    right: '-12%',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border)',
                    borderRadius: '6px',
                    padding: '0.75rem 1rem',
                    backdropFilter: 'blur(12px)',
                    zIndex: 10,
                  }}
                >
                  <p style={{ fontSize:'0.65rem', color:'var(--text-muted)', fontFamily:'var(--font-display)', letterSpacing:'0.1em' }}>EFFICIENCY</p>
                  <p style={{ fontSize:'1.1rem', fontFamily:'var(--font-display)', fontWeight:700, color:'var(--red-bright)' }}>99.8%</p>
                </div>
                <div
                  className="info-card-2"
                  style={{
                    position: 'absolute',
                    bottom: '6%',
                    left: '-12%',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border)',
                    borderRadius: '6px',
                    padding: '0.75rem 1rem',
                    backdropFilter: 'blur(12px)',
                    zIndex: 10,
                  }}
                >
                  <p style={{ fontSize:'0.65rem', color:'var(--text-muted)', fontFamily:'var(--font-display)', letterSpacing:'0.1em' }}>UPTIME</p>
                  <p style={{ fontSize:'1.1rem', fontFamily:'var(--font-display)', fontWeight:700, color:'var(--red-bright)' }}>24 / 7</p>
                </div>

              </div>
            </div>

            {/* Mouse hint */}
            <div className="hint-arrow" style={{ position:'absolute', bottom:'0.5rem', left:'50%', transform:'translateX(-50%)', display:'flex', alignItems:'center', gap:'8px', opacity:0.45 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--red-bright)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
              <span style={{ fontFamily:'var(--font-display)', fontSize:'0.55rem', letterSpacing:'0.15em', color:'var(--red-bright)', textTransform:'uppercase' }}>move mouse</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--red-bright)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}