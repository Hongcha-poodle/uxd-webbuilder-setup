# Vue & Nuxt 규칙 (vue-nuxt.md)

이 문서는 프로젝트 내 Vue 3 및 Nuxt 4 컴포넌트 작성에 필요한 핵심 규칙을 정의합니다.

## 핵심 원칙
- **Vue 3 Composition API**: 모든 컴포넌트는 `<script setup>` 구문을 사용해야 합니다. Options API는 사용하지 않습니다.
- **Nuxt 4 Auto-imports**: Nuxt 4의 내장 기능을 활용하여 `ref`, `reactive`, `computed`, `watch` 등은 명시적으로 import하지 않습니다. 컴포넌트 또한 `~/components/` 내에 존재하므로 별도의 import 없이 템플릿에서 바로 사용합니다 (`nuxt.config.ts` 설정에 따라 prefix 없이 사용 가능).

## 컴포넌트 구조
- 오직 Vue Single File Component (`.vue`)로 작성합니다.
- 순서: `<script setup>` -> `<template>` -> `<style>` 순으로 작성합니다.
- `app.vue` 및 레이아웃, 페이지 구성 시에는 내장 컴포넌트인 `<NuxtPage />` 와 파일 기반 라우팅을 활용합니다.

## 에셋 참조
- 이미지, 아이콘, 폰트 등의 정적 에셋은 `~/assets/` 경로를 통해 참조합니다.
- `<script setup>` 블록 안에서 에셋을 명시적으로 import하여 템플릿의 `:src` 등에 바인딩할 수 있습니다. (예: `import logoImage from '~/assets/images/logo.svg'`)

## 이벤트 및 상태 관리
- 상태 값은 `ref` (원시 타입) 또는 `reactive` (객체)를 명확하게 구분하여 사용합니다.
- 전역 상태가 필요한 경우 `useState` 등의 Nuxt 내장 컴포지저블을 사용합니다.
