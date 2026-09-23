import { ClientFunction, Selector } from 'testcafe';
import url from '../../helpers/getPageUrl';
import { createWidget } from '../../helpers/createWidget';
import { getComputedPropertyValue } from '../../helpers/domUtils';
import { clearTestPage } from '../../helpers/testPageUtils';
import { getFullThemeName, getThemeName } from '../../helpers/themeUtils';

if (getThemeName() === 'fluent-next') {
  fixture`Theme modes`
    .page(url(__dirname, '../container.html'))
    .afterEach(async (t) => { await clearTestPage(t); });

  const buildMode = getFullThemeName().includes('.dark') ? 'dark' : 'light';
  const oppositeMode = buildMode === 'dark' ? 'light' : 'dark';

  const MODE_DEPENDENT = ['--dxds-color-bg', '--dxds-color-content'];
  const SYSTEM_TIER = ['--dx-global-content', '--dx-surface-overlay', '--dx-focus-rect-outline'];

  const render = ClientFunction((markup: string) => {
    const container = document.querySelector('#container');

    if (container) container.innerHTML = markup;
  });

  const valueAt = async (selector: string, property: string): Promise<string> => (
    await getComputedPropertyValue(selector, property)
  ).trim();

  const reportedMode = ClientFunction((selector: string) => (window as any).DevExpress.ui.themes
    .mode(document.querySelector(selector)));

  const setScopeMode = ClientFunction((selector: string, mode: string, tell: boolean) => {
    const scope = document.querySelector(selector) as HTMLElement;

    scope.classList.remove('dx-theme-mode-light', 'dx-theme-mode-dark');
    scope.classList.add(`dx-theme-mode-${mode}`);

    if (tell) {
      (window as any).DevExpress.ui.themes.refreshMode();
    }
  });

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

  const writeRootProperty = ClientFunction((name: string, value: string) => {
    const root = document.documentElement;

    if (value) {
      root.style.setProperty(name, value);
    } else {
      root.style.removeProperty(name);
    }
  });

  const exportedFrom = ClientFunction((
    selector: string,
    widgetName: string,
    paintedSelector: string,
    paintedAttribute: string,
  ) => {
    const instance = ($(selector) as any)[widgetName]('instance');
    const markup = (window as any).DevExpress.viz.getMarkup([instance]);
    const painted = new DOMParser().parseFromString(markup, 'image/svg+xml').querySelector(paintedSelector);

    return {
      references: (markup.match(/var\(--dx-/g) ?? []).length,
      painted: painted?.getAttribute(paintedAttribute) ?? '',
    };
  });

  type Exported = Promise<{ references: number; painted: string }>;

  const exportedChartFrom = (selector: string): Exported => exportedFrom(selector, 'dxChart', 'text', 'style');

  const exportedHaloFrom = (selector: string): Exported => exportedFrom(selector, 'dxVectorMap', '[stroke-linejoin="round"]', 'stroke');

  test('a named mode class re-resolves the roles under it', async (t) => {
    await render(`
      <div id="plain"></div>
      <div class="dx-theme-mode-light"><div id="light"></div></div>
      <div class="dx-theme-mode-dark"><div id="dark"></div></div>
    `);

    await t.expect(await valueAt('#plain', '--dx-theme-mode')).eql(buildMode);
    await t.expect(await valueAt('#light', '--dx-theme-mode')).eql('light');
    await t.expect(await valueAt('#dark', '--dx-theme-mode')).eql('dark');

    for (const role of MODE_DEPENDENT) {
      const [light, dark, plain] = [
        await valueAt('#light', role),
        await valueAt('#dark', role),
        await valueAt('#plain', role),
      ];

      await t.expect(light)
        .notEql(dark, `${role} must differ between the two named modes`);
      await t.expect(plain)
        .eql(buildMode === 'dark' ? dark : light, `${role} without a class is the bundle's mode`);
    }
  });

  test('inverted flips against the nearest named scope', async (t) => {
    await render(`
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

    await t.expect(await valueAt('#bare', '--dx-theme-mode'))
      .eql(oppositeMode, 'with no named scope above it, inverted opposes the bundle');
    await t.expect(await valueAt('#in-dark', '--dx-theme-mode')).eql('light');
    await t.expect(await valueAt('#in-light', '--dx-theme-mode')).eql('dark');
    await t.expect(await valueAt('#nested', '--dx-theme-mode'))
      .eql(buildMode, 'inverted inside inverted flips back');
    await t.expect(await valueAt('#nested-in-dark', '--dx-theme-mode'))
      .eql('dark', 'the pair resolves against the dark scope around it');
  });

  test('the system tier follows the mode instead of freezing at the bundle', async (t) => {
    await render(`<div class="dx-theme-mode-${oppositeMode}"><div id="probe"></div></div>`);

    for (const name of SYSTEM_TIER) {
      await t.expect(await valueAt('#probe', name))
        .notEql(await valueAt('html', name), `${name} must re-resolve inside a mode scope`);
    }
  });

  test('themes.mode answers for the element, not for the loaded file', async (t) => {
    await render(`
      <div id="plain"></div>
      <div class="dx-theme-mode-${oppositeMode}"><div id="scoped"></div></div>
      <div class="dx-theme-mode-${oppositeMode}"><div class="dx-theme-mode-inverted"><div id="back"></div></div></div>
    `);

    await t.expect(await reportedMode('#plain')).eql(buildMode, 'no scope above it - the loaded theme answers');
    await t.expect(await reportedMode('#scoped')).eql(oppositeMode, 'the mode is inherited from the scope, not declared here');
    await t.expect(await reportedMode('#back')).eql(buildMode, 'and inverted inside it flips back');

    for (const id of ['#plain', '#scoped', '#back']) {
      await t.expect(await reportedMode(id)).eql(await valueAt(id, '--dx-theme-mode'));
    }
  });

  test('an overlay is painted in the mode of the element that owns it', async (t) => {
    await render(`<div class="dx-theme-mode-${oppositeMode}"><div id="owner"></div></div>`);

    await createWidget('dxPopup', {
      visible: true, width: 100, height: 100, animation: null,
    }, '#owner');

    const wrapper = Selector('.dx-popup-wrapper');

    await t.expect(wrapper.exists).ok();
    await t.expect(await valueAt('.dx-popup-wrapper', '--dx-theme-mode')).eql(oppositeMode);
    await t.expect(await valueAt('.dx-popup-wrapper', '--dxds-color-bg'))
      .eql(await valueAt('#owner', '--dxds-color-bg'), 'the overlay resolves the same roles as its owner');
  });

  test('an open overlay follows its scope once the application says the mode changed', async (t) => {
    await render(`<div id="scope" class="dx-theme-mode-${oppositeMode}"><div id="owner"></div></div>`);

    await createWidget('dxPopup', {
      visible: true, width: 100, height: 100, animation: null,
    }, '#owner');

    const painted = async (): Promise<string> => valueAt('.dx-popup-wrapper', '--dxds-color-bg');
    const asOpened = await painted();

    await t.expect(asOpened).eql(await valueAt('#owner', '--dxds-color-bg'), 'opens in the mode of its scope');

    await setScopeMode('#scope', buildMode, true);

    await t.expect(await valueAt('#owner', '--dx-theme-mode')).eql(buildMode, 'the scope did switch');
    await t.expect(await painted()).notEql(asOpened, 'the open overlay repainted');
    await t.expect(await painted())
      .eql(await valueAt('#owner', '--dxds-color-bg'), 'and matches its owner again');
  });

  const twoChartsInTwoModes = async (): Promise<void> => {
    await render(`
      <div class="dx-theme-mode-light"><div id="light-chart"></div></div>
      <div class="dx-theme-mode-dark"><div id="dark-chart"></div></div>
    `);

    await createWidget('dxChart', CHART, '#light-chart');
    await createWidget('dxChart', CHART, '#dark-chart');
  };

  test('a chart takes its chrome from the scope and its data from the palette', async (t) => {
    await t.expect(await valueAt('#light-chart .dxc-arg-elements text', 'fill'))
      .notEql(await valueAt('#dark-chart .dxc-arg-elements text', 'fill'), 'the axis reads against the surface under it');
    await t.expect(await valueAt('#light-chart .dxc-val-grid path', 'stroke'))
      .notEql(await valueAt('#dark-chart .dxc-val-grid path', 'stroke'), 'and so does the grid');
    await t.expect(await valueAt('#light-chart .dxc-series rect', 'fill'))
      .eql(await valueAt('#dark-chart .dxc-series rect', 'fill'), 'a blue series stays the same blue in both modes');
  }).before(twoChartsInTwoModes);

  test('a chart repaints the moment a published name changes, with nothing asked of the widget', async (t) => {
    const asPainted = await valueAt('#chart .dxc-series rect', 'fill');

    await writeRootProperty('--dx-viz-blue', 'rgb(1, 2, 3)');

    const asWritten = await valueAt('#chart .dxc-series rect', 'fill');

    await writeRootProperty('--dx-viz-blue', '');

    const asRestored = await valueAt('#chart .dxc-series rect', 'fill');

    await t.expect(asWritten).eql('rgb(1, 2, 3)', 'the cascade repainted the series, no call was made');
    await t.expect(asWritten).notEql(asPainted);
    await t.expect(asRestored).eql(asPainted, 'and the theme is back once the page stops writing it');
  }).before(async () => {
    await render('<div id="chart"></div>');
    await createWidget('dxChart', CHART, '#chart');
  });

  test('a chart exports the colors it was painted in, not the ones written beside them', async (t) => {
    const light = await exportedChartFrom('#light-chart');
    const dark = await exportedChartFrom('#dark-chart');

    await t.expect(light.references).eql(0, 'nothing resolves a reference once the markup is out of the document');
    await t.expect(dark.references).eql(0);
    await t.expect(light.painted).notEql('', 'the exported text carries the colour it was painted with');
    await t.expect(dark.painted).notEql(light.painted, 'each chart exports in the mode of its own scope');
  }).before(twoChartsInTwoModes);

  test('a map exports the halo behind its labels, not the name the halo was written with', async (t) => {
    const light = await exportedHaloFrom('#light-map');
    const dark = await exportedHaloFrom('#dark-map');

    await t.expect(light.references).eql(0, 'a stroke written outside the attribute path resolves too');
    await t.expect(dark.references).eql(0);
    await t.expect(light.painted).notEql('', 'the exported halo carries the colour it was painted with');
    await t.expect(dark.painted).notEql(light.painted, 'each map exports in the mode of its own scope');
  }).before(async () => {
    await render(`
      <div class="dx-theme-mode-light"><div id="light-map"></div></div>
      <div class="dx-theme-mode-dark"><div id="dark-map"></div></div>
    `);

    await createWidget('dxVectorMap', MAP_WITH_LABELLED_MARKERS, '#light-map');
    await createWidget('dxVectorMap', MAP_WITH_LABELLED_MARKERS, '#dark-map');
  });

  test('an open overlay keeps its mode until the application says so', async (t) => {
    await render(`<div id="scope" class="dx-theme-mode-${oppositeMode}"><div id="owner"></div></div>`);

    await createWidget('dxPopup', {
      visible: true, width: 100, height: 100, animation: null,
    }, '#owner');

    const asOpened = await valueAt('.dx-popup-wrapper', '--dxds-color-bg');

    await setScopeMode('#scope', buildMode, false);

    await t.expect(await valueAt('.dx-popup-wrapper', '--dxds-color-bg'))
      .eql(asOpened, 'still painted in the mode it was opened in');
  });
}
