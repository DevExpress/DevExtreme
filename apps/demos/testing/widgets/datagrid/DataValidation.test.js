import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { Selector as $ } from 'testcafe';
import { runManualTest } from '../../../utils/visual-tests/matrix-test-helper';

fixture('DataGrid.DataValidation')
  .page('http://localhost:8080/')
  .beforeEach(async (t) => {
    await t
      .resizeWindow(900, 600);
  });

runManualTest('DataGrid', 'DataValidation', ['jQuery', 'React', 'Vue', 'Angular'], (test) => {
  test('DataValidation', async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await t
      .click($('.dx-icon-edit-button-addrow'))
      .click($('.dx-icon-edit-button-addrow'))
      .click($('.dx-datagrid-save-button'));
    await takeScreenshot('datagrid_data_validation_2_desktop.png');

    await t.click($('.dx-datagrid-cancel-button'));
    await takeScreenshot('datagrid_data_validation_3_desktop.png');

    await t
      .click($('.dx-datagrid-rowsview').find('td').nth(3))
      .typeText(
        $('.dx-datagrid-rowsview')
          .find('td')
          .nth(3)
          .find('input')
          .nth(0),
        '12345', {
          replace: true,
        },
      ).click($('body'), {
        offsetX: 0,
        offsetY: 0,
      });
    await takeScreenshot('datagrid_data_validation_4_desktop.png');

    await t.click($('.dx-datagrid-rowsview').find('td').nth(3));
    await takeScreenshot('datagrid_data_validation_5_desktop.png');

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  });
});
