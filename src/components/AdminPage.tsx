'use client'

import { useState, useEffect } from 'react'
import ContactSubmissionsTable from '@/components/ContactSubmissionsTable'
import CareerSubmissionsTable  from '@/components/CareerSubmissionsTable'

type Tab = 'contact' | 'careers'

/* ─── Login Form ── */
function LoginForm({ onSuccess }: { onSuccess: () => void }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')
  const [showPass, setShowPass] = useState(false)
  const [mounted,  setMounted]  = useState(false)

  useEffect(() => { setTimeout(() => setMounted(true), 60) }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!username || !password) return
    setLoading(true); setError('')
    try {
      const res  = await fetch('/api/admin/login', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ username, password }) })
      const data = await res.json()
      if (!res.ok) { setError(data.error ?? 'Invalid credentials.'); setLoading(false); return }
      onSuccess()
    } catch {
      setError('Connection error. Please try again.')
      setLoading(false)
    }
  }

  return (
    <>
      <style>{`
        @keyframes loginFadeUp { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
        @keyframes loginGlow   { 0%,100%{opacity:0.55;transform:scale(1)} 50%{opacity:1;transform:scale(1.1)} }
        @keyframes loginScan   { 0%{top:-4%;opacity:0.45} 100%{top:108%;opacity:0} }
        @keyframes loginRingCW { to{transform:translate(-50%,-50%) rotate(360deg)} }
        @keyframes loginPulse  { 0%,100%{box-shadow:0 0 0 0 rgba(var(--red-dark-rgb),0.4)} 60%{box-shadow:0 0 0 8px rgba(var(--red-dark-rgb),0)} }
        @keyframes spinLoader  { to{transform:rotate(360deg)} }
        @keyframes shake       { 0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-6px)} 40%,80%{transform:translateX(6px)} }
        .login-input { width:100%; padding:13px 14px; background:rgba(var(--red-dark-rgb),0.02); border:1px solid rgba(var(--red-dark-rgb),0.18); border-radius:8px; color:var(--text-primary); font-family:var(--font-light); font-size:0.88rem; outline:none; transition:border-color 0.25s,background 0.25s,box-shadow 0.25s; box-sizing:border-box; }
        .login-input:focus { border-color:rgba(var(--red-dark-rgb),0.6); background:rgba(var(--red-dark-rgb),0.05); box-shadow:0 0 20px rgba(var(--red-dark-rgb),0.12),inset 0 1px 0 rgba(var(--red-dark-rgb),0.08); }
        .login-input::placeholder { color:var(--text-muted); }
        .login-btn { width:100%; padding:14px; background:linear-gradient(135deg,var(--red-bright),var(--red-dim)); border:none; border-radius:8px; color:var(--white); font-family:var(--font-display); font-size:0.68rem; font-weight:700; letter-spacing:0.2em; text-transform:uppercase; cursor:pointer; position:relative; overflow:hidden; transition:box-shadow 0.3s,transform 0.2s; }
        .login-btn:hover:not(:disabled) { box-shadow:0 0 32px rgba(var(--red-dark-rgb),0.5),0 8px 24px rgba(var(--black-rgb),0.4); transform:translateY(-2px); }
        .login-btn:disabled { opacity:0.65; cursor:not-allowed; transform:none; }
        .login-btn::after { content:''; position:absolute; top:0; left:-100%; width:60%; height:100%; background:linear-gradient(90deg,transparent,rgba(var(--white-rgb),0.14),transparent); transform:skewX(-20deg); transition:left 0.5s; }
        .login-btn:hover:not(:disabled)::after { left:160%; }
      `}</style>

      <div style={{ minHeight:'100vh', background:'var(--bg-900)', display:'flex', alignItems:'center', justifyContent:'center', position:'relative', overflow:'hidden' }}>
        <div aria-hidden="true" style={{ position:'absolute', top:'10%', right:'-8%', width:'450px', height:'450px', borderRadius:'50%', background:'radial-gradient(circle,rgba(var(--red-dark-rgb),0.07) 0%,transparent 70%)', pointerEvents:'none', animation:'loginGlow 6s ease-in-out infinite' }} />
        <div aria-hidden="true" style={{ position:'absolute', bottom:'10%', left:'-8%', width:'380px', height:'380px', borderRadius:'50%', background:'radial-gradient(circle,rgba(var(--red-dark-rgb),0.05) 0%,transparent 70%)', pointerEvents:'none', animation:'loginGlow 8s ease-in-out 2s infinite' }} />
        <div aria-hidden="true" style={{ position:'absolute', left:0, right:0, height:'2px', background:'linear-gradient(90deg,transparent,rgba(var(--red-dark-rgb),0.35),transparent)', animation:'loginScan 5s linear infinite', pointerEvents:'none', zIndex:1 }} />
        <div aria-hidden="true" style={{ position:'absolute', width:'520px', height:'520px', borderRadius:'50%', border:'1px dashed rgba(var(--red-dark-rgb),0.08)', top:'50%', left:'50%', animation:'loginRingCW 30s linear infinite', pointerEvents:'none' }} />

        <div style={{ position:'relative', zIndex:2, width:'min(420px,calc(100vw - 2rem))', opacity:mounted?1:0, transform:mounted?'translateY(0)':'translateY(30px)', transition:'opacity 0.7s ease,transform 0.7s ease' }}>
          <div style={{ background:'var(--bg-card)', border:'1px solid rgba(var(--red-dark-rgb),0.2)', borderRadius:'16px', overflow:'hidden', boxShadow:'0 32px 80px rgba(var(--black-rgb),0.6),0 0 40px rgba(var(--red-dark-rgb),0.06)' }}>
            <div style={{ height:'2px', background:'linear-gradient(90deg,var(--red-bright),var(--red-dim),transparent)' }} />

            <div style={{ padding:'2.5rem' }}>
              <div style={{ textAlign:'center', marginBottom:'2rem', animation:mounted?'loginFadeUp 0.5s ease 0.1s both':'none' }}>
                <div style={{ width:'56px', height:'56px', borderRadius:'14px', border:'1px solid rgba(var(--red-dark-rgb),0.35)', background:'rgba(var(--red-dark-rgb),0.08)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 1rem', animation:'loginPulse 2.5s ease-in-out infinite', color:'var(--red-bright)' }}>
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="10" rx="2"/>
                    <path d="M12 2v4M9 11V7a3 3 0 016 0v4"/>
                    <circle cx="8.5" cy="16" r="1"/><circle cx="15.5" cy="16" r="1"/>
                    <path d="M9 19h6"/>
                  </svg>
                </div>
                <p style={{ fontFamily:'var(--font-display)', fontSize:'0.48rem', letterSpacing:'0.24em', textTransform:'uppercase', color:'var(--red-bright)', marginBottom:'4px' }}>Allbotix Admin</p>
                <h1 style={{ fontFamily:'var(--font-display)', fontSize:'1.3rem', fontWeight:900, color:'var(--text-primary)', letterSpacing:'0.02em' }}>Sign In</h1>
              </div>

              <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:'1rem', animation:mounted?'loginFadeUp 0.5s ease 0.18s both':'none' }}>
                <div>
                  <label style={{ display:'block', fontFamily:'var(--font-display)', fontSize:'0.52rem', letterSpacing:'0.16em', textTransform:'uppercase', color:'var(--text-muted)', marginBottom:'6px' }}>Username</label>
                  <div style={{ position:'relative' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(var(--red-dark-rgb),0.45)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position:'absolute', left:'12px', top:'50%', transform:'translateY(-50%)', pointerEvents:'none' }}>
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                    </svg>
                    <input type="text" className="login-input" style={{ paddingLeft:'38px' }} placeholder="Enter username" value={username} onChange={e => setUsername(e.target.value)} autoComplete="username" required />
                  </div>
                </div>

                <div>
                  <label style={{ display:'block', fontFamily:'var(--font-display)', fontSize:'0.52rem', letterSpacing:'0.16em', textTransform:'uppercase', color:'var(--text-muted)', marginBottom:'6px' }}>Password</label>
                  <div style={{ position:'relative' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(var(--red-dark-rgb),0.45)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position:'absolute', left:'12px', top:'50%', transform:'translateY(-50%)', pointerEvents:'none' }}>
                      <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                    <input type={showPass?'text':'password'} className="login-input" style={{ paddingLeft:'38px', paddingRight:'42px' }} placeholder="Enter password" value={password} onChange={e => setPassword(e.target.value)} autoComplete="current-password" required />
                    <button type="button" onClick={() => setShowPass(p => !p)} style={{ position:'absolute', right:'12px', top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'rgba(var(--red-dark-rgb),0.45)', padding:'2px', display:'flex', alignItems:'center' }}>
                      {showPass
                        ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                        : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                      }
                    </button>
                  </div>
                </div>

                {error && (
                  <div style={{ display:'flex', alignItems:'center', gap:'8px', padding:'10px 14px', borderRadius:'8px', background:'rgba(var(--red-dark-rgb),0.08)', border:'1px solid rgba(var(--red-dark-rgb),0.3)', animation:'shake 0.4s ease' }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--red-bright)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink:0 }}>
                      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    <p style={{ fontFamily:'var(--font-display)', fontSize:'0.65rem', color:'var(--red-bright)', letterSpacing:'0.04em' }}>{error}</p>
                  </div>
                )}

                <button type="submit" className="login-btn" disabled={loading || !username || !password} style={{ marginTop:'0.5rem' }}>
                  {loading
                    ? <span style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'8px' }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation:'spinLoader 0.8s linear infinite' }}>
                          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                        </svg>
                        Signing In…
                      </span>
                    : 'Sign In'
                  }
                </button>
              </form>
            </div>
          </div>
          <p style={{ textAlign:'center', marginTop:'1.25rem', fontFamily:'var(--font-display)', fontSize:'0.52rem', letterSpacing:'0.14em', color:'var(--text-muted)', opacity:0.5 }}>
            ALLBOTIX ADMIN PANEL · RESTRICTED ACCESS
          </p>
        </div>
      </div>
    </>
  )
}

