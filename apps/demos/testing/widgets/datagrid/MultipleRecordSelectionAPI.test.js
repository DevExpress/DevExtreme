import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { Selector as $ } from 'testcafe';
import { runManualTest } from '../../../utils/visual-tests/matrix-test-helper';
import { testScreenshot } from '../../../utils/visual-tests/helpers/theme-utils';

fixture('DataGrid.MultipleRecordSelectionAPI')
  .page('http://localhost:8080/')
  .beforeEach(async (t) => {
    await t
      .resizeWindow(900, 600);
  });

runManualTest('DataGrid', 'MultipleRecordSelectionAPI', ['jQuery', 'React', 'Vue', 'Angular'], (test) => {
  test('MultipleRecordSelectionAPI', async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await t
      .click($('.dx-selectbox-container').nth(0))
      .click($('.dx-list-item').nth(2))
      .click($('body'), {
        offsetX: 0,
        offsetY: 0,
      });

    await testScreenshot(t, takeScreenshot, 'datagrid_multiple_record_selection_and_API_2_desktop.png');

    await t
      .click($('.dx-button-text').withText('Clear Selection'));

    await testScreenshot(t, takeScreenshot, 'datagrid_multiple_record_selection_and_API_3_desktop.png');

    await t
      .click($('.dx-checkbox-icon').nth(0));

    await testScreenshot(t, takeScreenshot, 'datagrid_multiple_record_selection_and_API_4_desktop.png');

    await t
      .click($('.dx-checkbox-icon').nth(0));

    await testScreenshot(t, takeScreenshot, 'datagrid_multiple_record_selection_and_API_5_desktop.png');

    await t
      .click($('.dx-datagrid-rowsview tr').nth(1));

    await testScreenshot(t, takeScreenshot, 'datagrid_multiple_record_selection_and_API_6_desktop.png');

    await t
      .click($('.dx-datagrid-rowsview tr').nth(6), {
        modifiers: {
          shift: true,
        },
      });

    await testScreenshot(t, takeScreenshot, 'datagrid_multiple_record_selection_and_API_7_desktop.png');

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  });
});
