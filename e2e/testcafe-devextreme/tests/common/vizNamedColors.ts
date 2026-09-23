import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { ClientFunction } from 'testcafe';
import { createWidget } from '../../helpers/createWidget';
import url from '../../helpers/getPageUrl';
import { clearTestPage } from '../../helpers/testPageUtils';
import { getThemeName, testScreenshot } from '../../helpers/themeUtils';

if (getThemeName() === 'fluent-next') {
  fixture`Viz named colors`
    .page(url(__dirname, '../container.html'))
    .afterEach(async (t) => { await clearTestPage(t); });

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

  const drawScopes = ClientFunction((width: number, height: number) => {
    const container = document.querySelector('#container') as HTMLElement;

    container.style.display = 'flex';
    container.style.gap = '8px';
    container.style.width = 'max-content';
    container.innerHTML = ['light', 'dark'].map((mode) => `
      <div class="dx-theme-mode-${mode}" style="
        background: var(--dx-viz-bg);
        color: var(--dx-viz-content);
        font: 12px 'Segoe UI', sans-serif;
        padding: 8px;
      ">
        <div style="padding-bottom: 6px">${mode} scope</div>
        <div id="${mode}" style="width: ${width}px; height: ${height}px"></div>
      </div>`).join('');
  });

  const inBothScopes = async (
    widget: 'dxSparkline' | 'dxBullet' | 'dxChart' | 'dxTreeMap' | 'dxBarGauge' | 'dxCircularGauge'
    | 'dxSankey' | 'dxVectorMap',
    options: unknown,
    size: { width: number; height: number },
  ): Promise<void> => {
    await drawScopes(size.width, size.height);
    await createWidget(widget, options, '#light');
    await createWidget(widget, options, '#dark');
  };

  const shoot = async (t: TestController, name: string): Promise<void> => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await testScreenshot(t, takeScreenshot, `${name}.png`, { element: '#container' });

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  };

  test('the sparkline line and its first and last point take the published blue', async (t) => {
    await inBothScopes('dxSparkline', {
      dataSource: SPARKLINE_DATA,
      tooltip: { enabled: false },
    }, { width: 240, height: 60 });

    await shoot(t, 'Viz sparkline line');
  });

  test('the lowest and the highest point of a sparkline take the published yellow and red', async (t) => {
    await inBothScopes('dxSparkline', {
      dataSource: SPARKLINE_DATA,
      showMinMax: true,
      pointSize: 8,
      tooltip: { enabled: false },
    }, { width: 240, height: 60 });

    await shoot(t, 'Viz sparkline extremes');
  });

  test('a win and a loss stay grey, from the published pair', async (t) => {
    await inBothScopes('dxSparkline', {
      dataSource: [6, 7, 3, 6.5, 2, 4, 8, 6.2, 3.4, 7]
        .map((val, index) => ({ arg: String(index + 1), val })),
      type: 'winloss',
      winlossThreshold: 5,
      tooltip: { enabled: false },
    }, { width: 240, height: 60 });

    await shoot(t, 'Viz sparkline winloss');
  });

  test('a falling candlestick takes the published red', async (t) => {
    await inBothScopes('dxChart', {
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

    await shoot(t, 'Viz candlestick reduction');
  });

  test('the bullet target takes the published content colour', async (t) => {
    await inBothScopes('dxBullet', {
      value: 68,
      target: 82,
      startScaleValue: 0,
      endScaleValue: 100,
      tooltip: { enabled: false },
    }, { width: 240, height: 40 });

    await shoot(t, 'Viz bullet target');
  });

  test('the bar gauge shelf is lifted off the surface', async (t) => {
    await inBothScopes('dxBarGauge', {
      startValue: 0,
      endValue: 100,
      values: [72, 54, 38],
      label: { visible: false },
      legend: { visible: false },
      animation: { enabled: false },
      tooltip: { enabled: false },
    }, { width: 240, height: 130 });

    await shoot(t, 'Viz bar gauge shelf');
  });

  test('a tree map tile with no palette colour takes the published cyan', async (t) => {
    await inBothScopes('dxTreeMap', {
      dataSource: TILE_DATA,
      valueField: 'value',
      colorizer: { type: 'none' },
      tile: { label: { visible: false } },
      tooltip: { enabled: false },
    }, { width: 240, height: 120 });

    await shoot(t, 'Viz tree map tile fill');
  });

  test('a map area takes the published quiet grey', async (t) => {
    await inBothScopes('dxVectorMap', {
      layers: [{ dataSource: AREAS, type: 'area' }],
      bounds: [-4, 64, 94, -4],
      panningEnabled: false,
      zoomingEnabled: false,
      controlBar: { enabled: false },
      tooltip: { enabled: false },
    }, { width: 240, height: 130 });

    await shoot(t, 'Viz map area');
  });

  test('a map line takes the published orange', async (t) => {
    await inBothScopes('dxVectorMap', {
      layers: [{ dataSource: LINES, type: 'line' }],
      bounds: [-4, 49, 94, -4],
      panningEnabled: false,
      zoomingEnabled: false,
      controlBar: { enabled: false },
      tooltip: { enabled: false },
    }, { width: 240, height: 130 });

    await shoot(t, 'Viz map line');
  });

  test('a sankey link takes the published grey', async (t) => {
    await inBothScopes('dxSankey', {
      dataSource: [
        { source: 'A', target: 'X', weight: 4 },
        { source: 'A', target: 'Y', weight: 2 },
        { source: 'B', target: 'Y', weight: 3 },
      ],
      label: { visible: false },
      tooltip: { enabled: false },
    }, { width: 240, height: 130 });

    await shoot(t, 'Viz sankey link');
  });

  test('every gauge indicator the theme draws takes a published name', async (t) => {
    await inBothScopes('dxCircularGauge', {
      scale: { startValue: 0, endValue: 100, label: { visible: false } },
      value: 62,
      subvalues: [24],
      valueIndicator: { type: 'twocolorneedle' },
      animation: { enabled: false },
      tooltip: { enabled: false },
    }, { width: 240, height: 150 });

    await shoot(t, 'Viz gauge indicators');
  });

  test('the hairline between tree map tiles stays the same colour in both scopes', async (t) => {
    await inBothScopes('dxTreeMap', {
      dataSource: TILE_DATA,
      valueField: 'value',
      colorizer: { type: 'gradient', range: [0, 9] },
      tile: { label: { visible: false } },
      interactWithGroup: false,
      tooltip: { enabled: false },
    }, { width: 240, height: 120 });

    await shoot(t, 'Viz tree map tile border');
  });
}
