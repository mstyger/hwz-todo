import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from '@/App'
import { ProgressRing } from '@/components/ProgressRing'
import { STORAGE_KEY } from '@/lib/storage'

describe('ProgressRing', () => {
  it('shows done/total with a screen reader label', () => {
    render(<ProgressRing done={3} total={5} />)
    const ring = screen.getByRole('img', { name: '3 von 5 erledigt' })
    expect(ring).toHaveTextContent('3/5')
  })

  it('shows 0/0 without tasks', () => {
    render(<ProgressRing done={0} total={0} />)
    expect(screen.getByRole('img', { name: '0 von 0 erledigt' })).toHaveTextContent('0/0')
  })
})

describe('App header and empty state', () => {
  it('shows the ring with stored progress and the date', () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        version: 1,
        tasks: [
          { id: 'a', title: 'A', done: true, createdAt: 2 },
          { id: 'b', title: 'B', done: false, createdAt: 1 },
        ],
      }),
    )
    render(<App />)
    expect(screen.getByRole('img', { name: '1 von 2 erledigt' })).toHaveTextContent('1/2')
    expect(screen.queryByText('Alles erledigt. Zeit für Kaffee.')).not.toBeInTheDocument()
    const today = new Intl.DateTimeFormat('de-CH', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date())
    expect(screen.getByText(today)).toBeInTheDocument()
  })

  it('shows the empty state and 0/0 without tasks', () => {
    render(<App />)
    expect(screen.getByText('Alles erledigt. Zeit für Kaffee.')).toBeInTheDocument()
    expect(screen.getByText('Tippe oben eine neue Aufgabe ein oder drücke N.')).toBeInTheDocument()
    expect(screen.getByRole('img', { name: '0 von 0 erledigt' })).toHaveTextContent('0/0')
  })
})
