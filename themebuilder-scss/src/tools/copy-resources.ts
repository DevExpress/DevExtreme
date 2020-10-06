/* eslint no-console: 0 */
/* eslint import/extensions: 0 */
/* eslint import/no-extraneous-dependencies: 0 */

import { copy, readJson, outputJson } from 'fs-extra';
import { version } from '../data/metadata/dx-theme-builder-metadata';

try {
  readJson('package.json').then((json) => {
    const packageConfig = json;
    packageConfig.version = version;
    outputJson('dist/package.json', packageConfig, { spaces: 2 });
  });
  copy('src/data/scss', 'dist/data/scss');
  copy('dart-compiler', 'dist/dart-compiler');
  copy('README.md', 'dist/README.md');
} catch (e) {
  console.error(e);
  process.exit(1);
}
