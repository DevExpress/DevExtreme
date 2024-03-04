import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { Selector as $ } from 'testcafe';
import { runManualTest } from '../../../utils/visual-tests/matrix-test-helper';
import { testScreenshot } from '../../../utils/visual-tests/helpers/theme-utils';

fixture('Charts.ZoomingAndScrollingAPI')
  .page('http://localhost:8080/')
  .before(async (ctx) => {
    ctx.initialWindowSize = [900, 600];
  });

runManualTest('Charts', 'ZoomingAndScrollingAPI', ['jQuery', 'React', 'Vue', 'Angular'], (test) => {
  test('ZoomingAndScrollingAPI. RangeSelector drag', async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await t.drag($('.slider').nth(0), 500, 0, { offsetX: 10, offsetY: 10 });
    await t.wait(1000);
    await testScreenshot(t, takeScreenshot, 'range_selector_slider_drag.png');

    await t.click($('.area-tracker'), { offsetX: 400 });
    await t.wait(1000);
    await testScreenshot(t, takeScreenshot, 'range_selector_click_to_empty_place.png');

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  });
});
