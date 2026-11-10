import { useRef, type KeyboardEvent } from 'react'
import { motion } from 'motion/react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { celebrate } from '@/lib/celebrate'
import { cn } from '@/lib/utils'
import type { Task } from '@/features/tasks/model'

type TaskCardProps = {
  task: Task
  onToggle: (id: string) => void
  /** Removes the task and returns a function that restores it. */
  onRemove: (id: string) => () => void
}

export function TaskCard({ task, onToggle, onRemove }: TaskCardProps) {
  const { id, title } = task
  const done = task.status === 'done'
  const checkboxRef = useRef<HTMLButtonElement>(null)
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
    attributes: { roleDescription: 'ziehbare Karte' },
  })

  function handleCheckedChange() {
    if (!done && checkboxRef.current) celebrate(checkboxRef.current)
    onToggle(id)
  }

  function handleRemove() {
    const restore = onRemove(id)
    toast('Aufgabe gelöscht', { action: { label: 'Rückgängig', onClick: restore }, duration: 5000 })
  }

  // Space on the checkbox or the delete button must not start a drag.
  function handleKeyDown(event: KeyboardEvent<HTMLLIElement>) {
    if (event.target !== event.currentTarget) return
    listeners?.onKeyDown?.(event)
  }

  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      {...attributes}
      {...listeners}
      onKeyDown={handleKeyDown}
      role="listitem"
      aria-label={title}
      className={cn('min-w-0 touch-manipulation rounded-xl', isDragging && 'opacity-50')}
    >
      <motion.div
        layout
        initial={{ opacity: 0, y: -12, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, x: 40, scale: 0.9, transition: { duration: 0.2 } }}
        transition={{ type: 'spring', stiffness: 500, damping: 35 }}
        className="group glass flex min-w-0 cursor-grab items-start gap-3 rounded-xl border p-4 shadow-card transition-look hover:-translate-y-0.5 hover:shadow-pop focus-within:glow active:cursor-grabbing"
      >
        <Checkbox
          ref={checkboxRef}
          checked={done}
          onCheckedChange={handleCheckedChange}
          aria-label={`«${title}» erledigt`}
          className="mt-0.5 size-6 rounded-md transition-look data-[state=checked]:animate-pop data-[state=checked]:bg-accent data-[state=checked]:text-accent-foreground"
        />
        <span
          className={cn(
            'relative min-w-0 flex-1 break-words [overflow-wrap:anywhere] text-base leading-relaxed',
            done && 'text-muted-foreground',
          )}
        >
          {title}
          <motion.span
            aria-hidden
            className="absolute left-0 top-1/2 h-0.5 w-full origin-left bg-current"
            initial={false}
            animate={{ scaleX: done ? 1 : 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          />
        </span>
        <Button
          variant="ghost"
          size="icon"
          aria-label={`«${title}» löschen`}
          onClick={handleRemove}
          className="size-11 shrink-0 opacity-60 transition-look group-hover:opacity-100 focus-visible:opacity-100"
        >
          <Trash2 className="size-4" />
        </Button>
      </motion.div>
    </li>
  )
}
