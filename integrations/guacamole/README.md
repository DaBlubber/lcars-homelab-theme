# Guacamole: Homelab LCARS

Diese Erweiterung ersetzt das bisherige bisherige Branding durch
LCARS-Homelab. Der Arbeitsbereich bleibt bewusst Stufe B: dunkle, ruhige Flächen,
gesperrte Überschriften, einseitige LCARS-Kanten und eindeutige Reaktionszustände.
Die Anmeldung ist mit Elbow, bewegter Blockleiste, Emblem und Weltraumfoto näher
an Stufe A.

Zielversion ist Apache Guacamole **1.6.8**, Paketversion **1.9.0**. Die Regeln
wurden mit den bereitgestellten ausgelieferten Stylesheets und allen 426
gemessenen Klassennamen
abgeglichen. Das übertragene Remote-Bild selbst wird nicht gestaltet; bei
geteilten Verbindungen ändert Homelab-CSS nur `.client-tile-header`.

## Inhalt

- `guac-manifest.json`: Erweiterungsmanifest mit Namespace
  `lcars-branding-ns`;
- `skins/lcars/css/lcars.css`: vollständiges Stufe-B-Stylesheet;
- `translations/en.json`: überschreibt Guacamoles `APP.NAME` mit
  `Homelab Remote Access` — dieselbe Aufgabe, für die eine Branding-Erweiterung
  die englische Übersetzungsdatei mitführt;
- `build-extension.mjs`: bibliotheksfreier, deterministischer ZIP/JAR-Erzeuger;
- `guacamole-lcars-branding.jar`: Name der vom Builder erzeugten, direkt
  einsetzbaren Erweiterung.

Schriften, Emblem und Foto kommen ausschließlich aus dem versionierten
Homelab-Pfad unter `https://brand.example.com/v1.9.0/`. Es gibt keinen
Google-Fonts-Aufruf und keinen fremden `@import`.

**Korrektur (v1.7.0-Rollout):** Ein erster Versuch, das App-spezifische Emblem
als Datei `skins/lcars/img/emblem.svg` in der Erweiterung mitzuliefern,
scheiterte am laufenden System — Guacamole serviert Erweiterungsdateien nicht
als eigenstaendige statische Web-Ressourcen. Es liest nur `guac-manifest.json`,
die dort gelisteten CSS-Dateien und die Übersetzungen server-seitig ein und
fügt deren Inhalt in die virtuellen Sammel-Antworten `/app.css` bzw. den
Übersetzungs-Endpunkt ein; eine relative `url("../img/...")` darin zeigt beim
Client auf `/img/...`, was 404 liefert (belegt: `curl https://remote.example.com/img/emblem.svg`
→ 404, ebenso `/skins/lcars/img/emblem.svg` und weitere Kandidatenpfade).
Das Emblem wird deshalb weiterhin per absoluter URL geladen, jetzt aber auf die
Guacamole-spezifische Fassung mit Bildschirm-Symbol:
`https://brand.example.com/v1.9.0/assets/emblem--guacamole.svg`.

Dieselbe Einschränkung gilt für das Hintergrundfoto. Die unveränderte
Keycloak-Datei liegt zusätzlich als `assets/hintergrund.jpg` im Markenpaket und
wird im Guacamole-CSS ausschließlich über diese absolute Adresse verwendet:
`https://brand.example.com/v1.9.0/assets/hintergrund.jpg`. Relative Bildadressen
gehören ausdrücklich nicht in die Erweiterung. Guacamole hängt damit für
Schriften, Emblem und Foto von `brand.example.com` ab — anders als Gitea und
Keycloak, wo die Bilddateien lokal ausgeliefert werden.

## Anmeldung und Bewegung

Die frühere schwebende Guacamole-Beschriftung wurde bewusst durch die feste
Homelab-Form ersetzt. `.field-header` steht statisch, klein, gesperrt und in
Versalien über dem Feld. Die Regeln nennen `.labeled-field.empty` und
`.labeled-field:not(.empty)` ausdrücklich; beide Zustände belegen denselben
Platz. `:focus-within` färbt nur die Beschriftung gold, ohne sie zu verschieben.
Das deckende Feld bleibt deshalb in leerem, gefülltem und fokussiertem Zustand
erhalten und kann die Beschriftung nicht mehr überdecken.

Der von der SSO-Erweiterung außerhalb des Dialogs eingehängte Block `Sign in
with: OPENID` wird als zweite Grid-Zeile unmittelbar unter der Karte angeordnet.
Er verwendet dieselbe dunkle Fläche, Goldkante, Typografie und Schaltflächenform
und sitzt nicht mehr ungestaltet in der linken unteren Fensterecke.

Das Foto liegt als eigene Ebene unter einer gleichmäßigen schwarzen Abdunklung.
Es fährt in 90 Sekunden von 100 auf 102,5 Prozent; sehr breite Ansichten ankern
wie bei Keycloak bei `center 58%`. Drei Schienenblöcke pulsen in 9,73, 11,89 und
13,03 Sekunden. Zwei Lichtfelder und ein Abtastbalken laufen in der oberen,
siebenfach segmentierten Leiste mit 6,73, 8,41 und 11,17 Sekunden. Bei
`prefers-reduced-motion: reduce` stoppen Zoom, Schienenpulse, Lichtfelder,
Abtastbalken sowie alle übrigen Animationen und Übergänge; die Segmentierung
bleibt als ruhige statische Leiste stehen.

