
import PreCompiler from '../../src/modules/pre-compiler';

describe('PreCompiler class tests', () => {
  test('createSassForSwatch', () => {
    const swatchSass = PreCompiler.createSassForSwatch('test-theme-name', 'sass');
    expect(swatchSass.sass).toBe('.dx-swatch-test-theme-name { sass };');
    expect(swatchSass.selector).toBe('.dx-swatch-test-theme-name');
  });
});
