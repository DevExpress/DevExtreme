import { readdirSync, readFileSync } from 'fs';
import { basename, join, extname } from 'path';

import { readGlyphCount } from './font-tables';

const BASE_PATH = join(__dirname, '..');
const SVG_ICONS_ROOT = `${BASE_PATH}/images/icons`;

describe('Equals svg to font', () => {
  const getCountElementInFont = (pathToFont: string): number => {
    const countEmptySvg = 4;

    return readGlyphCount(readFileSync(pathToFont)) - countEmptySvg;
  };

  const getCountElementInSvg = (pathToSvg: string): number => {
    const files = readdirSync(pathToSvg);
    const svgFiles = files.filter((file) => extname(file) === '.svg');

    return svgFiles.length;
  };

  const findSvgWithComments = (folders: string[]): string[] => {
    const result: string[] = [];

    folders.forEach((dir) => {
      let files: string[] = [];

      try {
        files = readdirSync(dir);
      } catch {
        return;
      }

      files.filter((f) => extname(f) === '.svg').forEach((file) => {
        const content = readFileSync(join(dir, file), 'utf8');

        if (content.includes('<!--')) {
          result.push(`${dir}/${file}`);
        }
      });
    });

    return result;
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

  test('fluent theme', () => {
    const countElementFluentFont = getCountElementInFont(`${BASE_PATH}/icons/dxiconsfluent.ttf`);
    const countElementFluentSvg = getCountElementInSvg(`${BASE_PATH}/images/icons/fluent`);

    expect(countElementFluentFont).toBe(countElementFluentSvg);
  });

  test('check svg elements', () => {
    const genericIcons = readdirSync(`${BASE_PATH}/images/icons/generic`);
    const materialIcons = readdirSync(`${BASE_PATH}/images/icons/material`);
    const fluentIcons = readdirSync(`${BASE_PATH}/images/icons/fluent`);

    const differenceFluent = fluentIcons.filter((svg) => !genericIcons.includes(svg));
    const differenceMaterial = materialIcons.filter((svg) => !genericIcons.includes(svg));
    const differenceGeneric = genericIcons.filter((svg) => !materialIcons.includes(svg));

    expect(differenceMaterial.toString()).toBe(differenceGeneric.toString());
    expect(differenceFluent.toString()).toBe(differenceGeneric.toString());
  });

  test('svg do not contain comments', () => {
    const folders = [
      `${SVG_ICONS_ROOT}/generic`,
      `${SVG_ICONS_ROOT}/material`,
      `${SVG_ICONS_ROOT}/fluent`,
    ];
    const svgWithComments = findSvgWithComments(folders);

    expect(svgWithComments).toEqual([]);
  });
});

describe('Icon svg files', () => {
  const ICON_SIZES = { generic: 18, material: 24, fluent: 20 };
  const MATERIAL_18_PX_ICONS = [
    'contains', 'doesnotcontain', 'endswith', 'equal', 'greater', 'greaterorequal',
    'less', 'lessorequal', 'notequal', 'range', 'startswith',
  ];

  const readIcons = (theme: string): [string, string][] => readdirSync(`${SVG_ICONS_ROOT}/${theme}`)
    .filter((file) => extname(file) === '.svg')
    .map((file) => [
      basename(file, '.svg'),
      readFileSync(`${SVG_ICONS_ROOT}/${theme}/${file}`, 'utf8'),
    ]);

  const attribute = (tag: string, name: string): string | undefined => new RegExp(`\\s${name}="([^"]*)"`)
    .exec(tag)?.[1];

  test.each(Object.entries(ICON_SIZES))('%s icons have the size of the theme', (theme, themeSize) => {
    const wrongSizes = readIcons(theme).flatMap(([name, svg]) => {
      const size = theme === 'material' && MATERIAL_18_PX_ICONS.includes(name) ? 18 : themeSize;
      const root = /<svg\b[^>]*>/.exec(svg)?.[0] ?? '';
      const [width, height, viewBox] = ['width', 'height', 'viewBox'].map((key) => attribute(root, key));

      return width === `${size}` && height === `${size}` && viewBox === `0 0 ${size} ${size}`
        ? []
        : [`${name}: ${width}x${height}, viewBox "${viewBox}", expected ${size}`];
    });

    expect(wrongSizes).toEqual([]);
  });

  test.each(Object.keys(ICON_SIZES))('%s icons have their name as the title', (theme) => {
    const wrongTitles = readIcons(theme)
      .filter(([name, svg]) => {
        const titles = [...svg.matchAll(/<title>([^<]*)<\/title>/g)].map(([, title]) => title);

        return titles.length !== 1 || titles[0] !== name;
      })
      .map(([name]) => name);

    expect(wrongTitles).toEqual([]);
  });
});
