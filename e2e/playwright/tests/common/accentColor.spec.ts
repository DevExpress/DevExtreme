/* eslint-disable spellcheck/spell-checker */
import type { Page } from '@playwright/test';
import { expect, test } from '../../fixtures';
import { createWidget } from '../../helpers/createWidget';
import { appendElementTo } from '../../helpers/domUtils';
import { testScreenshot } from '../../helpers/screenshots';
import { getThemeName } from '../../helpers/themeUtils';

const STEPS = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180];

const DESIGNED_PALETTE_TOLERANCE = 4;
const HUE_TOLERANCE = 0.01;

interface Oklch {
  l: number;
  c: number;
  h: number;
}

interface MeasuredStep {
  step: number;
  resolved: string;
  oklch: Oklch | null;
}

interface MeasuredPalette {
  measured: MeasuredStep[];
  source: Oklch | null;
  settings: { lightnessMax: number; lightnessMin: number; chromaMin: number };
}

interface Painted {
  painted: { selectedRange: string; handles: string[]; markers: string[] };
  primary: string;
  inPlace: boolean;
}

interface PaintedAccent extends Painted {
  name: string;
}

// The color probes below read a computed color back as hex; the page gets the reader once,
// because a function cannot travel into the page as an argument.
const installAsHex = (page: Page): Promise<void> => page.evaluate(() => {
  (window as any).asHex = (value: string): string => {
    const probe = document.createElement('div');
    document.body.appendChild(probe);
    probe.style.backgroundColor = `rgb(from ${value} r g b)`;
    const resolved = getComputedStyle(probe).backgroundColor;
    probe.remove();

    const channels = (resolved.match(/[-\d.]+/g) ?? []).slice(0, 3);
    const scale = resolved.startsWith('color(') ? 255 : 1;

    return channels.length === 3
      ? `#${channels
        .map((raw) => Math.round(Math.min(255, Math.max(0, +raw * scale))).toString(16).padStart(2, '0'))
        .join('')}`
      : resolved;
  };
});

