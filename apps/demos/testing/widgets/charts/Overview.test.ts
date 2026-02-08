import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { Selector as $ } from 'testcafe';
import { runManualTest } from '../../../utils/visual-tests/matrix-test-helper';
import { testScreenshot } from '../../../utils/visual-tests/helpers/theme-utils';

fixture('Charts.Overview')
  .before(async (ctx) => {
    ctx.initialWindowSize = [900, 600];
  });

runManualTest('Charts', 'Overview', (test) => {
  test('Tooltip', async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await t.hover($('.dxc-markers').nth(0).find('rect').nth(1));
    await testScreenshot(t, takeScreenshot, 'charts_overview_tooltip.png');

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  });
});
