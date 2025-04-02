import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { Selector as $ } from 'testcafe';
import { runManualTest } from '../../../utils/visual-tests/matrix-test-helper';
import { testScreenshot } from '../../../utils/visual-tests/helpers/theme-utils';

fixture('Charts.CustomAnnotations')
  .before(async (ctx) => {
    ctx.initialWindowSize = [900, 600];
  });

runManualTest('Charts', 'CustomAnnotations', (test) => {
  test('CustomAnnotations. Drag', async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await t.drag($('#chart .dxc-annotations g').nth(0), 90, 40);
    await testScreenshot(t, takeScreenshot, 'annotations_drag.png');

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  });
});
