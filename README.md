# AI Component Generation Workflow

이 프로젝트는 굿리치 UX디자인팀의 웹빌더 Figma 디자인을 기반으로 고품질의 Vue/Nuxt 컴포넌트 생성을 자동화하고 검증하기 위한 AI 오케스트레이션 및 에이전트 기반 개발 환경입니다.

## 🛠️ 기술 스택 (Tech Stack)
- **프레임워크:** Vue 3.5+, Nuxt 4.2+
- **언어:** TypeScript
- **스타일링:** Tailwind CSS
- **컴포넌트 개발 및 프리뷰:** 동적 라우팅 기반 `pages/preview/[name].vue` 활용

## 🏗️ 폴더 구조 및 AI 에이전트 아키텍처 (Architecture)

이 프로젝트는 자체적인 AI 에이전트 시스템 체계를 갖추고 있습니다. 루트의 `.ai/` 및 `.agent/` 폴더에 핵심 지침들이 구성되어 있습니다.

- **`.ai/core.md`**: 워크플로우를 통제하는 최상위 오케스트레이터 지침 (AI 행동, 컴포넌트 저장소 라우팅, 품질 기준)
- **`.ai/rules/development/`**: 전문 개발 하위 에이전트 가이드 (예: `expert-figma-to-vue.md`, `expert-nuxt-preview.md`, `expert-vue-tester.md`)
- **`.ai/rules/language/`**: 사용 언어(Vue, TypeScript, Tailwind) 작성 규칙
- **`.ai/skills/`**: 트리거 기반으로 동적 로드되는 스킬 정의 (예: `figma-to-vue.md`)
- **`.ai/config/`**: 품질 게이트 기준 설정 (예: `quality.yaml`)
- **`.agent/workflows/`**: 에이전트 실행 순서를 정의하는 오케스트레이션 스크립트 (`/figma-to-code`, `/component-validation`)
- **`.agent/rules/`**: Google Antigravity용 프로젝트 전역 지침 (`rules.md`)
- **`.github/copilot-instructions.md`**: GitHub Copilot용 프로젝트 컨텍스트 지침
- **`CLAUDE.md`**: Claude Code용 프로젝트 전역 지침 (`.ai/core.md` 및 `.ai/rules/` 참조 강제)
- **`AGENTS.md`**: OpenAI Codex용 프로젝트 전역 지침 (`.ai/core.md` 및 `.ai/rules/` 참조 강제)

## 🚀 주요 기능 (Features)

### 에이전트 (Agents)

| 에이전트 | 파일 | 역할 |
|---|---|---|
| `expert-figma-to-vue` | `.ai/rules/development/expert-figma-to-vue.md` | Figma 노드 데이터를 받아 Vue SFC 컴포넌트를 생성·수정하는 핵심 에이전트 |
| `expert-nuxt-preview` | `.ai/rules/development/expert-nuxt-preview.md` | 생성된 컴포넌트를 로컬 브라우저에서 즉시 확인할 수 있도록 프리뷰 환경을 구성하는 에이전트 |
| `expert-vue-tester` | `.ai/rules/development/expert-vue-tester.md` | 생성된 컴포넌트에 대한 유닛 테스트 코드를 작성하고 타입·렌더링 오류를 검증하는 에이전트 |

**각 에이전트 상세 역할:**

1. **`expert-figma-to-vue`** — 컴포넌트 생성 에이전트
   - Figma Dev Mode MCP를 통해 노드 데이터를 수집하고, 선택한 **레이어명을 PascalCase로 변환**하여 컴포넌트 파일명으로 사용합니다. (예: `"login form"` → `LoginForm.vue`)
   - Tailwind CSS + TypeScript 기반의 `.vue` SFC를 생성하고 **`components/`** 폴더에 저장합니다.
   - `data-node-id` 속성 보존, 시맨틱 HTML, 접근성(aria) 적용을 포함한 9가지 Hard Rule을 준수합니다.
   - 기존 컴포넌트 수정 시 비즈니스 로직(`ref`, `reactive`, lifecycle hook 등)을 보존하고 템플릿·스타일만 교체합니다.

2. **`expert-nuxt-preview`** — 프리뷰 에이전트
   - Storybook 없이 `pages/preview/[name].vue` 동적 라우팅을 활용해 컴포넌트를 브라우저에서 즉시 확인합니다.
   - 개발 서버(포트 3000) 상태를 확인하고, OS에 맞는 명령어로 브라우저를 자동으로 엽니다.
     - Windows: `start http://localhost:3000/preview/[ComponentName]`
     - macOS/Linux: `open http://localhost:3000/preview/[ComponentName]`

