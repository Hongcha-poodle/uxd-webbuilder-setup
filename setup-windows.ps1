# AI Workflow Setup Script (Windows PowerShell)

$repoUrl = "https://github.com/Hongcha-poodle/uxd-webbuilder-setup.git"
$tempDir = Join-Path $env:TEMP "uxd-setup-temp"
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
    "assets\fonts",
    "components"
)

Write-Host "Setting up AI Workflow files..."

if (Test-Path $tempDir) {
    Remove-Item -Path $tempDir -Recurse -Force
}

Write-Host "Downloading latest AI Workflow from remote repository..."
git clone --quiet --depth 1 $repoUrl $tempDir

# 대상 폴더가 없으면 생성
foreach ($directory in $runtimeDirectories) {
    $fullPath = Join-Path $targetPath $directory
    if (-not (Test-Path $fullPath)) {
        New-Item -ItemType Directory -Force -Path $fullPath | Out-Null
    }
}

# .ai 폴더 복사
Write-Host "Copying .ai directory..."
Copy-Item -Path "$tempDir\.ai\*" -Destination "$targetPath\.ai" -Recurse -Force

# .agents 폴더 복사
Write-Host "Copying .agents directory..."
Copy-Item -Path "$tempDir\.agents\*" -Destination "$targetPath\.agents" -Recurse -Force

# .github 폴더 복사
Write-Host "Copying .github directory..."
Copy-Item -Path "$tempDir\.github\*" -Destination "$targetPath\.github" -Recurse -Force

# preview/runtime scaffold 복사
Write-Host "Copying preview scaffold..."
Copy-Item -Path "$tempDir\pages\preview\*" -Destination "$targetPath\pages\preview" -Recurse -Force

Write-Host "Copying shared utils..."
Copy-Item -Path "$tempDir\utils\preview-resolver.ts" -Destination "$targetPath\utils\preview-resolver.ts" -Force
Copy-Item -Path "$tempDir\utils\legacy-dependency-audit.ts" -Destination "$targetPath\utils\legacy-dependency-audit.ts" -Force

Write-Host "Copying scaffold tests..."
Copy-Item -Path "$tempDir\tests\workflow-integrity.spec.ts" -Destination "$targetPath\tests\workflow-integrity.spec.ts" -Force
Copy-Item -Path "$tempDir\tests\preview-resolver.spec.ts" -Destination "$targetPath\tests\preview-resolver.spec.ts" -Force
Copy-Item -Path "$tempDir\tests\legacy-dependency-audit.spec.ts" -Destination "$targetPath\tests\legacy-dependency-audit.spec.ts" -Force

Write-Host "Copying preview config..."
Copy-Item -Path "$tempDir\nuxt.config.ts" -Destination "$targetPath\nuxt.config.ts" -Force

# CLAUDE.md 복사
Write-Host "Copying CLAUDE.md..."
Copy-Item -Path "$tempDir\CLAUDE.md" -Destination "$targetPath\CLAUDE.md" -Force

if (Test-Path "$tempDir\AGENTS.md") {
    Write-Host "Copying AGENTS.md..."
    Copy-Item -Path "$tempDir\AGENTS.md" -Destination "$targetPath\AGENTS.md" -Force
}

# 기본 디렉터리 구조 보장
Write-Host "Ensuring runtime asset directories..."
foreach ($directory in @("assets\images", "assets\icons", "assets\fonts", "components")) {
    New-Item -ItemType Directory -Force -Path (Join-Path $targetPath $directory) | Out-Null
}

# 임시 폴더 삭제
Remove-Item -Path $tempDir -Recurse -Force

Write-Host "AI Workflow setup completed successfully!"
Write-Host "Installed: orchestrator rules, preview pages, shared utils, scaffold tests, and nuxt preview config."
