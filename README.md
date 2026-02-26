# AI Component Generation Workflow

이 프로젝트는 Figma 디자인 뷰에서부터 고품질의 Vue/Nuxt 컴포넌트 생성을 자동화하고 검증하기 위한 AI 오케스트레이션 및 에이전트 구동 환경입니다.

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
- **`.agent/rules/`**: 프로젝트 전역 AI 규칙 (`rules.md`)

## 🚀 주요 기능 (Features)

1. **Figma to Vue 생성 (`expert-figma-to-vue`)**
   - 디자이너가 Figma에서 추출한 데이터를 바탕으로 Tailwind CSS 기반의 `SFC (.vue)` 컴포넌트를 `~/components/` 내에 자동 생성합니다.
2. **동적 프리뷰 시스템 (`expert-nuxt-preview`)**
   - Storybook 없이도 `~/pages/preview/[ComponentName]` 경로를 통해 생성된 컴포넌트 UI를 브라우저에서 즉각 확인할 수 있습니다.
3. **생성 컴포넌트 검증 (`expert-vue-tester`)**
   - `/component-validation` 워크플로우를 통해 생성된 컴포넌트의 타입, 마크업 구조, 스타일을 QA하고 에러를 리뷰합니다.

## 🏃 시작하기 (Getting Started)

프로젝트를 처음 세팅할 때 AI 워크플로우에 필요한 지침 폴더(`.ai`, `.agent`)와 프론트엔드 환경 설정을 위해 메인 레포지토리를 클론합니다.
기존 프로젝트에 워크플로우 관련 폴더(`.ai`, `.agent`)만 단독으로 설치하고 싶다면 제공되는 설치 스크립트를 활용할 수 있습니다.

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

*(참고: 기존 프로젝트에 `.ai`와 `.agent` 폴더만 복사하려면 프로젝트 디렉토리에서 `setup-windows.ps1` 또는 `setup-mac.sh` 스크립트를 실행하면 됩니다.)*

### 2단계: 프론트엔드 종속성 설치 및 실행

Nuxt 4 개발 서버를 실행하여 작업 환경과 프리뷰 시스템을 가동합니다.

```bash
# 종속성 설치
npm install

# 로컬 개발 서버 실행
npm run dev
```

컴포넌트 생성 후, 제공되는 로컬 주소(예: `http://localhost:3000/preview/[컴포넌트이름]`)를 통해 바로 결과를 확인할 수 있습니다.
