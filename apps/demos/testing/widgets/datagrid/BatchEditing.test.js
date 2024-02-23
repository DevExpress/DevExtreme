import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { Selector as $ } from 'testcafe';
import { runManualTest } from '../../../utils/visual-tests/matrix-test-helper';
import { testScreenshot } from '../../../utils/visual-tests/helpers/theme-utils';

fixture('DataGrid.BatchEditing')
  .page('http://localhost:8080/')
  .beforeEach(async (t) => {
    await t
      .resizeWindow(900, 600);
  });

runManualTest('DataGrid', 'BatchEditing', ['jQuery', 'React', 'Vue', 'Angular'], (test) => {
  test('BatchEditing', async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await t.click($('.dx-datagrid-rowsview').find('td').nth(1));
    await testScreenshot(t, takeScreenshot, 'datagrid_batch_editing_2_desktop.png');

    await t
      .typeText($('.dx-datagrid-rowsview').find('input').nth(0), 'Bob', {
        replace: true,
      })
      .pressKey('enter');
    await testScreenshot(t, takeScreenshot, 'datagrid_batch_editing_3_desktop.png');

    await t.click('.dx-icon-edit-button-save');
    await testScreenshot(t, takeScreenshot, 'datagrid_batch_editing_4_desktop.png');

    await t
      .click($('.dx-datagrid-rowsview').find('td').nth(4))
      .click($('.dx-dropdowneditor-icon').nth(0))
      .click($('.dx-list-item').nth(0))
      .click('body', {
        offsetX: 0,
        offsetY: 0,
      });
    await testScreenshot(t, takeScreenshot, 'datagrid_batch_editing_5_desktop.png');

    await t.click('.dx-icon-edit-button-cancel');
    await testScreenshot(t, takeScreenshot, 'datagrid_batch_editing_6_desktop.png');

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  });
});
