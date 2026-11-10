import { useState } from 'react'
import {
  closestCorners,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from '@dnd-kit/core'
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { BoardColumn } from '@/features/tasks/components/BoardColumn'
import {
  COLUMN_LABELS,
  dragAnnouncements,
  resolveDrop,
  shouldCelebrate,
  STATUSES,
  tasksByStatus,
  type Status,
  type Task,
} from '@/features/tasks/model'
import { celebrate } from '@/lib/celebrate'

type BoardProps = {
  tasks: Task[]
  onToggle: (id: string) => void
  onRemove: (id: string) => () => void
  onMove: (id: string, toStatus: Status, toIndex: number) => void
}

export function Board({ tasks, onToggle, onRemove, onMove }: BoardProps) {
  const columns = tasksByStatus(tasks)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [overStatus, setOverStatus] = useState<Status | null>(null)
  const activeTask = tasks.find((t) => t.id === activeId)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  function reset() {
    setActiveId(null)
    setOverStatus(null)
  }

  function handleDragStart(event: DragStartEvent) {
    setActiveId(String(event.active.id))
  }

  function handleDragOver(event: DragOverEvent) {
    const target = event.over ? resolveDrop(tasks, String(event.active.id), String(event.over.id)) : null
    setOverStatus(target?.toStatus ?? null)
  }

  function handleDragEnd(event: DragEndEvent) {
    reset()
    const activeTaskId = String(event.active.id)
    const target = resolveDrop(tasks, activeTaskId, event.over ? String(event.over.id) : null)
    if (!target) return
    if (shouldCelebrate(tasks, activeTaskId, target.toStatus)) {
      const column = document.getElementById('column-done')
      if (column) celebrate(column)
    }
    onMove(activeTaskId, target.toStatus, target.toIndex)
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={reset}
      accessibility={{
        announcements: dragAnnouncements(tasks),
        screenReaderInstructions: {
          draggable:
            'Leertaste drücken, um die Karte aufzunehmen. Mit den Pfeiltasten verschieben, mit Leertaste ablegen, mit Esc abbrechen.',
        },
      }}
    >
      <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 md:mx-0 md:grid md:grid-cols-3 md:overflow-visible">
        {STATUSES.map((status) => (
          <BoardColumn
            key={status}
            status={status}
            label={COLUMN_LABELS[status]}
            tasks={columns[status]}
            highlighted={overStatus === status}
            onToggle={onToggle}
            onRemove={onRemove}
          />
        ))}
      </div>
      <DragOverlay>
        {activeTask && (
          <div className="glass flex min-w-0 items-start gap-3 rounded-xl border p-4 shadow-pop rotate-2">
            <span className="min-w-0 flex-1 break-words [overflow-wrap:anywhere] text-base leading-relaxed">
              {activeTask.title}
            </span>
          </div>
        )}
      </DragOverlay>
    </DndContext>
  )
}
