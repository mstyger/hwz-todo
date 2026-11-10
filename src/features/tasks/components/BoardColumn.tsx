import { AnimatePresence } from 'motion/react'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Badge } from '@/components/ui/badge'
import { TaskCard } from '@/features/tasks/components/TaskCard'
import { cn } from '@/lib/utils'
import type { Status, Task } from '@/features/tasks/model'

type BoardColumnProps = {
  status: Status
  label: string
  tasks: Task[]
  /** True while a card is dragged over this column or one of its cards. */
  highlighted: boolean
  onToggle: (id: string) => void
  onRemove: (id: string) => () => void
}

export function BoardColumn({ status, label, tasks, highlighted, onToggle, onRemove }: BoardColumnProps) {
  const headingId = `column-${status}`
  const { setNodeRef, isOver } = useDroppable({ id: status })

  return (
    <section
      ref={setNodeRef}
      aria-labelledby={headingId}
      className={cn(
        'glass flex min-h-64 w-[85vw] shrink-0 snap-center flex-col gap-3 rounded-2xl border p-3 transition-look md:w-auto',
        (isOver || highlighted) && 'glow scale-[1.01]',
      )}
    >
      <h2 id={headingId} className="flex items-center justify-between gap-2 px-1 font-heading text-lg">
        {label}
        <Badge variant="secondary" className="font-mono">
          {tasks.length}
        </Badge>
      </h2>
      <SortableContext id={status} items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
        <ul aria-label={label} className="flex flex-col gap-3">
          <AnimatePresence initial={false} mode="popLayout">
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} onToggle={onToggle} onRemove={onRemove} />
            ))}
          </AnimatePresence>
        </ul>
      </SortableContext>
      {tasks.length === 0 && (
        <div className="rounded-xl border-2 border-dashed border-ring/60 p-6 text-center text-muted-foreground">
          Hierher ziehen
        </div>
      )}
    </section>
  )
}
