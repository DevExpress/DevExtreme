
module.exports = {
  src: './src/**/*.ts',
  ignoredGlobs: ['!./src/**/*.test.ts', '!./src/**/__mocks__/*'],
  npm: {
    dist: './npm/',
    package: 'package.json',
    license: './LICENSE',
    readme: './README.md'
  },
  metadataPath: require.resolve('devextreme-metadata/integration-data.json'),
  generatedComponentsDir: './src',
  coreComponentsDir: './src/core',
  indexFileName: './src/index.ts',
  baseComponent: './core/index',
  configComponent: './core/index',
  widgetsPackage: 'devextreme'
};
