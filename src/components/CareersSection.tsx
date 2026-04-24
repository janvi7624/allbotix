'use client'

import Link from 'next/link'
import { useRef, useState, useEffect, useCallback } from 'react'
import { DEPARTMENTS, PERKS, PROCESS } from '@/data/careers'

/* ─── Particle background ────────────────────────────────────────────────── */
function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return
    const ctx = canvas.getContext('2d')!
    let w = canvas.offsetWidth, h = canvas.offsetHeight
    canvas.width = w; canvas.height = h
    const pts = Array.from({ length: 55 }, () => ({
      x: Math.random()*w, y: Math.random()*h,
      vx: (Math.random()-0.5)*0.28, vy: (Math.random()-0.5)*0.28,
      r: Math.random()*1.5+0.4, o: Math.random()*0.4+0.08,
    }))
    let raf: number
    const draw = () => {
      ctx.clearRect(0,0,w,h)
      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy
        if (p.x<0) p.x=w; if (p.x>w) p.x=0
        if (p.y<0) p.y=h; if (p.y>h) p.y=0
        ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2)
        ctx.fillStyle=`rgba(var(--red-dark-rgb),${p.o})`; ctx.fill()
      })
      for (let i=0;i<pts.length;i++) for (let j=i+1;j<pts.length;j++) {
        const dx=pts[i].x-pts[j].x,dy=pts[i].y-pts[j].y,d=Math.sqrt(dx*dx+dy*dy)
        if(d<95){ctx.beginPath();ctx.strokeStyle=`rgba(var(--red-dark-rgb),${0.09*(1-d/95)})`;ctx.lineWidth=0.5;ctx.moveTo(pts[i].x,pts[i].y);ctx.lineTo(pts[j].x,pts[j].y);ctx.stroke()}
      }
      raf=requestAnimationFrame(draw)
    }
    draw()
    const resize=()=>{w=canvas.offsetWidth;h=canvas.offsetHeight;canvas.width=w;canvas.height=h}
    window.addEventListener('resize',resize)
    return ()=>{cancelAnimationFrame(raf);window.removeEventListener('resize',resize)}
  },[])
  return <canvas ref={canvasRef} style={{ position:'absolute',inset:0,width:'100%',height:'100%',pointerEvents:'none',zIndex:0, opacity: 0.5 }}/>
}

/* ─── Perk Card ──────────────────────────────────────────────────────────── */
function PerkCard({ item, index, visible }: { item: typeof PERKS[0]; index: number; visible: boolean }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: '1.75rem 1.5rem',
        background: hovered ? 'rgba(var(--red-dark-rgb),0.07)' : 'var(--bg-card)',
        border: `1px solid ${hovered ? 'rgba(var(--red-dark-rgb),0.4)' : 'rgba(var(--red-dark-rgb),0.1)'}`,
        borderRadius: '14px', position: 'relative', overflow: 'hidden',
        transition: 'all 0.3s ease',
        boxShadow: hovered ? '0 8px 40px rgba(var(--black-rgb),0.35), 0 0 18px rgba(var(--red-dark-rgb),0.08)' : '0 4px 16px rgba(var(--black-rgb),0.2)',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(24px)',
        transitionDelay: `${index * 0.08 + 0.1}s`,
        cursor: 'default',
      }}
    >
      <div aria-hidden="true" style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg,transparent,var(--red-bright),transparent)', opacity: hovered ? 0.6 : 0, transition: 'opacity 0.3s' }} />

      {/* Icon wrapper — fixed size, red ring */}
      <div style={{
        width: '42px',
        height: '42px',
        marginBottom: '1rem',
        borderRadius: '50%',
        border: '1.5px solid rgba(var(--red-dark-rgb),0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'rgb(var(--red-dark-rgb))',
        background: 'rgba(var(--red-dark-rgb),0.08)',
        flexShrink: 0,
      }}>
        <div style={{ width: '18px', height: '18px', display: 'flex' }}>
          {item.icon}
        </div>
      </div>

      <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '0.9rem', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '0.03em', marginBottom: '0.5rem' }}>{item.title}</h4>
      <p style={{ fontFamily: 'var(--font-light)', fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.8 }}>{item.desc}</p>
    </div>
  )
}

