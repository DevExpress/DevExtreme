import { Selector } from 'testcafe';
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { runManualTest } from '../../../utils/visual-tests/matrix-test-helper';
import { testScreenshot } from '../../../utils/visual-tests/helpers/theme-utils';

fixture('Scheduler.ResolveTimeConflicts')
  .before(async (ctx) => {
    ctx.initialWindowSize = [900, 600];
  });

runManualTest('Scheduler', 'ResolveTimeConflicts', (test) => {
  test('AppointmentPopup in main group with conflict informer', async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await t
      .doubleClick(Selector('.dx-scheduler-appointment').withText('Approve Personal'))
      .click('.dx-scheduler-form-all-day-switch .dx-switch-container')
      .click(Selector('.dx-popup-title .dx-button').withText('Save'));

    await testScreenshot(t, takeScreenshot, 'scheduler_ResolveTimeConflicts_appointment-popup_main-group_conflict-informer.png');

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  });

  test('AppointmentPopup in recurrence group with conflict informer', async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await t
      .doubleClick(Selector('.dx-scheduler-appointment').withText('Approve Personal'))
      .click('.dx-scheduler-form-all-day-switch .dx-switch-container')
      .click('.dx-scheduler-form-repeat-editor .dx-selectbox')
      .click(Selector('.dx-selectbox-popup-wrapper .dx-list-item').withText('Daily'))
      .click(Selector('.dx-popup-title .dx-button').withText('Save'));

    await testScreenshot(t, takeScreenshot, 'scheduler_ResolveTimeConflicts_appointment-popup_recurrence-group_conflict-informer.png');

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  });
});
