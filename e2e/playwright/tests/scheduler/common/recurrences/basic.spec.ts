import { expect, test } from '../../../../fixtures';
import { dragToElement } from '../../../../helpers/dragUtils';
import { testScreenshot } from '../../../../helpers/screenshots';
import Scheduler from '../../../../models/scheduler';
import dataSource from './init/widget.data';
import createScheduler from './init/widget.setup';

test('Drag-n-drop recurrence appointment between dateTable and allDay panel', async ({ page }) => {
  await createScheduler(page, {
    dataSource,
    startDayHour: 1,
    recurrenceEditMode: 'series',
  });

  const scheduler = new Scheduler(page, '#container');
  const draggableAppointment = scheduler.getAppointment('Simple recurrence appointment');

  await testScreenshot(page, 'basic-recurrence-appointment-init.png');

  await dragToElement(page, draggableAppointment.element, scheduler.getAllDayTableCell(0));

  await expect.poll(async () => scheduler.getAppointmentCount()).toBe(7);

  await testScreenshot(page, 'basic-recurrence-appointment-after-drag.png');
});

test('Appointments in DST should not have offset when recurring appointment timezoine not equal to scheduler timezone', async ({ page }) => {
  await createScheduler(page, {
    timeZone: 'America/New_York',
    dataSource: [
      {
        text: 'Recurrence',
        startDate: new Date('2021-03-13T19:00:00.000Z'),
        endDate: new Date('2021-03-13T19:30:00.000Z'),
        recurrenceRule: 'FREQ=DAILY;COUNT=1000',
        startDateTimeZone: 'America/New_York',
        endDateTimeZone: 'America/New_York',
      },
    ],
    views: ['week'],
    currentView: 'week',
    currentDate: new Date(2021, 2, 13),
    firstDayOfWeek: 1,
  });

  const scheduler = new Scheduler(page, '#container');

  await expect(scheduler.getAppointmentByIndex(0).date.time).toHaveText('2:00 PM - 2:30 PM');
  await expect(scheduler.getAppointmentByIndex(1).date.time).toHaveText('2:00 PM - 2:30 PM');

  await scheduler.option('currentDate', new Date(2021, 10, 1));

  await expect(scheduler.getAppointmentByIndex(0).date.time).toHaveText('2:00 PM - 2:30 PM');
  await expect(scheduler.getAppointmentByIndex(1).date.time).toHaveText('2:00 PM - 2:30 PM');
});

test('Appointments in end of DST should have correct offset', async ({ page }) => {
  await createScheduler(page, {
    timeZone: 'America/Phoenix',
    dataSource: [
      {
        text: 'Recurrence',
        startDate: new Date('2021-03-13T19:00:00.000Z'),
        endDate: new Date('2021-03-13T19:30:00.000Z'),
        recurrenceRule: 'FREQ=DAILY;COUNT=1000',
        startDateTimeZone: 'America/New_York',
        endDateTimeZone: 'America/New_York',
      },
    ],
    views: ['week'],
    currentView: 'week',
    currentDate: new Date(2021, 10, 1),
    firstDayOfWeek: 1,
  });

  const scheduler = new Scheduler(page, '#container');

  await expect(scheduler.getAppointmentByIndex(5).date.time).toHaveText('11:00 AM - 11:30 AM');
  await expect(scheduler.getAppointmentByIndex(6).date.time).toHaveText('12:00 PM - 12:30 PM');
});

test('Appointment displayed without errors if it was only one DST in year(T1037853)', async ({ page }) => {
  await createScheduler(page, {
    timeZone: 'America/Los_Angeles',
    dataSource: [{
      text: 'Recurrence',
      startDate: new Date(1942, 3, 29, 0),
      endDate: new Date(1942, 3, 29, 1),
      recurrenceRule: 'FREQ=DAILY;COUNT=2',
    }],
    views: ['day'],
    currentView: 'day',
    currentDate: new Date(1942, 3, 29),
    height: 600,
  });

  const scheduler = new Scheduler(page, '#container');

  await expect(scheduler.getAppointmentByIndex(0).element).toBeAttached();
});
