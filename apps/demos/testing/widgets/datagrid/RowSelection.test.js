import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { Selector as $ } from 'testcafe';
import { runManualTest } from '../../../utils/visual-tests/matrix-test-helper';
import { testScreenshot } from '../../../utils/visual-tests/helpers/theme-utils';

fixture('DataGrid.RowSelection')
  .page('http://localhost:8080/')
  .beforeEach(async (t) => {
    await t
      .resizeWindow(900, 600);
  });

runManualTest('DataGrid', 'RowSelection', ['jQuery', 'React', 'Vue', 'Angular'], (test) => {
  test('RowSelection', async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await t.click($('.dx-datagrid-rowsview tr').nth(0));
    await testScreenshot(t, takeScreenshot, 'datagrid_row_selection_2_desktop.png');

    await t.click($('.dx-datagrid-rowsview tr').nth(2));
    await testScreenshot(t, takeScreenshot, 'datagrid_row_selection_3_desktop.png');

    await t
      .click($('.dx-datagrid-rowsview tr').nth(0), {
        modifiers: {
          ctrl: true,
        },
      });
    await testScreenshot(t, takeScreenshot, 'datagrid_row_selection_4_desktop.png');

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  });
});
