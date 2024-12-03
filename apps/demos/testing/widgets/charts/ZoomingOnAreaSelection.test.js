import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { Selector as $ } from 'testcafe';
import { runManualTest } from '../../../utils/visual-tests/matrix-test-helper';
import { testScreenshot } from '../../../utils/visual-tests/helpers/theme-utils';

fixture('Charts.ZoomingOnAreaSelection')
  .page('http://localhost:8080/')
  .before(async (ctx) => {
    ctx.initialWindowSize = [900, 600];
  });

runManualTest('Charts', 'ZoomingOnAreaSelection', ['jQuery', 'React', 'Vue', 'Angular'], (test) => {
  test('ZoomingOnAreaSelection. Drag', async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await t.drag($('.dxc-series circle').nth(7), 600, 200);
    await testScreenshot(t, takeScreenshot, 'zooming_by_selection.png');

    await t.click($('#reset-zoom'));
    await testScreenshot(t, takeScreenshot, 'reset_zooming_by_selection.png');

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  });
});
