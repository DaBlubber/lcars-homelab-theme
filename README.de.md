# LCARS-Homelab

Version **1.14.0** ist das lokale Haus-Erscheinungsbild der Homelab-Marke für
Oberflächen außerhalb der eigenen Produktdesigns von Tempest und Hestia. Die
Gestaltung übernimmt die verbindlichen Maße und Farbrollen aus der freigegebenen
Stilrichtung A; Richtung B ist ausschließlich die technische Rückfallform.

Die lokale Referenz lädt nichts aus dem Internet. Die zur externen Einbindung
vorgesehenen Jenkins-, Jellyfin-, Nextcloud- und Guacamole-Ressourcen verweisen
zur Laufzeit ausschließlich
auf versionierte Homelab-Ressourcen unter `brand.example.com`. Das Paket enthält
weder Deployment- noch Infrastrukturänderungen.

## Inhalt

- `css/tokens.css`: Farben, Flächen, Abstände, Geometrie, Typografie, Bewegung und
  die warme Familien-Tokenvariante.
- `css/components.css`: Komponenten für `.lcars-a` und `.lcars-b`.
- `css/brand.css`: gemeinsamer Einstiegspunkt per `@import`.
- `assets/`: das Emblem als Basisfassung sowie Gitea-, Guacamole-,
  Keycloak-, Jenkins-, Jellyfin-, Nextcloud- und Paperless-Fassungen. Der Hintergrund der Integrationen ist ein
  CSS-Verlauf in `--rl-background-image` und laesst sich dort durch ein eigenes Bild ersetzen. Das Logo enthält keinen Google-Font-Import;
  Jellyfin- und Jenkins-Fassung sind in ihren jeweiligen Integrationsstylesheets
  verdrahtet.
- `fonts/`: zwei enthaltene variable WOFF2-Schriften samt Auslieferungshinweisen.
- `reference/index.html`: vollständige Offline-Abnahmeseite.
- `errors/`: vollständig autarke deutsche Fehlerseiten 404, 500, 502, 503 und 504
  mit Inline-CSS und Inline-Emblem, ohne JavaScript oder Nachbarressourcen.
- `integrations/keycloak/lcars-homelab/login/`: Login-Theme mit `parent=keycloak.v2`.
- `integrations/gitea/`: vollständiges Variablen-Theme und updatefeste
  Logo-/Favicon-Custom-Assets für Gitea 1.27.2 samt reproduzierbarem Builder.
- `integrations/jenkins/`: variablengetriebener Neubau für Jenkins 2.568.3 samt
  Freigabestatus und Messliste für die angemeldeten Ansichten.
- `integrations/jellyfin/`: warme Familienvariante für den Jellyfin-Webclient samt
  Austausch-, Mess- und Rückbauhinweisen.
- `integrations/nextcloud/`: variablengetriebene warme Familienvariante für
  Nextcloud 34.0.3 über die offizielle Custom-CSS-App samt Rückweg.
- `integrations/guacamole/`: vollständige Guacamole-1.6.8-Erweiterung mit
  Homelab-CSS, Übersetzung, bibliotheksfreiem JAR-Erzeuger und Mount-Hinweisen.
- `integrations/paperless/`: gemessene Markenoptionen, Medienpfad und Rückweg für
  Paperless-ngx 3.0.4; eigenes CSS wird von Paperless nicht unterstützt.
- `integrations/windows/`: Windows-11-Theme, zwei Desktopmotive in drei
  Auflösungen und ein dezentes, selbst erzeugtes Klangschema.
- `integrations/android/`: Hintergrundbilder für Start- und Sperrbildschirm sowie
  zehn adaptive Haus-Dienstsymbole als ehrliche, nicht installierbare Sammlung.

## CSS verwenden

```html
<link rel="stylesheet" href="/lcars-homelab-theme/css/brand.css">

<main class="lcars-a">
  <!-- volle LCARS-Brücke -->
</main>
```

