# AI Workflow Setup Script (Windows PowerShell)

$sourcePath = "C:\Users\Rich\Desktop\team_workflow_build"
$targetPath = "."

Write-Host "Setting up AI Workflow files..."

# 대상 폴더가 없으면 생성
if (-not (Test-Path $targetPath\.ai)) {
    New-Item -ItemType Directory -Force -Path $targetPath\.ai | Out-Null
}
if (-not (Test-Path $targetPath\.agent)) {
    New-Item -ItemType Directory -Force -Path $targetPath\.agent | Out-Null
}

# .ai 폴더 복사
Write-Host "Copying .ai directory..."
Copy-Item -Path "$sourcePath\.ai\*" -Destination "$targetPath\.ai" -Recurse -Force

# .agent 폴더 복사
Write-Host "Copying .agent directory..."
Copy-Item -Path "$sourcePath\.agent\*" -Destination "$targetPath\.agent" -Recurse -Force

Write-Host "AI Workflow setup completed successfully!"
