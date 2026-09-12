/* eslint-disable spellcheck/spell-checker */
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { ClientFunction } from 'testcafe';
import { createWidget } from '../../helpers/createWidget';
import { appendElementTo } from '../../helpers/domUtils';
import url from '../../helpers/getPageUrl';
import { getData } from '../dataGrid/helpers/generateDataSourceData';
import { isFluentNext, testScreenshot } from '../../helpers/themeUtils';

const STEPS = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180];
const ARBITRARY_ACCENT = '#a703ff';

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

const measurePalette = ClientFunction((accent: string | null, steps: number[]) => {
  const root = document.documentElement;

  if (accent) {
    root.style.setProperty('--dx-accent-color', accent);
  } else {
    root.style.removeProperty('--dx-accent-color');
  }

  const probe = document.createElement('div');
  document.body.appendChild(probe);

  const asOklch = (color: string): Oklch | null => {
    probe.style.backgroundColor = `oklch(from ${color} l c h)`;
    const resolved = getComputedStyle(probe).backgroundColor;
    const parts = /^oklch\(([-\d.]+) ([-\d.]+) ([-\d.]+)/.exec(resolved);

    return parts ? { l: +parts[1], c: +parts[2], h: +parts[3] } : null;
  };

  const read = (step: number): MeasuredStep => {
    probe.style.backgroundColor = `var(--dxds-primary-${step})`;
    const resolved = getComputedStyle(probe).backgroundColor;

    return { step, resolved, oklch: asOklch(resolved) };
  };

  const setting = (name: string): number => +getComputedStyle(root).getPropertyValue(name).trim();
  const measured = steps.map(read);
  const source = accent ? asOklch(accent) : null;

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
});

const PALETTE_STRIP = 'accent-palette';
const ACCENT_GRID = 'accent-grid';
const GRID_DATA = getData(5, 2);
const SHIPPED_ACCENTS = [
  { palette: 'blue', color: '#0f6cbd' },
  { palette: 'rust', color: '#da3b01' },
  { palette: 'mint', color: '#018574' },
];

const drawPaletteStrip = ClientFunction((accent: string, steps: number[]) => {
  document.documentElement.style.setProperty('--dx-accent-color', accent);
  const strip = document.getElementById(PALETTE_STRIP)!;
  strip.textContent = '';

  const swatches = steps.map((step) => {
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

  const asHex = (color: string): string => {
    const probe = document.createElement('div');
    probe.style.backgroundColor = `rgb(from ${color} r g b)`;
    strip.appendChild(probe);
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

  swatches.forEach(({ step, swatch, caption }) => {
    caption.textContent = `${step}\n${asHex(getComputedStyle(swatch).backgroundColor)}`;
    caption.style.whiteSpace = 'pre';
  });
}, { dependencies: { PALETTE_STRIP } });
const oklchDistance = (first: Oklch, second: Oklch): number => {
  const radians = Math.PI / 180;
  const firstA = first.c * Math.cos(first.h * radians);
  const firstB = first.c * Math.sin(first.h * radians);
  const secondA = second.c * Math.cos(second.h * radians);
  const secondB = second.c * Math.sin(second.h * radians);
  const squared = (first.l - second.l) ** 2 + (firstA - secondA) ** 2 + (firstB - secondB) ** 2;

  return Math.sqrt(squared) * 100;
};

const rounded = (value: number): number => Math.round(value * 1000) / 1000;
const stepOf = (measured: MeasuredStep[], step: number): Oklch => measured
  .find((entry) => entry.step === step)!.oklch!;

fixture`Custom accent color`
  .page(url(__dirname, '../container.html'))
  .afterEach(async () => {
    await measurePalette(null, []);
  });

(isFluentNext() ? test : test.skip)('the designed seed gives the palette back', async (t) => {
  const designed = await measurePalette(null, STEPS);
  const designedSteps = designed.measured;
  const seed = stepOf(designedSteps, 100);
  const derived = await measurePalette(`oklch(${seed.l} ${seed.c} ${seed.h})`, STEPS);

  await t
    .expect(designedSteps.every((entry) => entry.resolved.startsWith('rgb')))
    .ok('an unset accent must leave the designed values in place');

  await t
    .expect(derived.measured
      .map((entry) => ({
        step: entry.step,
        distance: rounded(oklchDistance(stepOf(designedSteps, entry.step), entry.oklch!)),
      }))
      .filter(({ distance }) => distance > DESIGNED_PALETTE_TOLERANCE))
    .eql([]);
});

(isFluentNext() ? test : test.skip)('an arbitrary accent keeps hue, order and clamps', async (t) => {
  const { measured, source, settings } = await measurePalette(ARBITRARY_ACCENT, STEPS);
  const steps = measured;
  const lightest = stepOf(steps, 10);
  const darkest = stepOf(steps, 180);
  const accentItself = stepOf(steps, 100);

  await t.expect({
    lightest: { l: rounded(lightest.l), c: rounded(lightest.c) },
    darkest: { l: rounded(darkest.l), c: rounded(darkest.c) },
    accentItself: { l: rounded(accentItself.l), c: rounded(accentItself.c) },
    lighteningSteps: steps
      .filter((entry, index) => index > 0 && entry.oklch!.l >= steps[index - 1].oklch!.l)
      .map((entry) => entry.step),
    stepsOffHue: steps
      .filter((entry) => Math.abs(entry.oklch!.h - source!.h) > HUE_TOLERANCE)
      .map((entry) => entry.step),
  }).eql({
    lightest: { l: settings.lightnessMax, c: settings.chromaMin },
    darkest: { l: settings.lightnessMin, c: settings.chromaMin },
    accentItself: { l: rounded(source!.l), c: rounded(source!.c) },
    lighteningSteps: [],
    stepsOffHue: [],
  });
});

(isFluentNext() ? test : test.skip)('the derived palette is drawn as designed', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  for (const { palette, color } of SHIPPED_ACCENTS) {
    await drawPaletteStrip(color, STEPS);
    await testScreenshot(t, takeScreenshot, `Accent palette ${palette}.png`, {
      element: '#container',
    });
  }

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await appendElementTo('#container', 'div', PALETTE_STRIP, { display: 'flex' });
  await appendElementTo('#container', 'div', ACCENT_GRID, { marginTop: '8px', width: '1080px' });
  await createWidget('dxDataGrid', {
    dataSource: GRID_DATA,
    keyExpr: 'field_0',
    selection: { mode: 'multiple' },
    selectedRowKeys: [GRID_DATA[0].field_0, GRID_DATA[1].field_0],
    focusedRowEnabled: true,
    focusedRowKey: GRID_DATA[2].field_0,
    showBorders: true,
  }, `#${ACCENT_GRID}`);
});
