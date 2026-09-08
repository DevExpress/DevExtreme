import { expect, test } from '../../../../fixtures';
import { dragToOffset } from '../../../../helpers/dragUtils';
import { getTimezoneTest, MACHINE_TIMEZONES } from '../../../../helpers/machineTimezones';
import Scheduler from '../../../../models/scheduler';
import createScheduler from './init/widget.setup';

[true, false].forEach((rtlEnabled) => {
  test(`Resize all day appointment rtlEnabled=${rtlEnabled}`, async ({ page }) => {
    await createScheduler(page, {
      currentDate: new Date(2015, 1, 9),
      currentView: 'week',
      firstDayOfWeek: 0,
      rtlEnabled,
      height: 400,
      dataSource: [{
        text: 'Appointment',
        startDate: new Date(2015, 1, 9, 8),
        endDate: new Date(2015, 1, 9, 10),
        allDay: true,
      }],
    });

    const scheduler = new Scheduler(page, '#container');
    const appointment = scheduler.getAppointment('Appointment');
    const { left, right } = appointment.resizableHandle;
    const text = 'Appointment: February 9, 2015, All day';
    const startDateExtendedText = 'Appointment: February 8, 2015 - February 9, 2015, All day';
    const endDateExtendedText = 'Appointment: February 9, 2015 - February 10, 2015, All day';

    await dragToOffset(page, right, 100, 0);
    await expect.poll(async () => appointment.getAriaLabel())
      .toBe(rtlEnabled ? startDateExtendedText : endDateExtendedText);

    await dragToOffset(page, right, -100, 0);
    await expect.poll(async () => appointment.getAriaLabel()).toBe(text);

    await dragToOffset(page, left, -100, 0);
    await expect.poll(async () => appointment.getAriaLabel())
      .toBe(rtlEnabled ? endDateExtendedText : startDateExtendedText);

    await dragToOffset(page, left, 100, 0);
    await expect.poll(async () => appointment.getAriaLabel()).toBe(text);
  });

  getTimezoneTest([MACHINE_TIMEZONES.EuropeBerlin])(`Shrink long appointment endDate rtlEnabled=${rtlEnabled}`, async ({ page }) => {
    await createScheduler(page, {
      currentDate: new Date(2015, 1, 9),
      currentView: 'week',
      firstDayOfWeek: 0,
      rtlEnabled,
      height: 400,
      dataSource: [{
        text: 'Appointment',
        startDate: new Date(2015, 1, 9, 8),
        endDate: new Date(2015, 1, 10, 10),
      }],
    });

    const scheduler = new Scheduler(page, '#container');
    const appointment = scheduler.getAppointment('Appointment');
    const { left, right } = appointment.resizableHandle;

    await (rtlEnabled
      ? dragToOffset(page, right, -100, 0)
      : dragToOffset(page, left, 100, 0));

    await expect.poll(async () => appointment.getAriaLabel())
      .toBe('Appointment: February 10, 2015, 12:00 AM - 10:00 AM');
  });

  getTimezoneTest([MACHINE_TIMEZONES.EuropeBerlin])(`Shrink long appointment startDate rtlEnabled=${rtlEnabled}`, async ({ page }) => {
    await createScheduler(page, {
      currentDate: new Date(2015, 1, 9),
      currentView: 'week',
      firstDayOfWeek: 0,
      rtlEnabled,
      height: 400,
      dataSource: [{
        text: 'Appointment',
        startDate: new Date(2015, 1, 9, 8),
        endDate: new Date(2015, 1, 10, 10),
      }],
    });

    const scheduler = new Scheduler(page, '#container');
    const appointment = scheduler.getAppointment('Appointment');
    const { left, right } = appointment.resizableHandle;

    await (rtlEnabled
      ? dragToOffset(page, left, 100, 0)
      : dragToOffset(page, right, -100, 0));

    await expect.poll(async () => appointment.getAriaLabel())
      .toBe('Appointment: February 9, 2015, 8:00 AM - February 10, 2015, 12:00 AM');
  });

  getTimezoneTest([MACHINE_TIMEZONES.EuropeBerlin])(`Resize long appointment endDate with offset rtlEnabled=${rtlEnabled}`, async ({ page }) => {
    await createScheduler(page, {
      timeZone: 'Europe/Berlin',
      dataSource: [{
        text: 'Appointment',
        startDate: new Date('2021-03-30T03:00:00.000Z'),
        endDate: new Date('2021-04-01T03:00:00.000Z'),
      }],
      currentView: 'week',
      currentDate: new Date(2021, 2, 28),
      height: 400,
      offset: 360,
      rtlEnabled,
      firstDayOfWeek: 0,
    });

    const scheduler = new Scheduler(page, '#container');
    const appointment = scheduler.getAppointment('Appointment');
    const { left, right } = appointment.resizableHandle;
    const drag = async (): Promise<void> => (rtlEnabled
      ? dragToOffset(page, left, 100, 0)
      : dragToOffset(page, right, -100, 0));

    await drag();
    await expect.poll(async () => appointment.getAriaLabel())
      .toBe('Appointment: March 30, 2021, 5:00 AM - March 31, 2021, 6:00 AM');

    await drag();
    await expect.poll(async () => appointment.getAriaLabel())
      .toBe('Appointment: March 30, 2021, 5:00 AM - 6:00 AM');
  });

  getTimezoneTest([MACHINE_TIMEZONES.EuropeBerlin])(`Resize long appointment startDate with offset rtlEnabled=${rtlEnabled}`, async ({ page }) => {
    await createScheduler(page, {
      dataSource: [{
        text: 'Appointment',
        startDate: new Date('2021-03-30T03:00:00.000Z'),
        endDate: new Date('2021-04-01T03:00:00.000Z'),
      }],
      currentView: 'week',
      currentDate: new Date('2021-03-30T03:00:00.000Z'),
      height: 400,
      offset: 360,
      rtlEnabled,
      firstDayOfWeek: 0,
    });

    const scheduler = new Scheduler(page, '#container');
    const appointment = scheduler.getAppointment('Appointment');
    const { left, right } = appointment.resizableHandle;
    const drag = async (): Promise<void> => (rtlEnabled
      ? dragToOffset(page, right, -100, 0)
      : dragToOffset(page, left, 100, 0));

    await drag();
    await expect.poll(async () => appointment.getAriaLabel())
      .toBe('Appointment: March 30, 2021, 6:00 AM - April 1, 2021, 5:00 AM');

    await drag();
    await expect.poll(async () => appointment.getAriaLabel())
      .toBe('Appointment: March 31, 2021, 6:00 AM - April 1, 2021, 5:00 AM');
  });
});

