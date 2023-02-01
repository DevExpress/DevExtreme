import {
  existsSync, mkdirSync, readFileSync, rmdirSync,
} from 'fs';
// eslint-disable-next-line import/no-extraneous-dependencies
import devextremeGenerator from 'devextreme-vue-generator';

const vueVersion = 3;
const outputDir = './src';
const componentsDir = outputDir;
const oldComponentsDir = `${outputDir}/ui`;
const indexFileName = `${outputDir}/index.ts`;
const metadataFile = './artifacts/internal-tools/integration-data.json';
const targetsDir = '../../jquery/lib/esm';

// eslint-disable-next-line no-console
console.log('Generating wrappers...');

if (existsSync(componentsDir)) {
  rmdirSync(componentsDir, { recursive: true });
}

mkdirSync(componentsDir);

if (existsSync(oldComponentsDir)) {
  rmdirSync(oldComponentsDir, { recursive: true });
}

mkdirSync(oldComponentsDir);

devextremeGenerator(
  JSON.parse(readFileSync(metadataFile).toString()),
  'devextreme-vue/core/index',
  'devextreme-vue/core/index',
  {
    componentsDir,
    oldComponentsDir,
    indexFileName,
  },
  targetsDir,
  vueVersion,
);

// eslint-disable-next-line no-console
console.log('done');
