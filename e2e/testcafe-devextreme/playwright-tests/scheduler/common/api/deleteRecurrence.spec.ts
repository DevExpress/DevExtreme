import { test, expect } from '@playwright/test';
import { createWidget, getContainerUrl, setupTestPage } from '../../../../playwright-helpers';

const containerUrl = getContainerUrl(__dirname, '../../../../tests/container.html');

test.describe.skip('Scheduler API - deleteRecurrence', () => {
  test.beforeEach(async ({ page }) => {
    await setupTestPage(page, containerUrl);
  });

  test('should delete recurrent appointment if mode is "series"', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      width: 800,
      height: 600,
      views: [{ type: 'day', intervalCount: 3 }],
      currentView: 'day',
      currentDate: new Date(2022, 3, 12),
      startDayHour: 8,
      endDayHour: 13,
      onAppointmentDeleting: ((e: any) => {
        e.component.deleteRecurrence(e.appointmentData, e.targetedAppointmentData.startDate, 'series');
        e.cancel = true;
      }) as any,
      dataSource: [{
        text: 'test-appt',
        startDate: new Date(2022, 3, 12, 8),
        endDate: new Date(2022, 3, 12, 9),
        apptColor: 1,
        recurrenceRule: 'FREQ=DAILY;COUNT=4',
      }],
    });

    const appointment = page.locator('.dx-scheduler-appointment').filter({ hasText: 'test-appt' });
    await appointment.click();

    const deleteButton = page.locator('.dx-tooltip-appointment-item-delete-button').first();
    await deleteButton.click();

    const appointmentCount = await page.locator('.dx-scheduler-appointment').count();
    expect(appointmentCount).toBe(0);
  });

  test('should exclude from recurrence if mode is "occurrence"', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      width: 800,
      height: 600,
      views: [{ type: 'day', intervalCount: 3 }],
      currentView: 'day',
      currentDate: new Date(2022, 3, 12),
      startDayHour: 8,
      endDayHour: 12,
      onAppointmentDeleting: ((e: any) => {
        e.component.deleteRecurrence(e.appointmentData, e.targetedAppointmentData.startDate, 'occurrence');
        e.cancel = true;
      }) as any,
      dataSource: [{
        text: 'test-appt',
        startDate: new Date(2022, 3, 12, 8),
        endDate: new Date(2022, 3, 12, 9),
        apptColor: 1,
        recurrenceRule: 'FREQ=DAILY;COUNT=4',
      }],
    });

    const appointment0 = page.locator('.dx-scheduler-appointment').filter({ hasText: 'test-appt' }).first();
    await appointment0.click();

    const deleteButton = page.locator('.dx-tooltip-appointment-item-delete-button').first();
    await deleteButton.click();

    const appointmentCount = await page.locator('.dx-scheduler-appointment').count();
    expect(appointmentCount).toBe(2);
  });

  test('should show delete recurrence dialog if mode is "dialog"', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      width: 800,
      height: 600,
      views: [{ type: 'day', intervalCount: 3 }],
      currentView: 'day',
      currentDate: new Date(2022, 3, 12),
      startDayHour: 8,
      endDayHour: 13,
      onAppointmentDeleting: ((e: any) => {
        e.component.deleteRecurrence(e.appointmentData, e.targetedAppointmentData.startDate, 'dialog');
        e.cancel = true;
      }) as any,
      dataSource: [{
        text: 'test-appt',
        startDate: new Date(2022, 3, 12, 8),
        endDate: new Date(2022, 3, 12, 9),
        apptColor: 1,
        recurrenceRule: 'FREQ=DAILY;COUNT=4',
      }],
    });

    const appointment = page.locator('.dx-scheduler-appointment').filter({ hasText: 'test-appt' }).first();
    await appointment.click();

    const deleteButton = page.locator('.dx-tooltip-appointment-item-delete-button').first();
    await expect(deleteButton).toBeVisible();
    await deleteButton.click();

    await page.waitForTimeout(100);
    const count1 = await page.locator('.dx-scheduler-appointment').count();
    expect(count1).toBe(3);

    const dialogAppointmentBtn = page.locator('.dx-dialog').locator('.dx-dialog-button').first();
    await dialogAppointmentBtn.click();

    await page.waitForTimeout(100);
    const count2 = await page.locator('.dx-scheduler-appointment').count();
    expect(count2).toBe(2);
  });
});
