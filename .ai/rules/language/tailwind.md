# Tailwind CSS 규칙 (tailwind.md)

이 문서는 프로젝트 내 스타일링 작성에 대한 Tailwind CSS의 기본 원칙을 정의합니다.

## 핵심 원칙
- **유틸리티 퍼스트 (Utility-First)**: 거의 모든 스타일링은 Tailwind CSS의 유틸리티 클래스를 사용하여 템플릿 단에서 해결합니다. 
- **`<style scoped>` 지양**: 유지보수와 일관성을 위해 `<style scoped>`와 커스텀 CSS 작성은 기본적으로 금지합니다. 단, 복잡한 CSS 콤비네이터 처리, 키프레임 애니메이션 외 Tailwind로 처리가 불가능한 극소수의 경우에만 한정적으로 허용합니다.

## 테마 변수 활용
- `.ai/rules/development/expert-figma-to-vue.md` 및 `tailwind.config.ts` 에 정의된 확장 변수를 적극적으로 활용합니다.
- **Colors**: `bg-primary-orange`, `text-text-primary`, `bg-bg-light-gray`, `text-status-error` 등 테마별로 정의된 시맨틱/키(Key) 컬러를 사용하여 하드코딩된 헥스 코드(`bg-[#FF9B00]` 등) 사용을 피합니다.
- **디자인 임의 값(Arbitrary values)**: 요소 크기나 여백(spacing), 폰트 사이즈 등에서 테마에 잡히지 않은 픽셀 단위(예: `w-[141px]`, `px-[20px]`, `text-[16px]`) 표현은 디자인 가이드(Figma)에 기반하여 허용합니다만, 공통화가 시급한 값은 설정에 반영하고 사용합니다.

## 컴포넌트 구조화
- 클래스가 너무 길어 가독성을 해치는 구조가 심화될 경우, 레이아웃/모듈을 하위 컴포넌트로 적절하게 분리하여 Vue 컴포넌트 단위로 재사용합니다. (`@apply` 지시어 사용 금지 권장)
