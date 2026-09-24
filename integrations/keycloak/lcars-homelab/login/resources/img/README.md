# Hintergrund-Slot

`hintergrund.jpg` ist die aktive Fassung: das vorbereitete Weltraumfoto mit
1536 × 1024 Pixeln und rund 246 KB. Die Datei ist bereits für die Auslieferung
kodiert und darf nicht erneut bearbeitet oder komprimiert werden.

`hintergrund.svg` bleibt als gezeichnete LCARS-Alternative im selben Verzeichnis.
Die aktive Datei wird ausschließlich über `--rl-background-image` am Anfang von
`../css/styles.css` gewählt. Dort liegen auch die gleichmäßige Abdunklung, der
90 Sekunden lange CSS-Zoom von 100 auf 102,5 Prozent und die vollständige
Abschaltung bei `prefers-reduced-motion: reduce`; Templates und JavaScript sind
dafür nicht nötig.

Das 3:2-Foto füllt per `cover` jedes Seitenverhältnis. Bei sehr breiten Fenstern
ist dafür ein starker Beschnitt oben und unten unvermeidlich; eine größere oder
breitere Quelle würde dort mehr Motiv zeigen.

Fehlt die gewählte Bilddatei, trägt der schwarze CSS-Grund die Seite. Die
Login-Konsole ist deckend und behält deshalb unabhängig vom Motiv ihre geprüften
Textkontraste.
