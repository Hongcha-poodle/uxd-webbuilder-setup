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
})