Für die Rückfallform wird `.lcars-b` verwendet. Die Familienvariante ergänzt die
gleiche Wurzel lediglich um `.lcars-family`, zum Beispiel:

```html
<main class="lcars-b lcars-family">
  <!-- warme, luftigere Ausprägung derselben Komponenten -->
</main>
```

Die Komponentenklassen und ihre Zustandsklassen sind vollständig in
`reference/index.html` demonstriert. Echte Interaktionszustände funktionieren über
`:hover`, `:focus-visible`, `:active`, `:disabled` und `aria-invalid`; die `is-*`-
Klassen dienen nur dazu, sie auf der Abnahmeseite gleichzeitig sichtbar zu machen.
Die 140-ms-Reaktion nutzt die gemeinsamen Bewegungs-Tokens. Ruheflächen bleiben
flach; nur Hover, Fokus und Druck erhalten Helligkeit und eine Leuchtkante in der
jeweiligen Aktionsfarbe. Der doppelte, abgesetzte Fokusrahmen ist zusätzlich zur
Farbänderung sichtbar. Deaktivierte Elemente reagieren nicht.

## Bewegung, Laden und bewusstes Blinken

`.lcars-loader--large` ist für ganze Seiten vorgesehen, `.lcars-loader--small` für
Bereiche und Wartezustände. Beide kombinieren asynchron laufende Blocksequenzen mit
einem wandernden Abtastbalken und benötigen kein JavaScript.

Blinken wird nie implizit verteilt. `.lcars-blink--alarm` pulsiert eine kleine rote
Statusfläche langsam. `.lcars-blink--ambient` bleibt für dekorative LCARS-Blöcke
standardmäßig statisch und läuft erst zusammen mit `.is-active`. Fließtext,
Tabellenzeilen und Formulare dürfen diese Klassen nicht erhalten. Alle Rhythmen
bleiben deutlich unter 3 Hz. Bei `prefers-reduced-motion: reduce` stoppen sämtliche
Animationen und Übergänge; Loader, Alarm und aktive Umgebungsblöcke bleiben durch
statische Farb- beziehungsweise Rahmenmuster erkennbar.

## Marke

`.rl-marke` verbindet den unveränderten Emblemrahmen mit der Wortmarke `Homelab`
und einer optionalen Kontextzeile. Die Basisfassung trägt das Treppenband;
App-Fassungen wechseln nur den Inhalt im blauen Feld. Die Größen sind fest:
`--symbol-16` (16 px, nur Symbol),
`--klein` (24 px, Kopfleiste), `--mittel` (32 px, Karte) und `--gross` (48 px,
Anmeldung oder Fehlerseite). Unter 24 px entfallen Wortmarke und Kontextzeile; das
Emblem wurde auf der Referenzseite bei 16, 24 und 32 px geprüft.

```html
<span class="rl-marke rl-marke--mittel">
  <img class="rl-marke__symbol" src="/assets/emblem.svg" alt="">
  <span class="rl-marke__text">
    <span class="rl-marke__name">Homelab</span>
    <span class="rl-marke__kontext">Gitea</span>
  </span>
</span>
```

In einer Kopfleiste kommt zusätzlich `.lcars-header--marke` an den
`.lcars-header`. Stufe A zieht das Emblem in die Elbow-Endkappe; Stufe B verbindet
es bündig mit der Goldkante. `.lcars-family` nutzt die größere, ruhigere Ausgabe.

## Favicons und App-Symbole

`assets/favicon/favicon.svg` ist eine unveränderte Kopie der verbindlichen
Emblemquelle. `site.webmanifest` und der lokale, von Drittbibliotheken unabhängige
Builder `build-icons.mjs` liegen daneben. Der Builder erzeugt diese Dateien:

