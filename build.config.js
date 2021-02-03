
module.exports = {
  src: './src/**/*.ts',
  ignoredGlobs: ['!./src/**/*.test.ts', '!./src/**/__mocks__/*'],
  npm: {
    dist: './npm/',
    strategySrc: '../vue2-strategy/npm/vue2-strategy.tgz',
    package: 'package.json',
    license: '../../LICENSE',
    readme: '../../README.md'
  },
  metadataPath: './metadata/integration-data.json',
  generatedComponentsDir: './src',
  oldComponentsDir: './src/ui',
  coreComponentsDir: './src/core',
  indexFileName: './src/index.ts',
  baseComponent: './core/index',
  configComponent: './core/index',
  widgetsPackage: 'devextreme'
};
