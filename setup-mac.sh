#!/bin/bash
# AI Workflow Setup Script (macOS/Linux)

REPO_URL="https://github.com/Hongcha-poodle/uxd-webbuilder-setup.git"
TEMP_DIR="/tmp/uxd-setup-temp"
TARGET_PATH="."

echo "Setting up AI Workflow files..."

rm -rf "$TEMP_DIR"
echo "Downloading latest AI Workflow from remote repository..."
git clone --quiet --depth 1 "$REPO_URL" "$TEMP_DIR"

# 대상 폴더 생성
mkdir -p "$TARGET_PATH/.ai"
mkdir -p "$TARGET_PATH/.agent"
mkdir -p "$TARGET_PATH/.github"

echo "Copying .ai directory..."
cp -R "$TEMP_DIR/.ai/"* "$TARGET_PATH/.ai/"

echo "Copying .agent directory..."
cp -R "$TEMP_DIR/.agent/"* "$TARGET_PATH/.agent/"

echo "Copying .github directory..."
cp -R "$TEMP_DIR/.github/"* "$TARGET_PATH/.github/"

echo "Copying CLAUDE.md..."
cp "$TEMP_DIR/CLAUDE.md" "$TARGET_PATH/CLAUDE.md"

rm -rf "$TEMP_DIR"

echo "AI Workflow setup completed successfully!"
