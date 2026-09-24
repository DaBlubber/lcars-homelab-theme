# Jenkins: LCARS-Homelab

Paketversion **1.11.0**. `jenkins.css` gestaltet Jenkins **2.568.3** auf Stufe B.
Grundlage sind die lokal vorliegenden Core-Dateien `simple-page.css` und
`theme-dark.css` sowie die am 6. September 2026 im angemeldeten Jenkins gemessenen
98 Strukturklassen. Es gibt weder JavaScript noch DOM-Umbau.

> **Status: lokal gebaut, nicht ausgerollt.** Prüfung und Rollout erfolgen durch
> den Betreiber.

## Technischer Ansatz

Jenkins' `dark-theme` bleibt die Basis. Die bereits live bestätigte Übersetzung
der 181 Jenkins-Custom-Properties bleibt unverändert: Grund, Text, Links, Karten,
Paneele, Tabellen, Eingaben, Buttons, Fokus, Status, Alerts und Dialoge verwenden
weiter Jenkins' eigene Variablen. Eigene Selektoren ergänzen nur Formensprache,
Typografie und Geometrie, die Variablen allein nicht ausdrücken können.

Die angemeldete Oberfläche erhält:

- eine segmentierte LCARS-Leiste an `.jenkins-header__main`, deren Goldsegment als
  Endkappe in die Breadcrumb-Zeile läuft;
- das Zahnrad-Emblem über `#jenkins-head-icon`, ohne Abhängigkeit vom wechselnden
  Hash des Jenkins-Logopfads;
- Pane-Elbows aus vertikaler Goldkante und segmentierter oberer Blockleiste;
- gesperrte Versalien für Pane- und Tabellenüberschriften;
- JetBrains Mono und tabellarische Ziffern für Tabellenwerte und die gemessenen
  Metadaten-, Badge-, Zeit- und Datenknoten; Links und Überschriften bleiben Exo 2;
- LCARS-Rundkappen für Schaltflächen sowie Hover-Leuchtkante, 180-ms-Druckblitz
  und doppelten Tastaturfokus;
- einen ruhigen LCARS-Zuschnitt für Reiter;
- eine kleine statische Siebensegment-Leiste im Footer. Sie ist bewusst nicht
  animiert: Jenkins ist ein dauerhaft genutzter Arbeitsbereich, kein Ambient-
  Display. `prefers-reduced-motion: reduce` stoppt weiterhin die hier belegten
  Lade- und Reaktionsbewegungen.

## Verwendete Strukturselektoren

Diese Klassen und IDs müssen bei einem Jenkins-Update gezielt geprüft werden:

- Kopfzeile und Suche: `.jenkins-header`, `.jenkins-header__main`,
  `.jenkins-header--no-breadcrumbs`, `.jenkins-breadcrumbs`, `.app-jenkins-logo`,
  `#jenkins-head-icon`, `.jenkins-search__input`;
- Seitenleiste: `.pane`, `.pane-frame`, `.pane-header`, `.pane-header-title`,
  `.task-link`;
- Job-Tabelle und Metadaten: `.jenkins-table`, `.jenkins-table__link`,
  `.jenkins-table__cell--tight`, `.sortheader`,
  `.jenkins-jobs-list__item__details`, `.jenkins-badge` sowie semantische `time`-
  und `data`-Elemente innerhalb von Tabellen;
- Schaltflächen: `.jenkins-button`, `.jenkins-button--primary`,
  `.jenkins-button--tertiary`;
- Reiter: `.tabBarFrame`, `.tabBar`, `.tabBarBaseline`, `.tab`, `.addTab`;
- ruhige Sequenz: `.page-footer__flex-row`.

Die vorhandenen, bereits belegten Selektoren für Anmeldung und Ladezustände bleiben
erhalten: `.app-sign-in-register__branding`, `__starburst`, `__content-inner`,
`__form-label`, `__error`, `.jenkins-input`, `.jenkins-input--error`,
`.simple-page .safe-restarting`, `.jenkins-spinner`, `.behavior-loading` und
`.app-jenkins-booting`.

