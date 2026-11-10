# PLAN: Wie die App gebaut wird

Diese Datei füllt /plan aus docs/SPEC.md.

## Stack

Siehe docs/STACK.md. Keine Abweichungen.

## Ordner und Dateien

Bau 1 (erledigt):

- Alle Dateien aus docs/STACK.md, «Dateien für Task 1», plus `src/components/ui/*`: Projektrahmen, Look `neon` in `index.html`.
- `src/features/tasks/model.ts`: Typ Task und reine Funktionen addTask, toggleTask, removeTask, restoreTask, countDone.
- `src/features/tasks/model.test.ts`: Tests für die Model-Funktionen.
- `src/lib/storage.ts`: loadState und saveState für den localStorage, mit Versionsprüfung.
- `src/lib/storage.test.ts`: Tests für Laden, Speichern und kaputte Daten.
- `src/features/tasks/useTasks.ts`: React-Hook, verbindet Model und Storage.
- `src/features/tasks/useTasks.test.ts`: Tests für den Hook inklusive Speichern.
- `src/features/tasks/components/TaskList.tsx`: Liste mit Listen-Animation.
- `src/features/tasks/components/TaskCard.tsx`: eine Aufgabe mit Checkbox, Text und Löschen.
- `src/features/tasks/components/TaskCard.test.tsx`: Tests für Anzeige, Abhaken, Löschen und Rückgängig.
- `src/features/tasks/components/TaskInput.tsx`: Eingabefeld mit Plus-Knopf.
- `src/features/tasks/components/TaskInput.test.tsx`: Tests für Hinzufügen, leere Eingabe und Taste N.
- `src/features/tasks/components/EmptyState.tsx`: leerer Zustand mit Neon-Illustration.
- `src/components/ProgressRing.tsx`: Fortschrittsring erledigt/gesamt.
- `src/components/ProgressRing.test.tsx`: Tests für Anzeige und aria-label.
- `src/lib/useHotkey.ts`: Hook für die Taste N.
- `src/lib/celebrate.ts`: Konfetti-Aufruf, im Test ersetzbar.
- `src/lib/theme.ts`: liest die Konfetti-Farben aus den CSS-Variablen.
- `src/App.tsx`: setzt Kopf, Eingabe, Liste und leeren Zustand zusammen.

Bau 2 (Board):

- `src/features/tasks/model.ts`: `status` statt `done`, neue reine Funktionen moveTask, resolveDrop, tasksByStatus, dragAnnouncements.
- `src/lib/storage.ts`: CURRENT_VERSION 2 und Migration migrateV1toV2.
- `src/features/tasks/useTasks.ts`: neue Aktion move, toggle wechselt zwischen «Erledigt» und «Offen».
- `src/features/tasks/components/Board.tsx`: Board mit drei Spalten, DndContext, DragOverlay und deutschen Ansagen.
- `src/features/tasks/components/BoardColumn.tsx`: eine Spalte mit Kopf, Zähler, Drop-Bereich und sortierbaren Karten.
- `src/features/tasks/components/Board.test.tsx`: Tests für Spalten, leere Spalte und Checkbox im Board.
- `src/features/tasks/components/TaskCard.tsx`: zeigt `status`, wird ziehbar (useSortable).
- `src/App.tsx`: Board statt Liste, Seite `max-w-6xl`.
- `src/features/tasks/components/TaskList.tsx`: entfällt, ersetzt durch das Board.
- Tests daneben werden angepasst: `model.test.ts`, `storage.test.ts`, `useTasks.test.ts`, `TaskCard.test.tsx`.

## Datenmodell

```ts
export type Status = 'todo' | 'doing' | 'done'

export type Task = {
  id: string // crypto.randomUUID()
  title: string // getrimmt, 1 bis 200 Zeichen
  status: Status // ersetzt done aus Version 1
  createdAt: number // Date.now()
}

export type State = {
  version: number // CURRENT_VERSION = 2
  tasks: Task[] // Reihenfolge im Array = Reihenfolge in der Spalte
}
```

`localStorage "hwz-todo" = { version: 2, tasks: Task[] }`. Migration `migrateV1toV2` (docs/STACK.md, «Datenhaltung»): `done: true` → `status: 'done'`, `done: false` → `status: 'todo'`. Die Migration hat einen eigenen Test mit echten Daten im Format von Version 1. Kaputte oder fehlende Daten ergeben `{ version: 2, tasks: [] }`.

## Komponenten

- App-Rahmen mit Hero «Meine Aufgaben», Datum und ProgressRing (DESIGN.md, Rezept 1), im Board `max-w-6xl`.
- TaskInput: Eingabefeld mit Plus-Knopf, neue Aufgaben landen oben in «Offen» (DESIGN.md, Rezepte 2 und 9).
- Board: drei Spalten nebeneinander, auf dem Handy seitlich wischbar, Drag and Drop mit Maus und Tastatur, DragOverlay, Konfetti beim Ablegen in «Erledigt» (DESIGN.md, Rezepte 6 und 8).
- BoardColumn: Spalte mit Titel und Badge-Zähler, leuchtet beim Darüberziehen, leer mit «Hierher ziehen» (DESIGN.md, Rezept 6).
- TaskCard: ziehbare Karte mit Checkbox, Durchstreichung, Konfetti und Löschen mit «Rückgängig» (DESIGN.md, Rezepte 3, 6 und 7).
- EmptyState: Blitz im Kreis, wenn es gar keine Aufgaben gibt (DESIGN.md, Rezept 5).
- ProgressRing: zählt Karten in «Erledigt» (DESIGN.md, Rezept 1).

## Risiken

- Gespeicherte Aufgaben aus Bau 1 gehen beim Umstieg verloren: Version 2 mit Migration und eigenem Test mit Daten im Format von Version 1 (AGENTS.md, Regel 9).
- Ziehen lässt sich im Test-Browser (jsdom) nicht echt simulieren, weil dort alle Positionen 0 sind: Die ganze Logik (Ziel bestimmen, verschieben, Ansagen, Konfetti-Entscheid) liegt als reine Funktionen in `model.ts` mit Tests; das echte Ziehen kommt als Klick-Anleitung in /review.
- Auf 360 px läuft das Board seitlich aus der Seite: Klassen aus DESIGN.md, Rezept 8 (`-mx-4 … overflow-x-auto`, Spalten `w-[85vw] shrink-0 snap-center`), nur die Spaltenleiste scrollt.
