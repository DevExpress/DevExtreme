import { Selector as $ } from 'testcafe';
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { runManualTest } from '../../../utils/visual-tests/matrix-test-helper';
import { testScreenshot } from '../../../utils/visual-tests/helpers/theme-utils';

fixture('Form.ItemCustomization')
  .before(async (ctx) => {
    ctx.initialWindowSize = [900, 800];
  });

runManualTest('Form', 'ItemCustomization', (test) => {
  test('ItemCustomization', async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await t.hover($('#helpedInfo'), {
      offsetX: -1,
      offsetY: -1,
    });

    await testScreenshot(t, takeScreenshot, 'form_customize_item_label_tooltip.png', '.dx-form');

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  });
});