3. **`expert-vue-tester`** — 테스트 에이전트
   - 생성된 컴포넌트의 렌더링, Props·기본값, 사용자 인터랙션(click, emit), 접근성(aria-*)을 검증하는 유닛 테스트를 작성합니다.
   - 테스트 파일은 `[ComponentName].spec.ts` 형식으로 저장하며, 커버리지 최소 80%를 목표로 합니다.
   - 심각한 에러 발견 시 `expert-figma-to-vue`에게 피드백하여 자동 수정(Self-Correction)을 유도합니다.

---

### 워크플로우 (Workflows)

| 워크플로우 | 파일 | 실행 시점 |
|---|---|---|
| `figma-to-code` | `.agent/workflows/figma-to-code.md` | Figma 디자인 → Vue 컴포넌트 변환 시 |
| `component-validation` | `.agent/workflows/component-validation.md` | 컴포넌트 생성·수정 완료 후 QA 단계 |

**각 워크플로우 실행 순서:**

```
[figma-to-code 워크플로우]
  1. 규칙 로드 (expert-figma-to-vue + vue-nuxt + typescript + tailwind)
  2. Figma MCP로 노드 수집 → 레이어명을 PascalCase 파일명으로 확정
  3. .vue 파일 생성 → 사용자 리뷰 → components/ 에 저장
  4. component-validation 워크플로우로 핸드오프
       ↓
[component-validation 워크플로우]
  1. 규칙 로드 (expert-vue-tester)
  2. 정적 분석 + 유닛 테스트 코드 작성
  3. 에러 처리 (심각 → expert-figma-to-vue 피드백 / 경미 → .spec.ts 저장)
  4. 프리뷰 URL 제공 → 브라우저 자동 오픈
```

---

### 에셋 구조 (Asset Structure)

컴포넌트에서 참조하는 정적 에셋은 아래 Vue/Nuxt 권장 구조를 따릅니다:

```
assets/
├── css/      # 전역 스타일시트 (예: tailwind.css)
├── images/   # 래스터 이미지 (파일명: kebab-case, 예: hero-background.png)
├── icons/    # SVG 아이콘 (파일명: icon-[name].svg, 예: icon-arrow.svg)
└── fonts/    # 커스텀 폰트 파일
```

## 🏃 시작하기 (Getting Started)

프로젝트를 처음 세팅할 때 AI 워크플로우에 필요한 지침 폴더(`.ai`, `.agent`, `.github`)와 `CLAUDE.md`, `AGENTS.md`, 그리고 프론트엔드 환경 설정을 위해 메인 레포지토리를 클론합니다.
기존 프로젝트에 워크플로우 관련 파일(`.ai`, `.agent`, `.github`, `CLAUDE.md`, `AGENTS.md`)만 단독으로 설치하고 싶다면 제공되는 설치 스크립트를 활용할 수 있습니다.

### 1단계: 저장소 클론 (전체 프로젝트 시작)

프론트엔드 환경 전체를 시작하려면 터미널에서 아래 명령어로 리포지토리를 다운로드하세요.

**방법 A: 폴더명을 직접 지정** (원하는 이름으로 폴더 생성)

```bash
git clone https://github.com/Hongcha-poodle/uxd-webbuilder-setup.git 내-프로젝트명
cd 내-프로젝트명
```

**방법 B: 현재 폴더에 직접 설치** (이미 원하는 폴더 안에서 터미널 실행 시)

```bash
git clone https://github.com/Hongcha-poodle/uxd-webbuilder-setup.git .
```

> 💡 **차이점**: 방법 A는 지정한 이름으로 새 폴더를 만들어 그 안에 파일을 넣습니다. 방법 B는 URL 뒤에 `.`을 붙여 현재 디렉토리에 바로 파일을 복사합니다 (별도 하위 폴더 생성 없음).

*(참고: 기존 프로젝트에 `.ai`, `.agent`, `.github` 폴더와 `CLAUDE.md`, `AGENTS.md`만 복사하려면 프로젝트 디렉토리에서 `setup-windows.ps1` 또는 `setup-mac.sh` 스크립트를 실행하면 됩니다.)*

### 2단계: 프론트엔드 종속성 설치 및 실행

Nuxt 4 개발 서버를 실행하여 작업 환경과 프리뷰 시스템을 가동합니다.

```bash
# 종속성 설치
npm install

# 로컬 개발 서버 실행
npm run dev
```

컴포넌트 생성 후, 제공되는 로컬 주소(예: `http://localhost:3000/preview/[컴포넌트이름]`)를 통해 바로 결과를 확인할 수 있습니다.
