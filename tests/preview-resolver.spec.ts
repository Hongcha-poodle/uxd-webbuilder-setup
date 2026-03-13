import { describe, expect, it } from 'vitest'

import {
  createPreviewComponentEntries,
  createPreviewPath,
  resolvePreviewComponent,
} from '../utils/preview-resolver'

const modules = {
  '~/components/SampleRoot.vue': async () => ({}),
  '~/components/forms/SampleNested.vue': async () => ({}),
  '~/components/admin/Nav.vue': async () => ({}),
  '~/components/marketing/Nav.vue': async () => ({}),
}

describe('preview resolver', () => {
  it('creates stable ids for root and nested components', () => {
    const entries = createPreviewComponentEntries(modules)
    expect(entries.map(entry => entry.id)).toEqual([
      'admin__Nav',
      'forms__SampleNested',
      'marketing__Nav',
      'SampleRoot',
    ])
  })

  it('keeps root component URLs compatible', () => {
    expect(createPreviewPath('/preview', 'SampleRoot')).toBe('/preview/SampleRoot')
  })

  it('resolves nested components from encoded ids', () => {
    const resolution = resolvePreviewComponent(modules, 'forms__SampleNested')
    expect(resolution.reason).toBe('matched')
    expect(resolution.entry?.filePath).toBe('~/components/forms/SampleNested.vue')
  })

  it('falls back to a unique basename for old direct links', () => {
    const resolution = resolvePreviewComponent(modules, 'SampleNested')
    expect(resolution.reason).toBe('matched')
    expect(resolution.entry?.relativePath).toBe('forms/SampleNested')
  })

  it('reports ambiguous basename collisions clearly', () => {
    const resolution = resolvePreviewComponent(modules, 'Nav')
    expect(resolution.reason).toBe('ambiguous')
    expect(resolution.entry).toBeNull()
    expect(resolution.ambiguousMatches).toHaveLength(2)
  })

  it('returns attempted file paths for missing components', () => {
    const resolution = resolvePreviewComponent(modules, 'MissingCard')
    expect(resolution.reason).toBe('not-found')
    expect(resolution.attemptedFilePaths).toEqual([
      '~/components/MissingCard.vue',
    ])
  })
})
