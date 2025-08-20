import {
  describe, expect, it,
} from '@jest/globals';

import { createScheduler } from './__mock__/create_scheduler';
import { setupSchedulerTestEnvironment } from './__mock__/m_mock_scheduler';

describe('views', () => {
  it('should render appointment after view change (T1297019)', async () => {
    setupSchedulerTestEnvironment();
    const { container, scheduler } = await createScheduler({
      timeZone: 'Etc/UTC',
      dataSource: [{
        text: 'Appointment',
        startDate: new Date('2021-02-02T08:00:00.000Z'),
        endDate: new Date('2021-02-02T20:00:00.000Z'),
        allDay: true,
      }],
      views: [{
        type: 'day',
        allDayPanelMode: 'hidden',
      }, {
        allDayPanelMode: 'all',
        type: 'timelineDay',
      }],
      currentView: 'timelineDay',
      currentDate: new Date('2021-02-02T10:00:00.000Z'),
      startDayHour: 8,
      endDayHour: 20,
      showAllDayPanel: false,
      height: 730,
    });

    scheduler.option('currentView', 'day');
    await new Promise(process.nextTick);

    const appointment = container.querySelector('.dx-scheduler-appointment');
    expect(appointment !== null).toBe(true);
  });
});
