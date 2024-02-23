import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { Selector as $ } from 'testcafe';
import { runManualTest } from '../../../utils/visual-tests/matrix-test-helper';
import { testScreenshot } from '../../../utils/visual-tests/helpers/theme-utils';

fixture('DataGrid.CellEditingAndEditingAPI')
  .page('http://localhost:8080/')
  .beforeEach(async (t) => {
    await t
      .resizeWindow(900, 600);
  });

runManualTest('DataGrid', 'CellEditingAndEditingAPI', ['jQuery', 'React', 'Vue', 'Angular'], (test) => {
  test('CellEditingAndEditingAPI', async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await t.click($('.dx-datagrid-rowsview').find('td').nth(2));
    await testScreenshot(t, takeScreenshot, 'datagrid_cell_editing_2_desktop.png');

    await t
      .typeText(
        $('.dx-datagrid-rowsview').find('td').nth(2).find('input')
          .nth(0),
        'Bob',
        { replace: true },
      )
      .click($('body'), {
        offsetX: 0,
        offsetY: 0,
      });
    await testScreenshot(t, takeScreenshot, 'datagrid_cell_editing_3_desktop.png');

    await t
      .hover($('td.dx-command-select').nth(2))
      .click($('.dx-checkbox-icon').nth(2))
      .hover($('td.dx-command-select').nth(4))
      .click($('.dx-checkbox-icon').nth(4))
      .hover($('td.dx-command-select').nth(5))
      .click($('.dx-checkbox-icon').nth(5));
    await testScreenshot(t, takeScreenshot, 'datagrid_cell_editing_4_desktop.png');

    await t.click($('.dx-button').withText('Delete Selected Records'));
    await testScreenshot(t, takeScreenshot, 'datagrid_cell_editing_5_desktop.png');

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  });
});