- `favicon-16x16.png`, `favicon-32x32.png`, `favicon-48x48.png`;
- `marke-check-24x24.png` ausschließlich als dokumentierte Größenprüfung;
- `apple-touch-icon.png` (180 px);
- `android-chrome-192x192.png` und `android-chrome-512x512.png`;
- `favicon.ico` mit 16-, 32- und 48-px-PNG-Bildern.

Die Ausgaben werden in einer lokal schreibfähigen Konsole reproduzierbar erzeugt mit:

```powershell
cd lcars-homelab-theme
node assets\favicon\build-icons.mjs
```

Der Renderer arbeitet mit 4-fachem, bei den drei kleinen Größen mit 8-fachem
Supersampling. Ein Kontrolllauf in einem beschreibbaren Temp-Verzeichnis hat alle
sechs PNG-Größen und den ICO-Container erfolgreich erzeugt.

Einbindung je Ziel:

- **Web-/Familien-Apps:** SVG, 32-px-PNG, Apple-Icon und Manifest im `<head>`
  verlinken; für PWA-Installationen verwendet das Manifest 192 und 512 px.
- **Gitea:** `integrations/gitea/build-gitea-assets.mjs` erzeugt die fünf
  gleichnamigen Custom-Assets für `/data/gitea/public/assets/img/`. Das ersetzt
  Logo und Favicons ohne Template- oder Binary-Eingriff und bleibt updatefest.
- **Jenkins:** Das Stufe-B-Stylesheet ersetzt das sichtbare Kopfzeilenlogo über
  `#jenkins-head-icon`, ändert aber kein Favicon. Dessen späterer Austausch wäre
  eine getrennte Appearance-Anpassung und darf nicht das WAR überschreiben.
- **Keycloak:** `node integrations/keycloak/build-favicon.mjs` erzeugt das vom
  Elterntemplate erwartete `resources/img/favicon.ico` aus der Schlüsselfassung.
  Das sichtbare Emblem bleibt als SVG im selben Bildverzeichnis.
- **Paperless:** `PAPERLESS_APP_LOGO` verweist auf die Paperless-Fassung im
  gemounteten Medienverzeichnis; Paperless bietet keinen eigenen CSS-Einstieg.
- **Nextcloud:** Die normale Theming-App erhält die Nextcloud-Fassung als Logo;
  das Custom-CSS enthält keine zweite Logoquelle.

Für eigene HTML-Oberflächen ist die vollständige Einbindung:

```html
<link rel="icon" href="/assets/favicon/favicon.svg" type="image/svg+xml">
<link rel="icon" href="/assets/favicon/favicon-32x32.png" sizes="32x32" type="image/png">
<link rel="apple-touch-icon" href="/assets/favicon/apple-touch-icon.png">
<link rel="manifest" href="/assets/favicon/site.webmanifest">
```

## Schriftdateien

Das Paket enthält `Exo2-Variable.woff2` für Gewichte 400–800 und
`JetBrainsMono-Variable.woff2` für 400–700. Die variablen `@font-face`-Regeln stehen
in `css/tokens.css`; vollständige System-Fallbacks bleiben vorhanden. Es sind keine
externen Schriftquellen vorgesehen. Details und noch beizulegende Lizenztexte stehen
in `fonts/README.md`.

## Keycloak

Das vollständige Theme-Verzeichnis ist:

`integrations/keycloak/lcars-homelab/`

Für den gemessenen Betrieb ist dieses Verzeichnis später als
`/srv/keycloak/theme/lcars-homelab/` bereitzustellen; im
Keycloak-Container muss es unter `/opt/keycloak/themes/lcars-homelab` sichtbar sein.
Die Realm-Umschaltung auf das Login-Theme `lcars-homelab` ist ausdrücklich nicht
Teil dieses lokalen Pakets.

