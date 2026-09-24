# Nextcloud

Paketversion **1.14.0**. Das Stylesheet ist für den gemessenen Stand Nextcloud
**34.0.3** und `theming_customcss` **1.21.0** gebaut. Es ist lokal erstellt und noch
nicht am laufenden System abgenommen.

## Voraussetzung und Aufgabenteilung

Die offizielle App `theming_customcss` muss installiert und aktiviert sein. Sie
trägt den Inhalt von `nextcloud.css`; die normale Nextcloud-Theming-App bleibt
zusätzlich zuständig für:

- Name **Homelab IT Cloud**;
- Slogan **„Gemeinsam sicher verbunden.“**;
- Primärfarbe `#f0ad55` und Hintergrundfarbe `#241c17`;
- hochgeladenes Logo, Hintergrundbild, Favicon und die Instanz-URL.

Als Logo dient `assets/emblem--nextcloud.svg`, als Hintergrund
`assets/hintergrund.jpg`. Beide Bilder kommen aus der Theming-App, nicht aus dem
Custom-CSS. Dieses kalibriert die gemessenen Nextcloud-Variablen, lädt die beiden
Hausschriften, vergrößert Schrift und Bedienziele und gestaltet die gemessenen
Gast-/Anmeldebausteine.

## Eintragen

Vorher den vorhandenen Wert sichern:

```sh
sudo -u www-data php occ config:app:get theming_customcss customcss > nextcloud-customcss.backup.css
```

Dann entweder den vollständigen Inhalt von `nextcloud.css` unter
**Verwaltungseinstellungen > Design > Eigenes CSS** einfügen und speichern oder
auf dem Nextcloud-Host als ein einziges Argument setzen:

```sh
sudo -u www-data php occ config:app:set theming_customcss customcss \
  --value="$(cat /pfad/zu/nextcloud.css)"
```

Der genaue Präfix für `occ` hängt von der Installation ab; in einem Container
oder Nomad-Alloc kann statt `sudo -u www-data php occ` der dort bereits verwendete
`occ`-Aufruf stehen. Das Stylesheet selbst enthält keine Infrastrukturänderung.
Nach dem Speichern Browser-Cache leeren beziehungsweise hart neu laden.

## Logo und Hintergrund eintragen

Die beiden Dateien müssen auf dem Nextcloud-Host lesbar vorliegen. Vor dem
Austausch die bisher verwendeten Bilddateien separat sichern und ihre Pfade für
den Rückweg notieren. Dann Emblem und Weltraumfoto über die normale Theming-App
setzen:

```sh
sudo -u www-data php occ theming:config logo \
  /absoluter/pfad/zu/emblem--nextcloud.svg
sudo -u www-data php occ theming:config background \
  /absoluter/pfad/zu/hintergrund.jpg
```

Wie beim Custom-CSS ist der `occ`-Präfix an Container oder Nomad-Alloc
anzupassen. Das Stylesheet enthält absichtlich weder eine Logo- noch eine
Hintergrund-URL.

## Hell und Dunkel

`nextcloud.css` setzt **weder** `--color-main-background` noch
`--color-main-text`. Damit bleiben Nextclouds benutzerspezifische Auswahl
„Hell“, „Dunkel“ oder „System“ und ihre vertrauten Grundflächen erhalten.
Rahmen, Hoverflächen, Auswahlflächen, helle Statusflächen und Statustext werden
mit `color-mix()` jeweils aus den gerade aktiven Nextcloud-Grundfarben abgeleitet.
Ein eigener fester Dunkelzweig ist deshalb nicht nötig. Die Übersetzung gilt auch
auf `body[data-themes]`, also auf Nextclouds eigenem Themenzustand, leitet ihre
Werte dort aber weiterhin aus dessen aktuellen Grundfarben ab.

Gold bleibt als Markenfarbe in beiden Modi fest. Die Handlungsfläche mischt Gold
mit der aktiven Haupttextfarbe gerade so weit, dass auch ihre Grenze zum
Untergrund erkennbar bleibt. Die Anmeldung verwendet für ihre Karte ebenfalls
die aktive Nextcloud-Grundfläche; nur das Foto dahinter und der LCARS-Rahmen sind
fest markiert. So ist eine helle Anmeldekarte wirklich hell und eine dunkle
Anmeldekarte dunkel.

## Anmeldung und Bewegung

Die Anmeldung erhält bewusst das gemeinsame Weltraumfoto aus der Theming-App.
Das passt hier, weil `.guest-content` eine abgegrenzte, markeneigene Gastfläche
ist und nicht der Arbeitsbereich für Dateien und Fotos. Das CSS verwendet
`--image-background` genau einmal als Hintergrund dieser Fläche und legt nur eine
gleichmäßige schwarze Abdunklung darüber. Damit können nicht das CSS-Foto und das
Theming-Foto übereinanderliegen. Die zu 90 Prozent deckende, weichgezeichnete
Karte hält den Inhalt zusätzlich lesbar; ohne `backdrop-filter` ist sie
vollständig deckend.

