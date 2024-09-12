
module.exports = {
  src: './src/**/*.ts',
  ignoredGlobs: ['!./src/**/*.test.ts', '!./src/**/__mocks__/*'],
  npm: {
    dist: './npm/',
    package: 'package.json',
    license: './LICENSE',
    readme: './README.md'
  },
  metadataPath: './metadata/integration-data.json',
  generatedComponentsDir: './src',
  coreComponentsDir: './src/core',
  indexFileName: './src/index.ts',
  createComponentFn: {
    name: 'defineComponent',
    path: 'vue',
  },
  prepareComponentConfigFn: {
    name: 'prepareComponentConfig',
    path: './core/index',
  },
  prepareExtensionComponentConfigFn: {
    name: 'prepareExtensionComponentConfig',
    path: './core/index',
  },
  prepareConfigurationComponentConfigFn: {
    name: 'prepareConfigurationComponentConfig',
    path: './core/index',
  },
  widgetsPackage: 'devextreme'
};
