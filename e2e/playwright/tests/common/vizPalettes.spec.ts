import type { Page } from '@playwright/test';
import { expect, test } from '../../fixtures';
import { createWidget } from '../../helpers/createWidget';
import { getThemeName } from '../../helpers/themeUtils';

const COUNT = 50;
const ROUNDING_APART = 2;
const LITERALS = ['#0c69b7', '#c83d3d', '#008f04', '#eaa300', '#e43ba6', '#865cbf'];

const distancesOver = (page: Page, extensionMode: string): Promise<number[]> => page.evaluate(({
  mode, count, literals,
}) => {
  const { viz } = (window as any).DevExpress;

  viz.registerPalette('legacy literals', {
    simpleSet: literals,
    indicatingSet: [literals[2], literals[3], literals[1]],
    gradientSet: [literals[0], literals[2]],
    accentColor: '#0f6cbd',
  });

  const channelsOf = (color: string): number[] => {
    const probe = document.createElement('div');

    probe.style.cssText = 'position: absolute; visibility: hidden';
    probe.style.backgroundColor = color;
    document.body.appendChild(probe);

    const painted = getComputedStyle(probe).backgroundColor;

    probe.remove();

    const scale = painted.startsWith('color(') ? 255 : 1;

    return (painted.match(/-?[\d.]+/g) ?? []).slice(0, 3)
      .map((channel) => Math.round(Math.min(255, Math.max(0, Number(channel) * scale))));
  };

  const generated = (palette: string): string[] => viz
    .generateColors(palette, count, { paletteExtensionMode: mode, useHighlight: true });

  const fromNames = generated('Fluent Next').map(channelsOf);
  const fromLiterals = generated('legacy literals').map(channelsOf);

  return fromNames.map((channels: number[], index: number) => Math.max(
    ...channels.map((channel, at) => Math.abs(channel - fromLiterals[index][at])),
  ));
}, { mode: extensionMode, count: COUNT, literals: LITERALS });

const handedOut = (page: Page): Promise<string[]> => page.evaluate(() => {
  const series = (window as any).widget.getAllSeries();

  return [
    ...series.map((one: { getColor: () => string }) => one.getColor()),
    ...series[0].getAllPoints().map((point: { getColor: () => string }) => point.getColor()),
  ];
});

test.describe('Viz palettes', () => {
  test.skip(({ theme }) => getThemeName(theme) !== 'fluent-next', 'fluent-next only');

  test('a chart hands out colours an application can draw with, not references', async ({ page }) => {
    await createWidget(page, 'dxChart', {
      dataSource: [{ arg: 'a', val: 1 }, { arg: 'b', val: 2 }],
      series: [{ type: 'bar' }, { type: 'bar' }],
      animation: { enabled: false },
      size: { width: 300, height: 200 },
    });

    await expect.poll(async () => (await handedOut(page)).length, { message: 'the chart answered with colours' })
      .toBeGreaterThan(0);
    await expect.poll(async () => (await handedOut(page))
      .filter((color) => !/^(#[0-9a-f]{6}|rgba?\()/i.test(color)), { message: 'every colour is one an application can parse' })
      .toEqual([]);
  });

  ['blend', 'alternate', 'extrapolate'].forEach((extensionMode) => {
    test(`the browser mixes ${extensionMode} into the same colors the old arithmetic did`, async ({ page }) => {
      const distances = await distancesOver(page, extensionMode);
      const furthest = Math.max(...distances);
      const drifted = distances.filter((distance) => distance > ROUNDING_APART).length;

      expect(distances.length, 'every colour of the run was compared').toBe(COUNT);
      expect(
        drifted,
        `${drifted} of ${COUNT} colours differ by more than ${ROUNDING_APART} of 255, the furthest by ${furthest}`,
      ).toBe(0);
    });
  });
});
