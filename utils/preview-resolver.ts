export type PreviewModuleLoader = () => Promise<unknown>

export interface PreviewComponentEntry {
  id: string
  name: string
  relativePath: string
  filePath: string
  loader: PreviewModuleLoader
}

export interface PreviewComponentResolution {
  entry: PreviewComponentEntry | null
  requestedId: string
  attemptedFilePaths: string[]
  reason: 'matched' | 'not-found' | 'ambiguous'
  ambiguousMatches: PreviewComponentEntry[]
}

const COMPONENT_PREFIX = '~/components/'
const VUE_SUFFIX = '.vue'
const SEGMENT_DELIMITER = '__'

const trimSlashes = (value: string) => value.replace(/^\/+|\/+$/g, '')

const normalizeRelativePath = (filePath: string) => filePath
  .replace(COMPONENT_PREFIX, '')
  .replace(/\.vue$/, '')

export const encodePreviewComponentId = (relativePath: string) => trimSlashes(relativePath).replace(/\//g, SEGMENT_DELIMITER)

export const decodePreviewComponentId = (componentId: string) => trimSlashes(componentId).replaceAll(SEGMENT_DELIMITER, '/')

export const createPreviewComponentEntries = (modules: Record<string, PreviewModuleLoader>): PreviewComponentEntry[] => {
  return Object.entries(modules)
    .map(([filePath, loader]) => {
      const relativePath = normalizeRelativePath(filePath)
      const segments = relativePath.split('/')
      const name = segments.at(-1) ?? relativePath

      return {
        id: encodePreviewComponentId(relativePath),
        name,
        relativePath,
        filePath,
        loader,
      }
    })
    .sort((left, right) => left.relativePath.localeCompare(right.relativePath))
}

export const createPreviewPath = (basePath: string, componentId: string) => {
  return `${basePath.replace(/\/$/, '')}/${encodeURIComponent(componentId)}`
}

export const resolvePreviewComponent = (
  modules: Record<string, PreviewModuleLoader>,
  requested: string | string[],
): PreviewComponentResolution => {
  const requestedValue = Array.isArray(requested) ? requested.join('/') : requested
  const requestedId = trimSlashes(requestedValue)
  const requestedRelativePath = decodePreviewComponentId(requestedId)
  const entries = createPreviewComponentEntries(modules)

  const directMatch = entries.find(entry => entry.id === requestedId || entry.relativePath === requestedRelativePath)

  if (directMatch) {
    return {
      entry: directMatch,
      requestedId,
      attemptedFilePaths: [directMatch.filePath],
      reason: 'matched',
      ambiguousMatches: [],
    }
  }

  const basename = requestedRelativePath.split('/').at(-1) ?? requestedRelativePath
  const basenameMatches = entries.filter(entry => entry.name === basename)

  if (basenameMatches.length === 1) {
    return {
      entry: basenameMatches[0],
      requestedId,
      attemptedFilePaths: [basenameMatches[0].filePath],
      reason: 'matched',
      ambiguousMatches: [],
    }
  }

  if (basenameMatches.length > 1) {
    return {
      entry: null,
      requestedId,
      attemptedFilePaths: basenameMatches.map(entry => entry.filePath),
      reason: 'ambiguous',
      ambiguousMatches: basenameMatches,
    }
  }

  return {
    entry: null,
    requestedId,
    attemptedFilePaths: unique([
      `${COMPONENT_PREFIX}${requestedRelativePath}${VUE_SUFFIX}`,
      `${COMPONENT_PREFIX}${basename}${VUE_SUFFIX}`,
    ]),
    reason: 'not-found',
    ambiguousMatches: [],
  }
}

function unique<T>(items: T[]) {
  return [...new Set(items)]
}
