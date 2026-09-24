# LCARS-Homelab fuer Android

Dies ist bewusst **kein installierbares Android-Theme und kein Icon-Pack-APK**.
Android hat keine herstelleruebergreifende Theme-Datei. Enthalten sind lokale PNGs
fuer Start- und Sperrbildschirm sowie zehn neue Homelab-Hauspiktogramme fuer
Hestia, Tempest, Gitea, Jenkins, Nextcloud, Immich, Jellyfin, Paperless,
Vaultwarden und Grafana.

## Dateien erzeugen

```powershell
cd lcars-homelab-theme\integrations\android
node .\build-wallpapers.mjs
node .\build-icons.mjs
```

Das Hauptformat ist 1080x2400; 1440x3200 und 1080x1920 werden ebenfalls erzeugt.
Die Startbildschirmvariante haelt die Symbolmitte frei, die Sperrbildschirmvariante
den oberen Bereich fuer Uhr und Meldungen. Die 512x512-Symbole haben ihr wichtiges
Motiv innerhalb der mittleren 66 Prozent, damit uebliche adaptive Masken nichts
Wesentliches abschneiden. Es sind eigene Dienst-Piktogramme, keine Kopien der
offiziellen Anbieterlogos.

## Ohne zusaetzliches Programm

1. Den passenden Inhalt der Ordner `wallpapers\` und optional `icons\` per USB,
   Nearby Share/Quick Share oder einem bereits eingerichteten lokalen Dateizugriff
   auf das Telefon kopieren.
2. In **Einstellungen > Hintergrund & Stil** (Bezeichnung je Hersteller anders)
   `startbildschirm-1080x2400.png` fuer den Startbildschirm setzen. Beim Zuschneiden
   nicht hineinzoomen und die linke Rahmenleiste sichtbar lassen.
3. `sperrbildschirm-1080x2400.png` getrennt fuer den Sperrbildschirm setzen. Die
   Vorschau so ausrichten, dass der grosse freie obere Bereich erhalten bleibt.
4. Uhrfarbe, sofern das Geraet sie anbietet, auf Gold `#eaa549` oder helles Grau
   stellen. Eine schmale Digitaluhr des Systems passt besser als eine verspielte.

Damit funktionieren die beiden Hintergruende auf praktisch jedem Android-Geraet.
Beliebige PNGs als App-Symbol zuzuweisen erlaubt Android selbst jedoch nicht
allgemein. Pixel Launcher und Samsung One UI koennen ohne Zusatzprogramm keine
einzelnen Galerie-PNGs pro App setzen; systemeigene "Themed icons" verwenden nur
vom jeweiligen App-Anbieter mitgelieferte monochrome Symbole.

## Symbole mit einem geeigneten Startbildschirm

Startbildschirme wie Nova Launcher oder Smart Launcher bieten je nach Version die
Einzelzuweisung. Ueblicher Ablauf: App-Symbol lange druecken, **Bearbeiten** oder
Stiftsymbol waehlen, das Symbol antippen, **Galerie/Dateien** waehlen und das
passende PNG aus `icons\` auswaehlen. Menuebezeichnungen und die Unterstuetzung
koennen sich mit Launcher-Versionen aendern. Launcher, die nur installierte
Icon-Packs akzeptieren, koennen diese lose PNG-Sammlung nicht verwenden.

Ohne Wechsel des Startbildschirms bleiben die Hintergrundbilder, Systemfarben,
eine passende Systemuhr und normale Android-Widgets. Die gelieferten App-Symbole
lassen sich dann nicht verlaesslich global ersetzen.

## Gemeinte Widget-Anordnung

Android bietet ohne Zusatzprogramm keinen freien Widget-Designer. Mit Bordmitteln
zuerst eine schmale System-Digitaluhr im oberen freien Feld und darunter ein kleines
Kalender- oder Wetterwidget platzieren. Farben und Schrift sind dabei nur so weit
anpassbar, wie der Hersteller es vorsieht.

Fuer einen freiwilligen Nachbau in KWGT ist kein angeblich fertiges Preset
enthalten. Die Zielanordnung und Werte sind:

- Uhr oben links, `JetBrains Mono`, 42 sp, Gewicht 600, Farbe `#dfe4f2`;
- Datum/Statuszeile darunter, `JetBrains Mono`, 12 sp, Versalien, Farbe `#8b90a0`;
- LCARS-Blockleiste: 74 dp hoch beziehungsweise auf Telefonen 52 dp, Blockabstand
  4 dp, Endkappenradius 22 dp;
- Bloecke in Gold `#eaa549`, Koenigsblau `#1740bc`, Lavendel `#9a8ec9`, Blau
  `#5a7fe0` und gedecktem Grau `#3c4257`;
- Hintergrund `#0b0d14`, keine Verlaeufe, keine Schatten, 2.5 dp
  Buchstabenabstand fuer kurze Versalbeschriftungen.

JetBrains Mono muss fuer KWGT gegebenenfalls lokal aus `fonts\` importiert werden;
das ist eine Funktion des Zusatzprogramms und kein Bestandteil dieser Sammlung.
