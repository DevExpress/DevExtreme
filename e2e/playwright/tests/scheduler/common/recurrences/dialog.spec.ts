import { expect, test } from '../../../../fixtures';
import { createWidget } from '../../../../helpers/createWidget';
import { testScreenshot } from '../../../../helpers/screenshots';
import Scheduler from '../../../../models/scheduler';

const SCHEDULER_SELECTOR = '#container';
const INITIAL_APPOINTMENT_TITLE = 'appointment';

test.describe('Recurrence dialog', () => {
  test.beforeEach(async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
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
    });
  });

  test('Recurrence edit dialog screenshot', async ({ page }) => {
    const scheduler = new Scheduler(page, SCHEDULER_SELECTOR);
    const appointment = scheduler.getAppointment(INITIAL_APPOINTMENT_TITLE);

    await appointment.element.dblclick();

    await expect(scheduler.getEditRecurrenceDialog().element).toBeAttached();

    await testScreenshot(page, 'recurrence-edit-dialog-screenshot.png', { element: scheduler.element });
  });

  test('Recurrence delete dialog screenshot', async ({ page }) => {
    const scheduler = new Scheduler(page, SCHEDULER_SELECTOR);
    const appointment = scheduler.getAppointment(INITIAL_APPOINTMENT_TITLE);

    // act
    await appointment.element.click();
    // assert
    await expect(scheduler.appointmentTooltip.element).toBeAttached();
    // act
    await scheduler.appointmentTooltip.deleteButton.click();

    // assert
    await expect(scheduler.getDeleteRecurrenceDialog().element).toBeAttached();

    await testScreenshot(page, 'recurrence-delete-dialog-screenshot.png', { element: scheduler.element });
  });
});
