import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';

import svg2ttf from 'svg2ttf';
import svgpath from 'svgpath';
import ttf2woff from 'ttf2woff';
import { compress } from 'wawoff2';

import {
  ATTRIBUTION, copyright, FONT_FORMATS, ICON_FONTS, type IconFontConfig,
} from './config.ts';
import {
  ASCENT, DESCENT, patchTrueType, UNITS_PER_EM, type Version, withVersion,
} from './truetype.ts';

export const ICON_MAP_FILE = 'scss/widgets/base/_icon_fonts.scss';

export interface BuiltFontFile {
  fileName: string;
  data: Buffer;
}

export interface IconDrawing {
  size: number;
  viewBox: [number, number, number, number];
  paths: string[];
}

interface IconGlyph {
  code: number;
  name: string;
  d: string;
}

type Point = [number, number];

interface Contour {
  start: Point;
  segments: { controls: Point[]; end: Point }[];
}

export const svgDirectory = (packageRoot: string, font: IconFontConfig): string => path.join(packageRoot, 'images', 'icons', font.theme);

export const fontPath = (packageRoot: string, fileName: string): string => path.join(packageRoot, 'icons', fileName);

export const fontFileNames = (): string[] => ICON_FONTS.flatMap(({ fileName }) => FONT_FORMATS.map((format) => `${fileName}.${format}`));

export const readIconCodes = (packageRoot: string): Map<string, number> => {
  const scss = readFileSync(path.join(packageRoot, ICON_MAP_FILE), 'utf8');
  const start = scss.indexOf('$icons: (');
  const end = scss.indexOf(') !default;', start);

  if (start === -1 || end === -1) {
    throw new Error(`No $icons map in ${ICON_MAP_FILE}`);
  }

  return new Map([...scss.slice(start, end).matchAll(/"([^"]+)"\s*:\s*"\\([0-9a-fA-F]+)"/g)]
    .map(([, name, code]) => [name, parseInt(code, 16)]));
};

// Every glyph is drawn by one svg named after the first name of its code in the $icons map.
export const readIconNames = (codes: Map<string, number>): Map<number, string> => {
  const names = new Map<number, string>();

  codes.forEach((code, name) => {
    if (!names.has(code)) {
      names.set(code, name);
    }
  });

  return names;
};

export const readVersion = (packageRoot: string): Version => {
  const { version } = JSON.parse(readFileSync(path.join(packageRoot, 'package.json'), 'utf8')) as { version: string };
  const [major, minor] = version.split('.').map(Number);

  return { major, minor };
};

const attribute = (tag: string, name: string): string | undefined => new RegExp(`\\s${name}="([^"]*)"`).exec(tag)?.[1];

export const parseIconSvg = (svg: string): IconDrawing => {
  const root = /<svg\b[^>]*>/.exec(svg)?.[0] ?? '';
  const height = Number(attribute(root, 'height'));
  const viewBox = (attribute(root, 'viewBox') ?? '').trim().split(/[\s,]+/).map(Number);
  const tags = [...svg.matchAll(/<([a-zA-Z][\w:-]*)\b[^>]*>/g)];
  const unsupported = tags.map(([, name]) => name).filter((name) => !['svg', 'title', 'path'].includes(name));
  const paths = tags.filter(([, name]) => name === 'path').map(([tag]) => tag);
  const paint = (tag: string, name: string): string | undefined => (
    attribute(tag, name) ?? attribute(root, name)
  );

  if (!height || viewBox.length !== 4 || viewBox.some(Number.isNaN)) {
    throw new Error('expected a height and a viewBox');
  }

  if (unsupported.length) {
    throw new Error(`only <path> elements are supported, found <${unsupported.join('>, <')}>`);
  }

  if (paths.some((tag) => attribute(tag, 'transform') !== undefined)) {
    throw new Error('paths with a transform are not supported');
  }

  if ([root, ...paths].some((tag) => attribute(tag, 'style') !== undefined)) {
    throw new Error('style attributes are not supported');
  }

  if (paths.some((tag) => (paint(tag, 'stroke') ?? 'none') !== 'none')) {
    throw new Error('strokes are not supported, outline them');
  }

  if (paths.some((tag) => paint(tag, 'fill') === 'none')) {
    throw new Error('paths with fill="none" are not supported');
  }

  if ([root, ...paths].some((tag) => ['opacity', 'fill-opacity'].some((name) => Number(attribute(tag, name) ?? 1) !== 1))) {
    throw new Error('opacity and fill-opacity are not supported');
  }

  if (paths.some((tag) => paint(tag, 'fill-rule') === 'evenodd')) {
    throw new Error('fill-rule="evenodd" is not supported, draw holes in the opposite direction');
  }

  return {
    size: height,
    viewBox: viewBox as IconDrawing['viewBox'],
    paths: paths.map((tag) => attribute(tag, 'd') ?? '').filter((d) => d),
  };
};

const pathContours = (drawing: ReturnType<typeof svgpath>): Contour[] => {
  const contours: Contour[] = [];
  let open = false;

  drawing.abs().unshort().unarc().iterate((segment, _index, x, y) => {
    const [command] = segment;
    const values = segment.slice(1) as number[];

    if (command === 'M') {
      contours.push({ start: [values[0], values[1]], segments: [] });
      open = true;
    } else if (command === 'Z') {
      open = false;
    } else {
      if (!open) {
        contours.push({ start: [x, y], segments: [] });
        open = true;
      }

      let coordinates = values;

      if (command === 'H') {
        coordinates = [values[0], y];
      } else if (command === 'V') {
        coordinates = [x, values[0]];
      }

      const points = Array.from({ length: coordinates.length / 2 }, (_, point): Point => [
        coordinates[2 * point], coordinates[2 * point + 1],
      ]);
      const end = points.pop() as Point;

      contours[contours.length - 1].segments.push({ controls: points, end });
    }
  });

  return contours;
};

