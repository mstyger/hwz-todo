import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { useTasks } from '@/features/tasks/useTasks'
import { loadState } from '@/lib/storage'

describe('useTasks', () => {
  it('adds, toggles and keeps tasks after a reload', () => {
    const { result, unmount } = renderHook(() => useTasks())
    act(() => result.current.add('Eins'))
    act(() => result.current.add('Zwei'))
    act(() => result.current.add('Drei'))
    const id = result.current.tasks[1].id
    act(() => result.current.toggle(id))
    unmount()

    const reloaded = renderHook(() => useTasks())
    expect(reloaded.result.current.tasks.map((t) => [t.title, t.status])).toEqual([
      ['Drei', 'todo'],
      ['Zwei', 'done'],
      ['Eins', 'todo'],
    ])
    expect(loadState().tasks).toHaveLength(3)
  })

  it('removes a task and restores it at the old position', () => {
    const { result } = renderHook(() => useTasks())
    act(() => result.current.add('C'))
    act(() => result.current.add('B'))
    act(() => result.current.add('A'))
    let restore = () => {}
    act(() => {
      restore = result.current.remove(result.current.tasks[1].id)
    })
    expect(result.current.tasks.map((t) => t.title)).toEqual(['A', 'C'])
    act(() => restore())
    expect(result.current.tasks.map((t) => t.title)).toEqual(['A', 'B', 'C'])
    expect(loadState().tasks.map((t) => t.title)).toEqual(['A', 'B', 'C'])
  })
})

describe('useTasks.move', () => {
  it('moves a task to another column and keeps it after a reload', () => {
    const { result, unmount } = renderHook(() => useTasks())
    act(() => result.current.add('B'))
    act(() => result.current.add('A'))
    const id = result.current.tasks[1].id
    act(() => result.current.move(id, 'doing', 0))
    unmount()

    const reloaded = renderHook(() => useTasks())
    expect(reloaded.result.current.tasks.find((t) => t.title === 'B')?.status).toBe('doing')
    expect(loadState().tasks.find((t) => t.title === 'B')?.status).toBe('doing')
  })
})
