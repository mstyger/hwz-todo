# TASKS: Bauschritte

Diese Datei füllt /plan. /task arbeitet sie von oben nach unten ab und hakt jeden Task ab.
Ein Beispiel mit allen 6 Tasks von Bau 1 steht in docs/PROMPTS.md unter «Beispiel: die 6 Tasks von Bau 1».

Format je Task:

```text
[ ] N  Titel
- Ziel: Ein Satz, was danach sichtbar oder möglich ist.
- Dateien: Genau die Dateien, die geändert werden dürfen.
- Test zuerst: Welcher Test zuerst rot sein muss.
- Fertig wenn: Prüfbares Ergebnis plus «npm run check grün».
```

## Tasks

```text
[x] 1  Projekt einrichten
- Ziel: Leerer App-Rahmen im Look Neon läuft unter http://localhost:5173/hwz-todo/.
- Dateien: alle aus docs/STACK.md, Abschnitt «Dateien für Task 1», plus src/components/ui/*.
- Test zuerst: src/App.test.tsx (kommt mit Task 1, siehe STACK.md).
- Fertig wenn: Hero-Überschrift «Meine Aufgaben» im Look Neon sichtbar, npm run check grün.

[x] 2  Datenmodell und Store mit Tests
- Ziel: Aufgaben lassen sich anlegen, abhaken, löschen, wiederherstellen und im localStorage speichern, noch ohne Oberfläche.
- Dateien: src/features/tasks/model.ts, src/features/tasks/model.test.ts, src/lib/storage.ts, src/lib/storage.test.ts, src/features/tasks/useTasks.ts, src/features/tasks/useTasks.test.ts.
- Test zuerst: addTask ignoriert leeren Titel, kürzt auf 200 Zeichen und setzt die neue Aufgabe an den Anfang; restoreTask setzt eine Aufgabe an die alte Stelle; loadState gibt bei kaputtem JSON eine leere Liste zurück.
- Fertig wenn: «Neu laden» auf Model-Ebene belegt (speichern, neu laden, gleicher Zustand), «200 Zeichen» im Model belegt, npm run check grün.

[x] 3  Liste anzeigen
- Ziel: Gespeicherte Aufgaben erscheinen als TaskCards mit Listen-Animation.
- Dateien: src/features/tasks/components/TaskList.tsx, src/features/tasks/components/TaskCard.tsx, src/features/tasks/components/TaskCard.test.tsx, src/App.tsx.
- Test zuerst: TaskList zeigt zwei Aufgaben aus dem localStorage nach dem Rendern an, eine davon abgehakt.
- Fertig wenn: Aufgaben sichtbar (DESIGN.md, Rezepte 3, 4, 7, 8), «Neu laden» und «Schmales Fenster» (Liste) erfüllt, npm run check grün.

[x] 4  Aufgabe hinzufügen
- Ziel: Neue Aufgabe per Enter oder Plus-Knopf, leere Eingabe schüttelt, Taste N fokussiert das Feld.
- Dateien: src/features/tasks/components/TaskInput.tsx, src/features/tasks/components/TaskInput.test.tsx, src/lib/useHotkey.ts, src/App.tsx.
- Test zuerst: Tippen + Enter zeigt die Aufgabe oben; Enter bei leerem Feld fügt nichts hinzu; «N» fokussiert das Feld, ohne ein «n» einzutippen.
- Fertig wenn: «Leere Eingabe», «200 Zeichen», «Anlegen» und «Taste N» erfüllt (DESIGN.md, Rezepte 2 und 9), npm run check grün.

[x] 5  Abhaken und löschen
- Ziel: Abhaken mit Federn, Durchstreichen und Konfetti; Löschen mit Toast «Rückgängig».
- Dateien: src/features/tasks/components/TaskCard.tsx, src/features/tasks/components/TaskCard.test.tsx, src/lib/celebrate.ts, src/lib/theme.ts.
- Test zuerst: Klick auf Checkbox setzt done und ruft celebrate auf, zweiter Klick macht es rückgängig; Löschen von «B» und «Rückgängig» stellt «B» zwischen «A» und «C» wieder her.
- Fertig wenn: «Abhaken» und «Löschen mit Rückgängig» erfüllt (DESIGN.md, Rezept 3), Zustand bleibt nach Neuladen, npm run check grün.

[x] 6  Zähler und leerer Zustand
- Ziel: Fortschrittsring zeigt erledigt/gesamt; ohne Aufgaben erscheint die Neon-Illustration.
- Dateien: src/components/ProgressRing.tsx, src/components/ProgressRing.test.tsx, src/features/tasks/components/EmptyState.tsx, src/App.tsx.
- Test zuerst: Ring hat aria-label «3 von 5 erledigt» und zeigt «3/5»; leere Liste zeigt «Alles erledigt. Zeit für Kaffee.» und «0/0».
- Fertig wenn: «Fortschrittsring», «Leerer Zustand» und «Schmales Fenster» (ganze Seite bei 360 px) erfüllt (DESIGN.md, Rezepte 1 und 5), npm run check grün.

[x] 7  Migration mit Test
- Ziel: Aufgaben haben `status` («Offen», «In Arbeit», «Erledigt») statt `done`, gespeicherte Aufgaben aus Bau 1 bleiben erhalten, die App sieht noch aus wie vorher.
- Dateien: src/features/tasks/model.ts, src/features/tasks/model.test.ts, src/lib/storage.ts, src/lib/storage.test.ts, src/features/tasks/useTasks.ts, src/features/tasks/useTasks.test.ts, src/features/tasks/components/TaskCard.tsx, src/features/tasks/components/TaskCard.test.tsx.
- Test zuerst: migrateV1toV2 macht aus `done: true` → `status: 'done'` und aus `done: false` → `status: 'todo'`; loadState mit Version-1-Daten liefert Version 2 mit allen Aufgaben; toggleTask schiebt `todo`/`doing` → `done` und `done` → `todo`.
- Fertig wenn: «Alte Daten» und die Logik von «Checkbox im Board» erfüllt, alle bisherigen Tests grün, npm run check grün.

[x] 8  Verschieben im Model
- Ziel: Eine Aufgabe lässt sich per reiner Funktion in eine Spalte und an eine Position verschieben, und das Ziel eines Drops wird berechnet.
- Dateien: src/features/tasks/model.ts, src/features/tasks/model.test.ts, src/features/tasks/useTasks.ts, src/features/tasks/useTasks.test.ts.
- Test zuerst: moveTask(tasks, 'C', 'todo', 0) ergibt in «Offen» «C», «A», «B»; moveTask nach `doing` ändert den Status; resolveDrop über einer Spalte legt ans Ende, über einer Karte an deren Stelle; tasksByStatus gruppiert in der richtigen Reihenfolge; useTasks.move speichert und übersteht Neuladen.
- Fertig wenn: «Reihenfolge in einer Spalte» auf Model-Ebene belegt, npm run check grün.

[x] 9  Board mit drei Spalten
- Ziel: Statt der Liste erscheinen die Spalten «Offen», «In Arbeit» und «Erledigt» mit Zähler; auf dem Handy wischt man seitlich.
- Dateien: src/features/tasks/components/Board.tsx, src/features/tasks/components/BoardColumn.tsx, src/features/tasks/components/Board.test.tsx, src/features/tasks/components/TaskList.tsx, src/features/tasks/components/TaskCard.test.tsx, src/App.tsx.
- Test zuerst: Board zeigt drei Überschriften in der richtigen Reihenfolge mit Zählern; eine leere Spalte zeigt «Hierher ziehen»; neue Aufgabe erscheint oben in «Offen»; Checkbox in «Offen» schiebt die Karte nach «Erledigt», erneuter Klick zurück nach «Offen».
- Fertig wenn: «Drei Spalten», «Neue Aufgabe», «Leere Spalte», «Checkbox im Board» und «Schmales Fenster» erfüllt (DESIGN.md, Rezepte 6 und 8), TaskList.tsx entfernt, npm run check grün.

[x] 10  Drag and Drop mit der Maus
- Ziel: Karten lassen sich mit der Maus zwischen Spalten und innerhalb einer Spalte ziehen, die Zielspalte leuchtet, eine schräge Kopie folgt dem Zeiger.
- Dateien: src/features/tasks/components/Board.tsx, src/features/tasks/components/BoardColumn.tsx, src/features/tasks/components/TaskCard.tsx, src/features/tasks/components/Board.test.tsx.
- Test zuerst: Jede Karte hat die Ziehen-Attribute von dnd-kit (`aria-roledescription`), und der Drop-Handler des Boards ruft bei einem simulierten Drop-Ereignis move mit dem Ergebnis von resolveDrop auf.
- Fertig wenn: «Ziehen mit der Maus» und «Reihenfolge in einer Spalte» erfüllt (DESIGN.md, Rezept 6), npm run check grün.

[x] 11  Tastatur, Ansagen und Konfetti
- Ziel: Ziehen per Tastatur mit deutschen Screenreader-Ansagen, Esc bricht ab, Ablegen in «Erledigt» zeigt Konfetti.
- Dateien: src/features/tasks/model.ts, src/features/tasks/model.test.ts, src/features/tasks/components/Board.tsx, src/features/tasks/components/Board.test.tsx.
- Test zuerst: dragAnnouncements liefert deutsche Sätze wie «Aufgabe «A» aufgenommen.» und «Aufgabe «A» in «In Arbeit» abgelegt.»; der Drop nach `done` aus einer anderen Spalte ruft celebrate auf, innerhalb von «Erledigt» nicht.
- Fertig wenn: «Ziehen per Tastatur» und «In «Erledigt» ablegen» erfüllt (DESIGN.md, Rezept 6), npm run check grün.
```
