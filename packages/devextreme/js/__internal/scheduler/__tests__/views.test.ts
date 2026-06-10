import {
  describe, expect, it,
} from '@jest/globals';

import { createScheduler } from './__mock__/create_scheduler';
import { setupSchedulerTestEnvironment } from './__mock__/mock_scheduler';

describe('views', () => {
  it('should render appointment after view change (T1297019)', async () => {
    setupSchedulerTestEnvironment();
    const { POM, scheduler } = await createScheduler({
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

    const appointment = POM.getAppointment();
    expect(appointment.element !== null).toBe(true);
  });

  it('should render all-day appointment correctly with fractional cell values', async () => {
    const FRACTIONAL_CELL_WIDTH = 250.4;
    setupSchedulerTestEnvironment({ width: FRACTIONAL_CELL_WIDTH });
    const { container } = await createScheduler({
      dataSource: [{
        text: 'Appointment 2',
        startDate: new Date('2021-02-02T15:15:00.000Z'),
        endDate: new Date('2021-02-02T17:45:00.000Z'),
        allDay: true,
        resourceId: 1,
      }],
      currentDate: new Date(2021, 1, 2),
      startDayHour: 8,
      endDayHour: 20,
      allDayPanelMode: 'hidden',
      groups: ['resourceId'],
      resources: [{
        label: 'User',
        dataSource: [
          { title: 'Mark', id: 1 },
          { title: 'Luke', id: 2 },
        ],
        displayExpr: 'title',
        fieldExpr: 'resourceId',
        valueExpr: 'id',
      }],
    });

    const appointments = container.querySelectorAll('.dx-item.dx-scheduler-appointment');
    expect(appointments.length).toBe(1);
  });
});
