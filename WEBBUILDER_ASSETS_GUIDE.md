# 웹빌더 Assets 운영 가이드

## 1. 왜 2단계로 운영하나요?

현재는 협의가 끝나기 전에 먼저 제작해야 하는 컴포넌트가 있습니다.
이 상태에서 최종 폴더 구조를 바로 강제하면 작업 흐름이 끊기거나, 나중에 다시 구조를 뒤집는 비용이 생길 수 있습니다.

그래서 운영 기준을 아래 2단계로 나눕니다.

1. 협의 전: 현재 기본 구조를 유지하면서도 파일명 규칙은 최종 기준으로 먼저 맞춥니다.
2. 협의 후: 합의된 최종 구조인 `shared / private / logos` 체계로 정리합니다.

이 방식의 목적은 다음과 같습니다.

- 지금 필요한 컴포넌트 제작을 멈추지 않기
- 나중에 asset 구조를 정리할 때 migration 비용을 줄이기
- 파일명, ownership, 로고 관리 원칙을 먼저 고정하기

---

## 2. 협의 전 임시 운영안

협의 전에는 현재 프로젝트의 기본 구조를 그대로 사용합니다.

```text
assets/
  images/
  icons/
  css/
```

### 저장 위치

- 일반 이미지: `~/assets/images/`
- SVG 아이콘: `~/assets/icons/`
- 전역 스타일 CSS: `~/assets/css/`
- 보험사 로고:
  - SVG면 우선 `~/assets/icons/`
  - PNG/JPG/WebP면 우선 `~/assets/images/`

### 협의 전 핵심 원칙

- 폴더 구조를 먼저 복잡하게 나누지 않습니다.
- 대신 파일명은 최종 운영안을 기준으로 먼저 정리합니다.
- 공용인지 전용인지 아직 확정되지 않은 asset도 일단 현재 구조에 저장할 수 있습니다.
- 보험사 로고는 파일명만 봐도 보험사와 용도를 알 수 있게 저장합니다.
- 폰트는 Pretendard CDN 웹폰트를 사용합니다.

### 협의 전 예시

- `~/assets/images/login-form-hero-main-banner.webp`
- `~/assets/images/claim-summary-card-bg-soft.png`
- `~/assets/icons/icon-arrow-right.svg`
- `~/assets/icons/samsung-fire-symbol.svg`
- `~/assets/images/db-insurance-horizontal.png`

---

## 3. 협의 후 최종 운영안

협의가 완료되면 아래 구조로 전환합니다.

```text
assets/
  css/
  images/
    shared/
    private/
      login-form/
      claim-summary-card/
  icons/
    shared/
    private/
      login-form/
      claim-summary-card/
  logos/
    samsung-fire/
      wordmark.svg
      symbol.svg
      horizontal.png
    db-insurance/
      wordmark.svg
      symbol.svg
      horizontal.png
```

### 최종 구조 의미

- `shared`
  - 2개 이상 컴포넌트에서 재사용되는 공통 asset
- `private`
  - 특정 컴포넌트 전용 asset
  - 반드시 `private/<component-slug>/` 하위 폴더를 만든 뒤 저장합니다.
- `logos`
  - 보험사 로고 전용 공통 저장소
  - 반드시 `logos/<insurer-slug>/` 하위 폴더를 만든 뒤 저장합니다.

### 최종 구조 예시

- `~/assets/images/private/login-form/hero-main-banner.webp`
- `~/assets/images/private/claim-summary-card/bg-soft.png`
- `~/assets/icons/shared/icon-arrow-right.svg`
- `~/assets/logos/samsung-fire/symbol.svg`
- `~/assets/logos/db-insurance/horizontal.png`

---

## 4. 파일명 규칙

모든 폴더명과 파일명은 `kebab-case`를 사용합니다.

### 4.1 일반 이미지

패턴:

```text
[component-or-domain]-[subject]-[purpose]-[variant].[ext]
```

예시:

- `login-form-hero-main-banner.webp`
- `claim-summary-card-bg-soft.png`
- `coverage-detail-empty-state.jpg`

### 4.2 SVG 아이콘

패턴:

```text
icon-[name]-[variant].svg
```

예시:

- `icon-arrow-right.svg`
- `icon-close-filled.svg`
- `icon-check-circle.svg`

### 4.3 보험사 로고

협의 전에는 보험사명과 역할을 파일명에 함께 넣고,
협의 후에는 보험사 폴더 아래 역할명만 파일명으로 사용합니다.

협의 전 예시:

- `samsung-fire-wordmark.svg`
- `samsung-fire-symbol.svg`
- `db-insurance-horizontal.png`

협의 후 예시:

- `~/assets/logos/samsung-fire/wordmark.svg`
- `~/assets/logos/samsung-fire/symbol.svg`
- `~/assets/logos/db-insurance/horizontal.png`

### 4.4 공통 규칙

- 해상도 변형은 `@2x`, `@3x` suffix를 사용합니다.
- 크기 변형은 필요할 때만 `-sm`, `-md`, `-lg`를 사용합니다.
- 같은 의미의 asset을 포맷만 다르게 둘 때는 basename을 유지합니다.
  - 예: `hero-main-banner.webp`, `hero-main-banner.png`
