# SPEC: Was die App können muss

Diese Datei füllt /spec. Ein ausgefülltes Beispiel steht in docs/PROMPTS.md unter «Beispiel einer SPEC».

## Ziel

Eine Todo-Liste für meine Aufgaben, die Spass macht und mir zeigt, wie viel ich schon erledigt habe.

## Muss

- Aufgabe mit Titel anlegen (Enter oder Plus-Knopf), neue Aufgaben erscheinen oben.
- Aufgabe abhaken und wieder öffnen.
- Aufgabe löschen, mit «Rückgängig».
- Fortschrittsring zeigt «erledigt/gesamt».
- Ohne Aufgaben erscheint ein freundlicher leerer Zustand mit Illustration.
- Taste «N» setzt den Fokus ins Eingabefeld.

## Look

Neon

## Nicht

- Kein Login, kein Server. Die Daten bleiben im Browser.
- Keine Fälligkeitsdaten, Kategorien oder Prioritäten.
- Kein Board mit Spalten (kommt erst in Bau 2).

## Fertig, wenn

1. Leere Eingabe
   - Gegeben: Das Eingabefeld ist leer oder enthält nur Leerzeichen.
   - Wenn: Ich Enter drücke.
   - Dann: Es kommt keine Aufgabe dazu und das Feld schüttelt sich kurz.
2. 200 Zeichen
   - Gegeben: Ich tippe einen Titel mit mehr als 200 Zeichen ohne Leerzeichen.
   - Wenn: Ich Enter drücke.
   - Dann: Die Aufgabe hat höchstens 200 Zeichen, der Text bricht in der Karte um und nichts läuft hinaus.
3. Neu laden
   - Gegeben: Es gibt drei Aufgaben, eine davon ist abgehakt.
   - Wenn: Ich die Seite neu lade.
   - Dann: Alle drei Aufgaben sind noch da, die abgehakte ist weiterhin abgehakt.
4. Abhaken
   - Gegeben: Eine offene Aufgabe, der Ring zeigt «0/1».
   - Wenn: Ich die Checkbox anklicke.
   - Dann: Der Text wird animiert durchgestrichen, Konfetti erscheint und der Ring zeigt «1/1»; ein zweiter Klick macht die Aufgabe wieder offen und der Ring zeigt «0/1».
5. Schmales Fenster
   - Gegeben: Das Fenster ist 360 px breit.
   - Wenn: Ich Aufgaben anlege, abhake und lösche.
   - Dann: Alles ist lesbar und bedienbar, es gibt kein seitliches Scrollen.
6. Anlegen
   - Gegeben: Es gibt bereits eine Aufgabe «Alt».
   - Wenn: Ich «Neu» eintippe und auf den Plus-Knopf klicke.
   - Dann: «Neu» steht oben über «Alt», das Feld ist leer und hat weiterhin den Fokus.
7. Löschen mit Rückgängig
   - Gegeben: Es gibt die Aufgaben «A», «B» und «C».
   - Wenn: Ich «B» lösche und im Toast auf «Rückgängig» klicke.
   - Dann: Der Toast «Aufgabe gelöscht» erscheint, und nach «Rückgängig» steht «B» wieder zwischen «A» und «C».
8. Fortschrittsring
   - Gegeben: Es gibt fünf Aufgaben, drei sind abgehakt.
   - Wenn: Ich die Seite anschaue.
   - Dann: Der Ring zeigt «3/5» und hat die Beschriftung «3 von 5 erledigt» für Screenreader.
9. Leerer Zustand
   - Gegeben: Es gibt keine Aufgaben.
   - Wenn: Ich die Seite öffne oder die letzte Aufgabe lösche.
   - Dann: Die Neon-Illustration (Blitz im Kreis) und der Satz «Alles erledigt. Zeit für Kaffee.» sind sichtbar, der Ring zeigt «0/0».
10. Taste N
   - Gegeben: Der Fokus ist nicht im Eingabefeld.
   - Wenn: Ich die Taste «N» drücke.
   - Dann: Der Fokus springt ins Eingabefeld und es wird kein «n» eingetippt.

## Features

### F1: Board mit drei Spalten

Ich sehe auf einen Blick, was offen ist, woran ich arbeite und was erledigt ist, und schiebe Karten per Drag and Drop weiter.

1. Drei Spalten
   - Gegeben: Es gibt Aufgaben in allen drei Zuständen.
   - Wenn: Ich die Seite öffne.
   - Dann: Ich sehe die Spalten «Offen», «In Arbeit» und «Erledigt» in dieser Reihenfolge, jede mit ihren Karten und einem Zähler mit der Anzahl Karten im Kopf.
2. Neue Aufgabe
   - Gegeben: Das Board ist offen.
   - Wenn: Ich «Neu» eintippe und Enter drücke.
   - Dann: «Neu» erscheint oben in der Spalte «Offen».
3. Ziehen mit der Maus
   - Gegeben: Eine Karte «A» liegt in «Offen».
   - Wenn: Ich sie mit der Maus in die Spalte «In Arbeit» ziehe und loslasse.
   - Dann: Während des Ziehens leuchtet «In Arbeit»; danach liegt «A» dort, und nach dem Neuladen immer noch.
4. Reihenfolge in einer Spalte
   - Gegeben: In «Offen» liegen «A», «B», «C» untereinander.
   - Wenn: Ich «C» über «A» ziehe.
   - Dann: Die Reihenfolge ist «C», «A», «B», auch nach dem Neuladen.
5. Ziehen per Tastatur
   - Gegeben: Der Fokus liegt auf einer Karte in «Offen».
   - Wenn: Ich Leertaste drücke, mit der Pfeiltaste nach rechts gehe und wieder Leertaste drücke.
   - Dann: Die Karte liegt in «In Arbeit», und ein Screenreader hört eine deutsche Ansage; Esc während des Ziehens bricht ab und die Karte bleibt, wo sie war.
6. In «Erledigt» ablegen
   - Gegeben: Eine Karte liegt in «In Arbeit», der Ring zeigt «0/1».
   - Wenn: Ich sie in «Erledigt» ziehe.
   - Dann: Konfetti erscheint, der Text ist durchgestrichen und der Ring zeigt «1/1».
7. Checkbox im Board
   - Gegeben: Eine Karte liegt in «Offen» oder «In Arbeit».
   - Wenn: Ich die Checkbox anklicke.
   - Dann: Die Karte wandert nach «Erledigt»; ein erneuter Klick schiebt sie zurück nach «Offen».
8. Leere Spalte
   - Gegeben: Die Spalte «In Arbeit» hat keine Karten.
   - Wenn: Ich das Board ansehe.
   - Dann: Dort steht ein gestrichelter Bereich mit «Hierher ziehen».
9. Schmales Fenster
   - Gegeben: Das Fenster ist 360 px breit.
   - Wenn: Ich das Board ansehe.
   - Dann: Ich sehe jeweils eine Spalte und wische seitlich zur nächsten; die Seite selbst scrollt nicht seitlich.
10. Alte Daten
   - Gegeben: Aufgaben aus der alten Version sind gespeichert (eine erledigt, eine offen).
   - Wenn: Ich die neue Version öffne.
   - Dann: Alle Aufgaben sind noch da, im richtigen Zustand: die erledigte in «Erledigt», die offene in «Offen».
