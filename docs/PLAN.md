# PLAN: Wie die App gebaut wird

Diese Datei füllt /plan aus docs/SPEC.md.

## Stack

Siehe docs/STACK.md. Keine Abweichungen.

## Ordner und Dateien

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

## Datenmodell

```ts
export type Task = {
  id: string // crypto.randomUUID()
  title: string // getrimmt, 1 bis 200 Zeichen
  done: boolean
  createdAt: number // Date.now()
}

export type State = {
  version: number // CURRENT_VERSION = 1
  tasks: Task[] // neueste zuerst
}
```

`localStorage "hwz-todo" = { version: 1, tasks: Task[] }`. Neue Version, darum keine Migration. Kaputte oder fehlende Daten ergeben `{ version: 1, tasks: [] }`.

## Komponenten

- App-Rahmen mit Hero «Meine Aufgaben», Datum und ProgressRing (DESIGN.md, Rezept 1).
- TaskInput: Eingabefeld mit Plus-Knopf, schüttelt bei leerer Eingabe (DESIGN.md, Rezepte 2 und 9).
- TaskCard: Aufgabe mit Checkbox, animierter Durchstreichung, Konfetti und Löschen mit Toast «Rückgängig» (DESIGN.md, Rezepte 3 und 7).
- TaskList: Liste, in der Karten hereingleiten und hinausgleiten (DESIGN.md, Rezept 4).
- EmptyState: Blitz im Kreis und «Alles erledigt. Zeit für Kaffee.» (DESIGN.md, Rezept 5).
- ProgressRing: Ring mit «3/5» und federnder Animation (DESIGN.md, Rezept 1).

## Risiken

- Kaputte Daten im localStorage lassen die App abstürzen: loadState fängt Fehler ab und gibt eine leere Liste zurück, mit Test.
- Lange Titel ohne Leerzeichen sprengen die Karte bei 360 px: `break-words [overflow-wrap:anywhere]` und `min-w-0` (Rezepte 7 und 8), Kürzung auf 200 Zeichen im Model mit Test.
- Konfetti und Animationen stören Tests oder Personen mit «Bewegung reduzieren»: Konfetti liegt in `celebrate.ts` und wird im Test ersetzt; `MotionConfig reducedMotion="user"` und die Prüfung von `prefers-reduced-motion`.
