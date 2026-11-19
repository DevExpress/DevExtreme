import type { Locator } from '@playwright/test';
import { expect, test } from '../../../../fixtures';
import { createWidget } from '../../../../helpers/createWidget';
import { getThemeName } from '../../../../helpers/themeUtils';
import Scheduler from '../../../../models/scheduler';

const SCHEDULER_SELECTOR = '#container';

type RectSide = 'left' | 'top';

const expectRectWithin = async (
  locator: Locator,
  side: RectSide,
  min: number,
  max: number,
): Promise<void> => {
  const getSide = (): Promise<number> => locator.evaluate(
    (element, name) => element.getBoundingClientRect()[name],
    side,
  );

  await expect.poll(getSide).toBeGreaterThanOrEqual(min);
  await expect.poll(getSide).toBeLessThanOrEqual(max);
};

test.describe('Scheduler API - deleteRecurrence', () => {
  test('should delete recurrent appointment if mode is "series"', async ({ page }) => {
    await createWidget(page, 'dxScheduler', () => ({
      width: 800,
      height: 600,
      views: [{
        type: 'day',
        intervalCount: 3,
      }],
      currentView: 'day',
      currentDate: new Date(2022, 3, 12),
      startDayHour: 8,
      endDayHour: 13,
      onAppointmentDeleting: (e) => {
        e.component.deleteRecurrence(
          e.appointmentData,
          e.targetedAppointmentData.startDate,
          'series',
        );

        e.cancel = true;
      },
      dataSource: [{
        text: 'test-appt',
        startDate: new Date(2022, 3, 12, 8),
        endDate: new Date(2022, 3, 12, 9),
        apptColor: 1,
        recurrenceRule: 'FREQ=DAILY;COUNT=4',
      }],
    }));

    const scheduler = new Scheduler(page, SCHEDULER_SELECTOR);
    const appointment = scheduler.getAppointment('test-appt');
    const { appointmentTooltip } = scheduler;

    await appointment.element.click();
    await expect(appointmentTooltip.anyElement.first()).toBeAttached();
    await appointmentTooltip.deleteButton.click();
    await expect(scheduler.appointments).toHaveCount(0);
  });

  test('should exclude from recurrence if mode is "occurrence"', async ({ page, theme }) => {
    await createWidget(page, 'dxScheduler', () => ({
      width: 800,
      height: 600,
      views: [{
        type: 'day',
        intervalCount: 3,
      }],
      currentView: 'day',
      currentDate: new Date(2022, 3, 12),
      startDayHour: 8,
      endDayHour: 12,
      onAppointmentDeleting: (e) => {
        e.component.deleteRecurrence(
          e.appointmentData,
          e.targetedAppointmentData.startDate,
          'occurrence',
        );

        e.cancel = true;
      },
      dataSource: [{
        text: 'test-appt',
        startDate: new Date(2022, 3, 12, 8),
        endDate: new Date(2022, 3, 12, 9),
        apptColor: 1,
        recurrenceRule: 'FREQ=DAILY;COUNT=4',
      }],
    }));

    const scheduler = new Scheduler(page, SCHEDULER_SELECTOR);
    const appointment0 = scheduler.getAppointment('test-appt', 0);
    const appointment1 = scheduler.getAppointment('test-appt', 1);
    const { appointmentTooltip } = scheduler;

    await appointment0.element.click();
    await expect(appointmentTooltip.anyElement.first()).toBeAttached();
    await appointmentTooltip.deleteButton.click();
    await expect(scheduler.appointments).toHaveCount(2);

    const isFluentNext = getThemeName(theme) === 'fluent-next';

    await expectRectWithin(appointment0.element, 'left', isFluentNext ? 317 : 318, isFluentNext ? 318 : 319);
    await expectRectWithin(appointment0.element, 'top', isFluentNext ? 142 : 140, isFluentNext ? 143 : 141);

    await expectRectWithin(appointment1.element, 'left', 562, 563);
    await expectRectWithin(appointment1.element, 'top', isFluentNext ? 142 : 140, isFluentNext ? 143 : 141);
  });

  test('should show delete recurrence dialog if mode is "dialog"', async ({ page }) => {
    await createWidget(page, 'dxScheduler', () => ({
      width: 800,
      height: 600,
      views: [{
        type: 'day',
        intervalCount: 3,
      }],
      currentView: 'day',
      currentDate: new Date(2022, 3, 12),
      startDayHour: 8,
      endDayHour: 13,
      onAppointmentDeleting: (e) => {
        e.component.deleteRecurrence(
          e.appointmentData,
          e.targetedAppointmentData.startDate,
          'dialog',
        );

        e.cancel = true;
      },
      dataSource: [{
        text: 'test-appt',
        startDate: new Date(2022, 3, 12, 8),
        endDate: new Date(2022, 3, 12, 9),
        apptColor: 1,
        recurrenceRule: 'FREQ=DAILY;COUNT=4',
      }],
    }));

    const scheduler = new Scheduler(page, SCHEDULER_SELECTOR);
    const appointment = scheduler.getAppointment('test-appt');
    const { appointmentTooltip } = scheduler;
    const deleteRecurrenceDialog = scheduler.getDeleteRecurrenceDialog();

    await appointment.element.click();
    await appointmentTooltip.expectVisible();
    await expect(appointmentTooltip.deleteButton).toBeVisible();
    await appointmentTooltip.deleteButton.click();
    await expect(deleteRecurrenceDialog.appointment).toBeVisible();
    await expect(scheduler.appointments).toHaveCount(3);
    await deleteRecurrenceDialog.appointment.click({ force: true });
    await expect(scheduler.appointments).toHaveCount(2);
  });
});
