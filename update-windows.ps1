# AI Workflow Update Script (Windows PowerShell)
# 오케스트레이터, 워크플로우, 에이전트 규칙을 최신 버전으로 업데이트합니다.

$repoUrl = "https://github.com/Hongcha-poodle/uxd-webbuilder-setup.git"
$tempDir = Join-Path $env:TEMP "uxd-update-temp"
$targetPath = "."
$runtimeDirectories = @(
    ".ai",
    ".agents",
    ".github",
    "pages\preview",
    "pages\preview\mobile",
    "pages\preview\raw",
    "utils",
    "tests",
    "assets",
    "assets\images",
    "assets\icons",
    "components"
)

Write-Host ""
Write-Host "Updating AI Workflow files to latest version..."
Write-Host ""
Write-Host "Warning: shared preview/runtime scaffold files such as pages/preview/* and nuxt.config.ts may be overwritten." -ForegroundColor Yellow
Write-Host "Review local diffs or back up custom changes before running this updater." -ForegroundColor Yellow
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
foreach ($directory in $runtimeDirectories) {
    $fullPath = Join-Path $targetPath $directory
    if (-not (Test-Path $fullPath)) {
        New-Item -ItemType Directory -Force -Path $fullPath | Out-Null
    }
}

# .ai 폴더 업데이트 (오케스트레이터, 코어 규칙)
Write-Host "Updating .ai directory (orchestrator / core rules)..."
Copy-Item -Path "$tempDir\.ai\*" -Destination "$targetPath\.ai" -Recurse -Force

# .agents 폴더 업데이트 (에이전트 워크플로우)
Write-Host "Updating .agents directory (agent workflows)..."
Copy-Item -Path "$tempDir\.agents\*" -Destination "$targetPath\.agents" -Recurse -Force

# .github 폴더 업데이트 (Copilot 지시 파일)
Write-Host "Updating .github directory (Copilot instructions)..."
Copy-Item -Path "$tempDir\.github\*" -Destination "$targetPath\.github" -Recurse -Force

# preview/runtime scaffold 업데이트
Write-Host "Updating preview scaffold..."
Copy-Item -Path "$tempDir\pages\preview\*" -Destination "$targetPath\pages\preview" -Recurse -Force

Write-Host "Updating shared utils..."
Copy-Item -Path "$tempDir\utils\preview-resolver.ts" -Destination "$targetPath\utils\preview-resolver.ts" -Force
Copy-Item -Path "$tempDir\utils\legacy-dependency-audit.ts" -Destination "$targetPath\utils\legacy-dependency-audit.ts" -Force

Write-Host "Updating scaffold tests..."
Copy-Item -Path "$tempDir\tests\workflow-integrity.spec.ts" -Destination "$targetPath\tests\workflow-integrity.spec.ts" -Force
Copy-Item -Path "$tempDir\tests\preview-resolver.spec.ts" -Destination "$targetPath\tests\preview-resolver.spec.ts" -Force
Copy-Item -Path "$tempDir\tests\legacy-dependency-audit.spec.ts" -Destination "$targetPath\tests\legacy-dependency-audit.spec.ts" -Force

Write-Host "Updating nuxt.config.ts..."
Copy-Item -Path "$tempDir\nuxt.config.ts" -Destination "$targetPath\nuxt.config.ts" -Force

# CLAUDE.md 업데이트
Write-Host "Updating CLAUDE.md..."
Copy-Item -Path "$tempDir\CLAUDE.md" -Destination "$targetPath\CLAUDE.md" -Force

# AGENTS.md 업데이트 (있는 경우)
if (Test-Path "$tempDir\AGENTS.md") {
    Write-Host "Updating AGENTS.md..."
    Copy-Item -Path "$tempDir\AGENTS.md" -Destination "$targetPath\AGENTS.md" -Force
}

Write-Host "Ensuring runtime asset directories..."
foreach ($directory in @("assets\images", "assets\icons", "components")) {
    New-Item -ItemType Directory -Force -Path (Join-Path $targetPath $directory) | Out-Null
}

# 임시 폴더 삭제
Remove-Item -Path $tempDir -Recurse -Force

Write-Host ""
Write-Host "AI Workflow updated successfully!" -ForegroundColor Green
Write-Host "Orchestrator, preview scaffold, shared utils, scaffold tests, and nuxt preview config are now up to date." -ForegroundColor Green
Write-Host ""
