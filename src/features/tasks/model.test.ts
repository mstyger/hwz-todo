import { describe, expect, it } from 'vitest'
import { addTask, countDone, removeTask, restoreTask, toggleTask, type Task } from '@/features/tasks/model'

function makeTask(id: string, done = false): Task {
  return { id, title: id, done, createdAt: 0 }
}

describe('addTask', () => {
  it('ignores an empty or whitespace-only title', () => {
    expect(addTask([], '')).toEqual([])
    expect(addTask([], '   ')).toEqual([])
  })

  it('trims the title and creates an open task', () => {
    const [task] = addTask([], '  Milch kaufen  ')
    expect(task.title).toBe('Milch kaufen')
    expect(task.done).toBe(false)
    expect(task.id).toBeTruthy()
  })

  it('cuts the title to 200 characters', () => {
    const [task] = addTask([], 'x'.repeat(250))
    expect(task.title).toHaveLength(200)
  })

  it('puts the new task first', () => {
    const tasks = addTask(addTask([], 'Alt'), 'Neu')
    expect(tasks.map((t) => t.title)).toEqual(['Neu', 'Alt'])
  })
})

describe('toggleTask', () => {
  it('flips done and back', () => {
    const tasks = [makeTask('a')]
    const once = toggleTask(tasks, 'a')
    expect(once[0].done).toBe(true)
    expect(toggleTask(once, 'a')[0].done).toBe(false)
  })
})

describe('removeTask and restoreTask', () => {
  it('removes a task and restores it at its old position', () => {
    const tasks = [makeTask('A'), makeTask('B'), makeTask('C')]
    const removed = removeTask(tasks, 'B')
    expect(removed.map((t) => t.id)).toEqual(['A', 'C'])
    const restored = restoreTask(removed, tasks[1], 1)
    expect(restored.map((t) => t.id)).toEqual(['A', 'B', 'C'])
  })

  it('clamps the restore index to the list length', () => {
    const restored = restoreTask([makeTask('A')], makeTask('B'), 5)
    expect(restored.map((t) => t.id)).toEqual(['A', 'B'])
  })
})

describe('countDone', () => {
  it('counts finished tasks', () => {
    expect(countDone([makeTask('a', true), makeTask('b'), makeTask('c', true)])).toBe(2)
  })
})
