import { expect, test } from '../../../../fixtures';
import { createWidget } from '../../../../helpers/createWidget';
import { testScreenshot } from '../../../../helpers/screenshots';
import Scheduler from '../../../../models/scheduler';

const SCHEDULER_SELECTOR = '#container';
const INITIAL_APPOINTMENT_TITLE = 'appointment';

const schedulerOptions = {
  dataSource: [{
    id: 1,
    text: INITIAL_APPOINTMENT_TITLE,
    startDate: new Date(2021, 2, 29, 9, 30),
    endDate: new Date(2021, 2, 29, 11, 30),
    recurrenceRule: 'FREQ=WEEKLY;BYDAY=MO,TH;COUNT=10',
  }],
  views: ['day'],
  currentView: 'day',
  currentDate: new Date(2021, 2, 29),
  startDayHour: 9,
  endDayHour: 14,
  height: 600,
};

test('Recurrence edit dialog screenshot', async ({ page }) => {
  await createWidget(page, 'dxScheduler', schedulerOptions);

  const scheduler = new Scheduler(page, SCHEDULER_SELECTOR);
  const appointment = scheduler.getAppointment(INITIAL_APPOINTMENT_TITLE);

  await appointment.element.dblclick();

  await expect(Scheduler.getEditRecurrenceDialog(page).element).toBeAttached();

  await testScreenshot(page, 'recurrence-edit-dialog-screenshot.png', { element: scheduler.element });
});

test('Recurrence delete dialog screenshot', async ({ page }) => {
  await createWidget(page, 'dxScheduler', schedulerOptions);

  const scheduler = new Scheduler(page, SCHEDULER_SELECTOR);
  const appointment = scheduler.getAppointment(INITIAL_APPOINTMENT_TITLE);

  await appointment.element.click();

  await expect.poll(async () => scheduler.appointmentTooltip.exists()).toBe(true);

  await scheduler.appointmentTooltip.deleteButton.click();

  await expect(Scheduler.getDeleteRecurrenceDialog(page).element).toBeAttached();

  await testScreenshot(page, 'recurrence-delete-dialog-screenshot.png', { element: scheduler.element });
});
