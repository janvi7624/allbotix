'use client'

import { useEffect, useState } from 'react'

/* ─── Types ── */
interface Submission {
  id:          string
  submittedAt: string
  firstName:   string
  lastName:    string
  email:       string
  phone:       string
  company:     string
  service:     string
  source:      string
  message:     string
}

/* ─── Helpers ── */
function formatDate(iso: string) {
  return new Date(iso).toLocaleString('en-IN', {
    timeZone:   'Asia/Kolkata',
    day:        '2-digit',
    month:      'short',
    year:       'numeric',
    hour:       '2-digit',
    minute:     '2-digit',
  })
}

function initials(s: Submission) {
  return `${s.firstName[0] ?? ''}${s.lastName[0] ?? ''}`.toUpperCase()
}

/* ─── Excel Download ── */
function downloadExcel(data: Submission[]) {
  const headers = ['ID', 'Submitted At', 'First Name', 'Last Name', 'Email', 'Phone', 'Company', 'Service', 'Found Via', 'Message']
  const rows = data.map(d => [
    d.id,
    new Date(d.submittedAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
    d.firstName, d.lastName, d.email, d.phone, d.company, d.service, d.source,
    d.message.replace(/\n/g, ' '),
  ])
  const escape = (v: string) => `"${String(v ?? '').replace(/"/g, '""')}"`
  const csv = [headers, ...rows].map(r => r.map(escape).join(',')).join('\n')
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a')
  a.href = url; a.download = `allbotix-contacts-${new Date().toISOString().slice(0,10)}.csv`; a.click()
  URL.revokeObjectURL(url)
}

/* ─── Detail drawer ── */
function DetailDrawer({ s, onClose }: { s: Submission; onClose: () => void }) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const row = (label: string, value: string) =>
    value ? (
      <div style={{ display:'flex', flexDirection:'column', gap:'4px', padding:'12px 0', borderBottom:'1px solid rgba(var(--red-dark-rgb),0.1)' }}>
        <span style={{ fontFamily:'var(--font-display)', fontSize:'0.48rem', letterSpacing:'0.2em', textTransform:'uppercase', color:'var(--red-bright)' }}>{label}</span>
        <span style={{ fontFamily:'var(--font-light)', fontSize:'0.85rem', color:'var(--text-primary)', lineHeight:1.6 }}>{value}</span>
      </div>
    ) : null

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{ position:'fixed', inset:0, background:'rgba(var(--black-rgb),0.7)', backdropFilter:'blur(4px)', zIndex:50 }}
      />

      {/* Drawer */}
      <div style={{
        position:'fixed', top:0, right:0, bottom:0, width:'min(480px, 100vw)',
        background:'var(--bg-900)', borderLeft:'1px solid rgba(var(--red-dark-rgb),0.25)',
        zIndex:51, display:'flex', flexDirection:'column',
        boxShadow:'-20px 0 60px rgba(var(--black-rgb),0.6)',
        animation:'drawerSlideIn 0.3s cubic-bezier(0.23,1,0.32,1)',
      }}>

        {/* Top accent */}
        <div style={{ height:'2px', background:'linear-gradient(90deg,var(--red-bright),transparent)', flexShrink:0 }} />

        {/* Header */}
        <div style={{ padding:'1.5rem 2rem', borderBottom:'1px solid rgba(var(--red-dark-rgb),0.15)', display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0 }}>
          <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
            <div style={{ width:'42px', height:'42px', borderRadius:'50%', background:'rgba(var(--red-dark-rgb),0.15)', border:'1px solid rgba(var(--red-dark-rgb),0.35)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'var(--font-display)', fontSize:'0.75rem', fontWeight:700, color:'var(--red-bright)' }}>
              {initials(s)}
            </div>
            <div>
              <p style={{ fontFamily:'var(--font-display)', fontSize:'0.9rem', fontWeight:700, color:'var(--text-primary)', marginBottom:'2px' }}>
                {s.firstName} {s.lastName}
              </p>
              <p style={{ fontFamily:'var(--font-light)', fontSize:'0.72rem', color:'var(--text-muted)' }}>{formatDate(s.submittedAt)}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ width:'32px', height:'32px', borderRadius:'6px', border:'1px solid rgba(var(--red-dark-rgb),0.25)', background:'rgba(var(--red-dark-rgb),0.06)', color:'var(--text-muted)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', transition:'all 0.2s' }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor='var(--red-bright)'; (e.currentTarget as HTMLButtonElement).style.color='var(--red-bright)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor='rgba(var(--red-dark-rgb),0.25)'; (e.currentTarget as HTMLButtonElement).style.color='var(--text-muted)' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Fields */}
        <div style={{ flex:1, overflowY:'auto', padding:'0 2rem' }}>
          {row('Email',        s.email)}
          {row('Phone',        s.phone)}
          {row('Company',      s.company)}
          {row('Service',      s.service)}
          {row('Found Us Via', s.source)}
          {row('Submission ID', s.id)}

          {/* Message */}
          {s.message && (
            <div style={{ padding:'12px 0' }}>
              <span style={{ fontFamily:'var(--font-display)', fontSize:'0.48rem', letterSpacing:'0.2em', textTransform:'uppercase', color:'var(--red-bright)', display:'block', marginBottom:'8px' }}>Message</span>
              <div style={{ background:'rgba(var(--red-dark-rgb),0.04)', border:'1px solid rgba(var(--red-dark-rgb),0.12)', borderRadius:'8px', padding:'14px', fontFamily:'var(--font-light)', fontSize:'0.83rem', color:'var(--text-secondary)', lineHeight:1.8, whiteSpace:'pre-wrap' }}>
                {s.message}
              </div>
            </div>
          )}
        </div>

        {/* Reply CTA */}
        <div style={{ padding:'1.25rem 2rem', borderTop:'1px solid rgba(var(--red-dark-rgb),0.15)', flexShrink:0 }}>
          <a
            href={`mailto:${s.email}?subject=Re: Your Enquiry — Allbotix`}
            style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'8px', width:'100%', padding:'12px', background:'linear-gradient(135deg,var(--red-bright),var(--red-dim))', borderRadius:'8px', color:'var(--white)', textDecoration:'none', fontFamily:'var(--font-display)', fontSize:'0.65rem', fontWeight:700, letterSpacing:'0.16em', textTransform:'uppercase', transition:'box-shadow 0.3s, transform 0.2s' }}
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.boxShadow='0 0 28px rgba(var(--red-dark-rgb),0.5)'; (e.currentTarget as HTMLAnchorElement).style.transform='translateY(-1px)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.boxShadow='none'; (e.currentTarget as HTMLAnchorElement).style.transform='translateY(0)' }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
            Reply to {s.firstName}
          </a>
        </div>
      </div>
    </>
  )
}