Das Theme überschreibt keine Freemarker-Vorlage. Auch Benutzername, Zugangscode,
Kennwort-Reset, Ablauf-, Sperr- und Alert-Zustände stammen dadurch vollständig
aus dem Elterntheme `keycloak.v2` und behalten den gemessenen PatternFly-v5-DOM.
`styles.css` biegt dessen globale und komponentenspezifische Custom Properties auf
die Homelab-Rollen um; eigene Regeln sind auf Stufe-A-Elbow, Emblem-Endkappe,
Typografie, Hintergrundebenen und den von PatternFly nicht angebotenen
Interaktions-Glow begrenzt.
Deutsche und englische Begriffe stehen unverändert in den jeweiligen
Messages-Dateien. Messgrundlage, Cache/Rückbau und die noch am laufenden System zu
prüfenden Zustände stehen in `integrations/keycloak/README.md`.

Der Hintergrund-Slot nutzt `resources/img/hintergrund.jpg`: Das Weltraumfoto liegt
unter einer gleichmäßigen schwarzen Abdunklung und fährt in 90 Sekunden sehr
langsam von 100 auf 102,5 Prozent heran. Sehr breite Ansichten verankern es etwas
tiefer, um mehr vom Nebel zu behalten; Hochformate bleiben wegen der beidseitigen
Motive mittig. `prefers-reduced-motion: reduce` zeigt das Bild unbewegt und
unvergrößert. Die gezeichnete Fassung `resources/img/hintergrund.svg` bleibt als
Alternative im Theme liegen.

Die Quelle besitzt 1536 × 1024 Pixel und damit ein Seitenverhältnis von 3:2.
`cover` füllt jedes Fenster zuverlässig, muss bei sehr breiten Bildschirmen aber
oben und unten stark beschneiden. Eine größere beziehungsweise breitere
Bildvorlage würde dort mehr Motiv zeigen; CSS kann fehlende Bildfläche nicht
zurückholen.

Die Hauptkarte folgt ohne erzwungene Mindesthöhe ihrem Inhalt. Ihre Fläche ist
mit `backdrop-filter` eine zu 72 Prozent deckende, 14 px weichgezeichnete
Glasscheibe; nicht unterstützende Browser erhalten eine zu 96 Prozent deckende
Rückfallfläche. Violetter, blauer und grauer Rail-Block leuchten in langsamen,
ungleichen Takten leicht auf. Goldene Kopf- und Fußleiste bleiben als ruhiger
Rahmen stehen; innerhalb der Fußleiste laufen jedoch zwei sehr zurückhaltende,
ungleich getaktete Segmentlichter und ein langsamer Abtastbalken. Ohne Bewegung
ist sie wieder eine durchgehend goldene Fläche. Die Kopfleiste bleibt vollständig
statisch, damit Emblem und Realmname nicht mit dem Formular konkurrieren.

## Gitea

`integrations/gitea/theme-lcars-homelab.css` ist ein reines, updatefestes
Variablen-Theme für den gemessenen Stand Gitea 1.27.2. Es setzt alle 297 Namen des
eingebauten Referenzthemes, einschließlich abgestufter Primär-/Sekundärreihen,
Diffs, Konsole, ANSI- und Syntaxfarben. Gold ist Handlungsfarbe, Königblau bleibt
als Markenrolle sichtbar und Erfolg/Warnung/Fehler folgen den gemeinsamen
Statusfarben.

Zusätzlich erzeugt `integrations/gitea/build-gitea-assets.mjs` aus der
Gitea-Fassung mit Git-Branch-Symbol `logo.svg`, `favicon.svg`, `favicon.png`,
`logo.png` und `apple-touch-icon.png`. Gitea überschreibt diese über
`$GITEA_CUSTOM/public/assets/img/`; das ist derselbe updatefeste Custom-Mechanismus
wie beim Theme und kein Vorlageneingriff.

Der Builder muss vor der ersten Auslieferung einmal laufen; die SVG-Dateien liegen
im Zielverzeichnis bei, die drei PNGs sind reproduzierbare Generatorausgaben.

