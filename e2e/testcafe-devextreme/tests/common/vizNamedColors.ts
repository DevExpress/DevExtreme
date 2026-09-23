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
    widget: 'dxSparkline' | 'dxSankey',
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
}
