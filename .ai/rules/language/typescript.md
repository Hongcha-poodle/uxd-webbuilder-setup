# TypeScript 규칙 (typescript.md)

이 문서는 프로젝트의 TypeScript 작성 스탠다드를 정의합니다. 프로젝트는 Nuxt 4 환경에 내장된 TypeScript와 `strict: true` 설정을 기반으로 합니다.

## 핵심 원칙
- **`any` 타입 금지**: `any` 타입의 사용은 철저히 배제합니다. 도저히 타입을 특정할 수 없는 경우에만 `unknown`을 사용하고 적절한 타입 가드를 적용합니다.
- **`type` alias 우선**: 일반적으로 객체 정의 및 속성 맵핑 시에는 `interface` 대신 `type` alias 사용을 권장합니다.

## Vue 컴포넌트(SFC) 내 타이핑
- **Props**: `defineProps` 매크로에 제네릭 타입을 전달하여 Props의 타입을 명확하게 정의합니다.
  ```typescript
  type Props = {
    title: string
    isActive?: boolean
  }
  const props = withDefaults(defineProps<Props>(), { isActive: false })
  ```
- **Emits**: `defineEmits` 매크로 역시 외부 제네릭 타입 문법을 기반으로 이벤트 시그니처를 정의합니다.
  ```typescript
  type Emits = {
    (e: 'update:active', value: boolean): void
    (e: 'click-event'): void
  }
  const emit = defineEmits<Emits>()
  ```

## 전역 타입 및 인터페이스
- 비즈니스 로직과 깊게 연관된 공통 타입, API 응답 인터페이스 등은 `types/` 디렉토리를 활용하여 공통으로 선언하고 재구현을 방지합니다.
