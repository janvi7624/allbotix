'use client'

import Link from 'next/link'
import { useRef, useEffect } from 'react'

/* ─── Static data ───────────────────────────────────────── */
const stats = [
  { value: '21K+', label: 'Projects Done' },
  { value: '17K+', label: 'Happy Clients' },
  { value: '37K+', label: 'Parts Delivered' },
  { value: '4.7',  label: 'Average Rating' },
]
const features = [
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg>,
    title: 'Smart AI-based agents',
    desc: 'Autonomous decision-making systems powered by cutting-edge machine learning algorithms.',
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>,
    title: 'Professional team',
    desc: 'World-class robotics engineers dedicated to solving complex industrial challenges.',
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 8.81a19.79 19.79 0 01-3.07-8.63A2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92v2z"/></svg>,
    title: '24/7 Premium Support',
    desc: 'Round-the-clock technical assistance ensuring your systems operate at peak performance.',
  },
]

/* ─── Pure helpers ──────────────────────────────────────── */
const eio  = (t: number) => t < 0.5 ? 2*t*t : -1+(4-2*t)*t
const lerp = (a: number, b: number, t: number) => a + (b-a)*t
const cl   = (v: number, lo=0, hi=1) => Math.max(lo, Math.min(hi, v))
const sm   = (v: number, lo: number, hi: number) => cl((v-lo)/(hi-lo))  // smooth 0→1 window

/* ─── Robot parts: hero → scattered → tech ─────────────── */
interface Part { id:string; hx:number; hy:number; hw:number; hh:number; hr:number; tx:number; ty:number; tw:number; th:number; tr:number; fill:string; stroke:string; vx:number; vy:number; vr:number; shape?:'circle'; hR?:number; tR?:number }
const PARTS: Part[] = [
  { id:'head', hx:60,  hy:20,  hw:80, hh:70, hr:12, tx:22,  ty:14,  tw:68, th:56, tr:10, fill:'#1e1e1e', stroke:'#b03a2e', vx:-30, vy:-100,vr:-22 },
  { id:'eyeL', hx:74,  hy:37,  hw:20, hh:13, hr:3,  tx:32,  ty:31,  tw:16, th:10, tr:3,  fill:'#b03a2e', stroke:'#ff6666', vx:-85, vy:-70, vr:-50 },
  { id:'eyeR', hx:106, hy:37,  hw:20, hh:13, hr:3,  tx:55,  ty:31,  tw:16, th:10, tr:3,  fill:'#b03a2e', stroke:'#ff6666', vx:85,  vy:-70, vr:50  },
  { id:'neck', hx:86,  hy:90,  hw:28, hh:18, hr:5,  tx:34,  ty:72,  tw:44, th:13, tr:4,  fill:'#141414', stroke:'#b03a2e', vx:15,  vy:-35, vr:12  },
  { id:'body', hx:47,  hy:108, hw:106,hh:100,hr:10, tx:8,   ty:90,  tw:156,th:78, tr:8,  fill:'#111111', stroke:'#b03a2e', vx:0,   vy:55,  vr:0   },
  { id:'chest',hx:64,  hy:120, hw:72, hh:54, hr:6,  tx:18,  ty:100, tw:136,th:54, tr:4,  fill:'#090909', stroke:'#b03a2e', vx:25,  vy:38,  vr:6   },
  { id:'lL',   shape:'circle', hx:82,  hy:138, hw:0, hh:0, hr:0, tx:28,ty:112,tw:0,th:0,tr:0, hR:8,tR:5, fill:'#b03a2e',stroke:'none',vx:-55,vy:75, vr:0 },
  { id:'lM',   shape:'circle', hx:100, hy:138, hw:0, hh:0, hr:0, tx:40,ty:112,tw:0,th:0,tr:0, hR:5,tR:5, fill:'#b03a2e',stroke:'none',vx:0,  vy:75, vr:0 },
  { id:'lR',   shape:'circle', hx:118, hy:138, hw:0, hh:0, hr:0, tx:52,ty:112,tw:0,th:0,tr:0, hR:8,tR:5, fill:'#b03a2e',stroke:'none',vx:55, vy:75, vr:0 },
  { id:'armL', hx:20,  hy:112, hw:22, hh:80, hr:8,  tx:8,   ty:168, tw:14, th:60, tr:6,  fill:'#111111', stroke:'#b03a2e', vx:-110,vy:25,  vr:-52 },
  { id:'armR', hx:158, hy:112, hw:22, hh:80, hr:8,  tx:152, ty:168, tw:14, th:60, tr:6,  fill:'#111111', stroke:'#b03a2e', vx:110, vy:25,  vr:52  },
  { id:'legL', hx:58,  hy:218, hw:34, hh:66, hr:8,  tx:8,   ty:160, tw:82, th:12, tr:4,  fill:'#111111', stroke:'#b03a2e', vx:-45, vy:115, vr:-18 },
  { id:'legR', hx:108, hy:218, hw:34, hh:66, hr:8,  tx:90,  ty:160, tw:82, th:12, tr:4,  fill:'#111111', stroke:'#b03a2e', vx:45,  vy:115, vr:18  },
]

/* ─── Canvas rounded rect ───────────────────────────────── */
function rr(ctx: CanvasRenderingContext2D, x:number,y:number,w:number,h:number,r:number) {
  r = Math.min(Math.abs(r), Math.abs(w)/2, Math.abs(h)/2)
  ctx.beginPath()
  ctx.moveTo(x+r,y); ctx.lineTo(x+w-r,y); ctx.quadraticCurveTo(x+w,y,x+w,y+r)
  ctx.lineTo(x+w,y+h-r); ctx.quadraticCurveTo(x+w,y+h,x+w-r,y+h)
  ctx.lineTo(x+r,y+h); ctx.quadraticCurveTo(x,y+h,x,y+h-r)
  ctx.lineTo(x,y+r); ctx.quadraticCurveTo(x,y,x+r,y); ctx.closePath()
}

