import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';

import {
  ATTRIBUTION, copyright, FONT_FORMATS, ICON_FONTS, type IconFontConfig,
} from './config.ts';
import { iconContours, type IconDrawing } from './outline.ts';
import {
  buildTrueType, buildWoff, buildWoff2, type IconGlyph, type Version,
} from './writer.ts';

export const ICON_MAP_FILE = 'scss/widgets/base/_icon_fonts.scss';

export interface BuiltFontFile {
  fileName: string;
  data: Buffer;
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

  return {
    size: height,
    viewBox: viewBox as IconDrawing['viewBox'],
    paths: paths
      .map((tag) => ({ d: attribute(tag, 'd') ?? '', evenOdd: attribute(tag, 'fill-rule') === 'evenodd' }))
      .filter(({ d }) => d),
  };
};

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
      return { code, contours: iconContours(parseIconSvg(readFileSync(path.join(directory, file), 'utf8'))) };
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
  const fonts = await Promise.all(ICON_FONTS.map(async (font) => {
    const ttf = buildTrueType({
      names: { family: font.family, copyright: copyright(2000 + version.major), ...ATTRIBUTION },
      version,
      created: new Date(font.created),
      icons: readIconGlyphs(packageRoot, font, codes),
    });

    return [
      { fileName: `${font.fileName}.ttf`, data: ttf },
      { fileName: `${font.fileName}.woff`, data: buildWoff(ttf, version) },
      { fileName: `${font.fileName}.woff2`, data: await buildWoff2(ttf, version) },
    ];
  }));

  return fonts.flat();
};
