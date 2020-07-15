/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs');
const tsJest = require('ts-jest');
const getCacheKey = require('./get_cache_key');

const THIS_FILE = fs.readFileSync(__filename);
const jestTransformer = tsJest.createTransformer();
const addCreateElementImport = (src) => `import { h } from 'preact'; ${src}`;

module.exports = {
  process(src, filename, config) {
    return jestTransformer.process(filename.indexOf('testing/jest') > -1 ? src : addCreateElementImport(src), filename, config);
  },
  getCacheKey(fileData, filePath, configStr) {
    return getCacheKey(fileData, filePath, configStr, THIS_FILE);
  },
};
