import {
  describe, expect, it,
} from '@jest/globals';

import { createScheduler } from './__mock__/create_scheduler';
import { setupSchedulerTestEnvironment } from './__mock__/mock_scheduler';

describe('agenda', () => {
  it('should render appointment', async () => {
    setupSchedulerTestEnvironment();
    const { POM } = await createScheduler({
      dataSource: [{
        text: 'Appointment',
        startDate: new Date('2021-02-02T08:00:00.000Z'),
        endDate: new Date('2021-02-02T20:00:00.000Z'),
      }],
      currentView: 'agenda',
      currentDate: new Date('2021-02-02T10:00:00.000Z'),
      startDayHour: 8,
      endDayHour: 20,
    });

    const appointment = POM.getAppointment();
    expect(appointment !== null).toBe(true);
  });

  it('should remove correct occurrence of recurrence appointment', async () => {
    setupSchedulerTestEnvironment();
    const { POM, keydown } = await createScheduler({
      dataSource: [{
        text: 'Appointment',
        startDate: new Date('2021-02-02T08:00:00.000Z'),
        endDate: new Date('2021-02-02T20:00:00.000Z'),
        recurrenceRule: 'FREQ=DAILY',
      }],
      currentView: 'agenda',
      currentDate: new Date('2021-02-02T10:00:00.000Z'),
      startDayHour: 8,
      endDayHour: 20,
      recurrenceEditMode: 'occurrence',
    });

    const appointments = POM.getAppointments();
    expect(appointments.length).toBe(7);
    expect(POM.getTimePanelContent()).toMatchSnapshot();

    const appointment = appointments[1].element;
    keydown(appointment, 'Delete');

    expect(POM.getAppointments().length).toBe(6);
    expect(POM.getTimePanelContent()).toMatchSnapshot();
  });

  it('should correct render grouped appointments', async () => {
    setupSchedulerTestEnvironment();
    const { POM } = await createScheduler({
      dataSource: [{
        text: 'Appointment 1',
        startDate: new Date('2021-02-02T08:00:00.000Z'),
        endDate: new Date('2021-02-02T20:00:00.000Z'),
        priorityId: 0,
      }, {
        text: 'Appointment 1',
        startDate: new Date('2021-02-03T08:00:00.000Z'),
        endDate: new Date('2021-02-03T20:00:00.000Z'),
        priorityId: 0,
      }, {
        text: 'Appointment 2',
        startDate: new Date('2021-02-02T08:00:00.000Z'),
        endDate: new Date('2021-02-02T20:00:00.000Z'),
        priorityId: 1,
      }],
      groups: ['priorityId'],
      resources: [{
        fieldExpr: 'priorityId',
        dataSource: [
          { id: 0, text: 'Low Priority', color: '#24ff50' },
          { id: 1, text: 'High Priority', color: '#ff9747' },
        ],
        label: 'Priority',
      }],
      currentView: 'agenda',
      currentDate: new Date('2021-02-02T10:00:00.000Z'),
    });

    expect(POM.getAppointments().length).toBe(3);
    expect(POM.getGroupTableContent()).toMatchSnapshot();
    expect(POM.getTimePanelContent()).toMatchSnapshot();
  });

  it('should correct render grouped appointments with emptiness between dates', async () => {
    setupSchedulerTestEnvironment();
    const { POM } = await createScheduler({
      dataSource: [
        // 1st
        {
          startDate: new Date('2021-02-01T08:00:00.000Z'),
          endDate: new Date('2021-02-01T20:00:00.000Z'),
          priorityId: 0,
        }, {
          startDate: new Date('2021-02-01T08:00:00.000Z'),
          endDate: new Date('2021-02-01T20:00:00.000Z'),
          priorityId: 0,
        }, {
          startDate: new Date('2021-02-01T08:00:00.000Z'),
          endDate: new Date('2021-02-01T20:00:00.000Z'),
          priorityId: 1,
        },
        // 4th
        {
          startDate: new Date('2021-02-04T08:00:00.000Z'),
          endDate: new Date('2021-02-04T20:00:00.000Z'),
          priorityId: 0,
        },
        // 6th
        {
          startDate: new Date('2021-02-06T08:00:00.000Z'),
          endDate: new Date('2021-02-06T20:00:00.000Z'),
          priorityId: [0, 1],
        },
        // 7th
        {
          startDate: new Date('2021-02-07T08:00:00.000Z'),
          endDate: new Date('2021-02-07T20:00:00.000Z'),
          priorityId: 0,
        },
      ],
      groups: ['priorityId'],
      resources: [{
        fieldExpr: 'priorityId',
        dataSource: [
          { id: 0, text: 'One' },
          { id: 1, text: 'Two' },
          { id: 2, text: 'Three' },
        ],
        allowMultiple: true,
      }],
      currentView: 'agenda',
      currentDate: new Date('2021-02-01T10:00:00.000Z'),
    });

    expect(POM.getAppointments().length).toBe(7);
    expect(POM.getGroupTableContent()).toMatchSnapshot();
    expect(POM.getTimePanelContent()).toMatchSnapshot();
  });

  it('should correct render 24 hour all day appointment', async () => {
    setupSchedulerTestEnvironment();
    const { POM } = await createScheduler({
      dataSource: [{
        startDate: new Date(2016, 1, 24, 0),
        endDate: new Date(2016, 1, 25, 0),
        allDay: true,
      }],
      currentView: 'agenda',
      currentDate: new Date(2016, 1, 24),
    });

    expect(POM.getAppointments().length).toBe(1);
    expect(POM.getTimePanelContent()).toEqual(['24 Wed']);
  });

  it('should contain a right quantity of long-appointments', async () => {
    setupSchedulerTestEnvironment();
    const { POM } = await createScheduler({
      dataSource: [{
        startDate: new Date(2016, 1, 22, 1),
        endDate: new Date(2016, 2, 4, 1, 30),
      }],
      currentView: 'agenda',
      currentDate: new Date(2016, 1, 24),
    });

    expect(POM.getAppointments().length).toBe(7);
    expect(POM.getTimePanelContent()).toMatchSnapshot();
  });

  [
    {
      dataSource: [{
        Start: new Date(2016, 1, 22, 1).toString(),
        End: new Date(2016, 1, 23, 1, 30).toString(),
        RecurrenceRule: 'FREQ=DAILY;INTERVAL=3',
      }],
      count: 4,
    }, {
      dataSource: [{
        Start: new Date(2016, 1, 24, 1),
        End: new Date(2016, 1, 25, 5),
        RecurrenceRule: 'FREQ=DAILY;INTERVAL=3',
      }],
      count: 5,
    },
  ].forEach(({ dataSource, count }) => {
    it('should contain a right quantity of recurrence long-appointments', async () => {
      setupSchedulerTestEnvironment();
      const { POM } = await createScheduler({
        dataSource,
        endDateExpr: 'End',
        startDateExpr: 'Start',
        recurrenceRuleExpr: 'RecurrenceRule',
        currentView: 'agenda',
        currentDate: new Date(2016, 1, 24),
      });

      expect(POM.getAppointments().length).toBe(count);
      expect(POM.getTimePanelContent()).toMatchSnapshot();
    });
  });

  it('should contain a right quantity of grouped long-appointments', async () => {
    setupSchedulerTestEnvironment();
    const { POM } = await createScheduler({
      views: ['agenda'],
      groups: ['ownerId', 'roomId'],
      resources: [
        { field: 'ownerId', allowMultiple: true, dataSource: [{ id: 1 }, { id: 2 }] },
        { field: 'roomId', allowMultiple: true, dataSource: [{ id: 1 }, { id: 2 }] },
      ],
      currentView: 'agenda',
      currentDate: new Date(2016, 1, 24).toString(),
      endDateExpr: 'End',
      startDateExpr: 'Start',
      dataSource: [
        {
          Start: new Date(2016, 1, 24, 1).toString(),
          End: new Date(2016, 1, 26, 1, 30).toString(),
          ownerId: [1, 2],
          roomId: 1,
        },
      ],
    });

    expect(POM.getAppointments().length).toBe(6);
    expect(POM.getTimePanelContent()).toMatchSnapshot();
  });

  it('should work after view changed', async () => {
    setupSchedulerTestEnvironment();
    const { POM, scheduler } = await createScheduler({
      views: ['agenda', 'week'],
      currentView: 'week',
      currentDate: new Date(2016, 2, 1),
      dataSource: [{ startDate: new Date(2016, 2, 1, 1), endDate: new Date(2016, 2, 1, 2) }],
    });

    scheduler.option('currentView', 'agenda');
    await new Promise(process.nextTick);

    expect(POM.getAppointments().length).toBe(1);
    expect(POM.getTimePanelContent()).toMatchSnapshot();
  });
});
