import Scheduler from '../../../../model/scheduler';
import { createScreenshotsComparer } from '../../../../helpers/screenshot-comparer';
import createWidget from '../../../../helpers/createWidget';
import url from '../../../../helpers/getPageUrl';

fixture`Layout:Appointments:visible`
  .page(url(__dirname, '../../../container.html'));

[1, 0].forEach((maxAppointmentsPerCell) => {
  [true, false, undefined].forEach((visible) => {
    test(`Appointments should be filtered by visible property(visible='${visible}', maxAppointmentsPerCell='${maxAppointmentsPerCell}'`, async (t) => {
      const scheduler = new Scheduler('#container');
      const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

      await t
        .expect(await takeScreenshot(`filtering-appointments-visible=${visible}-maxAppointmentsPerCell=${maxAppointmentsPerCell}.png`, scheduler.workSpace))
        .ok()

        .expect(compareResults.isValid())
        .ok(compareResults.errorMessages());
    }).before(async () => {
      await createWidget('dxScheduler', {
        dataSource: [{
          text: 'Recurrence app',
          roomId: [1],
          startDate: new Date(2021, 3, 13, 1, 30),
          endDate: new Date(2021, 3, 13, 2, 30),
          recurrenceRule: 'FREQ=DAILY',
          visible,
        }, {
          text: 'Simple app',
          roomId: [1],
          startDate: new Date(2021, 3, 12, 3),
          endDate: new Date(2021, 3, 12, 4),
          visible,
        }],
        views: [{
          type: 'week',
          name: 'Numeric Mode',
          maxAppointmentsPerCell,
        }],
        currentView: 'Numeric Mode',
        currentDate: new Date(2021, 3, 15),
        height: 600,
      });
    });
  });
});