## Build-Status und Kontrast

Buildzustände bleiben vollständig variablengetrieben. Grün (`--green` und
`--build-color`), Gelb (`--yellow` und `--unstable-build-icon-color`) sowie Rot
(`--red`, `--danger-color` und `--error-color`) werden weder vereinheitlicht noch
gefiltert. `.jenkins-table__icon` behält Jenkins' semantische Darstellung. Damit
bleiben kaputte, instabile und erfolgreiche Builds wichtiger als dekorative
Vereinheitlichung.

Die neu verwendeten Kombinationen erfüllen mindestens WCAG AA. Gegen die
Kartenfläche `#10131a` erreichen Grün 7,36:1, Gold 8,83:1 und Rot 5,01:1; gegen
Schwarz liegen sie noch höher. Normaler Text, Goldlinks und Fokusrahmen
überschreiten die jeweiligen Grenzwerte ebenfalls. Farbe ist bei den Buildzuständen
weiterhin mit Jenkins' vorhandener Icon-/Statusdarstellung kombiniert.

## Schriften, Emblem und vorgesehene URL

Es gibt keinen Google-Fonts-Import und keinen fremden `@import`. Beide Schriften
und das Emblem kommen über absolute, versionierte Adressen vom Homelab-Host:

```text
https://brand.example.com/v1.11.0/fonts/Exo2-Variable.woff2
https://brand.example.com/v1.11.0/fonts/JetBrainsMono-Variable.woff2
https://brand.example.com/v1.11.0/assets/emblem--jenkins.svg
```

Für das URL-Feld des Simple Theme Plugins ist vorgesehen:

```text
https://brand.example.com/v1.11.0/integrations/jenkins/jenkins.css
```

Das vom `theme-manager` gelieferte Dark Theme bleibt erforderlich. Eine eventuell
notwendige CSP-Freigabe für `style-src`, `font-src` und `img-src` ist nicht
Bestandteil dieses Pakets.

## ZU PRÜFEN im laufenden Jenkins

1. Kopfzeile mit und ohne Breadcrumbs bei schmaler und breiter Ansicht: Leiste,
   Endkappe, Suche, Navigation, Aktionen und Emblem dürfen nichts überdecken.
2. Build Queue und Build Executor Status: Pane-Elbow, lange Titel, Aufgabenlinks
   und leere Zustände prüfen.
3. Job-Tabelle: Sortierung, Sortierpfeil, Statusicons, Aktionsmenüs und lange
   Projektnamen prüfen; Grün, Gelb und Rot müssen eindeutig bleiben.
4. Reiter mit aktivem, inaktivem, fokussiertem und überlangem Titel sowie dem
   `addTab`-Element prüfen.
5. Hover, Tastaturfokus, Druckblitz, deaktivierte Buttons, Forced Colors und
   `prefers-reduced-motion: reduce` prüfen.
6. Build-Historie, laufende Builds, Pipeline-Plugins und Console Output prüfen.
   Deren konkrete Struktur wurde nicht gemessen und bleibt variablengetrieben.
7. Kontrollieren, welche weiteren Buildnummern, Dauern und Zeitstempel Jenkins
   ohne `time`, `data`, Badge-, Tight-Cell- oder Detailklasse ausgibt.
8. Netzwerk und Konsole auf CSP-, CORS-, 404- und Cachefehler der CSS-, Schrift-
   und Emblemadressen prüfen. Diese lokale Dateiarbeit hat nichts davon abgerufen.

## Rückbau

Die CSS-URL im Simple Theme Plugin entfernen; `dark-theme` kann unabhängig aktiv
bleiben. Danach Browsercache leeren. Es werden keine Jenkins-Dateien ersetzt.