Die Datei kommt später nach
`$GITEA_CUSTOM/public/assets/css/theme-lcars-homelab.css`; im gemessenen Container
ist das `/data/gitea/public/assets/css/theme-lcars-homelab.css`. Auswahl,
`[ui] THEMES`, `DEFAULT_THEME`, Rückbau und Updatekontrolle stehen in
`integrations/gitea/README.md`. Gitea 1.27.2 bietet im Theme-Variablensatz keine
Schriftvariable; Exo 2 und JetBrains Mono werden deshalb nicht behauptet oder über
instabile Selektoren erzwungen.

## Jenkins

`integrations/jenkins/jenkins.css` ist für Jenkins 2.568.3 anhand der echten
`simple-page.css`, `theme-dark.css` und 98 im angemeldeten Zustand gemessenen
Strukturklassen gebaut. Die live bestätigte Übersetzung der 181 Jenkins-Variablen
bleibt unverändert. Gemessene Selektoren ergänzen Stufe-B-Formensprache: eine
segmentierte Kopfzeile mit Endkappe und Zahnrad-Emblem, Pane-Elbows, gesperrte
Überschriften, Mono-Metadaten, LCARS-Schaltflächen und -Reiter sowie eine statische
Siebensegment-Leiste im ruhigen Footer. Alle Ressourcen kommen absolut aus dem
Pfad `https://brand.example.com/v1.11.0/`.

**Status: lokal gebaut, nicht ausgerollt.** Build-Status bleiben unverändert über
Jenkins' Grün-, Gelb- und Rotvariablen unterscheidbar. Zu prüfen sind insbesondere
schmale Ansichten, Plugin-Oberflächen, Statusicons, Fokusfolge und Überlagerungen.
Selektorliste, vorgesehene URL und Rückbau stehen in
`integrations/jenkins/README.md`.

## Nextcloud

`integrations/nextcloud/nextcloud.css` nutzt die 116 am laufenden Nextcloud 34.0.3
gemessenen Variablen als primären Hebel. Die offizielle App `theming_customcss`
1.21.0 stellt den updatefesten Einstieg bereit; die normale Theming-App trägt
weiter Name, Slogan, Primär- und Hintergrundfarbe, Logo und Hintergrundbild.

Die warme Familienvariante lässt `--color-main-background` und
`--color-main-text` ausdrücklich unangetastet. Modusabhängige Nebenrollen werden
aus den jeweils aktiven Nextcloud-Farben gemischt, sodass jede Person ihre helle,
dunkle oder systemabhängige Einstellung behält. Gold führt Handlungen, Exo 2 und
JetBrains Mono kommen absolut aus `https://brand.example.com/v1.14.0/`, Schrift,
Zeilen und Ziele werden größer und alle vier Zustandsfarben bleiben semantisch
getrennt.

Nur die Gast-/Anmeldeseite kommt Stufe A nahe: Die normale Theming-App liefert
Nextcloud-Emblem und Weltraumfoto. Das CSS enthält keine eigenen Bild-URLs, setzt
`--image-background` genau einmal auf die Gastfläche und dunkelt es mit einer
separaten schwarzen Ebene ab. So bleibt die Anmeldung lesbar, ohne zwei Fotos
oder zwei Logos übereinanderzulegen. Rail und statische Segmentleiste bleiben;
Dateilisten erhalten weder Elbows noch Animation. `occ`-Befehle, Rückweg,
Kontrastwerte und die noch nötige Laufzeitabnahme stehen in
`integrations/nextcloud/README.md`.

## Paperless

Paperless-ngx 3.0.4 läuft über den Nomad-Job
`Nomad-Services/standard/paperless.nomad`. Branding ist dort ausschließlich über
`PAPERLESS_APP_TITLE` und `PAPERLESS_APP_LOGO` möglich; beide Variablen sind
derzeit nicht gesetzt, nur `PAPERLESS_URL` steht im Job. **Eigenes CSS ist nicht
möglich**, weil Paperless dafür keinen Erweiterungspunkt anbietet. Die Integration
bleibt damit bewusst bei „nur Marke“: Titel und Logo.

