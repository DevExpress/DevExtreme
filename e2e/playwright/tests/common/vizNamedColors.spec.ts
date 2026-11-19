import type { Page } from '@playwright/test';
import { test } from '../../fixtures';
import { createWidget } from '../../helpers/createWidget';
import { startDragToOffset } from '../../helpers/dragUtils';
import { testScreenshot } from '../../helpers/screenshots';
import { getThemeName } from '../../helpers/themeUtils';
import type { WidgetName } from '../../models/types';

const SPARKLINE_DATA = [5.1, 6.8, 4.2, 7.6, 5.5, 3.1, 6.2, 4.8, 8.4, 5.9]
  .map((val, index) => ({ arg: String(index + 1), val }));

const CANDLE_DATA = [
  {
    arg: 1, open: 5, high: 7.2, low: 4.4, close: 6.6,
  },
  {
    arg: 2, open: 6.6, high: 7, low: 4.8, close: 5.1,
  },
  {
    arg: 3, open: 5.1, high: 6.4, low: 4.6, close: 6.2,
  },
  {
    arg: 4, open: 6.2, high: 6.8, low: 4.2, close: 4.5,
  },
  {
    arg: 5, open: 4.5, high: 6.6, low: 4.1, close: 6.3,
  },
];

const TILE_DATA = [
  { name: 'a', value: 9 }, { name: 'b', value: 5 }, { name: 'c', value: 4 },
  { name: 'd', value: 3 }, { name: 'e', value: 2 }, { name: 'f', value: 2 },
];

const AREAS = {
  type: 'FeatureCollection',
  features: [
    { type: 'Feature', properties: { name: 'a' }, geometry: { type: 'Polygon', coordinates: [[[0, 0], [40, 0], [40, 30], [0, 30], [0, 0]]] } },
    { type: 'Feature', properties: { name: 'b' }, geometry: { type: 'Polygon', coordinates: [[[45, 0], [90, 0], [90, 30], [45, 30], [45, 0]]] } },
    { type: 'Feature', properties: { name: 'c' }, geometry: { type: 'Polygon', coordinates: [[[0, 35], [90, 35], [90, 60], [0, 60], [0, 35]]] } },
  ],
};

const LINES = {
  type: 'FeatureCollection',
  features: [
    { type: 'Feature', properties: { name: 'l1' }, geometry: { type: 'LineString', coordinates: [[0, 0], [30, 25], [60, 5], [90, 30]] } },
    { type: 'Feature', properties: { name: 'l2' }, geometry: { type: 'LineString', coordinates: [[0, 40], [30, 20], [60, 45], [90, 15]] } },
  ],
};

const HIDDEN_AXIS = {
  visible: false,
  grid: { visible: false },
  tick: { visible: false },
  label: { visible: false },
};

const SCOPE = (mode: string, width: number, height: number): string => `
  <div class="dx-theme-mode-${mode}" style="
    background: var(--dx-viz-bg);
    color: var(--dx-viz-content);
    font: 12px 'Segoe UI', sans-serif;
    padding: 8px;
  ">
    <div style="padding-bottom: 6px">${mode} scope</div>
    <div id="${mode}" style="width: ${width}px; height: ${height}px"></div>
  </div>`;

const drawScopes = (page: Page, width: number, height: number): Promise<void> => page.evaluate(
  (markup) => {
    const container = document.querySelector('#container') as HTMLElement;

    container.style.display = 'flex';
    container.style.gap = '8px';
    container.style.width = 'max-content';
    container.innerHTML = markup;
  },
  ['light', 'dark'].map((mode) => SCOPE(mode, width, height)).join(''),
);

const drawScope = (page: Page, mode: string, width: number, height: number): Promise<void> => page
  .evaluate((markup) => {
    const container = document.querySelector('#container') as HTMLElement;

    container.style.display = 'flex';
    container.style.width = 'max-content';
    container.innerHTML = markup;
  }, SCOPE(mode, width, height));

const inBothScopes = async (
  page: Page,
  widget: WidgetName,
  options: object,
  size: { width: number; height: number },
): Promise<void> => {
  await drawScopes(page, size.width, size.height);
  await createWidget(page, widget, options, '#light');
  await createWidget(page, widget, options, '#dark');
};

