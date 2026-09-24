[CmdletBinding()]
param(
    # Nur fuer eine rein dateibasierte Pruefung; normal nicht verwenden.
    [switch]$NichtOeffnen
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$themesStamm = [IO.Path]::GetFullPath((Join-Path $env:LOCALAPPDATA 'Microsoft\Windows\Themes')).TrimEnd('\')
$zielverzeichnis = [IO.Path]::GetFullPath((Join-Path $themesStamm 'LCARS-Homelab')).TrimEnd('\')
$erwartetesZiel = ($themesStamm + '\LCARS-Homelab')
$standardTheme = Join-Path $env:SystemRoot 'Resources\Themes\aero.theme'

# Sicherheitsgrenze fuer das spaetere rekursive Entfernen.
if (-not $zielverzeichnis.Equals($erwartetesZiel, [StringComparison]::OrdinalIgnoreCase)) {
    throw "Unerwartetes Zielverzeichnis; Abbruch: $zielverzeichnis"
}

if (-not $NichtOeffnen) {
    if (-not (Test-Path -LiteralPath $standardTheme -PathType Leaf)) {
        throw "Windows-Standardtheme nicht gefunden: $standardTheme"
    }
    Start-Process -FilePath $standardTheme
    # Die Theme-Uebernahme erfolgt asynchron. Kurz warten, bevor die Quelldateien
    # des bisher aktiven Themes entfernt werden.
    Start-Sleep -Seconds 3
}

if (Test-Path -LiteralPath $zielverzeichnis -PathType Container) {
    Remove-Item -LiteralPath $zielverzeichnis -Recurse -Force
    $entfernt = $true
} else {
    $entfernt = $false
}

Write-Host ''
if ($NichtOeffnen) {
    Write-Host 'Pruefmodus: Es wurde kein Windows-Theme geoeffnet.'
} else {
    Write-Host "Windows wurde aufgefordert, das Standardtheme zu oeffnen: $standardTheme"
}
if ($entfernt) {
    Write-Host "Entfernt: $zielverzeichnis"
} else {
    Write-Host "Nicht vorhanden, daher nichts entfernt: $zielverzeichnis"
}
Write-Host 'Falls Windows noch eine zwischengespeicherte Vorschau zeigt, diese unter Personalisierung > Designs manuell loeschen.'
Write-Host 'Ein manuell gespeichertes Klangschema muss gegebenenfalls in den Soundeinstellungen separat geloescht werden.'
