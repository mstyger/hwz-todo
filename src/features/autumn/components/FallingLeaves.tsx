import type { CSSProperties } from 'react'
import { makeLeaves } from '@/features/autumn/model'
import { cn } from '@/lib/utils'

const leaves = makeLeaves(12)

export function FallingLeaves() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {leaves.map((leaf) => (
        <span
          key={leaf.id}
          data-leaf
          className={cn(
            'leaf absolute top-0 rounded-tl-full rounded-br-full opacity-40',
            leaf.color,
          )}
          style={
            {
              left: `${leaf.left}%`,
              width: `${leaf.size}rem`,
              height: `${leaf.size}rem`,
              animationDuration: `${leaf.duration}s`,
              animationDelay: `${leaf.delay}s`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  )
}
