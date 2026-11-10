import { isTask, type Task } from '@/features/tasks/model'

export const STORAGE_KEY = 'hwz-todo'
export const CURRENT_VERSION = 1

export type State = {
  version: number
  tasks: Task[]
}

function emptyState(): State {
  return { version: CURRENT_VERSION, tasks: [] }
}

export function loadState(): State {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return emptyState()
    const parsed: unknown = JSON.parse(raw)
    if (typeof parsed !== 'object' || parsed === null) return emptyState()
    const { tasks } = parsed as { tasks?: unknown }
    if (!Array.isArray(tasks) || !tasks.every(isTask)) return emptyState()
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