Die Karten- und SSO-Fläche ist ohne `backdrop-filter` zu 96 Prozent deckend.
Mit Unterstützung verwendet sie 84 Prozent Deckung plus 14 px Unschärfe. Selbst
im rechnerischen Worst Case eines weißen Fotopixels hinter der 58-prozentigen
Seitenabdunklung bleiben normaler Text und die festen Feldbeschriftungen deutlich
über WCAG AA: `#dfe4f2` erreicht auf der rechnerisch hellsten Glasfläche
13,38:1, Gold 8,08:1 und normaler Text auf dem deckenden Fallback 14,86:1.
Eingabefelder sind weiterhin vollständig deckend.

## Bauen

Im Integrationsverzeichnis ausführen:

```text
node build-extension.mjs
```

Der Erzeuger verwendet nur Node-Bordmittel: `node:zlib` für Raw Deflate sowie
selbst geschriebene ZIP-Header und CRC32. Er packt exakt diese drei Einträge:

```text
guac-manifest.json
skins/lcars/css/lcars.css
translations/en.json
```

Die Ausgabe ist `guacamole-lcars-branding.jar`. Das Skript muss nach jeder
Änderung an Manifest, CSS oder Übersetzung erneut laufen; ohne Quelländerung
muss es für die Ausrollung nicht noch einmal ausgeführt werden.

Für eine reine Prüfkopie kann optional ein anderer Ausgabepfad übergeben werden:

```text
node build-extension.mjs C:\Temp\guacamole-lcars-branding.jar
```

## Ausrollung mit dem vorhandenen Mount

Der Bind-Mount existiert bereits. Es ist keine Änderung am Job oder Stack nötig:

```text
/srv/guacamole/previous-branding/guacamole-previous-branding.jar
    -> /opt/guacamole/extensions/…
```

Für den unveränderten Datei-Mount den Inhalt der Host-Datei durch das neue Archiv
ersetzen; der historische Quellname `guacamole-previous-branding.jar` darf dabei
bleiben. Der interne Manifestname ist trotzdem `lcars-branding`. Wird tatsächlich
das gesamte Verzeichnis nach `/opt/guacamole/extensions/` gemountet, kann
`guacamole-lcars-branding.jar` stattdessen daneben gelegt werden. In diesem Fall
die alte vorherige JAR aus dem gemounteten Erweiterungsverzeichnis entfernen oder
außerhalb ablegen, damit nicht beide Stylesheets gleichzeitig geladen werden.

Guacamole liest Erweiterungen nur beim Start. Nach dem Ersetzen beziehungsweise
Umlegen der JAR ist deshalb ein Guacamole-Neustart erforderlich. Anschließend den
Browser-Cache leeren und kontrollieren, dass nur `lcars.css` geladen wird.

## ZU PRÜFEN am laufenden Guacamole

1. Browser-Titel und sichtbarer App-Name: `APP.NAME` muss als
   `Homelab Remote Access` erscheinen.
2. Reihenfolge der Core- und Erweiterungsstylesheets; `lcars.css` muss nach den
   Guacamole-Regeln wirksam sein.
3. Login, Fortsetzungs-/MFA-Dialog und Fehlermeldung bei schmalem sowie breitem
   Viewport; besonders Elbow-Padding sowie feste Feldbeschriftungen in leerem,
   gefülltem und fokussiertem Zustand.
4. Eine einzelne Verbindung, Gruppe, zuletzt verwendete Verbindung und
   Einstellungs-Verbindung auf Farbe, Fokus und anklickbare Fläche prüfen.
5. Geteilte Remote-Sitzung: Nur die `.client-tile-header` darf Homelab-Stil tragen,
   das Remote-Bild darunter muss unverändert bleiben.
6. Menü, Dialog, Benachrichtigung, Dateiübertragung und Gefahr-Schaltfläche samt
   Tastaturfokus und Kontrast prüfen.
7. `Sign in with: OPENID` muss direkt unter der Karte stehen; Fokus, Umbruch und
   Bedienziel bei schmalem Viewport prüfen.
8. Fotoausschnitt, 90-Sekunden-Zoom, drei ungleiche Schienenpulse, drei
   Sequenzrhythmen und den vollständig ruhigen Reduce-Modus kontrollieren.
9. Netzwerkliste auf die beiden WOFF2-Dateien,
   `emblem--guacamole.svg` und `hintergrund.jpg` von `brand.example.com`
   sowie auf CORS-, CSP-, 404- oder Cachefehler kontrollieren.

## Rückweg

Bei einem Datei-Mount die gesicherte `guacamole-previous-branding.jar` zurückkopieren
oder die Homelab-JAR durch die vorherige vorherige JAR ersetzen. Bei einem
Verzeichnis-Mount `guacamole-lcars-branding.jar` entfernen und gegebenenfalls
die alte JAR zurücklegen. Danach Guacamole neu starten und den Browser-Cache
leeren. Ohne Neustart bleibt die beim vorherigen Start geladene Erweiterung aktiv.
