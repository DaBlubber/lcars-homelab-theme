# Gitea: Homelab LCARS

Diese Integration enthält ein Variablen-Theme und Custom-Assets für
**Gitea 1.27.2**. Sie überschreibt keine Vorlagen und verändert keine Dateien im
Gitea-Binary. Logo- und Favicon-Austausch sind entgegen der früheren Aussage kein
Vorlageneingriff: Gitea lädt sie wie das Theme aus `$GITEA_CUSTOM/public/` und die
Anpassung ist deshalb genauso updatefest.

`theme-lcars-homelab.css` setzt alle 297 Variablen des gemessenen eingebauten
Themes bewusst. Die langen Gold- und Graureihen sowie die generischen Farbreihen
sind systematisch gemischt und in der CSS-Datei dokumentiert. Code, Diffs, Konsole
und ANSI-Farben besitzen eigene, auf Lesbarkeit angehobene Werte.

## Installation

Der Dateiname bestimmt die technische Theme-Kennung `lcars-homelab`. Im laufenden
Container ist der Zielpfad:

```text
/data/gitea/public/assets/css/theme-lcars-homelab.css
```

Das entspricht:

```text
$GITEA_CUSTOM/public/assets/css/theme-lcars-homelab.css
```

`/data/gitea/public/` existiert im gemessenen System noch nicht. Vor dem Kopieren
müssen deshalb `public/assets/css/` mit der UID/GID des Gitea-Prozesses angelegt
und die CSS-Datei dorthin gelegt werden. Das Repository enthält bewusst keinen
Ausrollbefehl; Eigentümer und Mount-Pfad hängen von der lokalen Containerdefinition
ab.

Anschließend in `$GITEA_CUSTOM/conf/app.ini` unter `[ui]` die Kennung an die
bestehende Theme-Liste anhängen. Vorhandene Einträge nicht ersetzen:

```ini
[ui]
THEMES = gitea-auto,gitea-light,gitea-dark,lcars-homelab
```

Falls `THEMES` bereits gesetzt ist, bleibt dessen bisherige Liste erhalten und nur
`,lcars-homelab` kommt hinzu. Nach der Änderung Gitea neu starten.

Ein Nutzer wählt danach über **Profilbild → Settings → Appearance → Theme** den
sichtbaren Namen **Homelab LCARS**. Eine bereits gespeicherte Nutzerauswahl hat
Vorrang vor dem systemweiten Standard.

## Logo und Favicons

Gitea 1.27.2 fordert die eingebauten Dateien unter `/assets/img/...` an. Gleich
benannte Dateien im Custom-Verzeichnis ersetzen sie updatefest. Der Zielpfad im
gemessenen Container ist:

```text
/data/gitea/public/assets/img/
```

Das entspricht `$GITEA_CUSTOM/public/assets/img/`. Die Namen müssen **exakt** den
eingebauten Namen entsprechen:

```text
logo.svg
favicon.svg
favicon.png
logo.png
apple-touch-icon.png
```

`logo.svg` und `favicon.svg` sind inhaltlich identisch mit
`assets/emblem--gitea.svg`. Sie verwenden `viewBox="0 0 100 116"`; Browser
passen das nichtquadratische Emblem standardmäßig zentriert und unverzerrt in die
quadratische Logo- beziehungsweise Favicon-Fläche ein.

Die PNG-Ausgaben sind:

- `favicon.png`: **32 × 32 px** für das kleine Browser-/Kopfzeilen-Fallback;
- `logo.png`: **512 × 512 px** als hochauflösende allgemeine Rasterquelle;
- `apple-touch-icon.png`: **180 × 180 px**, die übliche Apple-Touch-Größe.

Alle fünf Dateien werden reproduzierbar aus
`assets/emblem--gitea.svg` gebaut. Der gemeinsame Rahmen bleibt identisch
zur Basisfassung, im blauen Feld steht das Git-Branch-Symbol:

