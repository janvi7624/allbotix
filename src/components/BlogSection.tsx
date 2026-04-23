'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, useRef, useEffect } from 'react'

/* ─── Types ──────────────────────────────────────────────────────────────── */
interface BlogPost {
  id: string
  slug: string
  image: string
  category?: string
  author: string
  authorAvatar?: string
  date: string
  readTime: string
  title: string
  excerpt: string
  views: string
  comments: string
  liked?: boolean
  featured?: boolean
}

/* ─── Sample Data ────────────────────────────────────────────────────────── */
const POSTS: BlogPost[] = [
  {
    id: '1',
    slug: 'mayank-jani-leadership-nanta-tech',
    image: '/blog/mayank-jani.jpg',
    category: 'Leadership',
    author: 'Allbotix',
    date: 'Feb 7',
    readTime: '3 min read',
    title: "Mayank Jani's Journey: Leadership and Innovation Behind Nanta Tech's Rise to 2026 Under 40",
    excerpt: "40 Under 40, 2026: Mayank Jani: Leading with Heart and Technology. To Shape Businesses. When industries face complex challenges, Mayank Jani thrives on turning them into...",
    views: '11 views',
    comments: '0 comments',
    liked: false,
    featured: true,
  },
  {
    id: '2',
    slug: 'ai-robotics-pilots-to-production',
    image: '/blog/ai-robotics.jpg',
    category: 'AI & Robotics',
    author: 'Allbotix',
    date: 'Jun 19, 2024',
    readTime: '4 min read',
    title: 'Why AI and Robotics Are Finally Moving from Pilots to Production Across Industries',
    excerpt: 'For a long time, artificial intelligence at industries were discussed more than they were used. Most companies had at least one pilot running somewhere. A chatbot here, a robot there. These...',
    views: '7 views',
    comments: '0 comments',
    liked: false,
  },
  {
    id: '3',
    slug: 'revolutionizing-warehouses-automation',
    image: '/blog/warehouse.jpg',
    category: 'Automation',
    author: 'Allbotix',
    date: 'Jun 19, 2024',
    readTime: '3 min read',
    title: 'Revolutionizing Warehouses with Cutting-Edge Automation',
    excerpt: "The modern warehouse landscape is evolving rapidly, driven by the need for efficiency and innovation. As businesses strive to meet...",
    views: '15 views',
    comments: '0 comments',
    liked: false,
  },
  {
    id: '4',
    slug: 'humanoid-robots-future-robotics',
    image: '/blog/humanoid.jpg',
    category: 'Humanoid',
    author: 'Allbotix',
    date: 'Apr 1, 2023',
    readTime: '1 min read',
    title: 'Humanoid Robots: The Future of Robotics',
    excerpt: 'Exploring the impact of Humanoid Robots. Humanoid robots are now a reality, and they are making a significant impact. They look and move...',
    views: '22 views',
    comments: '1 comment',
    liked: false,
  },
  {
    id: '5',
    slug: 'robotics-future-of-business',
    image: '/blog/robotics-business.jpg',
    category: 'Business',
    author: 'Allbotix',
    date: 'Apr 13, 2023',
    readTime: '1 min read',
    title: '🤖 Robotics: The Future of Business, Not the End of Jobs 🚀',
    excerpt: '🤖 Robotics: The Future of Business, Not the End of Jobs. At ALLBOTIX, we\'re here to set the record straight: robots...',
    views: '12 views',
    comments: '2 comments',
    liked: false,
  },
  {
    id: '6',
    slug: 'school-robot-virtual-museum-trip',
    image: '/blog/school-robot.jpg',
    category: 'Education',
    author: 'Allbotix',
    date: 'Apr 8, 2021',
    readTime: '1 min read',
    title: 'School robot gives boy virtual experience of museum trip',
    excerpt: 'A six-year-old boy, Rufus, with Downs syndrome, enjoyed a virtual school trip thanks to a classroom robot. Unable to attend due to...',
    views: '15 views',
    comments: '0 comments',
    liked: false,
  },
]