const shoot = (page: Page, name: string): Promise<void> => testScreenshot(page, `${name}.png`, { element: '#container' });

test.describe('Viz named colors', () => {
  test.skip(({ theme }) => getThemeName(theme) !== 'fluent-next', 'fluent-next only');

  test('the sparkline line and its first and last point take the published blue', async ({ page }) => {
    await inBothScopes(page, 'dxSparkline', {
      dataSource: SPARKLINE_DATA,
      tooltip: { enabled: false },
    }, { width: 240, height: 60 });

    await shoot(page, 'Viz sparkline line');
  });

  test('the lowest and the highest point of a sparkline take the published yellow and red', async ({ page }) => {
    await inBothScopes(page, 'dxSparkline', {
      dataSource: SPARKLINE_DATA,
      showMinMax: true,
      pointSize: 8,
      tooltip: { enabled: false },
    }, { width: 240, height: 60 });

    await shoot(page, 'Viz sparkline extremes');
  });

  test('a win and a loss stay grey, from the published pair', async ({ page }) => {
    await inBothScopes(page, 'dxSparkline', {
      dataSource: [6, 7, 3, 6.5, 2, 4, 8, 6.2, 3.4, 7]
        .map((val, index) => ({ arg: String(index + 1), val })),
      type: 'winloss',
      winlossThreshold: 5,
      tooltip: { enabled: false },
    }, { width: 240, height: 60 });

    await shoot(page, 'Viz sparkline winloss');
  });

  test('a falling candlestick takes the published red', async ({ page }) => {
    await inBothScopes(page, 'dxChart', {
      dataSource: CANDLE_DATA,
      series: [{
        type: 'candlestick',
        argumentField: 'arg',
        openValueField: 'open',
        highValueField: 'high',
        lowValueField: 'low',
        closeValueField: 'close',
      }],
      legend: { visible: false },
      animation: { enabled: false },
      argumentAxis: HIDDEN_AXIS,
      valueAxis: HIDDEN_AXIS,
      tooltip: { enabled: false },
    }, { width: 240, height: 140 });

    await shoot(page, 'Viz candlestick reduction');
  });

  test('the bullet target takes the published content colour', async ({ page }) => {
    await inBothScopes(page, 'dxBullet', {
      value: 68,
      target: 82,
      startScaleValue: 0,
      endScaleValue: 100,
      tooltip: { enabled: false },
    }, { width: 240, height: 40 });

    await shoot(page, 'Viz bullet target');
  });

  test('the bar gauge shelf is lifted off the surface', async ({ page }) => {
    await inBothScopes(page, 'dxBarGauge', {
      startValue: 0,
      endValue: 100,
      values: [72, 54, 38],
      label: { visible: false },
      legend: { visible: false },
      animation: { enabled: false },
      tooltip: { enabled: false },
    }, { width: 240, height: 130 });

    await shoot(page, 'Viz bar gauge shelf');
  });

  test('a gauge range container takes the published indicating set', async ({ page }) => {
    await inBothScopes(page, 'dxCircularGauge', {
      scale: { startValue: 0, endValue: 100, label: { visible: false } },
      value: 62,
      rangeContainer: {
        width: 14,
        ranges: [
          { startValue: 0, endValue: 40 },
          { startValue: 40, endValue: 70 },
          { startValue: 70, endValue: 100 },
        ],
      },
      animation: { enabled: false },
      tooltip: { enabled: false },
    }, { width: 240, height: 150 });

    await shoot(page, 'Viz gauge indicating set');
  });

  test('the axis, its labels and its title, and the legend read a step quieter', async ({ page }) => {
    await inBothScopes(page, 'dxChart', {
      dataSource: [4, 7, 5, 9].map((val, index) => ({ arg: index + 1, val })),
      series: [{
        type: 'line', argumentField: 'arg', valueField: 'val', name: 'Series',
      }],
      title: { text: 'Title', subtitle: { text: 'Subtitle' } },
      valueAxis: { title: 'Value' },
      animation: { enabled: false },
      tooltip: { enabled: false },
    }, { width: 240, height: 260 });

    await shoot(page, 'Viz axis and legend');
  });

  test('a tree map tile with no palette colour takes the published blue', async ({ page }) => {
    await inBothScopes(page, 'dxTreeMap', {
      dataSource: TILE_DATA,
      valueField: 'value',
      colorizer: { type: 'none' },
      tile: { label: { visible: false } },
      tooltip: { enabled: false },
    }, { width: 240, height: 120 });

    await shoot(page, 'Viz tree map tile fill');
  });

  test('a map area takes the published quiet grey', async ({ page }) => {
    await inBothScopes(page, 'dxVectorMap', {
      layers: [{ dataSource: AREAS, type: 'area' }],
      bounds: [-4, 64, 94, -4],
      panningEnabled: false,
      zoomingEnabled: false,
      controlBar: { enabled: false },
      tooltip: { enabled: false },
    }, { width: 240, height: 130 });

    await shoot(page, 'Viz map area');
  });

  test('a map line takes the published orange', async ({ page }) => {
    await inBothScopes(page, 'dxVectorMap', {
      layers: [{ dataSource: LINES, type: 'line' }],
      bounds: [-4, 49, 94, -4],
      panningEnabled: false,
      zoomingEnabled: false,
      controlBar: { enabled: false },
      tooltip: { enabled: false },
    }, { width: 240, height: 130 });

    await shoot(page, 'Viz map line');
  });

  test('a sankey link takes the published grey', async ({ page }) => {
    await inBothScopes(page, 'dxSankey', {
      dataSource: [
        { source: 'A', target: 'X', weight: 4 },
        { source: 'A', target: 'Y', weight: 2 },
        { source: 'B', target: 'Y', weight: 3 },
      ],
      label: { visible: false },
      tooltip: { enabled: false },
    }, { width: 240, height: 130 });

    await shoot(page, 'Viz sankey link');
  });

  test('the two-colour needle and the subvalue marker take the published names', async ({ page }) => {
    await inBothScopes(page, 'dxCircularGauge', {
      scale: { startValue: 0, endValue: 100, label: { visible: false } },
      value: 62,
      subvalues: [24],
      valueIndicator: { type: 'twocolorneedle' },
      animation: { enabled: false },
      tooltip: { enabled: false },
    }, { width: 240, height: 150 });

    await shoot(page, 'Viz gauge indicators');
  });

  ['light', 'dark'].forEach((mode) => {
    test(`the crosshair is drawn with its own published name: ${mode}`, async ({ page }) => {
      await drawScope(page, mode, 240, 140);
      await createWidget(page, 'dxChart', {
        dataSource: [4, 7, 5, 9].map((val, index) => ({ arg: index + 1, val })),
        series: [{ type: 'line', argumentField: 'arg', valueField: 'val' }],
        legend: { visible: false },
        animation: { enabled: false },
        crosshair: { enabled: true },
        tooltip: { enabled: false },
      }, `#${mode}`);

      await startDragToOffset(page, page.locator(`#${mode}`), 30, 0);

      await shoot(page, `Viz chart crosshair ${mode}`);
    });
  });

  ['light', 'dark'].forEach((mode) => {
    test(`a range that is not allowed marks the slider with the published danger: ${mode}`, async ({ page }) => {
      await drawScope(page, mode, 400, 90);
      await createWidget(page, 'dxRangeSelector', {
        scale: {
          startValue: 0, endValue: 100, tickInterval: 25, minRange: 30,
        },
        value: [20, 70],
        behavior: { animationEnabled: false },
      }, `#${mode}`);

      await startDragToOffset(page, page.locator('#container .slider-tracker').first(), 130, 0);

      await shoot(page, `Viz range selector invalid ${mode}`);
    });
  });

  test('the hairline between tree map tiles stays the same colour in both scopes', async ({ page }) => {
    await inBothScopes(page, 'dxTreeMap', {
      dataSource: TILE_DATA,
      valueField: 'value',
      colorizer: { type: 'gradient', range: [0, 9] },
      tile: { label: { visible: false } },
      interactWithGroup: false,
      tooltip: { enabled: false },
    }, { width: 240, height: 120 });

    await shoot(page, 'Viz tree map tile border');
  });
});
