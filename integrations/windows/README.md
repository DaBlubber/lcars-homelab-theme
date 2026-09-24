# LCARS-Homelab fuer Windows 11

Das Paket installiert ein Windows-Theme ausschliesslich im aktuellen
Benutzerprofil. Es verwendet keine gepatchten Systemdateien, keinen
Hintergrunddienst und keine Administratorrechte. Es setzt lokale Hintergruende,
Windows-Dunkelmodus, Koenigsblau als Akzent, Windows-Standardzeiger und nach
Moeglichkeit fuenf kurze eigene Systemklaenge.

## Dateien erzeugen

```powershell
cd lcars-homelab-theme\integrations\windows
node .\build-wallpapers.mjs
node .\build-sounds.mjs
```

Die Skripte schreiben sechs PNGs nach `wallpapers\` und fuenf WAVs nach
`sounds\`. Die beiden 1920x1080-Motive werden im Theme verwendet; 2560x1440 und
3840x2160 liegen fuer eine spaetere Monitorumstellung bereit. Die Mitte bleibt
frei, die untere Leiste endet oberhalb des typischen Taskleistenbereichs.

## Installieren und aktualisieren

Nach dem Erzeugen der Dateien:

```powershell
.\installieren.ps1
```

Falls die lokale Ausfuehrungsrichtlinie Skripte sperrt, kann genau dieser eine
Prozess ohne Aenderung der systemweiten Richtlinie gestartet werden:

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\installieren.ps1
```

Das Skript:

1. prueft, ob alle sechs Hintergruende und fuenf Klaenge vorhanden sind;
2. kopiert sie nach
   `%LocalAppData%\Microsoft\Windows\Themes\LCARS-Homelab\`;
3. ersetzt in der Vorlage `__ZIELVERZEICHNIS__` durch diesen absoluten Pfad;
4. schreibt dort eine fertige `LCARS-Homelab.theme` als UTF-16-LE-Datei;
5. oeffnet die fertige Datei ueber die Windows-Dateizuordnung.

Ein erneuter Lauf ueberschreibt dieselben Zieldateien und aktualisiert dieselbe
Installation. Er erzeugt weder ein zweites Zielverzeichnis noch einen zweiten
Theme-Dateinamen.

Die neben dem Skript liegende `LCARS-Homelab.theme` ist **nur eine Vorlage**.
Ihr Platzhalter ist absichtlich kein gueltiger Windows-Pfad. Diese Datei nicht
doppelklicken; nur die vom Installationsskript erzeugte Fassung ist benutzbar.

Unter **Einstellungen > Personalisierung > Farben** kann optional
"Akzentfarbe auf Start und Taskleiste anzeigen" beziehungsweise "Akzentfarbe auf
Titelleisten und Fensterrahmen anzeigen" aktiviert werden. Das Theme schaltet
diese beiden separaten Benutzeroptionen nicht zwangsweise ein.

## Gepruefte Farbwerte

Koenigsblau (`#1740bc`) ist absichtlich der Systemakzent statt Gold. Gold bleibt
im Wallpaper der klare Markenakzent; Koenigsblau ist auf grossen Titelleisten,
Auswahlflaechen und Start-Oberflaechen ruhiger.

Das auf diesem Rechner vorhandene Microsoft-Theme `dark.theme` verwendet dieselbe
Kombination aus `AutoColorization=0`, einem festen `ColorizationColor` sowie
`SystemMode=Dark` und `AppMode=Dark`. Microsofts Wert `0XC40078D4` ist im Format
AARRGGBB: Alpha `C4` und RGB `00 78 D4`. Entsprechend ist
`0XC41740BC` Alpha `C4` plus Homelab-Koenigsblau `17 40 BC`.
`AutoColorization=0` verhindert dabei die automatische Ableitung aus dem
Hintergrundbild. Nicht geprueft wurde die sichtbare Wirkung jeder moeglichen
Windows-Richtlinie oder der beiden oben genannten Akzent-Anzeigeschalter.

## Klangschema: belegte und ungepruefte Teile

Belegt und binaer geprueft sind die WAV-Dateien: Mono, 16 Bit PCM, 44,1 kHz,
100 bis 200 ms und etwa 6 bis 12 Prozent Spitzenpegel. Es sind selbst erzeugte
Sinustoene ohne uebernommenes Tonmaterial.

Nicht belegt ist, dass `SchemeName=LCARS-Homelab` einen zuvor nicht registrierten
Schemanamen selbst in jeder Windows-11-Version anlegt. Die Microsoft-Themes auf
diesem Rechner verweisen dort nur auf das bereits registrierte Windows-Schema.
`installieren.ps1` nimmt bewusst keine direkten Registry-Aenderungen vor. Die
Vorlage enthaelt zusaetzlich einzelne
`[AppEvents\Schemes\Apps\.Default\...\.Current]`-Zuordnungen. Ob Windows diese
beim Oeffnen vollstaendig uebernimmt, konnte ohne Anwenden des Themes nicht
geprueft werden. Deshalb wird ein automatisch sichtbares Klangschema nicht
versprochen.

Falls keine Homelab-Toene zu hoeren sind:

1. **Einstellungen > System > Sound > Weitere Soundeinstellungen > Sounds**
   oeffnen.
2. Den Ereignissen **Standardton/Default Beep**, **Kritischer Abbruch/Critical
   Stop**, **Benachrichtigung/Notification**, **Geraet verbunden/Device Connect**
   und **Geraet getrennt/Device Disconnect** die entsprechenden Dateien aus
   `%LocalAppData%\Microsoft\Windows\Themes\LCARS-Homelab\sounds\` zuweisen.
3. Mit **Speichern unter...** den Namen `LCARS-Homelab` vergeben.

Zum Abschalten im selben Dialog **Keine Sounds** oder **Windows-Standard**
waehlen. Ein manuell gespeichertes Schema bleibt bestehen, bis es dort separat
geloescht wird.

## Deinstallieren und Grenzen des Rueckwegs

```powershell
.\deinstallieren.ps1
```

Bei derselben Ausfuehrungssperre gilt entsprechend:

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\deinstallieren.ps1
```

Das Skript fordert Windows zuerst auf, das eingebaute
`%SystemRoot%\Resources\Themes\aero.theme` zu oeffnen, wartet kurz und entfernt
danach nur
`%LocalAppData%\Microsoft\Windows\Themes\LCARS-Homelab\`. Falls Windows den
Wechsel wegen einer Richtlinie oder eines asynchronen Einstellungsdialogs nicht
uebernimmt, unter **Einstellungen > Personalisierung > Designs** ein Windows-Design
manuell waehlen.

Nicht automatisch entfernt oder zurueckgestellt werden:

- ein ueber den Sounddialog manuell gespeichertes Klangschema;
- zwischengespeicherte Theme-Vorschaubilder oder ein von Windows zusaetzlich
  gespeichertes benutzerdefiniertes Design;
- separat geaenderte Schalter fuer Akzentfarbe auf Taskleiste oder Titelleisten;
- Einstellungen, die Windows ueber die Kontosynchronisierung auf andere Geraete
  uebertragen hat;
- die Quelldateien in diesem Repository.

## Mauszeiger

Ein eigenes Zeigerschema ist nicht enthalten. Zeiger muessen in jeder Groesse,
bei Skalierung und in ihren Hotspots praezise sein; eine dekorative, aber
alltaeglich schlechtere Variante waere kein Gewinn. Die Vorlage verwendet exakt
die Zeigerpfade des lokalen Windows-Standardthemes.
