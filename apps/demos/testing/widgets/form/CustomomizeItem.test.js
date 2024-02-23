import { Selector as $ } from 'testcafe';
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { runManualTest } from '../../../utils/visual-tests/matrix-test-helper';
import { testScreenshot } from '../../../utils/visual-tests/helpers/theme-utils';

fixture('Form.CustomizeItem')
  .page('http://localhost:8080/')
  .beforeEach(async (t) => {
    await t
      .resizeWindow(900, 600);
  });

runManualTest('Form', 'CustomizeItem', ['jQuery', 'Vue', 'Angular'], (test) => {
  test('CustomizeItem', async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await t.hover($('#helpedInfo'));
    await testScreenshot(t, takeScreenshot, 'form_customize_item_label_tooltip.png', '.dx-form');

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  });
});
