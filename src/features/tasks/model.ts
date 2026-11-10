export const MAX_TITLE_LENGTH = 200

export type Task = {
  id: string // crypto.randomUUID()
  title: string // trimmed, 1 to 200 characters
  done: boolean
  createdAt: number // Date.now()
}

export function isTask(value: unknown): value is Task {
  if (typeof value !== 'object' || value === null) return false
  const t = value as Record<string, unknown>
  return (
    typeof t.id === 'string' &&
    typeof t.title === 'string' &&
    typeof t.done === 'boolean' &&
    typeof t.createdAt === 'number'
  )
}

export function addTask(tasks: Task[], rawTitle: string): Task[] {
  const title = rawTitle.trim().slice(0, MAX_TITLE_LENGTH)
  if (!title) return tasks
  const task: Task = { id: crypto.randomUUID(), title, done: false, createdAt: Date.now() }
  return [task, ...tasks]
}

export function toggleTask(tasks: Task[], id: string): Task[] {
  return tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
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
  return tasks.filter((t) => t.done).length
}
