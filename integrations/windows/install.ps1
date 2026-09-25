[CmdletBinding()]
param(
    # For a file-only check. The normal call opens the theme.
    [switch]$NoOpen
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

# Everything stays in the user profile; no administrator rights are needed.
$sourceDir = [IO.Path]::GetDirectoryName($PSCommandPath)
$themeTemplate = Join-Path $sourceDir 'LCARS-Homelab.theme'
$themesRoot = Join-Path $env:LOCALAPPDATA 'Microsoft\Windows\Themes'
$targetDir = Join-Path $themesRoot 'LCARS-Homelab'
$targetWallpapers = Join-Path $targetDir 'wallpapers'
$targetSounds = Join-Path $targetDir 'sounds'
$finishedTheme = Join-Path $targetDir 'LCARS-Homelab.theme'

$wallpapers = @(
    'frame-1920x1080.png',
    'signal-1920x1080.png',
    'frame-2560x1440.png',
    'signal-2560x1440.png',
    'frame-3840x2160.png',
    'signal-3840x2160.png'
)
$sounds = @(
    'default.wav',
    'critical-stop.wav',
    'notification.wav',
    'device-connect.wav',
    'device-disconnect.wav'
)

if (-not (Test-Path -LiteralPath $themeTemplate -PathType Leaf)) {
    throw "Theme template missing: $themeTemplate"
}

# Check everything before copying, so no half installation is left behind.
foreach ($fileName in $wallpapers) {
    $sourceFile = Join-Path (Join-Path $sourceDir 'wallpapers') $fileName
    if (-not (Test-Path -LiteralPath $sourceFile -PathType Leaf)) {
        throw "Wallpaper missing: $sourceFile. Run build-wallpapers.mjs first."
    }
}
foreach ($fileName in $sounds) {
    $sourceFile = Join-Path (Join-Path $sourceDir 'sounds') $fileName
    if (-not (Test-Path -LiteralPath $sourceFile -PathType Leaf)) {
        throw "Sound missing: $sourceFile. Run build-sounds.mjs first."
    }
}

New-Item -ItemType Directory -Path $targetWallpapers, $targetSounds -Force | Out-Null

# Same file names are overwritten. Running it again therefore updates the same
# installation and creates neither a second theme nor duplicate files.
foreach ($fileName in $wallpapers) {
    $source = Join-Path (Join-Path $sourceDir 'wallpapers') $fileName
    Copy-Item -LiteralPath $source -Destination (Join-Path $targetWallpapers $fileName) -Force
}
foreach ($fileName in $sounds) {
    $source = Join-Path (Join-Path $sourceDir 'sounds') $fileName
    Copy-Item -LiteralPath $source -Destination (Join-Path $targetSounds $fileName) -Force
}

$templateText = Get-Content -LiteralPath $themeTemplate -Raw -Encoding UTF8
if (-not $templateText.Contains('__TARGET_DIR__')) {
    throw 'The theme template does not contain the expected placeholder.'
}
$themeText = $templateText.Replace('__TARGET_DIR__', $targetDir)
if ($themeText.Contains('__TARGET_DIR__')) {
    throw 'The target path could not be inserted into the theme template completely.'
}

# Windows theme files are written as UTF-16 LE with a byte order mark.
[IO.File]::WriteAllText($finishedTheme, $themeText, [Text.Encoding]::Unicode)

if (-not $NoOpen) {
    # The Windows file association opens and applies the generated theme.
    Start-Process -FilePath $finishedTheme
}

Write-Host ''
Write-Host 'LCARS-Homelab has been installed or updated.'
Write-Host "Target: $targetDir"
Write-Host "Copied: $($wallpapers.Count) wallpapers, $($sounds.Count) sounds"
if ($NoOpen) {
    Write-Host 'The theme was not opened, as requested.'
} else {
    Write-Host 'Windows was asked to open the generated theme.'
}
Write-Host 'To undo: run uninstall.ps1 or pick a Windows theme under Personalization.'
