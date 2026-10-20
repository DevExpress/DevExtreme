import fs from 'node:fs';
import path from 'node:path';

import { addDependencies, makeSbom } from '@devexpress/sbom-toolkit';
import type { MakeSbomConfig } from '@devexpress/sbom-toolkit';

import { addWorkspaceHashes, INTERNAL_PACKAGES } from './add-workspace-hashes.ts';

const PACKAGE_DIR = path.resolve(import.meta.dirname, '..');
const REPO_ROOT = path.resolve(PACKAGE_DIR, '../..');
const DIST = path.join(PACKAGE_DIR, 'dist');
const EXTRA_SBOM = path.join(DIST, 'devextreme-extra-deps.cdx.json');
const REGISTRY_CACHE = path.join(DIST, '.npm-registry.cache.json');

const PACKAGES_WITH_DEVEXTREME = [
  'devextreme',
  'devextreme-react',
  'devextreme-angular',
  'devextreme-vue',
];

const options = {} as MakeSbomConfig['options'];

// Comma-separated `name` or `name(<tarball>)`; tarballs are relative to the working directory.
const packages = process.argv[2].split(',').map((entry) => {
  const [, fullName, tarball] = /^([^(]+)(?:\((.+)\))?$/.exec(entry)!;
  return tarball ? { fullName, tarball: path.resolve(tarball) } : { fullName };
});

const registryCache = fs.existsSync(REGISTRY_CACHE) ? fs.readFileSync(REGISTRY_CACHE) : null;
fs.rmSync(DIST, { recursive: true, force: true });
if (registryCache) {
  fs.mkdirSync(DIST, { recursive: true });
  fs.writeFileSync(REGISTRY_CACHE, registryCache);
}

await makeSbom({
  targetDir: path.join(PACKAGE_DIR, 'devextreme-extra-deps'),
  outputDir: DIST,
  packages: [{ fullName: 'devextreme-extra-deps' }],
  options,
});
await makeSbom({
  targetDir: REPO_ROOT,
  outputDir: DIST,
  packages,
  options: {
    ...options,
    publicPackages: [
      '@devexpress/utils',
      'devexpress-diagram',
      'devexpress-gantt',
      'devextreme-dist',
      'devextreme-quill',
      'devextreme-themebuilder',
      'devextreme',
    ],
    internalPackages: Object.keys(INTERNAL_PACKAGES),
    cpeMappings: [
      'devextreme-angular',
      'devextreme-cldr-data',
      'devextreme-exceljs-fork',
      'devextreme-internal-tools',
      'devextreme-react',
      'devextreme-schematics',
      'devextreme-vue',
      'eslint-config-devextreme',
    ].map((name) => ({ name, vendor: 'devexpress' })),
  },
});

for (const { fullName } of packages) {
  const sbomPath = path.join(DIST, `${fullName}.cdx.json`);
  if (PACKAGES_WITH_DEVEXTREME.includes(fullName)) {
    addDependencies({ sbomPath, extraSbomPath: EXTRA_SBOM, component: 'devextreme' });
  }
  addWorkspaceHashes({ sbomPath, repoRoot: REPO_ROOT });
}
fs.rmSync(EXTRA_SBOM);

const devextremeSbom = path.join(DIST, 'devextreme.cdx.json');
if (fs.existsSync(devextremeSbom)) {
  fs.copyFileSync(devextremeSbom, path.join(DIST, 'devextreme-dist.cdx.json'));
}
