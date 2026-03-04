# AI Workflow Update Script (Windows PowerShell)
# 오케스트레이터, 워크플로우, 에이전트 규칙을 최신 버전으로 업데이트합니다.

$repoUrl = "https://github.com/Hongcha-poodle/uxd-webbuilder-setup.git"
$tempDir = Join-Path $env:TEMP "uxd-update-temp"
$targetPath = "."

Write-Host ""
Write-Host "Updating AI Workflow files to latest version..."
Write-Host ""

if (Test-Path $tempDir) {
    Remove-Item -Path $tempDir -Recurse -Force
}

Write-Host "Downloading latest AI Workflow from remote repository..."
git clone --quiet --depth 1 $repoUrl $tempDir

if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: Failed to download latest version. Check your network or repository URL." -ForegroundColor Red
    exit 1
}

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

# .ai 폴더 업데이트 (오케스트레이터, 코어 규칙)
Write-Host "Updating .ai directory (orchestrator / core rules)..."
Copy-Item -Path "$tempDir\.ai\*" -Destination "$targetPath\.ai" -Recurse -Force

# .agent 폴더 업데이트 (에이전트 워크플로우)
Write-Host "Updating .agent directory (agent workflows)..."
Copy-Item -Path "$tempDir\.agent\*" -Destination "$targetPath\.agent" -Recurse -Force

# .github 폴더 업데이트 (Copilot 지시 파일)
Write-Host "Updating .github directory (Copilot instructions)..."
Copy-Item -Path "$tempDir\.github\*" -Destination "$targetPath\.github" -Recurse -Force

# CLAUDE.md 업데이트
Write-Host "Updating CLAUDE.md..."
Copy-Item -Path "$tempDir\CLAUDE.md" -Destination "$targetPath\CLAUDE.md" -Force

# AGENTS.md 업데이트 (있는 경우)
if (Test-Path "$tempDir\AGENTS.md") {
    Write-Host "Updating AGENTS.md..."
    Copy-Item -Path "$tempDir\AGENTS.md" -Destination "$targetPath\AGENTS.md" -Force
}

# 임시 폴더 삭제
Remove-Item -Path $tempDir -Recurse -Force

Write-Host ""
Write-Host "AI Workflow updated successfully!" -ForegroundColor Green
Write-Host "Orchestrator, rules, and agent workflows are now up to date." -ForegroundColor Green
Write-Host ""
