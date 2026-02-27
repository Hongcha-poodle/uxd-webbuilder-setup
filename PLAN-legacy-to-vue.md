# Plan: Legacy HTML/CSS/JS → Vue SFC 변환 워크플로우 추가

## Context

이 프로젝트는 Figma → Vue 컴포넌트 변환 워크플로우를 가진 AI 오케스트레이션 프레임워크입니다.
기존 `figma-to-code` 워크플로우와 동일한 4-레이어 패턴(Skill → Orchestrator → Expert Agent → Validation)으로, 순수 HTML/CSS/JS 레거시 컴포넌트를 Vue 3 SFC로 변환하는 신규 `legacy-to-vue` 워크플로우를 추가합니다.

---

## 생성/수정 파일 목록 (실행 순서)

| 순서 | 파일 | 작업 |
|------|------|------|
| 1 | `.ai/rules/development/expert-legacy-to-vue.md` | 신규 생성 |
| 2 | `.ai/skills/legacy-to-vue.md` | 신규 생성 |
| 3 | `.agent/workflows/legacy-to-vue.md` | 신규 생성 |
| 4 | `.ai/core.md` | 기존 파일 수정 (1줄 추가) |

---

## 파일별 상세 계획

### 1. `.ai/rules/development/expert-legacy-to-vue.md` (신규)

기존 `expert-figma-to-vue.md` 구조를 따르며, 다음 내용을 포함:

**HARD Rules (10개)**:
- SFC 형식, `<script setup lang="ts">` 블록 순서
- TypeScript: `any` 금지, `type` alias 사용, `withDefaults` 활용
- CSS → Tailwind 결정 트리:
  - Tailwind로 변환: 표준 layout, spacing, color, `@media` → 반응형 prefix
  - 임의값 허용: `w-[141px]`, `text-[13px]`
  - `<style scoped>` 유지: `@keyframes`, `::before/::after`, `grid-template-areas`, CSS 변수
- HTML → Template: 시맨틱 태그 보존, aria 속성 보강, 인라인 이벤트 → `@click` 등
- JS → Composition API 변환 매핑표:

| 레거시 JS | Vue/Nuxt 변환 |
|-----------|--------------|
| `document.querySelector` | `ref` (template ref) |
| `addEventListener('click')` | `@click` 바인딩 |
| `var/let x = primitive` | `ref<Type>()` |
| `var obj = {}` | `reactive<ObjType>()` |
| `fetch()` / XHR | `useFetch()` / `useAsyncData()` |
| `classList.toggle()` | `:class` + `ref<boolean>` |
| `localStorage` | `useState()` / `useCookie()` |
| `DOMContentLoaded` | `onMounted()` |
| `window.location.href` | `navigateTo()` |
| jQuery `$()`, `$.ajax()` | ref + `useFetch()` 로 대체 |

- 제3자 라이브러리: jQuery → native 대체, 알 수 없는 라이브러리 → `Dependencies Report`에 기록 + `<!-- TODO -->` placeholder
- 복수 파일 병합: HTML + CSS + JS → 단일 `.vue`
- 저장 경로: `components/[PascalCase명].vue`

**작업 유형별 워크플로우 (A/B/C)**:
- A: 신규 변환 (분석 → 변환 → 보고 → 저장)
- B: 기존 컴포넌트 부분 수정 (기존 로직 보존)
- C: `/component-validation` 워크플로우에 테스트 위임

---

### 2. `.ai/skills/legacy-to-vue.md` (신규)

기존 `figma-to-vue.md` 포맷을 정확히 따름:

```markdown
---
description: 기존 HTML/CSS/JavaScript 레거시 코드를 Vue 3 SFC로 변환하는 스킬
trigger: "legacy, html to vue, css to tailwind, javascript to vue, 레거시 변환, html 변환, legacy-to-vue, 코드 마이그레이션"
---

- 담당 Sub-agent: expert-legacy-to-vue
- Rule Path: @.ai/rules/development/expert-legacy-to-vue.md
- Workflow: .agent/workflows/legacy-to-vue.md
```

---

### 3. `.agent/workflows/legacy-to-vue.md` (신규)

기존 `figma-to-code.md` 4단계 패턴을 따름:

1. **규칙 로드**: expert-legacy-to-vue + 언어 규칙 3개 로드
2. **초기 확인 및 소스 수집**: 입력방식(붙여넣기 vs 파일경로) 결정, 컴포넌트명 PascalCase 확정
3. **코드 변환 및 생성**: SFC 생성, Dependencies Report 첨부, 사용자 리뷰 후 `components/`에 저장
4. **검증 핸드오프**: `/component-validation` 워크플로우 호출

---

### 4. `.ai/core.md` (수정)

현재 15번째 줄, Figma 라우팅 룰 다음에 한 줄 추가:

**추가할 내용**:
```
   - *Legacy to Vue Conversion*: If the request is for converting existing HTML/CSS/JavaScript legacy code to Vue components, the Orchestrator MUST route the request to the `/legacy-to-vue` workflow (`@.agent/workflows/legacy-to-vue.md`).
```

**위치**: line 15 (기존 Figma 라우팅 줄) 바로 다음 줄

---

## 검증 방법

1. 워크플로우 파일 생성 확인 후, 레거시 HTML/CSS/JS 스니펫을 채팅에 붙여넣어 변환 요청
2. 오케스트레이터가 `legacy-to-vue` 워크플로우로 올바르게 라우팅되는지 확인
3. 생성된 `.vue` 파일이 `components/` 폴더에 저장되는지 확인
4. `/component-validation` 자동 호출 및 `http://localhost:3000/preview/[ComponentName]` URL 제공 확인
5. 제3자 라이브러리(예: jQuery 포함 코드) 입력 시 `Dependencies Report` 생성 확인