Das von der Theming-App ausgegebene Logo ist die neue Nextcloud-Emblemfassung;
das CSS erzeugt keine zweite Emblemkopie. `.header-guest` bildet darum nur die
ruhige goldene Endkappe. Formularkarten erhalten eine schmale Rail und eine
**statische** segmentierte Fußleiste. Dateilisten, Freigabeansichten und der
angemeldete Arbeitsbereich bekommen weder Elbows noch Dauerbewegung.
`prefers-reduced-motion: reduce` stoppt Druckreaktion und sämtliche Übergänge
vollständig.

## Reaktion und Zugänglichkeit

`.button-vue` nutzt die Reaktionszustände aus LCARS-Homelab 1.3.0: 140-ms-Hover,
doppelter kontrastabhängiger Tastaturfokus, kurzer Druckblitz und eine ruhige,
deutlich abgeblendete Sperrung. Text bleibt in normaler Groß-/Kleinschreibung.
Checkboxen erhalten größere Ziele und denselben doppelten Fokus.

Die festen, semantisch getrennten Vollfarben wurden rechnerisch gegen weißen
Text geprüft:

| Rolle | Farbe | Kontrast zu Weiß |
| --- | --- | ---: |
| Fehler | `#c23844` | 5,33:1 |
| Warnung | `#965f00` | 5,34:1 |
| Erfolg | `#2f7747` | 5,45:1 |
| Information | `#356ab7` | 5,39:1 |

Gegen das angesetzte dunkle `#171717` heben sich dieselben vier Vollfarben mit
mindestens 3,29:1 auch als Symbole oder Steuerungsgrenzen ab. Gold `#f0ad55` mit
dem fest zugeordneten Text `#241c17` erreicht 8,63:1. Die
abgeleitete Handlungsfläche erreicht im gemessenen Hellmodus 4,61:1 zum Text und
3,64:1 zum weißen Umfeld, im angesetzten Dunkelmodus 10,66:1 beziehungsweise
11,40:1. Die modusrelativen Statustexte erreichen mit den gemessenen Hellwerten
(`#222222` auf `#ffffff`) mindestens 7,97:1. Gegen das für die Rechenprüfung konservativ
angesetzte Dunkelpaar (`#f8f8f8` auf `#171717`) liegt der kleinste berechnete Wert
bei 5,97:1. Die aktiven dunklen Variablen der Installation wurden nicht gemessen;
das echte Dunkelthema und alle Statuskomponenten sind deshalb nach dem Eintragen
visuell und rechnerisch nachzuprüfen. Farbe bleibt nur Ergänzung zu Nextclouds
vorhandenen Texten und Symbolen. `color-mix()` gehört deshalb zur
Browser-Voraussetzung dieses Overlays.

## Rückweg

Gesicherten Inhalt wieder eintragen:

```sh
sudo -u www-data php occ config:app:set theming_customcss customcss \
  --value="$(cat nextcloud-customcss.backup.css)"
```

Gab es vorher kein eigenes CSS, den Wert leeren:

```sh
sudo -u www-data php occ config:app:set theming_customcss customcss --value=''
```

Das entfernt nur das Overlay. Name, Slogan, Farben, Logo und Hintergrund der
normalen Theming-App bleiben bestehen. Die App kann anschließend separat
deaktiviert werden, ist für einen schnellen Rückweg aber nicht zu entfernen.

Die zuvor gesicherten Theming-Bilder werden mit denselben Befehlen zurückgesetzt:

```sh
sudo -u www-data php occ theming:config logo \
  /absoluter/pfad/zur/sicherung/homelab-it-logo.svg
sudo -u www-data php occ theming:config background \
  /absoluter/pfad/zur/sicherung/platinen-hintergrund.jpg
```

Soll statt der alten Bilder Nextclouds Standard wiederhergestellt werden, beide
Bildwerte löschen:

```sh
sudo -u www-data php occ theming:config logo --delete
sudo -u www-data php occ theming:config background --delete
```

## Nach dem Eintragen prüfen

- Anmeldung, Kennwort-Reset, Ablauf-/Fehlerseite und öffentliche Freigabe;
- helle und dunkle Benutzereinstellung sowie „System“ in beiden Betriebssystemmodi;
- Datei-, Foto- und Einstellungsansicht auf Desktop und schmalem Mobilviewport;
- Primär-, Sekundär-, Tertiär- und Icon-Schaltflächen mit Maus und Tastatur;
- Fehler, Warnung, Erfolg und Information einschließlich Icons und Meldungstext;
- lange deutsche Texte, 200 Prozent Zoom, sichtbare Fokusfolge und Reduced Motion;
- Erreichbarkeit der Schriften im versionierten `v1.14.0`-Pfad sowie Ausgabe von
  Foto und Emblem durch die Theming-App.
