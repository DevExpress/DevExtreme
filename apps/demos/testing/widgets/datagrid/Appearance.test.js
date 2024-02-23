import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { Selector as $ } from 'testcafe';
import { runManualTest } from '../../../utils/visual-tests/matrix-test-helper';
import { testScreenshot } from '../../../utils/visual-tests/helpers/theme-utils';

fixture('DataGrid.Appearance')
  .page('http://localhost:8080/')
  .beforeEach(async (t) => {
    await t
      .resizeWindow(900, 600);
  });

runManualTest('DataGrid', 'Appearance', ['jQuery', 'React', 'Vue', 'Angular'], (test) => {
  test('Appearance', async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await t.click($('.dx-checkbox-icon').nth(0));
    await testScreenshot(t, takeScreenshot, 'datagrid_appearance_2_desktop.png');

    await t.click($('.dx-checkbox-icon').nth(1));
    await testScreenshot(t, takeScreenshot, 'datagrid_appearance_3_desktop.png');

    await t.click($('.dx-checkbox-icon').nth(3));
    await testScreenshot(t, takeScreenshot, 'datagrid_appearance_4_desktop.png');

    await t.click($('.dx-checkbox-icon').nth(0));
    await testScreenshot(t, takeScreenshot, 'datagrid_appearance_5_desktop.png');

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  });
});
