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
  const sectionRef   = useRef<HTMLElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef    = useRef<HTMLCanvasElement>(null)
  const rafRef       = useRef<number | null>(null)
  const bgRafRef     = useRef<number | null>(null)
  const current      = useRef({ x: 0, y: 0 })
  const target       = useRef({ x: 0, y: 0 })

  /* ─── Background 3D particles canvas ─── */
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    let W = canvas.width  = canvas.offsetWidth
    let H = canvas.height = canvas.offsetHeight

    const resize = () => {
      W = canvas.width  = canvas.offsetWidth
      H = canvas.height = canvas.offsetHeight
    }
    window.addEventListener('resize', resize)

    interface Particle {
      x: number; y: number; z: number
      vx: number; vy: number; vz: number
      r: number; color: string
    }

    const COLORS = [
      'rgba(242,107,58,',   // red-bright
      'rgba(212,96,58,',    // copper
      'rgba(242,162,122,',  // copper-pale
      'rgba(200,88,30,',    // amber
    ]

    const particles: Particle[] = Array.from({ length: 90 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      z: Math.random(),
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      vz: (Math.random() - 0.5) * 0.002,
      r: Math.random() * 2.5 + 0.5,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    }))

    const gridLines: { x1:number; y1:number; x2:number; y2:number; alpha:number }[] = []
    // Perspective grid lines
    const vanishX = W * 0.62
    const vanishY = H * 0.55
    for (let i = 0; i <= 12; i++) {
      const t = i / 12
      gridLines.push({ x1: vanishX, y1: vanishY, x2: t * W, y2: H, alpha: 0.03 + t * 0.01 })
      gridLines.push({ x1: vanishX, y1: vanishY, x2: t * W, y2: 0, alpha: 0.02 })
    }

    let frame = 0
    const draw = () => {
      ctx.clearRect(0, 0, W, H)

      // Layered radial gradients for depth
      const g1 = ctx.createRadialGradient(W*0.62, H*0.5, 0, W*0.62, H*0.5, W*0.65)
      g1.addColorStop(0, 'rgba(224,90,42,0.07)')
      g1.addColorStop(0.5,'rgba(212,96,58,0.03)')
      g1.addColorStop(1, 'transparent')
      ctx.fillStyle = g1
      ctx.fillRect(0,0,W,H)

      const g2 = ctx.createRadialGradient(W*0.1, H*0.5, 0, W*0.1, H*0.5, W*0.5)
      g2.addColorStop(0, 'rgba(224,90,42,0.05)')
      g2.addColorStop(1, 'transparent')
      ctx.fillStyle = g2
      ctx.fillRect(0,0,W,H)

      // Perspective grid
      gridLines.forEach(l => {
        ctx.beginPath()
        ctx.moveTo(l.x1, l.y1)
        ctx.lineTo(l.x2, l.y2)
        ctx.strokeStyle = `rgba(224,90,42,${l.alpha})`
        ctx.lineWidth = 0.5
        ctx.stroke()
      })

      // Horizontal grid lines fading
      for (let y = H; y > vanishY; y -= (y - vanishY) * 0.18) {
        const alpha = Math.min(0.06, ((H - y) / (H - vanishY)) * 0.06)
        ctx.beginPath()
        ctx.moveTo(0, y); ctx.lineTo(W, y)
        ctx.strokeStyle = `rgba(224,90,42,${alpha})`
        ctx.lineWidth = 0.5
        ctx.stroke()
      }

      // Particles
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy; p.z += p.vz
        p.z = Math.max(0.1, Math.min(1, p.z))
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0

        const size = p.r * p.z
        const alpha = p.z * 0.7
        ctx.beginPath()
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2)
        ctx.fillStyle = `${p.color}${alpha})`
        ctx.fill()

        // Glow for larger particles
        if (p.z > 0.7 && p.r > 1.5) {
          ctx.beginPath()
          ctx.arc(p.x, p.y, size * 3, 0, Math.PI * 2)
          ctx.fillStyle = `${p.color}${alpha * 0.12})`
          ctx.fill()
        }
      })

      // Connect nearby particles with lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx*dx + dy*dy)
          if (dist < 100) {
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = `rgba(212,96,58,${(1 - dist/100) * 0.08})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      }

      frame++
      bgRafRef.current = requestAnimationFrame(draw)
    }
    bgRafRef.current = requestAnimationFrame(draw)
    return () => {
      window.removeEventListener('resize', resize)
      if (bgRafRef.current) cancelAnimationFrame(bgRafRef.current)
    }
  }, [])

  /* ─── Mouse-tilt robot ─── */
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const onMove = (e: MouseEvent) => {
      const rect = section.getBoundingClientRect()
      const nx = ((e.clientX - rect.left)  / rect.width)  * 2 - 1
      const ny = ((e.clientY - rect.top)   / rect.height) * 2 - 1
      target.current = { x: ny * -30, y: nx * 45 }
    }
    const onLeave = () => { target.current = { x: 0, y: 0 } }

    const tick = () => {
      const lerp = 0.06
      current.current.x += (target.current.x - current.current.x) * lerp
      current.current.y += (target.current.y - current.current.y) * lerp
      if (robotRef.current) {
        robotRef.current.style.transform =
          `perspective(700px) rotateX(${current.current.x}deg) rotateY(${current.current.y}deg)`
      }
      rafRef.current = requestAnimationFrame(tick)
    }

    section.addEventListener('mousemove', onMove)
    section.addEventListener('mouseleave', onLeave)
    rafRef.current = requestAnimationFrame(tick)

    return () => {
      section.removeEventListener('mousemove', onMove)
      section.removeEventListener('mouseleave', onLeave)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <section
      id="home"
      ref={sectionRef}
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        overflow: 'hidden',
        paddingTop: '7rem',
        paddingBottom: '4rem',
        background: 'var(--bg-900)',
      }}
    >
      <style>{`
        /* ── Canvas BG ── */
        .hero-canvas {
          position:absolute; inset:0; width:100%; height:100%;
          pointer-events:none; z-index:0;
        }

        /* ── Animations ── */
        @keyframes slideInLeft  { from{opacity:0;transform:translateX(-40px)} to{opacity:1;transform:translateX(0)} }
        @keyframes slideInRight { from{opacity:0;transform:translateX(60px)}  to{opacity:1;transform:translateX(0)} }
        @keyframes fadeInUp     { from{opacity:0;transform:translateY(20px)}  to{opacity:1;transform:translateY(0)} }
        @keyframes glitchText {
          0%  {clip-path:inset(0 0 98% 0); transform:translateX(-4px)}
          10% {clip-path:inset(30% 0 50% 0);transform:translateX(4px)}
          20% {clip-path:inset(60% 0 20% 0);transform:translateX(-2px)}
          30% {clip-path:inset(80% 0 5% 0); transform:translateX(2px)}
          40% {clip-path:inset(0 0 0 0);    transform:translateX(0)}
          100%{clip-path:inset(0 0 0 0);    transform:translateX(0)}
        }
        @keyframes badgePop {
          0%  {opacity:0;transform:scale(0.7) translateY(10px)}
          70% {transform:scale(1.08) translateY(-2px)}
          100%{opacity:1;transform:scale(1) translateY(0)}
        }
        @keyframes robotFloat {
          0%,100%{ top: 0px; }
          50%    { top: -16px; }
        }
        @keyframes eyeGlow {
          0%,100%{opacity:1;  filter:drop-shadow(0 0 5px #f26b3a) drop-shadow(0 0 14px #f26b3a)}
          50%    {opacity:0.6;filter:drop-shadow(0 0 10px #e87d52) drop-shadow(0 0 30px #e87d52)}
        }
        @keyframes chestPulse    {0%,100%{opacity:0.9} 50%{opacity:1}}
        @keyframes chestPulseDim {0%,100%{opacity:0.4} 50%{opacity:0.8}}
        @keyframes antennaGlow   {0%,100%{filter:drop-shadow(0 0 4px #f26b3a);opacity:1} 50%{filter:drop-shadow(0 0 18px #e87d52);opacity:0.7}}
        @keyframes armSwing      {0%,100%{transform:rotate(0deg)} 30%{transform:rotate(5deg)} 70%{transform:rotate(-5deg)}}
        @keyframes scanlineRobot {0%{transform:translateY(-20%);opacity:0.6} 100%{transform:translateY(120%);opacity:0}}
        @keyframes ringRotate    {from{transform:translate(-50%,-50%) rotate(0deg)} to{transform:translate(-50%,-50%) rotate(360deg)}}
        @keyframes ringRotateRev {from{transform:translate(-50%,-50%) rotate(0deg)} to{transform:translate(-50%,-50%) rotate(-360deg)}}
        @keyframes cardFloat {
          0%,100%{transform:translateZ(60px) translateY(0px)}
          50%    {transform:translateZ(60px) translateY(-8px)}
        }
        @keyframes hintPing   {0%{opacity:0.7;transform:translateX(-50%) scale(1)} 100%{opacity:0;transform:translateX(-50%) scale(2.2)}}
        @keyframes statCountUp{from{opacity:0;transform:translateY(12px)}           to{opacity:1;transform:translateY(0)}}
        @keyframes coreRotate {from{transform:rotate(0deg)} to{transform:rotate(360deg)}}
        @keyframes coreRevRot {from{transform:rotate(0deg)} to{transform:rotate(-360deg)}}
        @keyframes shimmerLine{0%{stroke-dashoffset:300} 100%{stroke-dashoffset:0}}

        /* ── Entry animations ── */
        .hero-tag      {animation:fadeInUp    0.6s ease 0.1s  both}
        .hero-h1-line1 {animation:slideInLeft 0.7s ease 0.2s  both}
        .hero-h1-line2 {animation:slideInLeft 0.7s ease 0.35s both}
        .hero-h1-line3 {animation:slideInLeft 0.7s ease 0.5s  both}
        .hero-sub      {animation:fadeInUp    0.7s ease 0.6s  both}
        .hero-cta      {animation:fadeInUp    0.7s ease 0.75s both}
        .hero-badges   {animation:fadeInUp    0.7s ease 0.9s  both}
        .badge-item:nth-child(1){animation:badgePop 0.5s ease 1.0s  both}
        .badge-item:nth-child(2){animation:badgePop 0.5s ease 1.15s both}
        .badge-item:nth-child(3){animation:badgePop 0.5s ease 1.3s  both}
        .robot-col-entry{animation:slideInRight 0.9s ease 0.3s both}

        /* ── Robot parts ── */
        .robot-tilt  {transform-style:preserve-3d;will-change:transform;transition:none;}
        .robot-float {position:relative;animation:robotFloat 5s ease-in-out infinite;transform-style:preserve-3d}
        .robot-eye-l {animation:eyeGlow 2.2s ease-in-out       infinite}
        .robot-eye-r {animation:eyeGlow 2.2s ease-in-out 0.4s  infinite}
        .robot-light-l{animation:chestPulse    1.8s ease-in-out       infinite}
        .robot-light-r{animation:chestPulse    1.8s ease-in-out 0.3s  infinite}
        .robot-light-m{animation:chestPulseDim 1.8s ease-in-out 0.6s  infinite}
        .robot-antenna{animation:antennaGlow   2s   ease-in-out       infinite}
        .robot-arm-l  {transform-origin:30px 115px; animation:armSwing 4s ease-in-out       infinite}
        .robot-arm-r  {transform-origin:170px 115px;animation:armSwing 4s ease-in-out 0.5s  infinite reverse}
        .robot-scanline{animation:scanlineRobot 3.2s linear infinite}
        .ring-outer   {animation:ringRotate    18s linear infinite}
        .ring-inner   {animation:ringRotateRev 12s linear infinite}
        .info-card-1  {animation:cardFloat 4s ease-in-out 0.5s infinite,fadeInUp 0.7s ease 0.8s both;transform-style:preserve-3d}
        .info-card-2  {animation:cardFloat 4s ease-in-out 1.2s infinite,fadeInUp 0.7s ease 1.0s both;transform-style:preserve-3d}
        .hint-arrow   {opacity:0;animation:fadeInUp 0.5s ease 1.8s both}
        .stat-item:nth-child(1){animation:statCountUp 0.6s ease 1.1s  both}
        .stat-item:nth-child(2){animation:statCountUp 0.6s ease 1.25s both}
        .stat-item:nth-child(3){animation:statCountUp 0.6s ease 1.4s  both}
        .stat-item:nth-child(4){animation:statCountUp 0.6s ease 1.55s both}
        .core-ring-a  {animation:coreRotate 4s linear infinite}
        .core-ring-b  {animation:coreRevRot 6s linear infinite}
        .shimmer-path {stroke-dasharray:300;animation:shimmerLine 3s ease-in-out infinite alternate}

        /* ── Info cards ── */
        .info-card {
          background: rgba(255,255,255,0.92);
          border:1px solid rgba(212,96,58,0.3);
          border-radius:8px;
          padding:.75rem 1rem;
          backdrop-filter:blur(12px);
          box-shadow:0 4px 24px rgba(224,90,42,0.15), inset 0 1px 0 rgba(255,255,255,0.8);
          z-index:10;
        }
        .info-card-label{font-size:.6rem;color:var(--text-muted);font-family:var(--font-display);letter-spacing:.12em;text-transform:uppercase;margin-bottom:2px}
        .info-card-value{font-size:1.2rem;font-family:var(--font-display);font-weight:800;color:var(--red-bright);text-shadow:0 0 20px rgba(242,107,58,.3)}

        @media (max-width:768px){
          .hero-grid  {grid-template-columns:1fr !important;text-align:center}
          .stats-grid {grid-template-columns:repeat(2,1fr) !important}
          .robot-col-entry{min-height:480px !important}
        }
        @media (max-width:480px){
          .stats-grid{grid-template-columns:1fr 1fr !important}
        }
      `}</style>

      {/* ── 3D Background Canvas ── */}
      <canvas ref={canvasRef} className="hero-canvas" aria-hidden="true" />

      {/* Decorative vertical line */}
      <div aria-hidden="true" style={{ position:'absolute', top:0, right:'38%', width:'1px', height:'100%', background:'linear-gradient(to bottom,transparent,rgba(212,96,58,0.12) 30%,rgba(212,96,58,0.12) 70%,transparent)', zIndex:1 }}/>
      {/* Corner brackets */}
      <div aria-hidden="true" style={{ position:'absolute', top:'6rem', left:'1.5rem', width:'40px', height:'40px', borderTop:'1.5px solid var(--red-bright)', borderLeft:'1.5px solid var(--red-bright)', opacity:0.6, zIndex:1 }}/>
      <div aria-hidden="true" style={{ position:'absolute', bottom:'3rem', right:'1.5rem', width:'40px', height:'40px', borderBottom:'1.5px solid var(--red-bright)', borderRight:'1.5px solid var(--red-bright)', opacity:0.6, zIndex:1 }}/>

      <div ref={containerRef} className="container-allbotix" style={{ position:'relative', zIndex:2 }}>
        <div
          className="hero-grid"
          style={{ display:'grid', gridTemplateColumns:'1fr 1fr', alignItems:'center', gap:'3rem', minHeight:'70vh' }}
        >

          {/* ── LEFT: Text ── */}
          <div>
            <div className="section-tag hero-tag" style={{ marginBottom:'1.5rem' }}>Robotics Technology Services</div>
            <h1 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(2.2rem,5vw,3.8rem)', fontWeight:900, lineHeight:1.1, color:'var(--text-primary)', marginBottom:'1.5rem', letterSpacing:'0.02em' }}>
              <span className="hero-h1-line1" style={{ display:'block' }}>One team.</span>
              <span className="hero-h1-line2" style={{ display:'block', color:'var(--red-bright)', textShadow:'0 0 40px rgba(242,107,58,0.35)', position:'relative' }}>
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
                  <span style={{ width:'6px', height:'6px', borderRadius:'50%', background:'var(--red-bright)', flexShrink:0, boxShadow:'0 0 8px rgba(242,107,58,.5)', display:'block' }}/>
                  {badge}
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="stats-grid" style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'1.25rem', marginTop:'3rem', paddingTop:'2rem', borderTop:'1px solid var(--border)' }}>
              {stats.map(s => (
                <div key={s.label} className="stat-item" style={{ display:'flex', flexDirection:'column', gap:'2px' }}>
                  <span className="stat-value" style={{ fontSize:'clamp(1.1rem,2.2vw,1.5rem)' }}>{s.value}</span>
                  <span className="stat-label">{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT: 3D Robot ── */}
          <div className="robot-col-entry" style={{ position:'relative', display:'flex', alignItems:'center', justifyContent:'center', height:'580px' }}>

            {/* Outer decorative rings */}
            <div className="ring-outer" aria-hidden="true" style={{ position:'absolute', width:'460px', height:'460px', borderRadius:'50%', border:'1px dashed rgba(212,96,58,0.2)', top:'50%', left:'50%' }}/>
            <div className="ring-inner" aria-hidden="true" style={{ position:'absolute', width:'340px', height:'340px', borderRadius:'50%', border:'1px solid rgba(212,96,58,0.15)', top:'50%', left:'50%' }}/>
            {/* Glow blob */}
            <div aria-hidden="true" style={{ position:'absolute', width:'300px', height:'300px', borderRadius:'50%', background:'radial-gradient(circle,rgba(242,107,58,0.12) 0%,rgba(224,90,42,0.04) 50%,transparent 70%)', top:'50%', left:'50%', transform:'translate(-50%,-50%)', filter:'blur(10px)' }}/>
            {/* Bottom shadow glow */}
            <div aria-hidden="true" style={{ position:'absolute', bottom:'10%', left:'50%', transform:'translateX(-50%)', width:'200px', height:'30px', borderRadius:'50%', background:'radial-gradient(ellipse,rgba(212,96,58,0.25) 0%,transparent 70%)', filter:'blur(12px)' }}/>

            {/* 3D tilt wrapper */}
            <div ref={robotRef} className="robot-tilt" style={{ position:'relative', zIndex:2 }}>
              <div className="robot-float" style={{ width:'300px', height:'420px', display:'flex', alignItems:'center', justifyContent:'center', transformStyle:'preserve-3d', position:'relative' }}>

                {/* ── REDESIGNED 3D ROBOT SVG ── */}
                <svg
                  viewBox="0 0 220 320"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{ width:'100%', height:'100%', filter:'drop-shadow(0 8px 40px rgba(242,107,58,0.4)) drop-shadow(0 0 80px rgba(224,90,42,0.15))', overflow:'visible', marginTop: '400px' }}
                  overflow="visible"
                >
                  <defs>
                    {/* Metal body gradient - gives 3D metallic look */}
                    <linearGradient id="metalBody" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%"   stopColor="#f0f0f0"/>
                      <stop offset="25%"  stopColor="#d8d8d8"/>
                      <stop offset="50%"  stopColor="#ffffff"/>
                      <stop offset="75%"  stopColor="#c0c0c0"/>
                      <stop offset="100%" stopColor="#e8e8e8"/>
                    </linearGradient>
                    <linearGradient id="metalDark" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%"   stopColor="#d0d0d0"/>
                      <stop offset="40%"  stopColor="#b8b8b8"/>
                      <stop offset="100%" stopColor="#a0a0a0"/>
                    </linearGradient>
                    <linearGradient id="copperAccent" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%"   stopColor="#f26b3a"/>
                      <stop offset="50%"  stopColor="#d4603a"/>
                      <stop offset="100%" stopColor="#c8581e"/>
                    </linearGradient>
                    <linearGradient id="copperGlow" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%"   stopColor="#f2a27a"/>
                      <stop offset="100%" stopColor="#e05a2a"/>
                    </linearGradient>
                    <linearGradient id="headGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%"   stopColor="#f5f5f5"/>
                      <stop offset="30%"  stopColor="#e8e8e8"/>
                      <stop offset="70%"  stopColor="#d0d0d0"/>
                      <stop offset="100%" stopColor="#c0c0c0"/>
                    </linearGradient>
                    <linearGradient id="torsoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%"   stopColor="#f8f8f8"/>
                      <stop offset="20%"  stopColor="#e4e4e4"/>
                      <stop offset="60%"  stopColor="#d8d8d8"/>
                      <stop offset="100%" stopColor="#c8c8c8"/>
                    </linearGradient>
                    <linearGradient id="legGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%"   stopColor="#eeeeee"/>
                      <stop offset="50%"  stopColor="#d4d4d4"/>
                      <stop offset="100%" stopColor="#c0c0c0"/>
                    </linearGradient>
                    <linearGradient id="armGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%"   stopColor="#f0f0f0"/>
                      <stop offset="50%"  stopColor="#d8d8d8"/>
                      <stop offset="100%" stopColor="#c4c4c4"/>
                    </linearGradient>
                    <radialGradient id="eyeGrad" cx="40%" cy="35%" r="60%">
                      <stop offset="0%"   stopColor="#ff9060"/>
                      <stop offset="60%"  stopColor="#f26b3a"/>
                      <stop offset="100%" stopColor="#c8501a"/>
                    </radialGradient>
                    <radialGradient id="chestCore" cx="50%" cy="40%" r="55%">
                      <stop offset="0%"   stopColor="#ffa060"/>
                      <stop offset="50%"  stopColor="#f26b3a"/>
                      <stop offset="100%" stopColor="#c8501a"/>
                    </radialGradient>
                    <radialGradient id="antennaGrad" cx="50%" cy="30%" r="60%">
                      <stop offset="0%"   stopColor="#ffb080"/>
                      <stop offset="100%" stopColor="#e05a2a"/>
                    </radialGradient>
                    {/* Shadow filter for 3D depth */}
                    <filter id="innerShadow" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur in="SourceAlpha" stdDeviation="3" result="blur"/>
                      <feOffset dx="2" dy="3" result="offset"/>
                      <feComposite in="SourceGraphic" in2="offset" operator="over"/>
                    </filter>
                    <filter id="glow3d">
                      <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur"/>
                      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                    </filter>
                    <filter id="strongGlow">
                      <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur"/>
                      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                    </filter>
                    {/* Bevel filter for panels */}
                    <filter id="bevel">
                      <feGaussianBlur in="SourceAlpha" stdDeviation="1" result="blur"/>
                      <feSpecularLighting in="blur" surfaceScale="4" specularConstant="1.2" specularExponent="16" lightingColor="white" result="spec">
                        <fePointLight x="60" y="40" z="80"/>
                      </feSpecularLighting>
                      <feComposite in="spec" in2="SourceAlpha" operator="in" result="specOut"/>
                      <feBlend in="SourceGraphic" in2="specOut" mode="screen"/>
                    </filter>
                  </defs>

                  {/* ── Scanline ── */}
                  <rect className="robot-scanline" x="38" y="0" width="144" height="8" fill="rgba(242,107,58,0.08)" rx="1"/>

                  {/* ════════════ HEAD ════════════ */}
                  {/* Ear panels */}
                  <rect x="56" y="26" width="16" height="62" rx="7" fill="url(#metalDark)" stroke="rgba(242,107,58,0.5)" strokeWidth="0.8"/>
                  <rect x="148" y="26" width="16" height="62" rx="7" fill="url(#metalDark)" stroke="rgba(242,107,58,0.5)" strokeWidth="0.8"/>
                  {/* Ear detail lines */}
                  <line x1="62" y1="36" x2="62" y2="80" stroke="rgba(242,107,58,0.3)" strokeWidth="0.6"/>
                  <line x1="158" y1="36" x2="158" y2="80" stroke="rgba(242,107,58,0.3)" strokeWidth="0.6"/>
                  {/* Ear accent */}
                  <rect x="58" y="40" width="10" height="20" rx="3" fill="url(#copperAccent)" opacity="0.5"/>
                  <rect x="152" y="40" width="10" height="20" rx="3" fill="url(#copperAccent)" opacity="0.5"/>

                  {/* Main head block — 3D bevel */}
                  <rect x="68" y="22" width="84" height="72" rx="10" fill="url(#headGrad)" filter="url(#bevel)"/>
                  {/* Head top highlight */}
                  <rect x="70" y="22" width="80" height="6" rx="5" fill="rgba(255,255,255,0.6)"/>
                  {/* Head bottom shadow */}
                  <rect x="70" y="84" width="80" height="8" rx="4" fill="rgba(0,0,0,0.07)"/>
                  {/* Head outer stroke */}
                  <rect x="68" y="22" width="84" height="72" rx="10" fill="none" stroke="rgba(212,96,58,0.6)" strokeWidth="1.2"/>
                  {/* Head side highlight */}
                  <rect x="68" y="24" width="4" height="66" rx="2" fill="rgba(255,255,255,0.35)"/>

                  {/* Visor panel — inset */}
                  <rect x="72" y="34" width="76" height="38" rx="6" fill="rgba(20,20,30,0.88)"/>
                  <rect x="72" y="34" width="76" height="38" rx="6" fill="none" stroke="rgba(242,107,58,0.5)" strokeWidth="0.8"/>
                  {/* Visor reflection */}
                  <rect x="74" y="35" width="30" height="4" rx="2" fill="rgba(255,255,255,0.08)"/>

                  {/* Eyes — glowing 3D */}
                  <rect className="robot-eye-l" x="78" y="38" width="24" height="14" rx="4" fill="url(#eyeGrad)" filter="url(#strongGlow)"/>
                  <rect className="robot-eye-r" x="118" y="38" width="24" height="14" rx="4" fill="url(#eyeGrad)" filter="url(#strongGlow)"/>
                  {/* Eye pupils */}
                  <rect x="84" y="41" width="12" height="8"  rx="2" fill="rgba(255,200,150,0.7)"/>
                  <rect x="124" y="41" width="12" height="8" rx="2" fill="rgba(255,200,150,0.7)"/>
                  {/* Eye shine */}
                  <rect x="80" y="39" width="5" height="3" rx="1" fill="rgba(255,255,255,0.5)"/>
                  <rect x="120" y="39" width="5" height="3" rx="1" fill="rgba(255,255,255,0.5)"/>

                  {/* Mouth — animated data bar */}
                  <rect x="82" y="60" width="56" height="7" rx="3" fill="rgba(30,30,40,0.7)"/>
                  <rect x="84" y="62" width="44" height="3" rx="1.5" fill="url(#copperAccent)" opacity="0.8">
                    <animate attributeName="width" values="44;34;50;38;44" dur="3s" repeatCount="indefinite"/>
                    <animate attributeName="x"     values="84;89;82;87;84" dur="3s" repeatCount="indefinite"/>
                  </rect>

                  {/* Panel lines on head */}
                  <line x1="78" y1="76" x2="142" y2="76" stroke="rgba(212,96,58,0.25)" strokeWidth="0.6"/>

                  {/* Antenna */}
                  <line x1="110" y1="22" x2="110" y2="5"  stroke="url(#copperGlow)" strokeWidth="2"/>
                  <circle className="robot-antenna" cx="110" cy="4" r="5" fill="url(#antennaGrad)" filter="url(#strongGlow)"/>
                  <circle cx="110" cy="4" r="2.5" fill="rgba(255,200,150,0.8)"/>
                  {/* Antenna wings */}
                  <line x1="110" y1="11" x2="122" y2="6" stroke="rgba(242,107,58,0.4)" strokeWidth="0.8"/>
                  <line x1="110" y1="11" x2="98"  y2="6" stroke="rgba(242,107,58,0.4)" strokeWidth="0.8"/>
                  <circle cx="122" cy="6" r="1.5" fill="rgba(242,107,58,0.5)"/>
                  <circle cx="98"  cy="6" r="1.5" fill="rgba(242,107,58,0.5)"/>

                  {/* ════════════ NECK ════════════ */}
                  <rect x="95" y="94"  width="30" height="20" rx="6" fill="url(#metalDark)" stroke="rgba(212,96,58,0.4)" strokeWidth="0.8"/>
                  <rect x="97" y="96"  width="26" height="4"  rx="2" fill="rgba(255,255,255,0.3)"/>
                  <rect x="97" y="102" width="26" height="2"  rx="1" fill="rgba(242,107,58,0.3)"/>
                  <rect x="97" y="107" width="26" height="2"  rx="1" fill="rgba(242,107,58,0.2)"/>

                  {/* ════════════ TORSO ════════════ */}
                  {/* Shoulder connectors */}
                  <rect x="47" y="115" width="22" height="88" rx="8" fill="url(#metalDark)" stroke="rgba(212,96,58,0.35)" strokeWidth="0.8"/>
                  <rect x="151" y="115" width="22" height="88" rx="8" fill="url(#metalDark)" stroke="rgba(212,96,58,0.35)" strokeWidth="0.8"/>
                  {/* Shoulder highlights */}
                  <rect x="49" y="115" width="6" height="82" rx="3" fill="rgba(255,255,255,0.2)"/>
                  <rect x="165" y="115" width="6" height="82" rx="3" fill="rgba(255,255,255,0.2)"/>

                  {/* Main torso — big 3D beveled panel */}
                  <rect x="55" y="114" width="110" height="100" rx="12" fill="url(#torsoGrad)" filter="url(#bevel)"/>
                  {/* Torso top highlight */}
                  <rect x="58" y="114" width="104" height="8" rx="6" fill="rgba(255,255,255,0.5)"/>
                  {/* Torso left highlight */}
                  <rect x="55" y="116" width="6" height="92" rx="3" fill="rgba(255,255,255,0.3)"/>
                  {/* Torso bottom shadow */}
                  <rect x="58" y="205" width="104" height="8" rx="4" fill="rgba(0,0,0,0.08)"/>
                  {/* Torso outer border */}
                  <rect x="55" y="114" width="110" height="100" rx="12" fill="none" stroke="rgba(212,96,58,0.55)" strokeWidth="1.2"/>

                  {/* Chest screen panel */}
                  <rect x="68" y="126" width="84" height="60" rx="8" fill="rgba(15,15,25,0.85)"/>
                  <rect x="68" y="126" width="84" height="60" rx="8" fill="none" stroke="rgba(242,107,58,0.4)" strokeWidth="0.8"/>
                  {/* Screen reflection */}
                  <rect x="70" y="127" width="35" height="3" rx="1.5" fill="rgba(255,255,255,0.06)"/>

                  {/* Chest core — glowing energy orb */}
                  <circle cx="110" cy="148" r="18" fill="rgba(15,15,25,0.9)"/>
                  {/* Core rings */}
                  <g className="core-ring-a" style={{ transformOrigin:'110px 148px' }}>
                    <ellipse cx="110" cy="148" rx="16" ry="7" fill="none" stroke="rgba(242,107,58,0.35)" strokeWidth="1" strokeDasharray="4 3"/>
                  </g>
                  <g className="core-ring-b" style={{ transformOrigin:'110px 148px' }}>
                    <ellipse cx="110" cy="148" rx="10" ry="16" fill="none" stroke="rgba(242,162,122,0.3)" strokeWidth="1" strokeDasharray="3 4"/>
                  </g>
                  {/* Core center glowing circles */}
                  <circle className="robot-light-m" cx="110" cy="148" r="10" fill="url(#chestCore)" filter="url(#strongGlow)" opacity="0.9"/>
                  <circle cx="110" cy="148" r="6" fill="rgba(255,180,120,0.9)"/>
                  <circle cx="110" cy="148" r="3" fill="rgba(255,230,200,1)"/>
                  {/* Side chest lights */}
                  <circle className="robot-light-l" cx="82"  cy="148" r="7" fill="url(#chestCore)" filter="url(#glow3d)"/>
                  <circle className="robot-light-r" cx="138" cy="148" r="7" fill="url(#chestCore)" filter="url(#glow3d)"/>
                  <circle cx="82"  cy="148" r="3.5" fill="rgba(255,200,150,0.8)"/>
                  <circle cx="138" cy="148" r="3.5" fill="rgba(255,200,150,0.8)"/>

                  {/* Data lines on chest panel */}
                  <line x1="72" y1="164" x2="104" y2="164" stroke="rgba(212,96,58,0.35)" strokeWidth="0.7"/>
                  <line x1="116" y1="164" x2="148" y2="164" stroke="rgba(212,96,58,0.35)" strokeWidth="0.7"/>
                  <line x1="72" y1="172" x2="98"  y2="172" stroke="rgba(212,96,58,0.25)" strokeWidth="0.6">
                    <animate attributeName="x2" values="98;118;98"   dur="2.5s" repeatCount="indefinite"/>
                  </line>
                  <line x1="122" y1="172" x2="148" y2="172" stroke="rgba(212,96,58,0.25)" strokeWidth="0.6">
                    <animate attributeName="x1" values="122;102;122" dur="2.5s" repeatCount="indefinite"/>
                  </line>
                  <line x1="72" y1="179" x2="90" y2="179" stroke="rgba(212,96,58,0.18)" strokeWidth="0.5">
                    <animate attributeName="x2" values="90;110;90" dur="3.2s" repeatCount="indefinite"/>
                  </line>

                  {/* Bottom torso panel strip */}
                  <rect x="60" y="196" width="100" height="14" rx="5" fill="url(#metalDark)" stroke="rgba(212,96,58,0.3)" strokeWidth="0.7"/>
                  <rect x="64" y="199" width="92" height="5" rx="2" fill="rgba(255,255,255,0.2)"/>
                  {/* Waist vents */}
                  {[72, 84, 96, 108, 120, 132].map((x, i) => (
                    <rect key={i} x={x} y="200" width="6" height="8" rx="1.5" fill="rgba(242,107,58,0.2)" stroke="rgba(242,107,58,0.3)" strokeWidth="0.4"/>
                  ))}

                  {/* ════════════ ARMS ════════════ */}
                  {/* Left arm */}
                  <g className="robot-arm-l">
                    {/* Shoulder joint */}
                    <circle cx="48" cy="120" r="11" fill="url(#metalDark)" stroke="rgba(212,96,58,0.5)" strokeWidth="1"/>
                    <circle cx="48" cy="120" r="6" fill="url(#copperAccent)" opacity="0.7"/>
                    <circle cx="48" cy="120" r="3" fill="rgba(255,200,150,0.8)"/>
                    {/* Upper arm */}
                    <rect x="18" y="128" width="28" height="68" rx="10" fill="url(#armGrad)" filter="url(#bevel)"/>
                    <rect x="20" y="128" width="6" height="62" rx="3" fill="rgba(255,255,255,0.3)"/>
                    <rect x="18" y="128" width="28" height="68" rx="10" fill="none" stroke="rgba(212,96,58,0.4)" strokeWidth="0.9"/>
                    {/* Arm panel */}
                    <rect x="22" y="136" width="20" height="30" rx="4" fill="rgba(20,20,30,0.6)"/>
                    <rect x="24" y="138" width="8"  height="4" rx="1.5" fill="rgba(242,107,58,0.5)">
                      <animate attributeName="opacity" values="0.5;0.9;0.5" dur="2s" repeatCount="indefinite"/>
                    </rect>
                    <rect x="24" y="145" width="16" height="2" rx="1" fill="rgba(212,96,58,0.3)"/>
                    <rect x="24" y="150" width="12" height="2" rx="1" fill="rgba(212,96,58,0.2)"/>
                    <rect x="24" y="155" width="14" height="2" rx="1" fill="rgba(212,96,58,0.25)"/>
                    {/* Elbow joint */}
                    <circle cx="32" cy="172" r="8" fill="url(#metalDark)" stroke="rgba(212,96,58,0.4)" strokeWidth="0.8"/>
                    <circle cx="32" cy="172" r="4" fill="rgba(242,107,58,0.4)"/>
                    {/* Lower arm / hand */}
                    <rect x="20" y="192" width="24" height="12" rx="5" fill="url(#metalDark)" stroke="rgba(212,96,58,0.4)" strokeWidth="0.7"/>
                    <rect x="22" y="194" width="20" height="4" rx="2" fill="rgba(255,255,255,0.2)"/>
                  </g>

                  {/* Right arm */}
                  <g className="robot-arm-r">
                    {/* Shoulder joint */}
                    <circle cx="172" cy="120" r="11" fill="url(#metalDark)" stroke="rgba(212,96,58,0.5)" strokeWidth="1"/>
                    <circle cx="172" cy="120" r="6"  fill="url(#copperAccent)" opacity="0.7"/>
                    <circle cx="172" cy="120" r="3"  fill="rgba(255,200,150,0.8)"/>
                    {/* Upper arm */}
                    <rect x="174" y="128" width="28" height="68" rx="10" fill="url(#armGrad)" filter="url(#bevel)"/>
                    <rect x="194" y="128" width="6"  height="62" rx="3" fill="rgba(255,255,255,0.3)"/>
                    <rect x="174" y="128" width="28" height="68" rx="10" fill="none" stroke="rgba(212,96,58,0.4)" strokeWidth="0.9"/>
                    {/* Arm panel */}
                    <rect x="178" y="136" width="20" height="30" rx="4" fill="rgba(20,20,30,0.6)"/>
                    <rect x="188" y="138" width="8"  height="4" rx="1.5" fill="rgba(242,107,58,0.5)">
                      <animate attributeName="opacity" values="0.9;0.5;0.9" dur="2s" repeatCount="indefinite"/>
                    </rect>
                    <rect x="180" y="145" width="16" height="2" rx="1" fill="rgba(212,96,58,0.3)"/>
                    <rect x="180" y="150" width="12" height="2" rx="1" fill="rgba(212,96,58,0.2)"/>
                    <rect x="180" y="155" width="14" height="2" rx="1" fill="rgba(212,96,58,0.25)"/>
                    {/* Elbow joint */}
                    <circle cx="188" cy="172" r="8" fill="url(#metalDark)" stroke="rgba(212,96,58,0.4)" strokeWidth="0.8"/>
                    <circle cx="188" cy="172" r="4" fill="rgba(242,107,58,0.4)"/>
                    {/* Lower arm / hand */}
                    <rect x="176" y="192" width="24" height="12" rx="5" fill="url(#metalDark)" stroke="rgba(212,96,58,0.4)" strokeWidth="0.7"/>
                    <rect x="178" y="194" width="20" height="4" rx="2" fill="rgba(255,255,255,0.2)"/>
                  </g>

                  {/* ════════════ LEGS ════════════ */}
                  {/* Hip connector */}
                  <rect x="72" y="214" width="76" height="12" rx="5" fill="url(#metalDark)" stroke="rgba(212,96,58,0.35)" strokeWidth="0.7"/>
                  <rect x="76" y="216" width="68" height="4"  rx="2" fill="rgba(255,255,255,0.2)"/>

                  {/* LEFT LEG */}
                  {/* Hip joint */}
                  <circle cx="83" cy="222" r="9" fill="url(#metalDark)" stroke="rgba(212,96,58,0.4)" strokeWidth="0.9"/>
                  <circle cx="83" cy="222" r="5" fill="rgba(242,107,58,0.4)"/>
                  {/* Thigh */}
                  <rect x="60" y="228" width="36" height="58" rx="10" fill="url(#legGrad)" filter="url(#bevel)"/>
                  <rect x="62" y="228" width="6"  height="52" rx="3" fill="rgba(255,255,255,0.3)"/>
                  <rect x="60" y="228" width="36" height="58" rx="10" fill="none" stroke="rgba(212,96,58,0.4)" strokeWidth="0.9"/>
                  {/* Knee joint */}
                  <circle cx="78" cy="284" r="8" fill="url(#metalDark)" stroke="rgba(212,96,58,0.4)" strokeWidth="0.8"/>
                  <circle cx="78" cy="284" r="4" fill="rgba(242,107,58,0.35)"/>
                  {/* Shin */}
                  <rect x="62" y="286" width="32" height="32" rx="8" fill="url(#legGrad)" filter="url(#bevel)"/>
                  <rect x="64" y="286" width="5"  height="26" rx="2.5" fill="rgba(255,255,255,0.25)"/>
                  <rect x="62" y="286" width="32" height="32" rx="8" fill="none" stroke="rgba(212,96,58,0.35)" strokeWidth="0.8"/>
                  {/* Foot */}
                  <rect x="54" y="312" width="48" height="14" rx="6" fill="url(#metalDark)" stroke="rgba(212,96,58,0.4)" strokeWidth="0.9"/>
                  <rect x="56" y="313" width="44" height="5" rx="2.5" fill="rgba(255,255,255,0.25)"/>
                  <rect x="54" y="320" width="48" height="5" rx="2.5" fill="rgba(0,0,0,0.06)"/>

                  {/* RIGHT LEG */}
                  <circle cx="137" cy="222" r="9" fill="url(#metalDark)" stroke="rgba(212,96,58,0.4)" strokeWidth="0.9"/>
                  <circle cx="137" cy="222" r="5" fill="rgba(242,107,58,0.4)"/>
                  <rect x="124" y="228" width="36" height="58" rx="10" fill="url(#legGrad)" filter="url(#bevel)"/>
                  <rect x="152" y="228" width="6"  height="52" rx="3" fill="rgba(255,255,255,0.3)"/>
                  <rect x="124" y="228" width="36" height="58" rx="10" fill="none" stroke="rgba(212,96,58,0.4)" strokeWidth="0.9"/>
                  <circle cx="142" cy="284" r="8" fill="url(#metalDark)" stroke="rgba(212,96,58,0.4)" strokeWidth="0.8"/>
                  <circle cx="142" cy="284" r="4" fill="rgba(242,107,58,0.35)"/>
                  <rect x="126" y="286" width="32" height="32" rx="8" fill="url(#legGrad)" filter="url(#bevel)"/>
                  <rect x="151" y="286" width="5"  height="26" rx="2.5" fill="rgba(255,255,255,0.25)"/>
                  <rect x="126" y="286" width="32" height="32" rx="8" fill="none" stroke="rgba(212,96,58,0.35)" strokeWidth="0.8"/>
                  <rect x="118" y="312" width="48" height="14" rx="6" fill="url(#metalDark)" stroke="rgba(212,96,58,0.4)" strokeWidth="0.9"/>
                  <rect x="120" y="313" width="44" height="5" rx="2.5" fill="rgba(255,255,255,0.25)"/>
                  <rect x="118" y="320" width="48" height="5" rx="2.5" fill="rgba(0,0,0,0.06)"/>
                </svg>

              </div>
            </div>

            {/* ── Floating info cards ── */}
            <div className="info-card-1 info-card" style={{ position:'absolute', top:'5%', right:'-8%' }}>
              <p className="info-card-label">Efficiency</p>
              <p className="info-card-value">99.8%</p>
            </div>
            <div className="info-card-2 info-card" style={{ position:'absolute', bottom:'8%', left:'-8%' }}>
              <p className="info-card-label">Uptime</p>
              <p className="info-card-value">24 / 7</p>
            </div>

          </div>

        </div>
      </div>

      {/* Mouse hint */}
      <div className="hint-arrow" style={{ position:'absolute', bottom:'1.5rem', left:'50%', transform:'translateX(-50%)', display:'flex', alignItems:'center', gap:'8px', opacity:0.45, zIndex:3 }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--red-bright)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        <span style={{ fontFamily:'var(--font-display)', fontSize:'0.55rem', letterSpacing:'0.15em', color:'var(--red-bright)', textTransform:'uppercase' }}>move mouse</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--red-bright)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
      </div>
    </section>
  )
}