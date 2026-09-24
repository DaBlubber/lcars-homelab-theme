# Jellyfin: Homelab LCARS Familie

Paketversion **1.11.0**. `jellyfin.css` gestaltet ausschließlich den Jellyfin-
**Webclient** in der warmen Familienvariante. Native TV-Clients und native Handy-/
Tablet-Apps laden Jellyfins `CustomCss` nicht und werden dadurch nicht verändert.
Ein Client, der lediglich den gehosteten Webclient in einer WebView anzeigt, kann
die Regeln dagegen erben.

Die Übersicht verbindet eine Netflix-artige Struktur mit klarer Star-Trek-
Handschrift: große, dichte Medienkacheln und bildgetragene Reihen werden von
Kopfzeile, Abschnittsregistern, Endkappen und einseitigen Kartenecken gefasst. Die
früher angeschnittenen Viewport-Schienen sind entfernt; sie nahmen den Postern zwar
keine Fläche, wirkten am Bildrand aber wie Darstellungsfehler. Exo 2, JetBrains
Mono, Homelab-Palette und Emblem bilden den Markenanker.

Poster, Vorschaubilder und Backdrops behalten ihre Farben. Das Stylesheet setzt
weder `filter` noch eine geänderte Bilddeckkraft oder einen Mischmodus. Nur hinter
eingeblendeten Kartentiteln liegt am unteren Bildrand ein neutraler dunkler Verlauf
für die Lesbarkeit.

## Was reines CSS leistet — und was nicht

Auf Basis der gemessenen Klassen setzt das Stylesheet Folgendes um:

- eine Stufe-A-Anmeldung mit dem gemeinsamen, flächig abgedunkelten Weltraumfoto,
  90-Sekunden-Zoom von 100 auf 102,5 Prozent, vollständig innerhalb der Karte
  liegender LCARS-Schiene, drei ungleichen Pulstakten und dreiteiliger Sequenz;
- das Homelab-Jellyfin-Emblem statt des gehashten Jellyfin-Banners sowie Gold als
  Primäraktion und Homelab-Zustände für sämtliche Login-Schaltflächen, Checkbox,
  Eingabefelder, Feldbeschriftungen und Ladeanzeige;
- Quick Connect und Kennworthilfe als eigene dunkle, kontraststarke Zeilen in
  Kartenbreite unter dem Formular, weil Jellyfin sie außerhalb der Karte ausgibt;
- größere Überlaufkarten und kleinere Zwischenräume, ohne Jellyfins responsive
  Rasterlogik für normale Bibliothekskarten zu ersetzen;
- auf knapp 0,75 rem reduzierte Seitenränder an den bestätigten
  `.padded-left`-/`.padded-right`-Trägern;
- eine Kopfzeile mit segmentierter Blockleiste und Endkappe, jedoch keine
  abgeschnittenen festen Farbstreifen mehr an `.mainAnimatedPage`;
- anklickbare und statische Abschnittstitel identisch als gesperrte Versalien mit
  vorangestelltem Farbblock; nur die anklickbare Variante trägt das per CSS-Zähler
  erzeugte Mono-Register `REGISTER // 01`, weil es dort eine Aktion kennzeichnet;
- Titel und dunklen unteren Verlauf erst bei Zeiger- oder Tastaturfokus auf dem
  Desktop; auf Mobilgeräten bleiben die Titel immer sichtbar;
- Vergrößerung ausschließlich per `transform: scale(1.075)`: Nachbarkarten werden
  überlagert, aber nicht verschoben und das Raster bricht nicht um;
- denselben hervorgehobenen Zustand über `.show-focus:focus` auf `.layout-tv`,
  außerdem mindestens 58 × 58 px große TV-Schaltflächen;
- eine transparente beziehungsweise flach warm hinterlegte `.skinHeader` mit den
  vorhandenen `.headroom--pinned`-/`.headroom--unpinned`-Zuständen;
- einseitige LCARS-Kartenecken sowie die Homelab-Zustände Hover-Leuchtkante,
  Druckblitz und Fokusrahmen;
- flächige Statusfarben: Grün für Wiedergabefortschritt, Gold für allgemeinen
  Fortschritt und Transcoding, Rot für Aufnahmen/Fehler und Blau für Information;
  Karten verwenden dabei `.itemProgressBar` als dunkle Spur und ausschließlich
  deren `.innerProgressBar` als grüne Füllung;
