import { createHash } from 'crypto';
import { readFileSync } from 'fs';
import { join } from 'path';

import {
  buildIconFonts, fontFileNames, fontPath, glyphPath, parseIconSvg,
} from '../tools/icon-fonts/icon-fonts';

const PACKAGE_ROOT = join(__dirname, '..');

const sha256 = (data: Buffer | undefined): string => (data ? createHash('sha256').update(data).digest('hex') : 'not built');

const icon = (paths: string[]): string => `<svg width="16" height="16" viewBox="0 0 1024 1024">${paths.map((d) => `<path d="${d}"/>`).join('')}</svg>`;

const drawing = (svgAttributes: string, pathAttributes: string): string => `<svg width="16" height="16" viewBox="0 0 1024 1024" ${svgAttributes}><path ${pathAttributes} d="M100 100h400v400h-400z"/></svg>`;

describe('Icon fonts build', () => {
  let built = new Map<string, Buffer>();

  beforeAll(async () => {
    const files = await buildIconFonts(PACKAGE_ROOT);

    built = new Map(files.map(({ fileName, data }) => [fileName, data]));
  });

  test.each(fontFileNames())('icons/%s is the build of images/icons (pnpm run icon-fonts:build)', (fileName) => {
    const committed = readFileSync(fontPath(PACKAGE_ROOT, fileName));

    expect(sha256(built.get(fileName))).toBe(sha256(committed));
  });
});

describe('Icon svg files', () => {
  test.each([
    ['a 16 px drawing', icon(['M100 100h400v400h-400z']), 'M100,860L500,860L500,460L100,460Z'],
    ['an 18 px drawing', '<svg width="18" height="18" viewBox="0 0 18 18"><path d="M0 17H18"/></svg>', 'M0,0L1024,0Z'],
    ['a 24 px drawing', '<svg width="24" height="24" viewBox="0 0 24 24"><path d="M0 22H24"/></svg>', 'M0,0L1024,0Z'],
  ])('%s is scaled to the em square with the baseline on its pixel grid', (_, svg, d) => {
    expect(glyphPath(parseIconSvg(svg))).toBe(d);
  });

  test('overlapping paths drawn in opposite directions both turn clockwise', () => {
    expect(glyphPath(parseIconSvg(icon(['M100 100h400v400h-400z', 'M100 100v400h400v-400z']))))
      .toBe('M100,860L500,860L500,460L100,460ZM500,860L500,460L100,460L100,860Z');
  });

  test('a path keeps its holes when it turns clockwise', () => {
    expect(glyphPath(parseIconSvg(icon(['M100 100v800h800v-800zM300 300h400v400h-400z']))))
      .toBe('M900,860L900,60L100,60L100,860ZM300,260L700,260L700,660L300,660Z');
  });

  test('a curve that turns clockwise swaps its control points', () => {
    expect(glyphPath(parseIconSvg(icon(['M512 448v400c221 0 400-179 400-400z']))))
      .toBe('M912,512C912,291 733,112 512,112L512,512Z');
  });

  test('shapes other than paths are rejected', () => {
    expect(() => parseIconSvg('<svg width="16" height="16" viewBox="0 0 1024 1024"><circle r="5"/></svg>')).toThrow('only <path>');
  });

  test.each([
    ['a stroked path', drawing('', 'stroke="#000"'), 'strokes'],
    ['a path with fill="none"', drawing('', 'fill="none"'), 'fill="none"'],
    ['a path that takes fill="none" from the svg', drawing('fill="none"', ''), 'fill="none"'],
    ['a transparent path', drawing('', 'opacity="0.87"'), 'opacity'],
    ['a style attribute', drawing('', 'style="fill: none"'), 'style'],
    ['an evenodd path', drawing('', 'fill-rule="evenodd"'), 'evenodd'],
    ['a path that takes fill-rule="evenodd" from the svg', drawing('fill-rule="evenodd"', ''), 'evenodd'],
  ])('%s is rejected', (_, svg, message) => {
    expect(() => parseIconSvg(svg)).toThrow(message);
  });

  test('a path with its own fill under <svg fill="none"> is drawn', () => {
    expect(parseIconSvg(drawing('fill="none"', 'fill="#333"')).paths).toHaveLength(1);
  });
});
