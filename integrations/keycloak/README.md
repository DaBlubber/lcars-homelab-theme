# Keycloak: LCARS-Homelab

Das Login-Theme `lcars-homelab` ist fuer den gemessenen Stand Keycloak 26.7.3
und dessen Elterntheme `keycloak.v2` gebaut. Dieses liefert PatternFly v5. Die
Messgrundlage liegt ausserhalb des Repos unter `keycloak-referenz\`:

- `patternfly.min.css` und `patternfly-addons.css` sind die wirklich
  ausgelieferten Stylesheets;
- `variablen-global.txt` und `variablen-komponenten.txt` enthalten die daraus
  extrahierten Custom Properties;
- `login-seite.html` belegt Klassen, Verschachtelung und Lade-Reihenfolge.

## Aufbau

Das Theme ueberschreibt bewusst keine Freemarker-Vorlage. Benutzername,
Zugangscode, Passwort-Reset, Sitzungsablauf, Sperre, Alerts und zukuenftige
Standardformulare werden dadurch vom Elterntheme erzeugt und behalten denselben
PatternFly-v5-DOM. Die frueheren eigenen `login.ftl` und `header.ftl` wurden
entfernt, weil sie nur einen Teil der Authentifizierungsablaeufe abdeckten und
parallel zum realen PatternFly-Markup eine zweite Struktur aufbauten.

`login/resources/css/styles.css` arbeitet in drei Schichten:

1. globale `--pf-v5-global--*`-Tokens fuer dunkle Flaechen, helle Texte, Gold als
   Primaerfarbe, Links, Status, Linien, Schriften und Bewegungsdauer;
2. belegte Komponentenvariablen fuer Login, Brand, Formularfelder, Buttons und
   Alerts;
3. eigene Regeln nur fuer Stufe-A-Elbow, Blockleisten, Emblem-Endkappe,
   Versalsperrung, Foto-/Abdunklungsebenen sowie Interaktions-Glow und
   Druckblitz.

Es gibt keine PatternFly-v4-, `.card-pf`- oder `.login-pf-page`-Selektoren und
kein `!important`.

## Ressourcen und Betrieb

Exo 2 und JetBrains Mono kommen ausschliesslich aus den unveraenderlichen
Adressen unter `https://brand.example.com/v1.8.2/fonts/`. Das Emblem liegt lokal
im Theme. `hintergrund.jpg` ist das aktive Weltraumfoto; die gezeichnete
LCARS-Fassung `hintergrund.svg` bleibt als Alternative daneben liegen. Eine
gleichmaessige schwarze Ebene dunkelt das Foto unter dem Inhalt ab. Das Motiv
faehrt per reinem CSS in 90 Sekunden von 100 auf 102,5 Prozent heran und bleibt
dabei stets flaechendeckend. Ab einem Seitenverhaeltnis von 2:1 liegt der
Bildanker bei `center 58%`, damit mehr vom unteren Nebel sichtbar bleibt;
Hochformate bleiben mittig. Bei `prefers-reduced-motion: reduce` entfallen
Animation und Skalierung vollstaendig. Fehlt das aktive Bild, bleiben der
schwarze Grund und die Login-Konsole lesbar.

Die Bildquelle hat 1536 x 1024 Pixel (3:2). Auf sehr breiten Bildschirmen muss
`cover` deshalb oben und unten deutlich beschneiden. Eine groessere oder breitere
Quelle wuerde dort mehr Motiv zeigen; das ist eine Grenze der gelieferten
Vorlage, nicht der CSS-Flaechenabdeckung.

Die Hauptkarte hat keine erzwungene Mindesthoehe mehr. Ihre linke Schiene und
Fussleiste folgen der natuerlichen Kartenhoehe. Ohne `backdrop-filter` verwendet
sie eine zu 96 Prozent deckende Flaeche; mit Unterstuetzung eine zu 72 Prozent
deckende Flaeche und 14 px Unterschaerfe. Violetter, blauer und grauer Rail-Block
leuchten in absichtlich ungleichen 9,73-, 11,89- und 13,03-Sekunden-Takten
dezent auf. Kopf- und Fussgold bleiben als ruhiger Rahmen statisch.

