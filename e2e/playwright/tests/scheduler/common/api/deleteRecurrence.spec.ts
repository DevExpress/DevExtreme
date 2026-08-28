import { expect, test } from '../../../../fixtures';
import { createWidget } from '../../../../helpers/createWidget';
import Scheduler from '../../../../models/scheduler';

const dataSource = [{
  text: 'test-appt',
  startDate: new Date(2022, 3, 12, 8),
  endDate: new Date(2022, 3, 12, 9),
  apptColor: 1,
  recurrenceRule: 'FREQ=DAILY;COUNT=4',
}];

const baseOptions = {
  width: 800,
  height: 600,
  views: [{
    type: 'day',
    intervalCount: 3,
  }],
  currentView: 'day',
  currentDate: new Date(2022, 3, 12),
  startDayHour: 8,
  dataSource,
};

// The handlers are spelled out per test: a configuration function is shipped to the page as its
// own source, so anything it closes over here would not exist there.
test('should delete recurrent appointment if mode is "series"', async ({ page }) => {
  await createWidget(page, 'dxScheduler', {
    ...baseOptions,
    endDayHour: 13,
    onAppointmentDeleting: (e: any) => {
      e.component.deleteRecurrence(
        e.appointmentData,
        e.targetedAppointmentData.startDate,
        'series',
      );

      e.cancel = true;
    },
  });

  const scheduler = new Scheduler(page, '#container');
  const appointment = scheduler.getAppointment('test-appt');
  const { appointmentTooltip } = scheduler;

  await appointment.element.click();

  await expect.poll(async () => appointmentTooltip.exists()).toBe(true);

  await appointmentTooltip.deleteButton.click();

  await expect.poll(async () => scheduler.getAppointmentCount()).toBe(0);
});

test('should exclude from recurrence if mode is "occurrence"', async ({ page }) => {
  await createWidget(page, 'dxScheduler', {
    ...baseOptions,
    endDayHour: 12,
    onAppointmentDeleting: (e: any) => {
      e.component.deleteRecurrence(
        e.appointmentData,
        e.targetedAppointmentData.startDate,
        'occurrence',
      );

      e.cancel = true;
    },
  });

  const scheduler = new Scheduler(page, '#container');
  const appointment0 = scheduler.getAppointment('test-appt', 0);
  const appointment1 = scheduler.getAppointment('test-appt', 1);
  const { appointmentTooltip } = scheduler;

  await appointment0.element.click();

  await expect.poll(async () => appointmentTooltip.exists()).toBe(true);

  await appointmentTooltip.deleteButton.click();

  await expect.poll(async () => scheduler.getAppointmentCount()).toBe(2);

  const rect0 = (await appointment0.element.boundingBox())!;

  expect(rect0.x).toBeGreaterThanOrEqual(318);
  expect(rect0.x).toBeLessThanOrEqual(319);
  expect(rect0.y).toBeGreaterThanOrEqual(140);
  expect(rect0.y).toBeLessThanOrEqual(141);

  const rect1 = (await appointment1.element.boundingBox())!;

  expect(rect1.x).toBeGreaterThanOrEqual(562);
  expect(rect1.x).toBeLessThanOrEqual(563);
  expect(rect1.y).toBeGreaterThanOrEqual(140);
  expect(rect1.y).toBeLessThanOrEqual(141);
});

test('should show delete recurrence dialog if mode is "dialog"', async ({ page }) => {
  await createWidget(page, 'dxScheduler', {
    ...baseOptions,
    endDayHour: 13,
    onAppointmentDeleting: (e: any) => {
      e.component.deleteRecurrence(
        e.appointmentData,
        e.targetedAppointmentData.startDate,
        'dialog',
      );

      e.cancel = true;
    },
  });

  const scheduler = new Scheduler(page, '#container');
  const appointment = scheduler.getAppointment('test-appt');
  const { appointmentTooltip } = scheduler;
  const deleteRecurrenceDialog = Scheduler.getDeleteRecurrenceDialog(page);

  await appointment.element.click();

  await expect.poll(async () => appointmentTooltip.isVisible()).toBe(true);

  await expect(appointmentTooltip.deleteButton).toBeVisible();

  await appointmentTooltip.deleteButton.click();

  await expect.poll(async () => scheduler.getAppointmentCount()).toBe(3);

  await deleteRecurrenceDialog.appointment.click();

  await expect.poll(async () => scheduler.getAppointmentCount()).toBe(2);
});
