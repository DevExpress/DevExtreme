import { test } from '../../../../../fixtures';
import { createWidget } from '../../../../../helpers/createWidget';
import { testScreenshot } from '../../../../../helpers/screenshots';
import Scheduler from '../../../../../models/scheduler';

[1, 0].forEach((maxAppointmentsPerCell) => {
  [true, false, undefined].forEach((visible) => {
    test(`Appointments should be filtered by visible property(visible='${visible}', maxAppointmentsPerCell='${maxAppointmentsPerCell}'`, async ({ page }) => {
      await createWidget(page, 'dxScheduler', {
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

      const scheduler = new Scheduler(page, '#container');

      await testScreenshot(
        page,
        `filtering-visible=${visible}-maxAppointmentsPerCell=${maxAppointmentsPerCell}.png`,
        { element: scheduler.workSpace },
      );
    });
  });
});
