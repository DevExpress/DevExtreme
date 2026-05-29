import { Selector } from 'testcafe';
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { runManualTest } from '../../../utils/visual-tests/matrix-test-helper';
import { testScreenshot } from '../../../utils/visual-tests/helpers/theme-utils';

fixture('Scheduler.IndividualViewsCustomization')
  .before(async (ctx) => {
    ctx.initialWindowSize = [900, 600];
  });

runManualTest('Scheduler', 'IndividualViewsCustomization', (test) => {
  test('AppointmentPopup', async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await t.doubleClick(Selector('.dx-scheduler-appointment').nth(0));

    await testScreenshot(t, takeScreenshot, 'scheduler_IndividualViewCustomization_appointment_popup-1.png');

    await t.scrollBy('.dx-scheduler-appointment-popup .dx-popup-content-scrollable', 0, 1000);

    await testScreenshot(t, takeScreenshot, 'scheduler_IndividualViewCustomization_appointment_popup-2.png');

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  });
});
