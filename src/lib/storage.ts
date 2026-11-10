import { isTask, type Task } from '@/features/tasks/model'

export const STORAGE_KEY = 'hwz-todo'
export const CURRENT_VERSION = 2

export type State = {
  version: number
  tasks: Task[]
}

type TaskV1 = {
  id: string
  title: string
  done: boolean
  createdAt: number
}

function emptyState(): State {
  return { version: CURRENT_VERSION, tasks: [] }
}

function isTaskV1(value: unknown): value is TaskV1 {
  if (typeof value !== 'object' || value === null) return false
  const t = value as Record<string, unknown>
  return (
    typeof t.id === 'string' &&
    typeof t.title === 'string' &&
    typeof t.done === 'boolean' &&
    typeof t.createdAt === 'number'
  )
}

/** Version 1 → 2: done true → status done, done false → status todo. */
export function migrateV1toV2(tasks: TaskV1[]): Task[] {
  return tasks.map(({ id, title, done, createdAt }) => ({
    id,
    title,
    status: done ? 'done' : 'todo',
    createdAt,
  }))
}

export function loadState(): State {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return emptyState()
    const parsed: unknown = JSON.parse(raw)
    if (typeof parsed !== 'object' || parsed === null) return emptyState()
    const { version, tasks } = parsed as { version?: unknown; tasks?: unknown }
    if (!Array.isArray(tasks)) return emptyState()
    if (version === 1) {
      if (!tasks.every(isTaskV1)) return emptyState()
      return { version: CURRENT_VERSION, tasks: migrateV1toV2(tasks) }
    }
    if (!tasks.every(isTask)) return emptyState()
    return { version: CURRENT_VERSION, tasks }
  } catch {
    return emptyState()
  }
}

export function saveState(state: State): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // Storage full or blocked: keep working in memory.
  }
}
