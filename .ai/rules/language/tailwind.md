# Tailwind CSS 규칙 (tailwind.md)

이 문서는 프로젝트 내 스타일링 작성에 대한 Tailwind CSS의 기본 원칙을 정의합니다.

## 핵심 원칙
- **유틸리티 퍼스트 (Utility-First)**: 거의 모든 스타일링은 Tailwind CSS의 유틸리티 클래스를 사용하여 템플릿 단에서 해결합니다. 
- **`<style scoped>` 지양**: 유지보수와 일관성을 위해 `<style scoped>`와 커스텀 CSS 작성은 기본적으로 금지합니다. 단, 복잡한 CSS 콤비네이터 처리, 키프레임 애니메이션 외 Tailwind로 처리가 불가능한 극소수의 경우에만 한정적으로 허용합니다.

## 테마 변수 활용
- `.ai/rules/development/expert-figma-to-vue.md` 및 `tailwind.config.ts` 에 정의된 확장 변수를 적극적으로 활용합니다.
- **Colors**: `bg-primary-orange`, `text-text-primary`, `bg-bg-light-gray`, `text-status-error` 등 테마별로 정의된 시맨틱/키(Key) 컬러를 사용하여 하드코딩된 헥스 코드(`bg-[#FF9B00]` 등) 사용을 피합니다.
- **디자인 임의 값(Arbitrary values)**: 요소 크기나 여백(spacing), 폰트 사이즈 등에서 테마에 잡히지 않은 픽셀 단위(예: `w-[141px]`, `px-[20px]`, `text-[16px]`) 표현은 디자인 가이드(Figma)에 기반하여 허용합니다만, 공통화가 시급한 값은 설정에 반영하고 사용합니다.

## 레이아웃 컨테이너 표준

모든 컴포넌트는 아래의 레이아웃 제약을 반드시 준수합니다:

- **최대 너비**: `max-w-container` (768px) — `tailwind.config.ts`의 `theme.extend.maxWidth.container`에 정의
- **좌우 패딩**: `px-[20px]` — 컨텐츠가 컨테이너 안에서 좌우 20px 여백을 유지하며 fill
- **기본 래퍼 클래스 조합**: `w-full max-w-container mx-auto px-[20px]`

### 적용 원칙

- **페이지 수준 컴포넌트**의 루트 엘리먼트 또는 최상위 컨텐츠 래퍼에 위 클래스를 적용합니다.
- **하위(자식) 컴포넌트**가 이미 `max-w-container`를 적용한 부모 안에 렌더링되는 경우, 자식은 이 클래스를 중복 적용하지 않습니다.
- 전체 너비 배경(full-bleed background)이 필요한 경우, 배경은 바깥 엘리먼트에, 컨텐츠는 안쪽 래퍼로 분리합니다:
  ```html
  <!-- full-bleed 배경 + 컨텐츠 제약 패턴 -->
  <section class="w-full bg-bg-light-gray">
    <div class="max-w-container mx-auto px-[20px]">
      <!-- 실제 컨텐츠 -->
    </div>
  </section>
  ```

### 레이아웃 표준 예외

아래 컴포넌트 유형은 `max-w-container` 및 `px-[20px]`를 적용하지 않습니다:

| 유형 | 이유 | 대체 패턴 |
|------|------|---------|
| **모달 (Modal)** | 뷰포트 중앙 고정, 독자적 너비 필요 | `fixed inset-0 flex items-center justify-center` |
| **바텀시트 (Bottom Sheet)** | 하단 전체 너비 차지 | `fixed bottom-0 inset-x-0 w-full` |
| **전체화면 오버레이** | 뷰포트 100% 점유 | `fixed inset-0 w-full h-full` |
| **툴팁/팝오버** | 앵커 기준 위치, 제약 너비 불필요 | `absolute` 포지셔닝 |

## 컴포넌트 구조화
- 클래스가 너무 길어 가독성을 해치는 구조가 심화될 경우, 레이아웃/모듈을 하위 컴포넌트로 적절하게 분리하여 Vue 컴포넌트 단위로 재사용합니다. (`@apply` 지시어 사용 금지 권장)

## CSS 유실 방지 규칙 (Style Preservation)

컴포넌트 수정 시 스타일이 의도치 않게 삭제되는 것을 방지하기 위한 canonical guardrail은 `@.ai/rules/development/component-guardrails.md`를 따릅니다.
이 문서에서는 Tailwind 관점의 추가 제약만 유지합니다.

### Tailwind 전용 추가 확인
- 긴 `class` 속성(3줄 이상)은 부분 수정 시 잘림(truncation)이 발생하기 쉬우므로, 수정 전후 클래스 수를 비교합니다.
- `<style scoped>` 내 CSS 선언을 수정할 때 Tailwind 클래스와 동일 속성 충돌이 없는지 확인합니다.
- arbitrary value가 기존 토큰으로 대체 가능한 경우에는 반드시 토큰명으로 치환합니다.

### CSS 변수 → Tailwind 토큰 매핑
- Figma에서 추출한 CSS 변수를 사용할 때, 다음 우선순위를 따릅니다:
  1. `tailwind.config.ts`의 `theme.extend.colors`에 이미 등록된 시맨틱 토큰 사용 (예: `bg-primary-orange`)
  2. 미등록 값은 arbitrary value 문법 사용 (예: `bg-[#FF9B00]`)
  3. 반복적으로 사용되는 미등록 값은 `tailwind.config.ts`에 신규 토큰으로 등록 후 사용
- arbitrary value로 하드코딩된 색상값이 `tailwind.config.ts`의 기존 토큰과 동일한 값인 경우, 반드시 토큰명으로 대체합니다 (예: `bg-[#FF9B00]` → `bg-primary-orange`).
