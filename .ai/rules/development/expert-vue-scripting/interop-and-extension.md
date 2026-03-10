---
description: 레거시 상호작용 변환 규칙과 패턴 확장 가이드 모듈
---

# Expert Vue Scripting Interop And Extension

이 모듈은 글로벌 함수, DOM 직접 접근, 외부 의존성 처리와 새 패턴 추가 규칙을 다룹니다.

## 컴포넌트 간 통신 (Inter-component Communication)

레거시 코드에서 발견되는 글로벌 함수 호출·타 컴포넌트 DOM 직접 접근은 Vue에서 아래 규칙을 따릅니다.

### 변환 규칙

| 레거시 패턴 | Vue 변환 | 비고 |
|------------|---------|------|
| `window.globalFunc()` | `emit('이벤트명')` → 부모에서 처리 | 단방향 상향 통신 |
| `document.querySelector('[data-component="..."]')` | 부모가 상태를 관리하고 필요 API는 수동 구현 | 단방향 하향 통신 |
| `new OtherComponent(el)` | `<ChildComponent :prop="value" />` | 선언적 자식 포함 |
| `window.addEventListener('custom-event')` | `provide`/`inject` 또는 composable | 깊은 컴포넌트 트리 |
| `document.body.style.overflow = 'hidden'` | composable (`useBodyScrollLock`) | 전역 부수효과 격리 |

### TODO 플레이스홀더 규칙

변환 시점에 즉시 해결할 수 없는 외부 의존성은 `<!-- TODO -->` 코멘트로 표시합니다:

```html
<!-- TODO: [window.showSpinner] — 부모 컴포넌트에서 emit으로 처리 필요 -->
<!-- TODO: [T005_E02_5] — 부모 컴포넌트에서 props/v-model로 상태 전환 필요 -->
<!-- TODO: [T006_F01_4.setUserData] — props 바인딩으로 데이터 전달 구조 전환 필요 -->
```

---

## 확장 가이드 (Extension Guide)

새로운 인터랙션 패턴이 발견될 경우, 아래 템플릿에 따라 본 문서에 패턴을 추가합니다.

### 패턴 추가 템플릿

```markdown
### P[번호]. [패턴 이름] ([English Name])

[1~2문장 설명: 어떤 상황에서 적용하는지]

**구현 원칙**:
- [핵심 원칙 1]
- [핵심 원칙 2]
- [핵심 원칙 3]

\`\`\`vue
<script setup lang="ts">
// 코드 예시
</script>
\`\`\`
```

### 패턴 번호 규칙
- `P01`~`P06`: Forms (`patterns-forms.md`) — 폼 입력, 검증, 상태 전이
- `P07`~`P10`: Interactive UI (`patterns-interactive-ui.md`) — 탭, 토글, 아코디언, CSS 애니메이션+JS 제어
- `P11`~`P14`: Motion And Display (`patterns-motion-display.md`) — 데이터 표시, 모달 트리거, 무한 스크롤, 리사이즈
- `P15`~: 신규 패턴은 소속 모듈 파일에 순차 번호로 추가합니다.

> 현재 등록된 패턴: P01~P14 (총 14개)
