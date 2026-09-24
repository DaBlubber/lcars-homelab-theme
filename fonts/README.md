# Lokale Webfonts

Zwei Dateien, keine externen Aufrufe:

| Datei | Familie | Schnitte | Groesse |
|---|---|---|---|
| `Exo2-Variable.woff2` | Exo 2 | 400-800 (variabel) | 40 KB |
| `JetBrainsMono-Variable.woff2` | JetBrains Mono | 400-700 (variabel) | 31 KB |

**Warum nur zwei Dateien:** Beide Familien werden als **variable Schrift** ausgeliefert.
Laedt man die Schnitte 400 bis 800 einzeln herunter, erhaelt man fuenfmal dieselbe Datei
(nachgeprueft: identische MD5-Summe). Eine Datei je Familie mit
`font-weight: 400 800` deckt alle Schnitte ab und spart rund 210 KB.

Zeichenumfang: **latin** (U+0000-00FF und Satzzeichen), also inklusive Umlauten und
Eszett. Fuer weitere Schriftsysteme muessten die entsprechenden Subsets ergaenzt und
die `unicode-range` in `../css/tokens.css` erweitert werden.

**Lizenz:** beide unter der SIL Open Font License 1.1 — Selbsthosten ist ausdruecklich
erlaubt. Die Lizenztexte gehoeren vor einer Veroeffentlichung als `OFL-Exo2.txt` und
`OFL-JetBrainsMono.txt` hierher.

Die `@font-face`-Regeln stehen in `../css/tokens.css` und verwenden `font-display: swap`.
Ohne die Dateien bleibt jede Seite durch vollstaendige System-Fallbacks lesbar.
Beim Ausliefern beachten: MIME-Typ `font/woff2`, CORS fuer die einbindenden Hosts,
langes Immutable-Caching.
