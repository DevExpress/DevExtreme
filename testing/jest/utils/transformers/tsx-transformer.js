const path = require('path');
const fs = require('fs');
const getCacheKey = require("./getCacheKey");

const THIS_FILE = fs.readFileSync(__filename);
const tsJest = require('ts-jest');
const jestTransformer = tsJest.createTransformer();

const addCreateElementImport = src => `import { h } from 'preact';\n${src}`;

module.exports = {
    process(src, filename, config) {
        return jestTransformer.process(filename.indexOf("testing/jest")>-1 ? src : addCreateElementImport(src), filename, config);
    },
    getCacheKey(fileData, filePath, configStr) {
        return getCacheKey(fileData, filePath, configStr, THIS_FILE)
    },
};
