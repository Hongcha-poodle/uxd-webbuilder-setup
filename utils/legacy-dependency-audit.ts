export interface DependencyAuditOptions {
  availableAssetImports?: Iterable<string>
  availableComponentImports?: Iterable<string>
}

export interface DependencyAuditResult {
  resolvedAssets: string[]
  missingAssets: string[]
  resolvedComponentDeps: string[]
  missingComponentDeps: string[]
  unresolvedDependencies: string[]
}

const STATIC_IMPORT_RE = /import\s+(?:type\s+)?[\w*\s{},]+\s+from\s+['"]([^'"]+)['"]/g
const DYNAMIC_IMPORT_RE = /import\(\s*['"]([^'"]+)['"]\s*\)/g

const normalize = (value: string) => value.trim()

const unique = (items: Iterable<string>) => [...new Set([...items].map(normalize).filter(Boolean))].sort()

const collectMatches = (pattern: RegExp, source: string) => {
  const matches: string[] = []
  for (const match of source.matchAll(pattern)) {
    const specifier = match[1]?.trim()
    if (specifier) {
      matches.push(specifier)
    }
  }
  return matches
}

const isAssetImport = (specifier: string) => specifier.startsWith('~/assets/')

const isComponentImport = (specifier: string) => {
  return specifier.endsWith('.vue') || specifier.startsWith('~/components/') || specifier.startsWith('./') || specifier.startsWith('../')
}

export const collectImportedSpecifiers = (source: string) => {
  return unique([
    ...collectMatches(STATIC_IMPORT_RE, source),
    ...collectMatches(DYNAMIC_IMPORT_RE, source),
  ])
}

export const auditGeneratedVueDependencies = (
  source: string,
  options: DependencyAuditOptions = {},
): DependencyAuditResult => {
  const specifiers = collectImportedSpecifiers(source)
  const availableAssets = new Set(unique(options.availableAssetImports ?? []))
  const availableComponents = new Set(unique(options.availableComponentImports ?? []))
  const resolvedAssets: string[] = []
  const missingAssets: string[] = []
  const resolvedComponentDeps: string[] = []
  const missingComponentDeps: string[] = []
  const unresolvedDependencies: string[] = []

  for (const specifier of specifiers) {
    if (isAssetImport(specifier)) {
      if (availableAssets.has(specifier)) {
        resolvedAssets.push(specifier)
      }
      else {
        missingAssets.push(specifier)
        unresolvedDependencies.push(specifier)
      }
      continue
    }

    if (isComponentImport(specifier)) {
      if (availableComponents.has(specifier)) {
        resolvedComponentDeps.push(specifier)
      }
      else {
        missingComponentDeps.push(specifier)
        unresolvedDependencies.push(specifier)
      }
    }
  }

  return {
    resolvedAssets: unique(resolvedAssets),
    missingAssets: unique(missingAssets),
    resolvedComponentDeps: unique(resolvedComponentDeps),
    missingComponentDeps: unique(missingComponentDeps),
    unresolvedDependencies: unique(unresolvedDependencies),
  }
}
