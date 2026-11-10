import { describe, expect, it } from 'vitest'
import { CURRENT_VERSION, loadState, saveState, STORAGE_KEY } from '@/lib/storage'

const task = { id: '1', title: 'Test', done: true, createdAt: 1 }

describe('loadState', () => {
  it('returns an empty list when nothing is stored', () => {
    expect(loadState()).toEqual({ version: CURRENT_VERSION, tasks: [] })
  })

  it('returns an empty list for broken JSON', () => {
    localStorage.setItem(STORAGE_KEY, '{kaputt')
    expect(loadState()).toEqual({ version: CURRENT_VERSION, tasks: [] })
  })

  it('returns an empty list for the wrong shape', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, tasks: 'nope' }))
    expect(loadState().tasks).toEqual([])
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, tasks: [{ id: 1 }] }))
    expect(loadState().tasks).toEqual([])
  })
})

describe('saveState', () => {
  it('saves under hwz-todo and loads the same state again', () => {
    saveState({ version: CURRENT_VERSION, tasks: [task] })
    expect(STORAGE_KEY).toBe('hwz-todo')
    expect(JSON.parse(localStorage.getItem('hwz-todo') ?? '')).toEqual({ version: 1, tasks: [task] })
    expect(loadState()).toEqual({ version: 1, tasks: [task] })
  })
})
