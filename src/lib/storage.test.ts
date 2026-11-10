import { describe, expect, it } from 'vitest'
import { CURRENT_VERSION, loadState, migrateV1toV2, saveState, STORAGE_KEY } from '@/lib/storage'

const task = { id: '1', title: 'Test', status: 'doing' as const, createdAt: 1 }

// Real data in the format of version 1 (Bau 1: Liste).
const v1Data = {
  version: 1,
  tasks: [
    { id: 'a', title: 'Einkaufen', done: true, createdAt: 2 },
    { id: 'b', title: 'Wäsche waschen', done: false, createdAt: 1 },
  ],
}

describe('loadState', () => {
  it('returns an empty list when nothing is stored', () => {
    expect(loadState()).toEqual({ version: CURRENT_VERSION, tasks: [] })
  })

  it('returns an empty list for broken JSON', () => {
    localStorage.setItem(STORAGE_KEY, '{kaputt')
    expect(loadState()).toEqual({ version: CURRENT_VERSION, tasks: [] })
  })

  it('returns an empty list for the wrong shape', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 2, tasks: 'nope' }))
    expect(loadState().tasks).toEqual([])
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 2, tasks: [{ id: 1 }] }))
    expect(loadState().tasks).toEqual([])
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 2, tasks: [{ ...task, status: 'later' }] }))
    expect(loadState().tasks).toEqual([])
  })

  it('migrates version 1 data and keeps every task', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(v1Data))
    expect(loadState()).toEqual({
      version: 2,
      tasks: [
        { id: 'a', title: 'Einkaufen', status: 'done', createdAt: 2 },
        { id: 'b', title: 'Wäsche waschen', status: 'todo', createdAt: 1 },
      ],
    })
  })
})

describe('migrateV1toV2', () => {
  it('turns done true into status done and done false into status todo', () => {
    expect(migrateV1toV2(v1Data.tasks)).toEqual([
      { id: 'a', title: 'Einkaufen', status: 'done', createdAt: 2 },
      { id: 'b', title: 'Wäsche waschen', status: 'todo', createdAt: 1 },
    ])
  })
})

describe('saveState', () => {
  it('saves under hwz-todo with version 2 and loads the same state again', () => {
    expect(CURRENT_VERSION).toBe(2)
    saveState({ version: CURRENT_VERSION, tasks: [task] })
    expect(STORAGE_KEY).toBe('hwz-todo')
    expect(JSON.parse(localStorage.getItem('hwz-todo') ?? '')).toEqual({ version: 2, tasks: [task] })
    expect(loadState()).toEqual({ version: 2, tasks: [task] })
  })
})