export default function HeroTechSection() {
  const wrapRef    = useRef<HTMLDivElement>(null)
  const canvasRef  = useRef<HTMLCanvasElement>(null)
  const robotRef   = useRef<HTMLDivElement>(null)
  const heroLayerRef  = useRef<HTMLDivElement>(null)
  const heroRobotRef  = useRef<HTMLDivElement>(null)
  const techLayerRef  = useRef<HTMLDivElement>(null)
  const techRobotRef  = useRef<HTMLDivElement>(null)
  const canvasWrapRef = useRef<HTMLDivElement>(null)
  const scrollHintRef = useRef<HTMLDivElement>(null)
  const rafRef     = useRef<number>(0)
  const tilt       = useRef({ cx:0, cy:0, tx:0, ty:0 })

  /* ── Scroll-reveal for tech text (IntersectionObserver) ── */
  useEffect(()=>{
    const timer = setTimeout(()=>{
      const els = Array.from(document.querySelectorAll<HTMLElement>('.ht-rev'))
      if(!('IntersectionObserver' in window)){ els.forEach(e=>e.classList.add('ht-in')); return }
      const io = new IntersectionObserver((entries)=>{
        entries.forEach(e=>{ if(e.isIntersecting){ (e.target as HTMLElement).classList.add('ht-in'); io.unobserve(e.target) } })
      },{ threshold:0.08 })
      els.forEach(el=>{ const r=el.getBoundingClientRect(); if(r.top<window.innerHeight-30) el.classList.add('ht-in'); else io.observe(el) })
      return ()=>io.disconnect()
    },60)
    return ()=>clearTimeout(timer)
  },[])

  /* ── Main rAF loop ── */
  useEffect(()=>{
    const wrap      = wrapRef.current!
    const canvas    = canvasRef.current!
    const heroLayer = heroLayerRef.current!
    const heroRobot = heroRobotRef.current!
    const techLayer = techLayerRef.current!
    const techRobot = techRobotRef.current!
    const cvWrap    = canvasWrapRef.current!
    const hint      = scrollHintRef.current
    const ctx       = canvas.getContext('2d')!

    /* resize */
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight }
    resize()
    const ro = new ResizeObserver(resize); ro.observe(canvas)

    /* tilt */
    const onMove = (e: MouseEvent) => {
      const r = wrap.getBoundingClientRect()
      tilt.current.tx = ((e.clientX-r.left)/r.width)*2-1
      tilt.current.ty = ((e.clientY-r.top)/r.height)*2-1
    }
    const onLeave = () => { tilt.current.tx = 0; tilt.current.ty = 0 }
    wrap.addEventListener('mousemove', onMove)
    wrap.addEventListener('mouseleave', onLeave)

    /* ── tick ── */
    const tick = () => {
      /* scroll progress 0→1 over the 300vh tunnel */
      const wRect = wrap.getBoundingClientRect()
      const scrollable = wrap.scrollHeight - window.innerHeight
      const p = cl(-wRect.top / (scrollable || 1))

      /* ── smooth opacity windows (all done via style.opacity — zero React state) ── */

      // Hero layer: fully visible 0–0.25, fades out 0.25–0.40
      const heroOp = cl(1 - sm(p, 0.25, 0.40))
      heroLayer.style.opacity = String(heroOp)
      heroLayer.style.pointerEvents = heroOp < 0.05 ? 'none' : 'auto'

      // Hero robot: fade out slightly earlier than the text
      const heroRobotOp = cl(1 - sm(p, 0.22, 0.34))
      heroRobot.style.opacity = String(heroRobotOp)

      // Canvas: fade in 0.28–0.38, fade out 0.62–0.72
      const cvIn  = sm(p, 0.28, 0.38)
      const cvOut = 1 - sm(p, 0.62, 0.72)
      const cvOp  = Math.min(cvIn, cvOut)
      cvWrap.style.opacity  = String(cvOp)
      cvWrap.style.pointerEvents = 'none'

      // Tech layer: fades in 0.65–0.80
      const techOp = sm(p, 0.65, 0.80)
      techLayer.style.opacity = String(techOp)
      techLayer.style.pointerEvents = techOp < 0.05 ? 'none' : 'auto'

      // Tech robot: slightly delayed vs text
      const techRobotOp = sm(p, 0.68, 0.82)
      techRobot.style.opacity = String(techRobotOp)

      // Scroll hint
      if(hint) hint.style.opacity = String(cl(1 - sm(p, 0.05, 0.15)))

      /* ── tilt lerp + apply (only when hero robot visible) ── */
      const L = 0.07
      tilt.current.cx += (tilt.current.tx - tilt.current.cx)*L
      tilt.current.cy += (tilt.current.ty - tilt.current.cy)*L
      if(robotRef.current && heroRobotOp > 0.05){
        const rx = tilt.current.cy * -35
        const ry = tilt.current.cx * 55
        robotRef.current.style.transform = `perspective(400px) rotateX(${rx}deg) rotateY(${ry}deg)`
      }

      /* ── canvas morph draw ── */
      const W = canvas.width, H = canvas.height
      ctx.clearRect(0,0,W,H)

      if(cvOp > 0.01){
        // morph progress 0→1 inside the canvas-visible window (0.28–0.72)
        const mt = cl((p - 0.28) / 0.44)
        const S  = Math.min(W * 0.20, 180) / 200   // scale: fit robot in ~20% of width

        // Origin offsets: hero = right 70%, tech = left 30%
        const hOX = W*0.70 - 100*S,  hOY = H*0.50 - 145*S
        const tOX = W*0.30 - 90*S,   tOY = H*0.50 - 120*S

        // Dim background
        ctx.fillStyle = `rgba(8,8,8,${Math.sin(mt*Math.PI)*0.65})`
        ctx.fillRect(0,0,W,H)

        PARTS.forEach(pt => {
          /* Each part travels: hero pos → scattered explosion → tech pos
             We use a single 0→1 t across the whole morph.
             Explosion arc: parts peak at mt=0.5 (furthest from both ends).
          */
          const ease = eio(mt)

          // Hero absolute position
          const hax = hOX + pt.hx*S
          const hay = hOY + pt.hy*S
          // Scattered absolute position (peak of arc at mt=0.5)
          const scx = hOX + (pt.hx + pt.vx)*S
          const scy = hOY + (pt.hy + pt.vy)*S
          // Tech absolute position
          const tax = tOX + pt.tx*S
          const tay = tOY + pt.ty*S

          // Quadratic bezier: hero → scatter → tech, parameterised by ease
          const x = lerp(lerp(hax, scx, ease), lerp(scx, tax, ease), ease)
          const y = lerp(lerp(hay, scy, ease), lerp(scy, tay, ease), ease)

          // Width/height lerp hero → tech
          const w = lerp((pt.hw||0)*S, (pt.tw||0)*S, ease)
          const h = lerp((pt.hh||0)*S, (pt.th||0)*S, ease)
          const rad = lerp((pt.hR||0)*S, (pt.tR||0)*S, ease)

          // Rotation: spins out then back
          const rotation = pt.vr * Math.sin(mt*Math.PI) * (Math.PI/180)

          // Alpha: always fully visible during morph (no fade out mid-arc)
          const alpha = mt < 0.08 ? sm(mt, 0, 0.08) : mt > 0.92 ? 1-sm(mt, 0.92, 1) : 1

          ctx.save()
          ctx.globalAlpha = alpha
          ctx.shadowColor = '#b03a2e'
          ctx.shadowBlur  = 8

          if(pt.shape === 'circle'){
            ctx.translate(x, y)
            ctx.beginPath(); ctx.arc(0,0,rad,0,Math.PI*2)
            ctx.fillStyle = pt.fill; ctx.fill()
          } else {
            const cx = x + w/2, cy = y + h/2
            ctx.translate(cx,cy); ctx.rotate(rotation); ctx.translate(-w/2,-h/2)
            rr(ctx, 0, 0, Math.max(w,1), Math.max(h,1), (pt.hr||0)*S*0.5)
            ctx.fillStyle = pt.fill; ctx.fill()
            if(pt.stroke !== 'none'){
              ctx.strokeStyle = pt.stroke; ctx.lineWidth = 1.2; ctx.stroke()
            }
          }
          ctx.restore()
        })

        /* Spark burst at midpoint */
        const spark = Math.max(0, 1 - Math.abs(mt-0.5)/0.18)
        if(spark > 0){
          const cx = W*0.5, cy = H*0.5
          for(let i=0;i<24;i++){
            const a = (i/24)*Math.PI*2 + mt*8
            const r2 = (40 + Math.sin(mt*20+i)*20)*S
            ctx.save()
            ctx.globalAlpha = spark*(0.25+Math.sin(mt*25+i)*0.2)
            ctx.beginPath(); ctx.arc(cx+Math.cos(a)*r2, cy+Math.sin(a)*r2, (1+Math.sin(i)*0.5)*S, 0, Math.PI*2)
            ctx.fillStyle = i%3===0 ? '#ff4444' : '#b03a2e'
            ctx.shadowColor='#ff3333'; ctx.shadowBlur=12; ctx.fill()
            ctx.restore()
          }
        }

        /* Label */
        const label = mt < 0.5 ? 'DISASSEMBLING...' : 'REASSEMBLING...'
        ctx.save()
        ctx.globalAlpha = Math.sin(mt*Math.PI)*0.7
        ctx.font = `700 ${Math.max(9, Math.round(10.5*S/0.7))}px 'Orbitron',monospace`
        ctx.fillStyle='#b03a2e'; ctx.textAlign='center'
        ctx.shadowColor='#b03a2e'; ctx.shadowBlur=14
        ctx.fillText(label, W/2, H*0.91)
        ctx.restore()
      }

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return ()=>{
      cancelAnimationFrame(rafRef.current)
      wrap.removeEventListener('mousemove', onMove)
      wrap.removeEventListener('mouseleave', onLeave)
      ro.disconnect()
    }
  },[])

  /* ─────────────────────────────────────────────────────────
     RENDER — static shell, all opacity driven by rAF via refs
  ───────────────────────────────────────────────────────── */
  return (
    <div ref={wrapRef} id="home" style={{ position:'relative', height:'300vh' }}>

      {/* ── styles ── */}
      <style>{`
        @keyframes slideInLeft  { from{opacity:0;transform:translateX(-40px)} to{opacity:1;transform:translateX(0)} }
        @keyframes slideInRight { from{opacity:0;transform:translateX(60px)}  to{opacity:1;transform:translateX(0)} }
        @keyframes fadeInUp     { from{opacity:0;transform:translateY(20px)}  to{opacity:1;transform:translateY(0)} }
        @keyframes glitchText   { 0%{clip-path:inset(0 0 98% 0);transform:translateX(-4px)} 10%{clip-path:inset(30% 0 50% 0);transform:translateX(4px)} 20%{clip-path:inset(60% 0 20% 0);transform:translateX(-2px)} 30%{clip-path:inset(80% 0 5% 0);transform:translateX(2px)} 40%,100%{clip-path:inset(0 0 0 0);transform:translateX(0)} }
        @keyframes badgePop     { 0%{opacity:0;transform:scale(0.7) translateY(10px)} 70%{transform:scale(1.08) translateY(-2px)} 100%{opacity:1;transform:scale(1) translateY(0)} }
        @keyframes robotFloat   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
        @keyframes eyePulse     { 0%,100%{opacity:0.9;filter:drop-shadow(0 0 4px #b03a2e)} 50%{opacity:0.5;filter:drop-shadow(0 0 14px #ff4444)} }
        @keyframes chestPulse   { 0%,100%{opacity:0.8} 50%{opacity:1} }
        @keyframes chestDim     { 0%,100%{opacity:0.35} 50%{opacity:0.75} }
        @keyframes antennaGlow  { 0%,100%{filter:drop-shadow(0 0 3px #b03a2e);opacity:1} 50%{filter:drop-shadow(0 0 12px #ff5555);opacity:0.6} }
        @keyframes armSwing     { 0%,100%{transform:rotate(0deg)} 30%{transform:rotate(5deg)} 70%{transform:rotate(-5deg)} }
        @keyframes scanRobot    { 0%{transform:translateY(-100%);opacity:0.5} 100%{transform:translateY(500%);opacity:0} }
        @keyframes ringCW       { from{transform:translate(-50%,-50%) rotate(0deg)} to{transform:translate(-50%,-50%) rotate(360deg)} }
        @keyframes ringCCW      { from{transform:translate(-50%,-50%) rotate(0deg)} to{transform:translate(-50%,-50%) rotate(-360deg)} }
        @keyframes cardFloat    { 0%,100%{transform:translateZ(60px) translateY(0)} 50%{transform:translateZ(60px) translateY(-7px)} }
        @keyframes statUp       { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes screenFlick  { 0%,100%{opacity:0.9} 50%{opacity:0.7} }
        @keyframes techArm      { 0%,100%{transform:rotate(0deg)} 40%{transform:rotate(-18deg)} 80%{transform:rotate(8deg)} }
        @keyframes techLight    { 0%,100%{opacity:0.8} 50%{opacity:1} }
        @keyframes brdPulse     { 0%,100%{box-shadow:0 0 0 0 rgba(176,58,46,0);border-color:rgba(176,58,46,0.18)} 50%{box-shadow:0 0 28px rgba(176,58,46,0.12);border-color:rgba(176,58,46,0.44)} }
        @keyframes tsScan       { 0%{top:-3%;opacity:0.6} 100%{top:108%;opacity:0} }
        @keyframes tsDivider    { from{width:0;opacity:0} to{width:48px;opacity:1} }
        @keyframes tsSpin       { to{transform:rotate(360deg)} }
        @keyframes tsBadge      { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-7px)} }
        @keyframes tsLabel      { from{opacity:0;transform:translateX(-14px)} to{opacity:1;transform:translateX(0)} }
        @keyframes tsConn       { from{transform:scaleX(0)} to{transform:scaleX(1)} }
        @keyframes tsCirc       { 0%{transform:scale(0);opacity:0} 65%{transform:scale(1.18)} 100%{transform:scale(1);opacity:1} }
        @keyframes hintBounce   { 0%,100%{transform:translateX(-50%) translateY(0)} 50%{transform:translateX(-50%) translateY(6px)} }

        /* hero text */
        .ht-tag  { animation:fadeInUp 0.6s ease 0.1s both }
        .ht-h1a  { animation:slideInLeft 0.7s ease 0.2s both }
        .ht-h1b  { animation:slideInLeft 0.7s ease 0.35s both }
        .ht-h1c  { animation:slideInLeft 0.7s ease 0.5s both }
        .ht-sub  { animation:fadeInUp 0.7s ease 0.6s both }
        .ht-cta  { animation:fadeInUp 0.7s ease 0.75s both }
        .ht-bdg  { animation:fadeInUp 0.7s ease 0.9s both }
        .ht-b0   { animation:badgePop 0.5s ease 1.0s both }
        .ht-b1   { animation:badgePop 0.5s ease 1.15s both }
        .ht-b2   { animation:badgePop 0.5s ease 1.3s both }

        /* hero robot */
        .ht-robot-col{ animation:slideInRight 0.9s ease 0.3s both }
        .ht-tilt     { transform-style:preserve-3d;will-change:transform }
        .ht-float    { animation:robotFloat 5s ease-in-out infinite;transform-style:preserve-3d }
        .ht-eye-l    { animation:eyePulse 2.2s ease-in-out infinite }
        .ht-eye-r    { animation:eyePulse 2.2s ease-in-out 0.4s infinite }
        .ht-ll       { animation:chestPulse 1.8s ease-in-out infinite }
        .ht-lm       { animation:chestDim 1.8s ease-in-out 0.6s infinite }
        .ht-lr       { animation:chestPulse 1.8s ease-in-out 0.3s infinite }
        .ht-ant      { animation:antennaGlow 2s ease-in-out infinite }
        .ht-arm-l    { transform-origin:30px 115px;animation:armSwing 4s ease-in-out infinite }
        .ht-arm-r    { transform-origin:170px 115px;animation:armSwing 4s ease-in-out 0.5s infinite reverse }
        .ht-scan     { animation:scanRobot 3.2s linear infinite }
        .ht-ring-o   { animation:ringCW 18s linear infinite }
        .ht-ring-i   { animation:ringCCW 12s linear infinite }
        .ht-c1       { animation:cardFloat 4s ease-in-out 0.5s infinite,fadeInUp 0.7s ease 0.8s both;transform-style:preserve-3d }
        .ht-c2       { animation:cardFloat 4s ease-in-out 1.2s infinite,fadeInUp 0.7s ease 1.0s both;transform-style:preserve-3d }
        .ht-s0       { animation:statUp 0.6s ease 1.1s both }
        .ht-s1       { animation:statUp 0.6s ease 1.25s both }
        .ht-s2       { animation:statUp 0.6s ease 1.4s both }
        .ht-s3       { animation:statUp 0.6s ease 1.55s both }

        /* tech robot */
        .tr-screen { animation:screenFlick 3s ease-in-out infinite }
        .tr-arm    { transform-origin:86px 172px;animation:techArm 4s ease-in-out infinite }
        .tr-light  { animation:techLight 1.6s ease-in-out infinite }

        /* tech panel */
        .ts-panel  { animation:brdPulse 4s ease-in-out infinite }
        .ts-scan   { position:absolute;left:0;right:0;height:3px;background:linear-gradient(90deg,transparent,rgba(176,58,46,0.30),transparent);animation:tsScan 3.5s linear infinite;pointer-events:none;z-index:3 }
        .ts-badge  { animation:tsBadge 4s ease-in-out 0.5s infinite }
        .ts-label  { animation:tsLabel 0.6s ease 0.8s both }
        .ts-divider{ animation:tsDivider 0.6s ease 0.3s both }
        .ts-icon   { transition:background 0.3s,box-shadow 0.3s,border-color 0.3s }
        .ts-icon:hover{ background:var(--red-soft)!important;box-shadow:0 0 20px rgba(176,58,46,0.25);border-color:var(--red-bright)!important }
        .ts-icon:hover svg{ animation:tsSpin 0.55s ease }

        /* text reveals */
        .ht-rev { opacity:0;transform:translateY(24px);transition:opacity 0.65s ease,transform 0.65s ease }
        .ht-rev.ht-in { opacity:1!important;transform:translateY(0)!important }
        .ht-fl  { transform:translateX(-36px)!important }
        .ht-fr  { transform:translateX(36px)!important }
        .ht-fl.ht-in,.ht-fr.ht-in { transform:translateX(0)!important }
        .ht-d1{transition-delay:0.08s!important}.ht-d2{transition-delay:0.18s!important}
        .ht-d3{transition-delay:0.28s!important}.ht-d4{transition-delay:0.38s!important}.ht-d5{transition-delay:0.48s!important}

        @media(max-width:768px){ .ht-2col{grid-template-columns:1fr!important;text-align:center} .ht-stats{grid-template-columns:repeat(2,1fr)!important} }
        @media(max-width:480px){ .ht-stats{grid-template-columns:1fr 1fr!important} }
      `}</style>

      {/* ── sticky viewport ── */}
      <div style={{ position:'sticky', top:0, height:'100vh', overflow:'hidden',
        background:`radial-gradient(ellipse 80% 60% at 60% 50%,rgba(176,58,46,0.07) 0%,transparent 70%),radial-gradient(ellipse 50% 80% at 10% 50%,rgba(100,10,10,0.10) 0%,transparent 60%),var(--bg-900)` }}>

        {/* decorative */}
        <div aria-hidden="true" style={{position:'absolute',top:0,right:'38%',width:'1px',height:'100%',background:'linear-gradient(to bottom,transparent,rgba(176,58,46,0.18) 30%,rgba(176,58,46,0.18) 70%,transparent)'}}/>
        <div aria-hidden="true" style={{position:'absolute',top:'6rem',left:'1.5rem',width:'40px',height:'40px',borderTop:'1px solid var(--red-bright)',borderLeft:'1px solid var(--red-bright)',opacity:0.5}}/>
        <div aria-hidden="true" style={{position:'absolute',bottom:'3rem',right:'1.5rem',width:'40px',height:'40px',borderBottom:'1px solid var(--red-bright)',borderRight:'1px solid var(--red-bright)',opacity:0.5}}/>

        {/* canvas overlay */}
        <div ref={canvasWrapRef} style={{position:'absolute',inset:0,zIndex:30,opacity:0,pointerEvents:'none'}}>
          <canvas ref={canvasRef} style={{width:'100%',height:'100%',display:'block'}}/>
        </div>

        {/* scroll hint */}
        <div ref={scrollHintRef} style={{position:'absolute',bottom:'2.5rem',left:'50%',transform:'translateX(-50%)',display:'flex',flexDirection:'column',alignItems:'center',gap:'6px',zIndex:20,pointerEvents:'none',animation:'fadeInUp 0.5s ease 2s both'}}>
          <span style={{fontFamily:'var(--font-display)',fontSize:'0.55rem',letterSpacing:'0.2em',color:'var(--red-bright)',textTransform:'uppercase',opacity:0.6}}>scroll to transform</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--red-bright)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{animation:'hintBounce 1.4s ease-in-out infinite'}}><polyline points="6 9 12 15 18 9"/></svg>
        </div>

        {/* ════════════════ HERO LAYER ════════════════ */}
        <div ref={heroLayerRef} style={{position:'absolute',inset:0,zIndex:10,paddingTop:'7rem',paddingBottom:'4rem',display:'flex',flexDirection:'column',justifyContent:'center'}}>
          <div className="container-allbotix">
            <div className="ht-2col" style={{display:'grid',gridTemplateColumns:'1fr 1fr',alignItems:'center',gap:'3rem',minHeight:'70vh'}}>

              {/* left text */}
              <div>
                <div className="section-tag ht-tag" style={{marginBottom:'1.5rem'}}>Robotics Technology Services</div>
                <h1 style={{fontFamily:'var(--font-display)',fontSize:'clamp(2.2rem,5vw,3.8rem)',fontWeight:900,lineHeight:1.1,color:'var(--text-primary)',marginBottom:'1.5rem',letterSpacing:'0.02em'}}>
                  <span className="ht-h1a" style={{display:'block'}}>One team.</span>
                  <span className="ht-h1b" style={{display:'block',color:'var(--red-bright)',textShadow:'0 0 40px rgba(176,58,46,0.4)',position:'relative'}}>
                    One robot.
                    <span aria-hidden="true" style={{position:'absolute',inset:0,color:'var(--red-bright)',animation:'glitchText 6s steps(1) 2s infinite',opacity:0.5,pointerEvents:'none'}}>One robot.</span>
                  </span>
                  <span className="ht-h1c" style={{display:'block'}}>Limitless<br/>possibilities.</span>
                </h1>
                <p className="ht-sub" style={{fontSize:'1rem',color:'var(--text-secondary)',maxWidth:'440px',lineHeight:1.9,marginBottom:'2.5rem'}}>
                  Empowering tomorrow's industries with cutting-edge robotic solutions. Smart automation, precision engineering, and limitless innovation.
                </p>
                <div className="ht-cta" style={{display:'flex',gap:'1rem',flexWrap:'wrap'}}>
                  <Link href="/solutions" className="btn-primary">Discover More <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></Link>
                </div>
                <div className="ht-bdg" style={{display:'flex',alignItems:'center',gap:'1.5rem',marginTop:'2.5rem',flexWrap:'wrap'}}>
                  {['Smart AI-based agents','Professional team','24/7 Premium Support'].map((b,i)=>(
                    <div key={b} className={`ht-b${i}`} style={{display:'flex',alignItems:'center',gap:'6px',fontFamily:'var(--font-light)',fontSize:'0.78rem',color:'var(--text-secondary)'}}>
                      <span style={{width:'6px',height:'6px',borderRadius:'50%',background:'var(--red-bright)',flexShrink:0,boxShadow:'0 0 6px var(--red-glow)',display:'block'}}/>
                      {b}
                    </div>
                  ))}
                </div>
              </div>

              {/* right — 3D robot */}
              <div ref={heroRobotRef} className="ht-robot-col" style={{position:'relative',display:'flex',alignItems:'center',justifyContent:'center',minHeight:'520px'}}>
                <div className="ht-ring-o" aria-hidden="true" style={{position:'absolute',width:'440px',height:'440px',borderRadius:'50%',border:'1px dashed rgba(176,58,46,0.18)',top:'50%',left:'50%'}}/>
                <div className="ht-ring-i" aria-hidden="true" style={{position:'absolute',width:'330px',height:'330px',borderRadius:'50%',border:'1px solid rgba(176,58,46,0.26)',top:'50%',left:'50%'}}/>
                <div aria-hidden="true" style={{position:'absolute',width:'280px',height:'280px',borderRadius:'50%',background:'radial-gradient(circle,rgba(176,58,46,0.16) 0%,transparent 70%)',top:'50%',left:'50%',transform:'translate(-50%,-50%)',animation:'pulse-red 2.5s ease-in-out infinite'}}/>
                <div ref={robotRef} className="ht-tilt" style={{position:'relative',zIndex:2}}>
                  <div className="ht-float" style={{width:'300px',height:'400px',display:'flex',alignItems:'center',justifyContent:'center',transformStyle:'preserve-3d'}}>
                    <div aria-hidden="true" style={{position:'absolute',bottom:'-22px',left:'50%',transform:'translateX(-50%) translateZ(-80px)',width:'170px',height:'22px',borderRadius:'50%',background:'radial-gradient(ellipse,rgba(176,58,46,0.4) 0%,transparent 70%)',filter:'blur(7px)'}}/>
                    <svg viewBox="0 0 200 290" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:'100%',height:'100%',filter:'drop-shadow(0 0 32px rgba(176,58,46,0.35))',overflow:'visible'}} overflow="visible">
                      <rect className="ht-scan" x="38" y="0" width="124" height="9" fill="rgba(176,58,46,0.09)"/>
                      <rect x="140" y="22" width="14" height="66" rx="6" fill="#141414" stroke="#b03a2e" strokeWidth="0.8" strokeOpacity="0.6"/>
                      <rect x="142" y="35" width="8"  height="18" rx="3" fill="#b03a2e" opacity="0.4"/>
                      <rect x="46"  y="22" width="14" height="66" rx="6" fill="#141414" stroke="#b03a2e" strokeWidth="0.8" strokeOpacity="0.6"/>
                      <rect x="60"  y="20" width="80" height="70" rx="12" fill="#1a1a1a" stroke="#b03a2e" strokeWidth="1.4"/>
                      <rect x="62"  y="20" width="76" height="3"  rx="2"  fill="#b03a2e" opacity="0.15"/>
                      <rect className="ht-eye-l" x="74"  y="37" width="20" height="13" rx="3" fill="#b03a2e"/>
                      <rect className="ht-eye-r" x="106" y="37" width="20" height="13" rx="3" fill="#b03a2e"/>
                      <rect x="78"  y="40" width="12" height="7" rx="2" fill="#ff6666" opacity="0.65"/>
                      <rect x="110" y="40" width="12" height="7" rx="2" fill="#ff6666" opacity="0.65"/>
                      <rect x="78" y="64" width="44" height="6" rx="2" fill="#b03a2e" opacity="0.6"><animate attributeName="width" values="44;38;44" dur="3s" repeatCount="indefinite"/><animate attributeName="x" values="78;81;78" dur="3s" repeatCount="indefinite"/></rect>
                      <line x1="100" y1="20" x2="100" y2="4"  stroke="#b03a2e" strokeWidth="1.8"/>
                      <circle className="ht-ant" cx="100" cy="3" r="4" fill="#b03a2e"/>
                      <line x1="100" y1="10" x2="110" y2="6"  stroke="#b03a2e" strokeWidth="0.8" strokeOpacity="0.5"/>
                      <line x1="100" y1="10" x2="90"  y2="6"  stroke="#b03a2e" strokeWidth="0.8" strokeOpacity="0.5"/>
                      <rect x="86"  y="90" width="28" height="18" rx="5" fill="#141414" stroke="#b03a2e" strokeWidth="0.9" strokeOpacity="0.5"/>
                      <circle cx="91"  cy="99" r="2" fill="#b03a2e" opacity="0.4"/>
                      <circle cx="109" cy="99" r="2" fill="#b03a2e" opacity="0.4"/>
                      <rect x="43"  y="108" width="14" height="98" rx="6" fill="#141414" stroke="#b03a2e" strokeWidth="0.8" strokeOpacity="0.5"/>
                      <rect x="143" y="108" width="14" height="98" rx="6" fill="#141414" stroke="#b03a2e" strokeWidth="0.8" strokeOpacity="0.5"/>
                      <rect x="47"  y="108" width="106" height="100" rx="10" fill="#111111" stroke="#b03a2e" strokeWidth="1.3"/>
                      <rect x="64"  y="120" width="72"  height="54"  rx="6"  fill="#1a1a1a" stroke="#b03a2e" strokeWidth="0.9" strokeOpacity="0.45"/>
                      <circle className="ht-ll" cx="82"  cy="138" r="8" fill="#b03a2e"/>
                      <circle className="ht-lm" cx="100" cy="138" r="5" fill="#b03a2e"/>
                      <circle className="ht-lr" cx="118" cy="138" r="8" fill="#b03a2e"/>
                      <circle cx="82"  cy="138" r="12" fill="#b03a2e" opacity="0.08"/>
                      <circle cx="118" cy="138" r="12" fill="#b03a2e" opacity="0.08"/>
                      <line x1="68" y1="156" x2="132" y2="156" stroke="#b03a2e" strokeWidth="0.7" strokeOpacity="0.4"/>
                      <line x1="68" y1="164" x2="110" y2="164" stroke="#b03a2e" strokeWidth="0.7" strokeOpacity="0.3"><animate attributeName="x2" values="110;128;110" dur="2.5s" repeatCount="indefinite"/></line>
                      <line x1="68" y1="172" x2="95"  y2="172" stroke="#b03a2e" strokeWidth="0.5" strokeOpacity="0.2"><animate attributeName="x2" values="95;115;95" dur="3.2s" repeatCount="indefinite"/></line>
                      <g className="ht-arm-l"><rect x="14" y="112" width="12" height="76" rx="5" fill="#141414" stroke="#b03a2e" strokeWidth="0.7" strokeOpacity="0.5"/><rect x="20" y="112" width="22" height="80" rx="8" fill="#111111" stroke="#b03a2e" strokeWidth="1"/><rect x="23" y="122" width="16" height="32" rx="4" fill="#1a1a1a"/><circle cx="31" cy="158" r="6" fill="#1a1a1a" stroke="#b03a2e" strokeWidth="0.8" strokeOpacity="0.5"/><rect x="18" y="188" width="24" height="9" rx="4" fill="#1a1a1a" stroke="#b03a2e" strokeWidth="0.7" strokeOpacity="0.5"/></g>
                      <g className="ht-arm-r"><rect x="174" y="112" width="12" height="76" rx="5" fill="#141414" stroke="#b03a2e" strokeWidth="0.7" strokeOpacity="0.5"/><rect x="158" y="112" width="22" height="80" rx="8" fill="#111111" stroke="#b03a2e" strokeWidth="1"/><rect x="161" y="122" width="16" height="32" rx="4" fill="#1a1a1a"/><circle cx="169" cy="158" r="6" fill="#1a1a1a" stroke="#b03a2e" strokeWidth="0.8" strokeOpacity="0.5"/><rect x="158" y="188" width="24" height="9" rx="4" fill="#1a1a1a" stroke="#b03a2e" strokeWidth="0.7" strokeOpacity="0.5"/></g>
                      <rect x="66" y="208" width="68" height="10" rx="4" fill="#1a1a1a" stroke="#b03a2e" strokeWidth="0.7" strokeOpacity="0.35"/>
                      <rect x="54" y="218" width="10" height="66" rx="5" fill="#141414" stroke="#b03a2e" strokeWidth="0.7" strokeOpacity="0.4"/>
                      <rect x="58" y="218" width="34" height="66" rx="8" fill="#111111" stroke="#b03a2e" strokeWidth="1"/>
                      <rect x="60" y="236" width="30" height="7" rx="3" fill="#1a1a1a" stroke="#b03a2e" strokeWidth="0.6" strokeOpacity="0.4"/>
                      <rect x="136" y="218" width="10" height="66" rx="5" fill="#141414" stroke="#b03a2e" strokeWidth="0.7" strokeOpacity="0.4"/>
                      <rect x="108" y="218" width="34" height="66" rx="8" fill="#111111" stroke="#b03a2e" strokeWidth="1"/>
                      <rect x="110" y="236" width="30" height="7" rx="3" fill="#1a1a1a" stroke="#b03a2e" strokeWidth="0.6" strokeOpacity="0.4"/>
                      <rect x="48"  y="272" width="50" height="16" rx="6" fill="#1a1a1a" stroke="#b03a2e" strokeWidth="0.9" strokeOpacity="0.5"/>
                      <rect x="102" y="272" width="50" height="16" rx="6" fill="#1a1a1a" stroke="#b03a2e" strokeWidth="0.9" strokeOpacity="0.5"/>
                      <rect x="48"  y="284" width="50" height="4" rx="2" fill="#b03a2e" opacity="0.12"/>
                      <rect x="102" y="284" width="50" height="4" rx="2" fill="#b03a2e" opacity="0.12"/>
                    </svg>
                    <div className="ht-c1" style={{position:'absolute',top:'8%',right:'-8%',background:'var(--bg-card)',border:'1px solid var(--border)',borderRadius:'6px',padding:'0.75rem 1rem',backdropFilter:'blur(12px)',zIndex:10}}>
                      <p style={{fontSize:'0.65rem',color:'var(--text-muted)',fontFamily:'var(--font-display)',letterSpacing:'0.1em'}}>EFFICIENCY</p>
                      <p style={{fontSize:'1.1rem',fontFamily:'var(--font-display)',fontWeight:700,color:'var(--red-bright)'}}>99.8%</p>
                    </div>
                    <div className="ht-c2" style={{position:'absolute',bottom:'10%',left:'-8%',background:'var(--bg-card)',border:'1px solid var(--border)',borderRadius:'6px',padding:'0.75rem 1rem',backdropFilter:'blur(12px)',zIndex:10}}>
                      <p style={{fontSize:'0.65rem',color:'var(--text-muted)',fontFamily:'var(--font-display)',letterSpacing:'0.1em'}}>UPTIME</p>
                      <p style={{fontSize:'1.1rem',fontFamily:'var(--font-display)',fontWeight:700,color:'var(--red-bright)'}}>24 / 7</p>
                    </div>
                  </div>
                </div>
                <div style={{position:'absolute',bottom:'0.5rem',left:'50%',transform:'translateX(-50%)',display:'flex',alignItems:'center',gap:'8px',opacity:0.45,animation:'fadeInUp 0.5s ease 1.8s both'}}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--red-bright)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
                  <span style={{fontFamily:'var(--font-display)',fontSize:'0.55rem',letterSpacing:'0.15em',color:'var(--red-bright)',textTransform:'uppercase'}}>move mouse</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--red-bright)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                </div>
              </div>
            </div>

            {/* stats */}
            <div className="ht-stats" style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'1px',background:'var(--border)',borderTop:'1px solid var(--border)',marginTop:'4rem',borderRadius:'4px',overflow:'hidden'}}>
              {stats.map((s,i)=>(
                <div key={s.label} className={`ht-s${i}`} style={{background:'var(--bg-card)',padding:'2rem 1.5rem',textAlign:'center',position:'relative',transition:'background 0.3s',cursor:'default'}} onMouseEnter={e=>((e.currentTarget as HTMLElement).style.background='var(--bg-700)')} onMouseLeave={e=>((e.currentTarget as HTMLElement).style.background='var(--bg-card)')}>
                  {i===0&&<div style={{position:'absolute',top:0,left:'50%',transform:'translateX(-50%)',width:'40px',height:'2px',background:'var(--red-bright)',boxShadow:'0 0 10px var(--red-glow)'}}/>}
                  <p style={{fontFamily:'var(--font-display)',fontSize:'2rem',fontWeight:800,color:'var(--text-primary)',marginBottom:'0.35rem'}}>{s.value}</p>
                  <p style={{fontFamily:'var(--font-light)',fontSize:'0.78rem',color:'var(--text-muted)',letterSpacing:'0.08em',textTransform:'uppercase'}}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ════════════════ TECH LAYER ════════════════ */}
        <div ref={techLayerRef} id="about" style={{position:'absolute',inset:0,zIndex:10,opacity:0,pointerEvents:'none',overflowY:'auto',paddingTop:'6rem',paddingBottom:'4rem',background:'var(--bg-800)'}}>
          <div className="container-allbotix">
            <div className="ht-2col" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'5rem',alignItems:'center'}}>

              {/* left — tech robot panel */}
              <div ref={techRobotRef} className="ht-rev ht-fl" style={{position:'relative',opacity:0}}>
                <div className="ts-panel" style={{position:'relative',borderRadius:'6px',overflow:'hidden',border:'1px solid var(--border)',aspectRatio:'4/3',background:'var(--bg-700)',display:'flex',alignItems:'center',justifyContent:'center'}}>
                  <div className="ts-scan"/>
                  {/* TECH ROBOT: seated engineer at workstation — same parts rearranged */}
                  <svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:'100%',height:'100%'}}>
                    <rect width="400" height="300" fill="#0f0f0f"/>
                    {[0,1,2,3,4,5,6,7].map(i=><line key={`h${i}`} x1="0" y1={i*44} x2="400" y2={i*44} stroke="#1a1a1a" strokeWidth="1"/>)}
                    {[0,1,2,3,4,5,6,7,8,9].map(i=><line key={`v${i}`} x1={i*46} y1="0" x2={i*46} y2="300" stroke="#1a1a1a" strokeWidth="1"/>)}
                    {/* DESK (leg pieces → horizontal table) */}
                    <rect x="55"  y="188" width="290" height="11" rx="4" fill="#111111" stroke="#b03a2e" strokeWidth="1"/>
                    <rect x="74"  y="199" width="14" height="68" rx="5" fill="#111111" stroke="#b03a2e" strokeWidth="0.9"/>
                    <rect x="312" y="199" width="14" height="68" rx="5" fill="#111111" stroke="#b03a2e" strokeWidth="0.9"/>
                    <rect x="62"  y="263" width="40" height="8" rx="3" fill="#1a1a1a" stroke="#b03a2e" strokeWidth="0.7" strokeOpacity="0.5"/>
                    <rect x="298" y="263" width="40" height="8" rx="3" fill="#1a1a1a" stroke="#b03a2e" strokeWidth="0.7" strokeOpacity="0.5"/>
                    {/* MONITOR (body → bezel, chest → screen) */}
                    <rect x="192" y="152" width="22" height="38" rx="4" fill="#141414" stroke="#b03a2e" strokeWidth="0.8" strokeOpacity="0.5"/>
                    <rect x="174" y="187" width="58" height="5" rx="2" fill="#1a1a1a" stroke="#b03a2e" strokeWidth="0.6" strokeOpacity="0.4"/>
                    <rect x="112" y="28"  width="182" height="128" rx="10" fill="#111111" stroke="#b03a2e" strokeWidth="1.3"/>
                    <rect className="tr-screen" x="120" y="36" width="166" height="110" rx="6" fill="#090909" stroke="#b03a2e" strokeWidth="0.9" strokeOpacity="0.45"/>
                    {/* screen code lines */}
                    <rect x="130" y="48" width="85"  height="4" rx="2" fill="#b03a2e" opacity="0.55"/>
                    <rect x="130" y="58" width="125" height="4" rx="2" fill="#b03a2e" opacity="0.30"><animate attributeName="width" values="125;100;125" dur="3s" repeatCount="indefinite"/></rect>
                    <rect x="130" y="68" width="65"  height="4" rx="2" fill="#b03a2e" opacity="0.40"/>
                    <rect x="130" y="78" width="95"  height="4" rx="2" fill="#b03a2e" opacity="0.25"><animate attributeName="width" values="95;140;95" dur="2.5s" repeatCount="indefinite"/></rect>
                    <rect x="130" y="88" width="75"  height="4" rx="2" fill="#b03a2e" opacity="0.35"/>
                    <rect x="130" y="98" width="115" height="4" rx="2" fill="#b03a2e" opacity="0.20"><animate attributeName="width" values="115;85;115" dur="3.8s" repeatCount="indefinite"/></rect>
                    <rect x="130" y="108" width="55" height="4" rx="2" fill="#b03a2e" opacity="0.45"/>
                    <rect x="130" y="118" width="135" height="4" rx="2" fill="#b03a2e" opacity="0.30"><animate attributeName="width" values="135;105;135" dur="2s" repeatCount="indefinite"/></rect>
                    <rect x="130" y="128" width="8" height="10" rx="1" fill="#b03a2e" opacity="0.9"><animate attributeName="opacity" values="0.9;0;0.9" dur="1s" repeatCount="indefinite"/></rect>
                    {/* status lights (chest lights → bezel dots) */}
                    <circle className="tr-light" cx="124" cy="42" r="4" fill="#b03a2e"/>
                    <circle cx="134" cy="42" r="4" fill="#b03a2e" opacity="0.5"><animate attributeName="opacity" values="0.5;0.9;0.5" dur="1.4s" repeatCount="indefinite"/></circle>
                    <circle cx="144" cy="42" r="4" fill="#b03a2e" opacity="0.3"><animate attributeName="opacity" values="0.3;0.7;0.3" dur="2s" repeatCount="indefinite"/></circle>
                    {/* ROBOT (head+neck → seated figure behind desk) */}
                    <rect x="32"  y="199" width="58" height="66" rx="8"  fill="#111111" stroke="#b03a2e" strokeWidth="1"/>
                    <rect x="40"  y="212" width="42" height="34" rx="5"  fill="#1a1a1a" stroke="#b03a2e" strokeWidth="0.7" strokeOpacity="0.4"/>
                    <rect x="49"  y="185" width="24" height="15" rx="4"  fill="#141414" stroke="#b03a2e" strokeWidth="0.8" strokeOpacity="0.5"/>
                    <rect x="30"  y="132" width="62" height="54" rx="10" fill="#1a1a1a" stroke="#b03a2e" strokeWidth="1.3"/>
                    <rect x="26"  y="136" width="8"  height="46" rx="4"  fill="#141414" stroke="#b03a2e" strokeWidth="0.7" strokeOpacity="0.5"/>
                    <rect x="88"  y="136" width="8"  height="46" rx="4"  fill="#141414" stroke="#b03a2e" strokeWidth="0.7" strokeOpacity="0.5"/>
                    <rect x="42"  y="148" width="15" height="10" rx="3" fill="#b03a2e"><animate attributeName="opacity" values="0.9;0.5;0.9" dur="2.2s" repeatCount="indefinite"/></rect>
                    <rect x="64"  y="148" width="15" height="10" rx="3" fill="#b03a2e"><animate attributeName="opacity" values="0.9;0.5;0.9" dur="2.2s" begin="0.4s" repeatCount="indefinite"/></rect>
                    <rect x="46"  y="150" width="9"  height="6"  rx="2" fill="#ff6666" opacity="0.6"/>
                    <rect x="68"  y="150" width="9"  height="6"  rx="2" fill="#ff6666" opacity="0.6"/>
                    <line x1="61" y1="132" x2="61" y2="118" stroke="#b03a2e" strokeWidth="1.5"/>
                    <circle cx="61" cy="116" r="3" fill="#b03a2e"><animate attributeName="r" values="3;4.5;3" dur="2s" repeatCount="indefinite"/></circle>
                    {/* ARM reaching to keyboard */}
                    <g className="tr-arm">
                      <rect x="86"  y="172" width="58" height="11" rx="5" fill="#111111" stroke="#b03a2e" strokeWidth="0.9"/>
                      <rect x="138" y="168" width="13" height="20" rx="4" fill="#1a1a1a" stroke="#b03a2e" strokeWidth="0.8" strokeOpacity="0.5"/>
                    </g>
                    {/* keyboard */}
                    <rect x="118" y="188" width="82" height="13" rx="3" fill="#141414" stroke="#b03a2e" strokeWidth="0.8" strokeOpacity="0.4"/>
                    {[0,1,2,3,4,5,6].map(i=><rect key={i} x={122+i*10} y="191" width="8" height="5" rx="1" fill="#1a1a1a" stroke="#b03a2e" strokeWidth="0.4" strokeOpacity="0.5"/>)}
                    <defs><radialGradient id="tr-rg" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#b03a2e" stopOpacity="0.10"/><stop offset="100%" stopColor="#b03a2e" stopOpacity="0"/></radialGradient></defs>
                    <rect width="400" height="300" fill="url(#tr-rg)"/>
                  </svg>
                  <div className="ts-label" style={{position:'absolute',bottom:'1rem',left:'1rem',background:'rgba(8,8,8,0.85)',border:'1px solid var(--border)',borderRadius:'4px',padding:'0.5rem 0.85rem',backdropFilter:'blur(8px)',zIndex:4}}>
                    <p style={{fontFamily:'var(--font-display)',fontSize:'0.6rem',color:'var(--red-bright)',letterSpacing:'0.15em'}}>INDUSTRIAL AUTOMATION</p>
                  </div>
                </div>
                <div className="ts-badge" style={{position:'absolute',bottom:'-1.5rem',right:'-1.5rem',background:'var(--red)',borderRadius:'6px',padding:'1.25rem 1.5rem',textAlign:'center',boxShadow:'0 0 40px rgba(176,58,46,0.3)',zIndex:5}}>
                  <p style={{fontFamily:'var(--font-display)',fontSize:'2rem',fontWeight:900,color:'#fff',lineHeight:1}}>15+</p>
                  <p style={{fontFamily:'var(--font-light)',fontSize:'0.72rem',color:'rgba(255,255,255,0.8)',marginTop:'4px',letterSpacing:'0.08em'}}>Years<br/>Experience</p>
                </div>
              </div>

              {/* right — tech content */}
              <div className="ht-rev ht-fr">
                <div className="section-tag ht-rev ht-d1">About Our Technology</div>
                <h2 className="section-title ht-rev ht-d2" style={{marginBottom:'1rem'}}>Our Technology Help the <span>Industry.</span></h2>
                <div className="red-divider ts-divider" style={{marginBottom:'1rem'}}/>
                <p className="ht-rev ht-d3" style={{marginBottom:'2rem',lineHeight:1.9,fontSize:'0.95rem'}}>
                  A new path forward for tomorrow's manufacturing. We deliver intelligent robotic systems that transform how industries operate — faster, smarter, and more reliably than ever before.
                </p>
                <div style={{display:'flex',flexDirection:'column',gap:'1.5rem',marginBottom:'2.5rem'}}>
                  {features.map((f,i)=>(
                    <div key={f.title} className="ht-rev" style={{display:'flex',gap:'1rem',alignItems:'flex-start',transitionDelay:`${0.1+i*0.14}s`}}>
                      <div className="icon-circle ts-icon" style={{marginTop:'2px',flexShrink:0}}>{f.icon}</div>
                      <div>
                        <h4 style={{fontFamily:'var(--font-display)',fontSize:'0.85rem',fontWeight:700,color:'var(--text-primary)',marginBottom:'4px',letterSpacing:'0.05em'}}>{f.title}</h4>
                        <p style={{fontSize:'0.88rem',lineHeight:1.7,color:'var(--text-secondary)'}}>{f.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="ht-rev ht-d5">
                  <Link href="/solutions" className="btn-primary">Explore Solution <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></Link>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>{/* /sticky */}
    </div>
  )
}