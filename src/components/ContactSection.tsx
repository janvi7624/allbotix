'use client'

import { useRef, useState, useEffect } from 'react'
import { INFO, SERVICES } from '@/data/contacts'
import { socialIcons } from '@/data/footer'

/* ─── Floating label input with magnetic tilt ────────────────────────────── */
function Field({ label, name, type='text', required=false, half=false, value, onChange }: {
  label:string; name:string; type?:string; required?:boolean; half?:boolean; value:string; onChange:(v:string)=>void
}) {
  const [focused, setFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const active = focused || value.length > 0

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = inputRef.current; if (!el) return
    const r = el.getBoundingClientRect()
    const dx = (e.clientX - r.left - r.width/2)/(r.width/2)
    const dy = (e.clientY - r.top - r.height/2)/(r.height/2)
    el.style.transform = `perspective(500px) rotateX(${-dy*3}deg) rotateY(${dx*3}deg) translateZ(4px)`
  }
  const onLeave = () => { if (inputRef.current) inputRef.current.style.transform = 'perspective(500px) rotateX(0) rotateY(0) translateZ(0)' }

  return (
    <div style={{ position:'relative', gridColumn: half?'span 1':'span 2' }} onMouseMove={onMove} onMouseLeave={onLeave}>
      <label style={{
        position:'absolute', left:'14px',
        top: active ? '-9px' : '14px',
        fontFamily:'var(--font-display)',
        fontSize: active ? '0.55rem' : '0.78rem',
        letterSpacing: active ? '0.18em' : '0.06em',
        textTransform: active ? 'uppercase' : 'none',
        color: focused ? 'var(--red-bright)' : active ? 'rgba(176,58,46,0.7)' : 'var(--text-muted)',
        background: active ? 'var(--bg-card)' : 'transparent',
        padding: active ? '0 6px' : '0',
        transition:'all 0.25s cubic-bezier(0.23,1,0.32,1)',
        pointerEvents:'none', zIndex:2,
      }}>
        {label}{required && <span style={{ color:'var(--red-bright)', marginLeft:'2px' }}>*</span>}
      </label>
      <input ref={inputRef} type={type} name={name} required={required} value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{
          width:'100%', padding:'14px',
          background: focused ? 'rgba(176,58,46,0.05)' : 'rgba(176,58,46,0.02)',
          border:`1px solid ${focused?'rgba(176,58,46,0.6)':'rgba(176,58,46,0.18)'}`,
          borderRadius:'8px', color:'var(--text-primary)',
          fontFamily:'var(--font-light)', fontSize:'0.88rem', outline:'none',
          transition:'border-color 0.25s, background 0.25s, box-shadow 0.25s, transform 0.3s cubic-bezier(0.23,1,0.32,1)',
          boxShadow: focused ? '0 0 24px rgba(176,58,46,0.15),inset 0 1px 0 rgba(176,58,46,0.1)' : 'none',
          transformStyle:'preserve-3d',
        }}
      />
      <div style={{
        position:'absolute', bottom:0, left:'14px', right:'14px', height:'1px',
        background:'linear-gradient(90deg,transparent,var(--red-bright),transparent)',
        transform: focused?'scaleX(1)':'scaleX(0)',
        transition:'transform 0.4s cubic-bezier(0.23,1,0.32,1)',
      }}/>
    </div>
  )
}

function TextArea({ label, name, required=false, value, onChange }: {
  label:string; name:string; required?:boolean; value:string; onChange:(v:string)=>void
}) {
  const [focused, setFocused] = useState(false)
  const active = focused || value.length > 0
  return (
    <div style={{ position:'relative', gridColumn:'span 2' }}>
      <label style={{
        position:'absolute', left:'14px', top: active?'-9px':'14px',
        fontFamily:'var(--font-display)',
        fontSize: active?'0.55rem':'0.78rem', letterSpacing: active?'0.18em':'0.06em',
        textTransform: active?'uppercase':'none',
        color: focused?'var(--red-bright)':active?'rgba(176,58,46,0.7)':'var(--text-muted)',
        background: active?'var(--bg-card)':'transparent',
        padding: active?'0 6px':'0',
        transition:'all 0.25s cubic-bezier(0.23,1,0.32,1)', pointerEvents:'none', zIndex:2,
      }}>
        {label}{required && <span style={{ color:'var(--red-bright)', marginLeft:'2px' }}>*</span>}
      </label>
      <textarea name={name} required={required} rows={4} value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{
          width:'100%', padding:'14px',
          background: focused?'rgba(176,58,46,0.05)':'rgba(176,58,46,0.02)',
          border:`1px solid ${focused?'rgba(176,58,46,0.6)':'rgba(176,58,46,0.18)'}`,
          borderRadius:'8px', color:'var(--text-primary)',
          fontFamily:'var(--font-light)', fontSize:'0.88rem', outline:'none', resize:'none',
          transition:'border-color 0.25s, background 0.25s, box-shadow 0.25s',
          boxShadow: focused?'0 0 24px rgba(176,58,46,0.15),inset 0 1px 0 rgba(176,58,46,0.1)':'none',
        }}
      />
      <div style={{
        position:'absolute', bottom:0, left:'14px', right:'14px', height:'1px',
        background:'linear-gradient(90deg,transparent,var(--red-bright),transparent)',
        transform: focused?'scaleX(1)':'scaleX(0)',
        transition:'transform 0.4s cubic-bezier(0.23,1,0.32,1)',
      }}/>
    </div>
  )
}

