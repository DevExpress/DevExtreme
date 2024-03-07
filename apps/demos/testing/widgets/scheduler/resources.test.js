import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { runManualTest } from '../../../utils/visual-tests/matrix-test-helper';

fixture('Scheduler.Templates')
  .page('http://localhost:8080/')
  .beforeEach(async (t) => {
    await t
      .resizeWindow(900, 600);
  });

runManualTest('Scheduler', 'Resources', ['jQuery', 'React', 'Vue', 'Angular'], (test) => {
  test('Resource fields shouldn\'t empty', async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await t.doubleClick('.dx-scheduler-appointment');

    await takeScreenshot('scheduler_resources_appointment_popup.png');

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  });
});
