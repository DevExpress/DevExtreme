import { Selector as $ } from 'testcafe';
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { runManualTest } from '../../../utils/visual-tests/matrix-test-helper';
import { testScreenshot } from '../../../utils/visual-tests/helpers/theme-utils';

const OPTION_CLASS = 'option';
const SELECTBOX_CLASS = 'dx-selectbox';

fixture('TreeView.ItemSelectionAndCustomization')
  .page('http://localhost:8080/')
  .beforeEach(async (t) => {
    await t
      .resizeWindow(900, 1200);
  });

runManualTest('TreeView', 'ItemSelectionAndCustomization', ['jQuery', 'React', 'Vue', 'Angular'], (test) => {
  test('ItemSelectionAndCustomization', async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await t
      .click($(`.${OPTION_CLASS} .${SELECTBOX_CLASS}`).nth(0))
      .wait(200);

    await testScreenshot(t, takeScreenshot, 'treeview_selection_field_is_open.png');

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  });
});
