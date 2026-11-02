import { createHash } from 'crypto';
import { readFileSync } from 'fs';
import { join } from 'path';

import {
  buildIconFonts, fontFileNames, fontPath, parseIconSvg,
} from '../tools/icon-fonts/icon-fonts';
import { iconContours, type Contour } from '../tools/icon-fonts/outline';

const PACKAGE_ROOT = join(__dirname, '..');

const sha256 = (data: Buffer | undefined): string => (data ? createHash('sha256').update(data).digest('hex') : 'not built');

const icon = (paths: string[], fillRule = 'nonzero'): string => `<svg width="16" height="16" viewBox="0 0 1024 1024">${paths.map((d) => `<path fill-rule="${fillRule}" d="${d}"/>`).join('')}</svg>`;

const area = (contour: Contour): number => contour.reduce((sum, point, index) => {
  const next = contour[(index + 1) % contour.length];

  return sum + point.x * next.y - next.x * point.y;
}, 0) / 2;

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

describe('Icon outlines', () => {
  test('overlapping paths drawn in opposite directions both stay filled', () => {
    const contours = iconContours(parseIconSvg(icon(['M100 100h400v400h-400z', 'M100 100v400h400v-400z'])));

    expect(contours.map((contour) => Math.sign(area(contour)))).toEqual([-1, -1]);
  });

  test('a hole inside a path keeps the opposite direction', () => {
    const contours = iconContours(parseIconSvg(icon(['M100 100h800v800h-800zM300 300v400h400v-400z'])));

    expect(contours.map((contour) => Math.sign(area(contour)))).toEqual([-1, 1]);
  });

  test('a contour inside an evenodd path is a hole whatever its direction', () => {
    const contours = iconContours(parseIconSvg(icon(['M100 100h800v800h-800zM300 300h400v400h-400z'], 'evenodd')));

    expect(contours.map((contour) => Math.sign(area(contour)))).toEqual([-1, 1]);
  });

  test('curves stay on the drawn circle', () => {
    const handle = 0.5523 * 400;
    const [contour] = iconContours(parseIconSvg(icon([`M512 112c${handle} 0 400 ${400 - handle} 400 400h-400z`])));
    const center = { x: 512, y: 960 - 512 };
    const onArc = contour
      .filter(({ onCurve }) => onCurve)
      .map(({ x, y }) => Math.hypot(x - center.x, y - center.y))
      .filter((radius) => radius > 100);

    expect(contour.filter(({ onCurve }) => !onCurve).length).toBeGreaterThan(1);
    onArc.forEach((radius) => {
      expect(Math.abs(radius - 400)).toBeLessThanOrEqual(1.5);
    });
  });

  test('shapes other than paths are rejected', () => {
    expect(() => parseIconSvg('<svg width="16" height="16" viewBox="0 0 1024 1024"><circle r="5"/></svg>')).toThrow('only <path>');
  });
});
