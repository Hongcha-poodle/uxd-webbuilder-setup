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
mkdir -p "$TARGET_PATH/.agents"
mkdir -p "$TARGET_PATH/.github"
mkdir -p "$TARGET_PATH/pages/preview/mobile"
mkdir -p "$TARGET_PATH/pages/preview/raw"
mkdir -p "$TARGET_PATH/utils"
mkdir -p "$TARGET_PATH/tests"
mkdir -p "$TARGET_PATH/assets/images"
mkdir -p "$TARGET_PATH/assets/icons"
mkdir -p "$TARGET_PATH/components"

echo "Copying .ai directory..."
cp -R "$TEMP_DIR/.ai/"* "$TARGET_PATH/.ai/"

echo "Copying .agents directory..."
cp -R "$TEMP_DIR/.agents/"* "$TARGET_PATH/.agents/"

echo "Copying .github directory..."
cp -R "$TEMP_DIR/.github/"* "$TARGET_PATH/.github/"

echo "Copying preview scaffold..."
cp -R "$TEMP_DIR/pages/preview/"* "$TARGET_PATH/pages/preview/"

echo "Copying shared utils..."
cp "$TEMP_DIR/utils/preview-resolver.ts" "$TARGET_PATH/utils/preview-resolver.ts"
cp "$TEMP_DIR/utils/legacy-dependency-audit.ts" "$TARGET_PATH/utils/legacy-dependency-audit.ts"

echo "Copying scaffold tests..."
cp "$TEMP_DIR/tests/workflow-integrity.spec.ts" "$TARGET_PATH/tests/workflow-integrity.spec.ts"
cp "$TEMP_DIR/tests/preview-resolver.spec.ts" "$TARGET_PATH/tests/preview-resolver.spec.ts"
cp "$TEMP_DIR/tests/legacy-dependency-audit.spec.ts" "$TARGET_PATH/tests/legacy-dependency-audit.spec.ts"

echo "Copying preview config..."
cp "$TEMP_DIR/nuxt.config.ts" "$TARGET_PATH/nuxt.config.ts"

echo "Copying CLAUDE.md..."
cp "$TEMP_DIR/CLAUDE.md" "$TARGET_PATH/CLAUDE.md"

if [ -f "$TEMP_DIR/AGENTS.md" ]; then
  echo "Copying AGENTS.md..."
  cp "$TEMP_DIR/AGENTS.md" "$TARGET_PATH/AGENTS.md"
fi

rm -rf "$TEMP_DIR"

echo "AI Workflow setup completed successfully!"
echo "Installed: orchestrator rules, preview pages, shared utils, scaffold tests, and nuxt preview config."
