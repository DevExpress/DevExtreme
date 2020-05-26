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
    const extractor = new BootstrapExtractor(testSassString, 4);
    const functionsPath = require.resolve('bootstrap/scss/_functions.scss');
    const variablesPath = require.resolve('bootstrap/scss/_variables.scss');
    const functions = readFileSync(functionsPath);
    const variables = readFileSync(variablesPath);

    expect(await extractor.sassProcessor())
      .toBe(functions + testSassString + variables);
  });

  test('lessProcessor', async () => {
    const testLessString = 'test string';
    const extractor = new BootstrapExtractor(testLessString, 3);

    expect(await extractor.lessProcessor()).toBe(testLessString);
  });

  test('getServiceCode', async () => {
    const extractor = new BootstrapExtractor('', 3);
    extractor.meta = {
      'test-key-var1': '$var1',
      'test-key-var2': '$var2',
    };
    const expectedStyleString = 'dx-empty {test-key-var1: $var1;test-key-var2: $var2;}';
    expect(extractor.getServiceCode()).toBe(expectedStyleString);
  });

  test('compile (bootstrap 3)', async () => {
    const input = '@var1: test1;@var2: test2;';
    const extractor = new BootstrapExtractor(input, 3);
    extractor.meta = { 'dx-var1': '@var1', 'dx-var2': '@var2' };

    expect(await extractor.compile()).toBe('dx-empty {\n  dx-var1: test1;\n  dx-var2: test2;\n}\n');
  });

  test('compile (bootstrap 4)', async () => {
    const input = '$var1: test1;$var2: test2;';
    const extractor = new BootstrapExtractor(input, 4);
    extractor.meta = { 'dx-var1': '$var1', 'dx-var2': '$var2' };

    expect(await extractor.compile()).toBe('dx-empty {\n  dx-var1: test1;\n  dx-var2: test2;\n}');
  });

  test('extract (bootstrap 3)', async () => {
    const input = '@var1: test1;@var2: test2;';
    const extractor = new BootstrapExtractor(input, 3);
    extractor.meta = { 'dx-var1': '@var1', 'dx-var2': '@var2' };

    expect(await extractor.extract()).toEqual([
      { key: '$dx-var1', value: 'test1' },
      { key: '$dx-var2', value: 'test2' },
    ]);
  });

  test('extract (bootstrap 4)', async () => {
    const input = '$var1: test1;$var2: test2;';
    const extractor = new BootstrapExtractor(input, 4);
    extractor.meta = { 'dx-var1': '$var1', 'dx-var2': '$var2' };

    expect(await extractor.extract()).toEqual([
      { key: '$dx-var1', value: 'test1' },
      { key: '$dx-var2', value: 'test2' },
    ]);
  });
});
