'use client'

import { useEffect, useState } from 'react'

/* ─── Types ── */
interface CareerSubmission {
  id:              string
  submittedAt:     string
  name:            string
  email:           string
  phone:           string
  dept:            string
  role:            string
  linkedin:        string
  resume:          string
  resumeFilename?: string
  experience:      string
  why:             string
}

/* ─── Helpers ── */
function formatDate(iso: string) {
  return new Date(iso).toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

function initials(name?: string) {
  if (!name) return 'NA' // fallback

  const parts = name.trim().split(' ')
  return (
    (parts[0]?.[0] ?? '') +
    (parts[1]?.[0] ?? '')
  ).toUpperCase() || 'NA'
}

/* ─── Excel Download ── */
function downloadExcel(data: CareerSubmission[]) {
  const headers = ['ID', 'Submitted At', 'Full Name', 'Email', 'Phone', 'Department', 'Target Role', 'Experience', 'LinkedIn', 'Resume File', 'Resume URL', 'Why Allbotix']
  const rows = data.map(d => [
    d.id,
    formatDate(d.submittedAt),
    d.name,
    d.email,
    d.phone,
    d.dept,
    d.role,
    d.experience,
    d.linkedin,
    d.resumeFilename ?? '',
    d.resume,
    d.why.replace(/\n/g, ' '),
  ])

  // Build CSV (opens in Excel)
  const escape = (v: string) => `"${String(v ?? '').replace(/"/g, '""')}"`
  const csv = [headers, ...rows].map(r => r.map(escape).join(',')).join('\n')
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a')
  a.href     = url
  a.download = `allbotix-careers-${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

/* ─── Confirm Modal ── */
function ConfirmModal({
  title,
  message,
  confirmLabel,
  loading,
  onConfirm,
  onCancel,
}: {
  title:        string
  message:      string
  confirmLabel: string
  loading:      boolean
  onConfirm:    () => void
  onCancel:     () => void
}) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape' && !loading) onCancel() }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [onCancel, loading])

  return (
    <>
      <div onClick={loading ? undefined : onCancel} style={{ position:'fixed', inset:0, background:'rgba(var(--black-rgb),0.7)', backdropFilter:'blur(4px)', zIndex:60 }} />
      <div style={{ position:'fixed', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:'min(420px, calc(100vw - 2rem))', background:'var(--bg-card)', border:'1px solid rgba(var(--red-dark-rgb),0.35)', borderRadius:'14px', overflow:'hidden', zIndex:61, boxShadow:'0 32px 80px rgba(var(--black-rgb),0.7), 0 0 40px rgba(var(--red-dark-rgb),0.12)', animation:'fadeUp 0.25s cubic-bezier(0.23,1,0.32,1)' }}>
        <div style={{ height:'2px', background:'linear-gradient(90deg,var(--red-bright),var(--red-dim),transparent)' }} />
        <div style={{ padding:'1.75rem' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'1rem' }}>
            <div style={{ width:'40px', height:'40px', borderRadius:'10px', background:'rgba(var(--red-dark-rgb),0.12)', border:'1px solid rgba(var(--red-dark-rgb),0.35)', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--red-bright)', flexShrink:0 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            </div>
            <h3 style={{ fontFamily:'var(--font-display)', fontSize:'0.95rem', fontWeight:900, color:'var(--text-primary)', letterSpacing:'0.02em' }}>{title}</h3>
          </div>
          <p style={{ fontFamily:'var(--font-light)', fontSize:'0.85rem', color:'var(--text-secondary)', lineHeight:1.6, marginBottom:'1.5rem' }}>{message}</p>
          <div style={{ display:'flex', gap:'8px', justifyContent:'flex-end' }}>
            <button
              onClick={onCancel}
              disabled={loading}
              style={{ padding:'10px 18px', borderRadius:'8px', border:'1px solid rgba(var(--red-dark-rgb),0.25)', background:'rgba(var(--red-dark-rgb),0.04)', color:'var(--text-muted)', fontFamily:'var(--font-display)', fontSize:'0.6rem', fontWeight:700, letterSpacing:'0.16em', textTransform:'uppercase', cursor:loading?'not-allowed':'pointer', opacity:loading?0.5:1, transition:'all 0.2s' }}
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              style={{ padding:'10px 18px', borderRadius:'8px', border:'none', background:'linear-gradient(135deg,var(--red-bright),var(--red-dim))', color:'var(--white)', fontFamily:'var(--font-display)', fontSize:'0.6rem', fontWeight:700, letterSpacing:'0.16em', textTransform:'uppercase', cursor:loading?'not-allowed':'pointer', opacity:loading?0.7:1, transition:'all 0.2s', display:'flex', alignItems:'center', gap:'8px' }}
            >
              {loading && (
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation:'spin 0.8s linear infinite' }}>
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                </svg>
              )}
              {loading ? 'Deleting…' : confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

/* ─── Detail Drawer ── */
function DetailDrawer({ s, onClose }: { s: CareerSubmission; onClose: () => void }) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [onClose])

  const row = (label: string, value: string, isLink = false) =>
    value ? (
      <div style={{ display:'flex', flexDirection:'column', gap:'4px', padding:'12px 0', borderBottom:'1px solid rgba(var(--red-dark-rgb),0.1)' }}>
        <span style={{ fontFamily:'var(--font-display)', fontSize:'0.48rem', letterSpacing:'0.2em', textTransform:'uppercase', color:'var(--red-bright)' }}>{label}</span>
        {isLink
          ? <a href={value.startsWith('http') ? value : `https://${value}`} target="_blank" rel="noopener noreferrer" style={{ fontFamily:'var(--font-light)', fontSize:'0.85rem', color:'var(--red-bright)', lineHeight:1.6, textDecoration:'underline', wordBreak:'break-all' }}>{value}</a>
          : <span style={{ fontFamily:'var(--font-light)', fontSize:'0.85rem', color:'var(--text-primary)', lineHeight:1.6 }}>{value}</span>
        }
      </div>
    ) : null

  return (
    <>
      <div onClick={onClose} style={{ position:'fixed', inset:0, background:'rgba(var(--black-rgb),0.7)', backdropFilter:'blur(4px)', zIndex:50 }} />
      <div style={{ position:'fixed', top:0, right:0, bottom:0, width:'min(500px,100vw)', background:'var(--bg-900)', borderLeft:'1px solid rgba(var(--red-dark-rgb),0.25)', zIndex:51, display:'flex', flexDirection:'column', boxShadow:'-20px 0 60px rgba(var(--black-rgb),0.6)', animation:'drawerSlideIn 0.3s cubic-bezier(0.23,1,0.32,1)' }}>

        <div style={{ height:'2px', background:'linear-gradient(90deg,var(--red-bright),transparent)', flexShrink:0 }} />

        {/* Header */}
        <div style={{ padding:'1.5rem 2rem', borderBottom:'1px solid rgba(var(--red-dark-rgb),0.15)', display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0 }}>
          <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
            <div style={{ width:'42px', height:'42px', borderRadius:'50%', background:'rgba(var(--red-dark-rgb),0.15)', border:'1px solid rgba(var(--red-dark-rgb),0.35)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'var(--font-display)', fontSize:'0.75rem', fontWeight:700, color:'var(--red-bright)' }}>
              {initials(s.name)}
            </div>
            <div>
              <p style={{ fontFamily:'var(--font-display)', fontSize:'0.9rem', fontWeight:700, color:'var(--text-primary)', marginBottom:'2px' }}>{s.name}</p>
              <p style={{ fontFamily:'var(--font-light)', fontSize:'0.72rem', color:'var(--text-muted)' }}>{formatDate(s.submittedAt)}</p>
            </div>
          </div>
          <button onClick={onClose} style={{ width:'32px', height:'32px', borderRadius:'6px', border:'1px solid rgba(var(--red-dark-rgb),0.25)', background:'rgba(var(--red-dark-rgb),0.06)', color:'var(--text-muted)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', transition:'all 0.2s' }}
            onMouseEnter={e => { const el = e.currentTarget; el.style.borderColor='var(--red-bright)'; el.style.color='var(--red-bright)' }}
            onMouseLeave={e => { const el = e.currentTarget; el.style.borderColor='rgba(var(--red-dark-rgb),0.25)'; el.style.color='var(--text-muted)' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Fields */}
        <div style={{ flex:1, overflowY:'auto', padding:'0 2rem' }}>
          {row('Email',       s.email)}
          {row('Phone',       s.phone)}
          {row('Department',  s.dept)}
          {row('Target Role', s.role)}
          {row('Experience',  s.experience)}
          {row('LinkedIn',    s.linkedin, true)}

          {s.resume && (
            <div style={{ display:'flex', flexDirection:'column', gap:'6px', padding:'12px 0', borderBottom:'1px solid rgba(var(--red-dark-rgb),0.1)' }}>
              <span style={{ fontFamily:'var(--font-display)', fontSize:'0.48rem', letterSpacing:'0.2em', textTransform:'uppercase', color:'var(--red-bright)' }}>Resume</span>
              <a
                href={s.resume}
                target="_blank"
                rel="noopener noreferrer"
                style={{ display:'inline-flex', alignItems:'center', gap:'8px', padding:'8px 12px', borderRadius:'8px', border:'1px solid rgba(var(--red-dark-rgb),0.25)', background:'rgba(var(--red-dark-rgb),0.06)', color:'var(--red-bright)', textDecoration:'none', fontFamily:'var(--font-light)', fontSize:'0.82rem', width:'fit-content', maxWidth:'100%' }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink:0 }}>
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                </svg>
                <span style={{ overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                  {s.resumeFilename || 'View PDF'}
                </span>
              </a>
            </div>
          )}

          {row('Submission ID', s.id)}

          {s.why && (
            <div style={{ padding:'12px 0' }}>
              <span style={{ fontFamily:'var(--font-display)', fontSize:'0.48rem', letterSpacing:'0.2em', textTransform:'uppercase', color:'var(--red-bright)', display:'block', marginBottom:'8px' }}>Why Allbotix?</span>
              <div style={{ background:'rgba(var(--red-dark-rgb),0.04)', border:'1px solid rgba(var(--red-dark-rgb),0.12)', borderRadius:'8px', padding:'14px', fontFamily:'var(--font-light)', fontSize:'0.83rem', color:'var(--text-secondary)', lineHeight:1.8, whiteSpace:'pre-wrap' }}>
                {s.why}
              </div>
            </div>
          )}
        </div>

        {/* Reply CTA */}
        <div style={{ padding:'1.25rem 2rem', borderTop:'1px solid rgba(var(--red-dark-rgb),0.15)', flexShrink:0 }}>
          <a href={`mailto:${s.email}?subject=Re: Your Application at Allbotix`}
            style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'8px', width:'100%', padding:'12px', background:'linear-gradient(135deg,var(--red-bright),var(--red-dim))', borderRadius:'8px', color:'var(--white)', textDecoration:'none', fontFamily:'var(--font-display)', fontSize:'0.65rem', fontWeight:700, letterSpacing:'0.16em', textTransform:'uppercase', transition:'box-shadow 0.3s, transform 0.2s' }}
            onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.boxShadow='0 0 28px rgba(var(--red-dark-rgb),0.5)'; el.style.transform='translateY(-1px)' }}
            onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.boxShadow='none'; el.style.transform='translateY(0)' }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
            Reply to {s.name.split(' ')[0]}
          </a>
        </div>
      </div>
    </>
  )
}

