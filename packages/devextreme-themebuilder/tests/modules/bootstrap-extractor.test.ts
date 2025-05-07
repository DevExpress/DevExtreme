import { readFileSync } from 'fs';
import BootstrapExtractor from '../../src/modules/bootstrap-extractor';

describe('BootstrapExtractor', () => {
  test('constructor set the right compiler and processor', () => {
    const sassExtractorFor5 = new BootstrapExtractor('', 5);
    const defaultExtractor = new BootstrapExtractor('', 10);

    expect(sassExtractorFor5.compiler).toBe(BootstrapExtractor.sassRender);
    expect(defaultExtractor.compiler).toBe(BootstrapExtractor.sassRender);

    expect(defaultExtractor.sourceProcessor).toBe(defaultExtractor.sassProcessor);
  });

  test('sassRender', async () => {
    const sass = '$var: red; div { color: $var;}';
    const css = 'div {\n  color: red;\n}';

    return expect(await BootstrapExtractor.sassRender(sass)).toBe(css);
  });

  test('sassRender (error)', async () => expect(BootstrapExtractor.sassRender('0'))
    .rejects
    .toMatch(/^Error: expected "{"\./));

  test('sassProcessor (bootstrap5)', async () => {
    const testSassString = 'test string';
    const setterServiceCode = 'setter';
    const collectorServiceCode = 'collector';
    const extractor = new BootstrapExtractor(testSassString, 5);
    const functionsPath = require.resolve('bootstrap/scss/_functions.scss');
    const variablesPath = require.resolve('bootstrap/scss/_variables.scss');
    const variablesDarkPath = require.resolve('bootstrap/scss/_variables-dark.scss');
    const functions = readFileSync(functionsPath);
    const variables = readFileSync(variablesPath);
    const variablesDark = readFileSync(variablesDarkPath);
    extractor.getSetterServiceCode = (): string => setterServiceCode;
    extractor.getCollectorServiceCode = (): string => collectorServiceCode;

    const result = await extractor.sassProcessor();

    expect(result.includes('@import "variables-dark";')).toBeFalsy();

    const expectedResult = `${functions.toString()}
${variables.toString()}
${variablesDark.toString()}
${testSassString}
${setterServiceCode}
${collectorServiceCode}`;

    expect(result).toBe(extractor.removeImports(expectedResult));
  });

  test('getSetterServiceCode', () => {
    const extractor = new BootstrapExtractor('', 4);
    extractor.meta = {
      'test-key-var1': '$var1',
      'test-key-var2': '$var2',
    };

    const expectedStyleStringWithoutPostfix = '$var1: dx-empty ;\n$var2: dx-empty ;\n';
    const expectedStyleStringWithPostfix = '$var1: dx-empty !default;\n$var2: dx-empty !default;\n';

    expect(extractor.getSetterServiceCode()).toBe(expectedStyleStringWithoutPostfix);
    expect(extractor.getSetterServiceCode('!default')).toBe(expectedStyleStringWithPostfix);
  });

  test('getCollectorServiceCode', () => {
    const extractor = new BootstrapExtractor('', 4);
    extractor.meta = {
      'test-key-var1': '$var1',
      'test-key-var2': '$var2',
    };

    const expectedStyleStringWithoutPostfix = 'dx-varibles-collector {test-key-var1: $var1;test-key-var2: $var2;}';

    expect(extractor.getCollectorServiceCode()).toBe(expectedStyleStringWithoutPostfix);
  });

  test('extract (bootstrap 5)', async () => {
    const input = '$var1: test1;$var2: test2 !default;$custom-var: test3;$var4: var(--bs-blue);$var5: -.25rem;';
    const extractor = new BootstrapExtractor(input, 5);
    extractor.meta = {
      'dx-var1': '$var1',
      'dx-var2': '$var2',
      'dx-var3': '$var3',
      'dx-var4': '$var4',
      'dx-var5': '$var5',
    };

    expect(await extractor.extract()).toEqual([
      { key: '$dx-var1', value: 'test1' },
      { key: '$dx-var2', value: 'test2' },
      { key: '$dx-var4', value: '#0d6efd' },
      { key: '$dx-var5', value: '-4px' },
    ]);
  });
});
