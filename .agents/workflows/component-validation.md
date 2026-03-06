---
description: 생성된 프론트엔드 UI 컴포넌트의 품질을 보장하기 위한 경량 검증 워크플로우
---

# Component Validation Workflow

`figma-to-code.md` 또는 `legacy-to-vue.md` 워크플로우 이후 실행되며, 작성된 Vue 컴포넌트의 무결성을 보장합니다.

## Prerequisites
- 생성되거나 수정이 완료된 1개 이상의 타겟 `.vue` 컴포넌트 파일.

---

## 필수 단계 (Fast Track)

### Step 1: Pre-flight Check (사전 환경 점검)

컴포넌트 검증을 시작하기 전에 다음 항목을 순서대로 확인합니다. 실패 항목이 있으면 해결 후 다음 단계로 진행합니다.

1. **파일 존재 확인**: `components/[ComponentName].vue` 파일이 실제로 존재하는지 확인합니다.
   - 실패 시: "components/ 폴더에 [ComponentName].vue 파일이 없습니다. 파일명을 확인해 주세요." 출력 후 워크플로우를 중단합니다.

2. **파일명 규칙 확인**: 컴포넌트 파일명이 PascalCase인지 확인합니다.
   - 실패 시: "파일명이 PascalCase가 아닙니다 (현재: [filename]). preview URL과의 호환을 위해 PascalCase로 변경을 권장합니다." 경고를 출력합니다.

3. **`.nuxt/` 환경 확인**: `.nuxt/` 디렉토리가 존재하는지 확인합니다.
   - 미존재 시: `npm run prepare`를 1회 실행합니다.
   - 존재 시: 건너뜁니다.

4. **서버 상태 확인**: `localhost:3000` 포트가 열려 있는지 확인합니다.
   - 미실행 시: "개발 서버가 실행 중이지 않습니다. 별도 터미널에서 `npm run dev`를 실행해 주세요." 안내합니다.

### Step 2: 정적 검증 (Static Validation)

`@.ai/rules/development/expert-vue-tester.md`의 **경량 검증 모드 (Light Validation)**를 적용합니다.

1. **Lint 검사**: `npm run lint`를 실행합니다 (Step 1에서 `.nuxt/` 확인 완료).
   - `quality.yaml` 기준: lint errors = 0 충족 확인.
   - 에러가 있으면 자동 수정을 시도합니다 (`npm run lint:fix`).

2. **코드 리뷰 수준 타입 점검**: 대상 `.vue` 파일의 `<script setup>` 블록을 읽고 다음을 확인합니다:
   - 정의되지 않은 변수 참조 여부
   - `any` 타입 남용 여부
   - 템플릿 내 `v-if`/`v-for` 분기에서의 잠재 오류

3. **피드백 처리**:
   - **에러가 심각한 경우**: 원본 생성 에이전트에게 피드백하여 Self-Correction을 유도합니다. **최대 3회까지만** 반복합니다.
   - **에러가 없거나 경미한 경우**: 검증 완료 보고서를 출력합니다.

### Step 3: 프리뷰 URL 제공 및 브라우저 오픈

`@.ai/rules/development/expert-nuxt-preview.md` 규칙에 따라 사용자에게 브라우저 확인 링크를 제공합니다.

1. `pages/preview/[name].vue` 라우터 구조가 없다면 스캐폴딩을 제안합니다.
2. 검증이 완료된 후, 사용자에게 다음과 같이 안내합니다:
   > "컴포넌트 검증이 완료됐습니다. 로컬 주소(`http://localhost:3000/preview/[ComponentName]`)에서 확인하실 수 있습니다."
3. 사용자가 동의하면 OS에 맞는 명령어로 브라우저를 자동으로 엽니다:
   - **Windows**: `start http://localhost:3000/preview/[ComponentName]`
   - **macOS / Linux**: `open http://localhost:3000/preview/[ComponentName]`
4. 브라우저 오픈 명령 실행 전, 개발 서버가 실행 중인지 재확인합니다.
5. 추가 검증 옵션을 안내합니다:
   > "추가 검증이 필요하시면 다음 옵션을 선택하세요:"
   > 1. 유닛 테스트 작성
   > 2. Figma 디자인 비교 교정 (Visual Diff)

---

## 선택 단계 (Opt-in — 사용자 요청 시에만 실행)

### Step 4 (선택): 유닛 테스트 작성

사용자가 명시적으로 요청한 경우에만 실행합니다 (예: "테스트도 작성해주세요").

1. `@.ai/rules/development/expert-vue-tester.md`의 **전체 검증 모드 (Full Validation)**를 적용합니다.
2. `expert-vue-tester` 에이전트에게 위임하여 `.spec.ts` 유닛 테스트 코드를 작성합니다.
3. 테스트 작성 완료 후 결과를 보고합니다.

### Step 5 (선택): 시각적 비교 교정 (Visual Diff Correction)

사용자가 명시적으로 요청한 경우에만 실행합니다 (예: "디자인 비교해주세요").

1. `/visual-diff` 워크플로우(`@.agents/workflows/visual-diff.md`)를 호출합니다.
2. 타겟 컴포넌트가 여러 개인 경우, 컴포넌트별로 **순차 실행**합니다.
3. Figma 원본 디자인과 브라우저 렌더링을 비교하여 시각적 차이점을 자동 교정합니다.
4. Figma 기준 이미지를 확보할 수 없는 경우, 사용자에게 Figma 노드 ID 또는 스크린샷을 요청합니다. 사용자가 제공을 거부하거나 불가능한 경우에만 이 단계를 건너뜁니다.
