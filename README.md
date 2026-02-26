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
- **`.agent/workflows/`**: 명시적인 프로세스 워크플로우 정의 (`/figma_to_code`, `/component_validation`)

## 🚀 주요 기능 (Features)

1. **Figma to Vue 생성 (`expert-figma-to-vue`)**
   - 개발자가 Figma에서 추출한 데이터를 바탕으로 Tailwind CSS 기반의 `SFC (.vue)` 컴포넌트를 `~/components/` 내에 자동 생성합니다.
2. **동적 프리뷰 시스템 (`expert-nuxt-preview`)**
   - Storybook 없이도 `~/pages/preview/[ComponentName]` 경로를 통해 생성된 컴포넌트 UI를 브라우저에서 즉각 확인할 수 있습니다.
3. **생성 컴포넌트 검증 (`expert-vue-tester`)**
   - `/component_validation` 워크플로우를 통해 생성된 컴포넌트의 타입, 마크업 구조, 스타일을 QA하고 에러를 리뷰합니다.

## 🏃 시작하기 (Getting Started)

프로젝트를 처음 클론하거나 다운로드 받은 후, AI 워크플로우에 필요한 지침 폴더(`.ai`, `.agent`)를 로컬 환경에 설치해야 합니다. 제공된 설치 스크립트를 통해 이를 자동화할 수 있습니다.

### 1단계: AI 워크플로우 설치

운영체제에 맞는 스크립트를 터미널에서 실행하세요:

**Windows (PowerShell):**
```powershell
.\setup_windows.ps1
```

**macOS / Linux (Bash):**
```bash
./setup_mac.sh
```

*(참고: 추후 깃허브 원격 저장소가 설정되면 스크립트 내부의 소스 경로를 업데이트할 예정입니다.)*

### 2단계: 프론트엔드 종속성 설치 및 실행

Nuxt 4 개발 서버를 실행하여 작업 환경과 프리뷰 시스템을 가동합니다.

```bash
# 종속성 설치
npm install

# 로컬 개발 서버 실행
npm run dev
```

### 새로운 컴포넌트 생성 요청 방법
AI 챗이나 명령어 인터페이스 툴킷에 다음처럼 프롬프트를 입력하세요:
> "Figma 데이터를 바탕으로 `/figma_to_code` 워크플로우를 통해 컴포넌트를 만들어줘."

컴포넌트 생성 후, 제공되는 로컬 주소(예: `http://localhost:3000/preview/[컴포넌트이름]`)를 통해 바로 결과를 확인할 수 있습니다.
