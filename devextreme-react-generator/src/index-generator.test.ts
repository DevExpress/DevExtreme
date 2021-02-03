import generate from './index-generator';

// #region EXPECTED_GENERATES
const EXPECTED_GENERATES = `
export { Template } from "./core/template";
export { widget } from "./path";
export { anotherWidget } from "./another/path";
`.trimLeft();

it('generates', () => {
  expect(
    generate([
      { name: 'widget', path: './path' },
      { name: 'anotherWidget', path: './another/path' },
    ]),
  ).toBe(EXPECTED_GENERATES);
});