/* ─── Main Component ── */
export default function ContactSubmissionsTable() {
  const [data,     setData]     = useState<Submission[]>([])
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState('')
  const [search,   setSearch]   = useState('')
  const [selected, setSelected] = useState<Submission | null>(null)
  const [mounted,  setMounted]  = useState(false)

  useEffect(() => {
    setMounted(true)
    fetch('/api/contact/submissions')
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false) })
      .catch(() => { setError('Failed to load submissions.'); setLoading(false) })
  }, [])

  const filtered = data.filter(s => {
    const q = search?.toLowerCase()
    return (
      s.firstName?.toLowerCase().includes(q) ||
      s.lastName?.toLowerCase().includes(q)  ||
      s.email?.toLowerCase().includes(q)     ||
      s.company?.toLowerCase().includes(q)   ||
      s.service?.toLowerCase().includes(q)   ||
      s.source?.toLowerCase().includes(q)
    )
  })

  return (
    <>
      <style>{`
        @keyframes drawerSlideIn { from { transform: translateX(100%) } to { transform: translateX(0) } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px) } to { opacity:1; transform:translateY(0) } }
        .cs-cell {
          padding: 14px 16px;
          border-bottom: 1px solid rgba(var(--red-dark-rgb),0.08);
          vertical-align: middle;
          transition: background 0.2s;
        }
        .cs-row:hover .cs-cell {
          background: rgba(var(--red-dark-rgb),0.04);
          cursor: pointer;
        }
        .cs-row:hover .cs-cell:first-child { border-left: 2px solid var(--red-bright); }

        .cs-tag {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 3px 10px; border-radius: 100px;
          border: 1px solid rgba(var(--red-dark-rgb),0.2);
          background: rgba(var(--red-dark-rgb),0.05);
          font-family: var(--font-display); font-size: 0.58rem;
          color: var(--text-muted); letter-spacing: 0.06em;
          white-space: nowrap;
        }

        .cs-search {
          width: 100%; padding: 10px 14px 10px 38px;
          background: rgba(var(--red-dark-rgb),0.03);
          border: 1px solid rgba(var(--red-dark-rgb),0.18);
          border-radius: 8px; color: var(--text-primary);
          font-family: var(--font-light); font-size: 0.85rem;
          outline: none; transition: border-color 0.25s, box-shadow 0.25s;
        }
        .cs-search:focus {
          border-color: rgba(var(--red-dark-rgb),0.6);
          box-shadow: 0 0 20px rgba(var(--red-dark-rgb),0.12);
        }
        .cs-search::placeholder { color: var(--text-muted); }

        .cs-stat {
          padding: 1.25rem 1.5rem; border-radius: 10px;
          border: 1px solid rgba(var(--red-dark-rgb),0.15);
          background: var(--bg-card);
          transition: border-color 0.25s, box-shadow 0.25s;
        }
        .cs-stat:hover {
          border-color: rgba(var(--red-dark-rgb),0.35);
          box-shadow: 0 8px 28px rgba(var(--black-rgb),0.3);
        }

        .cs-excel-btn { display:flex; align-items:center; gap:7px; padding:8px 16px; background:rgba(var(--success-soft-rgb),0.12); border:1px solid rgba(var(--success-rgb),0.3); border-radius:8px; color:var(--success); font-family:var(--font-display); font-size:0.55rem; letter-spacing:0.14em; text-transform:uppercase; cursor:pointer; transition:all 0.25s; }
        .cs-excel-btn:hover { background:rgba(var(--success-soft-rgb),0.22); border-color:rgba(var(--success-rgb),0.6); box-shadow:0 0 16px rgba(var(--success-rgb),0.2); }
        @media (max-width: 768px) {
          .cs-hide-mobile { display: none !important; }
        }
      `}</style>

      <div>

          {/* Stats row */}
          {!loading && !error && mounted && (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))', gap:'1rem', marginBottom:'2rem', animation:'fadeUp 0.5s ease 0.05s both' }}>
              {[
                { label:'Total Leads',     value: data.length,                                             icon:'📋' },
                { label:'This Month',      value: data.filter(s => new Date(s.submittedAt).getMonth() === new Date().getMonth()).length, icon:'📅' },
                { label:'With Company',    value: data.filter(s => s.company).length,                      icon:'🏢' },
                { label:'Services Asked',  value: data.filter(s => s.service).length,                      icon:'🤖' },
              ].map((stat, i) => (
                <div key={stat.label} className="cs-stat" style={{ animation:`fadeUp 0.5s ease ${i * 0.07 + 0.1}s both` }}>
                  <p style={{ fontFamily:'var(--font-display)', fontSize:'0.48rem', letterSpacing:'0.18em', textTransform:'uppercase', color:'var(--text-muted)', marginBottom:'6px' }}>{stat.label}</p>
                  <p style={{ fontFamily:'var(--font-display)', fontSize:'1.6rem', fontWeight:900, color:'var(--red-bright)', lineHeight:1 }}>{stat.value}</p>
                </div>
              ))}
            </div>
          )}

          {/* Search + Excel */}
          <div style={{ display:'flex', alignItems:'center', gap:'1rem', marginBottom:'1.5rem', flexWrap:'wrap' }}>
            <div style={{ position:'relative', flex:1, minWidth:'220px', maxWidth:'420px', animation:'fadeUp 0.5s ease 0.2s both' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(var(--red-dark-rgb),0.5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position:'absolute', left:'12px', top:'50%', transform:'translateY(-50%)', pointerEvents:'none' }}>
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                className="cs-search"
                placeholder="Search by name, email, company, service…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            {!loading && data.length > 0 && (
              <button className="cs-excel-btn" onClick={() => downloadExcel(filtered.length < data.length ? filtered : data)}>
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
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--red-bright)" strokeWidth="2.5" style={{ animation:'spin 0.8s linear infinite', marginBottom:'12px', display:'block', margin:'0 auto 12px' }}>
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
              </svg>
              Loading submissions…
            </div>
          )}

          {error && (
            <div style={{ padding:'1.5rem', borderRadius:'10px', border:'1px solid rgba(var(--red-dark-rgb),0.35)', background:'rgba(var(--red-dark-rgb),0.06)', color:'var(--red-bright)', fontFamily:'var(--font-display)', fontSize:'0.75rem', letterSpacing:'0.06em' }}>
              {error}
            </div>
          )}

          {!loading && !error && filtered.length === 0 && (
            <div style={{ textAlign:'center', padding:'4rem', color:'var(--text-muted)', fontFamily:'var(--font-display)', fontSize:'0.7rem', letterSpacing:'0.18em', textTransform:'uppercase' }}>
              {search ? 'No results found' : 'No submissions yet'}
            </div>
          )}

          {/* Table */}
          {!loading && !error && filtered.length > 0 && (
            <div style={{ borderRadius:'12px', border:'1px solid rgba(var(--red-dark-rgb),0.15)', overflow:'hidden', animation:'fadeUp 0.5s ease 0.25s both' }}>
              <div style={{ overflowX:'auto' }}>
                <table style={{ width:'100%', borderCollapse:'collapse' }}>

                  {/* Head */}
                  <thead>
                    <tr style={{ background:'rgba(var(--red-dark-rgb),0.06)', borderBottom:'1px solid rgba(var(--red-dark-rgb),0.2)' }}>
                      {['#', 'Name', 'Email', 'Phone', 'Company', 'Service', 'Found Via', 'Date', ''].map((h, i) => (
                        <th key={i} className={['Phone','Company'].includes(h) ? 'cs-hide-mobile' : ''} style={{ padding:'12px 16px', fontFamily:'var(--font-display)', fontSize:'0.48rem', letterSpacing:'0.18em', textTransform:'uppercase', color:'var(--red-bright)', textAlign:'left', whiteSpace:'nowrap', fontWeight:700 }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  {/* Body */}
                  <tbody>
                    {filtered.map((s, i) => (
                      <tr
                        key={s.id}
                        className="cs-row"
                        onClick={() => setSelected(s)}
                        style={{ animation:`fadeUp 0.4s ease ${i * 0.04}s both` }}
                      >
                        {/* # */}
                        <td className="cs-cell" style={{ color:'var(--text-muted)', fontFamily:'var(--font-display)', fontSize:'0.6rem', letterSpacing:'0.08em', width:'48px' }}>
                          {String(i + 1).padStart(2, '0')}
                        </td>

                        {/* Name */}
                        <td className="cs-cell" style={{ minWidth:'160px' }}>
                          <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                            <div style={{ width:'32px', height:'32px', borderRadius:'50%', background:'rgba(var(--red-dark-rgb),0.12)', border:'1px solid rgba(var(--red-dark-rgb),0.25)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'var(--font-display)', fontSize:'0.6rem', fontWeight:700, color:'var(--red-bright)', flexShrink:0 }}>
                              {initials(s)}
                            </div>
                            <span style={{ fontFamily:'var(--font-display)', fontSize:'0.78rem', fontWeight:600, color:'var(--text-primary)' }}>
                              {s.firstName} {s.lastName}
                            </span>
                          </div>
                        </td>

                        {/* Email */}
                        <td className="cs-cell" style={{ fontFamily:'var(--font-light)', fontSize:'0.78rem', color:'var(--text-secondary)', minWidth:'200px' }}>
                          {s.email}
                        </td>

                        {/* Phone */}
                        <td className="cs-cell cs-hide-mobile" style={{ fontFamily:'var(--font-light)', fontSize:'0.78rem', color:'var(--text-secondary)', whiteSpace:'nowrap' }}>
                          {s.phone || '—'}
                        </td>

                        {/* Company */}
                        <td className="cs-cell cs-hide-mobile" style={{ fontFamily:'var(--font-light)', fontSize:'0.78rem', color:'var(--text-secondary)' }}>
                          {s.company || '—'}
                        </td>

                        {/* Service */}
                        <td className="cs-cell" style={{ minWidth:'140px' }}>
                          {s.service
                            ? <span className="cs-tag"><span style={{ width:'3px', height:'3px', borderRadius:'50%', background:'var(--red-bright)', flexShrink:0 }} />{s.service}</span>
                            : <span style={{ color:'var(--text-muted)', fontSize:'0.75rem' }}>—</span>
                          }
                        </td>

                        {/* Source */}
                        <td className="cs-cell" style={{ minWidth:'130px' }}>
                          {s.source
                            ? <span className="cs-tag">{s.source}</span>
                            : <span style={{ color:'var(--text-muted)', fontSize:'0.75rem' }}>—</span>
                          }
                        </td>

                        {/* Date */}
                        <td className="cs-cell" style={{ fontFamily:'var(--font-light)', fontSize:'0.72rem', color:'var(--text-muted)', whiteSpace:'nowrap' }}>
                          {formatDate(s.submittedAt)}
                        </td>

                        {/* Arrow */}
                        <td className="cs-cell" style={{ width:'40px', textAlign:'center' }}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(var(--red-dark-rgb),0.4)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                          </svg>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Footer */}
              <div style={{ padding:'12px 16px', borderTop:'1px solid rgba(var(--red-dark-rgb),0.1)', background:'rgba(var(--red-dark-rgb),0.03)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <p style={{ fontFamily:'var(--font-display)', fontSize:'0.52rem', letterSpacing:'0.14em', color:'var(--text-muted)' }}>
                  {filtered.length} of {data.length} submissions
                </p>
                <p style={{ fontFamily:'var(--font-display)', fontSize:'0.52rem', letterSpacing:'0.14em', color:'var(--text-muted)' }}>
                  Click a row to view details
                </p>
              </div>
            </div>
          )}
      </div>

      {/* Detail drawer */}
      {selected && <DetailDrawer s={selected} onClose={() => setSelected(null)} />}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg) } }
        @keyframes cs-pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
      `}</style>
    </>
  )
}