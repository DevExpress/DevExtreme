import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { Selector as $ } from 'testcafe';
import { runManualTest } from '../../../utils/visual-tests/matrix-test-helper';

fixture('Charts.ZoomingOnAreaSelection')
  .page('http://localhost:8080/')
  .beforeEach(async (t) => {
    await t
      .resizeWindow(900, 600);
  });

runManualTest('Charts', 'ZoomingOnAreaSelection', ['jQuery', 'React', 'Vue', 'Angular'], (test) => {
  test('ZoomingOnAreaSelection. Drag', async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await t.drag($('.dxc-series circle').nth(7), 600, 200);
    await takeScreenshot('zooming_by_selection.png');

    await t.click($('#reset-zoom'));
    await takeScreenshot('reset_zooming_by_selection.png');

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  });
});
