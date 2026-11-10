import { act, render, screen, waitFor, within } from '@testing-library/react'
import type { DndContextProps, DragEndEvent } from '@dnd-kit/core'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import App from '@/App'
import { celebrate } from '@/lib/celebrate'
import { STORAGE_KEY } from '@/lib/storage'

vi.mock('@/lib/celebrate', () => ({ celebrate: vi.fn() }))

// jsdom has no real layout, so a pointer drag cannot be simulated.
// Instead we keep the real DndContext and remember its props to fire a drop by hand.
let dnd: DndContextProps | undefined
vi.mock('@dnd-kit/core', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@dnd-kit/core')>()
  const { createElement } = await import('react')
  return {
    ...actual,
    DndContext: (props: DndContextProps) => {
      dnd = props
      return createElement(actual.DndContext, props)
    },
  }
})

function drop(activeId: string, overId: string | null) {
  const event = { active: { id: activeId }, over: overId === null ? null : { id: overId } } as unknown as DragEndEvent
  act(() => dnd?.onDragEnd?.(event))
}

function seed() {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      version: 2,
      tasks: [
        { id: 'a', title: 'A', status: 'todo', createdAt: 3 },
        { id: 'b', title: 'B', status: 'todo', createdAt: 2 },
        { id: 'd', title: 'D', status: 'done', createdAt: 1 },
      ],
    }),
  )
}

function titlesIn(column: string) {
  return within(screen.getByRole('list', { name: column }))
    .queryAllByRole('listitem')
    .map((li) => li.textContent)
}

describe('Board', () => {
  it('shows three columns in order, each with a counter', () => {
    seed()
    render(<App />)
    const headings = screen.getAllByRole('heading', { level: 2 })
    expect(headings.map((h) => h.textContent)).toEqual(['Offen2', 'In Arbeit0', 'Erledigt1'])
    expect(titlesIn('Offen')).toEqual(['A', 'B'])
    expect(titlesIn('In Arbeit')).toEqual([])
    expect(titlesIn('Erledigt')).toEqual(['D'])
  })

  it('shows a drop area in an empty column', () => {
    seed()
    render(<App />)
    const doing = screen.getByRole('region', { name: /In Arbeit/ })
    expect(within(doing).getByText('Hierher ziehen')).toBeInTheDocument()
    const open = screen.getByRole('region', { name: /Offen/ })
    expect(within(open).queryByText('Hierher ziehen')).not.toBeInTheDocument()
  })

  it('puts a new task at the top of «Offen»', async () => {
    const user = userEvent.setup()
    seed()
    render(<App />)
    await user.type(screen.getByRole('textbox', { name: 'Neue Aufgabe' }), 'Neu{Enter}')
    expect(titlesIn('Offen')).toEqual(['Neu', 'A', 'B'])
  })

  it('checking moves a card to «Erledigt», unchecking moves it back to «Offen»', async () => {
    const user = userEvent.setup()
    seed()
    render(<App />)
    await user.click(screen.getByRole('checkbox', { name: '«A» erledigt' }))
    // Cards glide out of the old column, so wait for the exit animation.
    await waitFor(() => expect(titlesIn('Offen')).toEqual(['B']))
    expect(titlesIn('Erledigt')).toContain('A')
    await user.click(within(screen.getByRole('list', { name: 'Erledigt' })).getByRole('checkbox', { name: '«A» erledigt' }))
    await waitFor(() => expect(titlesIn('Erledigt')).toEqual(['D']))
    expect(titlesIn('Offen')).toContain('A')
  })
})

describe('Board drag and drop', () => {
  it('makes every card draggable', () => {
    seed()
    render(<App />)
    for (const item of screen.getAllByRole('listitem')) {
      expect(item).toHaveAttribute('aria-roledescription', 'ziehbare Karte')
    }
  })

  it('dropping a card on another column moves it there and saves it', async () => {
    seed()
    render(<App />)
    drop('a', 'doing')
    await waitFor(() => expect(titlesIn('Offen')).toEqual(['B']))
    expect(titlesIn('In Arbeit')).toEqual(['A'])
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '')
    expect(saved.tasks.find((t: { id: string }) => t.id === 'a').status).toBe('doing')
  })

  it('dropping a card on another card reorders the column', () => {
    seed()
    render(<App />)
    drop('b', 'a')
    expect(titlesIn('Offen')).toEqual(['B', 'A'])
  })

  it('dropping outside any column changes nothing', () => {
    seed()
    render(<App />)
    drop('a', null)
    expect(titlesIn('Offen')).toEqual(['A', 'B'])
  })
})

describe('Board accessibility and confetti', () => {
  beforeEach(() => {
    vi.mocked(celebrate).mockClear()
  })

  it('passes German screen reader announcements to the drag context', () => {
    seed()
    render(<App />)
    const announcements = dnd?.accessibility?.announcements
    expect(announcements?.onDragStart({ active: { id: 'a' } } as never)).toContain('Aufgabe «A» aufgenommen.')
    expect(dnd?.accessibility?.screenReaderInstructions?.draggable).toContain('Leertaste')
  })

  it('celebrates when a card lands in «Erledigt» from another column', () => {
    seed()
    render(<App />)
    drop('a', 'done')
    expect(celebrate).toHaveBeenCalledTimes(1)
  })

  it('does not celebrate when sorting inside «Erledigt» or moving elsewhere', () => {
    seed()
    render(<App />)
    drop('d', 'done')
    drop('b', 'doing')
    expect(celebrate).not.toHaveBeenCalled()
  })
})
