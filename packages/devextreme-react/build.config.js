module.exports = {
  src: './src/**/*.{ts,tsx}',
  testSrc: './src/**/__tests__/**/*.*',
  npm: {
    dist: './npm/',
    package: 'package.json',
    license: 'LICENSE',
    readme: 'README.md'
  },
  generatedComponentsDir: './src',
  coreComponentsDir: './src/core',
  indexFileName: './src/index.ts',
  baseComponent: './core/component',
  extensionComponent: './core/extension-component',
  configComponent: './core/nested-option'
};
