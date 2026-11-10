import { describe, expect, it } from 'vitest'
import {
  addTask,
  COLUMN_LABELS,
  countDone,
  dragAnnouncements,
  moveTask,
  removeTask,
  resolveDrop,
  restoreTask,
  shouldCelebrate,
  tasksByStatus,
  toggleTask,
  type Status,
  type Task,
} from '@/features/tasks/model'

function makeTask(id: string, status: Status = 'todo'): Task {
  return { id, title: id, status, createdAt: 0 }
}

describe('addTask', () => {
  it('ignores an empty or whitespace-only title', () => {
    expect(addTask([], '')).toEqual([])
    expect(addTask([], '   ')).toEqual([])
  })

  it('trims the title and creates an open task', () => {
    const [task] = addTask([], '  Milch kaufen  ')
    expect(task.title).toBe('Milch kaufen')
    expect(task.status).toBe('todo')
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
  it('moves an open task to done and back to todo', () => {
    const once = toggleTask([makeTask('a')], 'a')
    expect(once[0].status).toBe('done')
    expect(toggleTask(once, 'a')[0].status).toBe('todo')
  })

  it('moves a task in progress to done', () => {
    expect(toggleTask([makeTask('a', 'doing')], 'a')[0].status).toBe('done')
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
  it('counts tasks with status done', () => {
    expect(countDone([makeTask('a', 'done'), makeTask('b', 'doing'), makeTask('c', 'done')])).toBe(2)
  })
})

describe('tasksByStatus', () => {
  it('groups tasks by column and keeps their order', () => {
    const tasks = [makeTask('A'), makeTask('X', 'doing'), makeTask('B'), makeTask('D', 'done')]
    const columns = tasksByStatus(tasks)
    expect(columns.todo.map((t) => t.id)).toEqual(['A', 'B'])
    expect(columns.doing.map((t) => t.id)).toEqual(['X'])
    expect(columns.done.map((t) => t.id)).toEqual(['D'])
  })
})

describe('moveTask', () => {
  const tasks = [makeTask('A'), makeTask('B'), makeTask('C'), makeTask('X', 'doing')]
  const ids = (list: Task[], status: Status) => tasksByStatus(list)[status].map((t) => t.id)

  it('moves C to the top of its own column', () => {
    expect(ids(moveTask(tasks, 'C', 'todo', 0), 'todo')).toEqual(['C', 'A', 'B'])
  })

  it('moves a task into another column at a position and changes its status', () => {
    const moved = moveTask(tasks, 'B', 'doing', 0)
    expect(ids(moved, 'todo')).toEqual(['A', 'C'])
    expect(ids(moved, 'doing')).toEqual(['B', 'X'])
    expect(moved.find((t) => t.id === 'B')?.status).toBe('doing')
  })

  it('appends to the end, also of an empty column', () => {
    expect(ids(moveTask(tasks, 'A', 'doing', 99), 'doing')).toEqual(['X', 'A'])
    expect(ids(moveTask(tasks, 'A', 'done', 0), 'done')).toEqual(['A'])
  })

  it('returns the same list for an unknown id', () => {
    expect(moveTask(tasks, 'nope', 'done', 0)).toBe(tasks)
  })
})

describe('resolveDrop', () => {
  const tasks = [makeTask('A'), makeTask('B'), makeTask('C'), makeTask('X', 'doing')]

  it('dropping on a column puts the task at its end', () => {
    expect(resolveDrop(tasks, 'A', 'doing')).toEqual({ toStatus: 'doing', toIndex: 1 })
    expect(resolveDrop(tasks, 'A', 'done')).toEqual({ toStatus: 'done', toIndex: 0 })
  })

  it('dropping on a card takes its place', () => {
    expect(resolveDrop(tasks, 'C', 'A')).toEqual({ toStatus: 'todo', toIndex: 0 })
    expect(resolveDrop(tasks, 'A', 'X')).toEqual({ toStatus: 'doing', toIndex: 0 })
  })

  it('dragging A down onto C ends after C, like sorting a list', () => {
    const drop = resolveDrop(tasks, 'A', 'C')
    expect(drop).toEqual({ toStatus: 'todo', toIndex: 2 })
    const moved = moveTask(tasks, 'A', drop!.toStatus, drop!.toIndex)
    expect(tasksByStatus(moved).todo.map((t) => t.id)).toEqual(['B', 'C', 'A'])
  })

  it('returns null without a target or for unknown ids', () => {
    expect(resolveDrop(tasks, 'A', null)).toBeNull()
    expect(resolveDrop(tasks, 'A', 'nope')).toBeNull()
    expect(resolveDrop(tasks, 'nope', 'todo')).toBeNull()
  })
})

describe('COLUMN_LABELS', () => {
  it('names the columns in German', () => {
    expect(COLUMN_LABELS).toEqual({ todo: 'Offen', doing: 'In Arbeit', done: 'Erledigt' })
  })
})

describe('dragAnnouncements', () => {
  const tasks = [makeTask('A'), makeTask('B'), makeTask('X', 'doing')]
  const say = dragAnnouncements(tasks)

  it('announces pick up, hover, drop and cancel in German', () => {
    expect(say.onDragStart({ active: { id: 'A' } })).toBe('Aufgabe «A» aufgenommen. Pfeiltasten bewegen, Leertaste legt ab, Esc bricht ab.')
    expect(say.onDragOver({ active: { id: 'A' }, over: { id: 'X' } })).toBe('Aufgabe «A» ist über «In Arbeit», Position 1.')
    expect(say.onDragOver({ active: { id: 'A' }, over: null })).toBe('Aufgabe «A» ist über keiner Spalte.')
    expect(say.onDragEnd({ active: { id: 'A' }, over: { id: 'doing' } })).toBe('Aufgabe «A» in «In Arbeit» abgelegt.')
    expect(say.onDragEnd({ active: { id: 'A' }, over: null })).toBe('Aufgabe «A» wurde nicht verschoben.')
    expect(say.onDragCancel({ active: { id: 'A' } })).toBe('Ziehen abgebrochen. Aufgabe «A» bleibt in «Offen».')
  })
})

describe('shouldCelebrate', () => {
  const tasks = [makeTask('A'), makeTask('D', 'done')]

  it('is true only when a task lands in done from another column', () => {
    expect(shouldCelebrate(tasks, 'A', 'done')).toBe(true)
    expect(shouldCelebrate(tasks, 'A', 'doing')).toBe(false)
    expect(shouldCelebrate(tasks, 'D', 'done')).toBe(false)
    expect(shouldCelebrate(tasks, 'nope', 'done')).toBe(false)
  })
})