/* ─── Category pill colors ───────────────────────────────────────────────── */
const CAT_COLORS: Record<string, string> = {
  Leadership:  'rgba(176,58,46,0.18)',
  'AI & Robotics': 'rgba(46,100,176,0.18)',
  Automation:  'rgba(46,160,90,0.18)',
  Humanoid:    'rgba(140,46,176,0.18)',
  Business:    'rgba(176,130,46,0.18)',
  Education:   'rgba(46,160,176,0.18)',
}
const CAT_TEXT: Record<string, string> = {
  Leadership:  '#e8392a',
  'AI & Robotics': '#4a8fe8',
  Automation:  '#3cb46a',
  Humanoid:    '#a03ae8',
  Business:    '#e8a83a',
  Education:   '#3ab4e8',
}

/* ─── Sub-components ─────────────────────────────────────────────────────── */
function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill={filled ? 'var(--red-bright)' : 'none'} stroke={filled ? 'var(--red-bright)' : 'rgba(176,58,46,0.5)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  )
}

function EyeIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
    </svg>
  )
}

function CommentIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  )
}

function ArrowIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
    </svg>
  )
}

/* ─── Blog Card ──────────────────────────────────────────────────────────── */
function BlogCard({ post, index, visible }: { post: BlogPost; index: number; visible: boolean }) {
  const [liked, setLiked] = useState(post.liked ?? false)

  return (
    <article
      style={{
        display: 'grid',
        gridTemplateColumns: '240px 1fr',
        gap: '0',
        borderRadius: '12px',
        overflow: 'hidden',
        border: '1px solid rgba(176,58,46,0.12)',
        background: 'var(--bg-card)',
        transition: 'border-color 0.3s, box-shadow 0.3s, opacity 0.6s, transform 0.6s',
        transitionDelay: `${index * 0.07}s`,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(28px)',
        cursor: 'pointer',
      }}
      className="blog-card"
    >
      {/* image */}
      <div style={{ position: 'relative', minHeight: '180px', overflow: 'hidden', flexShrink: 0 }}>
        <Image
          src={post.image}
          alt={post.title}
          fill
          style={{ objectFit: 'cover', transition: 'transform 0.5s ease' }}
          className="blog-card-img"
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right,transparent 60%,rgba(8,8,8,0.4) 100%)' }} />
        {post.category && (
          <div style={{ position: 'absolute', top: '12px', left: '12px', padding: '3px 10px', borderRadius: '100px', background: CAT_COLORS[post.category] ?? 'rgba(176,58,46,0.18)', backdropFilter: 'blur(8px)', border: `1px solid ${CAT_TEXT[post.category] ?? 'var(--red-bright)'}33` }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.48rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: CAT_TEXT[post.category] ?? 'var(--red-bright)' }}>{post.category}</span>
          </div>
        )}
      </div>

      {/* content */}
      <div style={{ padding: '1.25rem 1.4rem', display: 'flex', flexDirection: 'column', gap: '8px', borderLeft: '1px solid rgba(176,58,46,0.08)' }}>
        {/* author row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'rgba(176,58,46,0.15)', border: '1px solid rgba(176,58,46,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.45rem', color: 'var(--red-bright)', fontWeight: 700 }}>AB</span>
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.6rem', color: 'var(--text-muted)', letterSpacing: '0.06em' }}>{post.author}</span>
          <span style={{ color: 'rgba(176,58,46,0.3)', fontSize: '0.5rem' }}>·</span>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.6rem', color: 'var(--text-muted)' }}>{post.date}</span>
          <span style={{ color: 'rgba(176,58,46,0.3)', fontSize: '0.5rem' }}>·</span>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.6rem', color: 'var(--text-muted)' }}>{post.readTime}</span>
        </div>

        {/* title */}
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '0.01em', lineHeight: 1.35, margin: 0 }}>
          {post.title}
        </h3>

        {/* excerpt */}
        <p style={{ fontFamily: 'var(--font-light)', fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.75, margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {post.excerpt}
        </p>

        {/* footer */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '8px', borderTop: '1px solid rgba(176,58,46,0.07)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontFamily: 'var(--font-display)', fontSize: '0.58rem', color: 'var(--text-muted)' }}>
              <EyeIcon />{post.views}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontFamily: 'var(--font-display)', fontSize: '0.58rem', color: 'var(--text-muted)' }}>
              <CommentIcon />{post.comments}
            </span>
          </div>
          <button
            onClick={e => { e.stopPropagation(); setLiked(l => !l) }}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center', transition: 'transform 0.2s' }}
            className="like-btn"
            aria-label="Like"
          >
            <HeartIcon filled={liked} />
          </button>
        </div>
      </div>
    </article>
  )
}

