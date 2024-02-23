import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { Selector as $ } from 'testcafe';
import { runManualTest } from '../../../utils/visual-tests/matrix-test-helper';
import { testScreenshot } from '../../../utils/visual-tests/helpers/theme-utils';

fixture('DataGrid.GroupSummaries')
  .page('http://localhost:8080/')
  .beforeEach(async (t) => {
    await t
      .resizeWindow(900, 600);
  });

runManualTest('DataGrid', 'GroupSummaries', ['jQuery', 'React', 'Vue', 'Angular'], (test) => {
  test('GroupSummaries', async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await t
      .click($('.dx-page').nth(-1))
      .click('body', {
        offsetX: 0,
        offsetY: 0,
      });

    await testScreenshot(t, takeScreenshot, 'datagrid_group_summaries_2_desktop.png');

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  });
});
