'use client'

/**
 * RobotMorph.tsx
 *
 * A fixed canvas overlay that:
 *  - Reads scroll progress between #home and #about sections
 *  - As user scrolls DOWN:  hero robot parts explode outward, fall, then reassemble
 *    into the tech-section's flat panel illustration
 *  - As user scrolls UP:    reverses — panel breaks apart and reconstructs the 3D robot
 *
 * Usage: place <RobotMorph /> once anywhere in your page tree (e.g. in page.tsx).
 * It manages its own fixed positioning and visibility.
 */

import { useEffect, useRef } from 'react'

/* ─── Robot body parts — each has a "home" position (hero) and "target" position (tech panel) ─── */
interface Part {
  id: string
  // SVG path/shape data at hero position
  heroX: number; heroY: number; heroW: number; heroH: number; heroRx: number
  heroColor: string; heroStroke: string
  // Where it lands in the "tech panel" illustration
  techX: number; techY: number; techW: number; techH: number; techRx: number
  techColor: string; techStroke: string
  // Explosion vector (how far it flies before landing)
  explodeVX: number; explodeVY: number; explodeRot: number
  // draw type
  shape: 'rect' | 'circle'
  heroR?: number; techR?: number
}

const PARTS: Part[] = [
  // HEAD
  { id:'head',     shape:'rect',   heroX:60,  heroY:20,  heroW:80, heroH:70, heroRx:12, heroColor:'#1a1a1a', heroStroke:'#b03a2e',
    techX:30,  techY:60,  techW:100,techH:80, techRx:8,  techColor:'#111',   techStroke:'#b03a2e',
    explodeVX:-60, explodeVY:-120, explodeRot:-40 },
  // EYE L
  { id:'eyeL',     shape:'rect',   heroX:74,  heroY:37,  heroW:20, heroH:13, heroRx:3,  heroColor:'#b03a2e', heroStroke:'#ff6666',
    techX:45,  techY:88,  techW:26, techH:14, techRx:3,  techColor:'#b03a2e',techStroke:'#ff6666',
    explodeVX:-100,explodeVY:-80,  explodeRot:-60 },
  // EYE R
  { id:'eyeR',     shape:'rect',   heroX:106, heroY:37,  heroW:20, heroH:13, heroRx:3,  heroColor:'#b03a2e', heroStroke:'#ff6666',
    techX:80,  techY:88,  techW:26, techH:14, techRx:3,  techColor:'#b03a2e',techStroke:'#ff6666',
    explodeVX:100, explodeVY:-80,  explodeRot:60 },
  // BODY
  { id:'body',     shape:'rect',   heroX:47,  heroY:108, heroW:106,heroH:100,heroRx:10, heroColor:'#111111', heroStroke:'#b03a2e',
    techX:20,  techY:160, techW:160,techH:100,techRx:8,  techColor:'#111',   techStroke:'#b03a2e',
    explodeVX:0,   explodeVY:80,   explodeRot:0 },
  // CHEST PANEL
  { id:'chest',    shape:'rect',   heroX:64,  heroY:120, heroW:72, heroH:54, heroRx:6,  heroColor:'#1a1a1a', heroStroke:'#b03a2e',
    techX:40,  techY:175, techW:120,techH:60, techRx:5,  techColor:'#1a1a1a',techStroke:'#b03a2e',
    explodeVX:40,  explodeVY:60,   explodeRot:10 },
  // LIGHT L
  { id:'lightL',   shape:'circle', heroX:82,  heroY:138, heroW:0,  heroH:0,  heroRx:0,  heroColor:'#b03a2e', heroStroke:'none', heroR:8,
    techX:70,  techY:205, techW:0,  techH:0,  techRx:0,  techColor:'#b03a2e',techStroke:'none', techR:9,
    explodeVX:-80, explodeVY:100,  explodeRot:0 },
  // LIGHT R
  { id:'lightR',   shape:'circle', heroX:118, heroY:138, heroW:0,  heroH:0,  heroRx:0,  heroColor:'#b03a2e', heroStroke:'none', heroR:8,
    techX:130, techY:205, techW:0,  techH:0,  techRx:0,  techColor:'#b03a2e',techStroke:'none', techR:9,
    explodeVX:80,  explodeVY:100,  explodeRot:0 },
  // ARM L
  { id:'armL',     shape:'rect',   heroX:20,  heroY:112, heroW:22, heroH:80, heroRx:8,  heroColor:'#111111', heroStroke:'#b03a2e',
    techX:-10, techY:160, techW:28, heroH:90, techRx:8,  techColor:'#111',   techStroke:'#b03a2e',
    explodeVX:-120,explodeVY:40,   explodeRot:-50 },
  // ARM R
  { id:'armR',     shape:'rect',   heroX:158, heroY:112, heroW:22, heroH:80, heroRx:8,  heroColor:'#111111', heroStroke:'#b03a2e',
    techX:182, techY:160, techW:28, heroH:90, techRx:8,  techColor:'#111',   techStroke:'#b03a2e',
    explodeVX:120, explodeVY:40,   explodeRot:50 },
  // LEG L
  { id:'legL',     shape:'rect',   heroX:58,  heroY:218, heroW:34, heroH:66, heroRx:8,  heroColor:'#111111', heroStroke:'#b03a2e',
    techX:40,  techY:270, techW:44, heroH:70, techRx:8,  techColor:'#111',   techStroke:'#b03a2e',
    explodeVX:-60, explodeVY:140,  explodeRot:-30 },
  // LEG R
  { id:'legR',     shape:'rect',   heroX:108, heroY:218, heroW:34, heroH:66, heroRx:8,  heroColor:'#111111', heroStroke:'#b03a2e',
    techX:116, techY:270, techW:44, heroH:70, techRx:8,  techColor:'#111',   techStroke:'#b03a2e',
    explodeVX:60,  explodeVY:140,  explodeRot:30 },
  // NECK
  { id:'neck',     shape:'rect',   heroX:86,  heroY:90,  heroW:28, heroH:18, heroRx:5,  heroColor:'#141414', heroStroke:'#b03a2e',
    techX:80,  techY:142, techW:40, heroH:20, techRx:5,  techColor:'#141414',techStroke:'#b03a2e',
    explodeVX:20,  explodeVY:-40,  explodeRot:15 },
]

