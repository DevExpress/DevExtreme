import {
  afterEach, beforeAll, beforeEach, describe, expect, it, jest,
} from '@jest/globals';
import { setWindow } from '@js/core/utils/window';
import * as publicPalette from '@js/viz/palette';
import * as publicThemes from '@js/viz/themes';
import { Color } from '@ts/color';
import { fallbackOf } from '@ts/core/utils/css_variables';
import type * as HandedOut from '@ts/viz/handed_out';
import * as rawPalette from '@ts/viz/palette';
import { getTheme as getRawTheme } from '@ts/viz/themes';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Theme = Record<string, any>;

const palette = publicPalette as unknown as typeof HandedOut;
const { getTheme } = publicThemes as unknown as { getTheme: (name: string) => Theme };

const LITERALS = 'fluent next literals';
const LITERAL_PALETTE = {
  simpleSet: ['#0078d4', '#c83d3d', '#008f04', '#eaa300', '#e43ba6', '#865cbf'],
  indicatingSet: ['#107c10', '#f7630c', '#c50f1f'],
  gradientSet: ['#0078d4', '#008f04'],
  accentColor: '#0f6cbd',
};
const FLUENT_NEXT_THEMES = [
  'fluent-next.blue.light',
  'fluent-next.blue.light.compact',
  'fluent-next.blue.dark',
  'fluent-next.blue.dark.compact',
];
const EXTENSION_MODES = ['blend', 'alternate', 'extrapolate'];

