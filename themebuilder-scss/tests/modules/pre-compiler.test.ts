import PreCompiler from '../../src/modules/pre-compiler';

describe('PreCompiler class tests', () => {
  test('createSassForSwatch', () => {
    const swatchSass = PreCompiler.createSassForSwatch('test-theme-name', 'sass');
    expect(swatchSass.sass).toBe('.dx-swatch-test-theme-name { sass };');
    expect(swatchSass.selector).toBe('.dx-swatch-test-theme-name');
  });

  test('createSassForSwatch clean sass from encoding', () => {
    const swatchSass = PreCompiler.createSassForSwatch('test-theme-name', '@charset "UTF-8";\nsass');
    expect(swatchSass.sass).toBe('.dx-swatch-test-theme-name { \nsass };');
    expect(swatchSass.selector).toBe('.dx-swatch-test-theme-name');
  });
});
