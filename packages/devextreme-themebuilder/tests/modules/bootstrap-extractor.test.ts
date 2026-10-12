import BootstrapExtractor from '../../src/modules/bootstrap-extractor';

describe('BootstrapExtractor', () => {
  test('reject unsupported Bootstrap versions', () => {
    expect(() => new BootstrapExtractor('', 5)).toThrow('Unsupported Bootstrap version: 5');
    expect(new BootstrapExtractor('', 0).version).toBe(6);
  });

  test('sassRender', async () => {
    const sass = '$var: red; div { color: $var;}';
    const css = 'div {\n  color: red;\n}';

    return expect(await BootstrapExtractor.sassRender(sass)).toBe(css);
  });

  test('sassRender (error)', () => expect(BootstrapExtractor.sassRender('0'))
    .rejects
    .toMatch(/^Error: expected "{"\./));

  test('extract Bootstrap 6 defaults without an explicit version', async () => {
    const extractor = new BootstrapExtractor('', undefined);
    expect(extractor.version).toBe(6);
    const items = await extractor.extract();
    expect(items).toHaveLength(43);
    expect(items).toContainEqual({ key: '$base-bg', value: '#fff' });
    expect(items).toContainEqual({ key: '$base-border-radius', value: '8px' });
    expect(items.every(({ value }) => !/var\(|light-dark\(|color-mix\(|oklch\(/.test(value))).toBe(true);
  });

  test('extract customized Bootstrap 6 token maps', async () => {
    const input = `@use "bootstrap" with (
      $radius: .75rem,
      $root-tokens: (--link-color: #123456),
      $form-control-tokens: (--control-bg: #abcdef),
      $pagination-tokens: (--pagination-active-bg: var(--missing, var(--link-color)))
    );`;
    const items = await new BootstrapExtractor(input, 6).extract();
    expect(items).toContainEqual({ key: '$base-link-color', value: '#123456' });
    expect(items).toContainEqual({ key: '$base-border-radius', value: '12px' });
    expect(items).toContainEqual({ key: '$texteditor-bg', value: '#abcdef' });
    expect(items).toContainEqual({ key: '$pager-page-selected-bg', value: '#123456' });
  });

  test('reject circular Bootstrap 6 tokens', async () => {
    const input = '@use "bootstrap" with ($root-tokens: (--link-color: var(--link-color)));';
    await expect(new BootstrapExtractor(input, 6).extract()).rejects.toThrow('Circular Bootstrap token');
  });

  test('reject a Bootstrap module with missing mapped tokens', async () => {
    const extractor = new BootstrapExtractor('');
    const resolver = jest.spyOn(BootstrapExtractor, 'getFilePath')
      .mockReturnValue(require.resolve('../data/scss/widgets/generic/_variables.scss'));
    try {
      await expect(extractor.extract()).rejects.toThrow('Missing Bootstrap token: --body-font-family');
    } finally {
      resolver.mockRestore();
    }
  });

  test('convert rem units, including negatives', () => {
    expect(BootstrapExtractor.convertRemToPx('-.25rem 1rem;')).toBe('-4px 16px;');
    expect(BootstrapExtractor.convertRemToPx('2rem')).toBe('32px');
  });

  test('reject missing references', async () => {
    const input = '@use "bootstrap"; :root { --link-color: var(--missing); }';
    await expect(new BootstrapExtractor(input).extract()).rejects.toThrow('Missing Bootstrap token: --missing');
  });

  test.each([
    ['color-mix(in oklch, #000, #fff)'],
    ['color-mix(in oklch, #000, #fff 25%)'],
    ['color-mix(in oklch, #000 25%, #fff 75%)'],
  ])('resolve color mixing %s', async (value) => {
    const input = `@use "bootstrap"; :root { --link-color: ${value}; }`;
    const items = await new BootstrapExtractor(input).extract();
    expect(items.find(({ key }) => key === '$base-link-color').value).toMatch(/rgb/);
  });
});
