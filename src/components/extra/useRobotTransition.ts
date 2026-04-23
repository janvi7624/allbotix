'use client'

/**
 * useRobotTransition
 *
 * Returns a 0→1 progress value representing how far the scroll
 * is between the hero section and the tech section.
 *
 *  0  = hero robot fully visible, tech robot fully hidden
 *  1  = hero robot fully hidden, tech robot fully visible
 *
 * Components use this to fade out their own robot illustration
 * while RobotMorph.tsx handles the animated canvas overlay.
 */

import { useEffect, useState } from 'react'

export function useRobotTransition() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const update = () => {
      const hero = document.getElementById('home')
      const tech = document.getElementById('about')
      if (!hero || !tech) return

      const heroBottom = hero.getBoundingClientRect().bottom
      const zone = window.innerHeight * 0.8
      const raw  = 1 - heroBottom / zone
      setProgress(Math.max(0, Math.min(1, raw)))
    }

    window.addEventListener('scroll', update, { passive: true })
    update()
    return () => window.removeEventListener('scroll', update)
  }, [])

  return progress
}