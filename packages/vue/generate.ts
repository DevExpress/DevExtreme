import { existsSync, mkdirSync, readFileSync } from 'fs';
import devextremeGenerator from 'devextreme-vue-generator';

const vueVersion = 3;
const outputDir = './generated';
const componentsDir = outputDir;
const oldComponentsDir = `${outputDir}/ui`;
const indexFileName = `${outputDir}/index.ts`;
const metadataFile = './artifacts/internal-tools/integration-data.json'

console.log('Generating wrappers...');

if(!existsSync(componentsDir))
    mkdirSync(componentsDir);

if(!existsSync(oldComponentsDir))
    mkdirSync(oldComponentsDir);

devextremeGenerator(
    JSON.parse(readFileSync(metadataFile).toString()),
    "devextreme-vue/core/index",
    "devextreme-vue/core/index",
    {
        componentsDir,
        oldComponentsDir,
        indexFileName
    },
    "devextreme",
    vueVersion
);

console.log('done');
