import { test } from '../../../../fixtures';
import { createWidget } from '../../../../helpers/createWidget';
import { testScreenshot } from '../../../../helpers/screenshots';
import Scheduler from '../../../../models/scheduler';

const SCHEDULER_SELECTOR = '#container';

[
  0,
  -240,
  240,
].forEach((offset) => {
  test(`Agenda view should not be affected by root offset option (offset: ${offset})`, async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      dataSource: [
        {
          startDate: '2023-09-04T00:00:00',
          endDate: '2023-09-04T02:00:00',
          text: '#0 04: 00 -> 02',
        },
        {
          startDate: '2023-09-04T10:00:00',
          endDate: '2023-09-04T12:00:00',
          text: '#1 04: 10 -> 12',
        },
        {
          startDate: '2023-09-04T23:00:00',
          endDate: '2023-09-05T01:00:00',
          text: '#2 04: 22 -> 01',
        },
      ],
      currentView: 'agenda',
      currentDate: '2023-09-03',
      height: 800,
      offset,
    });

    const scheduler = new Scheduler(page, SCHEDULER_SELECTOR);

    await testScreenshot(
      page,
      `offset_agenda-not-affected_offset-${offset}.png`,
      { element: scheduler.workSpace },
    );
  });
});
