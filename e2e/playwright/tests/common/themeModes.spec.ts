import type { Page } from '@playwright/test';
import { expect, test } from '../../fixtures';
import { createWidget } from '../../helpers/createWidget';
import { getThemeName } from '../../helpers/themeUtils';

const MODE_DEPENDENT = ['--dxds-color-bg', '--dxds-color-content'];
const SYSTEM_TIER = ['--dx-global-content', '--dx-surface-overlay', '--dx-focus-rect-outline'];

const modesOf = (theme: string): { buildMode: string; oppositeMode: string } => {
  const buildMode = theme.includes('.dark') ? 'dark' : 'light';

  return { buildMode, oppositeMode: buildMode === 'dark' ? 'light' : 'dark' };
};

const render = (page: Page, markup: string): Promise<void> => page.evaluate((html) => {
  const container = document.querySelector('#container');

  if (container) container.innerHTML = html;
}, markup);

const valueAt = async (page: Page, selector: string, property: string): Promise<string> => (
  await page.evaluate(({ target, name }) => {
    const element = document.querySelector(target) as Element;

    return window.getComputedStyle(element).getPropertyValue(name);
  }, { target: selector, name: property })
).trim();

const reportedMode = (page: Page, selector: string): Promise<string> => page.evaluate(
  (target) => (window as any).DevExpress.ui.themes.mode(document.querySelector(target)),
  selector,
);

const setScopeMode = (
  page: Page,
  selector: string,
  mode: string,
  tell: boolean,
): Promise<void> => page.evaluate(({ target, scopeMode, refresh }) => {
  const scope = document.querySelector(target) as HTMLElement;

  scope.classList.remove('dx-theme-mode-light', 'dx-theme-mode-dark');
  scope.classList.add(`dx-theme-mode-${scopeMode}`);

  if (refresh) {
    (window as any).DevExpress.ui.themes.refreshMode();
  }
}, { target: selector, scopeMode: mode, refresh: tell });

const CHART = {
  dataSource: [{ month: 'a', sales: 1 }, { month: 'b', sales: 2 }],
  series: [{ type: 'bar', argumentField: 'month', valueField: 'sales' }],
  legend: { visible: false },
  animation: { enabled: false },
  size: { width: 220, height: 160 },
};

const MAP_WITH_LABELLED_MARKERS = {
  layers: [{
    type: 'marker',
    dataSource: {
      type: 'FeatureCollection',
      features: [{
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [0, 0] },
        properties: { text: 'a' },
      }],
    },
    label: { enabled: true, dataField: 'text' },
  }],
  size: { width: 220, height: 160 },
};

const writeRootProperty = (page: Page, name: string, value: string): Promise<void> => page
  .evaluate(({ property, propertyValue }) => {
    const root = document.documentElement;

    if (propertyValue) {
      root.style.setProperty(property, propertyValue);
    } else {
      root.style.removeProperty(property);
    }
  }, { property: name, propertyValue: value });

interface Exported { references: number; painted: string }

