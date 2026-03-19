param(
  [switch]$DryRun
)

$ErrorActionPreference = "Stop"

function Remove-IfExists {
  param(
    [Parameter(Mandatory = $true)][string]$Path,
    [switch]$DryRun
  )

  if (Test-Path -LiteralPath $Path) {
    if ($DryRun) {
      Write-Host "Would remove: $Path"
      Remove-Item -LiteralPath $Path -Recurse -Force -WhatIf
      return
    }

    Write-Host "Removing: $Path"
    Remove-Item -LiteralPath $Path -Recurse -Force
    return
  }

  Write-Host "Skip (not found): $Path"
}

Write-Host "Cleanup (DryRun=$DryRun)"
Write-Host "Note: this script does NOT remove .env files."
Write-Host "---"

$targets = @(
  "frontend\\node_modules",
  "node_modules",
  "backend\\venv",
  "frontend\\dist",
  ".serena\\cache",
  ".serena\\memories",
  ".serena\\project.local.yml",
  "frontend\\src\\styles"
)

foreach ($t in $targets) {
  Remove-IfExists -Path $t -DryRun:$DryRun
}

Write-Host "---"
Write-Host "Removing Python caches (__pycache__, *.pyc) under backend/..."

$pycacheDirs = Get-ChildItem -Path "backend" -Recurse -Directory -Force -ErrorAction SilentlyContinue |
  Where-Object { $_.Name -eq "__pycache__" }
foreach ($d in $pycacheDirs) {
  Remove-IfExists -Path $d.FullName -DryRun:$DryRun
}

$pycFiles = Get-ChildItem -Path "backend" -Recurse -Force -File -Filter "*.pyc" -ErrorAction SilentlyContinue
foreach ($f in $pycFiles) {
  if ($DryRun) {
    Write-Host "Would remove: $($f.FullName)"
    Remove-Item -LiteralPath $f.FullName -Force -WhatIf
  } else {
    Write-Host "Removing: $($f.FullName)"
    Remove-Item -LiteralPath $f.FullName -Force
  }
}
