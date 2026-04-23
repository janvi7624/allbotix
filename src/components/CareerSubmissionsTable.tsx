'use client'

import { useEffect, useState, useCallback } from 'react'

/* ─── Types ── */
interface CareerSubmission {
  id:          string
  submittedAt: string
  name:        string
  email:       string
  phone:       string
  dept:        string
  role:        string
  linkedin:    string
  resume:      string
  experience:  string
  why:         string
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
  const headers = ['ID', 'Submitted At', 'Full Name', 'Email', 'Phone', 'Department', 'Target Role', 'Experience', 'LinkedIn', 'Resume', 'Why Allbotix']
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

/* ─── Detail Drawer ── */
function DetailDrawer({ s, onClose }: { s: CareerSubmission; onClose: () => void }) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [onClose])

  const row = (label: string, value: string, isLink = false) =>
    value ? (
      <div style={{ display:'flex', flexDirection:'column', gap:'4px', padding:'12px 0', borderBottom:'1px solid rgba(176,58,46,0.1)' }}>
        <span style={{ fontFamily:'var(--font-display)', fontSize:'0.48rem', letterSpacing:'0.2em', textTransform:'uppercase', color:'var(--red-bright)' }}>{label}</span>
        {isLink
          ? <a href={value.startsWith('http') ? value : `https://${value}`} target="_blank" rel="noopener noreferrer" style={{ fontFamily:'var(--font-light)', fontSize:'0.85rem', color:'var(--red-bright)', lineHeight:1.6, textDecoration:'underline', wordBreak:'break-all' }}>{value}</a>
          : <span style={{ fontFamily:'var(--font-light)', fontSize:'0.85rem', color:'var(--text-primary)', lineHeight:1.6 }}>{value}</span>
        }
      </div>
    ) : null

  return (
    <>
      <div onClick={onClose} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.7)', backdropFilter:'blur(4px)', zIndex:50 }} />
      <div style={{ position:'fixed', top:0, right:0, bottom:0, width:'min(500px,100vw)', background:'var(--bg-900)', borderLeft:'1px solid rgba(176,58,46,0.25)', zIndex:51, display:'flex', flexDirection:'column', boxShadow:'-20px 0 60px rgba(0,0,0,0.6)', animation:'drawerSlideIn 0.3s cubic-bezier(0.23,1,0.32,1)' }}>

        <div style={{ height:'2px', background:'linear-gradient(90deg,var(--red-bright),transparent)', flexShrink:0 }} />

        {/* Header */}
        <div style={{ padding:'1.5rem 2rem', borderBottom:'1px solid rgba(176,58,46,0.15)', display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0 }}>
          <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
            <div style={{ width:'42px', height:'42px', borderRadius:'50%', background:'rgba(176,58,46,0.15)', border:'1px solid rgba(176,58,46,0.35)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'var(--font-display)', fontSize:'0.75rem', fontWeight:700, color:'var(--red-bright)' }}>
              {initials(s.name)}
            </div>
            <div>
              <p style={{ fontFamily:'var(--font-display)', fontSize:'0.9rem', fontWeight:700, color:'var(--text-primary)', marginBottom:'2px' }}>{s.name}</p>
              <p style={{ fontFamily:'var(--font-light)', fontSize:'0.72rem', color:'var(--text-muted)' }}>{formatDate(s.submittedAt)}</p>
            </div>
          </div>
          <button onClick={onClose} style={{ width:'32px', height:'32px', borderRadius:'6px', border:'1px solid rgba(176,58,46,0.25)', background:'rgba(176,58,46,0.06)', color:'var(--text-muted)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', transition:'all 0.2s' }}
            onMouseEnter={e => { const el = e.currentTarget; el.style.borderColor='var(--red-bright)'; el.style.color='var(--red-bright)' }}
            onMouseLeave={e => { const el = e.currentTarget; el.style.borderColor='rgba(176,58,46,0.25)'; el.style.color='var(--text-muted)' }}
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
          {row('Resume',      s.resume,   true)}
          {row('Submission ID', s.id)}

          {s.why && (
            <div style={{ padding:'12px 0' }}>
              <span style={{ fontFamily:'var(--font-display)', fontSize:'0.48rem', letterSpacing:'0.2em', textTransform:'uppercase', color:'var(--red-bright)', display:'block', marginBottom:'8px' }}>Why Allbotix?</span>
              <div style={{ background:'rgba(176,58,46,0.04)', border:'1px solid rgba(176,58,46,0.12)', borderRadius:'8px', padding:'14px', fontFamily:'var(--font-light)', fontSize:'0.83rem', color:'var(--text-secondary)', lineHeight:1.8, whiteSpace:'pre-wrap' }}>
                {s.why}
              </div>
            </div>
          )}
        </div>

        {/* Reply CTA */}
        <div style={{ padding:'1.25rem 2rem', borderTop:'1px solid rgba(176,58,46,0.15)', flexShrink:0 }}>
          <a href={`mailto:${s.email}?subject=Re: Your Application at Allbotix`}
            style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'8px', width:'100%', padding:'12px', background:'linear-gradient(135deg,var(--red-bright),var(--red-dim))', borderRadius:'8px', color:'#fff', textDecoration:'none', fontFamily:'var(--font-display)', fontSize:'0.65rem', fontWeight:700, letterSpacing:'0.16em', textTransform:'uppercase', transition:'box-shadow 0.3s, transform 0.2s' }}
            onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.boxShadow='0 0 28px rgba(176,58,46,0.5)'; el.style.transform='translateY(-1px)' }}
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

  useEffect(() => {
    fetch('/api/careers/submissions')
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false) })
      .catch(() => { setError('Failed to load submissions.'); setLoading(false) })
  }, [])

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
        .car-row:hover td { background: rgba(176,58,46,0.04) !important; cursor: pointer; }
        .car-row:hover td:first-child { border-left: 2px solid var(--red-bright) !important; }
        .car-cell { padding:14px 16px; border-bottom:1px solid rgba(176,58,46,0.08); vertical-align:middle; transition:background 0.2s; }
        .car-tag { display:inline-flex; align-items:center; gap:5px; padding:3px 10px; border-radius:100px; border:1px solid rgba(176,58,46,0.2); background:rgba(176,58,46,0.05); font-family:var(--font-display); font-size:0.58rem; color:var(--text-muted); letter-spacing:0.06em; white-space:nowrap; }
        .car-search { width:100%; padding:10px 14px 10px 38px; background:rgba(176,58,46,0.03); border:1px solid rgba(176,58,46,0.18); border-radius:8px; color:var(--text-primary); font-family:var(--font-light); font-size:0.85rem; outline:none; transition:border-color 0.25s, box-shadow 0.25s; box-sizing:border-box; }
        .car-search:focus { border-color:rgba(176,58,46,0.6); box-shadow:0 0 20px rgba(176,58,46,0.12); }
        .car-search::placeholder { color:var(--text-muted); }
        .car-stat { padding:1.25rem 1.5rem; border-radius:10px; border:1px solid rgba(176,58,46,0.15); background:var(--bg-card); transition:border-color 0.25s, box-shadow 0.25s; }
        .car-stat:hover { border-color:rgba(176,58,46,0.35); box-shadow:0 8px 28px rgba(0,0,0,0.3); }
        .excel-btn { display:flex; align-items:center; gap:7px; padding:8px 16px; background:rgba(34,85,34,0.12); border:1px solid rgba(34,139,34,0.3); border-radius:8px; color:#4caf50; font-family:var(--font-display); font-size:0.55rem; letter-spacing:0.14em; text-transform:uppercase; cursor:pointer; transition:all 0.25s; }
        .excel-btn:hover { background:rgba(34,85,34,0.22); border-color:rgba(34,139,34,0.6); box-shadow:0 0 16px rgba(34,139,34,0.2); }
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
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(176,58,46,0.5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position:'absolute', left:'12px', top:'50%', transform:'translateY(-50%)', pointerEvents:'none' }}>
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
        </div>

        {/* States */}
        {loading && (
          <div style={{ textAlign:'center', padding:'4rem', color:'var(--text-muted)', fontFamily:'var(--font-display)', fontSize:'0.7rem', letterSpacing:'0.18em', textTransform:'uppercase' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(176,58,46,0.5)" strokeWidth="2.5" style={{ animation:'spin 0.8s linear infinite', display:'block', margin:'0 auto 12px' }}>
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
            </svg>
            Loading applications…
          </div>
        )}
        {error && (
          <div style={{ padding:'1.5rem', borderRadius:'10px', border:'1px solid rgba(176,58,46,0.35)', background:'rgba(176,58,46,0.06)', color:'var(--red-bright)', fontFamily:'var(--font-display)', fontSize:'0.75rem' }}>{error}</div>
        )}
        {!loading && !error && filtered.length === 0 && (
          <div style={{ textAlign:'center', padding:'4rem', color:'var(--text-muted)', fontFamily:'var(--font-display)', fontSize:'0.7rem', letterSpacing:'0.18em', textTransform:'uppercase' }}>
            {search ? 'No results found' : 'No applications yet'}
          </div>
        )}

        {/* Table */}
        {!loading && !error && filtered.length > 0 && (
          <div style={{ borderRadius:'12px', border:'1px solid rgba(176,58,46,0.15)', overflow:'hidden', animation:'fadeUp 0.5s ease 0.25s both' }}>
            <div style={{ overflowX:'auto' }}>
              <table style={{ width:'100%', borderCollapse:'collapse' }}>
                <thead>
                  <tr style={{ background:'rgba(176,58,46,0.06)', borderBottom:'1px solid rgba(176,58,46,0.2)' }}>
                    {['#', 'Name', 'Email', 'Department', 'Role', 'Experience', 'Date', ''].map((h, i) => (
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
                          <div style={{ width:'32px', height:'32px', borderRadius:'50%', background:'rgba(176,58,46,0.12)', border:'1px solid rgba(176,58,46,0.25)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'var(--font-display)', fontSize:'0.6rem', fontWeight:700, color:'var(--red-bright)', flexShrink:0 }}>
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
                      <td className="car-cell" style={{ fontFamily:'var(--font-light)', fontSize:'0.72rem', color:'var(--text-muted)', whiteSpace:'nowrap' }}>{formatDate(s.submittedAt)}</td>
                      <td className="car-cell" style={{ width:'40px', textAlign:'center' }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(176,58,46,0.4)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                        </svg>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ padding:'12px 16px', borderTop:'1px solid rgba(176,58,46,0.1)', background:'rgba(176,58,46,0.03)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <p style={{ fontFamily:'var(--font-display)', fontSize:'0.52rem', letterSpacing:'0.14em', color:'var(--text-muted)' }}>{filtered.length} of {data.length} applications</p>
              <p style={{ fontFamily:'var(--font-display)', fontSize:'0.52rem', letterSpacing:'0.14em', color:'var(--text-muted)' }}>Click a row to view details</p>
            </div>
          </div>
        )}
      </div>

      {selected && <DetailDrawer s={selected} onClose={() => setSelected(null)} />}
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </>
  )
}