/* ─── Application Form ───────────────────────────────────────────────────── */
function ApplicationForm({ visible }: { visible: boolean }) {
  const [sent,    setSent]    = useState(false)
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')
  const [form,    setForm]    = useState({
    name: '', email: '', phone: '', dept: '', role: '',
    linkedin: '', resume: '', why: '', experience: '',
  })

  const handle = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  const isValid = form.name && form.email && form.dept && form.why

  const onSubmit = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (!isValid || loading) return
    setLoading(true)
    setError('')

    try {
      const res  = await fetch('/api/careers', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Unknown error')
      setSent(true)
      setForm({
        name: '', email: '', phone: '', dept: '', role: '',
        linkedin: '', resume: '', why: '', experience: '',
      })
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to submit. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const fieldStyle: React.CSSProperties = {
    width: '100%', padding: '12px 16px',
    // ✅ was: rgba(var(--white-rgb),0.03) — invisible on white bg
    background: 'var(--bg-800)',
    // ✅ was: rgba(var(--red-dark-rgb),0.2) — too faint; copper-border reads better on light
    border: '1px solid var(--copper-border)',
    borderRadius: '10px',
    color: 'var(--text-primary)',
    fontFamily: 'var(--font-light)',
    fontSize: '0.88rem',
    outline: 'none',
    transition: 'border-color 0.2s, background 0.2s',
    boxSizing: 'border-box' as const,
  }

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontFamily: 'var(--font-display)',
    fontSize: '0.52rem',
    letterSpacing: '0.18em',
    textTransform: 'uppercase' as const,
    color: 'var(--text-muted)',
    marginBottom: '7px',
  }

  const focusIn  = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    e.currentTarget.style.borderColor = 'var(--copper)'
    // ✅ was: rgba(var(--red-dark-rgb),0.04) — too dark/invisible; soft copper tint fits light bg
    e.currentTarget.style.background  = 'var(--copper-soft)'
  }
  const focusOut = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    e.currentTarget.style.borderColor = 'var(--copper-border)'
    e.currentTarget.style.background  = 'var(--bg-800)'
  }

  if (sent) {
    return (
      <div style={{
        padding: '4rem 2rem', textAlign: 'center',
        // ✅ was: rgba(var(--red-dark-rgb),0.04) — near-invisible on white; use red-soft token
        background: 'var(--red-soft)',
        border: '1px solid var(--copper-border)',
        borderRadius: '16px',
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.7s ease 0.1s',
      }}>
        <div style={{ fontSize: '3.5rem', marginBottom: '1.25rem' }}>🤖</div>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '0.75rem', letterSpacing: '0.02em' }}>
          Application Received!
        </h3>
        <p style={{ fontFamily: 'var(--font-light)', fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.85, maxWidth: '420px', margin: '0 auto 0.5rem' }}>
          Thank you, <strong style={{ color: 'var(--text-primary)' }}>{form.name}</strong>. We'll review your profile and be in touch within 5 business days.
        </p>
        <p style={{ fontFamily: 'var(--font-light)', fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.7, maxWidth: '380px', margin: '0 auto 2rem' }}>
          Keep an eye on <strong style={{ color: 'var(--copper)' }}>{form.email}</strong> — that's where we'll reach out.
        </p>
        <button
          onClick={() => setSent(false)}
          style={{
            padding: '10px 28px', borderRadius: '100px',
            border: '1px solid var(--copper-border)',
            // ✅ was: var(--navy) — dark bg looks wrong on light theme; use bg-800
            background: 'var(--bg-800)',
            color: 'var(--red-bright)',
            fontFamily: 'var(--font-display)', fontSize: '0.56rem', letterSpacing: '0.16em', textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.25s',
          }}
        >
          Submit Another
        </button>
      </div>
    )
  }

  return (
    <div style={{
      position: 'relative',
      // ✅ was: linear-gradient with overlay-light-rgb (pinkish tint) — use clean white card bg
      background: 'var(--bg-card)',
      border: '1px solid var(--copper-border)',
      borderRadius: '16px', overflow: 'hidden',
      // ✅ was: rgba(var(--black-rgb),0.3) deep shadow — too heavy on light; use navy-tinted shadow
      boxShadow: '0 12px 48px rgba(var(--black-rgb),0.10), 0 0 40px var(--copper-soft)',
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(28px)',
      transition: 'opacity 0.7s ease 0.15s, transform 0.7s ease 0.15s',
    }}>
      {/* Top gradient bar */}
      <div style={{ height: '2px', background: 'linear-gradient(90deg,transparent,var(--red-bright),transparent)' }}/>

      <div style={{ padding: '2.5rem 2.75rem 3rem' }}>
        {/* Form header */}
        <div style={{ marginBottom: '2.25rem' }}>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: '0.5rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--copper)', marginBottom: '8px' }}>
            Start Your Journey
          </p>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '0.02em', lineHeight: 1.2 }}>
            Apply to Allbotix
          </h3>
          <p style={{ fontFamily: 'var(--font-light)', fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.8, marginTop: '8px', maxWidth: '460px' }}>
            No role that fits? No problem. Tell us about yourself and we'll find where you belong.
          </p>
        </div>

        {/* Row 1: Name + Email */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
          <div>
            <label style={labelStyle}>Full Name <span style={{ color: 'var(--red-bright)' }}>*</span></label>
            <input name="name" type="text" placeholder="Riya Mehta" value={form.name} onChange={handle}
              style={fieldStyle} onFocus={focusIn} onBlur={focusOut}/>
          </div>
          <div>
            <label style={labelStyle}>Email Address <span style={{ color: 'var(--red-bright)' }}>*</span></label>
            <input name="email" type="email" placeholder="riya@example.com" value={form.email} onChange={handle}
              style={fieldStyle} onFocus={focusIn} onBlur={focusOut}/>
          </div>
        </div>

        {/* Row 2: Phone + Department */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
          <div>
            <label style={labelStyle}>Phone (Optional)</label>
            <input name="phone" type="tel" placeholder="+91 98765 43210" value={form.phone} onChange={handle}
              style={fieldStyle} onFocus={focusIn} onBlur={focusOut}/>
          </div>
          <div>
            <label style={labelStyle}>Department Interest <span style={{ color: 'var(--red-bright)' }}>*</span></label>
            <select name="dept" value={form.dept} onChange={handle}
              style={{ ...fieldStyle, cursor: 'pointer', appearance: 'none' as const, backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='rgba(var(--red-dark-rgb),0.7)' stroke-width='2.5' stroke-linecap='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 14px center' }}
              onFocus={focusIn} onBlur={focusOut}
            >
              {/* ✅ was: bg-deep-black — pure black clashes with light theme; use bg-card */}
              <option value="" style={{ background: 'var(--bg-card)', color: 'var(--text-muted)' }}>Select a department…</option>
              {DEPARTMENTS.map(d => <option key={d} value={d} style={{ background: 'var(--bg-card)', color: 'var(--text-primary)' }}>{d}</option>)}
            </select>
          </div>
        </div>

        {/* Row 3: Role + LinkedIn */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
          <div>
            <label style={labelStyle}>Role You're Targeting</label>
            <input name="role" type="text" placeholder="e.g. Robotics Engineer" value={form.role} onChange={handle}
              style={fieldStyle} onFocus={focusIn} onBlur={focusOut}/>
          </div>
          <div>
            <label style={labelStyle}>LinkedIn / Portfolio</label>
            <input name="linkedin" type="text" placeholder="linkedin.com/in/yourprofile" value={form.linkedin} onChange={handle}
              style={fieldStyle} onFocus={focusIn} onBlur={focusOut}/>
          </div>
        </div>

        {/* Years of experience */}
        <div style={{ marginBottom: '1.25rem' }}>
          <label style={labelStyle}>Years of Relevant Experience</label>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {['0–1 years', '2–4 years', '5–8 years', '9+ years'].map(opt => (
              <button
                key={opt}
                onClick={() => setForm(p => ({ ...p, experience: opt }))}
                style={{
                  padding: '8px 18px', borderRadius: '100px',
                  border: `1px solid ${form.experience === opt ? 'var(--copper)' : 'var(--copper-border)'}`,
                  // ✅ was: rgba(var(--white-rgb),0.02) unselected — invisible on white; use bg-800
                  background: form.experience === opt ? 'var(--red-soft)' : 'var(--bg-800)',
                  color: form.experience === opt ? 'var(--red-bright)' : 'var(--text-muted)',
                  fontFamily: 'var(--font-display)', fontSize: '0.52rem',
                  letterSpacing: '0.14em', textTransform: 'uppercase' as const,
                  cursor: 'pointer', transition: 'all 0.2s',
                  boxShadow: form.experience === opt ? '0 0 14px var(--copper-glow)' : 'none',
                }}
              >{opt}</button>
            ))}
          </div>
        </div>

        {/* Resume link */}
        <div style={{ marginBottom: '1.25rem' }}>
          <label style={labelStyle}>Resume / CV Link <span style={{ opacity: 0.5 }}>(Google Drive, Notion, PDF URL…)</span></label>
          <input name="resume" type="text" placeholder="https://drive.google.com/file/…" value={form.resume} onChange={handle}
            style={fieldStyle} onFocus={focusIn} onBlur={focusOut}/>
        </div>

        {/* Why Allbotix */}
        <div style={{ marginBottom: '2rem' }}>
          <label style={labelStyle}>
            Why Allbotix? <span style={{ color: 'var(--red-bright)' }}>*</span>
            <span style={{ color: 'var(--text-muted)', marginLeft: '6px' }}>(What excites you about autonomous robotics?)</span>
          </label>
          <textarea
            name="why" placeholder="Tell us what draws you to this space and what you'd build with us…"
            value={form.why} onChange={handle} rows={5}
            style={{ ...fieldStyle, resize: 'vertical' as const }}
            onFocus={focusIn} onBlur={focusOut}
          />
        </div>

        {/* Submit */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
          <button
            onClick={onSubmit}
            disabled={!isValid || loading}
            style={{
              padding: '14px 32px', borderRadius: '10px',
              border: '1px solid transparent',
              // ✅ was: rgba(var(--red-dark-rgb),0.38) semi-transparent dark — muddy on light bg;
              //    active = solid brand gradient (white text), disabled = muted bg (muted text)
              background: isValid && !loading
                ? 'linear-gradient(135deg, var(--red-bright), var(--amber))'
                : 'var(--bg-700)',
              color: isValid && !loading ? '#ffffff' : 'var(--text-muted)',
              fontFamily: 'var(--font-display)', fontSize: '0.62rem',
              letterSpacing: '0.16em', textTransform: 'uppercase' as const,
              cursor: isValid && !loading ? 'pointer' : 'not-allowed',
              transition: 'all 0.25s',
              boxShadow: isValid && !loading ? '0 4px 20px var(--red-glow)' : 'none',
              display: 'flex', alignItems: 'center', gap: '8px',
            }}
            onMouseEnter={e => { if (isValid && !loading) (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 28px var(--copper-glow)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = isValid && !loading ? '0 4px 20px var(--red-glow)' : 'none' }}
          >
            {loading ? (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation: 'spinLoader 0.8s linear infinite' }}>
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                </svg>
                Submitting…
              </>
            ) : 'Submit Application →'}
          </button>
          <p style={{ fontFamily: 'var(--font-light)', fontSize: '0.76rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
            We read every application and reply within 5 business days.
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', borderRadius: '8px', background: 'var(--red-soft)', border: '1px solid var(--copper-border)' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--red-bright)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '0.65rem', color: 'var(--red-bright)', letterSpacing: '0.04em' }}>{error}</p>
          </div>
        )}
      </div>
    </div>
  )
}

/* ─── Main Page ──────────────────────────────────────────────────────────── */
export default function CareersSection() {
  const heroRef    = useRef<HTMLElement>(null)
  const formRef    = useRef<HTMLElement>(null)
  const perksRef   = useRef<HTMLElement>(null)
  const processRef = useRef<HTMLElement>(null)

  const [heroVisible,    setHeroVisible]    = useState(false)
  const [formVisible,    setFormVisible]    = useState(false)
  const [perksVisible,   setPerksVisible]   = useState(false)
  const [processVisible, setProcessVisible] = useState(false)

  useEffect(() => {
    const make = (el: Element | null, setter: (v:boolean)=>void, th=0.1) => {
      if (!el) return
      const io = new IntersectionObserver(([e]) => { if(e.isIntersecting){setter(true);io.disconnect()} }, {threshold:th})
      io.observe(el); return () => io.disconnect()
    }
    const c1 = make(heroRef.current,    setHeroVisible,    0.15)
    const c2 = make(formRef.current,    setFormVisible,    0.05)
    const c3 = make(perksRef.current,   setPerksVisible,   0.08)
    const c4 = make(processRef.current, setProcessVisible, 0.08)
    return () => { c1?.(); c2?.(); c3?.(); c4?.() }
  }, [])

  return (
    <div style={{ background:'var(--bg-900)', minHeight:'100vh' }}>
      <style>{`
        @keyframes scanline   { 0%{top:-3%;opacity:0.55} 100%{top:108%;opacity:0} }
        @keyframes dotPulse   { 0%,100%{opacity:0.4;transform:scale(1)} 50%{opacity:1;transform:scale(1.5)} }
        @keyframes glowFloat  { 0%,100%{opacity:0.5;transform:scale(1)} 50%{opacity:0.9;transform:scale(1.1)} }
        @keyframes lineGrow   { from{width:0;opacity:0} to{opacity:1} }
        @keyframes spinLoader  { to{transform:rotate(360deg)} }
        @keyframes ringCW     { to{transform:translate(-50%,-50%) rotate(360deg)} }
        @keyframes ringCCW    { to{transform:translate(-50%,-50%) rotate(-360deg)} }
        @keyframes borderPulse{
          0%,100%{box-shadow:0 0 0 0 rgba(var(--red-dark-rgb),0);border-color:rgba(var(--red-dark-rgb),0.18);}
          50%{box-shadow:0 0 28px rgba(var(--red-dark-rgb),0.12);border-color:rgba(var(--red-dark-rgb),0.45);}
        }
        @keyframes shimmer {
          0%{background-position:-600px 0} 100%{background-position:600px 0}
        }

        .process-step:not(:last-child)::after {
          content: '';
          position: absolute;
          left: 27px; top: 56px;
          width: 1px; bottom: -24px;
          background: linear-gradient(to bottom, rgba(var(--red-dark-rgb),0.35), rgba(var(--red-dark-rgb),0.06));
        }

        @media(max-width:900px){
          .car-perks-grid{grid-template-columns:repeat(2,1fr)!important}
          .car-form-grid{grid-template-columns:1fr!important}
        }
        @media(max-width:560px){
          .car-perks-grid{grid-template-columns:1fr!important}
          .car-process-grid{grid-template-columns:1fr!important; gap:2rem!important}
        }
      `}</style>

      {/* ══ HERO ══════════════════════════════════════════════════════════════ */}
      <section
        ref={heroRef}
        style={{
          position:'relative', minHeight:'62vh',
          display:'flex', alignItems:'center', justifyContent:'center',
          overflow:'hidden', paddingBlock:'9rem 6rem',
          background:`radial-gradient(ellipse 80% 60% at 50% 40%,rgba(var(--red-dark-rgb),0.09) 0%,transparent 70%),var(--bg-900)`,
        }}
      >
        <ParticleField/>
        <div aria-hidden="true" style={{ position:'absolute',width:'580px',height:'580px',borderRadius:'50%',border:'1px dashed rgba(var(--red-dark-rgb),0.09)',top:'50%',left:'50%',animation:'ringCW 32s linear infinite',pointerEvents:'none' }}/>
        <div aria-hidden="true" style={{ position:'absolute',width:'380px',height:'380px',borderRadius:'50%',border:'1px solid rgba(var(--red-dark-rgb),0.12)',top:'50%',left:'50%',animation:'ringCCW 22s linear infinite',pointerEvents:'none' }}/>
        <div aria-hidden="true" style={{ position:'absolute',top:'5rem',left:'2rem',width:'40px',height:'40px',borderTop:'1px solid var(--red-bright)',borderLeft:'1px solid var(--red-bright)',opacity:0.4 }}/>
        <div aria-hidden="true" style={{ position:'absolute',bottom:'3rem',right:'2rem',width:'40px',height:'40px',borderBottom:'1px solid var(--red-bright)',borderRight:'1px solid var(--red-bright)',opacity:0.4 }}/>

        <div className="container-allbotix" style={{ position:'relative',zIndex:2,textAlign:'center' }}>
          <div style={{ opacity:heroVisible?1:0,transform:heroVisible?'translateY(0)':'translateY(20px)',transition:'opacity 0.6s ease 0.05s,transform 0.6s ease 0.05s' }}>
            <div className="section-tag" style={{ justifyContent:'center',marginBottom:'1.25rem' }}>We're Hiring</div>
          </div>

          <h1 style={{
            fontFamily:'var(--font-display)',
            fontSize:'clamp(2.5rem,7vw,5.5rem)',
            fontWeight:900, lineHeight:1.05, letterSpacing:'0.02em',
            color:'var(--text-primary)', marginBottom:'1.5rem',
            opacity:heroVisible?1:0,
            transform:heroVisible?'translateY(0)':'translateY(28px)',
            transition:'opacity 0.7s ease 0.12s,transform 0.7s ease 0.12s',
          }}>
            Build the Future<br/>of <span style={{ color:'var(--red-bright)', textShadow:'0 0 50px rgba(var(--red-dark-rgb),0.4)' }}>Intelligent</span> Machines.
          </h1>

          <div style={{ width:'60px',height:'2px',background:'linear-gradient(90deg,var(--red-bright),transparent)',margin:'0 auto 1.5rem',opacity:heroVisible?1:0,animation:heroVisible?'lineGrow 0.7s ease 0.3s both':'none' }}/>

          <p style={{
            maxWidth:'540px', margin:'0 auto 2.5rem',
            fontSize:'1rem', lineHeight:1.9, color:'var(--text-secondary)',
            opacity:heroVisible?1:0,
            transform:heroVisible?'translateY(0)':'translateY(18px)',
            transition:'opacity 0.6s ease 0.25s,transform 0.6s ease 0.25s',
          }}>
            Join a small, high-conviction team shaping how the world's industries operate — through autonomous robotics, AI, and precision automation.
          </p>

          <div style={{ display:'flex',gap:'1rem',justifyContent:'center',flexWrap:'wrap',opacity:heroVisible?1:0,transform:heroVisible?'translateY(0)':'translateY(16px)',transition:'opacity 0.6s ease 0.35s,transform 0.6s ease 0.35s' }}>
            <a href="#apply" className="btn-primary">
              Apply Now
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </a>
            <Link href="/about" className="btn-outline">Learn About Us</Link>
          </div>

          {/* Hiring badge */}
          <div style={{
            display:'inline-flex', alignItems:'center', gap:'8px',
            marginTop:'2rem', padding:'8px 18px', borderRadius:'100px',
            background:'rgba(var(--red-dark-rgb),0.08)', border:'1px solid rgba(var(--red-dark-rgb),0.28)',
            opacity:heroVisible?1:0, transition:'opacity 0.6s ease 0.45s',
          }}>
            <span style={{ width:'6px',height:'6px',borderRadius:'50%',background:'var(--red-bright)',animation:'dotPulse 2s ease-in-out infinite',boxShadow:'0 0 8px rgba(var(--red-dark-rgb),0.8)',flexShrink:0 }}/>
            <span style={{ fontFamily:'var(--font-display)',fontSize:'0.54rem',letterSpacing:'0.16em',textTransform:'uppercase',color:'var(--red-bright)' }}>
              Actively Hiring Across All Departments
            </span>
          </div>
        </div>
      </section>

      {/* ══ APPLICATION FORM ══════════════════════════════════════════════════ */}
      <section
        id="apply"
        ref={formRef as any}
        style={{ position:'relative',paddingBlock:'6rem',background:'var(--bg-800)',overflow:'hidden',borderTop:'1px solid var(--border-soft)' }}
      >
        <div aria-hidden="true" style={{ position:'absolute',top:'10%',right:'-8%',width:'480px',height:'480px',borderRadius:'50%',background:'radial-gradient(circle,rgba(var(--red-dark-rgb),0.06) 0%,transparent 70%)',pointerEvents:'none',animation:'glowFloat 7s ease-in-out infinite' }}/>
        <div aria-hidden="true" style={{ position:'absolute',bottom:'-2rem',left:'50%',transform:'translateX(-50%)',whiteSpace:'nowrap',pointerEvents:'none',fontFamily:'var(--font-display)',fontSize:'clamp(5rem,14vw,10rem)',fontWeight:900,color:'transparent',WebkitTextStroke:'1px rgba(var(--red-dark-rgb),0.04)',letterSpacing:'0.05em',lineHeight:1,userSelect:'none' }}>APPLY</div>

        <div className="container-allbotix" style={{ position:'relative',zIndex:2 }}>
          {/* Section header */}
          <div style={{
            display:'flex', alignItems:'flex-end', justifyContent:'space-between', gap:'2rem',
            marginBottom:'3.5rem', flexWrap:'wrap',
            opacity:formVisible?1:0, transform:formVisible?'translateY(0)':'translateY(22px)',
            transition:'opacity 0.7s ease,transform 0.7s ease',
          }}>
            <div>
              <div className="section-tag">Join the Team</div>
              <h2 className="section-title">Tell Us About <span>Yourself.</span></h2>
            </div>
            <p style={{ fontFamily:'var(--font-light)',fontSize:'0.84rem',color:'var(--text-muted)',maxWidth:'280px',textAlign:'right',lineHeight:1.8 }}>
              Or email us directly at{' '}
              <a href="mailto:careers@allbotix.ai" style={{ color:'var(--red-bright)',textDecoration:'none' }}>careers@allbotix.ai</a>
            </p>
          </div>

          {/* Two-column layout: form + sidebar */}
          <div className="car-form-grid" style={{ display:'grid', gridTemplateColumns:'1fr 340px', gap:'2.5rem', alignItems:'start' }}>
            {/* Form */}
            <ApplicationForm visible={formVisible} />

            {/* Sidebar */}
            <div style={{
              display:'flex', flexDirection:'column', gap:'1.25rem',
              opacity:formVisible?1:0, transform:formVisible?'translateX(0)':'translateX(24px)',
              transition:'opacity 0.7s ease 0.2s, transform 0.7s ease 0.2s',
            }}>
              {/* What we look for */}
              <div style={{ padding:'1.75rem', border:'1px solid rgba(var(--red-dark-rgb),0.15)', borderRadius:'14px', background: 'linear-gradient(145deg,rgba(var(--white-rgb),0.8),rgba(var(--overlay-light-rgb),0.2))' }}>
                <p style={{ fontFamily:'var(--font-display)',fontSize:'0.5rem',letterSpacing:'0.2em',textTransform:'uppercase',color:'var(--red-bright)',marginBottom:'12px' }}>What We Look For</p>
                {[
                  { e:'🔥', t:'Curiosity over credentials' },
                  { e:'⚙️', t:'Builders who ship, not just plan' },
                  { e:'🤝', t:'Collaborative, low-ego energy' },
                  { e:'🎯', t:'Bias towards first principles' },
                  { e:'🌱', t:'Growth mindset — always learning' },
                ].map(i => (
                  <div key={i.t} style={{ display:'flex',alignItems:'center',gap:'10px',marginBottom:'10px' }}>
                    <span style={{ fontSize:'1rem' }}>{i.e}</span>
                    <span style={{ fontFamily:'var(--font-light)',fontSize:'0.82rem',color:'var(--text-secondary)',lineHeight:1.6 }}>{i.t}</span>
                  </div>
                ))}
              </div>

              {/* Time to offer */}
              <div style={{ padding:'1.75rem', border:'1px solid rgba(var(--red-dark-rgb),0.15)', borderRadius:'14px', background: 'linear-gradient(145deg,rgba(var(--white-rgb),0.8),rgba(var(--overlay-light-rgb),0.2))', textAlign:'center' }}>
                <p style={{ fontFamily:'var(--font-display)',fontSize:'0.5rem',letterSpacing:'0.2em',textTransform:'uppercase',color:'var(--red-bright)',marginBottom:'8px' }}>Average Time to Offer</p>
                <p style={{ fontFamily:'var(--font-display)',fontSize:'2.4rem',fontWeight:900,color:'var(--text-primary)',lineHeight:1 }}>
                  6 <span style={{ fontSize:'0.9rem',color:'var(--text-muted)',fontWeight:400 }}>biz days</span>
                </p>
              </div>

              {/* Privacy note */}
              <div style={{ padding:'1.25rem 1.5rem', border:'1px solid rgba(var(--white-rgb),0.05)', borderRadius:'12px', background:'rgba(var(--white-rgb),0.02)' }}>
                <p style={{ fontFamily:'var(--font-light)',fontSize:'0.76rem',color:'var(--text-muted)',lineHeight:1.75 }}>
                  🔒 Your information is kept confidential and used only for hiring purposes. We do not share it with third parties.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ PERKS ═════════════════════════════════════════════════════════════ */}
      <section
        ref={perksRef as any}
        style={{ position:'relative',paddingBlock:'6rem',background:'var(--bg-900)',overflow:'hidden',borderTop:'1px solid var(--border-soft)' }}
      >
        <div aria-hidden="true" style={{ position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',whiteSpace:'nowrap',pointerEvents:'none',fontFamily:'var(--font-display)',fontSize:'clamp(5rem,14vw,10rem)',fontWeight:900,color:'transparent',WebkitTextStroke:'1px rgba(var(--red-dark-rgb),0.04)',letterSpacing:'0.05em',lineHeight:1,userSelect:'none' }}>PERKS</div>

        <div className="container-allbotix" style={{ position:'relative',zIndex:2 }}>
          <div style={{ textAlign:'center',marginBottom:'3.5rem',opacity:perksVisible?1:0,transform:perksVisible?'translateY(0)':'translateY(22px)',transition:'opacity 0.7s ease,transform 0.7s ease' }}>
            <div className="section-tag" style={{ justifyContent:'center' }}>Why Join Us</div>
            <h2 className="section-title">Beyond the <span>Salary.</span></h2>
            <p style={{ maxWidth:'440px',margin:'0.75rem auto 0',fontSize:'0.9rem',lineHeight:1.85,color:'var(--text-secondary)' }}>
              We think about the whole person — your growth, your wellbeing, and your curiosity.
            </p>
          </div>
          <div className="car-perks-grid" style={{ display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'1.5rem' }}>
            {PERKS.map((item, i) => <PerkCard key={item.title} item={item} index={i} visible={perksVisible} />)}
          </div>
        </div>
      </section>

      {/* ══ HIRING PROCESS ════════════════════════════════════════════════════ */}
      <section
        ref={processRef as any}
        style={{ position:'relative',paddingBlock:'6rem',background:'var(--bg-800)',overflow:'hidden',borderTop:'1px solid var(--border-soft)' }}
      >
        <div aria-hidden="true" style={{ position:'absolute',bottom:'10%',left:'-6%',width:'380px',height:'380px',borderRadius:'50%',background:'radial-gradient(circle,rgba(var(--red-dark-rgb),0.05) 0%,transparent 70%)',pointerEvents:'none',animation:'glowFloat 9s ease-in-out infinite' }}/>

        <div className="container-allbotix" style={{ position:'relative',zIndex:2 }}>
          <div className="car-process-grid" style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:'5rem',alignItems:'start' }}>

            {/* Left */}
            <div style={{ opacity:processVisible?1:0,transform:processVisible?'translateX(0)':'translateX(-32px)',transition:'opacity 0.7s ease,transform 0.7s ease' }}>
              <div className="section-tag">Our Process</div>
              <h2 className="section-title">No Nonsense.<br/>Just <span>Real Conversations.</span></h2>
              <p style={{ fontFamily:'var(--font-light)',fontSize:'0.9rem',color:'var(--text-secondary)',lineHeight:1.9,maxWidth:'360px',marginTop:'1rem' }}>
                We respect your time. Our hiring process is transparent, fast, and focused on understanding you — not testing your ability to perform under artificial pressure.
              </p>
            </div>

            {/* Right — steps */}
            <div style={{ display:'flex',flexDirection:'column',gap:'0' }}>
              {PROCESS.map((step, i) => (
                <div
                  key={step.num}
                  className="process-step"
                  style={{
                    position:'relative', display:'flex', gap:'1.25rem',
                    paddingBottom: i < PROCESS.length-1 ? '1.5rem' : '0',
                    opacity:processVisible?1:0,
                    transform:processVisible?'translateX(0)':'translateX(24px)',
                    transition:`opacity 0.6s ease ${i*0.1+0.15}s,transform 0.6s ease ${i*0.1+0.15}s`,
                  }}
                >
                  <div style={{ flexShrink:0,width:'54px',height:'54px',borderRadius:'50%',border:'1px solid rgba(var(--red-dark-rgb),0.35)',background:'rgba(var(--red-dark-rgb),0.08)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1 }}>
                    <span style={{ fontFamily:'var(--font-display)',fontSize:'0.65rem',fontWeight:900,color:'var(--red-bright)',letterSpacing:'0.04em' }}>{step.num}</span>
                  </div>
                  <div style={{ paddingTop:'12px' }}>
                    <h4 style={{ fontFamily:'var(--font-display)',fontSize:'0.92rem',fontWeight:900,color:'var(--text-primary)',letterSpacing:'0.03em',marginBottom:'4px' }}>{step.title}</h4>
                    <p style={{ fontFamily:'var(--font-light)',fontSize:'0.82rem',color:'var(--text-secondary)',lineHeight:1.8 }}>{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}