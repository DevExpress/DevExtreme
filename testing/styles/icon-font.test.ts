import { loadSync } from 'opentype.js';
import { readdirSync } from 'fs';
import { join, extname } from 'path';

const BASE_PATH = join(__dirname, '..', '..');

describe('Equals svg to font', () => {
  const getCountElementInFont = (pathToFont: string): number => {
    // NOTE: Different SVG parsers produce different headers.
    // For opentype.js: first five glyphs are empty
    const countEmptySvg = 4;

    // eslint-disable-next-line spellcheck/spell-checker, @typescript-eslint/no-unsafe-member-access
    return loadSync(pathToFont).glyphs.length - countEmptySvg;
  };

  const getCountElementInSvg = (pathToSvg: string): number => {
    const files = readdirSync(pathToSvg);
    const svgFiles = files.filter((file) => extname(file) === '.svg');

    return svgFiles.length;
  };

  test('generic themes', () => {
    const countElementGenericFont = getCountElementInFont(`${BASE_PATH}/icons/dxicons.ttf`);
    const countElementGenericSvg = getCountElementInSvg(`${BASE_PATH}/images/icons/generic`);

    expect(countElementGenericFont).toBe(countElementGenericSvg);
  });

  test('material themes', () => {
    const countElementMaterialFont = getCountElementInFont(`${BASE_PATH}/icons/dxiconsmaterial.ttf`) - 2; // TODO
    const countElementMaterialSvg = getCountElementInSvg(`${BASE_PATH}/images/icons/material`);

    expect(countElementMaterialFont).toBe(countElementMaterialSvg);
  });

  test('check svg elements', () => {
    const isOnlyMaterialIcons = ['belloutline.svg', 'optionsgear.svg', 'photooutline.svg', 'pinmap.svg', 'send.svg'];

    const genericIcons = readdirSync(`${BASE_PATH}/images/icons/generic`);
    const materialIcons = readdirSync(`${BASE_PATH}/images/icons/material`).filter((svg) => !isOnlyMaterialIcons.includes(svg));

    const differenceMaterial = materialIcons.filter((svg) => !genericIcons.includes(svg));
    const differenceGeneric = genericIcons.filter((svg) => !materialIcons.includes(svg));

    expect(differenceMaterial.toString()).toBe(differenceGeneric.toString());
  });
});
