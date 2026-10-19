import postcss, { Root } from 'postcss';
import { compileBundle } from './compiled-bundles';

const declarations = (root: Root, selector: string, property: string): string[] => {
  const values: string[] = [];
  root.walkRules(selector, (rule) => {
    rule.walkDecls(property, ({ value }) => { values.push(value); });
  });
  return values;
};

describe.each(['default', 'compact'])('Fluent Next Map markers (%s)', (size) => {
  describe.each(['light', 'dark'])('%s mode', (mode) => {
    let root: Root = postcss.root();

    beforeAll(async () => {
      root = postcss.parse(await compileBundle(['fluent-next', size, 'blue', mode]));
    });

    test('paints the marker with component custom properties', () => {
      expect(declarations(root, '.dx-map-marker-default-body', 'fill'))
        .toEqual(['var(--dx-map-marker-bg)']);
      expect(declarations(root, '.dx-map-marker-default-body', 'stroke'))
        .toEqual(['var(--dx-map-marker-content)']);
      expect(declarations(root, '.dx-map-marker-default-center', 'fill'))
        .toEqual(['var(--dx-map-marker-content)']);
    });

    test('keeps the light primary and accent colors in both modes', () => {
      expect(declarations(root, '.dx-map-container', '--dx-map-marker-bg'))
        .toEqual(['var(--dxds-color-bg-primary)']);
      expect(declarations(root, '.dx-map-container', '--dx-map-marker-content'))
        .toEqual(['var(--dxds-color-content-static-dark)']);

      const values: Record<string, string[]> = {};
      root.walkDecls(/^--dxds-color-(bg-primary|content-static-dark)$/, ({ prop, value }) => {
        values[prop] = [...(values[prop] ?? []), value];
      });
      expect([...new Set(values['--dxds-color-bg-primary'])])
        .toEqual(['var(--dxds-primary-100)']);
      expect([...new Set(values['--dxds-color-content-static-dark'])])
        .toEqual(['var(--dxds-neutral-10)']);
    });
  });
});
