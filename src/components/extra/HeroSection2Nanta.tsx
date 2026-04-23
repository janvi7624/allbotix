'use client'

import Link from 'next/link'
import { useRef, useEffect, useState } from 'react'

const BADGES = [
    { icon: '✦', text: 'Your intelligent automation partner', delay: 0.1, top: '8%', right: '15%' },
    { icon: '✓', text: 'Industry-certified deployments only', delay: 0.35, top: '28%', right: '00%' },
    { icon: '↑', text: 'Increases efficiency by 80%', delay: 0.6, top: '48%', right: '20%' },
]

/* ─── Particle canvas ─────────────────────────────────────────────────── */
function Particles() {
    const ref = useRef<HTMLCanvasElement>(null)
    useEffect(() => {
        const c = ref.current; if (!c) return
        const ctx = c.getContext('2d')!
        let w = c.offsetWidth, h = c.offsetHeight
        c.width = w; c.height = h
        const pts = Array.from({ length: 48 }, () => ({
            x: Math.random() * w, y: Math.random() * h,
            vx: (Math.random() - .5) * .3, vy: (Math.random() - .5) * .3,
            r: Math.random() * 1.5 + .4, o: Math.random() * .4 + .1,
        }))
        let raf: number
        const draw = () => {
            ctx.clearRect(0, 0, w, h)
            pts.forEach(p => {
                p.x += p.vx; p.y += p.vy
                if (p.x < 0) p.x = w; if (p.x > w) p.x = 0
                if (p.y < 0) p.y = h; if (p.y > h) p.y = 0
                ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
                ctx.fillStyle = `rgba(176,58,46,${p.o})`; ctx.fill()
            })
            for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) {
                const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y, d = Math.sqrt(dx * dx + dy * dy)
                if (d < 90) { ctx.beginPath(); ctx.strokeStyle = `rgba(176,58,46,${.1 * (1 - d / 90)})`; ctx.lineWidth = .5; ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y); ctx.stroke() }
            }
            raf = requestAnimationFrame(draw)
        }
        draw()
        const rs = () => { w = c.offsetWidth; h = c.offsetHeight; c.width = w; c.height = h }
        window.addEventListener('resize', rs)
        return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', rs) }
    }, [])
    return <canvas ref={ref} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }} />
}

/* ─── Floating badge ──────────────────────────────────────────────────── */
function Badge({ icon, text, delay, top, right }: { icon: string; text: string; delay: number; top: string; right: string }) {
    return (
        <div style={{
            position: 'absolute', top, right,
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '10px 18px 10px 14px',
            background: 'rgba(11,8,8,0.82)',
            border: '1px solid rgba(176,58,46,0.35)',
            borderRadius: '100px',
            backdropFilter: 'blur(14px)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)',
            opacity: 0,
            animation: `badgeIn 0.6s cubic-bezier(0.34,1.56,0.64,1) ${delay + 0.8}s both, badgeFloat ${3 + delay}s ease-in-out ${delay + 1.4}s infinite`,
            zIndex: 4,
            whiteSpace: 'nowrap',
        }}>
            <span style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'rgba(176,58,46,0.2)', border: '1px solid rgba(176,58,46,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--red-bright)', fontSize: '10px', flexShrink: 0 }}>{icon}</span>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.68rem', letterSpacing: '0.06em', color: 'rgba(240,236,232,0.88)' }}>{text}</span>
        </div>
    )
}