const exportedFrom = (
  page: Page,
  selector: string,
  widgetName: string,
  paintedSelector: string,
  paintedAttribute: string,
): Promise<Exported> => page.evaluate(({
  target, name, paintedTarget, attribute,
}) => {
  const instance = ($(target) as any)[name]('instance');
  const markup = (window as any).DevExpress.viz.getMarkup([instance]);
  const painted = new DOMParser().parseFromString(markup, 'image/svg+xml').querySelector(paintedTarget);

  return {
    references: (markup.match(/var\(--dx-/g) ?? []).length,
    painted: painted?.getAttribute(attribute) ?? '',
  };
}, {
  target: selector, name: widgetName, paintedTarget: paintedSelector, attribute: paintedAttribute,
});

const exportedChartFrom = (page: Page, selector: string): Promise<Exported> => exportedFrom(page, selector, 'dxChart', 'text', 'style');

const exportedHaloFrom = (page: Page, selector: string): Promise<Exported> => exportedFrom(page, selector, 'dxVectorMap', '[stroke-linejoin="round"]', 'stroke');

const DECLARED_BLUE = 'rgb(11, 7, 3)';
const DECLARED_BG = 'rgb(22, 7, 3)';
const HANDED_OUT_BLUE = '#0b0703';

const declareTheNamesTheWidgetsRead = (
  page: Page,
  blue: string,
  background: string,
): Promise<void> => page.evaluate(({ vizBlue, vizBg }) => {
  document.documentElement.style.setProperty('--dx-viz-blue', vizBlue);
  document.documentElement.style.setProperty('--dx-viz-bg', vizBg);
}, { vizBlue: blue, vizBg: background });

const colorsHandedOutByTheWidget = (page: Page): Promise<(string | undefined)[]> => page
  .evaluate(() => {
    const { widget } = (window as any);
    const series = widget.getAllSeries?.() ?? [];
    const items = widget.getAllItems?.() ?? [];

    return [
      ...series.flatMap((one) => [
        one.getColor(),
        ...one.getAllPoints().map((point) => point.getColor()),
      ]),
      ...items.map((item) => item.getColor()),
    ];
  });

const markupOfTheWidget = (page: Page): Promise<{ svg: string; unresolved: string[] }> => page
  .evaluate(() => {
    const svg = (window as any).widget.svg();
    const left = (svg.match(/var\(--dx-[a-z-]+/g) ?? []) as string[];

    return { svg, unresolved: left.filter((value, index) => left.indexOf(value) === index) };
  });

const expectPaintedFrom = async (page: Page, declared: string): Promise<void> => {
  await expect.poll(
    async () => (await markupOfTheWidget(page)).svg,
    { message: 'the markup carries what the cascade resolved, not the literal the theme writes beside the name' },
  ).toContain(declared);
  await expect.poll(
    async () => (await markupOfTheWidget(page)).unresolved,
    { message: 'and no reference survives into the markup' },
  ).toEqual([]);
};

const expectHandedOut = async (page: Page, colors: (string | undefined)[]): Promise<void> => {
  await expect.poll(
    () => colorsHandedOutByTheWidget(page),
    { message: 'getColor answers with the colour the cascade resolved, normalised to hex' },
  ).toEqual(colors);
};

const DECLARED_IN_OKLCH = 'oklch(0.55 0.15 250)';

const declaredAsRgb = (page: Page, declared: string): Promise<string> => page.evaluate((color) => {
  const probe = document.createElement('div');

  document.body.appendChild(probe);
  probe.style.color = `color-mix(in srgb, ${color} 100%, transparent)`;

  const channels = (getComputedStyle(probe).color.match(/-?[\d.]+(?:e-?\d+)?/g) ?? [])
    .slice(0, 3)
    .map((value) => Math.round(Math.min(1, Math.max(0, Number(value))) * 255));

  probe.remove();

  return `#${channels.map((value) => value.toString(16).padStart(2, '0')).join('')}`;
}, declared);

const WIDGETS_UNDER_TEST = [
  'dxChart', 'dxPieChart', 'dxPolarChart', 'dxFunnel', 'dxSankey', 'dxTreeMap', 'dxVectorMap',
  'dxSparkline', 'dxBullet', 'dxBarGauge', 'dxCircularGauge', 'dxLinearGauge', 'dxRangeSelector',
];

const vizWidgetsExposed = (page: Page): Promise<string[]> => page.evaluate(
  () => Object.keys((window as any).DevExpress.viz)
    .filter((name) => /^dx[A-Z]/.test(name))
    .sort(),
);

const HANDED_OUT_BG = '#160703';
const FLUENT_NEXT_THEMES = [
  'fluent-next.blue.light', 'fluent-next.blue.light.compact',
  'fluent-next.blue.dark', 'fluent-next.blue.dark.compact',
];
const EXTENSION_MODES = ['blend', 'alternate', 'extrapolate'];
const FINAL_COLOR = /^(#[0-9a-f]{6}|rgba\()/;

const declareTheNames = (page: Page): Promise<void> => declareTheNamesTheWidgetsRead(
  page,
  DECLARED_BLUE,
  DECLARED_BG,
);

const colorsHandedOutByTheNamespace = (page: Page): Promise<Record<string, string>> => page
  .evaluate(() => {
    const { viz } = (window as any).DevExpress;
    const theme = viz.getTheme('fluent-next.blue.light');

    return {
      simpleSet: viz.getPalette('Fluent Next').simpleSet[0],
      gradientSet: viz.getPalette('Fluent Next').gradientSet[0],
      generated: viz.generateColors('Fluent Next', 6)[0],
      marker: theme.map['layer:marker:dot'].color,
      bullet: theme.bullet.color,
      rangebar: theme.gauge.valueIndicators.rangebar.color,
      background: theme.backgroundColor,
      findTheme: viz.findTheme('fluent-next.blue.light').bullet.color,
    };
  });

const valuesLeftToTheBrowser = (
  page: Page,
  names: string[],
): Promise<{ leaves: number; left: string[] }> => page.evaluate((themeNames) => {
  const { viz } = (window as any).DevExpress;
  const leaves: string[] = [];
  const walk = (value: unknown): void => {
    if (typeof value === 'string') {
      leaves.push(value);
    } else if (value && typeof value === 'object') {
      Object.values(value).forEach(walk);
    }
  };

  themeNames.forEach((name) => walk(viz.getTheme(name)));

  return { leaves: leaves.length, left: leaves.filter((leaf) => /var\(|color-mix\(|from /.test(leaf)) };
}, names);

const generatedPastThePalette = (page: Page, mode: string): Promise<string[]> => page.evaluate(
  (extensionMode) => (window as any).DevExpress.viz
    .generateColors('Fluent Next', 20, { paletteExtensionMode: extensionMode, useHighlight: true }) as string[],
  mode,
);

const CUSTOM_ACCENT = '#b02e0c';

const accentHandedOutByThePalette = (page: Page, accent: string): Promise<string> => page
  .evaluate((color) => {
    const { ui, viz } = (window as any).DevExpress;

    ui.themes.customAccentColor(color);

    return viz.getPalette('Fluent Next').accentColor;
  }, accent);

const watchTheCallbacks = (page: Page): Promise<void> => page.evaluate(() => {
  (window as any).handedToTheCallbacks = {};
});

const colorsHandedToTheCallbacks = (page: Page): Promise<Record<string, string>> => page
  .evaluate(() => (window as any).handedToTheCallbacks);

const gradientStopsExportedToTheCanvas = (page: Page): Promise<{
  stops: string[];
  stopColorAttribute: string;
  failure: string;
}> => page.evaluate(() => new Promise((resolve) => {
  const { widget } = (window as any);
  const nativeAddColorStop = CanvasGradient.prototype.addColorStop;
  const stops: string[] = [];
  const stopColorAttribute = document.querySelector('#container stop')?.getAttribute('stop-color') ?? '';
  let settled = false;

  const settle = (failure = ''): void => {
    if (settled) {
      return;
    }

    settled = true;
    CanvasGradient.prototype.addColorStop = nativeAddColorStop;
    resolve({ stops, stopColorAttribute, failure });
  };

  CanvasGradient.prototype.addColorStop = function watchedAddColorStop(offset, color) {
    stops.push(String(color));

    try {
      nativeAddColorStop.call(this, offset, color);
    } catch (error) {
      settle(String(error));
      throw error;
    }
  };

  widget.on('fileSaving', (e: { cancel: boolean }) => {
    e.cancel = true;
    settle();
  });

  try {
    widget.exportTo('probe', 'PNG');
  } catch (error) {
    settle(String(error));
  }
}));

const TOOLTIP = '.dxc-tooltip';
const CLOUD = `${TOOLTIP} path`;

const hoverTheTallestBar = async (page: Page): Promise<void> => {
  const bars = page.locator('#chart .dxc-series rect');
  const tallest = await bars.evaluateAll((rects) => {
    const heights = rects.map((rect) => rect.getBoundingClientRect().height);

    return heights.indexOf(Math.max(...heights));
  });

  await bars.nth(tallest).hover();
};

const chartWithTooltipInTheOtherMode = async (page: Page, oppositeMode: string): Promise<void> => {
  await render(page, `<div id="scope" class="dx-theme-mode-${oppositeMode}"><div id="chart"></div></div>`);
  await createWidget(page, 'dxChart', { ...CHART, tooltip: { enabled: true } }, '#chart');
};

const colorOfTheNameIn = (page: Page, selector: string, name: string): Promise<string> => page
  .evaluate(({ target, property }) => {
    const probe = document.createElement('div');

    probe.style.color = `var(${property})`;
    document.querySelector(target)?.appendChild(probe);

    const { color } = window.getComputedStyle(probe);

    probe.remove();

    return color;
  }, { target: selector, property: name });

const cloudPlacement = (page: Page): Promise<Record<string, unknown>> => page.evaluate(() => {
  const cloud = document.querySelector('.dxc-tooltip path');
  const box = cloud?.getBoundingClientRect();

  return {
    left: box?.left,
    top: box?.top,
    width: box?.width,
    height: box?.height,
    outline: cloud?.getAttribute('d'),
  };
});

const putTheTooltipInBody = (page: Page): Promise<void> => page.evaluate(() => {
  (window as any).widget.option('tooltip.container', 'body');
});

const twoChartsInTwoModes = async (page: Page): Promise<void> => {
  await render(page, `
    <div class="dx-theme-mode-light"><div id="light-chart"></div></div>
    <div class="dx-theme-mode-dark"><div id="dark-chart"></div></div>
  `);

  await createWidget(page, 'dxChart', CHART, '#light-chart');
  await createWidget(page, 'dxChart', CHART, '#dark-chart');
};

test.describe('Theme modes', () => {
  test.skip(({ theme }) => getThemeName(theme) !== 'fluent-next', 'fluent-next only');

  test('dxChart paints from a name the page declared, leaving no reference behind', async ({ page }) => {
    await declareTheNamesTheWidgetsRead(page, DECLARED_BLUE, DECLARED_BG);
    await createWidget(page, 'dxChart', {
      ...{
        dataSource: [{ a: 'x', v: 1 }],
        series: [{ argumentField: 'a', valueField: 'v' }],
      },
      animation: { enabled: false },
      size: { width: 220, height: 160 },
    });

    await expectHandedOut(page, [HANDED_OUT_BLUE, HANDED_OUT_BLUE]);
    await expectPaintedFrom(page, DECLARED_BLUE);
  });

  test('dxChart hands out a name declared in another colour space as the sRGB colour it paints', async ({ page }) => {
    await declareTheNamesTheWidgetsRead(page, DECLARED_IN_OKLCH, DECLARED_BG);
    await createWidget(page, 'dxChart', {
      dataSource: [{ a: 'x', v: 1 }],
      series: [{ argumentField: 'a', valueField: 'v' }],
      animation: { enabled: false },
      size: { width: 220, height: 160 },
    });

    const expected = await declaredAsRgb(page, DECLARED_IN_OKLCH);

    await expect.poll(
      () => colorsHandedOutByTheWidget(page),
      { message: 'getColor brings the colour to sRGB instead of reading its channels as red, green and blue' },
    ).toEqual([expected, expected]);
  });

  test('dxPieChart paints from a name the page declared, leaving no reference behind', async ({ page }) => {
    await declareTheNamesTheWidgetsRead(page, DECLARED_BLUE, DECLARED_BG);
    await createWidget(page, 'dxPieChart', {
      ...{
        dataSource: [{ a: 'x', v: 1 }],
        series: [{ argumentField: 'a', valueField: 'v' }],
      },
      animation: { enabled: false },
      size: { width: 220, height: 160 },
    });

    await expectHandedOut(page, [undefined, HANDED_OUT_BLUE]);
    await expectPaintedFrom(page, DECLARED_BLUE);
  });

  test('dxPolarChart paints from a name the page declared, leaving no reference behind', async ({ page }) => {
    await declareTheNamesTheWidgetsRead(page, DECLARED_BLUE, DECLARED_BG);
    await createWidget(page, 'dxPolarChart', {
      ...{
        dataSource: [{ a: 'x', v: 1 }],
        series: [{ argumentField: 'a', valueField: 'v' }],
      },
      animation: { enabled: false },
      size: { width: 220, height: 160 },
    });

    await expectHandedOut(page, [HANDED_OUT_BLUE, HANDED_OUT_BLUE]);
    await expectPaintedFrom(page, DECLARED_BLUE);
  });

  test('dxFunnel paints from a name the page declared, leaving no reference behind', async ({ page }) => {
    await declareTheNamesTheWidgetsRead(page, DECLARED_BLUE, DECLARED_BG);
    await createWidget(page, 'dxFunnel', {
      ...{
        dataSource: [{ a: 'x', v: 3 }],
        argumentField: 'a',
        valueField: 'v',
      },
      animation: { enabled: false },
      size: { width: 220, height: 160 },
    });

    await expectHandedOut(page, [HANDED_OUT_BLUE]);
    await expectPaintedFrom(page, DECLARED_BLUE);
  });

  test('dxSankey paints from a name the page declared, leaving no reference behind', async ({ page }) => {
    await declareTheNamesTheWidgetsRead(page, DECLARED_BLUE, DECLARED_BG);
    await createWidget(page, 'dxSankey', {
      ...{
        dataSource: [{ source: 'A', target: 'X', weight: 1 }],
      },
      animation: { enabled: false },
      size: { width: 220, height: 160 },
    });

    await expectPaintedFrom(page, DECLARED_BLUE);
  });

  test('dxTreeMap paints from a name the page declared, leaving no reference behind', async ({ page }) => {
    await declareTheNamesTheWidgetsRead(page, DECLARED_BLUE, DECLARED_BG);
    await createWidget(page, 'dxTreeMap', {
      ...{
        dataSource: [{ name: 'a', value: 1 }],
      },
      animation: { enabled: false },
      size: { width: 220, height: 160 },
    });

    await expectPaintedFrom(page, DECLARED_BLUE);
  });

  test('dxVectorMap paints from a name the page declared, leaving no reference behind', async ({ page }) => {
    await declareTheNamesTheWidgetsRead(page, DECLARED_BLUE, DECLARED_BG);
    await createWidget(page, 'dxVectorMap', {
      ...{
        layers: [{
          type: 'marker',
          dataSource: {
            type: 'FeatureCollection',
            features: [{ type: 'Feature', geometry: { type: 'Point', coordinates: [0, 0] }, properties: { text: 'a' } }],
          },
          label: { enabled: true, dataField: 'text' },
        }],
      },
      animation: { enabled: false },
      size: { width: 220, height: 160 },
    });

    await expectPaintedFrom(page, DECLARED_BLUE);
  });

  test('dxSparkline paints from a name the page declared, leaving no reference behind', async ({ page }) => {
    await declareTheNamesTheWidgetsRead(page, DECLARED_BLUE, DECLARED_BG);
    await createWidget(page, 'dxSparkline', {
      ...{
        dataSource: [1, 4, 2],
      },
      animation: { enabled: false },
      size: { width: 220, height: 160 },
    });

    await expectPaintedFrom(page, DECLARED_BG);
  });

  test('dxBullet paints from a name the page declared, leaving no reference behind', async ({ page }) => {
    await declareTheNamesTheWidgetsRead(page, DECLARED_BLUE, DECLARED_BG);
    await createWidget(page, 'dxBullet', {
      ...{
        value: 40,
        target: 60,
      },
      animation: { enabled: false },
      size: { width: 220, height: 160 },
    });

    await expectPaintedFrom(page, DECLARED_BLUE);
  });

  test('dxBarGauge paints from a name the page declared, leaving no reference behind', async ({ page }) => {
    await declareTheNamesTheWidgetsRead(page, DECLARED_BLUE, DECLARED_BG);
    await createWidget(page, 'dxBarGauge', {
      ...{
        values: [30],
      },
      animation: { enabled: false },
      size: { width: 220, height: 160 },
    });

    await expectPaintedFrom(page, DECLARED_BLUE);
  });

  test('dxCircularGauge paints from a name the page declared, leaving no reference behind', async ({ page }) => {
    await declareTheNamesTheWidgetsRead(page, DECLARED_BLUE, DECLARED_BG);
    await createWidget(page, 'dxCircularGauge', {
      ...{
        value: 40,
      },
      animation: { enabled: false },
      size: { width: 220, height: 160 },
    });

    await expectPaintedFrom(page, DECLARED_BG);
  });

  test('dxLinearGauge paints from a name the page declared, leaving no reference behind', async ({ page }) => {
    await declareTheNamesTheWidgetsRead(page, DECLARED_BLUE, DECLARED_BG);
    await createWidget(page, 'dxLinearGauge', {
      ...{
        value: 40,
      },
      animation: { enabled: false },
      size: { width: 220, height: 160 },
    });

    await expectPaintedFrom(page, DECLARED_BLUE);
  });

  test('dxRangeSelector paints from a name the page declared, leaving no reference behind', async ({ page }) => {
    await declareTheNamesTheWidgetsRead(page, DECLARED_BLUE, DECLARED_BG);
    await createWidget(page, 'dxRangeSelector', {
      ...{
        scale: { startValue: 0, endValue: 10 },
      },
      behavior: { animationEnabled: false },
      size: { width: 220, height: 160 },
    });

    await expectPaintedFrom(page, DECLARED_BG);
  });

  test('every viz widget the namespace exposes has a test of its own', async ({ page }) => {
    await expect.poll(() => vizWidgetsExposed(page)).toEqual([...WIDGETS_UNDER_TEST].sort());
  });

  test('the palette and theme functions hand out the colour the page declared, not the name', async ({ page }) => {
    await declareTheNames(page);

    await expect.poll(() => colorsHandedOutByTheNamespace(page)).toEqual({
      simpleSet: HANDED_OUT_BLUE,
      gradientSet: HANDED_OUT_BLUE,
      generated: HANDED_OUT_BLUE,
      marker: HANDED_OUT_BLUE,
      bullet: HANDED_OUT_BLUE,
      rangebar: HANDED_OUT_BLUE,
      background: HANDED_OUT_BG,
      findTheme: HANDED_OUT_BLUE,
    });
  });

  test('no fluent-next theme hands out a name, a mix or a relative colour', async ({ page }) => {
    await declareTheNames(page);

    await expect.poll(
      async () => (await valuesLeftToTheBrowser(page, FLUENT_NEXT_THEMES)).leaves,
      { message: 'the walk reached the whole of every theme' },
    ).toBeGreaterThan(FLUENT_NEXT_THEMES.length * 100);
    await expect.poll(
      async () => (await valuesLeftToTheBrowser(page, FLUENT_NEXT_THEMES)).left,
      { message: 'every value is one an application can use as it is' },
    ).toEqual([]);
  });

  test('generateColors extends the palette past its size into final colours only', async ({ page }) => {
    await declareTheNames(page);

    for (const mode of EXTENSION_MODES) {
      const colors = await generatedPastThePalette(page, mode);

      expect(colors.length, `${mode} hands out every colour asked for`).toBe(20);
      expect(
        colors.filter((color) => !FINAL_COLOR.test(color)),
        `${mode} hands out only colours an application can parse`,
      ).toEqual([]);
      expect(new Set(colors).size, `${mode} extends the palette with colours of its own`).toBeGreaterThan(6);
    }
  });

  test('a custom accent is handed out as the colour it paints, not the relative colour it is derived with', async ({ page }) => {
    expect(await accentHandedOutByThePalette(page, CUSTOM_ACCENT)).toBe(CUSTOM_ACCENT);
    await expect.poll(
      async () => (await valuesLeftToTheBrowser(page, FLUENT_NEXT_THEMES)).left,
      { message: 'no theme hands the accent out as a relative colour either' },
    ).toEqual([]);
  });

  test('the legend and tooltip callbacks hand out the colour a widget paints, not the name', async ({ page }) => {
    await declareTheNames(page);
    await watchTheCallbacks(page);
    await render(page, '<div id="chart"></div><div id="pie"></div><div id="bar-gauge"></div><div id="map"></div><div id="linear-gauge"></div>');
    await createWidget(page, 'dxChart', () => ({
      dataSource: [{ a: 'x', v: 1 }],
      series: [{ argumentField: 'a', valueField: 'v' }],
      legend: {
        customizeText(info) {
          if (info.seriesIndex === 0) {
            (window as any).handedToTheCallbacks.seriesColor = info.seriesColor;
          }
          return String(info.seriesName);
        },
      },
      animation: { enabled: false },
      size: { width: 220, height: 160 },
    }), '#chart');
    await createWidget(page, 'dxPieChart', () => ({
      dataSource: [{ a: 'x', v: 1 }, { a: 'y', v: 2 }],
      series: [{ argumentField: 'a', valueField: 'v' }],
      legend: {
        customizeText(info) {
          if (info.pointIndex === 0) {
            (window as any).handedToTheCallbacks.pointColor = info.pointColor;
          }
          return String(info.pointName);
        },
      },
      animation: { enabled: false },
      size: { width: 220, height: 160 },
    }), '#pie');
    await createWidget(page, 'dxBarGauge', () => ({
      values: [30, 60],
      legend: {
        visible: true,
        customizeText(info) {
          if (info.item.index === 0) {
            (window as any).handedToTheCallbacks.barColor = info.item.color;
          }
          return String(info.text);
        },
      },
      animation: { enabled: false },
      size: { width: 220, height: 160 },
    }), '#bar-gauge');
    await createWidget(page, 'dxVectorMap', () => ({
      layers: [{
        name: 'markers',
        type: 'marker',
        elementType: 'bubble',
        dataField: 'value',
        colorGroupingField: 'value',
        colorGroups: [0, 5, 10],
        dataSource: {
          type: 'FeatureCollection',
          features: [
            { type: 'Feature', geometry: { type: 'Point', coordinates: [0, 0] }, properties: { value: 1 } },
            { type: 'Feature', geometry: { type: 'Point', coordinates: [20, 20] }, properties: { value: 8 } },
          ],
        },
      }],
      legends: [{
        source: { layer: 'markers', grouping: 'color' },
        customizeText(info) {
          if (info.index === 0) {
            (window as any).handedToTheCallbacks.groupColor = info.color;
          }
          return String(info.index);
        },
      }],
      size: { width: 220, height: 160 },
    }), '#map');
    await createWidget(page, 'dxLinearGauge', () => ({
      value: 40,
      valueIndicator: { type: 'rangeBar' },
      tooltip: {
        enabled: true,
        customizeTooltip(info) {
          (window as any).handedToTheCallbacks.indicatorColor = info.color;
          return { text: String(info.valueText) };
        },
      },
      animation: { enabled: false },
      size: { width: 220, height: 160 },
    }), '#linear-gauge');

    await page.locator('#linear-gauge .dxg-tracker path').hover();

    await expect.poll(() => colorsHandedToTheCallbacks(page)).toEqual({
      seriesColor: HANDED_OUT_BLUE,
      pointColor: HANDED_OUT_BLUE,
      barColor: HANDED_OUT_BLUE,
      groupColor: HANDED_OUT_BLUE,
      indicatorColor: HANDED_OUT_BLUE,
    });
  });

  test('a chart exported from a mode scope keeps the background of the scope', async ({ page, theme }) => {
    const { oppositeMode } = modesOf(theme);

    await render(page, `<div class="dx-theme-mode-${oppositeMode}"><div id="scoped-chart"></div></div>`);
    await createWidget(page, 'dxChart', CHART, '#scoped-chart');

    const scopeBackground = await valueAt(page, '#scoped-chart', '--dx-viz-bg');
    const pageBackground = await valueAt(page, 'html', '--dx-viz-bg');
    const painted = async (): Promise<string> => (await exportedFrom(page, '#scoped-chart', 'dxChart', 'svg', 'data-backgroundcolor')).painted;

    await expect.poll(painted, { message: 'the markup carries the background the chart is painted on' })
      .toBe(scopeBackground);
    await expect.poll(painted, { message: 'not the background of the page around the scope' })
      .not.toBe(pageBackground);
  });

  test('exportTo hands a gradient stop the colour the name resolved to', async ({ page }) => {
    await declareTheNamesTheWidgetsRead(page, DECLARED_BLUE, DECLARED_BG);
    await createWidget(page, 'dxSankey', {
      dataSource: [{ source: 'A', target: 'X', weight: 1 }],
      link: { colorMode: 'gradient' },
      animation: { enabled: false },
      size: { width: 220, height: 160 },
    });

    const { stops, stopColorAttribute, failure } = await gradientStopsExportedToTheCanvas(page);

    expect(stopColorAttribute, 'the widget writes the name into the attribute, so the exporter is the one that has to resolve it').toBe('var(--dx-viz-blue, #0078d4)');
    expect(failure, 'the export reaches onFileSaving instead of failing in addColorStop').toBe('');
    expect(stops.filter((stop) => stop.includes('var(')), 'no stop reaches the canvas as a reference').toEqual([]);
    expect(stops[0], 'the first stop carries what the page declared, neither the name nor the literal beside it').toBe(DECLARED_BLUE);
  });

  test('a named mode class re-resolves the roles under it', async ({ page, theme }) => {
    const { buildMode } = modesOf(theme);

    await render(page, `
      <div id="plain"></div>
      <div class="dx-theme-mode-light"><div id="light"></div></div>
      <div class="dx-theme-mode-dark"><div id="dark"></div></div>
    `);

    await expect.poll(() => valueAt(page, '#plain', '--dx-theme-mode')).toBe(buildMode);
    await expect.poll(() => valueAt(page, '#light', '--dx-theme-mode')).toBe('light');
    await expect.poll(() => valueAt(page, '#dark', '--dx-theme-mode')).toBe('dark');

    for (const role of MODE_DEPENDENT) {
      const dark = await valueAt(page, '#dark', role);
      const light = await valueAt(page, '#light', role);

      await expect.poll(() => valueAt(page, '#light', role), { message: `${role} must differ between the two named modes` })
        .not.toBe(dark);
      await expect.poll(() => valueAt(page, '#plain', role), { message: `${role} without a class is the bundle's mode` })
        .toBe(buildMode === 'dark' ? dark : light);
    }
  });

  test('inverted flips against the nearest named scope', async ({ page, theme }) => {
    const { buildMode, oppositeMode } = modesOf(theme);

    await render(page, `
      <div class="dx-theme-mode-inverted"><div id="bare"></div></div>
      <div class="dx-theme-mode-dark"><div class="dx-theme-mode-inverted"><div id="in-dark"></div></div></div>
      <div class="dx-theme-mode-light"><div class="dx-theme-mode-inverted"><div id="in-light"></div></div></div>
      <div class="dx-theme-mode-inverted">
        <div class="dx-theme-mode-inverted"><div id="nested"></div></div>
      </div>
      <div class="dx-theme-mode-dark">
        <div class="dx-theme-mode-inverted">
          <div class="dx-theme-mode-inverted"><div id="nested-in-dark"></div></div>
        </div>
      </div>
    `);

    await expect.poll(() => valueAt(page, '#bare', '--dx-theme-mode'), { message: 'with no named scope above it, inverted opposes the bundle' })
      .toBe(oppositeMode);
    await expect.poll(() => valueAt(page, '#in-dark', '--dx-theme-mode')).toBe('light');
    await expect.poll(() => valueAt(page, '#in-light', '--dx-theme-mode')).toBe('dark');
    await expect.poll(() => valueAt(page, '#nested', '--dx-theme-mode'), { message: 'inverted inside inverted flips back' })
      .toBe(buildMode);
    await expect.poll(() => valueAt(page, '#nested-in-dark', '--dx-theme-mode'), { message: 'the pair resolves against the dark scope around it' })
      .toBe('dark');
  });

  test('the system tier follows the mode instead of freezing at the bundle', async ({ page, theme }) => {
    const { oppositeMode } = modesOf(theme);

    await render(page, `<div class="dx-theme-mode-${oppositeMode}"><div id="probe"></div></div>`);

    for (const name of SYSTEM_TIER) {
      const atTheRoot = await valueAt(page, 'html', name);

      await expect.poll(() => valueAt(page, '#probe', name), { message: `${name} must re-resolve inside a mode scope` })
        .not.toBe(atTheRoot);
    }
  });

  test('themes.mode answers for the element, not for the loaded file', async ({ page, theme }) => {
    const { buildMode, oppositeMode } = modesOf(theme);

    await render(page, `
      <div id="plain"></div>
      <div class="dx-theme-mode-${oppositeMode}"><div id="scoped"></div></div>
      <div class="dx-theme-mode-${oppositeMode}"><div class="dx-theme-mode-inverted"><div id="back"></div></div></div>
    `);

    await expect.poll(() => reportedMode(page, '#plain'), { message: 'no scope above it - the loaded theme answers' })
      .toBe(buildMode);
    await expect.poll(() => reportedMode(page, '#scoped'), { message: 'the mode is inherited from the scope, not declared here' })
      .toBe(oppositeMode);
    await expect.poll(() => reportedMode(page, '#back'), { message: 'and inverted inside it flips back' })
      .toBe(buildMode);

    for (const id of ['#plain', '#scoped', '#back']) {
      const declared = await valueAt(page, id, '--dx-theme-mode');

      await expect.poll(() => reportedMode(page, id)).toBe(declared);
    }
  });

  test('an overlay is painted in the mode of the element that owns it', async ({ page, theme }) => {
    const { oppositeMode } = modesOf(theme);

    await render(page, `<div class="dx-theme-mode-${oppositeMode}"><div id="owner"></div></div>`);

    await createWidget(page, 'dxPopup', {
      visible: true, width: 100, height: 100, animation: null,
    }, '#owner');

    await expect(page.locator('.dx-popup-wrapper')).not.toHaveCount(0);
    await expect.poll(() => valueAt(page, '.dx-popup-wrapper', '--dx-theme-mode')).toBe(oppositeMode);

    const ownerBackground = await valueAt(page, '#owner', '--dxds-color-bg');

    await expect.poll(() => valueAt(page, '.dx-popup-wrapper', '--dxds-color-bg'), { message: 'the overlay resolves the same roles as its owner' })
      .toBe(ownerBackground);
  });

  test('a chart tooltip is painted in the mode of the scope its chart is in', async ({ page, theme }) => {
    const { oppositeMode } = modesOf(theme);

    await chartWithTooltipInTheOtherMode(page, oppositeMode);

    await hoverTheTallestBar(page);

    await expect(page.locator(CLOUD), 'the tooltip is drawn').not.toHaveCount(0);

    const painted = await valueAt(page, CLOUD, 'fill');

    expect(painted, 'the cloud takes --dx-viz-tooltip-bg from the scope of its chart')
      .toBe(await colorOfTheNameIn(page, '#scope', '--dx-viz-tooltip-bg'));
    expect(painted, 'not from the page around the scope')
      .not.toBe(await colorOfTheNameIn(page, '#container', '--dx-viz-tooltip-bg'));
    await expect(
      page.locator(`.dx-theme-mode-${oppositeMode}`).filter({ has: page.locator(TOOLTIP) }),
      'the tooltip is attached inside a scope of that mode',
    ).not.toHaveCount(0);
  });

  test('a chart tooltip in a mode scope lands where the same tooltip lands in body', async ({ page, theme }) => {
    const { oppositeMode } = modesOf(theme);

    await chartWithTooltipInTheOtherMode(page, oppositeMode);

    await hoverTheTallestBar(page);

    await expect(page.locator(CLOUD), 'the tooltip is drawn').not.toHaveCount(0);

    const inTheScope = await cloudPlacement(page);

    await putTheTooltipInBody(page);
    await page.mouse.move(1, 1);
    await hoverTheTallestBar(page);

    await expect(page.locator(`body > ${CLOUD}`), 'the same tooltip, now drawn in body').not.toHaveCount(0);
    await expect.poll(() => cloudPlacement(page), { message: 'the scope neither moves the cloud nor turns its arrow' })
      .toEqual(inTheScope);
  });

  test('an open overlay follows its scope once the application says the mode changed', async ({ page, theme }) => {
    const { buildMode, oppositeMode } = modesOf(theme);

    await render(page, `<div id="scope" class="dx-theme-mode-${oppositeMode}"><div id="owner"></div></div>`);

    await createWidget(page, 'dxPopup', {
      visible: true, width: 100, height: 100, animation: null,
    }, '#owner');

    const painted = (): Promise<string> => valueAt(page, '.dx-popup-wrapper', '--dxds-color-bg');
    const asOpened = await painted();

    expect(asOpened, 'opens in the mode of its scope').toBe(await valueAt(page, '#owner', '--dxds-color-bg'));

    await setScopeMode(page, '#scope', buildMode, true);

    await expect.poll(() => valueAt(page, '#owner', '--dx-theme-mode'), { message: 'the scope did switch' })
      .toBe(buildMode);
    await expect.poll(painted, { message: 'the open overlay repainted' }).not.toBe(asOpened);

    const ownerBackground = await valueAt(page, '#owner', '--dxds-color-bg');

    await expect.poll(painted, { message: 'and matches its owner again' }).toBe(ownerBackground);
  });

  test('a chart takes its chrome from the scope and its data from the palette', async ({ page }) => {
    await twoChartsInTwoModes(page);

    const darkAxis = await valueAt(page, '#dark-chart .dxc-arg-elements text', 'fill');
    const darkGrid = await valueAt(page, '#dark-chart .dxc-val-grid path', 'stroke');
    const darkSeries = await valueAt(page, '#dark-chart .dxc-series rect', 'fill');

    await expect.poll(() => valueAt(page, '#light-chart .dxc-arg-elements text', 'fill'), { message: 'the axis reads against the surface under it' })
      .not.toBe(darkAxis);
    await expect.poll(() => valueAt(page, '#light-chart .dxc-val-grid path', 'stroke'), { message: 'and so does the grid' })
      .not.toBe(darkGrid);
    await expect.poll(() => valueAt(page, '#light-chart .dxc-series rect', 'fill'), { message: 'a blue series stays the same blue in both modes' })
      .toBe(darkSeries);
  });

  test('a chart repaints the moment a published name changes, with nothing asked of the widget', async ({ page }) => {
    await render(page, '<div id="chart"></div>');
    await createWidget(page, 'dxChart', CHART, '#chart');

    const seriesFill = (): Promise<string> => valueAt(page, '#chart .dxc-series rect', 'fill');
    const asPainted = await seriesFill();

    await writeRootProperty(page, '--dx-viz-blue', 'rgb(1, 2, 3)');

    const asWritten = await seriesFill();

    await writeRootProperty(page, '--dx-viz-blue', '');

    const asRestored = await seriesFill();

    expect(asWritten, 'the cascade repainted the series, no call was made').toBe('rgb(1, 2, 3)');
    expect(asWritten).not.toBe(asPainted);
    expect(asRestored, 'and the theme is back once the page stops writing it').toBe(asPainted);
  });

  test('a chart exports the colors it was painted in, not the ones written beside them', async ({ page }) => {
    await twoChartsInTwoModes(page);

    const light = await exportedChartFrom(page, '#light-chart');
    const dark = await exportedChartFrom(page, '#dark-chart');

    expect(light.references, 'nothing resolves a reference once the markup is out of the document').toBe(0);
    expect(dark.references).toBe(0);
    expect(light.painted, 'the exported text carries the colour it was painted with').not.toBe('');
    expect(dark.painted, 'each chart exports in the mode of its own scope').not.toBe(light.painted);
  });

  test('a map exports the halo behind its labels, not the name the halo was written with', async ({ page }) => {
    await render(page, `
      <div class="dx-theme-mode-light"><div id="light-map"></div></div>
      <div class="dx-theme-mode-dark"><div id="dark-map"></div></div>
    `);

    await createWidget(page, 'dxVectorMap', MAP_WITH_LABELLED_MARKERS, '#light-map');
    await createWidget(page, 'dxVectorMap', MAP_WITH_LABELLED_MARKERS, '#dark-map');

    const light = await exportedHaloFrom(page, '#light-map');
    const dark = await exportedHaloFrom(page, '#dark-map');

    expect(light.references, 'a stroke written outside the attribute path resolves too').toBe(0);
    expect(dark.references).toBe(0);
    expect(light.painted, 'the exported halo carries the colour it was painted with').not.toBe('');
    expect(dark.painted, 'each map exports in the mode of its own scope').not.toBe(light.painted);
  });

  test('an open overlay keeps its mode until the application says so', async ({ page, theme }) => {
    const { buildMode, oppositeMode } = modesOf(theme);

    await render(page, `<div id="scope" class="dx-theme-mode-${oppositeMode}"><div id="owner"></div></div>`);

    await createWidget(page, 'dxPopup', {
      visible: true, width: 100, height: 100, animation: null,
    }, '#owner');

    const asOpened = await valueAt(page, '.dx-popup-wrapper', '--dxds-color-bg');

    await setScopeMode(page, '#scope', buildMode, false);

    expect(await valueAt(page, '.dx-popup-wrapper', '--dxds-color-bg'), 'still painted in the mode it was opened in')
      .toBe(asOpened);
  });
});