Das Medienverzeichnis `/srv/paperlessmedia` ist im Container nach
`/usr/src/paperless/media` gemountet. Die Paperless-Emblemfassung wird deshalb als
`/srv/paperlessmedia/logo/emblem--paperless.svg` abgelegt und über
`PAPERLESS_APP_LOGO=/logo/emblem--paperless.svg` referenziert. Gemessene
Grenzen, Job-Hinweis und Rückweg stehen in `integrations/paperless/README.md`.

## Jellyfin

`integrations/jellyfin/jellyfin.css` ist ein warmes Familien-Overlay ausschließlich
für den Jellyfin-Webclient. Es ersetzt den bisherigen Ultrachromic-Import von
jsDelivr durch eine einzige versionierte Homelab-Adresse. Exo 2 und JetBrains Mono
kommen vom selben Host; fremde `@import`-Quellen gibt es nicht.

Die gemessenen Jellyfin-Klassen verbinden Netflix-Struktur und Star-Trek-
Handschrift: größere Medienkarten, Titelverläufe, einheitliche Abschnittsregister,
Transform-Hover auf dem Desktop, sichtbare Titel auf Mobil, Fernbedienungsfokus
auf dem TV und eine segmentierte Headroom-Kopfzeile. Die fehlerhaft angeschnittenen
Viewport-Schienen sind entfernt. Auf Grundlage der zusätzlich im laufenden Browser
gemessenen Klassen besitzt die Anmeldung nun Stufe A: das gemeinsame Weltraumfoto
mit 90-Sekunden-Zoom, eine abgedunkelte Ebene, die vollständig in der
Formularkarte liegende pulsierende Schiene samt LCARS-Sequenz, das Jellyfin-Emblem
und Homelab-Zustände für Felder,
Schaltflächen und Checkbox. Quick Connect und Kennworthilfe schließen als eigene,
kartenbreite Zeilen darunter an. Alle Jellyfin-Bilder und Schriften kommen absolut
aus dem Pfad `https://brand.example.com/v1.11.0/`.

Poster, Vorschaubilder und Backdrops behalten ihre Farben. **ZU PRÜFEN** bleiben
die neuen Anschlusszeilen der Anmeldung, beide Abschnittstitelvarianten, der
Kartenfortschritt sowie einige Laufzeiteigenschaften von Footer, Headroom,
Clipping und TV-Fokus; ein echter Heldbanner ist mit `branding.xml`-CSS nicht
möglich. Der Abspieler bleibt absichtlich ruhig.

Einbindung, vollständige Messliste, Webclient-Grenze und Rückbau stehen in
`integrations/jellyfin/README.md`. Native TV- und Mobil-Apps werden durch
`branding.xml`-Custom-CSS nicht gestaltet.

## Guacamole

`integrations/guacamole/` baut eine eigenständige Erweiterungs-JAR für Guacamole
1.6.8. Sie ersetzt Google Fonts und das bisherige Design durch
LCARS-Homelab: Stufe B im Werkzeugbereich, Stufe-A-nahe Anmeldung, feste
Feldbeschriftungen, gestalterisch angeschlossenes OpenID, das gemeinsame
Weltraumfoto und die langsamen Keycloak-Bewegungsrhythmen. Alle Bilder werden
wegen Guacamoles virtueller `/app.css`-Antwort absolut aus dem v1.9.0-Pfad von
`brand.example.com` geladen. Das übertragene Remote-Bild bleibt ungestaltet; der
vorhandene Bind-Mount kann unverändert weiterverwendet werden.

Bau, Zielpfad, Neustart, Rückweg und Laufzeitprüfungen stehen in der dortigen
`README.md`. Bildschirm-Emblem und Hintergrund liegen im zentralen `assets/`-
Verzeichnis und nicht in der Erweiterung. Das Archiv muss nach Änderungen an
Manifest, CSS oder Übersetzung mit
`node build-extension.mjs` neu erzeugt werden.

