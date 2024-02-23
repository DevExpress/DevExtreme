import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { Selector as $ } from 'testcafe';
import { runManualTest } from '../../../utils/visual-tests/matrix-test-helper';
import { testScreenshot } from '../../../utils/visual-tests/helpers/theme-utils';

fixture('DataGrid.MultipleSorting')
  .page('http://localhost:8080/')
  .beforeEach(async (t) => {
    await t
      .resizeWindow(900, 600);
  });

runManualTest('DataGrid', 'MultipleSorting', ['jQuery', 'React', 'Vue', 'Angular'], (test) => {
  test('MultipleSorting', async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await t
      .click($('.dx-datagrid-headers .dx-datagrid-action').nth(3), {
        modifiers: {
          shift: true,
        },
      })
      .click($('.dx-datagrid-headers .dx-datagrid-action').nth(4), {
        modifiers: {
          shift: true,
        },
      });

    await testScreenshot(t, takeScreenshot, 'datagrid_multiple_sorting_2_desktop.png');

    await t
      .click($('.dx-datagrid-headers .dx-datagrid-action').nth(5));

    await testScreenshot(t, takeScreenshot, 'datagrid_multiple_sorting_3_desktop.png');

    await t
      .click($('.dx-datagrid-headers .dx-datagrid-action').nth(5), {
        modifiers: {
          ctrl: true,
        },
      });

    await testScreenshot(t, takeScreenshot, 'datagrid_multiple_sorting_4_desktop.png');

    await t
      .rightClick($('.dx-header-row .dx-datagrid-action').nth(0));

    await testScreenshot(t, takeScreenshot, 'datagrid_multiple_sorting_5_desktop.png');

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  });
});
