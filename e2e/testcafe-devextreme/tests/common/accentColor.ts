/* eslint-disable spellcheck/spell-checker */
import { ClientFunction } from 'testcafe';
import url from '../../helpers/getPageUrl';
import { getThemeName } from '../../helpers/themeUtils';

const forFluentNext = getThemeName() === 'fluent-next' ? test : test.skip;

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

forFluentNext('the accent seeded with the designed step 100 gives the palette back', async (t) => {
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

forFluentNext('an arbitrary accent keeps the hue, the order and the clamps', async (t) => {
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