/* ─── Dashboard ── */
function Dashboard({ onLogout }: { onLogout: () => void }) {
  const [tab, setTab] = useState<Tab>('contact')

  return (
    <>
      <style>{`
        @keyframes tabFadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes cs-pulse  { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes spin      { to{transform:rotate(360deg)} }

        .admin-tab {
          display: flex; align-items: center; gap: 8px;
          padding: 8px 20px; border-radius: 8px;
          font-family: var(--font-display); font-size: 0.6rem;
          font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase;
          cursor: pointer; transition: all 0.25s; white-space: nowrap;
        }
        .admin-tab.active {
          background: rgba(var(--red-dark-rgb),0.18); border: 1px solid rgba(var(--red-dark-rgb),0.45);
          color: var(--red-bright); box-shadow: 0 0 18px rgba(var(--red-dark-rgb),0.15);
        }
        .admin-tab.inactive {
          background: rgba(var(--red-dark-rgb),0.04); border: 1px solid rgba(var(--red-dark-rgb),0.15);
          color: var(--text-muted);
        }
        .admin-tab.inactive:hover {
          background: rgba(var(--red-dark-rgb),0.09); border-color: rgba(var(--red-dark-rgb),0.3);
          color: var(--text-secondary);
        }
        .tab-panel { animation: tabFadeIn 0.32s cubic-bezier(0.23,1,0.32,1) both; }
        .logout-btn { display:flex; align-items:center; gap:7px; padding:8px 14px; background:rgba(var(--red-dark-rgb),0.08); border:1px solid rgba(var(--red-dark-rgb),0.25); border-radius:8px; color:var(--text-muted); font-family:var(--font-display); font-size:0.55rem; letter-spacing:0.14em; text-transform:uppercase; cursor:pointer; transition:all 0.25s; }
        .logout-btn:hover { border-color:var(--red-bright); color:var(--red-bright); background:rgba(var(--red-dark-rgb),0.14); }
      `}</style>

      <div style={{ minHeight:'100vh', background:'var(--bg-900)', paddingBottom:'6rem', paddingTop:'clamp(120px, 12vw, 120px)' }}>

        {/* ── Sticky Header ── */}
        <div style={{ borderTop:'1px solid rgba(var(--red-dark-rgb),0.15)', background:'var(--bg-900)', backdropFilter:'blur(14px)', position:'sticky', top:0, zIndex:20, padding:'0.5rem 0' }}>
          <div style={{ maxWidth:'1400px', margin:'0 auto', padding:'0 2rem' }}>

            {/* Brand + Logout row */}
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', paddingTop:'1rem', paddingBottom:'0.75rem', gap:'1rem', flexWrap:'wrap', borderBottom:'1px solid rgba(var(--red-dark-rgb),0.07)' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
                <div style={{ width:'8px', height:'8px', borderRadius:'50%', background:'var(--red-bright)', boxShadow:'0 0 10px rgba(var(--red-dark-rgb),0.8)', animation:'cs-pulse 2s ease-in-out infinite' }} />
                <div>
                  <p style={{ fontFamily:'var(--font-display)', fontSize:'0.44rem', letterSpacing:'0.24em', textTransform:'uppercase', color:'var(--red-bright)', marginBottom:'1px' }}>Allbotix Admin</p>
                  <h1 style={{ fontFamily:'var(--font-display)', fontSize:'0.95rem', fontWeight:900, color:'var(--text-primary)', letterSpacing:'0.04em' }}>
                    {tab === 'contact' ? 'Contact Enquiries' : 'Career Applications'}
                  </h1>
                </div>
              </div>

              <button className="logout-btn" onClick={onLogout}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                  <polyline points="16 17 21 12 16 7"/>
                  <line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
                Logout
              </button>
            </div>

            {/* Tab switcher row */}
            <div style={{ display:'flex', alignItems:'center', gap:'8px', paddingBlock:'0.75rem' }}>
              <button className={`admin-tab ${tab === 'contact' ? 'active' : 'inactive'}`} onClick={() => setTab('contact')}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                Contact Enquiries
              </button>

              <button className={`admin-tab ${tab === 'careers' ? 'active' : 'inactive'}`} onClick={() => setTab('careers')}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="7" width="20" height="14" rx="2"/>
                  <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
                  <line x1="12" y1="12" x2="12" y2="16"/>
                  <line x1="10" y1="14" x2="14" y2="14"/>
                </svg>
                Career Applications
              </button>
            </div>
          </div>
        </div>

        {/* ── Content ── */}
        <div style={{ maxWidth:'1400px', margin:'0 auto', padding:'2rem' }}>
          <div key={tab} className="tab-panel">
            {tab === 'contact' ? <ContactSubmissionsTable /> : <CareerSubmissionsTable />}
          </div>
        </div>

      </div>
    </>
  )
}

/* ─── Root ── */
export default function AdminPage() {
  const [authed,  setAuthed]  = useState(false)
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    fetch('/api/contact/submissions')
      .then(r => { if (r.ok) setAuthed(true); setChecked(true) })
      .catch(() => setChecked(true))
  }, [])

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method:'POST' })
    setAuthed(false)
  }

  if (!checked) return (
    <div style={{ minHeight:'100vh', background:'var(--bg-900)', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(var(--red-dark-rgb),0.5)" strokeWidth="2.5" style={{ animation:'spin 0.8s linear infinite' }}>
        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
      </svg>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )

  if (!authed) return <LoginForm onSuccess={() => setAuthed(true)} />
  return <Dashboard onLogout={handleLogout} />
}