```powershell
cd lcars-homelab-theme
node .\integrations\gitea\build-gitea-assets.mjs
```

Der neue Gitea-Builder muss vor der ersten Auslieferung und nach jeder Änderung der
Emblemquelle neu laufen. `assets/favicon/build-icons.mjs` muss dafür nicht separat
gestartet werden; der Gitea-Builder importiert dessen bibliotheksfreien Renderer.

Der v1.7.0-Kontrolllauf erzeugte im beschreibbaren Temp-Verzeichnis alle fünf
Ziele erfolgreich. Die Sandbox verweigerte das Schreiben der drei PNG-Dateien in
den Arbeitsbaum; deshalb muss der obige Builder vor der Auslieferung einmal in
einer normalen lokalen Konsole laufen.

Das Emblem bleibt auf beiden Theme-Arten erkennbar, aber aus unterschiedlichen
Anteilen: Königblau erreicht auf einer hellen Kopfzeile 8,41:1 zu Weiß, Gold auf
einer dunklen Kopfzeile mindestens 8,36:1. Königblau allein erreicht auf dem
dunklen Gitea-Grund nur etwa 2,1–2,5:1; dort tragen deshalb die unveränderte goldene
Zickzackfläche und Kontur die Erkennung. Eine Farb- oder Geometrieänderung ist nicht
nötig.

Browser speichern Favicons besonders hartnäckig zwischen. Nach dem Austausch
gegebenenfalls Cache und Website-Daten löschen, ein privates Fenster verwenden oder
den Browser vollständig neu starten; ein normaler Reload genügt häufig nicht.

## Standard für alle

Für neue Nutzer und Nutzer ohne eigene Auswahl zusätzlich setzen:

```ini
[ui]
THEMES = gitea-auto,gitea-light,gitea-dark,lcars-homelab
DEFAULT_THEME = lcars-homelab
```

Auch diese Änderung wird erst nach einem Neustart wirksam. Bestehende persönliche
Theme-Einstellungen werden dadurch nicht überschrieben.

## Schriften und technische Grenze

Die vollständige Referenzdatei von Gitea 1.27.2 enthält keine `--font-family`-
oder vergleichbare Schriftvariable. Ein reines Gitea-Theme kann Exo 2 und
JetBrains Mono deshalb auf diesem updatefesten Weg nicht einstellen. Selektoren
für interne Gitea-Klassen oder Templateänderungen wurden auf Nutzerentscheidung
hin bewusst nicht ergänzt.

## Update-Prüfung

Bei jedem Gitea-Update:

1. die Variablennamen des neuen eingebauten dunklen/automatischen Themes erneut
   erheben und mit dieser Datei vergleichen;
2. prüfen, dass keine Variable fehlt oder umbenannt wurde und dass
   `--is-dark-theme: true` sowie `--theme-color-scheme: "dark"` noch dieselbe
   Semantik besitzen;
3. Anmeldung, Dashboard, Repository, Issue/PR, Codeansicht, Syntaxfarben, Side-by-
   side- und Unified-Diff, Konsole/Actions-Logs, ANSI-Testausgabe, Formulare,
   Meldungen, Labels, Diagramme sowie Hover-, Aktiv- und Fokuszustände ansehen;
4. kontrollieren, dass die Kennung noch in `[ui] THEMES` steht, die CSS-Datei unter
   dem Custom-Pfad und die fünf Bilddateien weiterhin unter `/assets/img/...`
   ausgeliefert werden.

## Rückbau

Für den Theme-Rückbau zuerst einen anderen Standard setzen und betroffene Nutzer ein
anderes Theme wählen lassen. Dann `lcars-homelab` aus `THEMES` entfernen und die
CSS-Datei löschen. Für den Marken-Rückbau die fünf oben genannten Dateien aus
`/data/gitea/public/assets/img/` entfernen. Danach Gitea neu starten; es fällt ohne
Template- oder Binary-Reparatur auf die eingebauten Logos und Favicons zurück.
