import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { ClientFunction } from 'testcafe';
import { runManualTest } from '../../../utils/visual-tests/matrix-test-helper';
import { testScreenshot } from '../../../utils/visual-tests/helpers/theme-utils';

const resetScroll = ClientFunction(() => window.scrollTo(0, 0));

fixture('Scheduler.Overview')
  .page('http://localhost:8080/')
  .before(async (ctx) => {
    ctx.initialWindowSize = [900, 600];
  });

runManualTest('Scheduler', 'Overview', ['jQuery', 'React'], (test) => {
  test('Overview cell selection (T1041269)', async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await t.click('.dx-scheduler-date-table-cell');
    await resetScroll();

    await testScreenshot(t, takeScreenshot, 'scheduler_overview_selection.png');

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  });
});
