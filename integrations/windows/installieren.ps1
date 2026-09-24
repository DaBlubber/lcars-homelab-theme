[CmdletBinding()]
param(
    # Fuer eine rein dateibasierte Pruefung. Der normale Aufruf oeffnet das Theme.
    [switch]$NichtOeffnen
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

# Alles bleibt im Benutzerprofil; Administratorrechte sind nicht erforderlich.
$quellverzeichnis = [IO.Path]::GetDirectoryName($PSCommandPath)
$themeVorlage = Join-Path $quellverzeichnis 'LCARS-Homelab.theme'
$themesStamm = Join-Path $env:LOCALAPPDATA 'Microsoft\Windows\Themes'
$zielverzeichnis = Join-Path $themesStamm 'LCARS-Homelab'
$zielHintergruende = Join-Path $zielverzeichnis 'wallpapers'
$zielKlaenge = Join-Path $zielverzeichnis 'sounds'
$fertigesTheme = Join-Path $zielverzeichnis 'LCARS-Homelab.theme'

$hintergruende = @(
    'rahmen-1920x1080.png',
    'signal-1920x1080.png',
    'rahmen-2560x1440.png',
    'signal-2560x1440.png',
    'rahmen-3840x2160.png',
    'signal-3840x2160.png'
)
$klaenge = @(
    'standard.wav',
    'fehler.wav',
    'benachrichtigung.wav',
    'geraet-verbunden.wav',
    'geraet-getrennt.wav'
)

if (-not (Test-Path -LiteralPath $themeVorlage -PathType Leaf)) {
    throw "Theme-Vorlage fehlt: $themeVorlage"
}

# Vor dem Kopieren vollstaendig pruefen, damit keine halbe Installation entsteht.
foreach ($dateiname in $hintergruende) {
    $quelldatei = Join-Path (Join-Path $quellverzeichnis 'wallpapers') $dateiname
    if (-not (Test-Path -LiteralPath $quelldatei -PathType Leaf)) {
        throw "Hintergrund fehlt: $quelldatei. Zuerst build-wallpapers.mjs ausfuehren."
    }
}
foreach ($dateiname in $klaenge) {
    $quelldatei = Join-Path (Join-Path $quellverzeichnis 'sounds') $dateiname
    if (-not (Test-Path -LiteralPath $quelldatei -PathType Leaf)) {
        throw "Klang fehlt: $quelldatei. Zuerst build-sounds.mjs ausfuehren."
    }
}

New-Item -ItemType Directory -Path $zielHintergruende, $zielKlaenge -Force | Out-Null

# Gleiche Dateinamen werden ueberschrieben. Ein erneuter Lauf aktualisiert daher
# dieselbe Installation und erzeugt weder ein zweites Theme noch Dateiduplikate.
foreach ($dateiname in $hintergruende) {
    $quelle = Join-Path (Join-Path $quellverzeichnis 'wallpapers') $dateiname
    Copy-Item -LiteralPath $quelle -Destination (Join-Path $zielHintergruende $dateiname) -Force
}
foreach ($dateiname in $klaenge) {
    $quelle = Join-Path (Join-Path $quellverzeichnis 'sounds') $dateiname
    Copy-Item -LiteralPath $quelle -Destination (Join-Path $zielKlaenge $dateiname) -Force
}

$vorlagenText = Get-Content -LiteralPath $themeVorlage -Raw -Encoding UTF8
if (-not $vorlagenText.Contains('__ZIELVERZEICHNIS__')) {
    throw 'Die Theme-Vorlage enthaelt den erwarteten Platzhalter nicht.'
}
$themeText = $vorlagenText.Replace('__ZIELVERZEICHNIS__', $zielverzeichnis)
if ($themeText.Contains('__ZIELVERZEICHNIS__')) {
    throw 'Der Zielpfad konnte nicht vollstaendig in die Theme-Vorlage eingesetzt werden.'
}

# Windows-Theme-Dateien werden als UTF-16 LE mit BOM geschrieben.
[IO.File]::WriteAllText($fertigesTheme, $themeText, [Text.Encoding]::Unicode)

if (-not $NichtOeffnen) {
    # Die Dateizuordnung von Windows oeffnet und uebernimmt das erzeugte Theme.
    Start-Process -FilePath $fertigesTheme
}

Write-Host ''
Write-Host 'LCARS-Homelab wurde aktualisiert.'
Write-Host "Ziel: $zielverzeichnis"
Write-Host "Kopiert: $($hintergruende.Count) Hintergruende, $($klaenge.Count) Klaenge"
if ($NichtOeffnen) {
    Write-Host 'Das Theme wurde auf Wunsch nicht geoeffnet.'
} else {
    Write-Host 'Windows wurde aufgefordert, das erzeugte Theme zu oeffnen.'
}
Write-Host 'Rueckweg: deinstallieren.ps1 ausfuehren oder unter Personalisierung ein Windows-Design waehlen.'
