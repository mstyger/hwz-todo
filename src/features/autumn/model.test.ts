import { describe, expect, it } from 'vitest'
import { makeLeaves } from '@/features/autumn/model'

describe('makeLeaves', () => {
  it('returns the requested number of leaves', () => {
    expect(makeLeaves(12)).toHaveLength(12)
    expect(makeLeaves(0)).toHaveLength(0)
  })

  it('keeps all values in fixed ranges', () => {
    for (const leaf of makeLeaves(12)) {
      expect(leaf.left).toBeGreaterThanOrEqual(0)
      expect(leaf.left).toBeLessThanOrEqual(100)
      expect(leaf.size).toBeGreaterThanOrEqual(1)
      expect(leaf.size).toBeLessThanOrEqual(2.5)
      expect(leaf.duration).toBeGreaterThanOrEqual(12)
      expect(leaf.duration).toBeLessThanOrEqual(24)
      expect(leaf.delay).toBeGreaterThanOrEqual(-24)
      expect(leaf.delay).toBeLessThanOrEqual(0)
    }
  })

  it('varies size, duration and delay', () => {
    const leaves = makeLeaves(12)
    expect(new Set(leaves.map((l) => l.size)).size).toBeGreaterThan(3)
    expect(new Set(leaves.map((l) => l.duration)).size).toBeGreaterThan(3)
    expect(new Set(leaves.map((l) => l.delay)).size).toBeGreaterThan(3)
  })

  it('uses at least 3 token colour classes', () => {
    const colors = new Set(makeLeaves(12).map((l) => l.color))
    expect(colors.size).toBeGreaterThanOrEqual(3)
    for (const c of colors) expect(c).toMatch(/^bg-(primary|accent|secondary)$/)
  })

  it('is deterministic', () => {
    expect(makeLeaves(12)).toEqual(makeLeaves(12))
  })
})
