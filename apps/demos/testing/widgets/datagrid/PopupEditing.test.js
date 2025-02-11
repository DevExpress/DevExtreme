import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { Selector as $ } from 'testcafe';
import { runManualTest } from '../../../utils/visual-tests/matrix-test-helper';
import { testScreenshot } from '../../../utils/visual-tests/helpers/theme-utils';

fixture('DataGrid.PopupEditing')
  .page('http://localhost:8080/')
  .before(async (ctx) => {
    ctx.initialWindowSize = [900, 600];
  });

runManualTest('DataGrid', 'PopupEditing', ['jQuery', 'React', 'Vue', 'Angular'], (test) => {
  test('PopupEditing', async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await testScreenshot(t, takeScreenshot, 'datagrid_popup_editing_1_desktop.png');

    await t
      .click($('.dx-link-edit').nth(0))
      .wait(500);

    await testScreenshot(t, takeScreenshot, 'datagrid_popup_editing_2_desktop.png', '.dx-overlay-content');

    await t.scrollBy('.dx-popup-content .dx-scrollable-container', 0, 1000);

    await testScreenshot(t, takeScreenshot, 'datagrid_popup_editing_3_desktop.png', '.dx-overlay-content');

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  });
});
