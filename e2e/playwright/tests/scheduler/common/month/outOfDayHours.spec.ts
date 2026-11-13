import { expect, test } from '../../../../fixtures';
import { createWidget } from '../../../../helpers/createWidget';
import Scheduler from '../../../../models/scheduler';

const SCHEDULER_SELECTOR = '#container';

test.describe('Scheduler: take into account start and end day hour', () => {
  test('Should show appointment in month view', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      dataSource: [
        {
          startDate: '2024-01-01T11:00:00',
          endDate: '2024-01-01T12:00:00',
          text: 'test',
        },
      ],
      startDayHour: 11,
      endDayHour: 22,
      currentDate: '2024-01-01',
      views: [
        'month',
        'timelineMonth',
      ],
      currentView: 'month',
    });

    const scheduler = new Scheduler(page, SCHEDULER_SELECTOR);
    await expect(scheduler.getAppointment('test').element).toBeAttached();
  });

  test('Shouldn\'t show appointment in month view', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      dataSource: [
        {
          startDate: '2024-01-01T11:00:00',
          endDate: '2024-01-01T12:00:00',
          text: 'test',
        },
      ],
      startDayHour: 13,
      endDayHour: 22,
      currentDate: '2024-01-01',
      views: [
        'month',
        'timelineMonth',
      ],
      currentView: 'month',
    });

    const scheduler = new Scheduler(page, SCHEDULER_SELECTOR);
    await expect(scheduler.getAppointment('test').element).toHaveCount(0);
  });
});