const measurePalette = (
  page: Page,
  accent: string | null,
  steps: number[],
): Promise<MeasuredPalette> => page.evaluate(({ accentColor, paletteSteps }) => {
  const root = document.documentElement;

  if (accentColor) {
    root.style.setProperty('--dx-accent-color', accentColor);
  } else {
    root.style.removeProperty('--dx-accent-color');
  }

  const probe = document.createElement('div');
  document.body.appendChild(probe);

  const asOklch = (color: string): Oklch | null => {
    probe.style.backgroundColor = `oklch(from ${color} l c h)`;
    const resolved = getComputedStyle(probe).backgroundColor;
    const parts = /^oklch\(([-\d.]+) ([-\d.]+) ([-\d.]+|none)/.exec(resolved);

    if (!parts) {
      return null;
    }

    if (parts[3] !== 'none') {
      return { l: +parts[1], c: +parts[2], h: +parts[3] };
    }

    // Chrome 157 reports the hue of a near-grey as "none"; the a and b axes still carry it.
    probe.style.backgroundColor = `oklab(from ${color} l a b)`;
    const [, , a, b] = (/^oklab\(([-\d.]+) ([-\d.e]+) ([-\d.e]+)/.exec(getComputedStyle(probe).backgroundColor) ?? [])
      .map(Number);
    const hue = (Math.atan2(b, a) * 180) / Math.PI;

    return { l: +parts[1], c: +parts[2], h: hue < 0 ? hue + 360 : hue };
  };

  const read = (step: number): MeasuredStep => {
    probe.style.backgroundColor = `var(--dxds-primary-${step})`;
    const resolved = getComputedStyle(probe).backgroundColor;

    return { step, resolved, oklch: asOklch(resolved) };
  };

  const setting = (name: string): number => +getComputedStyle(root).getPropertyValue(name).trim();
  const measured = paletteSteps.map(read);
  const source = accentColor ? asOklch(accentColor) : null;

  probe.remove();

  return {
    measured,
    source,
    settings: {
      lightnessMax: setting('--dx-accent-lightness-max'),
      lightnessMin: setting('--dx-accent-lightness-min'),
      chromaMin: setting('--dx-accent-chroma-min'),
    },
  };
}, { accentColor: accent, paletteSteps: steps });

const PALETTE_STRIP = 'accent-palette';
const ACCENT_GRID = 'accent-grid';
const ACCENT_RANGE = 'accent-range';
const SELECTED_RANGE = `#${ACCENT_RANGE} .dxrs-slidersContainer > path`;
const SLIDER_HANDLES = `#${ACCENT_RANGE} .slider > path`;
const SLIDER_MARKERS = `#${ACCENT_RANGE} .slider-marker > path`;
const GRID_DATA = Array.from({ length: 5 }, (_, row) => ({
  field_0: `val_${row}_0`,
  field_1: `val_${row}_1`,
}));
const SHIPPED_ACCENTS = [
  { palette: 'blue', color: '#0f6cbd' },
  { palette: 'rust', color: '#da3b01' },
  { palette: 'mint', color: '#018574' },
];

const drawPaletteStrip = (page: Page, accent: string, steps: number[]): Promise<void> => page
  .evaluate(({ accentColor, paletteSteps, stripId }) => {
    const { asHex } = window as any;

    document.documentElement.style.setProperty('--dx-accent-color', accentColor);
    const strip = document.getElementById(stripId)!;
    strip.textContent = '';

    const swatches = paletteSteps.map((step) => {
      const column = document.createElement('div');
      column.style.cssText = 'width: 60px; font: 10px/14px monospace; color: #000; text-align: center';

      const swatch = document.createElement('div');
      swatch.style.cssText = 'height: 60px; border: 1px solid #000';
      swatch.style.backgroundColor = `var(--dxds-primary-${step})`;

      const caption = document.createElement('div');
      caption.textContent = `${step}`;

      column.appendChild(swatch);
      column.appendChild(caption);
      strip.appendChild(column);

      return { step, swatch, caption };
    });

    for (const { step, swatch, caption } of swatches) {
      caption.textContent = `${step}\n${asHex(getComputedStyle(swatch).backgroundColor)}`;
      caption.style.whiteSpace = 'pre';
    }
  }, { accentColor: accent, paletteSteps: steps, stripId: PALETTE_STRIP });

const oklchDistance = (first: Oklch, second: Oklch): number => {
  const radians = Math.PI / 180;
  const firstA = first.c * Math.cos(first.h * radians);
  const firstB = first.c * Math.sin(first.h * radians);
  const secondA = second.c * Math.cos(second.h * radians);
  const secondB = second.c * Math.sin(second.h * radians);
  const squared = (first.l - second.l) ** 2 + (firstA - secondA) ** 2 + (firstB - secondB) ** 2;

  return Math.sqrt(squared) * 100;
};

const accentThroughApi = (
  page: Page,
  color: string | null,
): Promise<{ seed: string; reported: string }> => page.evaluate((accentColor) => {
  const { asHex, DevExpress } = window as any;
  const { themes } = DevExpress.ui;

  themes.customAccentColor(accentColor);

  const probe = document.createElement('div');
  document.body.appendChild(probe);
  probe.style.backgroundColor = 'var(--dxds-primary-100)';
  const seed = asHex(getComputedStyle(probe).backgroundColor);
  probe.remove();

  return { seed, reported: themes.customAccentColor() };
}, color);

const declareBrandColor = (page: Page, color: string): Promise<void> => page.evaluate((brand) => {
  document.documentElement.style.setProperty('--brand', brand);
}, color);

const createAccentRange = async (page: Page): Promise<void> => {
  await appendElementTo(page, '#container', 'div', ACCENT_RANGE, { marginTop: '8px' });
  await createWidget(page, 'dxRangeSelector', {
    scale: {
      startValue: 0, endValue: 100, tickInterval: 10, minorTickInterval: 2,
    },
    value: [20, 60],
    behavior: { animationEnabled: false },
    size: { width: 1080, height: 80 },
  }, `#${ACCENT_RANGE}`);
};

const rememberAccentRange = (page: Page): Promise<void> => page.evaluate(({
  rangeId, selectedRangeSelector,
}) => {
  const { DevExpress } = window as any;
  const host = document.getElementById(rangeId);

  (window as any).accentRangeAsCreated = {
    instance: DevExpress.viz.dxRangeSelector.getInstance(host),
    selectedRange: document.querySelector(selectedRangeSelector),
  };
}, { rangeId: ACCENT_RANGE, selectedRangeSelector: SELECTED_RANGE });

const paintAccentRange = (
  page: Page,
  color: string,
  throughApi: boolean,
): Promise<Painted> => page.evaluate(({
  accentColor, viaApi, rangeId, selectors,
}) => {
  const { asHex, DevExpress, accentRangeAsCreated } = window as any;

  if (viaApi) {
    DevExpress.ui.themes.customAccentColor(accentColor);
  } else {
    document.documentElement.style.setProperty('--dx-accent-color', accentColor);
  }

  const host = document.getElementById(rangeId);
  const selectedRange = document.querySelector(selectors.selectedRange)!;
  const paintOf = (selector: string, property: 'fill' | 'stroke'): string[] => Array.from(
    document.querySelectorAll(selector),
    (element) => asHex(getComputedStyle(element)[property]),
  );
  const probe = document.createElement('div');
  document.body.appendChild(probe);
  probe.style.backgroundColor = 'var(--dxds-primary-100)';
  const primary = asHex(getComputedStyle(probe).backgroundColor);
  probe.remove();

  return {
    painted: {
      selectedRange: asHex(getComputedStyle(selectedRange).stroke),
      handles: paintOf(selectors.handles, 'stroke'),
      markers: paintOf(selectors.markers, 'fill'),
    },
    primary,
    inPlace: selectedRange === accentRangeAsCreated?.selectedRange
      && DevExpress.viz.dxRangeSelector.getInstance(host) === accentRangeAsCreated?.instance,
  };
}, {
  accentColor: color,
  viaApi: throughApi,
  rangeId: ACCENT_RANGE,
  selectors: { selectedRange: SELECTED_RANGE, handles: SLIDER_HANDLES, markers: SLIDER_MARKERS },
});

const RANGE_ACCENTS = [
  ...SHIPPED_ACCENTS.map(({ palette, color }) => ({ name: palette, color, throughApi: false })),
  { name: 'custom', color: '#a703ff', throughApi: false },
  { name: 'custom through themes.customAccentColor', color: '#107c10', throughApi: true },
];

const rounded = (value: number): number => Math.round(value * 1000) / 1000;
const stepOf = (measured: MeasuredStep[], step: number): Oklch => measured
  .find((entry) => entry.step === step)!.oklch!;

test.describe('Custom accent color', () => {
  test.skip(({ theme }) => getThemeName(theme) !== 'fluent-next', 'fluent-next only');

  test.beforeEach(async ({ page }) => {
    await installAsHex(page);
  });

  test('the designed seed gives the palette back', async ({ page }) => {
    const designed = await measurePalette(page, null, STEPS);
    const designedSteps = designed.measured;
    const seed = stepOf(designedSteps, 100);
    const derived = await measurePalette(page, `oklch(${seed.l} ${seed.c} ${seed.h})`, STEPS);

    expect(
      designedSteps.every((entry) => entry.resolved.startsWith('rgb')),
      'an unset accent must leave the designed values in place',
    ).toBe(true);

    expect(derived.measured
      .map((entry) => ({
        step: entry.step,
        distance: rounded(oklchDistance(stepOf(designedSteps, entry.step), entry.oklch!)),
      }))
      .filter(({ distance }) => distance > DESIGNED_PALETTE_TOLERANCE)).toEqual([]);
  });

  test('an arbitrary accent keeps hue, order and clamps', async ({ page }) => {
    const arbitraryAccent = '#a703ff';
    const { measured, source, settings } = await measurePalette(page, arbitraryAccent, STEPS);
    const steps = measured;
    const lightest = stepOf(steps, 10);
    const darkest = stepOf(steps, 180);
    const accentItself = stepOf(steps, 100);

    expect({
      lightest: { l: rounded(lightest.l), c: rounded(lightest.c) },
      darkest: { l: rounded(darkest.l), c: rounded(darkest.c) },
      accentItself: { l: rounded(accentItself.l), c: rounded(accentItself.c) },
      lighteningSteps: steps
        .filter((entry, index) => index > 0 && entry.oklch!.l >= steps[index - 1].oklch!.l)
        .map((entry) => entry.step),
      stepsOffHue: steps
        .filter((entry) => Math.abs(entry.oklch!.h - source!.h) > HUE_TOLERANCE)
        .map((entry) => entry.step),
    }).toEqual({
      lightest: { l: settings.lightnessMax, c: settings.chromaMin },
      darkest: { l: settings.lightnessMin, c: settings.chromaMin },
      accentItself: { l: rounded(source!.l), c: rounded(source!.c) },
      lighteningSteps: [],
      stepsOffHue: [],
    });
  });

  test('the derived palette is drawn as designed', async ({ page }) => {
    await appendElementTo(page, '#container', 'div', PALETTE_STRIP, { display: 'flex' });
    await appendElementTo(page, '#container', 'div', ACCENT_GRID, { marginTop: '8px', width: '1080px' });
    await createWidget(page, 'dxDataGrid', {
      dataSource: GRID_DATA,
      keyExpr: 'field_0',
      selection: { mode: 'multiple' },
      selectedRowKeys: [GRID_DATA[0].field_0, GRID_DATA[1].field_0],
      focusedRowEnabled: true,
      focusedRowKey: GRID_DATA[2].field_0,
      showBorders: true,
    }, `#${ACCENT_GRID}`);
    await createAccentRange(page);

    for (const { palette, color } of SHIPPED_ACCENTS) {
      await drawPaletteStrip(page, color, STEPS);
      await testScreenshot(page, `Accent palette ${palette}.png`, {
        element: '#container',
      });
    }
  });

  test('a range selector paints its selected range, handles and markers in the accent, repainting in place', async ({ page }) => {
    await createAccentRange(page);
    await rememberAccentRange(page);

    const results: PaintedAccent[] = [];

    for (const { name, color, throughApi } of RANGE_ACCENTS) {
      results.push({ name, ...await paintAccentRange(page, color, throughApi) });
    }

    expect(
      results.map(({ name, painted }) => ({ name, ...painted })),
      'the selected range, both slider handles and both marker plates are painted in --dxds-primary-100 of every accent',
    ).toEqual(
      results.map(({ name, primary }) => ({
        name, selectedRange: primary, handles: [primary, primary], markers: [primary, primary],
      })),
    );

    expect(
      new Set(results.map(({ painted }) => painted.selectedRange)).size,
      'no two accents paint the selected range alike',
    ).toBe(RANGE_ACCENTS.length);

    expect(
      results.filter(({ inPlace }) => !inPlace).map(({ name }) => name),
      'every accent repaints the widget drawn first, neither re-created nor reloaded',
    ).toEqual([]);
  });

  test('a translucent accent still gives an opaque palette', async ({ page }) => {
    const translucentAccent = '#a703ff80';
    const { measured } = await measurePalette(page, translucentAccent, STEPS);

    expect(
      measured.filter((entry) => entry.resolved.includes('/')).map((entry) => entry.step),
      'no step may inherit the alpha of the accent',
    ).toEqual([]);
  });

  test('themes.customAccentColor sets, keeps and clears the accent', async ({ page }) => {
    const designedAccent = '#0f6cbd';
    const arbitraryAccent = '#a703ff';
    const designed = await accentThroughApi(page, null);

    expect(designed.reported, 'an accent nobody set is reported as unset').toBe('');
    expect(designed.seed, 'the theme starts on the accent it was drawn with').toBe(designedAccent);

    const applied = await accentThroughApi(page, arbitraryAccent);

    expect(applied.seed, 'the palette is built from the accent that was set').toBe(arbitraryAccent);
    expect(applied.reported, 'the accent that was set is reported back').toBe(arbitraryAccent);

    const afterRefusedValue = await accentThroughApi(page, 'not-a-color');

    expect(afterRefusedValue.seed, 'a refused value leaves the palette alone').toBe(arbitraryAccent);
    expect(afterRefusedValue.reported, 'a refused value leaves the accent alone').toBe(arbitraryAccent);

    const afterReset = await accentThroughApi(page, null);

    expect(afterReset.seed, 'null brings the designed palette back').toBe(designed.seed);
    expect(afterReset.reported, 'a cleared accent is reported as unset').toBe('');
  });

  test('themes.customAccentColor takes an accent written as a reference', async ({ page }) => {
    const brandAccent = '#a703ff';

    await declareBrandColor(page, brandAccent);
    const applied = await accentThroughApi(page, 'var(--brand)');

    expect(applied.seed, 'the palette is built from the color the reference resolves to').toBe(brandAccent);
    expect(applied.reported, 'a reference is reported back as the color it resolves to').toBe(brandAccent);
  });

  test('themes.customAccentColor takes an accent written by name', async ({ page }) => {
    const namedAccent = 'rebeccapurple';
    const applied = await accentThroughApi(page, namedAccent);

    expect(applied.seed, 'the palette is built from the color the name stands for').toBe('#663399');
    expect(applied.reported, 'the accent is reported back as it was written, not as a hex').toBe(namedAccent);
  });
});
