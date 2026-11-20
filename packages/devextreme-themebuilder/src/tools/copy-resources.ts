/* eslint no-console: 0 */
/* eslint import/extensions: 0 */
/* eslint import/no-extraneous-dependencies: 0 */

import { copy, readJson, outputJson } from 'fs-extra';
import { version } from '../data/metadata/dx-theme-builder-metadata';

const METADATA_FOLDERS = ['metadata', 'bootstrap-metadata', 'migration-metadata'];

const EXPORTS = {
  '.': './modules/builder.js',
  './package.json': './package.json',
  './modules/*.js': './modules/*.js',
  './modules/*': './modules/*.js',
  ...Object.fromEntries(
    METADATA_FOLDERS.flatMap((folder) => [
      [`./data/${folder}/*.js`, `./data/${folder}/*.js`],
      [`./data/${folder}/*`, `./data/${folder}/*.js`],
    ]),
  ),
  './data/*.js': './data/*.js',
  './data/*.json': './data/*.json',
  './data/*': './data/*',
};

const copyResources = async (): Promise<void> => {
  await readJson('package.json').then(async (json) => {
    const packageConfig = json;
    packageConfig.version = version;
    packageConfig.exports = EXPORTS;
    await outputJson('dist/package.json', packageConfig, { spaces: 2 });
  });
  await copy('src/data/scss', 'dist/data/scss');
  await copy('README.md', 'dist/README.md');
};

copyResources().catch((e) => {
  console.error(e);
  process.exit(1);
});
