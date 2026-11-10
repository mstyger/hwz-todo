import confetti from 'canvas-confetti'
import { readConfettiColors } from '@/lib/theme'

export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/** Fires a small confetti burst from the center of the given element. */
export function celebrate(element: Element): void {
  if (prefersReducedMotion()) return
  const rect = element.getBoundingClientRect()
  const origin = {
    x: (rect.left + rect.width / 2) / window.innerWidth,
    y: (rect.top + rect.height / 2) / window.innerHeight,
  }
  void confetti({
    particleCount: 40,
    spread: 60,
    startVelocity: 25,
    scalar: 0.8,
    ticks: 120,
    colors: readConfettiColors(),
    origin,
  })
}