/* ─── 3D Info card ───────────────────────────────────────────────────────── */
function InfoCard3D({ item, index, visible }: { item:typeof INFO[0]; index:number; visible:boolean }) {
  const cardRef  = useRef<HTMLDivElement>(null)
  const shineRef = useRef<HTMLDivElement>(null)
  const [hovered, setHovered] = useState(false)

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current; if (!el) return
    const r = el.getBoundingClientRect()
    const dx = (e.clientX-r.left-r.width/2)/(r.width/2)
    const dy = (e.clientY-r.top-r.height/2)/(r.height/2)
    el.style.transform = `perspective(600px) rotateX(${-dy*12}deg) rotateY(${dx*12}deg) scale3d(1.04,1.04,1.04) translateZ(8px)`
    if (shineRef.current) {
      const px = ((e.clientX-r.left)/r.width)*100
      const py = ((e.clientY-r.top)/r.height)*100
      shineRef.current.style.background = `radial-gradient(circle at ${px}% ${py}%, rgba(232,57,42,0.14) 0%, transparent 58%)`
      shineRef.current.style.opacity = '1'
    }
  }
  const onLeave = () => {
    if (cardRef.current) cardRef.current.style.transform = 'perspective(600px) rotateX(0) rotateY(0) scale3d(1,1,1) translateZ(0)'
    if (shineRef.current) shineRef.current.style.opacity = '0'
    setHovered(false)
  }

  return (
    <div ref={cardRef} onMouseMove={onMove} onMouseEnter={()=>setHovered(true)} onMouseLeave={onLeave}
      style={{
        position:'relative', padding:'1.5rem',
        background: hovered?'rgba(22,14,14,0.98)':'var(--bg-card)',
        border:`1px solid ${hovered?'rgba(176,58,46,0.5)':'rgba(176,58,46,0.15)'}`,
        borderRadius:'10px', display:'flex', gap:'1rem', alignItems:'flex-start',
        transformStyle:'preserve-3d', cursor:'default', overflow:'hidden',
        transition:'transform 0.45s cubic-bezier(0.23,1,0.32,1), border-color 0.3s, box-shadow 0.4s, background 0.3s',
        boxShadow: hovered?'0 24px 60px rgba(0,0,0,0.6),0 0 30px rgba(176,58,46,0.12)':'none',
        opacity: visible?1:0,
        translate: visible?'0 0':'-30px 0',
        filter: visible?'none':'blur(4px)',
        transitionProperty:'transform,border-color,box-shadow,background,opacity,translate,filter',
        transitionDuration:'0.45s,0.3s,0.4s,0.3s,0.6s,0.6s,0.6s',
        transitionDelay:`0s,0s,0s,0s,${index*0.13+0.08}s,${index*0.13+0.08}s,${index*0.13+0.08}s`,
      }}
    >
      <div ref={shineRef} aria-hidden="true" style={{ position:'absolute',inset:0,borderRadius:'10px',pointerEvents:'none',opacity:0,transition:'opacity 0.3s',zIndex:1 }}/>
      <div style={{
        width:'42px', height:'42px', flexShrink:0,
        display:'flex', alignItems:'center', justifyContent:'center',
        border:'1px solid rgba(176,58,46,0.3)', borderRadius:'8px',
        background: hovered?'rgba(176,58,46,0.12)':'rgba(176,58,46,0.06)',
        color:'var(--red-bright)',
        transform: hovered?'translateZ(22px) scale(1.1)':'translateZ(0) scale(1)',
        transition:'transform 0.45s cubic-bezier(0.23,1,0.32,1), background 0.3s',
        filter: hovered?'drop-shadow(0 0 8px rgba(176,58,46,0.55))':'none',
        animation:`iconFloat 3s ease-in-out ${index*0.5}s infinite`,
        position:'relative', zIndex:2,
      }}>
        <div style={{ width:'18px', height:'18px' }}>{item.icon}</div>
      </div>
      <div style={{ transform:hovered?'translateZ(12px)':'translateZ(0)', transition:'transform 0.45s cubic-bezier(0.23,1,0.32,1)', position:'relative', zIndex:2 }}>
        <p style={{ fontFamily:'var(--font-display)', fontSize:'0.55rem', letterSpacing:'0.18em', textTransform:'uppercase', color:'var(--red-bright)', marginBottom:'4px' }}>{item.label}</p>
        <p style={{ fontFamily:'var(--font-display)', fontSize:'0.88rem', fontWeight:700, color:'var(--text-primary)', marginBottom:'3px' }}>{item.value}</p>
        <p style={{ fontFamily:'var(--font-light)', fontSize:'0.75rem', color:'var(--text-muted)', lineHeight:1.6 }}>{item.sub}</p>
      </div>
      <div style={{ position:'absolute',bottom:0,left:0,right:0,height:'2px', background:'linear-gradient(90deg,var(--red-bright),transparent)', borderRadius:'0 0 10px 10px', transform:hovered?'scaleX(1)':'scaleX(0)', transformOrigin:'left', transition:'transform 0.4s cubic-bezier(0.23,1,0.32,1)' }}/>
    </div>
  )
}

/* ─── Particle canvas ────────────────────────────────────────────────────── */
function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return
    const ctx = canvas.getContext('2d')!
    let w = canvas.offsetWidth, h = canvas.offsetHeight
    canvas.width = w; canvas.height = h
    const pts = Array.from({ length: 55 }, () => ({
      x: Math.random()*w, y: Math.random()*h,
      vx: (Math.random()-0.5)*0.35, vy: (Math.random()-0.5)*0.35,
      r: Math.random()*1.8+0.4, o: Math.random()*0.5+0.15,
    }))
    let raf: number
    const draw = () => {
      ctx.clearRect(0,0,w,h)
      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy
        if (p.x<0) p.x=w; if (p.x>w) p.x=0
        if (p.y<0) p.y=h; if (p.y>h) p.y=0
        ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2)
        ctx.fillStyle = `rgba(176,58,46,${p.o})`; ctx.fill()
      })
      for (let i=0;i<pts.length;i++) for (let j=i+1;j<pts.length;j++) {
        const dx=pts[i].x-pts[j].x, dy=pts[i].y-pts[j].y, d=Math.sqrt(dx*dx+dy*dy)
        if (d<110) { ctx.beginPath(); ctx.strokeStyle=`rgba(176,58,46,${0.12*(1-d/110)})`; ctx.lineWidth=0.6; ctx.moveTo(pts[i].x,pts[i].y); ctx.lineTo(pts[j].x,pts[j].y); ctx.stroke() }
      }
      raf = requestAnimationFrame(draw)
    }
    draw()
    const resize = () => { w=canvas.offsetWidth; h=canvas.offsetHeight; canvas.width=w; canvas.height=h }
    window.addEventListener('resize',resize)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize',resize) }
  }, [])
  return <canvas ref={canvasRef} style={{ position:'absolute', inset:0, width:'100%', height:'100%', pointerEvents:'none', zIndex:0 }}/>
}

