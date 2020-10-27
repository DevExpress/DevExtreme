import { transfer } from 'font-carrier';
import { readdirSync } from 'fs';
import { join } from 'path';

const BASE_PATH = join(__dirname, '..', '..', '..');

describe('Equals svg to font', () => {
  const getCountElementInFont = (pathToFont: string): number => {
    const transFont = transfer(pathToFont);
    const glyphKeys = Object.keys(transFont.allGlyph());

    // First three svg empty
    const countEmptySvg = 3;
    const notEmptyKeys = glyphKeys.slice(countEmptySvg);

    return notEmptyKeys.length;
  };

  const getCountElementInSvg = (pathToSvg: string): number => {
    const files = readdirSync(pathToSvg);
    return files.length;
  };

  test('generic themes', () => {
    const countElementGenericFont = getCountElementInFont(`${BASE_PATH}/icons/dxicons.ttf`);
    const countElementGenericSvg = getCountElementInSvg(`${BASE_PATH}/images/icons/generic`);

    expect(countElementGenericFont).toBe(countElementGenericSvg);
  });

  test('material themes', () => {
    const countElementMaterialFont = getCountElementInFont(`${BASE_PATH}/icons/dxiconsmaterial.ttf`);
    const countElementMaterialSvg = getCountElementInSvg(`${BASE_PATH}/images/icons/material`);

    expect(countElementMaterialFont).toBe(countElementMaterialSvg);
  });
});
