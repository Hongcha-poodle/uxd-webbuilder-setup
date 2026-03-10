---
description: expert-visual-diff의 교정 루프 및 리포트 예시 모듈
---

# Expert Visual Diff Loop And Report Module

이 모듈은 `@.ai/rules/development/expert-visual-diff.md`의 상세 실행 예시를 담습니다.
기본 규칙을 읽은 뒤, 실제 교정 루프를 수행하거나 리포트 포맷이 필요할 때만 추가 로드합니다.

## 1. Diff Analysis Report Example

```text
=== Visual Diff Report ===
[LAYOUT-1] 헤더 영역: 수평 정렬이어야 하나 수직으로 쌓임 (flex-row 필요)
[SPACING-1] 입력 필드 간격: gap이 원본 대비 좁음 (gap-2 → gap-4)
[COLOR-1] 배경색: bg-white이나 원본은 bg-gray-50
[MINOR-1] 하단 여백 1px 차이 (무시 가능)
=========================
수정 대상: 3건 | 무시: 1건
```

## 2. Correction Loop Reference

### 동일 카테고리 배치 수정 (Same-Category Batch Fix)

- 동일 카테고리(예: COLOR, TYPOGRAPHY)에 속하는 이슈가 3건 이상이고, 수정이 서로 독립적(다른 요소에 적용)인 경우, 한 번의 iteration에서 동일 카테고리 이슈를 일괄 수정할 수 있습니다.
- 배치 수정 후 회귀가 발생하면 전체를 롤백하고 개별 수정으로 전환합니다.
- 이 최적화는 iteration 횟수를 줄여 전체 교정 시간을 단축합니다.

```text
iteration = 0
consecutive_rollbacks = 0

WHILE (수정 대상 이슈 남아있음) AND (iteration < 5) AND (consecutive_rollbacks < 2):
    1. 가장 높은 우선순위의 이슈 1개를 선택
    2. 현재 .vue 파일 상태를 `before_fix`로 저장
    3. 해당 이슈에 대한 Tailwind 클래스 수정을 적용 (부분 수정만 — 전체 파일 rewrite 금지)
    3-1. [HARD] 스타일 보존 검증: before_fix 대비 (a) <style scoped> 블록 존재 여부, (b) 수정 대상 외 Tailwind 클래스 누락 여부를 즉시 확인. 실패 시 ROLLBACK.
    4. 브라우저 스크린샷을 다시 캡처
    5. Figma 원본과 재비교하여 새로운 이슈 목록 생성
    6. 판정:
       - IF 해당 이슈가 해소됨 AND 새로운 이슈 없음:
           -> COMMIT (수정 확정)
           -> consecutive_rollbacks = 0
       - ELSE IF 해당 이슈가 해소됨 BUT 새로운 이슈 발생:
           -> ROLLBACK (before_fix로 복원)
           -> consecutive_rollbacks += 1
           -> 리포트에 "수정 시 부작용 발생" 기록
       - ELSE IF 해당 이슈가 미해소 또는 악화:
           -> ROLLBACK (before_fix로 복원)
           -> consecutive_rollbacks += 1
           -> 리포트에 "수정 무효" 기록
    7. iteration += 1

END WHILE
```

## 3. Final Report Template

```text
=== Visual Diff Correction Report ===

요약
- 총 발견 이슈: N건
- 자동 교정 성공: M건
- 롤백 (부작용 방지): K건
- 무시 (MINOR): J건
- 미해결 (수동 확인 필요): L건

교정 완료 항목
- [LAYOUT-1] 헤더 flex 방향 수정: flex-col -> flex-row
- [SPACING-1] 입력 필드 gap 조정: gap-2 -> gap-4

롤백된 항목 (부작용 발생)
- [COLOR-1] bg-white -> bg-gray-50 변경 시 하위 요소 가시성 저하 발생

미해결 항목 (수동 확인 필요)
- [SIZE-2] 아이콘 크기 정밀 조정 필요 - 구조 변경 수반

참고
- MINOR 이슈 1건은 브라우저 렌더링 차이로 무시됨
=====================================
```