/* ─── Main Component ── */
export default function CareerSubmissionsTable() {
  const [data,     setData]     = useState<CareerSubmission[]>([])
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState('')
  const [search,   setSearch]   = useState('')
  const [selected, setSelected] = useState<CareerSubmission | null>(null)
  const [confirm,  setConfirm]  = useState<{ kind: 'one'; entry: CareerSubmission } | { kind: 'all' } | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [toast,    setToast]    = useState<{ kind: 'ok' | 'err'; msg: string } | null>(null)

  useEffect(() => {
    fetch('/api/careers/submissions')
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false) })
      .catch(() => { setError('Failed to load submissions.'); setLoading(false) })
  }, [])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 3200)
    return () => clearTimeout(t)
  }, [toast])

  const handleConfirmDelete = async () => {
    if (!confirm) return
    setDeleting(true)
    try {
      const url = confirm.kind === 'all'
        ? '/api/careers/submissions?all=true'
        : `/api/careers/submissions?id=${encodeURIComponent(confirm.entry.id)}`
      const res = await fetch(url, { method: 'DELETE' })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(json.error ?? 'Failed to delete.')

      if (confirm.kind === 'all') {
        setData([])
        setToast({ kind: 'ok', msg: `Deleted all ${json.deleted ?? ''} application${(json.deleted ?? 0) === 1 ? '' : 's'}.` })
      } else {
        const removedId = confirm.entry.id
        setData(prev => prev.filter(d => d.id !== removedId))
        if (selected?.id === removedId) setSelected(null)
        setToast({ kind: 'ok', msg: 'Application deleted.' })
      }
      setConfirm(null)
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to delete.'
      setToast({ kind: 'err', msg })
    } finally {
      setDeleting(false)
    }
  }

  const filtered = data.filter(s => {
    const q = search?.toLowerCase()
    return (
      s.name?.toLowerCase().includes(q)   ||
      s.email?.toLowerCase().includes(q)  ||
      s.dept?.toLowerCase().includes(q)   ||
      s.role?.toLowerCase().includes(q)   ||
      s.experience?.toLowerCase().includes(q)
    )
  })

  const stats = [
    { label: 'Total Applications', value: data.length },
    { label: 'This Month',         value: data.filter(s => new Date(s.submittedAt).getMonth() === new Date().getMonth()).length },
    { label: 'With Resume',        value: data.filter(s => s.resume).length },
    { label: 'With LinkedIn',      value: data.filter(s => s.linkedin).length },
  ]

  return (
    <>
      <style>{`
        @keyframes drawerSlideIn { from{transform:translateX(100%)} to{transform:translateX(0)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        .car-row:hover td { background: rgba(var(--red-dark-rgb),0.04) !important; cursor: pointer; }
        .car-row:hover td:first-child { border-left: 2px solid var(--red-bright) !important; }
        .car-cell { padding:14px 16px; border-bottom:1px solid rgba(var(--red-dark-rgb),0.08); vertical-align:middle; transition:background 0.2s; }
        .car-tag { display:inline-flex; align-items:center; gap:5px; padding:3px 10px; border-radius:100px; border:1px solid rgba(var(--red-dark-rgb),0.2); background:rgba(var(--red-dark-rgb),0.05); font-family:var(--font-display); font-size:0.58rem; color:var(--text-muted); letter-spacing:0.06em; white-space:nowrap; }
        .car-search { width:100%; padding:10px 14px 10px 38px; background:rgba(var(--red-dark-rgb),0.03); border:1px solid rgba(var(--red-dark-rgb),0.18); border-radius:8px; color:var(--text-primary); font-family:var(--font-light); font-size:0.85rem; outline:none; transition:border-color 0.25s, box-shadow 0.25s; box-sizing:border-box; }
        .car-search:focus { border-color:rgba(var(--red-dark-rgb),0.6); box-shadow:0 0 20px rgba(var(--red-dark-rgb),0.12); }
        .car-search::placeholder { color:var(--text-muted); }
        .car-stat { padding:1.25rem 1.5rem; border-radius:10px; border:1px solid rgba(var(--red-dark-rgb),0.15); background:var(--bg-card); transition:border-color 0.25s, box-shadow 0.25s; }
        .car-stat:hover { border-color:rgba(var(--red-dark-rgb),0.35); box-shadow:0 8px 28px rgba(var(--black-rgb),0.3); }
        .excel-btn { display:flex; align-items:center; gap:7px; padding:8px 16px; background:rgba(var(--success-soft-rgb),0.12); border:1px solid rgba(var(--success-rgb),0.3); border-radius:8px; color:var(--success); font-family:var(--font-display); font-size:0.55rem; letter-spacing:0.14em; text-transform:uppercase; cursor:pointer; transition:all 0.25s; }
        .excel-btn:hover { background:rgba(var(--success-soft-rgb),0.22); border-color:rgba(var(--success-rgb),0.6); box-shadow:0 0 16px rgba(var(--success-rgb),0.2); }
        .danger-btn { display:flex; align-items:center; gap:7px; padding:8px 16px; background:rgba(var(--red-dark-rgb),0.1); border:1px solid rgba(var(--red-dark-rgb),0.35); border-radius:8px; color:var(--red-bright); font-family:var(--font-display); font-size:0.55rem; letter-spacing:0.14em; text-transform:uppercase; cursor:pointer; transition:all 0.25s; }
        .danger-btn:hover { background:rgba(var(--red-dark-rgb),0.18); border-color:var(--red-bright); box-shadow:0 0 16px rgba(var(--red-dark-rgb),0.25); }
        .row-del-btn { width:28px; height:28px; border-radius:6px; border:1px solid rgba(var(--red-dark-rgb),0.2); background:rgba(var(--red-dark-rgb),0.04); color:var(--text-muted); cursor:pointer; display:inline-flex; align-items:center; justify-content:center; transition:all 0.2s; padding:0; }
        .row-del-btn:hover { border-color:var(--red-bright); background:rgba(var(--red-dark-rgb),0.14); color:var(--red-bright); }
        @media(max-width:768px) { .car-hide-mobile { display:none !important; } }
      `}</style>

      <div>
        {/* Stats */}
        {!loading && !error && (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))', gap:'1rem', marginBottom:'1.5rem' }}>
            {stats.map((s, i) => (
              <div key={s.label} className="car-stat" style={{ animation:`fadeUp 0.5s ease ${i * 0.07 + 0.1}s both` }}>
                <p style={{ fontFamily:'var(--font-display)', fontSize:'0.48rem', letterSpacing:'0.18em', textTransform:'uppercase', color:'var(--text-muted)', marginBottom:'6px' }}>{s.label}</p>
                <p style={{ fontFamily:'var(--font-display)', fontSize:'1.6rem', fontWeight:900, color:'var(--red-bright)', lineHeight:1 }}>{s.value}</p>
              </div>
            ))}
          </div>
        )}

        {/* Search + Excel */}
        <div style={{ display:'flex', alignItems:'center', gap:'1rem', marginBottom:'1.5rem', flexWrap:'wrap' }}>
          <div style={{ position:'relative', flex:1, minWidth:'220px', maxWidth:'420px' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(var(--red-dark-rgb),0.5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position:'absolute', left:'12px', top:'50%', transform:'translateY(-50%)', pointerEvents:'none' }}>
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input className="car-search" placeholder="Search by name, email, department…" value={search} onChange={e => setSearch(e.target.value)} />
          </div>

          {!loading && data.length > 0 && (
            <button className="excel-btn" onClick={() => downloadExcel(filtered.length < data.length ? filtered : data)}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="12" y1="18" x2="12" y2="12"/>
                <line x1="9" y1="15" x2="15" y2="15"/>
              </svg>
              Download Excel
            </button>
          )}

          {!loading && data.length > 0 && (
            <button className="danger-btn" onClick={() => setConfirm({ kind: 'all' })}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                <path d="M10 11v6M14 11v6"/>
                <path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/>
              </svg>
              Delete All
            </button>
          )}
        </div>

        {/* States */}
        {loading && (
          <div style={{ textAlign:'center', padding:'4rem', color:'var(--text-muted)', fontFamily:'var(--font-display)', fontSize:'0.7rem', letterSpacing:'0.18em', textTransform:'uppercase' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(var(--red-dark-rgb),0.5)" strokeWidth="2.5" style={{ animation:'spin 0.8s linear infinite', display:'block', margin:'0 auto 12px' }}>
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
            </svg>
            Loading applications…
          </div>
        )}
        {error && (
          <div style={{ padding:'1.5rem', borderRadius:'10px', border:'1px solid rgba(var(--red-dark-rgb),0.35)', background:'rgba(var(--red-dark-rgb),0.06)', color:'var(--red-bright)', fontFamily:'var(--font-display)', fontSize:'0.75rem' }}>{error}</div>
        )}
        {!loading && !error && filtered.length === 0 && (
          <div style={{ textAlign:'center', padding:'4rem', color:'var(--text-muted)', fontFamily:'var(--font-display)', fontSize:'0.7rem', letterSpacing:'0.18em', textTransform:'uppercase' }}>
            {search ? 'No results found' : 'No applications yet'}
          </div>
        )}

        {/* Table */}
        {!loading && !error && filtered.length > 0 && (
          <div style={{ borderRadius:'12px', border:'1px solid rgba(var(--red-dark-rgb),0.15)', overflow:'hidden', animation:'fadeUp 0.5s ease 0.25s both' }}>
            <div style={{ overflowX:'auto' }}>
              <table style={{ width:'100%', borderCollapse:'collapse' }}>
                <thead>
                  <tr style={{ background:'rgba(var(--red-dark-rgb),0.06)', borderBottom:'1px solid rgba(var(--red-dark-rgb),0.2)' }}>
                    {['#', 'Name', 'Email', 'Department', 'Role', 'Experience', 'Resume', 'Date', ''].map((h, i) => (
                      <th key={i} style={{ padding:'12px 16px', fontFamily:'var(--font-display)', fontSize:'0.48rem', letterSpacing:'0.18em', textTransform:'uppercase', color:'var(--red-bright)', textAlign:'left', whiteSpace:'nowrap', fontWeight:700 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((s, i) => (
                    <tr key={s.id} className="car-row" onClick={() => setSelected(s)} style={{ animation:`fadeUp 0.4s ease ${i * 0.04}s both` }}>
                      <td className="car-cell" style={{ color:'var(--text-muted)', fontFamily:'var(--font-display)', fontSize:'0.6rem', letterSpacing:'0.08em', width:'48px' }}>
                        {String(i + 1).padStart(2, '0')}
                      </td>
                      <td className="car-cell" style={{ minWidth:'160px' }}>
                        <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                          <div style={{ width:'32px', height:'32px', borderRadius:'50%', background:'rgba(var(--red-dark-rgb),0.12)', border:'1px solid rgba(var(--red-dark-rgb),0.25)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'var(--font-display)', fontSize:'0.6rem', fontWeight:700, color:'var(--red-bright)', flexShrink:0 }}>
                            {initials(s.name)}
                          </div>
                          <span style={{ fontFamily:'var(--font-display)', fontSize:'0.78rem', fontWeight:600, color:'var(--text-primary)' }}>{s.name}</span>
                        </div>
                      </td>
                      <td className="car-cell" style={{ fontFamily:'var(--font-light)', fontSize:'0.78rem', color:'var(--text-secondary)', minWidth:'200px' }}>{s.email}</td>
                      <td className="car-cell" style={{ minWidth:'130px' }}>
                        {s.dept ? <span className="car-tag"><span style={{ width:'3px', height:'3px', borderRadius:'50%', background:'var(--red-bright)', flexShrink:0 }} />{s.dept}</span> : <span style={{ color:'var(--text-muted)', fontSize:'0.75rem' }}>—</span>}
                      </td>
                      <td className="car-cell" style={{ fontFamily:'var(--font-light)', fontSize:'0.78rem', color:'var(--text-secondary)' }}>{s.role || '—'}</td>
                      <td className="car-cell">
                        {s.experience ? <span className="car-tag">{s.experience}</span> : <span style={{ color:'var(--text-muted)', fontSize:'0.75rem' }}>—</span>}
                      </td>
                      <td className="car-cell" onClick={e => e.stopPropagation()}>
                        {s.resume ? (
                          <a
                            href={s.resume}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ display:'inline-flex', alignItems:'center', gap:'6px', padding:'4px 10px', borderRadius:'100px', border:'1px solid rgba(var(--red-dark-rgb),0.3)', background:'rgba(var(--red-dark-rgb),0.06)', color:'var(--red-bright)', textDecoration:'none', fontFamily:'var(--font-display)', fontSize:'0.58rem', letterSpacing:'0.06em', whiteSpace:'nowrap' }}
                          >
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                              <polyline points="14 2 14 8 20 8"/>
                            </svg>
                            View PDF
                          </a>
                        ) : <span style={{ color:'var(--text-muted)', fontSize:'0.75rem' }}>—</span>}
                      </td>
                      <td className="car-cell" style={{ fontFamily:'var(--font-light)', fontSize:'0.72rem', color:'var(--text-muted)', whiteSpace:'nowrap' }}>{formatDate(s.submittedAt)}</td>
                      <td className="car-cell" style={{ width:'48px', textAlign:'center' }} onClick={e => e.stopPropagation()}>
                        <button
                          className="row-del-btn"
                          onClick={() => setConfirm({ kind: 'one', entry: s })}
                          aria-label={`Delete application from ${s.name}`}
                          title="Delete application"
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6"/>
                            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                            <path d="M10 11v6M14 11v6"/>
                            <path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/>
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ padding:'12px 16px', borderTop:'1px solid rgba(var(--red-dark-rgb),0.1)', background:'rgba(var(--red-dark-rgb),0.03)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <p style={{ fontFamily:'var(--font-display)', fontSize:'0.52rem', letterSpacing:'0.14em', color:'var(--text-muted)' }}>{filtered.length} of {data.length} applications</p>
              <p style={{ fontFamily:'var(--font-display)', fontSize:'0.52rem', letterSpacing:'0.14em', color:'var(--text-muted)' }}>Click a row to view details</p>
            </div>
          </div>
        )}
      </div>

      {selected && <DetailDrawer s={selected} onClose={() => setSelected(null)} />}

      {confirm && (
        <ConfirmModal
          title={confirm.kind === 'all' ? 'Delete all applications?' : 'Delete this application?'}
          message={
            confirm.kind === 'all'
              ? `This will permanently remove all ${data.length} applications and their resumes from S3. This cannot be undone.`
              : `This will permanently remove ${confirm.entry.name}'s application${confirm.entry.resume ? ' and their resume from S3' : ''}. This cannot be undone.`
          }
          confirmLabel={confirm.kind === 'all' ? 'Delete All' : 'Delete'}
          loading={deleting}
          onConfirm={handleConfirmDelete}
          onCancel={() => { if (!deleting) setConfirm(null) }}
        />
      )}

      {toast && (
        <div style={{ position:'fixed', bottom:'1.5rem', right:'1.5rem', zIndex:70, padding:'12px 18px', borderRadius:'10px', border:`1px solid ${toast.kind === 'ok' ? 'rgba(var(--success-rgb),0.45)' : 'rgba(var(--red-dark-rgb),0.45)'}`, background:toast.kind === 'ok' ? 'rgba(var(--success-soft-rgb),0.18)' : 'rgba(var(--red-dark-rgb),0.14)', color:toast.kind === 'ok' ? 'var(--success)' : 'var(--red-bright)', fontFamily:'var(--font-display)', fontSize:'0.7rem', letterSpacing:'0.06em', boxShadow:'0 16px 40px rgba(var(--black-rgb),0.5)', animation:'fadeUp 0.3s ease' }}>
          {toast.msg}
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </>
  )
}