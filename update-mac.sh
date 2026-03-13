#!/bin/bash
# AI Workflow Update Script (macOS/Linux)
# 오케스트레이터, 워크플로우, 에이전트 규칙을 최신 버전으로 업데이트합니다.

REPO_URL="https://github.com/Hongcha-poodle/uxd-webbuilder-setup.git"
TEMP_DIR="/tmp/uxd-update-temp"
TARGET_PATH="."

echo ""
echo "Updating AI Workflow files to latest version..."
echo ""
echo "Warning: shared preview/runtime scaffold files such as pages/preview/* and nuxt.config.ts may be overwritten."
echo "Review local diffs or back up custom changes before running this updater."
echo ""

rm -rf "$TEMP_DIR"
echo "Downloading latest AI Workflow from remote repository..."
if ! git clone --quiet --depth 1 "$REPO_URL" "$TEMP_DIR"; then
    echo "Error: Failed to download latest version. Check your network or repository URL."
    exit 1
fi

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

# .ai 폴더 업데이트 (오케스트레이터, 코어 규칙)
echo "Updating .ai directory (orchestrator / core rules)..."
cp -R "$TEMP_DIR/.ai/"* "$TARGET_PATH/.ai/"

# .agents 폴더 업데이트 (에이전트 워크플로우)
echo "Updating .agents directory (agent workflows)..."
cp -R "$TEMP_DIR/.agents/"* "$TARGET_PATH/.agents/"

# .github 폴더 업데이트 (Copilot 지시 파일)
echo "Updating .github directory (Copilot instructions)..."
cp -R "$TEMP_DIR/.github/"* "$TARGET_PATH/.github/"

echo "Updating preview scaffold..."
cp -R "$TEMP_DIR/pages/preview/"* "$TARGET_PATH/pages/preview/"

echo "Updating shared utils..."
cp "$TEMP_DIR/utils/preview-resolver.ts" "$TARGET_PATH/utils/preview-resolver.ts"
cp "$TEMP_DIR/utils/legacy-dependency-audit.ts" "$TARGET_PATH/utils/legacy-dependency-audit.ts"

echo "Updating scaffold tests..."
cp "$TEMP_DIR/tests/workflow-integrity.spec.ts" "$TARGET_PATH/tests/workflow-integrity.spec.ts"
cp "$TEMP_DIR/tests/preview-resolver.spec.ts" "$TARGET_PATH/tests/preview-resolver.spec.ts"
cp "$TEMP_DIR/tests/legacy-dependency-audit.spec.ts" "$TARGET_PATH/tests/legacy-dependency-audit.spec.ts"

echo "Updating nuxt.config.ts..."
cp "$TEMP_DIR/nuxt.config.ts" "$TARGET_PATH/nuxt.config.ts"

# CLAUDE.md 업데이트
echo "Updating CLAUDE.md..."
cp "$TEMP_DIR/CLAUDE.md" "$TARGET_PATH/CLAUDE.md"

# AGENTS.md 업데이트 (있는 경우)
if [ -f "$TEMP_DIR/AGENTS.md" ]; then
    echo "Updating AGENTS.md..."
    cp "$TEMP_DIR/AGENTS.md" "$TARGET_PATH/AGENTS.md"
fi

rm -rf "$TEMP_DIR"

echo ""
echo "AI Workflow updated successfully!"
echo "Orchestrator, preview scaffold, shared utils, scaffold tests, and nuxt preview config are now up to date."
echo ""
