# Homelab-Favicons

`favicon.svg` ist die unveränderte Vektorquelle aus `../emblem.svg`.
`site.webmanifest` bindet die vorgesehenen 192- und 512-px-Ausgaben ein.

Die Binärziele werden ohne Netzwerk und ohne zusätzliche Pakete erzeugt:

```powershell
cd lcars-homelab-theme
node assets\favicon\build-icons.mjs
```

Erwartet werden PNG-Dateien mit 16, 32, 48, 180, 192 und 512 px, die zusätzliche
Prüfdatei `marke-check-24x24.png` sowie `favicon.ico` mit 16/32/48 px. Der Builder
prüft vor dem Rendern die verbindlichen
Farben `#1740bc` und `#eaa549` in der Quelle.

In der Ausführungs-Sandbox von Version 1.1.0 war das Anlegen neuer Binärdateien
unter `<Arbeitsordner>` gesperrt. Deshalb enthält das Paket bewusst nur SVG-Quelle,
Manifest und Builder. Der vollständige Satz wurde mit demselben Befehl in einem
beschreibbaren Temp-Verzeichnis erfolgreich testgerendert.
