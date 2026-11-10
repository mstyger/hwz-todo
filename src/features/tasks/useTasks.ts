import { useCallback, useEffect, useState } from 'react'
import {
  addTask,
  countDone,
  moveTask,
  removeTask,
  restoreTask,
  toggleTask,
  type Status,
  type Task,
} from '@/features/tasks/model'
import { CURRENT_VERSION, loadState, saveState } from '@/lib/storage'

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>(() => loadState().tasks)

  useEffect(() => {
    saveState({ version: CURRENT_VERSION, tasks })
  }, [tasks])

  const add = useCallback((title: string) => setTasks((prev) => addTask(prev, title)), [])

  const toggle = useCallback((id: string) => setTasks((prev) => toggleTask(prev, id)), [])

  const remove = useCallback(
    (id: string): (() => void) => {
      const index = tasks.findIndex((t) => t.id === id)
      const task = tasks[index]
      setTasks((prev) => removeTask(prev, id))
      if (!task) return () => {}
      return () => setTasks((prev) => restoreTask(prev, task, index))
    },
    [tasks],
  )

  const move = useCallback(
    (id: string, toStatus: Status, toIndex: number) => setTasks((prev) => moveTask(prev, id, toStatus, toIndex)),
    [],
  )

  return { tasks, done: countDone(tasks), add, toggle, remove, move }
}
