import { existsSync, readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')

const read = (filePath: string) => readFileSync(resolve(repoRoot, filePath), 'utf8')

describe('workflow integrity', () => {
  it('keeps orchestrator workflow files referenced by core.md available', () => {
    const requiredFiles = [
      '.ai/core.md',
      '.ai/workflows/figma-to-code.md',
      '.ai/workflows/legacy-to-vue.md',
      '.ai/workflows/component-validation.md',
      '.ai/workflows/visual-diff.md',
      '.ai/rules/development/component-guardrails.md',
      '.ai/rules/development/expert-vue-tester.md',
      '.ai/rules/development/expert-nuxt-preview.md',
      '.agents/rules/rules.md',
      'AGENTS.md',
      'CLAUDE.md',
    ]

    for (const filePath of requiredFiles) {
      expect(existsSync(resolve(repoRoot, filePath)), filePath).toBe(true)
    }
  })

  it('uses .agents consistently in setup and update scripts', () => {
    const scriptFiles = [
      'setup-mac.sh',
      'update-mac.sh',
      'setup-windows.ps1',
      'update-windows.ps1',
    ]

    for (const filePath of scriptFiles) {
      const content = read(filePath)
      expect(content.includes('.agents')).toBe(true)
      expect(content).not.toMatch(/\.agent(?=[/\\"])/)
    }
  })

  it('documents the visual diff approval step in the README flow', () => {
    const readme = read('README.md')

    expect(readme).toContain('visual-diff 진행 여부 확인')
    expect(readme).toContain('보류 / 거부')
    expect(readme).toContain('기존 Vue 컴포넌트 수정`도 코드 수정 후에는 동일하게 `component-validation`')
    expect(readme).toContain('D5 --> V0')
  })

  it('keeps the existing component modification path inside the validation chain', () => {
    const core = read('.ai/core.md')
    const validationWorkflow = read('.ai/workflows/component-validation.md')

    expect(core).toContain('Existing Vue Component Modification')
    expect(core).toContain('MUST continue through `/component-validation`, visual diff approval, and preview delivery')
    expect(core).toContain('Route to `expert-figma-to-vue` for design-driven restyling')
    expect(core).toContain('Route to a relevant expert agent for structure-heavy markup rewrites')
    expect(core).not.toContain('Route to `expert-legacy-to-vue` for structure-heavy markup rewrites')
    expect(validationWorkflow).toContain('원본 생성 또는 수정 에이전트')
    expect(validationWorkflow).toContain('relevant expert agent')
  })

  it('keeps workflow loading instructions selective instead of enumerating all scripting modules', () => {
    const figmaWorkflow = read('.ai/workflows/figma-to-code.md')
    const legacyWorkflow = read('.ai/workflows/legacy-to-vue.md')
    const typescriptRule = read('.ai/rules/language/typescript.md')

    expect(figmaWorkflow).toContain('필요한 패턴 모듈만 1~2개 추가 로드')
    expect(legacyWorkflow).toContain('필요한 패턴 모듈만 1~2개 로드')
    expect(figmaWorkflow).toContain('canonical source인 `@.ai/rules/development/component-guardrails.md`')
    expect(legacyWorkflow).toContain('canonical source인 `@.ai/rules/development/component-guardrails.md`')
    expect(typescriptRule).toContain('Props And API Guardrail')
  })

  it('keeps the legacy workflow in save-before-validation mode', () => {
    const legacyWorkflow = read('.ai/workflows/legacy-to-vue.md')
    const legacyRule = read('.ai/rules/development/expert-legacy-to-vue.md')

    expect(legacyWorkflow).toContain('저장이 완료되면')
    expect(legacyWorkflow).toContain('Legacy 전용 handoff 패키지')
    expect(legacyWorkflow).toContain('`componentPath`')
    expect(legacyWorkflow).not.toContain('리뷰용으로 제공한 후, 승인 시')
    expect(legacyRule).toContain('신규 Legacy → Vue 변환 전용')
    expect(legacyRule).not.toContain('### B. 기존 컴포넌트 부분 수정')
  })

  it('ships preview routes required by preview and visual diff workflows', () => {
    const previewFiles = [
      'pages/preview/index.vue',
      'pages/preview/[name].vue',
      'pages/preview/raw/[name].vue',
      'pages/preview/mobile/index.vue',
      'pages/preview/mobile/[name].vue',
    ]

    for (const filePath of previewFiles) {
      expect(existsSync(resolve(repoRoot, filePath)), filePath).toBe(true)
    }
  })

  it('keeps nested component auto-import enabled for preview and legacy outputs', () => {
    const nuxtConfig = read('nuxt.config.ts')

    expect(nuxtConfig).toContain("pattern: '**/*.vue'")
  })

  it('documents runtime scaffold updates consistently in setup docs and scripts', () => {
    const readme = read('README.md')
    const setupWindows = read('setup-windows.ps1')
    const setupMac = read('setup-mac.sh')
    const updateWindows = read('update-windows.ps1')
    const updateMac = read('update-mac.sh')

    expect(readme).toContain('pages/preview/*')
    expect(readme).toContain('utils/preview-resolver.ts')
    expect(readme).toContain('utils/legacy-dependency-audit.ts')
    expect(readme).toContain('nuxt.config.ts')
    expect(readme).toContain('덮어써질 수 있습니다')

    expect(setupWindows).toContain('Copying preview scaffold...')
    expect(setupWindows).toContain('preview-resolver.ts')
    expect(setupWindows).toContain('legacy-dependency-audit.ts')
    expect(setupWindows).toContain('nuxt.config.ts')

    expect(setupMac).toContain('Copying preview scaffold...')
    expect(setupMac).toContain('preview-resolver.ts')
    expect(setupMac).toContain('legacy-dependency-audit.ts')
    expect(setupMac).toContain('nuxt.config.ts')

    expect(updateWindows).toContain('shared preview/runtime scaffold files')
    expect(updateWindows).toContain('Updating preview scaffold...')
    expect(updateWindows).toContain('Updating nuxt.config.ts...')

    expect(updateMac).toContain('shared preview/runtime scaffold files')
    expect(updateMac).toContain('Updating preview scaffold...')
    expect(updateMac).toContain('Updating nuxt.config.ts...')
  })
})