- Abschaltung aller Animationen und Übergänge einschließlich Kartenvergrößerung,
  Hintergrundfahrt, Schienenpulsen und Sequenz bei `prefers-reduced-motion: reduce`.

Ein echter Netflix-Heldbanner mit großem aktuellem Titelbild und Abspielknopf
erfordert andere DOM-Struktur und Logik. `branding.xml` nimmt nur CSS auf; deshalb
gibt es bewusst weder JavaScript noch DOM-Umbau oder einen vorgetäuschten Banner.

Der Abspieler ist bewusst zurückhaltender als Übersicht und Detailseite. Während
eines Films sollen weder LCARS-Leuchtkanten noch Druckanimationen vom Bild
ablenken. Interaktionsglühen ist deshalb auf Kopfzeile, Drawer, Dialoge, Details
und Formulare begrenzt. Der normale Fokusrahmen bleibt aus Gründen der
Bedienbarkeit erhalten.

Für sichtbare Rahmen ist das Familienbraun auf `#98765a` angehoben. Es erreicht auf
den verwendeten Panel-/Eingabeflächen mindestens 3,21:1 und bleibt damit auch auf
großen Bildschirmen belastbarer als die feinere allgemeine Tokenlinie `#765c47`.
Auf der Anmeldung erreicht selbst die Glasfläche über einem zuvor zu 58 Prozent
abgedunkelten weißen Bildpunkt 13,08:1 für normalen und 8,88:1 für gedämpften Text.
Der Goldknopf mit dunkler Schrift erreicht 9,06:1, sekundäre Knöpfe 10,71:1; ihre
helle Goldkante und die Checkbox-Kante heben sich mit 6,35:1 von der Fläche ab.

## Einbindung

Im gemessenen Jellyfin liegt die Einstellung in:

```text
/srv/jellyfin/config/branding.xml
```

Den bisherigen Inhalt des `CustomCss`-Elements vollständig ersetzen. Die alte
Zeile mit `cdn.jsdelivr.net` wird **nicht** zusätzlich behalten:

```xml
<CustomCss>@import url('https://cdn.jsdelivr.net/gh/CTalvio/Ultrachromic/presets/monochromic_preset.css');</CustomCss>
```

Sie wird ersetzt durch:

```xml
<CustomCss>@import url('https://brand.example.com/v1.11.0/integrations/jellyfin/jellyfin.css');</CustomCss>
```

Damit entfällt Ultrachromic und zugleich die fremde CDN-Laufzeitabhängigkeit. Das
Stylesheet selbst enthält kein `@import`; Exo 2, JetBrains Mono, Hintergrundfoto
und Jellyfin-Emblem kommen über absolute Adressen aus demselben unveränderlichen
`v1.11.0`-Pfad. Relative Bildpfade sind ausdrücklich ausgeschlossen, weil das per
`branding.xml` importierte CSS sonst gegen den Jellyfin-Host auflösen würde.

Nach der Änderung Jellyfin neu starten und den Webclient mit geleertem Cache neu
laden. In den Browser-Entwicklerwerkzeugen müssen `jellyfin.css` und beide WOFF2-
Dateien erfolgreich von `brand.example.com` geladen werden.

## Gemessene Grundlage

Die Regeln wurden gegen die lokal bereitgestellten `main.css`, `vendor.css`, die
Liste mit 2575 echten Klassennamen und `anmeldeseite-klassen.md` aus dem laufenden
Browser abgeglichen. Sicher bestätigt sind unter anderem `.backgroundContainer`,
`.standalonePage`, `.manualLoginForm`, `.visualLoginForm`, `.pageTitleWithLogo`,
`.button-submit`, die Quick-/Kennwort-/Abbruchaktionen, Checkbox- und Feldklassen,
`.mainAnimatedPage`, Karten und Kartentypen, `.cardBox`, `.cardImageContainer`,
`.cardOverlayContainer`, `.cardText`, `.cardFooter`, `.itemsContainer`,
`.emby-scroller`, die Abschnittstitel, `.skinHeader`, alle drei Headroom-Zustände,
Navigation, Details, Schaltflächen, Fortschritts- und Zustandsklassen sowie
`.layout-desktop`, `.layout-mobile`, `.layout-tv` und `.show-focus`.

Die Überschreibungen folgen den vorhandenen Mechanismen: Jellyfin skaliert den
`.cardBox` bereits beim Fokus, blendet Overlays über `.card-hoverable` ein, setzt
`.skinHeader` auf Desktop/Mobil bereits `position: fixed` und bewegt Headroom per
`transform`. Das Homelab-CSS ersetzt diese Logik nicht, sondern kalibriert sie.

