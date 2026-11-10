export const MAX_TITLE_LENGTH = 200

export const STATUSES = ['todo', 'doing', 'done'] as const
export type Status = (typeof STATUSES)[number]

export type Task = {
  id: string // crypto.randomUUID()
  title: string // trimmed, 1 to 200 characters
  status: Status
  createdAt: number // Date.now()
}

export function isStatus(value: unknown): value is Status {
  return typeof value === 'string' && (STATUSES as readonly string[]).includes(value)
}

export function isTask(value: unknown): value is Task {
  if (typeof value !== 'object' || value === null) return false
  const t = value as Record<string, unknown>
  return (
    typeof t.id === 'string' &&
    typeof t.title === 'string' &&
    isStatus(t.status) &&
    typeof t.createdAt === 'number'
  )
}

export function addTask(tasks: Task[], rawTitle: string): Task[] {
  const title = rawTitle.trim().slice(0, MAX_TITLE_LENGTH)
  if (!title) return tasks
  const task: Task = { id: crypto.randomUUID(), title, status: 'todo', createdAt: Date.now() }
  return [task, ...tasks]
}

/** Checkbox: open or in progress → done, done → open. */
export function toggleTask(tasks: Task[], id: string): Task[] {
  return tasks.map((t) => (t.id === id ? { ...t, status: t.status === 'done' ? 'todo' : 'done' } : t))
}

export function removeTask(tasks: Task[], id: string): Task[] {
  return tasks.filter((t) => t.id !== id)
}

export function restoreTask(tasks: Task[], task: Task, index: number): Task[] {
  if (tasks.some((t) => t.id === task.id)) return tasks
  const at = Math.max(0, Math.min(index, tasks.length))
  return [...tasks.slice(0, at), task, ...tasks.slice(at)]
}

export function countDone(tasks: Task[]): number {
  return tasks.filter((t) => t.status === 'done').length
}

export function tasksByStatus(tasks: Task[]): Record<Status, Task[]> {
  const columns: Record<Status, Task[]> = { todo: [], doing: [], done: [] }
  for (const task of tasks) columns[task.status].push(task)
  return columns
}

/** Moves a task into a column at a position within that column (0 = top). */
export function moveTask(tasks: Task[], id: string, toStatus: Status, toIndex: number): Task[] {
  const task = tasks.find((t) => t.id === id)
  if (!task) return tasks
  const rest = tasks.filter((t) => t.id !== id)
  const column = rest.filter((t) => t.status === toStatus)
  const moved: Task = { ...task, status: toStatus }

  let at: number
  if (toIndex < column.length) {
    at = rest.indexOf(column[Math.max(0, toIndex)])
  } else if (column.length > 0) {
    at = rest.indexOf(column[column.length - 1]) + 1
  } else {
    at = rest.length
  }
  return [...rest.slice(0, at), moved, ...rest.slice(at)]
}

export type Drop = { toStatus: Status; toIndex: number }

/**
 * Works out where a dragged task lands.
 * `overId` is either a column (status) or the id of the card under the pointer.
 */
export function resolveDrop(tasks: Task[], activeId: string, overId: string | null): Drop | null {
  if (overId === null || !tasks.some((t) => t.id === activeId)) return null
  if (isStatus(overId)) {
    const column = tasks.filter((t) => t.status === overId && t.id !== activeId)
    return { toStatus: overId, toIndex: column.length }
  }
  const over = tasks.find((t) => t.id === overId)
  if (!over) return null
  const column = tasks.filter((t) => t.status === over.status)
  return { toStatus: over.status, toIndex: column.indexOf(over) }
}

export const COLUMN_LABELS: Record<Status, string> = {
  todo: 'Offen',
  doing: 'In Arbeit',
  done: 'Erledigt',
}

type DragRef = { id: string | number }
type DragEventLike = { active: DragRef; over?: DragRef | null }

/** True when a task lands in «Erledigt» coming from another column. */
export function shouldCelebrate(tasks: Task[], id: string, toStatus: Status): boolean {
  const task = tasks.find((t) => t.id === id)
  return task !== undefined && task.status !== 'done' && toStatus === 'done'
}

/** German screen reader announcements for dragging cards. */
export function dragAnnouncements(tasks: Task[]) {
  const title = (id: string | number) => tasks.find((t) => t.id === String(id))?.title ?? String(id)
  const target = ({ active, over }: DragEventLike) =>
    over ? resolveDrop(tasks, String(active.id), String(over.id)) : null

  return {
    onDragStart: ({ active }: DragEventLike) =>
      `Aufgabe «${title(active.id)}» aufgenommen. Pfeiltasten bewegen, Leertaste legt ab, Esc bricht ab.`,
    onDragOver: (event: DragEventLike) => {
      const drop = target(event)
      if (!drop) return `Aufgabe «${title(event.active.id)}» ist über keiner Spalte.`
      return `Aufgabe «${title(event.active.id)}» ist über «${COLUMN_LABELS[drop.toStatus]}», Position ${drop.toIndex + 1}.`
    },
    onDragEnd: (event: DragEventLike) => {
      const drop = target(event)
      if (!drop) return `Aufgabe «${title(event.active.id)}» wurde nicht verschoben.`
      return `Aufgabe «${title(event.active.id)}» in «${COLUMN_LABELS[drop.toStatus]}» abgelegt.`
    },
    onDragCancel: ({ active }: DragEventLike) => {
      const status = tasks.find((t) => t.id === String(active.id))?.status ?? 'todo'
      return `Ziehen abgebrochen. Aufgabe «${title(active.id)}» bleibt in «${COLUMN_LABELS[status]}».`
    },
  }
}