/* ─── Main Hero ───────────────────────────────────────────────────────── */
export default function HeroSectionV2() {
    const [loaded, setLoaded] = useState(false)
    useEffect(() => { const t = setTimeout(() => setLoaded(true), 60); return () => clearTimeout(t) }, [])

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
            }}
        >
            {/* ── Background image — full section, pinned right ── */}
            <div style={{ position: 'absolute', inset: 0, zIndex: 0, overflow: 'hidden' }}>
                <img
                    src="/background1.jpeg"
                    alt="background"
                    style={{
                        position: 'absolute',
                        right: 0,
                        top: 0,
                        height: '100%',
                        width: 'auto',
                        objectFit: 'contain',
                        objectPosition: 'right center',
                        opacity: 0.3,
                    }}
                />
            </div>

            {/*
              ── Three orbs staggered along the background road ──
              Each orb runs the SAME path with animation-delay to space them out.
              animation-timing-function: linear ensures NO easing = constant speed.
              Keyframe time % values are proportional to spatial distance between
              waypoints (computed from Euclidean distance), so each % of time
              covers the same amount of screen distance → perfectly uniform speed.

              Path waypoints (left/top as % of section):
                0%  → left:100% top:27%   (entry from right)
               12%  → left:88%  top:34%
               27%  → left:95%  top:50%
               49%  → left:70%  top:57%
               65%  → left:52%  top:62%
               82%  → left:50%  top:80%
              100%  → left:45%  top:100%  (exit at bottom)
            */}
            {[
                { orbDelay: '0s',    trailDelay: '0.15s' },
                { orbDelay: '-3.3s', trailDelay: '-3.15s' },
                { orbDelay: '-6.6s', trailDelay: '-6.45s' },
            ].map((orb, i) => (
                <div key={i} aria-hidden="true" style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none' }}>
                    {/* Glow trail */}
                    <div style={{
                        position: 'absolute',
                        width: '90px',
                        height: '90px',
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(210,40,30,0.7) 0%, rgba(176,58,46,0.28) 42%, transparent 68%)',
                        filter: 'blur(14px)',
                        transform: 'translate(-50%, -50%)',
                        animationName: 'orbPath',
                        animationDuration: '10s',
                        animationTimingFunction: 'linear',
                        animationDelay: orb.trailDelay,
                        animationIterationCount: 'infinite',
                        opacity: 0.4,
                    }} />
                    {/* Orb image */}
                    <div style={{
                        position: 'absolute',
                        width: '54px',
                        height: '54px',
                        transform: 'translate(-50%, -50%)',
                        filter: 'drop-shadow(0 0 20px rgba(210,40,30,1)) drop-shadow(0 0 7px rgba(255,90,60,0.85))',
                        animationName: 'orbPath',
                        animationDuration: '10s',
                        animationTimingFunction: 'linear',
                        animationDelay: orb.orbDelay,
                        animationIterationCount: 'infinite',
                        opacity: 0.5
                    }}>
                        <img
                            src="/item1.png"
                            alt=""
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'contain',
                                animation: 'orbPulse 2s ease-in-out infinite',
                                opacity: 0.5
                            }}
                        />
                    </div>
                </div>
            ))}

            <style>{`
        @keyframes slideInLeft  { from{opacity:0;transform:translateX(-44px)} to{opacity:1;transform:translateX(0)} }
        @keyframes fadeInUp     { from{opacity:0;transform:translateY(22px)}  to{opacity:1;transform:translateY(0)} }
        @keyframes badgeIn      { from{opacity:0;transform:translateX(30px) scale(0.85)} to{opacity:1;transform:translateX(0) scale(1)} }
        @keyframes badgeFloat   { 0%,100%{transform:translateY(0)}   50%{transform:translateY(-7px)} }
        @keyframes glassFloat   { 0%,100%{transform:translateY(0) rotateX(2deg)}  50%{transform:translateY(-14px) rotateX(-2deg)} }
        @keyframes glassIn      { from{opacity:0;transform:scale(0.7) translateY(40px)} to{opacity:1;transform:scale(1) translateY(0)} }
        @keyframes ringRotateCW { to{transform:translate(-50%,-50%) rotate(360deg)} }
        @keyframes ringRotateCCW{ to{transform:translate(-50%,-50%) rotate(-360deg)} }
        @keyframes glitchText {
          0%,90%,100%{clip-path:inset(0 0 0 0);transform:translateX(0)}
          92%{clip-path:inset(20% 0 60% 0);transform:translateX(-4px)}
          94%{clip-path:inset(60% 0 20% 0);transform:translateX(4px)}
          96%{clip-path:inset(0 0 0 0);transform:translateX(0)}
        }
        @keyframes pulseGlow    { 0%,100%{opacity:0.55;transform:translate(-50%,-50%) scale(1)} 50%{opacity:1;transform:translate(-50%,-50%) scale(1.12)} }
        @keyframes dotBlink     { 0%,100%{opacity:0.4;transform:scale(1)} 50%{opacity:1;transform:scale(1.5)} }

        /*
          Single shared path — all three orbs use this same keyframe.
          Time % values are distance-proportional (Euclidean) so speed is constant.
          animation-timing-function: linear (set inline) keeps it steady between frames too.

          Waypoint distances (cumulative out of 116.7 total):
            0    → 0%
            14.2 → 12%   (left:88% top:34%)
            31.3 → 27%   (left:95% top:50%)
            57.4 → 49%   (left:70% top:57%)
            76.3 → 65%   (left:52% top:62%)
            96.3 → 82%   (left:50% top:80%)
           116.7 → 100%  (left:45% top:100%)
        */
        @keyframes orbPath {
          0%  { left: 100%; top: 27%; opacity: 0; width: 0; height: 0; }
          4%  { left: 100%; top: 27%; opacity: 1; width: 90px; height: 90px; }
          12% { left: 88%;  top: 34%;  width: 110px; height: 110px; } 
          27% { left: 95%;  top: 50%;  width: 130px; height: 130px; }
          49% { left: 70%;  top: 57%;  width: 150px; height: 150px; }
          65% { left: 50%;  top: 62%;  width: 170px; height: 170px; }
          82% { left: 48%;  top: 80%;  width: 190px; height: 190px; }
          96% { left: 45%;  top: 100%; opacity: 1; width: 210px; height: 210px; }
          100%{ left: 45%;  top: 100%; opacity: 0; width: 0; height: 0; }
        }

        @keyframes orbPulse {
          0%,100% { transform: scale(1);    filter: brightness(1);    }
          50%     { transform: scale(1.08); filter: brightness(1.3);  }
        }

        .hero-tag     { animation:fadeInUp   0.55s ease 0.1s  both; }
        .hero-line1   { animation:slideInLeft 0.65s ease 0.18s both; }
        .hero-line2   { animation:slideInLeft 0.65s ease 0.32s both; }
        .hero-line3   { animation:slideInLeft 0.65s ease 0.46s both; }
        .hero-sub     { animation:fadeInUp   0.6s  ease 0.58s both; }
        .hero-cta     { animation:fadeInUp   0.6s  ease 0.72s both; }
        .hero-trust   { animation:fadeInUp   0.6s  ease 0.88s both; }
        .glass-main   { animation:glassIn 0.8s cubic-bezier(0.34,1.56,0.64,1) 0.35s both; }
        .glass-sec    { animation:glassIn 0.8s cubic-bezier(0.34,1.56,0.64,1) 0.55s both; }

        @media(max-width:768px){
          .hero-grid  { grid-template-columns:1fr !important; }
          .right-col  { display:none !important; }
        }
      `}</style>

            <Particles />

            {/* Decorative vertical line */}
            <div aria-hidden="true" style={{ position: 'absolute', top: 0, right: '40%', width: '1px', height: '100%', background: 'linear-gradient(to bottom,transparent,rgba(176,58,46,0.16) 25%,rgba(176,58,46,0.16) 75%,transparent)', pointerEvents: 'none' }} />

            {/* Corner brackets */}
            <div aria-hidden="true" style={{ position: 'absolute', top: '5.5rem', left: '1.5rem', width: '36px', height: '36px', borderTop: '1px solid rgba(176,58,46,0.55)', borderLeft: '1px solid rgba(176,58,46,0.55)', opacity: 0.6 }} />
            <div aria-hidden="true" style={{ position: 'absolute', bottom: '3rem', right: '1.5rem', width: '36px', height: '36px', borderBottom: '1px solid rgba(176,58,46,0.55)', borderRight: '1px solid rgba(176,58,46,0.55)', opacity: 0.6 }} />

            <div className="container-allbotix" style={{ position: 'relative', zIndex: 2 }}>
                <div className="hero-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', alignItems: 'center', gap: '2rem', minHeight: '72vh' }}>

                    {/* ── LEFT — Text ── */}
                    <div>
                        <div className="section-tag hero-tag" style={{ marginBottom: '1.5rem' }}>Next-Generation Robotics Automation</div>

                        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.4rem,5.5vw,4.2rem)', fontWeight: 900, lineHeight: 1.05, color: 'var(--text-primary)', marginBottom: '1.5rem', letterSpacing: '0.01em' }}>
                            <span className="hero-line1" style={{ display: 'block' }}>Stop Manual</span>
                            <span className="hero-line2" style={{ display: 'block', color: 'var(--red-bright)', textShadow: '0 0 50px rgba(176,58,46,0.45)', position: 'relative' }}>
                                Labour. Start
                                <span aria-hidden="true" style={{ position: 'absolute', inset: 0, color: 'var(--red-bright)', animation: 'glitchText 8s steps(1) 3s infinite', opacity: 0.45, pointerEvents: 'none' }}>Labour. Start</span>
                            </span>
                            <span className="hero-line3" style={{ display: 'block' }}>Automating.</span>
                        </h1>

                        <p className="hero-sub" style={{ fontSize: '1rem', color: 'var(--text-secondary)', maxWidth: '440px', lineHeight: 1.9, marginBottom: '2.5rem' }}>
                            AI-powered robotic systems that work at industrial scale, qualify tasks in real-time, and either complete operations autonomously or hand off to your team instantly.
                        </p>

                        <div className="hero-cta" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
                            <Link href="/solutions" className="btn-primary" style={{ fontSize: '0.78rem', padding: '0.85rem 1.75rem' }}>
                                Discover More
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                            </Link>
                            <Link href="#process" className="btn-outline" style={{ fontSize: '0.78rem', padding: '0.85rem 1.75rem' }}>Our Process</Link>
                        </div>

                        {/* Trust badges */}
                        <div className="hero-trust" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
                            {['Smart AI Agents', 'Industry Certified', '24/7 Support'].map((t, i) => (
                                <div key={t} style={{ display: 'flex', alignItems: 'center', gap: '7px', fontFamily: 'var(--font-light)', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--red-bright)', flexShrink: 0, boxShadow: '0 0 8px rgba(176,58,46,0.7)', display: 'block', animation: `dotBlink 2s ease-in-out ${i * .4}s infinite` }} />
                                    {t}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ── RIGHT — 3D Visual ── */}
                    <div className="right-col" style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '540px' }}>

                        {/* Rotating rings */}
                        <div aria-hidden="true" style={{ position: 'absolute', width: '460px', height: '460px', borderRadius: '50%', border: '1px dashed rgba(176,58,46,0.14)', top: '50%', left: '50%', animation: 'ringRotateCW 25s linear infinite', pointerEvents: 'none' }} />
                        <div aria-hidden="true" style={{ position: 'absolute', width: '340px', height: '340px', borderRadius: '50%', border: '1px solid rgba(176,58,46,0.2)', top: '50%', left: '50%', animation: 'ringRotateCCW 16s linear infinite', pointerEvents: 'none' }} />

                        {/* Ambient glow */}
                        <div aria-hidden="true" style={{ position: 'absolute', width: '320px', height: '320px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(176,58,46,0.16) 0%,transparent 70%)', top: '50%', left: '50%', animation: 'pulseGlow 3.5s ease-in-out infinite', pointerEvents: 'none' }} />

                        {/* ── Floating orbs ── */}
                        {[
                            { size: 44, top: '12%', right: '15%', delay: 0.2 },
                            { size: 36, top: '22%', right: '00%', delay: 0.7 },
                            { size: 28, top: '35%', right: '20%', delay: 1.1 },
                        ].map((o, i) => (
                            <div key={i} style={{
                                position: 'absolute', top: o.top, right: o.right, zIndex: 2,
                                width: `${o.size}px`, height: `${o.size * 1.15}px`,
                                background: `linear-gradient(165deg,rgba(240,236,232,0.14) 0%,rgba(176,58,46,0.18) 60%,rgba(8,6,6,0.4) 100%)`,
                                border: '1px solid rgba(176,58,46,0.25)',
                                borderRadius: '50% 50% 45% 45%',
                                backdropFilter: 'blur(8px)',
                                boxShadow: '0 8px 24px rgba(0,0,0,0.45)',
                                animation: `glassFloat ${2.6 + o.delay}s ease-in-out ${o.delay}s infinite`,
                            }} />
                        ))}

                        {/* ── Floating feature badges ── */}
                        {BADGES.map(b => <Badge key={b.text} {...b} />)}
                    </div>
                </div>
            </div>
        </section>
    )
}