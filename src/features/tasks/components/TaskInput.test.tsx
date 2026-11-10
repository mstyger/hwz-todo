import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import App from '@/App'

function titles() {
  return within(screen.getByRole('list', { name: 'Offen' }))
    .queryAllByRole('listitem')
    .map((li) => li.textContent)
}

describe('TaskInput', () => {
  it('adds a task with Enter on top and keeps focus in the empty field', async () => {
    const user = userEvent.setup()
    render(<App />)
    const input = screen.getByRole('textbox', { name: 'Neue Aufgabe' })
    await user.type(input, 'Alt{Enter}')
    await user.type(input, 'Neu')
    await user.click(screen.getByRole('button', { name: 'Aufgabe hinzufügen' }))
    expect(titles()).toEqual(['Neu', 'Alt'])
    expect(input).toHaveValue('')
    await user.click(input)
    expect(input).toHaveFocus()
  })

  it('adds nothing for an empty or blank title and shakes the form', async () => {
    const user = userEvent.setup()
    render(<App />)
    const input = screen.getByRole('textbox', { name: 'Neue Aufgabe' })
    await user.type(input, '   {Enter}')
    expect(titles()).toEqual([])
    expect(input.closest('form')).toHaveClass('animate-shake')
    expect(input).toHaveFocus()
  })

  it('limits the field to 200 characters', () => {
    render(<App />)
    expect(screen.getByRole('textbox', { name: 'Neue Aufgabe' })).toHaveAttribute('maxLength', '200')
  })

  it('focuses the field with N without typing an n', async () => {
    const user = userEvent.setup()
    render(<App />)
    const input = screen.getByRole('textbox', { name: 'Neue Aufgabe' })
    expect(input).not.toHaveFocus()
    await user.keyboard('n')
    expect(input).toHaveFocus()
    expect(input).toHaveValue('')
  })

  it('clears the field and drops focus with Escape', async () => {
    const user = userEvent.setup()
    render(<App />)
    const input = screen.getByRole('textbox', { name: 'Neue Aufgabe' })
    await user.type(input, 'Etwas{Escape}')
    expect(input).toHaveValue('')
    expect(input).not.toHaveFocus()
  })
})