const leftToTheBrowser = (value: unknown): string[] => {
  if (typeof value === 'string') {
    return /var\(|color-mix\(|from /.test(value) ? [value] : [];
  }

  return value && typeof value === 'object' ? Object.values(value).flatMap(leftToTheBrowser) : [];
};

const upTo = (count: number): number[] => Array.from({ length: count }, (_, index) => index);

const generatedFromLiterals = (count: number, options: object): unknown => rawPalette
  .generateColors(LITERALS, count, options as Parameters<typeof rawPalette.generateColors>[2]);

beforeAll(() => {
  rawPalette.registerPalette(LITERALS, LITERAL_PALETTE);
});

describe.each([
  ['with no window to resolve against', (): void => { setWindow({}, false); }],
  ['in a document that resolves no name', (): void => {}],
])('handing the Fluent Next colours out %s', (_, enter) => {
  beforeEach(enter);

  afterEach(() => {
    setWindow(window, true);
  });

  it('hands out the literal of every name, never the name', () => {
    expect(palette.getPalette('Fluent Next', undefined)).toEqual(LITERAL_PALETTE);
    expect(palette.getPalette('Fluent Next', { type: 'indicatingSet' })).toEqual(LITERAL_PALETTE.indicatingSet);
    expect(palette.getAccentColor('Fluent Next')).toBe(LITERAL_PALETTE.accentColor);
  });

  it.each(EXTENSION_MODES)('extends the palette by %s exactly as it extends the literals', (mode) => {
    const parameters = { extensionMode: mode, useHighlight: true };
    const handed = palette.createPalette('Fluent Next', parameters);
    const literal = rawPalette.createPalette(LITERALS, parameters);

    expect(palette.generateColors('Fluent Next', 20, { paletteExtensionMode: mode, useHighlight: true }))
      .toEqual(generatedFromLiterals(20, { paletteExtensionMode: mode, useHighlight: true }));
    expect(upTo(20).map((): unknown => handed.getNextColor(20)))
      .toEqual(upTo(20).map((): unknown => literal.getNextColor(20)));
    expect(handed.reset().generateColors(20)).toEqual(literal.reset().generateColors(20));
  });

  it('splits and grades the gradient set from the literals', () => {
    const discrete = palette.getDiscretePalette('Fluent Next', 7);
    const literalDiscrete = rawPalette.getDiscretePalette(LITERALS, 7, undefined);
    const gradient = palette.getGradientPalette('Fluent Next');
    const literalGradient = rawPalette.getGradientPalette(LITERALS, undefined);

    expect(upTo(7).map((index) => discrete.getColor(index)))
      .toEqual(upTo(7).map((index) => literalDiscrete.getColor(index)));
    expect([0, 0.3, 1].map((ratio) => gradient.getColor(ratio)))
      .toEqual([0, 0.3, 1].map((ratio) => literalGradient.getColor(ratio)));
  });

  it.each(FLUENT_NEXT_THEMES)('hands out %s with literals only', (name) => {
    const theme = getTheme(name);
    const registered: Theme = getRawTheme(name);

    expect(leftToTheBrowser(theme)).toEqual([]);
    expect(theme.backgroundColor).toBe(fallbackOf(registered.backgroundColor));
    expect(theme.font.family).toBe(fallbackOf(registered.font.family));
    expect(registered.backgroundColor).toMatch(/^var\(--dx-viz-bg, /);
  });

  it('hands a font weight out as the number every other theme gives', () => {
    const theme = getTheme('fluent-next.blue.light');
    const registered: Theme = getRawTheme('fluent-next.blue.light');

    expect(registered.font.weight).toBe('var(--dx-viz-font-weight, 400)');
    expect(theme.font.weight).toBe(400);
    expect(theme.title.font.weight).toBe(600);
  });

  it('leaves every other palette and theme exactly as it was', () => {
    expect(palette.getPalette('Material', undefined)).toBe(rawPalette.getPalette('Material', undefined));
    expect(palette.generateColors('Soft Pastel', 20, {}))
      .toEqual(rawPalette.generateColors('Soft Pastel', 20, { keepLastColorInEnd: false }));
    ['generic.light', 'generic.dark', 'material.blue.light', 'fluent.blue.light', 'fluent.blue.dark'].forEach((name) => {
      expect(getTheme(name)).toBe(getRawTheme(name));
    });
  });
});

describe('handing the Fluent Next colours out on a page that paints the names', () => {
  const DECLARED_FONT = 'Inter, sans-serif';
  const DECLARED_TITLE_WEIGHT = '700';
  const MIXED = 'color(srgb 0.2 0.4 0.6)';
  const PRIMARY_IN_SRGB = 'color(srgb -0.186828 0.505925 0.943796)';
  let declaredBlue = 'rgb(11, 7, 3)';
  let declaredPrimary = 'rgb(15, 108, 189)';

  const paint = (written: string): string => {
    if (/--dx-viz-font-family|font-weight/.test(written)) {
      return 'none';
    }

    if (written.startsWith('color-mix(in srgb, var(--dx-viz-primary,')) {
      return PRIMARY_IN_SRGB;
    }

    if (/color-mix\(|from /.test(written)) {
      return MIXED;
    }

    if (written.startsWith('var(--dx-viz-blue,')) {
      return declaredBlue;
    }

    if (written.startsWith('var(--dx-viz-primary,')) {
      return declaredPrimary;
    }

    const { r, g, b } = new Color(fallbackOf(written));

    return `rgb(${r}, ${g}, ${b})`;
  };

  beforeEach(() => {
    declaredBlue = 'rgb(11, 7, 3)';
    declaredPrimary = 'rgb(15, 108, 189)';
    jest.spyOn(window, 'getComputedStyle').mockImplementation((element) => ({
      fill: paint((element as SVGElement).style.getPropertyValue('fill')),
      getPropertyValue: (name: string): string => ({
        '--dx-viz-font-family': DECLARED_FONT,
        '--dx-viz-title-font-weight': DECLARED_TITLE_WEIGHT,
      })[name] ?? '',
    }) as unknown as CSSStyleDeclaration);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('hands out the colour the page paints a name with', () => {
    expect((palette.getPalette('Fluent Next', undefined) as Theme).simpleSet[0]).toBe('#0b0703');
    expect(palette.getAccentColor('Fluent Next')).toBe('#0f6cbd');
    expect((palette.generateColors('Fluent Next', 6) as string[])[0]).toBe('#0b0703');
    expect(palette.createPalette('Fluent Next', {}).getNextColor(undefined)).toBe('#0b0703');
    expect(getTheme('fluent-next.blue.light').bullet.color).toBe('#0b0703');
  });

  it('hands out what the browser mixes as a colour an application can parse', () => {
    const extended = palette.generateColors('Fluent Next', 12, { paletteExtensionMode: 'blend' }) as string[];

    expect(extended.filter((color) => !/^#[0-9a-f]{6}$/.test(color))).toEqual([]);
    expect(extended).toContain('#336699');
    expect(palette.getDiscretePalette('Fluent Next', 3).getColor(1)).toBe('#336699');
    expect(palette.getGradientPalette('Fluent Next').getColor(0.5)).toBe('#336699');
  });

  it('asks the page again every time a created palette hands a colour out', () => {
    const created = palette.createPalette('Fluent Next', {});

    declaredBlue = 'rgb(1, 2, 3)';

    expect(created.getNextColor(undefined)).toBe('#010203');
  });

  it('hands out a colour the page declares in another colour space as rgb', () => {
    declaredPrimary = 'oklch(0.6 0.2 250)';

    expect(palette.getAccentColor('Fluent Next')).toBe('#0081f1');
  });

  it('reads a name that is not a colour from what the page declares for it', () => {
    expect(getTheme('fluent-next.blue.light').font.family).toBe(DECLARED_FONT);
  });

  it('hands a font weight the page declares out as a number', () => {
    const theme = getTheme('fluent-next.blue.light');

    expect(theme.title.font.weight).toBe(700);
    expect(theme.font.weight).toBe(400);
  });

  it('resolves a whole theme with one probe, each distinct value once, and leaves nothing behind', () => {
    const root = document.documentElement;
    const appended = jest.spyOn(root, 'appendChild');
    const names = new Set(leftToTheBrowser(getRawTheme('fluent-next.blue.dark')));

    getTheme('fluent-next.blue.dark');

    expect(appended).toHaveBeenCalledTimes(1);

    const probe = appended.mock.calls[0][0] as Element;
    const probed = Array.from(probe.children, (swatch) => (swatch as SVGElement).style.getPropertyValue('fill'))
      .filter((fill) => names.has(fill));

    expect(probed).toHaveLength(names.size);
    expect(new Set(probed).size).toBe(names.size);
    expect(root.contains(probe)).toBe(false);
  });
});
