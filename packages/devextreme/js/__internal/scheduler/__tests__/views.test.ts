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

  it('should not render all-day appointment in wrong resource (T1297021)', async () => {
    setupSchedulerTestEnvironment({ width: 250.4 });
    const { container, scheduler } = await createScheduler({
      timeZone: 'Etc/UTC',
      dataSource: [{
        text: 'Appointment 2',
        startDate: new Date('2021-02-02T15:15:00.000Z'),
        endDate: new Date('2021-02-02T17:45:00.000Z'),
        allDay: true,
        id: 2,
        resourceId: 2,
      }],
      views: ['day'],
      currentView: 'day',
      currentDate: new Date(2021, 1, 2),
      startDayHour: 8,
      endDayHour: 20,
      showAllDayPanel: false,
      allDayPanelMode: 'hidden',
      groups: ['resourceId'],
      height: 900,
      width: 1500,
      resources: [{
        label: 'User',
        dataSource: [
          { title: 'John', id: 1 },
          { title: 'Mark', id: 2 },
          { title: 'Luke', id: 3 },
        ],
        displayExpr: 'title',
        fieldExpr: 'resourceId',
        valueExpr: 'id',
      }],
    });

    scheduler.option('width', 800);
    scheduler.option('width', 730);

    const appointments = container.querySelectorAll('.dx-item.dx-scheduler-appointment');
    expect(appointments.length).toBe(1);
  });
});
