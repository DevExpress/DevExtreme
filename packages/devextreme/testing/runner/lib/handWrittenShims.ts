const HAND_WRITTEN_ESM_SHIMS: readonly { esmPath: string; shimUrl: string }[] = [
  {
    esmPath: '__internal/ui/themes.js',
    shimUrl: '/packages/devextreme/testing/helpers/esm-shims/themes.js',
  },
  {
    esmPath: 'ui/themes.js',
    shimUrl: '/packages/devextreme/testing/helpers/esm-shims/themes.js',
  },
];

const ESM_ARTIFACT_PREFIX = 'packages/devextreme/artifacts/transpiled-esm-npm/esm/';

export function findHandWrittenShim(relativeUrlPath: string): string | null {
  const normalized = relativeUrlPath.replace(/\\/g, '/').replace(/^\/+/, '');
  const idx = normalized.indexOf(ESM_ARTIFACT_PREFIX);
  const esmPath = idx >= 0
    ? normalized.slice(idx + ESM_ARTIFACT_PREFIX.length)
    : normalized;

  const match = HAND_WRITTEN_ESM_SHIMS.find((entry) => entry.esmPath === esmPath);
  return match?.shimUrl ?? null;
}
