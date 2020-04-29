
import { PreCompiler } from '../../modules/pre-compiler';

describe('PreCompiler class tests', () => {
    test('createSassForSwatch', () => {
        const preCompiler = new PreCompiler();
        expect(preCompiler.createSassForSwatch('test-theme-name', 'sass')).toBe('.dx-swatch-test-theme-name { sass };');
    });
});
