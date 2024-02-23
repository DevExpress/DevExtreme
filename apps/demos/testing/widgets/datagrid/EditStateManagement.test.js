import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { Selector as $ } from 'testcafe';
import { runManualTest } from '../../../utils/visual-tests/matrix-test-helper';
import { testScreenshot } from '../../../utils/visual-tests/helpers/theme-utils';

fixture('DataGrid.EditStateManagement')
  .page('http://localhost:8080/')
  .beforeEach(async (t) => {
    await t
      .resizeWindow(900, 600);
  });

runManualTest('DataGrid', 'EditStateManagement', ['jQuery', 'React', 'Vue', 'Angular'], (test) => {
  test('EditStateManagement - update row', async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    // edit row
    await t.click($('a').withText('Edit').nth(0));
    await testScreenshot(t, takeScreenshot, 'datagrid_edit_state_management_update_row_1_desktop.png');

    await t
      .typeText($('.dx-datagrid-rowsview').find('.dx-texteditor-input').nth(1), 'Russia', {
        replace: true,
      })
      .pressKey('tab');
    await testScreenshot(t, takeScreenshot, 'datagrid_edit_state_management_update_row_2_desktop.png');

    // cancel change
    await t
      .click($('a').withText('Cancel').nth(0));
    await testScreenshot(t, takeScreenshot, 'datagrid_edit_state_management_update_row_3_desktop.png');

    // edit row
    await t
      .click($('a').withText('Edit').nth(0))
      .typeText($('.dx-datagrid-rowsview').find('.dx-texteditor-input').nth(1), 'Russia', {
        replace: true,
      })
      .pressKey('tab');
    await testScreenshot(t, takeScreenshot, 'datagrid_edit_state_management_update_row_4_desktop.png');

    await t.click($('a').withText('Save').nth(0));
    await testScreenshot(t, takeScreenshot, 'datagrid_edit_state_management_update_row_5_desktop.png');

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  });
});

runManualTest('DataGrid', 'EditStateManagement', ['jQuery', 'React', 'Vue', 'Angular'], (test) => {
  test('EditStateManagement - insert row', async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await t
      .click($('.dx-icon-edit-button-addrow'));

    await testScreenshot(t, takeScreenshot, 'datagrid_edit_state_management_insert_row_1_desktop.png');

    await t
      .typeText($('.dx-datagrid-rowsview').find('.dx-texteditor-input').nth(4), '11/2/2020', {
        replace: true,
      })
      .pressKey('tab');

    await testScreenshot(t, takeScreenshot, 'datagrid_edit_state_management_insert_row_2_desktop.png');

    // cancel change
    await t
      .click($('a').withText('Cancel').nth(0));

    await testScreenshot(t, takeScreenshot, 'datagrid_edit_state_management_insert_row_3_desktop.png');

    // add and edit row
    await t
      .click($('.dx-icon-edit-button-addrow'))
      .typeText($('.dx-datagrid-rowsview').find('.dx-texteditor-input').nth(4), '11/2/2020', {
        replace: true,
      })
      .pressKey('tab');

    await testScreenshot(t, takeScreenshot, 'datagrid_edit_state_management_insert_row_4_desktop.png');

    await t
      .click($('a').withText('Save').nth(0));

    await testScreenshot(t, takeScreenshot, 'datagrid_edit_state_management_insert_row_5_desktop.png');

    // go to the last page to check the inserted row
    await t
      .click($('.dx-datagrid-pager').find('.dx-page').nth(-1))
      .drag($('.dx-scrollbar-vertical').find('.dx-scrollable-scroll'), 0, 100);

    await testScreenshot(t, takeScreenshot, 'datagrid_edit_state_management_insert_row_6_desktop.png');

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  });
});

runManualTest('DataGrid', 'EditStateManagement', ['jQuery', 'React', 'Vue', 'Angular'], (test) => {
  test('EditStateManagement - remove row', async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    // remove row
    const editLink = $('a', { timeout: 60000 }).withText('Delete').nth(0);
    await t.click(editLink);
    await testScreenshot(t, takeScreenshot, 'datagrid_edit_state_management_remove_row_1_desktop.png');

    await t.click($('.dx-dialog-button').withText('Yes').nth(0));
    await testScreenshot(t, takeScreenshot, 'datagrid_edit_state_management_remove_row_2_desktop.png');

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  });
});
