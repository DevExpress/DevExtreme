import postcss, { Root } from 'postcss';
import { compileBundle } from './compiled-bundles';

jest.setTimeout(300000);

const declarations = (root: Root, selector: string, property: string): string[] => {
  const values: string[] = [];
  root.walkRules(selector, (rule) => {
    rule.walkDecls(property, ({ value }) => { values.push(value); });
  });
  return values;
};

test.each(['light', 'dark'])('Fluent Next Map markers use component colors in %s mode', async (mode) => {
  const root = postcss.parse(await compileBundle(['fluent-next', 'default', 'blue', mode]));

  expect(declarations(root, '.dx-map-marker-default-body', 'fill'))
    .toEqual(['var(--dx-map-marker-bg)']);
  expect(declarations(root, '.dx-map-marker-default-body', 'stroke'))
    .toEqual(['var(--dx-map-marker-content)']);
  expect(declarations(root, '.dx-map-marker-default-center', 'fill'))
    .toEqual(['var(--dx-map-marker-content)']);
});
