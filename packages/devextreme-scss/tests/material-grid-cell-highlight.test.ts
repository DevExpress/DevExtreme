import * as path from 'path';
import { compileStringAsync } from 'sass-embedded';

type RGB = [number, number, number];

interface Highlights {
  row: RGB;
  modified: RGB;
  invalid: RGB;
}

const scssRoot = path.resolve(__dirname, '..', 'scss');

const COLORS = ['blue', 'lime', 'orange', 'purple', 'teal'] as const;
const MODES = ['light', 'dark'] as const;

// WCAG contrast ratio between a highlighted cell and a regular row.
// The designer-approved blue scheme scores ~1.3 in light mode and ~2.6 in dark mode;
// 1.0 means the highlight has the same lightness as the row and is not noticeable.
const MIN_HIGHLIGHT_CONTRAST = 1.2;

const source = (color: string, mode: string): string => `
  @use "sass:color";
  @use "widgets/material/colors" with ($color: "${color}", $mode: "${mode}");
  @use "widgets/material/gridBase/colors" as grid;

  // What the browser paints over a row: out-of-range channels are clamped
  // (e.g. hsl() lightness above 100% is white), then the color is blended by its alpha.
  @function painted($value) {
    $rgb: color.to-gamut(color.to-space($value, rgb), $method: clip);
    $rgb: color.mix(color.change($rgb, $alpha: 1), grid.$datagrid-base-background-color, color.alpha($rgb) * 100%);

    @return color.channel($rgb, "red") color.channel($rgb, "green") color.channel($rgb, "blue");
  }

  .probe {
    --row: #{painted(grid.$datagrid-base-background-color)};
    --modified: #{painted(grid.$datagrid-cell-modified-border-color)};
    --invalid: #{painted(grid.$datagrid-row-invalid-faded-border-color)};
  }
`;

const extractRGB = (css: string, name: string): RGB => {
  const match = css.match(new RegExp(`--${name}:\\s*([^;}]+)`));

  if (!match) {
    throw new Error(`--${name} is not found in:\n${css}`);
  }

  return match[1].trim().split(/\s+/).map(Number) as RGB;
};

const cache = new Map<string, Promise<Highlights>>();

const compileHighlights = (color: string, mode: string): Promise<Highlights> => {
  const key = `${color}.${mode}`;

  if (!cache.has(key)) {
    cache.set(key, compileStringAsync(source(color, mode), { loadPaths: [scssRoot] })
      .then(({ css }) => ({
        row: extractRGB(css, 'row'),
        modified: extractRGB(css, 'modified'),
        invalid: extractRGB(css, 'invalid'),
      })));
  }

  return cache.get(key) as Promise<Highlights>;
};

const luminance = (rgb: RGB): number => {
  const [r, g, b] = rgb.map((channel) => {
    const value = channel / 255;

    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

const contrast = (first: RGB, second: RGB): number => {
  const [lighter, darker] = [luminance(first), luminance(second)].sort((a, b) => b - a);

  return (lighter + 0.05) / (darker + 0.05);
};

const toHex = (rgb: RGB): string => `#${rgb.map((channel) => Math.round(channel).toString(16).padStart(2, '0')).join('')}`;

describe('Material DataGrid: modified and invalid cell highlight (T1336679)', () => {
  describe.each(MODES)('%s mode', (mode) => {
    test.each(COLORS)(`material.%s.${mode}: modified cell background stands out from the row`, async (color) => {
      const { row, modified } = await compileHighlights(color, mode);

      expect(contrast(modified, row)).toBeGreaterThanOrEqual(MIN_HIGHLIGHT_CONTRAST);
    });

    test.each(COLORS)(`material.%s.${mode}: invalid cell background stands out from the row`, async (color) => {
      const { row, invalid } = await compileHighlights(color, mode);

      expect(contrast(invalid, row)).toBeGreaterThanOrEqual(MIN_HIGHLIGHT_CONTRAST);
    });
  });

  test('material.blue keeps the designer-approved highlight colors', async () => {
    const light = await compileHighlights('blue', 'light');
    const dark = await compileHighlights('blue', 'dark');

    expect({
      lightModified: toHex(light.modified),
      lightInvalid: toHex(light.invalid),
      darkModified: toHex(dark.modified),
      darkInvalid: toHex(dark.invalid),
    }).toEqual({
      lightModified: '#c5eac7',
      lightInvalid: '#f7d7d7',
      darkModified: '#357538',
      darkInvalid: '#cb2020',
    });
  });
});