- 아래와 같은 이름은 사용하지 않습니다.
  - `final`
  - `new`
  - `v2`
  - 날짜형 임시 이름

---

## 5. 보험사 로고 운영 원칙

보험사별로 로고 형태가 2~3종 존재할 수 있으므로, 로고는 일반 이미지와 분리해 관리합니다.

### 기본 원칙

- 보험사 구분은 폴더로 처리합니다.
- 파일명은 브랜드명이 아니라 로고 역할 기준으로 통일합니다.
- 가능한 한 모든 보험사가 같은 의미의 로고 세트를 같은 이름으로 맞춥니다.
- 없는 형태는 억지로 만들지 않고, 실제 존재하는 것만 저장합니다.

### 기본 권장 역할명

- `wordmark`: 텍스트형 로고
- `symbol`: 심볼형 로고
- `horizontal`: 가로 조합형 로고
- `vertical`: 세로 조합형 로고가 있을 때만 추가

### 로고 예시

```text
assets/logos/
  samsung-fire/
    wordmark.svg
    symbol.svg
    horizontal.png
  db-insurance/
    wordmark.svg
    symbol.svg
```

### 로고 관리 원칙

- 보험사 로고는 컴포넌트 전용 폴더에 저장하지 않습니다.
- 여러 컴포넌트가 같은 보험사 로고를 쓰더라도 로고 파일은 한 곳에서만 관리합니다.
- 로고 교체가 필요하면 해당 보험사 폴더 안의 파일만 업데이트합니다.

---

## 6. 전환 시 이동 기준

협의가 끝나고 최종 구조로 전환할 때는 아래 기준으로 이동합니다.

### `shared`로 이동

- 2개 이상 컴포넌트에서 재사용되는 이미지/아이콘
- 추후에도 공통 자산으로 유지될 가능성이 높은 asset

### `private/<component-slug>`로 이동

- 특정 컴포넌트에서만 사용하는 이미지/아이콘
- 컴포넌트 삭제나 개편 시 함께 정리되어야 하는 asset

### `logos/<insurer-slug>`로 이동

- 보험사 로고
- 보험사별로 교체 가능성이 있는 공통 브랜드 asset

### 전환 예시

- `~/assets/images/login-form-hero-main-banner.webp`
  -> `~/assets/images/private/login-form/hero-main-banner.webp`
- `~/assets/icons/samsung-fire-symbol.svg`
  -> `~/assets/logos/samsung-fire/symbol.svg`
- `~/assets/icons/icon-arrow-right.svg`
  -> `~/assets/icons/shared/icon-arrow-right.svg`

---

## 7. Vue / Nuxt 실무 기준

현재 프로젝트의 Vue / Nuxt 실무 기준과도 맞도록 아래 원칙을 유지합니다.

- asset import는 계속 `~/assets/...` 절대 경로를 사용합니다.
- 래스터 이미지는 `<script setup>`에서 import 후 템플릿의 `:src`로 연결합니다.
- SVG 아이콘과 로고도 같은 방식의 import를 기본으로 합니다.
- 루트 `components/` 폴더와 asset 폴더는 완전히 다른 책임으로 관리합니다.
- `private`는 asset ownership 의미이고, 루트 `components/`와 연결된 폴더가 아닙니다.

예시:

```ts
import heroImage from '~/assets/images/private/login-form/hero-main-banner.webp'
import arrowIcon from '~/assets/icons/shared/icon-arrow-right.svg'
import samsungFireLogo from '~/assets/logos/samsung-fire/symbol.svg'
```

---

## 8. 실무 체크리스트

새 asset을 추가할 때 아래 순서로 판단합니다.

1. 이 asset이 2개 이상 컴포넌트에서 재사용되는가?
2. 보험사 로고인가?
3. 특정 컴포넌트 전용인가?
4. 파일명이 최종 규칙에 맞는가?
5. 임시 단계에서는 현재 폴더 구조를 유지하고 있는가?
6. 협의 후에는 `shared / private / logos` 구조로 옮길 수 있는 이름인가?

### 운영 체크리스트

- 협의 전에는 구조보다 파일명 규칙을 우선합니다.
- 협의 완료 전 대규모 경로 개편은 하지 않습니다.
- `private` 바로 아래에 파일을 두지 않습니다.
- `logos` 바로 아래에 파일을 두지 않습니다.
- 보험사 로고는 보험사 slug와 역할명 기준으로만 저장합니다.

---

## 9. 최종 정리

현재 단계의 실무 원칙은 아래 한 줄로 정리할 수 있습니다.

> 지금은 기존 `assets/images`, `assets/icons`, `assets/css` 구조를 유지하되, 파일명은 최종 체계 기준으로 먼저 맞춘다.

협의가 끝나면 아래 방향으로 전환합니다.

> 공용 자산은 `shared`, 컴포넌트 전용 자산은 `private/<component-slug>`, 보험사 로고는 `logos/<insurer-slug>`로 정리한다.