Die Fussleiste wird ohne zusaetzliches HTML direkt in ihrem vorhandenen
`::after`-Pseudoelement segmentiert. Zwei weiche Lichtfelder durchlaufen die
sieben Bloecke in 6,73 und 8,41 Sekunden; ein schmaler Abtastbalken benoetigt
11,17 Sekunden. Damit liegen alle drei Rhythmen neben den Takten der linken
Schiene. Im Reduce-Modus entfallen Bilder und Animationen der Sequenz, sodass
die bisherige durchgehend goldene Ruheflaeche stehen bleibt. Die Kopfleiste wird
nicht animiert und bleibt stabiler Anker fuer Emblem und Realmname.

Ziel im Container:

`/opt/keycloak/themes/lcars-homelab`

Nach einem Austausch muss Keycloak neu gestartet oder sein Theme-Cache sicher
geleert werden. Die Realm-Umschaltung und das Deployment sind nicht Bestandteil
dieses Repos.

## Abnahme und ZU PRUEFEN

Statisch geprueft sind alle verwendeten `--pf-v5-*`-Namen gegen das ausgelieferte
PatternFly-v5-CSS, die Login-Selektoren gegen `login-seite.html`, das Fehlen alter
PatternFly-v4-Klassen sowie die tragenden WCAG-Kontraste. Ein lokaler Chrome-
Headless-Render mit dem gemessenen DOM wurde bei 1440 x 1000 px und im schmalen
Layout kontrolliert; dabei wurde die Position des dritten Rail-Blocks korrigiert.
Die Message-Dateien
bleiben inhaltlich unveraendert; ihre Standard-Keycloak-Schluessel passen zu den
geerbten Templates. `lcarsBrand` bleibt als zusaetzlicher, derzeit nicht vom
Elterntemplate verwendeter Markenschluessel erhalten.

**ZU PRUEFEN nach dem naechsten bewussten Test-Deployment:**

- Benutzername- und Zugangscode-Schritt jeweils auf Desktop und schmalem Mobil;
- falsches Kennwort sowie temporaere und dauerhafte Kontosperre;
- abgelaufene Sitzung und abgelaufene Aktion;
- "Kennwort vergessen", Rueckkehr zur Anmeldung und gegebenenfalls Registrierung;
- Tastatur-Reihenfolge und sichtbarer Fokus in Chrome und Firefox;
- Emblem-Endkappe, Elbow-Segmentpositionen und lange Realm-/Fehlermeldungen;
- das vom Elterntemplate erwartete `resources/img/favicon.ico` wird mit
  `node integrations/keycloak/build-favicon.mjs` aus der lokalen Schluesselfassung
  erzeugt; der Kontrolllauf erzeugte ein 2258-Byte-ICO mit 16/32/48 px im
  Temp-Verzeichnis, die Sandbox verweigerte nur das Schreiben in den Arbeitsbaum;
  den Builder deshalb vor der Auslieferung einmal in einer normalen lokalen
  Konsole ausfuehren und nach jedem Emblemwechsel wiederholen;
- Fotoausschnitt, Glaskarte und ruhige 90-Sekunden-Bewegung auf den realen
  Desktop- und Mobilformaten; dabei auch natuerliche Kartenhoehe, Elbow-Geometrie,
  ungleiche Rail-/Sequenz-Takte und `prefers-reduced-motion: reduce`
  kontrollieren. Der statische Worst-Case gegen einen weissen Fotopixel erreicht
  fuer das Label 4,74:1 und fuer normalen Text 11,04:1.

Rueckweg: im Realm das vorherige Login-Theme auswaehlen; danach Keycloak neu
starten, falls der Produktions-Theme-Cache noch die vorige Fassung ausliefert.
