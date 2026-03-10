---
description: Figma 원본 디자인과 브라우저 렌더링 결과를 시각적으로 비교하고, 회귀 없이 안전하게 교정하는 워크플로우
---

# Visual Diff Correction Workflow

`component-validation` 워크플로우의 정적 검증이 통과되고, 사용자가 visual diff 진행을 승인한 후 실행되며, 생성된 Vue 컴포넌트가 원본 디자인과 **시각적으로 일치**하는지 검증하고 교정합니다.

## Prerequisites
- 정적 검증(`component-validation`)이 통과된 1개 이상의 타겟 `.vue` 컴포넌트 파일.
- 비교 기준이 되는 Figma 원본 디자인에 접근 가능한 Figma MCP 연결 및 노드 정보
- Nuxt 개발 서버가 `localhost:3000`에서 실행 중이어야 합니다.

## Workflow Steps

> 다중 타겟 처리 원칙: 타겟이 여러 개인 경우, 부모-자식 관계가 없는 독립 컴포넌트는 **병렬 실행**을 허용합니다. 부모-자식 관계가 있는 컴포넌트만 순차 실행합니다.

### 1. 규칙 로드
- `@.ai/rules/development/expert-visual-diff.md`를 읽고 에이전트 페르소나, Anti-Regression Safeguards, 이슈 분류 체계를 적용합니다.
- style preservation, partial edit, validation chain에 대해서는 `@.ai/rules/development/component-guardrails.md`를 함께 적용합니다.

### 2. 기준 이미지 수집 (Baseline Capture)

1. **Figma 원본 획득**:
   - Figma MCP의 `get_screenshot`으로만 노드 스크린샷을 획득합니다.
   - 사용자 제공 이미지나 수동 업로드 스크린샷은 기준 이미지로 사용하지 않습니다.
   - 노드 정보가 없거나 MCP를 사용할 수 없어 `get_screenshot`을 실행할 수 없는 경우, 이 워크플로우를 건너뛰고 리포트에 "시각 비교 미수행 - Figma MCP get_screenshot 기준 이미지 확보 실패"로 기록합니다.

2. **브라우저 렌더링 캡처**:
   - 개발 서버 실행 여부를 확인합니다 (포트 3000).
   - **HMR 안정화 대기**: 파일 수정 직후에는 Vite HMR 갱신이 완료될 때까지 **최소 2초 대기** 후 스크린샷을 캡처합니다. 이는 멀티 에이전트 동시 쓰기 시 HMR 과부하로 인한 불완전한 렌더링 캡처를 방지합니다.
   - `http://localhost:3000/preview/raw/[ComponentName]` URL의 스크린샷을 캡처합니다.
   - 캡처 도구가 없는 경우 사용자에게 브라우저 스크린샷을 요청합니다.

3. **`.vue` 파일 백업**:
   - 대상 컴포넌트 파일의 전체 내용을 메모리에 저장하여 `baseline` 스냅샷으로 보존합니다.

### 3. 차이점 분석 (Diff Analysis) → `expert-visual-diff` 위임

- Figma MCP `get_screenshot`으로 획득한 원본과 브라우저 렌더링을 시각적으로 비교합니다.
- 에이전트의 **이슈 분류 체계**(LAYOUT → SPACING → SIZE → COLOR → TYPOGRAPHY → BORDER → MINOR)에 따라 차이점을 분류하고 우선순위를 부여합니다.
- `MINOR` 카테고리 이슈는 교정 대상에서 자동 제외하고 리포트에만 기록합니다.
- 차이점이 하나도 없으면 "✅ 디자인 일치 - 교정 불필요"로 워크플로우를 종료합니다.

### 4. 교정 루프 실행 (Correction Loop) → `expert-visual-diff` 위임

에이전트의 **Phase 3: 교정 루프** 절차를 따릅니다:

- **반복 조건**: `수정 대상 이슈 남아있음` AND `iteration < 5` AND `consecutive_rollbacks < 2`
- **매 반복(iteration)마다**:
  1. 가장 높은 우선순위의 이슈 **1개만** 선택
  2. 수정 전 파일 상태를 `before_fix`로 저장
  3. Tailwind 클래스 수준의 수정만 적용 (구조 변경 금지, 로직 변경 금지)
  4. 브라우저 스크린샷 재캡처
  5. Figma 원본과 재비교
  6. **판정**:
     - ✅ 이슈 해소 + 새 이슈 없음 → **COMMIT** (수정 확정)
     - ⚠️ 이슈 해소했으나 새 이슈 발생 → **ROLLBACK** (부작용 방지)
     - ❌ 이슈 미해소 또는 악화 → **ROLLBACK** (무의미한 변경 방지)

- **스크린샷 캡처 최적화**:
  - 수정을 적용한 후 HMR 갱신 완료까지 **2초 대기** 후 스크린샷을 캡처합니다.
  - ROLLBACK이 발생하여 파일이 `before_fix` 상태로 복원된 경우, 복원 전에 이미 캡처한 스크린샷(`before_fix` 시점)을 재사용하고 재캡처를 생략합니다.

- **동일 카테고리 배치 수정**: `expert-visual-diff` 규칙의 "동일 카테고리 배치 수정" 조건이 충족되면 한 iteration에서 같은 카테고리 이슈를 일괄 처리하여 iteration 횟수를 절감합니다.

- **즉시 중단 조건**:
  - 연속 2회 롤백 발생 시 루프를 즉시 중단합니다.
  - 이는 해당 이슈가 스타일 수정만으로는 해결 불가능하다는 신호입니다.

### 5. 최종 리포트 출력

에이전트의 **Phase 4: 최종 리포트** 형식에 따라 결과를 정리합니다:
- 총 이슈 수, 교정 성공 수, 롤백 수, 무시 수, 미해결 수를 요약합니다.
- 미해결 항목에 대해서는 구체적인 수동 수정 가이드를 제안합니다.

### 6. 프리뷰 URL 제공

- 교정이 완료된 후 사용자에게 최종 확인 링크를 제공합니다:
  > "시각적 교정이 완료됐습니다. 아래 주소에서 최종 결과를 확인해 주세요."
  > `http://localhost:3000/preview/[ComponentName]`

## Abort Conditions (워크플로우 건너뛰기 조건)

다음 조건 중 하나라도 해당하면 이 워크플로우를 건너뛰고 그 사유를 리포트합니다:
- Figma MCP `get_screenshot`을 사용할 수 없거나 노드 정보가 없는 경우
- 브라우저 스크린샷을 캡처할 수단이 없는 경우
- 개발 서버가 실행 중이지 않고 사용자가 실행을 거부한 경우
