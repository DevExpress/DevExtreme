import { expect, test } from '../../../../fixtures';
import { createWidget } from '../../../../helpers/createWidget';
import Scheduler from '../../../../models/scheduler';

const SCHEDULER_SELECTOR = '#container';
const CELL_WIDTH = 200;

test.describe('Appointments in TimelineWorkWeek', () => {
  test('Appointments should have correct width', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      currentDate: new Date(2024, 0, 29),
      dataSource: [
        {
          text: 'appt-01',
          startDate: new Date(2024, 1, 1, 13, 0),
          endDate: new Date(2024, 1, 6, 14, 0),
        },

        {
          text: 'appt-02',
          startDate: new Date(2024, 1, 1, 13, 0),
          endDate: new Date(2024, 1, 4, 14, 0),
        },
        {
          text: 'appt-03',
          startDate: new Date(2024, 1, 1, 13, 0),
          endDate: new Date(2024, 1, 6, 10, 0),
        },
        {
          text: 'appt-04',
          startDate: new Date(2024, 1, 1, 13, 0),
          endDate: new Date(2024, 1, 6, 18, 0),
        },
        {
          text: 'appt-05',
          startDate: new Date(2024, 1, 1, 13, 0),
          endDate: new Date(2024, 1, 3, 10, 0),
        },
        {
          text: 'appt-06',
          startDate: new Date(2024, 1, 1, 13, 0),
          endDate: new Date(2024, 1, 3, 18, 0),
        },

        {
          text: 'appt-07',
          startDate: new Date(2024, 1, 4, 13, 0),
          endDate: new Date(2024, 1, 6, 14, 0),
        },
        {
          text: 'appt-08',
          startDate: new Date(2024, 1, 1, 10, 0),
          endDate: new Date(2024, 1, 6, 14, 0),
        },
        {
          text: 'appt-09',
          startDate: new Date(2024, 1, 1, 19, 0),
          endDate: new Date(2024, 1, 6, 14, 0),
        },
        {
          text: 'appt-10',
          startDate: new Date(2024, 1, 4, 10, 0),
          endDate: new Date(2024, 1, 6, 14, 0),
        },
        {
          text: 'appt-11',
          startDate: new Date(2024, 1, 4, 17, 0),
          endDate: new Date(2024, 1, 6, 14, 0),
        },
      ],
      views: [{
        type: 'timelineWorkWeek',
        intervalCount: 2,
        maxAppointmentsPerCell: 'unlimited',
      }],
      currentView: 'timelineWorkWeek',
      startDayHour: 12,
      endDayHour: 16,
      cellDuration: 60,
    });

    const scheduler = new Scheduler(page, SCHEDULER_SELECTOR);

    await expect(scheduler.getAppointment('appt-01').element)
      .toHaveCSS('width', `${CELL_WIDTH * (3 + 4 * 2 + 2)}px`);

    await expect(scheduler.getAppointment('appt-02').element)
      .toHaveCSS('width', `${CELL_WIDTH * (3 + 4)}px`);

    await expect(scheduler.getAppointment('appt-03').element)
      .toHaveCSS('width', `${CELL_WIDTH * (3 + 4 * 2)}px`);

    await expect(scheduler.getAppointment('appt-04').element)
      .toHaveCSS('width', `${CELL_WIDTH * (3 + 4 * 3)}px`);

    await expect(scheduler.getAppointment('appt-05').element)
      .toHaveCSS('width', `${CELL_WIDTH * (3 + 4)}px`);

    await expect(scheduler.getAppointment('appt-06').element)
      .toHaveCSS('width', `${CELL_WIDTH * (3 + 4)}px`);

    await expect(scheduler.getAppointment('appt-07').element)
      .toHaveCSS('width', `${CELL_WIDTH * (4 + 2)}px`);

    await expect(scheduler.getAppointment('appt-08').element)
      .toHaveCSS('width', `${CELL_WIDTH * (4 * 3 + 2)}px`);

    await expect(scheduler.getAppointment('appt-09').element)
      .toHaveCSS('width', `${CELL_WIDTH * (4 * 2 + 2)}px`);

    await expect(scheduler.getAppointment('appt-10').element)
      .toHaveCSS('width', `${CELL_WIDTH * (4 + 2)}px`);

    await expect(scheduler.getAppointment('appt-11').element)
      .toHaveCSS('width', `${CELL_WIDTH * (4 + 2)}px`);
  });
});
