---
description: 생성된 프론트엔드 UI 컴포넌트의 품질을 보장하기 위한 유닛 테스트 및 정적 분석 검증 워크플로우
---

# Component Validation Workflow

`figma-to-code.md` 또는 `legacy-to-vue.md` 워크플로우 이후 실행되며, 작성된 Vue 컴포넌트의 무결성을 보장합니다.

## Prerequisites
- 생성되거나 수정이 완료된 1개 이상의 타겟 `.vue` 컴포넌트 파일.

## Workflow Steps

1. **규칙 로드**:
   - `@.ai/rules/development/expert-vue-tester.md`를 읽고 검증 게이트, 테스트 작성 조건, 출력 형식을 적용합니다.

2. **검증 컨텍스트 전달**:
   - 타겟 `.vue` 파일 경로와 생성 배경(Figma 구현인지, legacy 변환인지, 기존 컴포넌트 수정인지)을 정리해 `expert-vue-tester`에 전달합니다.
   - `.nuxt/` 존재 여부, `nuxt.config.ts` 변경 여부, 기존 `.spec.ts` 파일 유무 등 검증에 필요한 현재 상태를 함께 전달합니다.

3. **검증 실행** -> `expert-vue-tester` 위임:
   - prepare/lint 실행 여부 판단, 정적 분석, 테스트 작성 또는 수동 QA 시나리오 제안은 `expert-vue-tester`의 기준을 그대로 따릅니다.
   - `npm run lint` 기준이 0 에러가 아니면 다음 단계로 진행하지 않습니다.

4. **피드백 처리**:
   - **치명적 오류**: 결과를 원본 생성 에이전트(`expert-figma-to-vue` 또는 `expert-legacy-to-vue`)로 돌려 Self-Correction을 수행합니다. 수정 후에는 `expert-vue-tester`의 lint 게이트부터 다시 실행합니다.
   - **경미하거나 없음**: 생성 또는 갱신된 `.spec.ts` 파일을 저장하고 검증 완료 보고서를 출력합니다.
   - **[HARD] 이후 흐름은 `@.ai/rules/development/component-guardrails.md`의 validation chain guardrail을 따릅니다.**

5. **[HARD] 시각적 비교 교정으로 핸드오프**:
   - 정적 검증이 통과되면 `@.ai/rules/development/component-guardrails.md`의 validation chain guardrail에 따라 **반드시** `/visual-diff` 워크플로우(`@.agent/workflows/visual-diff.md`)를 호출합니다.
   - 병렬 실행, 스크린샷 재사용, 롤백 기준 등 visual diff 세부 운영은 해당 워크플로우의 규칙을 따릅니다.

6. **프리뷰 URL 제공 및 브라우저 오픈**:
   - visual diff 단계가 끝나면 `@.ai/rules/development/expert-nuxt-preview.md` 규칙에 따라 사용자에게 프리뷰 URL을 제공합니다.
   - 브라우저 오픈 전 확인 문구와 개발 서버 확인 절차는 preview 규칙을 따릅니다.
