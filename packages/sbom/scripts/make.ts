import fs from 'node:fs';
import path from 'node:path';

import { addDependencies, makeSbom } from '@devexpress/sbom-toolkit';
import type { MakeSbomConfig } from '@devexpress/sbom-toolkit';

const PACKAGE_DIR = path.resolve(import.meta.dirname, '..');
const REPO_ROOT = path.resolve(PACKAGE_DIR, '../..');
const DIST = path.join(PACKAGE_DIR, 'dist');
const EXTRA_SBOM = path.join(DIST, 'devextreme-extra-deps.cdx.json');

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

fs.rmSync(DIST, { recursive: true, force: true });

await makeSbom({
  targetDir: path.join(PACKAGE_DIR, 'devextreme-extra-deps'),
  outputDir: DIST,
  packages: [{ fullName: 'devextreme-extra-deps' }],
  options,
});
await makeSbom({ targetDir: REPO_ROOT, outputDir: DIST, packages, options });

for (const name of PACKAGES_WITH_DEVEXTREME) {
  const sbomPath = path.join(DIST, `${name}.cdx.json`);
  if (fs.existsSync(sbomPath)) {
    addDependencies({ sbomPath, extraSbomPath: EXTRA_SBOM, component: 'devextreme' });
  }
}
fs.rmSync(EXTRA_SBOM);

const devextremeSbom = path.join(DIST, 'devextreme.cdx.json');
if (fs.existsSync(devextremeSbom)) {
  fs.copyFileSync(devextremeSbom, path.join(DIST, 'devextreme-dist.cdx.json'));
}
