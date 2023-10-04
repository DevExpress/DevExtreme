const tsconfig = require('./tsconfig.json')
const tsJestUtils = require('ts-jest/utils');

module.exports = {
  roots: ['<rootDir>'],
  transform: {
    '.*': [
      'ts-jest',
      {
        diagnostics: false,
      },
    ]
  },
  testURL: 'http://localhost',
  testRegex: "(\\.|/)(test|spec)\\.(jsx?|tsx?)$",
  moduleFileExtensions: [
    "ts",
    "tsx",
    "js",
    "jsx",
    "json",
    "node"
  ],
  moduleNameMapper: tsJestUtils.pathsToModuleNameMapper(tsconfig.compilerOptions.paths),
};
