import { readFileSync } from 'fs';
import BootstrapExtractor from '../../src/modules/bootstrap-extractor';

describe('BootstrapExtractor', () => {
  test('constructor set the right compiler and processor', () => {
    const lessExtractor = new BootstrapExtractor('', 3);
    const sassExtractor = new BootstrapExtractor('', 4);
    const defaultExtractor = new BootstrapExtractor('', 10);

    expect(lessExtractor.compiler).toBe(BootstrapExtractor.lessRender);
    expect(sassExtractor.compiler).toBe(BootstrapExtractor.sassRender);
    expect(defaultExtractor.compiler).toBe(BootstrapExtractor.sassRender);

    expect(lessExtractor.sourceProcessor).toBe(lessExtractor.lessProcessor);
    expect(sassExtractor.sourceProcessor).toBe(sassExtractor.sassProcessor);
    expect(defaultExtractor.sourceProcessor).toBe(defaultExtractor.sassProcessor);
  });

  test('sassRender', async () => {
    const sass = '$var: red; div { color: $var;}';
    const css = 'div {\n  color: red;\n}';

    return expect(await BootstrapExtractor.sassRender(sass)).toBe(css);
  });

  test('sassRender (error)', async () => expect(BootstrapExtractor.sassRender('0'))
    .rejects
    .toMatch(/^expected "{"\./));

  test('lessRender', async () => {
    const less = '@var: red; div { color: @var;}';
    const css = 'div {\n  color: red;\n}\n';

    return expect(await BootstrapExtractor.lessRender(less)).toBe(css);
  });

  test('lessRender (error)', async () => expect(BootstrapExtractor.lessRender('0'))
    .rejects
    .toBe('Unrecognised input. Possibly missing something'));

  test('sassProcessor', async () => {
    const testSassString = 'test string';
    const setterServiceCode = 'setter';
    const collectorServiceCode = 'collector';
    const extractor = new BootstrapExtractor(testSassString, 4);
    const functionsPath = require.resolve('bootstrap/scss/_functions.scss');
    const variablesPath = require.resolve('bootstrap/scss/_variables.scss');
    const functions = readFileSync(functionsPath);
    const variables = readFileSync(variablesPath);
    extractor.getSetterServiceCode = (): string => setterServiceCode;
    extractor.getCollectorServiceCode = (): string => collectorServiceCode;

    expect(await extractor.sassProcessor())
      .toBe(functions
        + testSassString
        + variables
        + setterServiceCode
        + collectorServiceCode);
  });

  test('lessProcessor', async () => {
    const testLessString = 'test string';
    const setterServiceCode = 'setter';
    const collectorServiceCode = 'collector';
    const extractor = new BootstrapExtractor(testLessString, 3);
    extractor.getSetterServiceCode = (): string => setterServiceCode;
    extractor.getCollectorServiceCode = (): string => collectorServiceCode;

    expect(await extractor.lessProcessor())
      .toBe(setterServiceCode
        + testLessString
        + collectorServiceCode);
  });

  test('getSetterServiceCode', async () => {
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

  test('getCollectorServiceCode', async () => {
    const extractor = new BootstrapExtractor('', 4);
    extractor.meta = {
      'test-key-var1': '$var1',
      'test-key-var2': '$var2',
    };

    const expectedStyleStringWithoutPostfix = 'dx-varibles-collector {test-key-var1: $var1;test-key-var2: $var2;}';

    expect(extractor.getCollectorServiceCode()).toBe(expectedStyleStringWithoutPostfix);
  });

  test('extract (bootstrap 3)', async () => {
    const input = '@var1: test1;@var2: test2;@custom-var: test3;';
    const extractor = new BootstrapExtractor(input, 3);
    extractor.meta = {
      'dx-var1': '@var1',
      'dx-var2': '@var2',
      'dx-var3': '@var3',
    };

    expect(await extractor.extract()).toEqual([
      { key: '$dx-var1', value: 'test1' },
      { key: '$dx-var2', value: 'test2' },
    ]);
  });

  test('extract (bootstrap 4)', async () => {
    const input = '$var1: test1;$var2: test2 !default;$custom-var: test3;';
    const extractor = new BootstrapExtractor(input, 4);
    extractor.meta = {
      'dx-var1': '$var1',
      'dx-var2': '$var2',
      'dx-var3': '$var3',
    };

    expect(await extractor.extract()).toEqual([
      { key: '$dx-var1', value: 'test1' },
      { key: '$dx-var2', value: 'test2' },
    ]);
  });

  test('extract varuable with rem (bootstrap 4) (T951945)', async () => {
    const input = `
    $var1: -.25rem;
    $var2: 0.34rem !default;
    $custom-var: 12rem;
    $var3: 2rem 1rem;
    $var4: 0 .5rem 1rem red !default;`;
    const extractor = new BootstrapExtractor(input, 4);
    extractor.meta = {
      'dx-var1': '$var1',
      'dx-var2': '$var2',
      'dx-var3': '$var3',
      'dx-var4': '$var4',
    };

    expect(await extractor.extract()).toEqual([
      { key: '$dx-var1', value: '-4px' },
      { key: '$dx-var2', value: '5px' },
      { key: '$dx-var3', value: '32px 16px' },
      { key: '$dx-var4', value: '0 8px 16px red' },
    ]);
  });
});
