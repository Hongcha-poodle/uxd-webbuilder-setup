---
description: 생성된 프론트엔드 UI 컴포넌트의 품질을 보장하기 위한 유닛 테스트 및 정적 분석 검증 워크플로우
---

# Component Validation Workflow

`figma-to-code.md` 워크플로우 이후 실행되며, 작성된 Vue 컴포넌트의 무결성을 보장합니다.

## Prerequisites
- 생성되거나 수정이 완료된 1개 이상의 타겟 `.vue` 컴포넌트 파일.

## Workflow Steps

1. **규칙 로드**:
   - `@.ai/rules/development/expert-vue-tester.md` 를 읽고 에이전트 페르소나와 검증 기준을 적용합니다.

2. **검증 실행** → `expert-vue-tester` 위임:
   - 에이전트의 "작업 유형별 워크플로우" 규칙에 따라 정적 분석과 유닛 테스트 코드를 작성합니다.

3. **피드백 처리**:
   - **에러가 심각한 경우**: 결과를 `expert-figma-to-vue` 에이전트에게 피드백하여 Self-Correction을 유도합니다.
   - **에러가 없거나 경미한 경우**: `.spec.ts` 파일을 프로젝트에 저장하고, 검증 완료 보고서를 출력합니다.

4. **프리뷰 URL 제공 및 브라우저 오픈**:
   - `@.ai/rules/development/expert-nuxt-preview.md` 규칙에 따라 사용자에게 브라우저 확인 링크를 제공합니다.
   - `pages/preview/[name].vue` 라우터 구조가 없다면 스캐폴딩을 제안합니다.
   - 검증이 완료된 후, 사용자에게 다음과 같이 묻습니다:
     > "컴포넌트 제작과 검증이 모두 완료됐습니다. 로컬 주소(`http://localhost:3000/preview/[ComponentName]`)에서 바로 확인하시겠습니까?"
   - 사용자가 동의하면 OS에 맞는 명령어로 브라우저를 자동으로 엽니다:
     - **Windows**: `start http://localhost:3000/preview/[ComponentName]`
     - **macOS / Linux**: `open http://localhost:3000/preview/[ComponentName]`
   - 브라우저 오픈 명령 실행 전, 개발 서버(`npm run dev`)가 실행 중인지 포트 3000이 열려 있는지 확인합니다. 서버가 꺼져 있다면 먼저 서버를 실행하도록 안내합니다.
