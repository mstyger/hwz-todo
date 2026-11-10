import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import App from '@/App'
import { TaskCard } from '@/features/tasks/components/TaskCard'
import { celebrate } from '@/lib/celebrate'
import { STORAGE_KEY } from '@/lib/storage'

vi.mock('@/lib/celebrate', () => ({ celebrate: vi.fn() }))

function seed() {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      version: 1,
      tasks: [
        { id: 'a', title: 'Einkaufen', done: false, createdAt: 2 },
        { id: 'b', title: 'Wäsche waschen', done: true, createdAt: 1 },
      ],
    }),
  )
}

describe('Stored tasks', () => {
  it('shows two stored tasks after rendering, one of them done', () => {
    seed()
    render(<App />)
    const open = within(screen.getByRole('list', { name: 'Offen' })).getAllByRole('listitem')
    const done = within(screen.getByRole('list', { name: 'Erledigt' })).getAllByRole('listitem')
    expect(open).toHaveLength(1)
    expect(open[0]).toHaveTextContent('Einkaufen')
    expect(done).toHaveLength(1)
    expect(done[0]).toHaveTextContent('Wäsche waschen')
    expect(screen.getByRole('checkbox', { name: '«Einkaufen» erledigt' })).not.toBeChecked()
    expect(screen.getByRole('checkbox', { name: '«Wäsche waschen» erledigt' })).toBeChecked()
  })
})

describe('TaskCard', () => {
  it('lets a long title wrap inside the card', () => {
    const title = 'x'.repeat(200)
    render(
      <ul>
        <TaskCard task={{ id: '1', title, status: 'todo', createdAt: 0 }} onToggle={() => {}} onRemove={() => () => {}} />
      </ul>,
    )
    const text = screen.getByText(title)
    expect(text).toHaveClass('break-words')
    expect(screen.getByRole('listitem')).toHaveClass('min-w-0')
  })
})

describe('TaskCard actions', () => {
  beforeEach(() => {
    vi.mocked(celebrate).mockClear()
  })

  it('checking sets done and celebrates, checking again reopens without confetti', async () => {
    const user = userEvent.setup()
    seed()
    render(<App />)
    // The card glides into another column, so wait until only the new card is left.
    const findBox = () =>
      waitFor(() => {
        const boxes = screen.getAllByRole('checkbox', { name: '«Einkaufen» erledigt' })
        expect(boxes).toHaveLength(1)
        return boxes[0]
      })
    const box = await findBox()
    await user.click(box)
    expect(celebrate).toHaveBeenCalledTimes(1)
    expect(celebrate).toHaveBeenCalledWith(box)
    const checked = await findBox()
    expect(checked).toBeChecked()
    await user.click(checked)
    expect(await findBox()).not.toBeChecked()
    expect(celebrate).toHaveBeenCalledTimes(1)
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '').tasks[0].status).toBe('todo')
  })

  it('deleting B and clicking «Rückgängig» restores B between A and C', async () => {
    const user = userEvent.setup()
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        version: 1,
        tasks: ['A', 'B', 'C'].map((title, i) => ({ id: title, title, done: false, createdAt: i })),
      }),
    )
    render(<App />)
    await user.click(screen.getByRole('button', { name: '«B» löschen' }))
    expect(await screen.findByText('Aufgabe gelöscht')).toBeInTheDocument()
    await waitFor(() => expect(screen.queryByRole('checkbox', { name: '«B» erledigt' })).not.toBeInTheDocument())
    // fireEvent: jsdom has no setPointerCapture, which the toast uses on pointerdown.
    fireEvent.click(screen.getByRole('button', { name: 'Rückgängig' }))
    await waitFor(() =>
      expect(screen.getAllByRole('checkbox').map((c) => c.getAttribute('aria-label'))).toEqual([
        '«A» erledigt',
        '«B» erledigt',
        '«C» erledigt',
      ]),
    )
  })
})
