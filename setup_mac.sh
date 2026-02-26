#!/bin/bash
# AI Workflow Setup Script (macOS/Linux)

SOURCE_PATH="C:/Users/Rich/Desktop/team_workflow_build" # TODO: Change this to the actual Git repository URL later
TARGET_PATH="."

echo "Setting up AI Workflow files..."

# 대상 폴더 생성
mkdir -p "$TARGET_PATH/.ai"
mkdir -p "$TARGET_PATH/.agent"

# 로컬 복사 방식 (나중에 git clone이나 curl로 변경 필요)
echo "Copying .ai directory..."
cp -R "$SOURCE_PATH/.ai/"* "$TARGET_PATH/.ai/"

echo "Copying .agent directory..."
cp -R "$SOURCE_PATH/.agent/"* "$TARGET_PATH/.agent/"

echo "AI Workflow setup completed successfully!"
