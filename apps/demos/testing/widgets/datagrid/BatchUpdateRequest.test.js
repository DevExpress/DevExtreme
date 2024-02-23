import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { Selector as $ } from 'testcafe';
import { runManualTest } from '../../../utils/visual-tests/matrix-test-helper';
import { testScreenshot } from '../../../utils/visual-tests/helpers/theme-utils';

fixture('DataGrid.BatchUpdateRequest')
  .page('http://localhost:8080/')
  .beforeEach(async (t) => {
    await t
      .resizeWindow(900, 600);
  });

runManualTest('DataGrid', 'BatchUpdateRequest', ['jQuery', 'React', 'Vue', 'Angular'], (test) => {
  test('BatchUpdateRequest', async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    // update
    await t
      .click($('.dx-datagrid-rowsview td').nth(2))
      .typeText($('.dx-datagrid-rowsview').find('.dx-texteditor-input').nth(0), 'Russia', {
        replace: true,
      })
      .pressKey('enter');

    // remove
    await t.click($('a').withText('Delete').nth(1));

    // insert
    await t
      .click($('.dx-icon-edit-button-addrow'))
      .click($('.dx-datagrid-rowsview td').nth(5))
      .typeText($('.dx-datagrid-rowsview').find('.dx-texteditor-input').nth(0), '11/2/2020', {
        replace: true,
      })
      .pressKey('enter');

    await testScreenshot(t, takeScreenshot, 'datagrid_batch_update_request_1_desktop.png');

    // save changes
    await t.click($('.dx-datagrid-save-button'));
    await testScreenshot(t, takeScreenshot, 'datagrid_batch_update_request_2_desktop.png');

    // go to the last page to check the inserted row
    await t
      .click($('.dx-datagrid-pager').find('.dx-page').nth(-1))
      .drag($('.dx-scrollbar-vertical').find('.dx-scrollable-scroll'), 0, 100);

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  });
});
