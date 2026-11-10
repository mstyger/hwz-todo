import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { FallingLeaves } from '@/features/autumn/components/FallingLeaves'

describe('FallingLeaves', () => {
  it('renders at least 8 leaves in a hidden, click-through container', () => {
    const { container } = render(<FallingLeaves />)
    const root = container.firstElementChild as HTMLElement
    expect(root).toHaveAttribute('aria-hidden', 'true')
    expect(root).toHaveClass('pointer-events-none')
    expect(root).toHaveClass('overflow-hidden')
    expect(root.querySelectorAll('[data-leaf]').length).toBeGreaterThanOrEqual(8)
  })

  it('has no focusable elements', () => {
    const { container } = render(<FallingLeaves />)
    expect(container.querySelectorAll('a, button, input, [tabindex]')).toHaveLength(0)
  })
})
