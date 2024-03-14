import { Selector as $ } from 'testcafe';
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { runManualTest } from '../../../utils/visual-tests/matrix-test-helper';
import { testScreenshot } from '../../../utils/visual-tests/helpers/theme-utils';

fixture('Scheduler.CellTemplates')
  .page('http://localhost:8080/')
  .before(async (ctx) => {
    ctx.initialWindowSize = [900, 600];
  });

runManualTest('Scheduler', 'CellTemplates', ['jQuery', 'React', 'Vue', 'Angular'], (test) => {
  test('CellTemplates', async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await t
      .click($('.dx-widget').withAttribute('aria-label', 'Month'))
      .expect(
        await testScreenshot(t, takeScreenshot, 'scheduler_CellTemplates_month_view.png'),
      ).ok();

    await t.expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  });

  test('Cell templates should not render twice after view dates were changed (T1180373)', async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await t.click('.dx-scheduler-navigator-next');

    await testScreenshot(t, takeScreenshot, 'scheduler_CellTemplates_view_dates_changed.png');

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  });
});