/* ─── 3D Floating Robot ──────────────────────────────────────────────────── */
function FloatingRobot({ visible }: { visible:boolean }) {
  const wrapRef  = useRef<HTMLDivElement>(null)
  const robotRef = useRef<HTMLDivElement>(null)
  const cur = useRef({ x:0, y:0 })
  const tgt = useRef({ x:0, y:0 })
  const raf = useRef<number|null>(null)

  useEffect(() => {
    const section = wrapRef.current?.closest('section') as HTMLElement|null
    const onMove = (e: MouseEvent) => {
      const r = section?.getBoundingClientRect(); if (!r) return
      tgt.current = { x:((e.clientY-r.top)/r.height*2-1)*-20, y:((e.clientX-r.left)/r.width*2-1)*28 }
    }
    const onLeave = () => { tgt.current={x:0,y:0} }
    const tick = () => {
      cur.current.x += (tgt.current.x-cur.current.x)*0.055
      cur.current.y += (tgt.current.y-cur.current.y)*0.055
      if (robotRef.current) robotRef.current.style.transform = `perspective(500px) rotateX(${cur.current.x}deg) rotateY(${cur.current.y}deg)`
      raf.current = requestAnimationFrame(tick)
    }
    section?.addEventListener('mousemove',onMove); section?.addEventListener('mouseleave',onLeave)
    raf.current = requestAnimationFrame(tick)
    return () => { section?.removeEventListener('mousemove',onMove); section?.removeEventListener('mouseleave',onLeave); if(raf.current) cancelAnimationFrame(raf.current) }
  }, [])

  return (
    <div ref={wrapRef} style={{ display:'flex',alignItems:'center',justifyContent:'center',position:'relative',zIndex:2, opacity:visible?1:0, transform:visible?'translateY(0)':'translateY(40px)', transition:'opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s' }}>
      {/* Rings */}
      <div aria-hidden="true" style={{ position:'absolute',width:'280px',height:'280px',borderRadius:'50%',border:'1px dashed rgba(176,58,46,0.2)',top:'50%',left:'50%',transform:'translate(-50%,-50%)',animation:'ringCW 20s linear infinite',pointerEvents:'none' }}/>
      <div aria-hidden="true" style={{ position:'absolute',width:'210px',height:'210px',borderRadius:'50%',border:'1px solid rgba(176,58,46,0.26)',top:'50%',left:'50%',transform:'translate(-50%,-50%)',animation:'ringCCW 14s linear infinite',pointerEvents:'none' }}/>
      <div aria-hidden="true" style={{ position:'absolute',width:'230px',height:'230px',borderRadius:'50%',background:'radial-gradient(circle,rgba(176,58,46,0.14) 0%,transparent 70%)',top:'50%',left:'50%',transform:'translate(-50%,-50%)',pointerEvents:'none',animation:'ambientPulse 3s ease-in-out infinite' }}/>
      {/* Ground shadow */}
      <div aria-hidden="true" style={{ position:'absolute',bottom:'-14px',left:'50%',transform:'translateX(-50%)',width:'120px',height:'14px',borderRadius:'50%',background:'radial-gradient(ellipse,rgba(176,58,46,0.35) 0%,transparent 70%)',filter:'blur(6px)',pointerEvents:'none' }}/>

      {/* Tilt wrapper */}
      <div ref={robotRef} style={{ transformStyle:'preserve-3d', willChange:'transform' }}>
        <div style={{ animation:'robotFloat 4s ease-in-out infinite', transformStyle:'preserve-3d' }}>
          <svg viewBox="0 0 160 225" fill="none" xmlns="http://www.w3.org/2000/svg"
            style={{ width:'160px',height:'225px',filter:'drop-shadow(0 0 28px rgba(176,58,46,0.4))',overflow:'visible' }} overflow="visible">
            {/* HEAD */}
            <rect x="36" y="18" width="10" height="52" rx="5" fill="#141414" stroke="#b03a2e" strokeWidth="0.7" strokeOpacity="0.5"/>
            <rect x="114" y="18" width="10" height="52" rx="5" fill="#141414" stroke="#b03a2e" strokeWidth="0.7" strokeOpacity="0.5"/>
            <rect x="45" y="16" width="70" height="58" rx="11" fill="#1a1a1a" stroke="#b03a2e" strokeWidth="1.3"/>
            <rect x="47" y="16" width="66" height="3" rx="2" fill="#b03a2e" opacity="0.18"/>
            {/* Eyes */}
            <rect x="56" y="28" width="20" height="13" rx="3" fill="#b03a2e"><animate attributeName="opacity" values="0.9;0.45;0.9" dur="2.2s" repeatCount="indefinite"/></rect>
            <rect x="84" y="28" width="20" height="13" rx="3" fill="#b03a2e"><animate attributeName="opacity" values="0.9;0.45;0.9" dur="2.2s" begin="0.4s" repeatCount="indefinite"/></rect>
            <rect x="59" y="30" width="14" height="9" rx="2" fill="#ff6666" opacity="0.65"/>
            <rect x="87" y="30" width="14" height="9" rx="2" fill="#ff6666" opacity="0.65"/>
            {/* Mouth */}
            <rect x="62" y="53" width="36" height="5" rx="2" fill="#b03a2e" opacity="0.55"><animate attributeName="width" values="36;28;36" dur="3s" repeatCount="indefinite"/><animate attributeName="x" values="62;66;62" dur="3s" repeatCount="indefinite"/></rect>
            {/* Antenna */}
            <line x1="80" y1="16" x2="80" y2="2" stroke="#b03a2e" strokeWidth="1.6"/>
            <circle cx="80" cy="1.5" r="4" fill="#b03a2e"><animate attributeName="filter" values="none;drop-shadow(0 0 8px #ff5555);none" dur="2s" repeatCount="indefinite"/></circle>
            <line x1="80" y1="8" x2="90" y2="4" stroke="#b03a2e" strokeWidth="0.7" strokeOpacity="0.5"/>
            <line x1="80" y1="8" x2="70" y2="4" stroke="#b03a2e" strokeWidth="0.7" strokeOpacity="0.5"/>
            {/* NECK */}
            <rect x="68" y="74" width="24" height="13" rx="4" fill="#141414" stroke="#b03a2e" strokeWidth="0.8" strokeOpacity="0.5"/>
            <circle cx="73" cy="80" r="2" fill="#b03a2e" opacity="0.4"/>
            <circle cx="87" cy="80" r="2" fill="#b03a2e" opacity="0.4"/>
            {/* BODY */}
            <rect x="35" y="87" width="12" height="80" rx="5" fill="#141414" stroke="#b03a2e" strokeWidth="0.7" strokeOpacity="0.5"/>
            <rect x="113" y="87" width="12" height="80" rx="5" fill="#141414" stroke="#b03a2e" strokeWidth="0.7" strokeOpacity="0.5"/>
            <rect x="38" y="87" width="84" height="82" rx="9" fill="#111" stroke="#b03a2e" strokeWidth="1.2"/>
            <rect x="50" y="97" width="60" height="46" rx="5" fill="#1a1a1a" stroke="#b03a2e" strokeWidth="0.8" strokeOpacity="0.4"/>
            {/* Chest lights */}
            <circle cx="67" cy="114" r="7" fill="#b03a2e"><animate attributeName="opacity" values="0.8;1;0.8" dur="1.8s" repeatCount="indefinite"/></circle>
            <circle cx="80" cy="114" r="4" fill="#b03a2e" opacity="0.4"><animate attributeName="opacity" values="0.4;0.8;0.4" dur="1.8s" begin="0.3s" repeatCount="indefinite"/></circle>
            <circle cx="93" cy="114" r="7" fill="#b03a2e"><animate attributeName="opacity" values="0.8;1;0.8" dur="1.8s" begin="0.6s" repeatCount="indefinite"/></circle>
            <circle cx="67" cy="114" r="12" fill="#b03a2e" opacity="0.07"/>
            <circle cx="93" cy="114" r="12" fill="#b03a2e" opacity="0.07"/>
            {/* Data lines */}
            <line x1="53" y1="128" x2="107" y2="128" stroke="#b03a2e" strokeWidth="0.6" strokeOpacity="0.35"/>
            <line x1="53" y1="135" x2="87" y2="135" stroke="#b03a2e" strokeWidth="0.6" strokeOpacity="0.25"><animate attributeName="x2" values="87;105;87" dur="2.5s" repeatCount="indefinite"/></line>
            {/* ARMS */}
            <g style={{ transformOrigin:'22px 91px', animation:'armSwing 4s ease-in-out infinite' }}>
              <rect x="14" y="89" width="18" height="64" rx="7" fill="#111" stroke="#b03a2e" strokeWidth="1"/>
              <rect x="17" y="97" width="12" height="27" rx="3" fill="#1a1a1a"/>
              <circle cx="23" cy="132" r="5" fill="#1a1a1a" stroke="#b03a2e" strokeWidth="0.7" strokeOpacity="0.5"/>
              <rect x="11" y="150" width="21" height="8" rx="4" fill="#1a1a1a" stroke="#b03a2e" strokeWidth="0.7" strokeOpacity="0.4"/>
            </g>
            <g style={{ transformOrigin:'138px 91px', animation:'armSwing 4s ease-in-out 0.5s infinite reverse' }}>
              <rect x="128" y="89" width="18" height="64" rx="7" fill="#111" stroke="#b03a2e" strokeWidth="1"/>
              <rect x="131" y="97" width="12" height="27" rx="3" fill="#1a1a1a"/>
              <circle cx="137" cy="132" r="5" fill="#1a1a1a" stroke="#b03a2e" strokeWidth="0.7" strokeOpacity="0.5"/>
              <rect x="128" y="150" width="21" height="8" rx="4" fill="#1a1a1a" stroke="#b03a2e" strokeWidth="0.7" strokeOpacity="0.4"/>
            </g>
            {/* LEGS */}
            <rect x="55" y="169" width="4" height="54" rx="3" fill="#141414" stroke="#b03a2e" strokeWidth="0.6" strokeOpacity="0.4"/>
            <rect x="101" y="169" width="4" height="54" rx="3" fill="#141414" stroke="#b03a2e" strokeWidth="0.6" strokeOpacity="0.4"/>
            <rect x="47" y="169" width="30" height="52" rx="7" fill="#111" stroke="#b03a2e" strokeWidth="1"/>
            <rect x="83" y="169" width="30" height="52" rx="7" fill="#111" stroke="#b03a2e" strokeWidth="1"/>
            <rect x="49" y="183" width="26" height="6" rx="3" fill="#1a1a1a" stroke="#b03a2e" strokeWidth="0.6" strokeOpacity="0.35"/>
            <rect x="85" y="183" width="26" height="6" rx="3" fill="#1a1a1a" stroke="#b03a2e" strokeWidth="0.6" strokeOpacity="0.35"/>
            {/* Feet */}
            <rect x="41" y="212" width="42" height="12" rx="5" fill="#1a1a1a" stroke="#b03a2e" strokeWidth="0.8" strokeOpacity="0.5"/>
            <rect x="77" y="212" width="42" height="12" rx="5" fill="#1a1a1a" stroke="#b03a2e" strokeWidth="0.8" strokeOpacity="0.5"/>
            <rect x="41" y="220" width="42" height="4" rx="2" fill="#b03a2e" opacity="0.1"/>
            <rect x="77" y="220" width="42" height="4" rx="2" fill="#b03a2e" opacity="0.1"/>
          </svg>
        </div>
      </div>

      {/* Floating chips */}
      <div style={{ position:'absolute', top:'4%', right:'-20%', animation:'chipFloat 3.5s ease-in-out 0.3s infinite', zIndex:3 }}>
        <div style={{ background:'rgba(8,8,8,0.92)', border:'1px solid rgba(176,58,46,0.45)', borderRadius:'8px', padding:'8px 14px', backdropFilter:'blur(12px)', boxShadow:'0 8px 24px rgba(0,0,0,0.55)' }}>
          <p style={{ fontFamily:'var(--font-display)', fontSize:'0.48rem', letterSpacing:'0.14em', color:'var(--red-bright)', textTransform:'uppercase', marginBottom:'2px' }}>Response</p>
          <p style={{ fontFamily:'var(--font-display)', fontSize:'0.9rem', fontWeight:700, color:'#fff' }}>{'< 24h'}</p>
        </div>
      </div>
      <div style={{ position:'absolute', bottom:'6%', left:'-20%', animation:'chipFloat 3.5s ease-in-out 1s infinite', zIndex:3 }}>
        <div style={{ background:'rgba(8,8,8,0.92)', border:'1px solid rgba(176,58,46,0.45)', borderRadius:'8px', padding:'8px 14px', backdropFilter:'blur(12px)', boxShadow:'0 8px 24px rgba(0,0,0,0.55)' }}>
          <p style={{ fontFamily:'var(--font-display)', fontSize:'0.48rem', letterSpacing:'0.14em', color:'var(--red-bright)', textTransform:'uppercase', marginBottom:'2px' }}>Support</p>
          <p style={{ fontFamily:'var(--font-display)', fontSize:'0.9rem', fontWeight:700, color:'#fff' }}>24 / 7</p>
        </div>
      </div>
    </div>
  )
}