/* ─── Main Page Component ────────────────────────────────────────────────── */
export default function BlogSection() {
  const [visible, setVisible]   = useState(false)
  const [showAll, setShowAll]   = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)
  const visiblePosts = showAll ? POSTS : POSTS.slice(0, 6)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true) }, { threshold: 0.05 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <>
      <style>{`
        @keyframes fadeUp   { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
        @keyframes lineGrow { from{width:0;opacity:0} to{width:56px;opacity:1} }
        @keyframes scanHero { 0%{top:-4%;opacity:0.5} 100%{top:108%;opacity:0} }
        @keyframes pulse    { 0%,100%{opacity:0.4} 50%{opacity:1} }

        .blog-card:hover {
          border-color: rgba(176,58,46,0.38) !important;
          box-shadow: 0 8px 40px rgba(0,0,0,0.45), 0 0 24px rgba(176,58,46,0.1);
        }
        .blog-card:hover .blog-card-img { transform: scale(1.06); }
        .like-btn:hover { transform: scale(1.25); }

        .write-card {
          border-radius: 12px;
          border: 1px solid rgba(176,58,46,0.18);
          background: rgba(176,58,46,0.04);
          padding: 2.5rem 3rem;
          display: flex; align-items: center; justify-content: space-between;
          gap: 2rem; flex-wrap: wrap;
          transition: border-color 0.3s;
        }
        .write-card:hover { border-color: rgba(176,58,46,0.4); }

        .view-more-btn {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 11px 26px; border-radius: 8px;
          background: var(--red-bright);
          color: #fff; font-family: var(--font-display);
          font-size: 0.65rem; letter-spacing: 0.14em; text-transform: uppercase;
          border: none; cursor: pointer; transition: all 0.25s; text-decoration: none;
        }
        .view-more-btn:hover { background: #c0392b; box-shadow: 0 0 24px rgba(176,58,46,0.45); transform: translateY(-1px); }

        @media(max-width:640px) {
          .blog-card { grid-template-columns: 1fr !important; }
          .blog-hero-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <main style={{ background: 'var(--bg-900)', minHeight: '100vh', paddingBottom: '6rem', marginTop: '40px' }}>

        {/* ── Page Header ── */}
        <section style={{ paddingBlock: '4rem 3rem', borderBottom: '1px solid rgba(176,58,46,0.1)' }}>
          <div className="container-allbotix">

            <div style={{ marginBottom: '2.5rem', animation: 'fadeUp 0.6s ease 0.05s both' }}>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: '0.52rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--red-bright)', marginBottom: '10px' }}>OUR BLOG & NEWS</p>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem,5vw,3.6rem)', fontWeight: 900, color: 'var(--text-primary)', lineHeight: 1.1, letterSpacing: '-0.01em', margin: 0 }}>
                Stay Updated with the Latest in<br />Robotics &amp; AI!
              </h1>
            </div>

            {/* intro card */}
            <div
              className="blog-hero-grid"
              style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '2.5rem', alignItems: 'center', animation: 'fadeUp 0.6s ease 0.15s both' }}
            >
              {/* image card with red bg */}
              <div style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden', background: 'var(--red-bright)', aspectRatio: '1', minHeight: '220px' }}>
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg,rgba(176,58,46,0.9) 0%,rgba(120,20,10,0.95) 100%)' }} />
                {/* scan line */}
                <div aria-hidden="true" style={{ position: 'absolute', left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.25),transparent)', animation: 'scanHero 3s linear infinite', pointerEvents: 'none', zIndex: 3 }} />
                <div style={{ position: 'relative', zIndex: 2, padding: '2rem', display: 'flex', flexDirection: 'column', gap: '10px', height: '100%', justifyContent: 'center' }}>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    {[...Array(3)].map((_, i) => (
                      <span key={i} style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'rgba(255,255,255,0.5)', animation: `pulse 2s ease-in-out ${i * 0.4}s infinite` }} />
                    ))}
                  </div>
                  <p style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.4rem,3vw,2rem)', fontWeight: 900, color: '#fff', lineHeight: 1.15, letterSpacing: '-0.01em' }}>Blogs<br />&amp; news</p>
                  <div style={{ width: '32px', height: '2px', background: 'rgba(255,255,255,0.4)' }} />
                  <p style={{ fontFamily: 'var(--font-display)', fontSize: '0.7rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)' }}>ALLBOTIX</p>
                </div>
              </div>

              {/* description */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <p style={{ fontFamily: 'var(--font-light)', fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.9, maxWidth: '580px' }}>
                  Welcome to the Allbotix Blog &amp; News section, where we bring you insights, trends, and updates on the world of robotics, artificial intelligence, and automation. Stay ahead with expert opinions, industry breakthroughs, and success stories from businesses integrating AI-powered robots into their operations.
                </p>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  {['Robotics', 'AI Trends', 'Automation', 'Industry News'].map(tag => (
                    <span key={tag} style={{ padding: '4px 12px', borderRadius: '100px', border: '1px solid rgba(176,58,46,0.2)', background: 'rgba(176,58,46,0.05)', fontFamily: 'var(--font-display)', fontSize: '0.58rem', color: 'var(--text-muted)', letterSpacing: '0.08em' }}>{tag}</span>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ── Blog List ── */}
        <section ref={sectionRef} style={{ paddingBlock: '4rem' }}>
          <div className="container-allbotix">

            {/* section header */}
            <div style={{ marginBottom: '3rem', opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(20px)', transition: 'opacity 0.6s ease, transform 0.6s ease' }}>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: '0.52rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--red-bright)', marginBottom: '10px' }}>LATEST BLOGS &amp; ARTICLES</p>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem,4vw,3rem)', fontWeight: 900, color: 'var(--text-primary)', lineHeight: 1.1, letterSpacing: '-0.01em', margin: '0 0 14px' }}>
                Discover Trends, Tips &amp; Tech in Our Blog
              </h2>
              <div style={{ width: '56px', height: '2px', background: 'linear-gradient(90deg,var(--red-bright),transparent)', animation: visible ? 'lineGrow 0.6s ease 0.3s both' : 'none' }} />
            </div>

            {/* cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {visiblePosts.map((post, i) => (
                <Link key={post.id} href={`/blog/${post.slug}`} style={{ textDecoration: 'none' }}>
                  <BlogCard post={post} index={i} visible={visible} />
                </Link>
              ))}
            </div>

            {/* View More */}
            {!showAll && POSTS.length > 6 && (
              <div style={{ textAlign: 'center', marginTop: '3rem', opacity: visible ? 1 : 0, transition: 'opacity 0.6s ease 0.5s' }}>
                <button className="view-more-btn" onClick={() => setShowAll(true)}>
                  View More Articles <ArrowIcon />
                </button>
              </div>
            )}

            {/* load more if showing all — link to next page */}
            {showAll && (
              <div style={{ textAlign: 'center', marginTop: '3rem' }}>
                <Link href="/blog/archive" className="view-more-btn">
                  View More Articles <ArrowIcon />
                </Link>
              </div>
            )}

          </div>
        </section>

        {/* ── Write for Us ── */}
        <section style={{ paddingBlock: '0 4rem' }}>
          <div className="container-allbotix">
            <div className="write-card">
              <div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem,3vw,2.2rem)', fontWeight: 900, color: 'var(--text-primary)', margin: '0 0 12px', letterSpacing: '-0.01em' }}>
                  Write for Us!
                </h2>
              </div>
              <div style={{ flex: 1, maxWidth: '520px' }}>
                <p style={{ fontFamily: 'var(--font-light)', fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.85, marginBottom: '16px' }}>
                  Are you a robotics enthusiast, AI expert, or industry leader? We welcome guest contributions! Share your insights with our growing audience.
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--red-bright)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
                  </svg>
                  <a href="mailto:contact@allbotix.com" style={{ fontFamily: 'var(--font-display)', fontSize: '0.72rem', color: 'var(--red-bright)', textDecoration: 'none', letterSpacing: '0.06em', transition: 'opacity 0.2s' }}>
                    Submit Your Article: contact@allbotix.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>
    </>
  )
}