## ZU PRÜFEN am laufenden Webclient

1. An einer Film-, Serien-, Episoden- und Sammlungsreihe prüfen, ob `.cardFooter`
   überall innerhalb von `.cardBox` liegt und der absolute Footer am unteren
   Bildrand landet. Bei einer abweichenden Variante bitte deren `outerHTML`
   erfassen.
2. Anfangszustand und Scrollfolge der Kopfzeile protokollieren: Klassen auf
   `.skinHeader` oben, beim Abwärtsscrollen und beim Aufwärtsscrollen. Zu klären ist
   vor allem, ob `headroom--pinned` bereits ganz oben gesetzt wird oder erst nach
   dem ersten Scrollen.
3. Auf einem echten Desktop kontrollieren, ob skalierte erste/letzte Karten an
   `.hiddenScrollX` oder einem unbekannten Elterncontainer abgeschnitten werden.
   Falls ja: Klasse und berechnetes `overflow` dieses Elternteils notieren.
4. Auf dem TV den tatsächlichen Fokus-Knoten einer Karte erfassen: erwartet ist
   `.card.show-focus:focus`. Fokusrahmen, 1,075-fache Skalierung, Scrollen zur
   Auswahl und 58-px-Bedienziele mit der Fernbedienung prüfen.
5. Auf Mobilgeräten kontrollieren, ob alle relevanten Karten einen `.cardFooter`
   besitzen und die stets sichtbaren Titel nicht Statusabzeichen oder
   Fortschrittsleisten überdecken.
6. Beide Abschnittsvarianten bei langen Titeln prüfen: `.sectionTitle-cards` und
   `.sectionTitleTextButton` müssen denselben Farbblock, dieselben Versalien und
   dieselbe Grundlinie tragen. Nur anklickbare Container zeigen den fortlaufenden
   CSS-Zähler; eine echte Medienanzahl kann CSS nicht aus dem DOM berechnen.
7. Anmeldung bei etwa 390, 1366, 1920 und 3840 px sowie mit manueller Anmeldung,
   Quick Connect, falschen Zugangsdaten und laufendem Spinner prüfen: Foto und
   Abdunklung müssen flächig, Emblem und Goldzustände sichtbar und die gesamte
   Schiene innerhalb der Karte unbeschnitten sein; Quick Connect und Kennworthilfe
   müssen als kartenbreite Zeilen darunter sitzen. Außerdem kontrollieren, ob die
   aktive Jellyfin-Fassung `:has()` in allen eingesetzten WebViews unterstützt.
8. Startseite, Bibliothek, Suche und Detailseite bei etwa 390, 1366, 1920 und
   3840 px Breite prüfen: Zahl der Karten pro Reihe, Lesbarkeit der Titel und
   Überlagerung durch Scrollschaltflächen festhalten.
9. Fortschrittsanzeigen für Wiedergabe, Transcoding und Aufnahme sowie
    `.mediaSourceIndicator`, `.programAttributeIndicator` und `.timerIndicator`
    gegen ihre tatsächliche Semantik prüfen; unter den Karten muss
    `.innerProgressBar` flächig grün und `.itemProgressBar` dunkel bleiben.
10. Per Computed Styles an Poster, Backdrop und Vorschau bestätigen, dass aus
    `jellyfin.css` weder `filter`, Bild-`opacity`, `mix-blend-mode` noch eine farbige
    Medienlage stammt. Der schwarze Titelverlauf am unteren Rand ist beabsichtigt.
11. Netzwerkliste und Konsole auf CORS-, CSP-, 404- und Cachefehler der CSS- und
    Schriftdateien prüfen. Diese lokale Dateiarbeit konnte keinen laufenden Client
    und keine Ressourcen über das Netz aufrufen.

## Rückweg

Das `CustomCss`-Element leeren beziehungsweise auf `<CustomCss />` setzen und
Jellyfin neu starten. Danach den Webclient-Cache leeren. Jellyfin verwendet wieder
seine eingebauten Webclient-Stile; es müssen keine Installationsdateien repariert
werden. Die frühere jsDelivr-Zeile ist im Versionsverlauf dokumentiert, wird beim
normalen Rückbau aber bewusst nicht wieder als externe Abhängigkeit aktiviert.
