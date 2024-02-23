import { Selector as $ } from 'testcafe';
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { runManualTest } from '../../../utils/visual-tests/matrix-test-helper';
import { testScreenshot } from '../../../utils/visual-tests/helpers/theme-utils';

const FIELD_BUTTON_ITEM_CLASS = '.dx-field-button-item';
const CHECKBOX_CLASS = '.dx-checkbox';

fixture('Form.Validation')
  .page('http://localhost:8080/')
  .beforeEach(async (t) => {
    await t
      .resizeWindow(900, 1200);
  });

runManualTest('Form', 'Validation', ['jQuery', 'Vue', 'Angular'], (test) => {
  test('Validation', async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await testScreenshot(t, takeScreenshot, 'form_validation_summary.png');

    await t.click($(FIELD_BUTTON_ITEM_CLASS).nth(1));
    await testScreenshot(t, takeScreenshot, 'form_validation_before_reset.png');

    await t.click(CHECKBOX_CLASS);
    await t.click($(FIELD_BUTTON_ITEM_CLASS).nth(0));
    await testScreenshot(t, takeScreenshot, 'form_validation_after_reset.png');

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  });
});
