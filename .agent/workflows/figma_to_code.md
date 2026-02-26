---
description: Figma 디자인 스크린샷 또는 노드를 Vue 컴포넌트 코드로 변환하는 워크플로우
---

# Figma to Vue Component Conversion Workflow

이 워크플로우는 사용자가 제공한 Figma의 특정 Node ID 또는 화면 스크린샷을 기반으로, 팀의 개발 표준에 맞는 Vue 컴포넌트 코드를 자동으로 생성합니다.

## Prerequisites
- 사용자가 변환할 대상(Figma Node ID, 화면 스크린샷, 화면 요건 등)을 제공해야 합니다.
- 개발 환경 스택: Vue 3.5.25, Nuxt 4.2.2, TypeScript(Nuxt 내장), Node.js 25.2.1

## Workflow Steps

1. **지시사항 및 기본 확인 (초기 대화 시)**:
   - 사용자가 대화를 시도하거나 변환 명령을 내리면 다음 3가지를 반드시 확인/안내합니다:
     1. 해당 작업이 **신규 Vue 컴포넌트 생성**인지 **기존 컴포넌트 수정**인지 먼저 묻습니다.
     2. Figma 노드 연결 데이터 수집을 위해 **Figma Dev Mode MCP** 서버를 사용함을 명시합니다.
     3. 컴포넌트에 사용자가 직접 넣어야 하는 외부 이미지(png, jpg)나 로컬 SVG 아이콘 요소가 있는 경우, 자산 파일들을 제공하는 방법과 개발 시 반영 방법에 대해 안내합니다.
   - 오케스트레이터는 사용자의 요청에서 Figma Node ID를 추출하거나 첨부된 스크린샷을 분석합니다.
   
2. **사전 지식 및 규칙 로드**:
   - 전문 에이전트 규칙인 `.ai/rules/development/expert-figma-to-vue.md` 파일을 읽고 적용합니다.
   - 프로젝트 코딩 표준 준수를 위해 `.ai/rules/language/` 경로 하위의 규칙들(`vue-nuxt.md`, `typescript.md`, `tailwind.md`)을 읽고 적용합니다.

3. **데이터 수집 (Figma MCP 사용)**:
   - *Figma Node ID가 주어진 경우*: Figma MCP Server 도구(`mcp_figma-dev-mode-mcp-server_get_design_context` 등)를 호출하여 해당 노드의 메타데이터(크기, 폰트, 색상, 배치 등)를 가져옵니다.
   - *스크린샷이 주어진 경우*: 시각적 분석을 통해 UI 요소들을 역설계하고, 필요한 Tailwind 클래스를 유추합니다.

4. **코드 생성 (expert-figma-to-vue 에이전트 실행)**:
   - 다음 요구사항을 갖춘 결과물(Vue 컴포넌트 코드)을 작성합니다:
     - 시맨틱 HTML 태그 사용
     - `defineProps`, `defineEmits`를 활용한 TypeScript 타이핑
     - `data-node-id` 속성 보존
     - 시각적으로 뛰어난 Tailwind CSS 스타일링

5. **결과물 제공 및 저장 확인**:
   - 생성된 코드를 사용자에게 리뷰용으로 제공합니다.
   - 코드에 문제가 없다면, 사용자의 지시에 따라 프로젝트 내 적절한 폴더(예: `components/`)에 새로운 `.vue` 파일로 저장합니다.

6. **테스트 및 오류 검증 (Testing & Validation)**:
   - 컴포넌트 생성이 완료되면 품질 보증을 위해 `/component_validation` 워크플로우를 호출하여 후속 작업을 위임(Handoff)합니다.
   - `expert-vue-tester` 에이전트가 이를 이어받아 정적 코드 분석 및 단위 테스트(`.spec.ts`) 작성을 수행하고, 피드백 루프를 통해 무결성을 확보합니다.