/* ─── Map Section ────────────────────────────────────────────────────────── */
function MapSection({ visible }: { visible: boolean }) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [mapVisible, setMapVisible] = useState(false)
  const [mapHovered, setMapHovered] = useState(false)

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setMapVisible(true) },
      { threshold: 0.08 }
    )
    if (mapRef.current) obs.observe(mapRef.current)
    return () => obs.disconnect()
  }, [])

  const MAPS_EMBED_URL =
    'https://www.google.com/maps?q=23.0277904,72.5450819&z=17&output=embed'

  const DIRECTIONS_URL =
    'https://www.google.com/maps/dir/?api=1&destination=23.0277904,72.5450819'

  return (
    <div ref={mapRef} style={{
      marginTop: '3rem',
      opacity: mapVisible ? 1 : 0,
      transform: mapVisible ? 'translateY(0)' : 'translateY(40px)',
      filter: mapVisible ? 'none' : 'blur(6px)',
      transition: 'opacity 0.8s ease 0.1s, transform 0.8s ease 0.1s, filter 0.8s ease 0.1s',
    }}>
      {/* Section divider */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', marginBottom: '1.75rem' }}>
        <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, rgba(176,58,46,0.35), transparent)' }}/>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--red-bright)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
          </svg>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.55rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--red-bright)' }}>
            Find Us
          </span>
        </div>
        <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(176,58,46,0.35))' }}/>
      </div>

      {/* Map card */}
      <div
        onMouseEnter={() => setMapHovered(true)}
        onMouseLeave={() => setMapHovered(false)}
        style={{
          position: 'relative',
          borderRadius: '14px',
          overflow: 'hidden',
          border: `1px solid ${mapHovered ? 'rgba(176,58,46,0.45)' : 'rgba(176,58,46,0.2)'}`,
          boxShadow: mapHovered
            ? '0 32px 80px rgba(0,0,0,0.7), 0 0 40px rgba(176,58,46,0.14)'
            : '0 12px 40px rgba(0,0,0,0.4)',
          transition: 'border-color 0.3s, box-shadow 0.4s',
          background: '#0d0d0d',
        }}
      >
        {/* Top accent bar */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, var(--red-bright), var(--red-dim), transparent)', zIndex: 5 }}/>

        {/* Map iframe with dark overlay blend */}
        <div style={{ position: 'relative', height: 'clamp(240px, 45vw, 420px)' }}>
          <iframe
            title="Allbotix Location"
            src={MAPS_EMBED_URL}
            width="100%"
            height="100%"
            style={{
              border: 'none',
              display: 'block',
              filter: 'invert(92%) hue-rotate(180deg) saturate(0.85) brightness(0.88)',
              transition: 'filter 0.4s',
            }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
          {/* Dark vignette overlay for edge blending */}
          <div aria-hidden="true" style={{
            position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 2,
            background: 'radial-gradient(ellipse at center, transparent 55%, rgba(13,13,13,0.55) 100%)',
          }}/>
          {/* Corner red glow */}
          <div aria-hidden="true" style={{
            position: 'absolute', bottom: 0, left: 0, width: '220px', height: '220px',
            background: 'radial-gradient(circle at bottom left, rgba(176,58,46,0.1) 0%, transparent 70%)',
            pointerEvents: 'none', zIndex: 2,
          }}/>
        </div>

        {/* Bottom info bar */}
        <div
          className="map-bar"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            padding: '1.25rem 1.5rem',
            background: 'rgba(10,8,8,0.97)',
            borderTop: '1px solid rgba(176,58,46,0.15)',
            position: 'relative',
            zIndex: 3,
          }}
        >
          {/* Address info */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: '38px', height: '38px', flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '1px solid rgba(176,58,46,0.35)', borderRadius: '8px',
              background: 'rgba(176,58,46,0.08)', color: 'var(--red-bright)',
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
              </svg>
            </div>
            <div>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: '0.55rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--red-bright)', marginBottom: '3px' }}>
                Our Office
              </p>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '2px' }}>
                Allbotix — Ahmedabad
              </p>
              <p style={{ fontFamily: 'var(--font-light)', fontSize: '0.73rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                2nd Floor, "F" Block, Shivalik Sharda Harmony,<br/>
                Panjarapole Cross Rd, Ambawadi, Ahmedabad, Gujarat 380015
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="map-actions" style={{ display: 'flex', gap: '10px', flexShrink: 0 }}>
            {/* Get Directions button */}
            <a
              href={DIRECTIONS_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                padding: '10px 18px',
                background: 'linear-gradient(135deg, var(--red-bright), var(--red-dim))',
                border: 'none', borderRadius: '8px',
                color: '#fff', textDecoration: 'none',
                fontFamily: 'var(--font-display)', fontSize: '0.62rem',
                fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase',
                transition: 'box-shadow 0.3s, transform 0.2s',
                whiteSpace: 'nowrap', width: '100%',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 0 28px rgba(176,58,46,0.5), 0 6px 20px rgba(0,0,0,0.4)'
                ;(e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-2px)'
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLAnchorElement).style.boxShadow = 'none'
                ;(e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(0)'
              }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="3 11 22 2 13 21 11 13 3 11"/>
              </svg>
              Get Directions
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── Main ───────────────────────────────────────────────────────────────── */
export default function ContactSection() {
  const sectionRef   = useRef<HTMLElement>(null)
  const formPanelRef = useRef<HTMLDivElement>(null)
  const formCardRef  = useRef<HTMLDivElement>(null)
  const [visible,     setVisible]     = useState(false)
  const [formVisible, setFormVisible] = useState(false)
  const [submitted,   setSubmitted]   = useState(false)
  const [loading,     setLoading]     = useState(false)

  const [firstName, setFirstName] = useState('')
  const [lastName,  setLastName]  = useState('')
  const [email,     setEmail]     = useState('')
  const [phone,     setPhone]     = useState('')
  const [company,   setCompany]   = useState('')
  const [service,   setService]   = useState('')
  const [source,    setSource]    = useState('')
  const [message,   setMessage]   = useState('')
  const [agreed,    setAgreed]    = useState(false)

  useEffect(() => {
    const o1 = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true)     }, { threshold:0.06 })
    const o2 = new IntersectionObserver(([e]) => { if (e.isIntersecting) setFormVisible(true) }, { threshold:0.04 })
    if (sectionRef.current)   o1.observe(sectionRef.current)
    if (formPanelRef.current) o2.observe(formPanelRef.current)
    return () => { o1.disconnect(); o2.disconnect() }
  }, [])

  // 3D tilt on the form card
  const onFormMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = formCardRef.current; if (!el) return
    const r = el.getBoundingClientRect()
    const dx = (e.clientX-r.left-r.width/2)/(r.width/2)
    const dy = (e.clientY-r.top-r.height/2)/(r.height/2)
    el.style.transform = `perspective(1000px) rotateX(${-dy*4}deg) rotateY(${dx*4}deg) translateZ(6px)`
  }
  const onFormLeave = () => { if (formCardRef.current) formCardRef.current.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)' }

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  if (!agreed) return
  setLoading(true)
 
  try {
    const res = await fetch('/api/contact', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName,
        lastName,
        email,
        phone,
        company,
        service,
        source,
        message,
      }),
    })
 
    const data = await res.json()
 
    if (!res.ok) throw new Error(data.error ?? 'Unknown error')
 
    setSubmitted(true)
 
  } catch (err) {
    console.error('[ContactSection] submit error:', err)
    alert('Something went wrong. Please try again or email us directly.')
  } finally {
    setLoading(false)
  }
}

  return (
    <section id="contact" ref={sectionRef} style={{ position:'relative', paddingBlock:'6rem', background:'var(--bg-800)', overflow:'hidden', borderTop:'1px solid var(--border-soft)' }}>
      <style>{`
        @keyframes iconFloat   { 0%,100%{transform:translateY(0) translateZ(0)} 50%{transform:translateY(-5px) translateZ(8px)} }
        @keyframes robotFloat  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-16px)} }
        @keyframes chipFloat   { 0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(-8px) scale(1.02)} }
        @keyframes ringCW      { to{transform:translate(-50%,-50%) rotate(360deg)} }
        @keyframes ringCCW     { to{transform:translate(-50%,-50%) rotate(-360deg)} }
        @keyframes ambientPulse{ 0%,100%{opacity:0.6;transform:translate(-50%,-50%) scale(1)} 50%{opacity:1;transform:translate(-50%,-50%) scale(1.15)} }
        @keyframes armSwing    { 0%,100%{transform:rotate(0deg)} 30%{transform:rotate(6deg)} 70%{transform:rotate(-6deg)} }
        @keyframes lineGrow    { from{width:0;opacity:0} to{width:48px;opacity:1} }
        @keyframes formSlideIn { from{opacity:0;transform:translateX(50px) rotateY(-6deg) scale(0.97)} to{opacity:1;transform:translateX(0) rotateY(0) scale(1)} }
        @keyframes scanV       { 0%{top:-3%;opacity:0.5} 100%{top:108%;opacity:0} }
        @keyframes successPop  { 0%{opacity:0;transform:scale(0.75) translateY(24px)} 65%{transform:scale(1.05)} 100%{opacity:1;transform:scale(1) translateY(0)} }
        @keyframes spinLoader  { to{transform:rotate(360deg)} }
        @keyframes checkDraw   { from{stroke-dashoffset:50} to{stroke-dashoffset:0} }
        @keyframes dotPulse    { 0%,100%{opacity:0.4;transform:scale(1)} 50%{opacity:1;transform:scale(1.4)} }
        @keyframes glowFloat   { 0%,100%{opacity:0.5;transform:scale(1)} 50%{opacity:0.9;transform:scale(1.08)} }
        @keyframes mapPulse    { 0%,100%{box-shadow:0 0 0 0 rgba(176,58,46,0.4)} 50%{box-shadow:0 0 0 8px rgba(176,58,46,0)} }

        .submit-btn {
          position:relative; overflow:hidden;
          display:flex; align-items:center; justify-content:center; gap:10px;
          width:100%; padding:16px;
          background:linear-gradient(135deg,var(--red-bright),var(--red-dim));
          border:none; border-radius:8px; color:#fff;
          font-family:var(--font-display); font-size:0.72rem; font-weight:700;
          letter-spacing:0.2em; text-transform:uppercase;
          cursor:pointer; transition:box-shadow 0.3s, transform 0.2s;
        }
        .submit-btn:hover:not(:disabled) { box-shadow:0 0 36px rgba(176,58,46,0.5),0 8px 28px rgba(0,0,0,0.4); transform:translateY(-2px) scale(1.01); }
        .submit-btn:disabled { opacity:0.65; cursor:not-allowed; transform:none; }
        .submit-btn::after { content:''; position:absolute; top:0; left:-100%; width:60%; height:100%; background:linear-gradient(90deg,transparent,rgba(255,255,255,0.14),transparent); transform:skewX(-20deg); transition:left 0.5s; }
        .submit-btn:hover:not(:disabled)::after { left:160%; }

        .checkbox-custom { width:18px; height:18px; border-radius:4px; flex-shrink:0; border:1px solid rgba(176,58,46,0.35); background:rgba(176,58,46,0.04); display:flex; align-items:center; justify-content:center; cursor:pointer; transition:all 0.25s; }
        .checkbox-custom.checked { background:var(--red-bright); border-color:var(--red-bright); box-shadow:0 0 14px rgba(176,58,46,0.45); }
        .social-btn { width:40px; height:40px; border-radius:8px; border:1px solid rgba(176,58,46,0.2); background:rgba(176,58,46,0.04); display:flex; align-items:center; justify-content:center; color:var(--text-muted); text-decoration:none; transition:all 0.25s; }
        .social-btn:hover { border-color:var(--red-bright)!important; background:rgba(176,58,46,0.12)!important; color:var(--red-bright)!important; transform:translateY(-3px)!important; box-shadow:0 8px 20px rgba(176,58,46,0.2)!important; }

        @media (max-width:1000px) { .c-outer { grid-template-columns:1fr 1.6fr !important; } .c-robot { display:none !important; } }
        @media (max-width:700px)  { .c-outer { grid-template-columns:1fr !important; } .form-grid > * { grid-column:span 1 !important; } .map-bar { grid-template-columns:1fr !important; } .map-actions { flex-direction:column !important; width:100% !important; } .map-actions a { justify-content:center !important; } }
      `}</style>

      <ParticleField />

      {/* Ambient glows */}
      <div aria-hidden="true" style={{ position:'absolute', top:'12%', right:'-6%', width:'480px', height:'480px', borderRadius:'50%', background:'radial-gradient(circle,rgba(176,58,46,0.07) 0%,transparent 70%)', pointerEvents:'none', animation:'glowFloat 6s ease-in-out infinite' }}/>
      <div aria-hidden="true" style={{ position:'absolute', bottom:'12%', left:'-6%', width:'380px', height:'380px', borderRadius:'50%', background:'radial-gradient(circle,rgba(176,58,46,0.05) 0%,transparent 70%)', pointerEvents:'none', animation:'glowFloat 8s ease-in-out 2s infinite' }}/>

      {/* Vertical scanline */}
      <div aria-hidden="true" style={{ position:'absolute', top:0, bottom:0, width:'2px', background:'linear-gradient(to bottom,transparent,rgba(176,58,46,0.18),transparent)', animation:'scanV 7s linear infinite', pointerEvents:'none', zIndex:1 }}/>

      {/* Watermark */}
      <div aria-hidden="true" style={{ position:'absolute', bottom:'-1rem', left:'50%', transform:'translateX(-50%)', whiteSpace:'nowrap', pointerEvents:'none', fontFamily:'var(--font-display)', fontSize:'clamp(4rem,12vw,9rem)', fontWeight:900, color:'transparent', WebkitTextStroke:'1px rgba(176,58,46,0.045)', letterSpacing:'0.05em', lineHeight:1, userSelect:'none' }}>CONTACT</div>

      <div className="container-allbotix" style={{ position:'relative', zIndex:2 }}>

        {/* Header */}
        <div style={{ textAlign:'center', marginBottom:'4rem', opacity:visible?1:0, transform:visible?'translateY(0)':'translateY(24px)', filter:visible?'none':'blur(3px)', transition:'opacity 0.7s ease 0.05s,transform 0.7s ease 0.05s,filter 0.7s ease 0.05s' }}>
          <div className="section-tag" style={{ justifyContent:'center' }}>Get In Touch</div>
          <h2 className="section-title" style={{ marginBottom:'0.75rem' }}>Let's Build the Future <span>Together.</span></h2>
          <div style={{ width:'48px', height:'2px', background:'linear-gradient(90deg,var(--red-bright),transparent)', margin:'0 auto 1rem', animation:visible?'lineGrow 0.6s ease 0.3s both':'none' }}/>
          <p style={{ maxWidth:'460px', margin:'0 auto', fontSize:'0.95rem', lineHeight:1.9, color:'var(--text-secondary)' }}>
            Have questions or need a custom robotics solution? Our team is ready to automate smarter for you.
          </p>
        </div>

        {/* 3-column: Info | Robot | Form */}
        <div className="c-outer" style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1.6fr', gap:'2.5rem', alignItems:'start', perspective:'1400px' }}>

          {/* COL 1 — Info + Social */}
          <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
            {INFO.map((item, i) => <InfoCard3D key={item.label} item={item} index={i} visible={visible}/>)}
            <div style={{ padding:'1.4rem', background:'var(--bg-card)', border:'1px solid rgba(176,58,46,0.15)', borderRadius:'10px', opacity:visible?1:0, translate:visible?'0 0':'-30px 0', transition:`opacity 0.6s ease ${INFO.length*0.13+0.08}s,translate 0.6s ease ${INFO.length*0.13+0.08}s` }}>
              <p style={{ fontFamily:'var(--font-display)', fontSize:'0.55rem', letterSpacing:'0.18em', textTransform:'uppercase', color:'var(--text-muted)', marginBottom:'1rem' }}>Follow Us</p>
              <div style={{ display:'flex', gap:'10px' }}>
                {socialIcons.map(s => (
                  <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="social-btn" aria-label={s.label}>
                    <span style={{ width:'16px', height:'16px', display:'flex' }}>
                      {s.svg}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* COL 2 — Floating 3D Robot */}
          <div className="c-robot" style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'460px', position:'relative' }}>
            <FloatingRobot visible={visible}/>
          </div>

          {/* COL 3 — Contact Form */}
          <div ref={formPanelRef}>
            <div ref={formCardRef} onMouseMove={onFormMove} onMouseLeave={onFormLeave}
              style={{
                background:'var(--bg-card)', border:'1px solid rgba(176,58,46,0.2)', borderRadius:'14px', padding:'2.5rem',
                position:'relative', overflow:'hidden', transformStyle:'preserve-3d',
                transition:'transform 0.45s cubic-bezier(0.23,1,0.32,1), opacity 0.7s ease 0.15s',
                opacity:   formVisible?1:0,
                transform: formVisible?'translateX(0) rotateY(0deg)':'translateX(50px) rotateY(-6deg)',
              }}
            >
              {/* Top accent bar */}
              <div style={{ position:'absolute', top:0, left:0, right:0, height:'2px', background:'linear-gradient(90deg,var(--red-bright),var(--red-dim),transparent)' }}/>
              {/* Corner glow */}
              <div aria-hidden="true" style={{ position:'absolute', top:'-1px', right:'-1px', width:'120px', height:'120px', background:'radial-gradient(circle at top right,rgba(176,58,46,0.16) 0%,transparent 70%)', borderRadius:'0 14px 0 0', pointerEvents:'none' }}/>
              {/* Internal scanline */}
              <div aria-hidden="true" style={{ position:'absolute', left:0, right:0, height:'2px', background:'linear-gradient(90deg,transparent,rgba(176,58,46,0.2),transparent)', animation:'scanV 6s linear 1s infinite', pointerEvents:'none', zIndex:1 }}/>

              {submitted ? (
                <div style={{ textAlign:'center', padding:'3rem 1rem', animation:'successPop 0.65s cubic-bezier(0.34,1.56,0.64,1) both' }}>
                  <div style={{ width:'72px', height:'72px', borderRadius:'50%', border:'2px solid var(--red-bright)', background:'rgba(176,58,46,0.1)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 1.5rem', boxShadow:'0 0 32px rgba(176,58,46,0.35)' }}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--red-bright)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" style={{ strokeDasharray:50, strokeDashoffset:0, animation:'checkDraw 0.4s ease 0.3s both' }}/>
                    </svg>
                  </div>
                  <h3 style={{ fontFamily:'var(--font-display)', fontSize:'1.4rem', fontWeight:900, color:'var(--text-primary)', marginBottom:'0.75rem' }}>Message Received!</h3>
                  <p style={{ fontFamily:'var(--font-light)', fontSize:'0.9rem', color:'var(--text-secondary)', lineHeight:1.8, marginBottom:'2rem' }}>Thank you for reaching out. Our team will get back to you within 24 hours.</p>
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'6px' }}>
                    {[0,1,2].map(i => <span key={i} style={{ width:'6px', height:'6px', borderRadius:'50%', background:'var(--red-bright)', animation:`dotPulse 1.2s ease-in-out ${i*0.2}s infinite` }}/>)}
                  </div>
                </div>
              ) : (
                <>
                  <div style={{ marginBottom:'1.75rem', position:'relative', zIndex:2 }}>
                    <p style={{ fontFamily:'var(--font-display)', fontSize:'0.55rem', letterSpacing:'0.2em', textTransform:'uppercase', color:'var(--red-bright)', marginBottom:'6px' }}>Send a Message</p>
                    <h3 style={{ fontFamily:'var(--font-display)', fontSize:'1.25rem', fontWeight:900, color:'var(--text-primary)', letterSpacing:'0.02em' }}>Start Your Robotics Journey</h3>
                  </div>

                  <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:'1.35rem', position:'relative', zIndex:2 }}>
                    <div className="form-grid" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
                      <Field label="First Name" name="firstName" required half value={firstName} onChange={setFirstName}/>
                      <Field label="Last Name"  name="lastName"  half value={lastName}  onChange={setLastName}/>
                    </div>
                    <div className="form-grid" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
                      <Field label="Email Address" name="email" type="email" required half value={email} onChange={setEmail}/>
                      <Field label="Phone Number"  name="phone" type="tel"   half value={phone} onChange={setPhone}/>
                    </div>
                    <Field label="Company / Organisation" name="company" value={company} onChange={setCompany}/>

                    {/* Service select */}
                    <div style={{ position:'relative' }}>
                      <label style={{ position:'absolute', left:'14px', top:service?'-9px':'14px', fontFamily:'var(--font-display)', fontSize:service?'0.55rem':'0.78rem', letterSpacing:service?'0.18em':'0.06em', textTransform:service?'uppercase':'none', color:service?'rgba(176,58,46,0.7)':'var(--text-muted)', background:service?'var(--bg-card)':'transparent', padding:service?'0 6px':'0', transition:'all 0.25s', pointerEvents:'none', zIndex:2 }}>
                        Service Interested In
                      </label>
                      <select name="service" value={service} onChange={e => setService(e.target.value)}
                        style={{ width:'100%', padding:'14px', background:'rgba(176,58,46,0.02)', border:'1px solid rgba(176,58,46,0.18)', borderRadius:'8px', color:service?'var(--text-primary)':'transparent', fontFamily:'var(--font-light)', fontSize:'0.88rem', outline:'none', cursor:'pointer', transition:'border-color 0.25s', appearance:'none', backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='rgba(176,58,46,0.6)' stroke-width='2' stroke-linecap='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`, backgroundRepeat:'no-repeat', backgroundPosition:'right 14px center' }}
                        onFocus={e => (e.target as HTMLSelectElement).style.borderColor='rgba(176,58,46,0.6)'}
                        onBlur={e  => (e.target as HTMLSelectElement).style.borderColor='rgba(176,58,46,0.18)'}
                      >
                        <option value="" disabled/>
                        {SERVICES.map(s => <option key={s} value={s} style={{ background:'#111', color:'#f0ece8' }}>{s}</option>)}
                      </select>
                    </div>

                    {/* Source select */}
                    <div style={{ position:'relative' }}>
                      <label style={{ position:'absolute', left:'14px', top:source?'-9px':'14px', fontFamily:'var(--font-display)', fontSize:source?'0.55rem':'0.78rem', letterSpacing:source?'0.18em':'0.06em', textTransform:source?'uppercase':'none', color:source?'rgba(176,58,46,0.7)':'var(--text-muted)', background:source?'var(--bg-card)':'transparent', padding:source?'0 6px':'0', transition:'all 0.25s', pointerEvents:'none', zIndex:2 }}>
                        Where Did You Find Us?
                      </label>
                      <select name="source" value={source} onChange={e => setSource(e.target.value)}
                        style={{ width:'100%', padding:'14px', background:'rgba(176,58,46,0.02)', border:'1px solid rgba(176,58,46,0.18)', borderRadius:'8px', color:source?'var(--text-primary)':'transparent', fontFamily:'var(--font-light)', fontSize:'0.88rem', outline:'none', cursor:'pointer', transition:'border-color 0.25s', appearance:'none', backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='rgba(176,58,46,0.6)' stroke-width='2' stroke-linecap='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`, backgroundRepeat:'no-repeat', backgroundPosition:'right 14px center' }}
                        onFocus={e => (e.target as HTMLSelectElement).style.borderColor='rgba(176,58,46,0.6)'}
                        onBlur={e  => (e.target as HTMLSelectElement).style.borderColor='rgba(176,58,46,0.18)'}
                      >
                        <option value="" disabled/>
                        {[
                          'Google Search',
                          'Instagram',
                          'LinkedIn',
                          'YouTube',
                          'Facebook',
                          'Word of Mouth / Referral',
                          'Trade Show / Event',
                          'News / Press Coverage',
                          'Other',
                        ].map(s => <option key={s} value={s} style={{ background:'#111', color:'#f0ece8' }}>{s}</option>)}
                      </select>
                    </div>

                    <TextArea label="Your Message" name="message" required value={message} onChange={setMessage}/>

                    <div style={{ display:'flex', alignItems:'flex-start', gap:'10px', cursor:'pointer' }} onClick={() => setAgreed(p => !p)}>
                      <div className={`checkbox-custom${agreed?' checked':''}`}>
                        {agreed && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
                      </div>
                      <p style={{ fontFamily:'var(--font-light)', fontSize:'0.76rem', color:'var(--text-secondary)', lineHeight:1.6, userSelect:'none' }}>
                        I agree to the <span style={{ color:'var(--red-bright)' }}>Privacy Policy</span> and consent to Allbotix contacting me.
                      </p>
                    </div>

                    <button type="submit" className="submit-btn" disabled={loading||!agreed}>
                      {loading
                        ? <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation:'spinLoader 0.8s linear infinite' }}><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>Sending…</>
                        : <>Send Message<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg></>
                      }
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>

        {/* ─── Map Division ──────────────────────────────────────────────────────── */}
        <MapSection visible={visible} />

      </div>
    </section>
  )
}