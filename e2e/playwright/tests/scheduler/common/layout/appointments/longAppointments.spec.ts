// T1086079
import { expect, test } from '../../../../../fixtures';
import { createWidget } from '../../../../../helpers/createWidget';
import { testScreenshot } from '../../../../../helpers/screenshots';
import Scheduler from '../../../../../models/scheduler';

const dataSource = [{
  text: 'Website Re-Design Plan',
  startDate: new Date('2021-02-29T01:30:00.000Z'),
  endDate: new Date('2021-02-29T14:30:00.000Z'),
  recurrenceRule: 'FREQ=DAILY',
}];

const appointmentName = 'Website Re-Design Plan';

test('Control should be render top part of recurrent long appointment in day view(T1086079)', async ({ page }) => {
  await createWidget(page, 'dxScheduler', {
    timeZone: 'America/Los_Angeles',
    dataSource,
    cellDuration: 120,
    views: ['day'],
    currentView: 'day',
    currentDate: new Date(2021, 2, 30),
    startDayHour: 2,
    endDayHour: 22,
    height: 600,
  });

  const scheduler = new Scheduler(page, '#container');

  await testScreenshot(page, 'long-appointment-day-view-T1086079.png', {
    element: scheduler.workSpace,
  });

  await scheduler.getAppointment(appointmentName, 0).element.click();
  await expect(scheduler.appointmentTooltip.getListItem(appointmentName).date)
    .toHaveText('March 29 5:30 PM - March 30 6:30 AM');

  await scheduler.getAppointment(appointmentName, 1).element.click();
  await expect(scheduler.appointmentTooltip.getListItem(appointmentName).date)
    .toHaveText('March 30 5:30 PM - March 31 6:30 AM');

  await scheduler.toolbar.navigator.nextButton.click();

  await scheduler.getAppointment(appointmentName, 0).element.click();
  await expect(scheduler.appointmentTooltip.getListItem(appointmentName).date)
    .toHaveText('March 30 5:30 PM - March 31 6:30 AM');

  await scheduler.getAppointment(appointmentName, 1).element.click();
  await expect(scheduler.appointmentTooltip.getListItem(appointmentName).date)
    .toHaveText('March 31 5:30 PM - April 1 6:30 AM');
});

test('Control should be render top part of recurrent long appointment in week view(T1086079)', async ({ page }) => {
  await createWidget(page, 'dxScheduler', {
    timeZone: 'America/Los_Angeles',
    dataSource,
    cellDuration: 120,
    views: ['week'],
    currentView: 'week',
    currentDate: new Date(2021, 2, 30),
    startDayHour: 2,
    endDayHour: 22,
    height: 600,
  });

  const scheduler = new Scheduler(page, '#container');

  await testScreenshot(page, 'long-appointment-week-view-T1086079.png', {
    element: scheduler.workSpace,
  });

  await scheduler.getAppointment(appointmentName, 0).element.click();
  await expect(scheduler.appointmentTooltip.getListItem(appointmentName).date)
    .toHaveText('March 27 5:30 PM - March 28 6:30 AM');

  await scheduler.getAppointment(appointmentName, 1).element.click();
  await expect(scheduler.appointmentTooltip.getListItem(appointmentName).date)
    .toHaveText('March 28 5:30 PM - March 29 6:30 AM');

  await scheduler.getAppointment(appointmentName, 2).element.click();
  await expect(scheduler.appointmentTooltip.getListItem(appointmentName).date)
    .toHaveText('March 28 5:30 PM - March 29 6:30 AM');

  await scheduler.getAppointment(appointmentName, 3).element.click();
  await expect(scheduler.appointmentTooltip.getListItem(appointmentName).date)
    .toHaveText('March 29 5:30 PM - March 30 6:30 AM');
});
