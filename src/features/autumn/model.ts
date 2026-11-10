export type LeafColor = 'bg-primary' | 'bg-accent' | 'bg-secondary'

export type Leaf = {
  id: number
  left: number // percent of the width, 0 to 100
  size: number // rem, 1 to 2.5
  duration: number // seconds, 12 to 24
  delay: number // seconds, -24 to 0 (negative: already falling at start)
  color: LeafColor
}

const COLORS: LeafColor[] = ['bg-primary', 'bg-accent', 'bg-secondary']

// Deterministic spread (no randomness), so the result is stable and testable.
export function makeLeaves(count: number): Leaf[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: Math.round(((i * 37 + 11) % 97) + 1),
    size: 1 + ((i * 7) % 11) * 0.15,
    duration: 12 + ((i * 5) % 13),
    delay: -((i * 3) % 25),
    color: COLORS[i % COLORS.length],
  }))
}
