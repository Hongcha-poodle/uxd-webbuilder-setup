import { describe, expect, it } from 'vitest'

import { auditGeneratedVueDependencies, collectImportedSpecifiers } from '../utils/legacy-dependency-audit'

describe('legacy dependency audit', () => {
  it('collects static and dynamic imports from generated vue source', () => {
    const source = `
      import heroImage from '~/assets/images/hero-background.png'
      import PromoCard from '~/components/PromoCard.vue'
      const lazyChild = () => import('../shared/LazyChild.vue')
    `

    expect(collectImportedSpecifiers(source)).toEqual([
      '../shared/LazyChild.vue',
      '~/assets/images/hero-background.png',
      '~/components/PromoCard.vue',
    ])
  })

  it('separates resolved and missing asset imports', () => {
    const source = `
      import heroImage from '~/assets/images/hero-background.png'
      import kakaoIcon from '~/assets/icons/icon-kakao.svg'
    `

    const audit = auditGeneratedVueDependencies(source, {
      availableAssetImports: ['~/assets/images/hero-background.png'],
    })

    expect(audit.resolvedAssets).toEqual(['~/assets/images/hero-background.png'])
    expect(audit.missingAssets).toEqual(['~/assets/icons/icon-kakao.svg'])
    expect(audit.unresolvedDependencies).toEqual(['~/assets/icons/icon-kakao.svg'])
  })

  it('flags missing component dependencies that would break preview builds', () => {
    const source = `
      import ExistingCard from '~/components/ExistingCard.vue'
      import MissingCard from '~/components/MissingCard.vue'
      const LazyPanel = () => import('../legacy/LazyPanel.vue')
    `

    const audit = auditGeneratedVueDependencies(source, {
      availableComponentImports: ['~/components/ExistingCard.vue'],
    })

    expect(audit.resolvedComponentDeps).toEqual(['~/components/ExistingCard.vue'])
    expect(audit.missingComponentDeps).toEqual([
      '../legacy/LazyPanel.vue',
      '~/components/MissingCard.vue',
    ])
    expect(audit.unresolvedDependencies).toEqual([
      '../legacy/LazyPanel.vue',
      '~/components/MissingCard.vue',
    ])
  })
})
