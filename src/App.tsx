import { MotionConfig } from 'motion/react'
import { ProgressRing } from '@/components/ProgressRing'
import { Toaster } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { EmptyState } from '@/features/tasks/components/EmptyState'
import { TaskInput } from '@/features/tasks/components/TaskInput'
import { TaskList } from '@/features/tasks/components/TaskList'
import { useTasks } from '@/features/tasks/useTasks'

const dateFormat = new Intl.DateTimeFormat('de-CH', { weekday: 'long', day: 'numeric', month: 'long' })

export default function App() {
  const { tasks, done, add, toggle, remove } = useTasks()

  return (
    <MotionConfig reducedMotion="user">
      <TooltipProvider>
        <main className="mx-auto flex min-h-dvh w-full max-w-3xl flex-col gap-8 px-4 py-10 sm:px-6 sm:py-16">
          <header className="flex items-center justify-between gap-6">
            <div className="min-w-0">
              <h1 className="text-gradient font-heading text-4xl font-bold tracking-tight sm:text-6xl">
                Meine Aufgaben
              </h1>
              <p className="mt-2 text-muted-foreground">{dateFormat.format(new Date())}</p>
            </div>
            <ProgressRing done={done} total={tasks.length} />
          </header>
          <TaskInput onAdd={add} />
          <TaskList tasks={tasks} onToggle={toggle} onRemove={remove} />
          {tasks.length === 0 && <EmptyState />}
        </main>
        <Toaster position="bottom-center" richColors closeButton />
      </TooltipProvider>
    </MotionConfig>
  )
}
