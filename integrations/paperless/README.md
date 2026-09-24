# Paperless: nur Marke

Paketversion **1.12.0**. Gemessener Stand ist **Paperless-ngx 3.0.4** im Nomad-Job
`Nomad-Services/standard/paperless.nomad`.

## Branding und Grenze

Paperless bietet fuer das Branding ausschliesslich diese beiden
Umgebungsvariablen:

- `PAPERLESS_APP_TITLE` setzt den sichtbaren Anwendungstitel;
- `PAPERLESS_APP_LOGO` setzt das Logo.

Beide Variablen sind derzeit **nicht gesetzt**. Im Job steht nur `PAPERLESS_URL`.

**Eigenes CSS ist nicht moeglich.** Paperless bietet dafuer keinen
Erweiterungspunkt. Diese Integration bleibt deshalb ausdruecklich bei "nur
Marke": Titel und Logo. Es gibt kein zusaetzliches Stylesheet, nach dem bei einer
spaeteren Anpassung gesucht werden muesste.

## Logo bereitstellen

`PAPERLESS_APP_LOGO` erwartet einen Pfad relativ zum Medienverzeichnis. Der
gemessene Mount verbindet `/srv/paperlessmedia` auf dem Host mit
`/usr/src/paperless/media` im Container.

Die Datei `assets/emblem--paperless.svg` gehoert daher nach:

```text
/srv/paperlessmedia/logo/emblem--paperless.svg
```

Im Nomad-Job wird sie so referenziert:

```hcl
PAPERLESS_APP_LOGO = "/logo/emblem--paperless.svg"
```

`PAPERLESS_APP_TITLE` wird daneben auf den gewuenschten Anwendungstitel gesetzt.
Diese README dokumentiert nur die gemessene Einbindung; sie veraendert den
Nomad-Job nicht.

## Rueckweg

`PAPERLESS_APP_TITLE` und `PAPERLESS_APP_LOGO` wieder aus dem Job entfernen und
die Logodatei aus `/srv/paperlessmedia/logo/` loeschen.
