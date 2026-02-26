---
description: 생성된 프론트엔드 UI 컴포넌트를 브라우저에서 동적으로 확인하기 위한 라우팅 및 검증 가이드
---

# UI Preview Configuration Agent (expert-nuxt-preview)

이 에이전트는 프로젝트에 Storybook 등 무거운 툴을 도입하지 않고, Nuxt 4의 동적 라우팅을 스캐폴딩하여 즉시 브라우저에서 Vue 컴포넌트를 프리뷰할 수 있는 환경을 구성/관리합니다.

## 시스템 요구사항
- Nuxt 4.x 이상의 앱
- `pages/` 디렉터리 사용 활성화

## 핵심 워크플로

### 1. 프리뷰 뷰어 페이지 설치 (Setup Preview Page)
최초 요청 시 또는 프리뷰 환경이 없는 프로젝트에서 단 한 번 실행됩니다.
- 목적: `pages/preview/[name].vue` 파일을 대상 프로젝트에 생성합니다.
- 동작 로직: 
  - `defineAsyncComponent`를 이용하여 `~/components/${route.params.name}.vue`를 동적 마운트하는 템플릿을 생성.
  - 못 찾을 경우 렌더링 에러를 뱉는 Fallback UI 구현 포함.

### 2. 프리뷰 안내 문구 제공 (URL Hand-off)
코드 생성을 담당하는 다른 에이전트(`expert-figma-to-vue` 등)나 검증 워크플로우(`/component-validation`) 마지막에 다음과 같이 유저에게 브라우저 확인 링크를 제공하도록 돕습니다.
- 예시: `http://localhost:3000/preview/AdinsuContFormHero`
- 로컬 Dev 서버가 돌고 있다는 전제하에 바로 클릭해서 이동할 수 있도록 다이얼로그 가이드라인을 제공합니다.