getTimezoneTest([MACHINE_TIMEZONES.EuropeBerlin])('Resize long appointment rtlEnabled=true', async ({ page }) => {
  await createScheduler(page, {
    currentDate: new Date(2015, 1, 9),
    currentView: 'week',
    firstDayOfWeek: 0,
    rtlEnabled: true,
    height: 400,
    dataSource: [{
      text: 'Appointment',
      startDate: new Date(2015, 1, 9, 8),
      endDate: new Date(2015, 1, 10, 10),
    }],
  });

  const scheduler = new Scheduler(page, '#container');
  const appointment = scheduler.getAppointment('Appointment');
  const { left, right } = appointment.resizableHandle;

  await dragToOffset(page, right, 100, 0);
  await expect.poll(async () => appointment.getAriaLabel())
    .toBe('Appointment: February 8, 2015, 12:00 AM - February 10, 2015, 10:00 AM');

  await dragToOffset(page, right, -100, 0);
  await expect.poll(async () => appointment.getAriaLabel())
    .toBe('Appointment: February 9, 2015, 12:00 AM - February 10, 2015, 10:00 AM');

  await dragToOffset(page, left, -100, 0);
  await expect.poll(async () => appointment.getAriaLabel())
    .toBe('Appointment: February 9, 2015, 12:00 AM - February 12, 2015, 12:00 AM');

  await dragToOffset(page, left, 100, 0);
  await expect.poll(async () => appointment.getAriaLabel())
    .toBe('Appointment: February 9, 2015, 12:00 AM - February 11, 2015, 12:00 AM');
});

getTimezoneTest([MACHINE_TIMEZONES.EuropeBerlin])('Resize long appointment rtlEnabled=false', async ({ page }) => {
  await createScheduler(page, {
    currentDate: new Date(2015, 1, 9),
    currentView: 'week',
    firstDayOfWeek: 0,
    rtlEnabled: false,
    height: 400,
    dataSource: [{
      text: 'Appointment',
      startDate: new Date(2015, 1, 9, 8),
      endDate: new Date(2015, 1, 10, 10),
    }],
  });

  const scheduler = new Scheduler(page, '#container');
  const appointment = scheduler.getAppointment('Appointment');
  const { left, right } = appointment.resizableHandle;

  await dragToOffset(page, right, 100, 0);
  await expect.poll(async () => appointment.getAriaLabel())
    .toBe('Appointment: February 9, 2015, 8:00 AM - February 12, 2015, 12:00 AM');

  await dragToOffset(page, right, -100, 0);
  await expect.poll(async () => appointment.getAriaLabel())
    .toBe('Appointment: February 9, 2015, 8:00 AM - February 11, 2015, 12:00 AM');

  await dragToOffset(page, left, -100, 0);
  await expect.poll(async () => appointment.getAriaLabel())
    .toBe('Appointment: February 8, 2015, 12:00 AM - February 11, 2015, 12:00 AM');

  await dragToOffset(page, left, 100, 0);
  await expect.poll(async () => appointment.getAriaLabel())
    .toBe('Appointment: February 9, 2015, 12:00 AM - February 11, 2015, 12:00 AM');
});