function easeInOut(t: number): number {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
}

function lerp(a: number, b: number, t: number) { return a + (b - a) * t }

export default function RobotMorph() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef    = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    /* ── Resize canvas to viewport ── */
    const resize = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    /* ── Scroll progress 0→1 between hero bottom and tech section top ── */
    const getProgress = (): number => {
      const hero = document.getElementById('home')
      const tech = document.getElementById('about')
      if (!hero || !tech) return -1

      const heroBottom = hero.getBoundingClientRect().bottom   // 0 = hero has scrolled off top
      const techTop    = tech.getBoundingClientRect().top      // 0 = tech section at top of viewport

      // Transition zone: when hero bottom is between +40vh and -40vh
      const zone = window.innerHeight * 0.8
      const raw  = 1 - heroBottom / zone
      return Math.max(0, Math.min(1, raw))
    }

    /* ── Canvas coordinate mapping ──
       Robot SVG viewBox is 200×290.
       We centre the robot in the right half of the screen for hero,
       and in the left half for tech.
    */
    const VIEWBOX_W = 200
    const VIEWBOX_H = 290
    const SCALE     = Math.min(window.innerWidth * 0.26, 340) / VIEWBOX_W

    function heroCenter() {
      return {
        cx: window.innerWidth  * 0.73,
        cy: window.innerHeight * 0.50,
      }
    }
    function techCenter() {
      return {
        cx: window.innerWidth  * 0.27,
        cy: window.innerHeight * 0.50,
      }
    }

    /* ── Draw a rounded rect on canvas ── */
    function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
      const rr = Math.min(r, w / 2, h / 2)
      ctx.beginPath()
      ctx.moveTo(x + rr, y)
      ctx.lineTo(x + w - rr, y)
      ctx.quadraticCurveTo(x + w, y, x + w, y + rr)
      ctx.lineTo(x + w, y + h - rr)
      ctx.quadraticCurveTo(x + w, y + h, x + w - rr, y + h)
      ctx.lineTo(x + rr, y + h)
      ctx.quadraticCurveTo(x, y + h, x, y + h - rr)
      ctx.lineTo(x, y + rr)
      ctx.quadraticCurveTo(x, y, x + rr, y)
      ctx.closePath()
    }

    /* ── Main draw loop ── */
    const draw = () => {
      const p = getProgress()

      // Hide canvas when no transition is happening
      if (p <= 0 || p >= 1) {
        canvas.style.opacity = '0'
        canvas.style.pointerEvents = 'none'
        rafRef.current = requestAnimationFrame(draw)
        return
      }

      canvas.style.opacity = '1'
      canvas.style.pointerEvents = 'none'

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const scale = Math.min(canvas.width * 0.26, 340) / VIEWBOX_W
      const hc = heroCenter()
      const tc = techCenter()
      const ease = easeInOut(p)

      // Background dim overlay
      ctx.fillStyle = `rgba(8,8,8,${ease * 0.55})`
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      PARTS.forEach((part) => {
        // Phase 1 (p 0→0.5): parts fly out from hero position
        // Phase 2 (p 0.5→1): parts fly in to tech position
        let px: number, py: number, pw: number, ph: number, pr: number
        let color: string, stroke: string, alpha: number, rotation: number

        if (p < 0.5) {
          // Exploding outward from hero
          const t = easeInOut(p * 2)  // 0→1 in first half
          const heroAbsX = hc.cx + (part.heroX - VIEWBOX_W / 2) * scale
          const heroAbsY = hc.cy + (part.heroY - VIEWBOX_H / 2) * scale

          px = lerp(heroAbsX, heroAbsX + part.explodeVX * scale * 0.6, t)
          py = lerp(heroAbsY, heroAbsY + part.explodeVY * scale * 0.6, t)
          pw = (part.shape === 'rect' ? part.heroW : 0) * scale
          ph = (part.shape === 'rect' ? part.heroH : 0) * scale
          pr = (part.shape === 'circle' ? (part.heroR ?? 8) : 0) * scale
          color = part.heroColor
          stroke = part.heroStroke
          // Fade out at peak of explosion
          alpha = t < 0.7 ? 1 : lerp(1, 0, (t - 0.7) / 0.3)
          rotation = part.explodeRot * t * (Math.PI / 180)
        } else {
          // Reassembling into tech position
          const t = easeInOut((p - 0.5) * 2)  // 0→1 in second half
          const techAbsX = tc.cx + (part.techX - VIEWBOX_W / 2) * scale
          const techAbsY = tc.cy + (part.techY - VIEWBOX_H / 2) * scale
          const midX = lerp(hc.cx, tc.cx, 0.5) + part.explodeVX * scale * 0.6
          const midY = lerp(hc.cy, tc.cy, 0.5) + part.explodeVY * scale * 0.6

          px = lerp(midX, techAbsX, t)
          py = lerp(midY, techAbsY, t)
          pw = lerp(
            (part.shape === 'rect' ? part.heroW : 0) * scale,
            (part.shape === 'rect' ? part.techW : 0) * scale,
            t
          )
          ph = lerp(
            (part.shape === 'rect' ? part.heroH : 0) * scale,
            (part.shape === 'rect' ? part.techH : 0) * scale,
            t
          )
          pr = lerp(
            (part.shape === 'circle' ? (part.heroR ?? 8) : 0) * scale,
            (part.shape === 'circle' ? (part.techR ?? 9) : 0) * scale,
            t
          )
          color = t > 0.5 ? part.techColor : part.heroColor
          stroke = part.heroStroke
          alpha = t < 0.3 ? lerp(0, 1, t / 0.3) : 1
          rotation = part.explodeRot * (1 - t) * (Math.PI / 180)
        }

        ctx.save()
        ctx.globalAlpha = alpha

        if (part.shape === 'rect') {
          // Rotate around centre of rect
          const cx = px + pw / 2
          const cy = py + ph / 2
          ctx.translate(cx, cy)
          ctx.rotate(rotation)
          ctx.translate(-pw / 2, -ph / 2)

          roundRect(ctx, 0, 0, pw, ph, part.heroRx * scale * 0.5)
          ctx.fillStyle = color
          ctx.fill()
          if (stroke !== 'none') {
            ctx.strokeStyle = stroke
            ctx.lineWidth = 1.2
            ctx.stroke()
          }

          // Glow on stroke
          if (stroke === '#b03a2e') {
            ctx.shadowColor = '#b03a2e'
            ctx.shadowBlur = 8
            ctx.stroke()
          }
        } else {
          // circle
          ctx.translate(px, py)
          ctx.beginPath()
          ctx.arc(0, 0, pr, 0, Math.PI * 2)
          ctx.fillStyle = color
          ctx.fill()
          ctx.shadowColor = '#b03a2e'
          ctx.shadowBlur = 14
          ctx.fill()
        }

        ctx.restore()
      })

      // Particle sparks at peak of explosion (p near 0.5)
      if (p > 0.35 && p < 0.65) {
        const sparkIntensity = 1 - Math.abs(p - 0.5) / 0.15
        const hc2 = heroCenter()
        const tc2 = techCenter()
        const midX = (hc2.cx + tc2.cx) / 2
        const midY = (hc2.cy + tc2.cy) / 2

        for (let i = 0; i < 18; i++) {
          const angle = (i / 18) * Math.PI * 2 + p * 8
          const radius = (60 + Math.sin(p * 20 + i) * 30) * scale / 2
          const sx = midX + Math.cos(angle) * radius
          const sy = midY + Math.sin(angle) * radius
          ctx.save()
          ctx.globalAlpha = sparkIntensity * (0.4 + Math.sin(p * 30 + i) * 0.3)
          ctx.beginPath()
          ctx.arc(sx, sy, (1.5 + Math.sin(i) * 1) * scale / 2, 0, Math.PI * 2)
          ctx.fillStyle = i % 3 === 0 ? '#ff4444' : '#b03a2e'
          ctx.shadowColor = '#ff4444'
          ctx.shadowBlur = 10
          ctx.fill()
          ctx.restore()
        }
      }

      // Progress label
      const label = p < 0.5 ? 'DISASSEMBLING...' : 'REASSEMBLING...'
      ctx.save()
      ctx.globalAlpha = Math.sin(p * Math.PI) * 0.7
      ctx.font = `600 ${Math.round(10 * scale / 2)}px 'Orbitron', monospace`
      ctx.fillStyle = '#b03a2e'
      ctx.textAlign = 'center'
      ctx.letterSpacing = '0.2em'
      ctx.shadowColor = '#b03a2e'
      ctx.shadowBlur = 12
      ctx.fillText(label, canvas.width / 2, canvas.height * 0.88)
      ctx.restore()

      rafRef.current = requestAnimationFrame(draw)
    }

    rafRef.current = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        opacity: 0,
        transition: 'opacity 0.1s',
        pointerEvents: 'none',
      }}
    />
  )
}