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
```
