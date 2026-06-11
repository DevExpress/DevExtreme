/**
 * @timezone America/Los_Angeles
 */
import {
  afterEach,
  beforeEach, describe, expect, it, jest,
} from '@jest/globals';

import fx from '../../../common/core/animation/fx';
import { createScheduler } from './__mock__/create_scheduler';
import { setupSchedulerTestEnvironment } from './__mock__/mock_scheduler';

describe('DST/STD for recurrence appointments, T804886 and T856624', () => {
  beforeEach(() => {
    fx.off = true;
    setupSchedulerTestEnvironment({ height: 600 });
  });

  afterEach(() => {
    fx.off = false;
    jest.useRealTimers();
    document.body.innerHTML = '';
  });

  it('Recurring appointments should have correct startDate and endDate if recurrence starts in STD and ends in DST in custom timezone, appointment timezone is set (T804886)', async () => {
    // NOTE: The daylight saving changed in Montreal on 10.03.2019 and in Paris on 31.03.2019
    const { scheduler, POM } = await createScheduler({
      dataSource: [
        {
          text: 'Daily meeting',
          startDate: '2019-03-01T09:00:00+01:00',
          endDate: '2019-03-01T12:00:00+01:00',
          recurrenceRule: 'FREQ=DAILY',
          startDateTimeZone: 'Europe/Paris',
          endDateTimeZone: 'Europe/Paris',
        },
      ],
      views: ['day'],
      currentView: 'day',
      currentDate: new Date(2019, 2, 1), // NOTE: STD Montreal
      startDayHour: 0,
      height: 600,
      timeZone: 'America/Montreal',
      dateSerializationFormat: 'yyyy-MM-ddTHH:mm:ssx',
    });

    const appointment1 = POM.getAppointment('Daily meeting');
    expect(appointment1.getDisplayDate()).toBe('3:00 AM - 6:00 AM');

    scheduler.option('currentDate', new Date(2019, 2, 14));
    await new Promise(process.nextTick);

    const appointment2 = POM.getAppointment('Daily meeting');
    expect(appointment2.getDisplayDate()).toBe('4:00 AM - 7:00 AM');

    scheduler.option('currentDate', new Date(2019, 3, 2));
    await new Promise(process.nextTick);

    const appointment3 = POM.getAppointment('Daily meeting');
    expect(appointment3.getDisplayDate()).toBe('3:00 AM - 6:00 AM');
  });

  it('Recurrence appt part at the time of DST should have correct tooltip and popup if recurrence starts in STD and ends in DST in custom timezone, appointment timezone is set (T804886)', async () => {
    // NOTE: The daylight saving changed in Montreal on 10.03.2019 and in Paris on 31.03.2019
    const { scheduler, POM } = await createScheduler({
      dataSource: [
        {
          text: 'Daily meeting',
          startDate: '2019-03-01T09:00:00+01:00',
          endDate: '2019-03-01T12:00:00+01:00',
          recurrenceRule: 'FREQ=DAILY',
          startDateTimeZone: 'Europe/Paris',
          endDateTimeZone: 'Europe/Paris',
        },
      ],
      views: ['day'],
      currentView: 'day',
      currentDate: new Date(2019, 2, 10), // NOTE: DST Montreal, STD Paris
      startDayHour: 0,
      height: 600,
      timeZone: 'America/Montreal',
      dateSerializationFormat: 'yyyy-MM-ddTHH:mm:ssx',
    });

    const appointment1 = POM.getAppointment('Daily meeting');
    expect(appointment1.getDisplayDate()).toBe('4:00 AM - 7:00 AM');

    scheduler.option('currentDate', new Date(2019, 2, 31));
    await new Promise(process.nextTick);

    const appointment2 = POM.getAppointment('Daily meeting');
    expect(appointment2.getDisplayDate()).toBe('3:00 AM - 6:00 AM');
  });

  it('Recurring appt part at the time of DST-end should have correct startDate and endDate if recurrence starts in DST and ends in STD in custom timezone, appointment timezone is set (T804886)', async () => {
    // NOTE: The daylight saving changed backward in Montreal on 03.11.2019 and
    // in Paris on 27.10.2019
    const { scheduler, POM } = await createScheduler({
      dataSource: [
        {
          text: 'Daily meeting',
          startDate: '2019-03-01T09:00:00+01:00',
          endDate: '2019-03-01T12:00:00+01:00',
          recurrenceRule: 'FREQ=DAILY',
          startDateTimeZone: 'Europe/Paris',
          endDateTimeZone: 'Europe/Paris',
        },
      ],
      views: ['day'],
      currentView: 'day',
      currentDate: new Date(2019, 9, 27), // NOTE: DST Montreal, STD Paris
      startDayHour: 0,
      height: 600,
      timeZone: 'America/Montreal',
      dateSerializationFormat: 'yyyy-MM-ddTHH:mm:ssx',
    });

    const appointment1 = POM.getAppointment('Daily meeting');
    expect(appointment1.getDisplayDate()).toBe('4:00 AM - 7:00 AM');

    scheduler.option('currentDate', new Date(2019, 10, 3)); // NOTE: STD Montreal, STD Paris
    await new Promise(process.nextTick);

    const appointment2 = POM.getAppointment('Daily meeting');
    expect(appointment2.getDisplayDate()).toBe('3:00 AM - 6:00 AM');
  });
});

