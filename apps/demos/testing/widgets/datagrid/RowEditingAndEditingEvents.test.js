import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { Selector as $ } from 'testcafe';
import { runManualTest } from '../../../utils/visual-tests/matrix-test-helper';
import { testScreenshot } from '../../../utils/visual-tests/helpers/theme-utils';

fixture('DataGrid.RowEditingAndEditingEvents')
  .page('http://localhost:8080/')
  .beforeEach(async (t) => {
    await t
      .resizeWindow(900, 600);
  });

runManualTest('DataGrid', 'RowEditingAndEditingEvents', ['jQuery', 'React', 'Vue', 'Angular'], (test) => {
  test('RowEditingAndEditingEvents', async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await t.click($('a').withText('Edit').nth(0));

    await testScreenshot(t, takeScreenshot, 'datagrid_row_editing_and_editing_events_2_desktop.png');

    await t
      .typeText(
        $('.dx-datagrid-rowsview').find('input').nth(1),
        'Bob',
        { replace: true },
      );

    await testScreenshot(t, takeScreenshot, 'datagrid_row_editing_and_editing_events_3_desktop.png');

    await t.click($('a').withText('Save').nth(0));

    await testScreenshot(t, takeScreenshot, 'datagrid_row_editing_and_editing_events_4_desktop.png');

    await t
      .click('#clear')
      .click('.dx-icon-edit-button-addrow');

    await testScreenshot(t, takeScreenshot, 'datagrid_row_editing_and_editing_events_5_desktop.png');

    await t
      .typeText(
        $('.dx-datagrid-rowsview').find('input').nth(1),
        'Bob',
        { replace: true },
      )
      .click($('a').withText('Save').nth(0));

    await testScreenshot(t, takeScreenshot, 'datagrid_row_editing_and_editing_events_6_desktop.png');

    await t
      .click('#clear')
      .click($('a').withText('Delete').nth(2));

    await testScreenshot(t, takeScreenshot, 'datagrid_row_editing_and_editing_events_7_desktop.png');

    await t.click($('.dx-dialog-buttons').find('.dx-dialog-button').nth(0));

    await testScreenshot(t, takeScreenshot, 'datagrid_row_editing_and_editing_events_8_desktop.png');

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  });
});
