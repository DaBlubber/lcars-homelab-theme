[CmdletBinding()]
param(
    # Only for a file-only check; not for normal use.
    [switch]$NoOpen
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$themesRoot = [IO.Path]::GetFullPath((Join-Path $env:LOCALAPPDATA 'Microsoft\Windows\Themes')).TrimEnd('\')
$targetDir = [IO.Path]::GetFullPath((Join-Path $themesRoot 'LCARS-Homelab')).TrimEnd('\')
$expectedTarget = ($themesRoot + '\LCARS-Homelab')
$defaultTheme = Join-Path $env:SystemRoot 'Resources\Themes\aero.theme'

# Safety limit for the recursive removal further down.
if (-not $targetDir.Equals($expectedTarget, [StringComparison]::OrdinalIgnoreCase)) {
    throw "Unexpected target directory; aborting: $targetDir"
}

if (-not $NoOpen) {
    if (-not (Test-Path -LiteralPath $defaultTheme -PathType Leaf)) {
        throw "Windows default theme not found: $defaultTheme"
    }
    Start-Process -FilePath $defaultTheme
    # Windows applies the theme asynchronously. Wait briefly before removing the
    # files of the theme that was active until now.
    Start-Sleep -Seconds 3
}

if (Test-Path -LiteralPath $targetDir -PathType Container) {
    Remove-Item -LiteralPath $targetDir -Recurse -Force
    $removed = $true
} else {
    $removed = $false
}

Write-Host ''
if ($NoOpen) {
    Write-Host 'Check mode: no Windows theme was opened.'
} else {
    Write-Host "Windows was asked to open the default theme: $defaultTheme"
}
if ($removed) {
    Write-Host "Removed: $targetDir"
} else {
    Write-Host "Not present, nothing removed: $targetDir"
}
Write-Host 'If Windows still shows a cached preview, delete it under Personalization > Themes.'
Write-Host 'A sound scheme saved by hand has to be deleted separately in the sound settings.'
