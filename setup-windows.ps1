# AI Workflow Setup Script (Windows PowerShell)

$repoUrl = "https://github.com/Hongcha-poodle/uxd-webbuilder-setup.git"
$tempDir = Join-Path $env:TEMP "uxd-setup-temp"
$targetPath = "."

Write-Host "Setting up AI Workflow files..."

if (Test-Path $tempDir) {
    Remove-Item -Path $tempDir -Recurse -Force
}

Write-Host "Downloading latest AI Workflow from remote repository..."
git clone --quiet --depth 1 $repoUrl $tempDir

# 대상 폴더가 없으면 생성
if (-not (Test-Path "$targetPath\.ai")) {
    New-Item -ItemType Directory -Force -Path "$targetPath\.ai" | Out-Null
}
if (-not (Test-Path "$targetPath\.agent")) {
    New-Item -ItemType Directory -Force -Path "$targetPath\.agent" | Out-Null
}
if (-not (Test-Path "$targetPath\.github")) {
    New-Item -ItemType Directory -Force -Path "$targetPath\.github" | Out-Null
}

# .ai 폴더 복사
Write-Host "Copying .ai directory..."
Copy-Item -Path "$tempDir\.ai\*" -Destination "$targetPath\.ai" -Recurse -Force

# .agent 폴더 복사
Write-Host "Copying .agent directory..."
Copy-Item -Path "$tempDir\.agent\*" -Destination "$targetPath\.agent" -Recurse -Force

# .github 폴더 복사
Write-Host "Copying .github directory..."
Copy-Item -Path "$tempDir\.github\*" -Destination "$targetPath\.github" -Recurse -Force

# CLAUDE.md 복사
Write-Host "Copying CLAUDE.md..."
Copy-Item -Path "$tempDir\CLAUDE.md" -Destination "$targetPath\CLAUDE.md" -Force

# 임시 폴더 삭제
Remove-Item -Path $tempDir -Recurse -Force

Write-Host "AI Workflow setup completed successfully!"
