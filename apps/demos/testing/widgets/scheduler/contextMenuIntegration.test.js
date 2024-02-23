import { Selector } from 'testcafe';
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { runManualTest } from '../../../utils/visual-tests/matrix-test-helper';
import { testScreenshot } from '../../../utils/visual-tests/helpers/theme-utils';

fixture('Scheduler.ContextMenuIntegration')
  .page('http://localhost:8080/')
  .beforeEach(async (t) => {
    await t
      .resizeWindow(900, 600);
  });

runManualTest('Scheduler', 'ContextMenuIntegration', 'jQuery', (test) => {
  test('ContextMenuIntegration', async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await testScreenshot(t, takeScreenshot, 'scheduler_contextMenu_init.png');

    await t
      .rightClick('.dx-scheduler-appointment');
    await testScreenshot(t, takeScreenshot, 'scheduler_contextMenu_click.png');

    await t
      .rightClick(Selector('.dx-scheduler-date-table-cell').nth(6));
    await testScreenshot(t, takeScreenshot, 'scheduler_contextMenu_cell_click.png');

    await t
      .rightClick(Selector('.dx-scheduler-header-panel-cell').nth(2));
    await testScreenshot(t, takeScreenshot, 'scheduler_contextMenu_header_click.png');

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  });
});