describe('Appointments with DST/STD cases', () => {
  beforeEach(() => {
    fx.off = true;
    setupSchedulerTestEnvironment({ height: 600 });
  });

  afterEach(() => {
    fx.off = false;
    jest.useRealTimers();
    document.body.innerHTML = '';
  });

  it('Appointment which started in DST and ended in STD time should have correct start & end dates', async () => {
    // NOTE: Nov 4 2018: DST ends in Chicago at 2:00 AM CDT (07:00 UTC) → falls back to 1:00 AM CST
    // startDate = 06:00 UTC = 1:00 AM CDT (before fallback)
    // endDate   = 08:10 UTC = 2:10 AM CST (after fallback)
    const startDate = new Date(1541311200000);
    const endDate = new Date(1541319000000);

    const { POM } = await createScheduler({
      currentDate: new Date(2018, 10, 4),
      views: ['week'],
      currentView: 'week',
      dataSource: [{
        text: 'DST',
        startDate,
        endDate,
      }],
      timeZone: 'America/Chicago',
    });

    const appointment = POM.getAppointment('DST');
    expect(appointment.getText()).toBe('DST');
    expect(appointment.getDisplayDate()).toBe('1:00 AM - 2:10 AM');
  });

  it('Appointment which started in STD and ended in DST time should have correct start & end dates', async () => {
    // NOTE: Mar 11 2018: DST starts in New York at 2:00 AM EST (07:00 UTC) → springs to 3:00 AM EDT
    // startDate = 06:00 UTC = 1:00 AM EST (before spring-forward)
    // endDate   = 07:00 UTC = 3:00 AM EDT (after spring-forward, clock skips 2:00 AM)
    const startDate = new Date(1520748000000);
    const endDate = new Date(1520751600000);

    const { POM } = await createScheduler({
      currentDate: new Date(2018, 2, 11),
      views: ['timelineDay'],
      currentView: 'timelineDay',
      dataSource: [{
        text: 'DST',
        startDate,
        endDate,
      }],
      timeZone: 'America/New_York',
    });

    const appointment = POM.getAppointment('DST');
    expect(appointment.getText()).toBe('DST');
    expect(appointment.getDisplayDate()).toBe('1:00 AM - 3:00 AM');
  });

  it('Second recurring appointment which started in STD and ended in DST time should have correct start & end dates', async () => {
    const startDate = new Date(1520748000000);
    const endDate = new Date(1520751600000);

    const { POM } = await createScheduler({
      currentDate: new Date(2018, 2, 12),
      views: ['timelineDay'],
      currentView: 'timelineDay',
      dataSource: [{
        text: 'DST',
        startDate,
        endDate,
        recurrenceRule: 'FREQ=DAILY',
      }],
      timeZone: 'America/New_York',
    });

    const appointment = POM.getAppointment('DST');
    expect(appointment.getText()).toBe('DST');
    expect(appointment.getDisplayDate()).toBe('1:00 AM - 2:00 AM');
  });

  // NOTE: Timezone-sensitive test, use US/Pacific for proper testing
  it('Appointment which started in DST and ended in STD time should have right width, timeline view', async () => {
    const startDate = new Date(2018, 10, 4, 1);
    const endDate = new Date(2018, 10, 4, 3);
    const currentDate = new Date(2018, 10, 4);

    const { POM } = await createScheduler({
      views: ['timelineWeek'],
      currentView: 'timelineWeek',
      cellDuration: 60,
      currentDate,
      dataSource: [{
        text: 'DST',
        startDate,
        endDate,
      }],
    });

    const appointments = POM.getAppointments();
    expect(appointments.length).toEqual(1);
    expect(appointments[0].getText()).toBe('DST');
  });

  it('Appointment should be rendered correctly if end date appointment coincided translation on STD', async () => {
    const { POM } = await createScheduler({
      dataSource: [{
        text: 'November 4',
        startDate: new Date(2018, 10, 4, 18, 0),
        endDate: new Date(2018, 10, 5, 0, 0),
      }],
      views: ['month'],
      currentView: 'month',
      currentDate: new Date(2018, 10, 1),
      firstDayOfWeek: 0,
      cellDuration: 60,
      height: 800,
    });

    const appointments = POM.getAppointments();
    expect(appointments.length).toEqual(1);
    expect(appointments[0].getText()).toBe('November 4');
  });

  it('Recurrence exception should not be rendered if exception goes after adjusting AEST-> AEDT (T619455)', async () => {
    const { scheduler, POM } = await createScheduler({
      dataSource: [{
        text: 'Recruiting students',
        startDate: '2018-03-30T10:00:00+11:00',
        endDate: '2018-03-30T11:00:00+11:00',
        recurrenceRule: 'FREQ=DAILY',
        recurrenceException: '20180401T000000Z',
        startDateTimeZone: 'Australia/Sydney',
        endDateTimeZone: 'Australia/Sydney',
      }],
      views: ['month'],
      currentView: 'month',
      currentDate: new Date(2018, 2, 30),
      timeZone: 'Australia/Sydney',
      height: 600,
    });

    expect(POM.getAppointments().length).toBe(8);

    scheduler.option('currentView', 'day');
    scheduler.option('currentDate', new Date(2018, 3, 1));
    await new Promise(process.nextTick);

    expect(POM.getAppointments().length).toBe(0);
  });

  it('Recurrence exception should be adjusted by appointment timezone after deleting of the single appt', async () => {
    const { POM } = await createScheduler({
      dataSource: [{
        text: 'Recruiting students',
        startDate: new Date(2018, 2, 26, 10, 0),
        endDate: new Date(2018, 2, 26, 11, 0),
        recurrenceRule: 'FREQ=DAILY',
        startDateTimeZone: 'Australia/Canberra',
        endDateTimeZone: 'Australia/Canberra',
      }],
      views: ['day'],
      currentView: 'day',
      currentDate: new Date(2018, 3, 1),
      recurrenceEditMode: 'occurrence',
    });

    expect(POM.getAppointments().length).toBe(1);

    jest.useFakeTimers();
    const appointment = POM.getAppointment('Recruiting students');
    appointment.element?.click();
    jest.runAllTimers();
    jest.useRealTimers();

    const tooltipItem = POM.getTooltipAppointment();
    expect(tooltipItem).not.toBeNull();
    const tooltipDeleteButton = tooltipItem?.querySelector<HTMLElement>('.dx-tooltip-appointment-item-delete-button');
    expect(tooltipDeleteButton).not.toBeNull();
    tooltipDeleteButton?.click();
    await new Promise(process.nextTick);

    expect(POM.getAppointments().length).toBe(0);
  });
});