// Twice the signed area of the polygon through all points of a contour, positive when it runs
// counterclockwise.
const doubleArea = ({ start, segments }: Contour): number => {
  const points = [start, ...segments.flatMap(({ controls, end }) => [...controls, end])];

  return points.reduce((sum, [x, y], index) => {
    const [nextX, nextY] = points[(index + 1) % points.length];

    return sum + x * nextY - nextX * y;
  }, 0);
};

const reverse = ({ start, segments }: Contour): Contour => {
  const starts = [start, ...segments.map(({ end }) => end)];

  return {
    start: starts[starts.length - 1],
    segments: segments
      .map(({ controls }, index) => ({ controls: [...controls].reverse(), end: starts[index] }))
      .reverse(),
  };
};

const encode = ({ start, segments }: Contour): string => `M${start}${segments
  .map(({ controls, end }) => `${['L', 'Q', 'C'][controls.length]}${[...controls, end].join(' ')}`)
  .join('')}Z`;

// The drawing scaled to the em square, with the baseline on a whole unit of the icon's design grid
// as in the IcoMoon projects. Every path turns clockwise: a glyph fills all its contours together,
// so overlapping paths drawn in opposite directions would cancel out, and macOS emboldens glyphs
// along the contour direction.
export const glyphPath = ({ size, viewBox, paths }: IconDrawing): string => {
  const [x0, y0, , height] = viewBox;
  const scale = UNITS_PER_EM / height;
  const baseline = Math.round((size * -DESCENT) / UNITS_PER_EM) * (UNITS_PER_EM / size);
  const top = UNITS_PER_EM - baseline;

  return paths.flatMap((d) => {
    const contours = pathContours(svgpath(d)
      .translate(-x0, -y0)
      .scale(scale, -scale)
      .translate(0, top));
    const counterclockwise = contours.reduce((sum, contour) => sum + doubleArea(contour), 0) > 0;

    return (counterclockwise ? contours.map(reverse) : contours).map(encode);
  }).join('');
};

const svgFont = (font: IconFontConfig, glyphs: IconGlyph[]): string => [
  `<svg xmlns="http://www.w3.org/2000/svg"><defs><font id="${font.family}" horiz-adv-x="${UNITS_PER_EM}">`,
  `<font-face font-family="${font.family}" units-per-em="${UNITS_PER_EM}" ascent="${ASCENT}" descent="${DESCENT}"/>`,
  `<missing-glyph horiz-adv-x="${UNITS_PER_EM}"/>`,
  `<glyph unicode=" " glyph-name="space" horiz-adv-x="${UNITS_PER_EM / 2}" d=""/>`,
  ...[...glyphs].sort((a, b) => a.code - b.code).map(({ code, name, d }) => (
    `<glyph unicode="&#x${code.toString(16)};" glyph-name="${name}" horiz-adv-x="${UNITS_PER_EM}" d="${d}"/>`
  )),
  '</font></defs></svg>',
].join('');

const readIconGlyphs = (
  packageRoot: string,
  font: IconFontConfig,
  codes: Map<string, number>,
): IconGlyph[] => {
  const directory = svgDirectory(packageRoot, font);
  const names = readIconNames(codes);
  const glyphs = readdirSync(directory).filter((file) => file.endsWith('.svg')).map((file) => {
    const name = path.basename(file, '.svg');
    const code = codes.get(name);
    const where = `images/icons/${font.theme}/${file}`;

    if (code === undefined) {
      throw new Error(`${where}: "${name}" is not in the $icons map of ${ICON_MAP_FILE}`);
    }

    if (names.get(code) !== name) {
      throw new Error(`${where}: name the file ${names.get(code)}.svg, the first name of \\${code.toString(16)} in $icons`);
    }

    try {
      return { code, name, d: glyphPath(parseIconSvg(readFileSync(path.join(directory, file), 'utf8'))) };
    } catch (error) {
      throw new Error(`${where}: ${(error as Error).message}`);
    }
  });
  const drawn = new Set(glyphs.map(({ code }) => code));
  const missing = [...names].filter(([code]) => !drawn.has(code)).map(([, name]) => `${name}.svg`);

  if (missing.length) {
    throw new Error(`images/icons/${font.theme} has no ${missing.join(', ')}`);
  }

  return glyphs;
};

export const buildIconFonts = async (packageRoot: string): Promise<BuiltFontFile[]> => {
  const codes = readIconCodes(packageRoot);
  const version = readVersion(packageRoot);
  const files: BuiltFontFile[] = [];

  // wawoff2 returns a view into its wasm memory that the next call overwrites,
  // so the fonts are compressed one at a time and each result is copied at once.
  for (const font of ICON_FONTS) {
    const svg = svgFont(font, readIconGlyphs(packageRoot, font, codes));
    const raw = svg2ttf(svg, {
      familyname: font.family,
      version: `${version.major}.${version.minor}`,
      ts: Date.parse(font.created) / 1000,
    });
    const ttf = patchTrueType(Buffer.from(raw.buffer), {
      family: font.family, copyright: copyright(2000 + version.major), ...ATTRIBUTION,
    }, version);

    files.push(
      { fileName: `${font.fileName}.ttf`, data: ttf },
      { fileName: `${font.fileName}.woff`, data: withVersion(Buffer.from(ttf2woff(ttf)), 20, version) },
      // eslint-disable-next-line no-await-in-loop
      { fileName: `${font.fileName}.woff2`, data: withVersion(Buffer.from(await compress(ttf)), 24, version) },
    );
  }

  return files;
};