## Windows 11

`integrations/windows/` enthält `LCARS-Homelab.theme` und Generatoren für zwei
flächige Desktopmotive in 1920x1080, 2560x1440 und 3840x2160 sowie fünf leise
PCM-Systemklänge. Die Binärdateien entstehen ohne Fremdbibliotheken:

```powershell
cd lcars-homelab-theme\integrations\windows
node .\build-wallpapers.mjs
node .\build-sounds.mjs
.\installieren.ps1
```

Danach kopiert `installieren.ps1` die Ressourcen in das Benutzerprofil, erzeugt
aus der klar gekennzeichneten Vorlage eine Theme-Datei mit absoluten Pfaden und
öffnet diese. Das Theme nutzt den Windows-Dunkelmodus und Königsblau als ruhigen
Systemakzent; Gold bleibt der prägnante Markenakzent der Hintergründe. Es
verändert keine Systemdateien und behält bewusst die Windows-Standardzeiger.
Installation, die ungeprüfte Grenze der automatischen Klangschema-Registrierung
und der Rückweg mit `deinstallieren.ps1` stehen in
`integrations/windows/README.md`.

## Android

`integrations/android/` ist ausdrücklich keine installierbare Theme- oder
Icon-Pack-App. Es enthält Generatoren für getrennte Start- und
Sperrbildschirmmotive in 1080x2400, 1440x3200 und 1080x1920 sowie zehn
512-px-Hauspiktogramme:

```powershell
cd lcars-homelab-theme\integrations\android
node .\build-wallpapers.mjs
node .\build-icons.mjs
```

Die wichtigen Iconmotive bleiben innerhalb der mittleren 66 Prozent. Wallpaper
lassen sich mit Android-Bordmitteln setzen; lose PNG-Appsymbole benötigen einen
Startbildschirm, der Einzelzuweisungen unterstützt. Die vollständigen Schritte
und eine ehrliche KWGT-Nachbauanleitung stehen in `integrations/android/README.md`.

## Zugänglichkeit

- sichtbarer 2-px-Tastaturfokus mit Abstand zum Element;
- Text- und Statuskontraste für dunkle Flächen;
- korrekt verknüpfte Beschriftungen und zusätzliche Fehlertexte;
- `role="status"` beziehungsweise `role="alert"` in den Beispielen;
- vollständig abgeschaltete Bewegung mit statischen Ersatzmustern bei
  `prefers-reduced-motion`;
- responsive Rail und lineare Lesereihenfolge auf schmalen Bildschirmen;
- keine Information ausschließlich über Farbe: Status trägt Text, Diagramme Werte
  und Marker.
- Emblemkontrast: Königsblau zu Gold 4,00:1 in der A-Endkappe; Goldkontur zu
  Stufe-B-Fläche 8,83:1 und zur warmen Grundfläche 7,08:1.

## Gestaltungsgrenzen

Arbeits- und Ruheflächen tragen keine tonalen Farbverläufe und in Ruhezuständen
keine dekorativen Schatten. Hart gestoppte CSS-Verläufe dienen ausschließlich als
Segmentmuster. Farbiger Glow ist nur für Hover, Tastaturfokus, Druck, Laden und
Alarm erlaubt.
Auf den Fehlerseiten blinkt bewusst nichts dauerhaft: Erklärung und Rückweg bleiben
ruhig, nur „Zur Startseite“ reagiert. Trek-Begriffe bleiben außerhalb der
Keycloak-Anmeldung ausgeschlossen. Paperless bleibt laut Zielmatrix bewusst bei
„nur Marke“. Nextcloud nutzt ab 1.13.0 die offizielle Custom-CSS-App, beschränkt
LCARS-Formen und Bewegung aber auf Kopf-/Gastbereich statt auf Dateilisten.
