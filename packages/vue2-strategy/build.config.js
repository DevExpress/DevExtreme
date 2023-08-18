
module.exports = {
  core: './src/core/**/*.ts',
  ignoredGlobs: ['!./src/core/**/*.test.ts', '!./src/core/**/__mocks__/*'],
  npm: {
    dist: './npm/',
    license: '../../LICENSE'
  },
  metadataPath: '../devextreme-vue/metadata/integration-data.json',
  generatedComponentsDir: './src',
  coreComponentsDir: './src/core',
  indexFileName: './src/index.ts',
  baseComponent: './core/index',
  configComponent: './core/index',
  widgetsPackage: 'devextreme'
};
