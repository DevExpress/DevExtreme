/* eslint no-console: 0 */
/* eslint import/extensions: 0 */
/* eslint import/no-extraneous-dependencies: 0 */

import { copy, readJson, outputJson } from 'fs-extra';
import { version } from '../data/metadata/dx-theme-builder-metadata';

const copyResources = async (): Promise<void> => {
  await readJson('package.json').then(async (json) => {
    const packageConfig = json;
    packageConfig.version = version;
    await outputJson('dist/package.json', packageConfig, { spaces: 2 });
  });
  await copy('src/data/scss', 'dist/data/scss');
  await copy('README.md', 'dist/README.md');
};

copyResources().catch((e) => {
  console.error(e);
  process.exit(1);
});
