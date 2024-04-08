import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import Scheduler from 'devextreme-testcafe-models/scheduler';
import { createWidget } from '../../../../helpers/createWidget';
import url from '../../../../helpers/getPageUrl';
import { changeTheme } from '../../../../helpers/changeTheme';

fixture.disablePageReloads`AppointmentForm screenshot tests`
  .page(url(__dirname, '../../../container.html'));

['generic.light', 'material.blue.light', 'fluent.blue.light'].forEach((theme) => {
  ['day', 'week', 'workWeek', 'month', 'timelineDay', 'timelineWeek', 'timelineWorkWeek', 'timelineMonth', 'agenda'].forEach((currentView) => {
    [true, false].forEach((rtlEnabled) => {
      test('Appointemt form tests', async (t) => {
        const scheduler = new Scheduler('#container');
        const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

        await t
          .expect(await takeScreenshot(`recurrent-appointment-in-${currentView}_view-and-${rtlEnabled ? 'rtl' : 'non-rtl'}_mode-${theme}.png`, scheduler.element))
          .ok()

          .expect(compareResults.isValid())
          .ok(compareResults.errorMessages());
      }).before(async () => {
        await changeTheme(theme);
        await createWidget('dxScheduler', {
          dataSource: [{
            text: 'Long Long Long Long Long Long Long Long Long Description',
            startDate: new Date(2021, 0, 1, 1, 30),
            endDate: new Date(2021, 0, 1, 3, 0),
            recurrenceRule: 'FREQ=DAILY;COUNT=30',
          }],
          currentDate: new Date(2021, 0, 4),
          height: 600,
          currentView,
          rtlEnabled,
        });
      }).after(async () => {
        await changeTheme('generic.light');
      });
    });
  });
});
