
import PreCompiler from '../../src/modules/pre-compiler';

describe('PreCompiler class tests', () => {
  test('createSassForSwatch', () => {
    expect(PreCompiler.createSassForSwatch('test-theme-name', 'sass')).toBe('.dx-swatch-test-theme-name { sass };');
  });
});
