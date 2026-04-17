import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot, getContainerUrl, setupTestPage } from '../../../../playwright-helpers';

const containerUrl = getContainerUrl(__dirname, '../../../../tests/container.html');

const INITIAL_APPOINTMENT_TITLE = 'appointment';

test.describe.skip('Recurrence dialog', () => {
  test.beforeEach(async ({ page }) => {
    await setupTestPage(page, containerUrl);
  });

  test('Recurrence edit dialog screenshot', async ({ page }) => {
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

    const appointment = page.locator('.dx-scheduler-appointment').filter({ hasText: INITIAL_APPOINTMENT_TITLE });
    await appointment.dblclick();

    const dialog = page.locator('.dx-dialog');
    await expect(dialog).toBeVisible();

    const scheduler = page.locator('.dx-scheduler');
    await testScreenshot(page, 'recurrence-edit-dialog-screenshot.png', { element: scheduler });
  });

  test('Recurrence delete dialog screenshot', async ({ page }) => {
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

    const appointment = page.locator('.dx-scheduler-appointment').filter({ hasText: INITIAL_APPOINTMENT_TITLE });
    await appointment.click();

    const tooltip = page.locator('.dx-scheduler-appointment-tooltip');
    await expect(tooltip).toBeVisible();

    const deleteButton = page.locator('.dx-tooltip-appointment-item-delete-button').first();
    await deleteButton.click();

    const dialog = page.locator('.dx-dialog');
    await expect(dialog).toBeVisible();

    const scheduler = page.locator('.dx-scheduler');
    await testScreenshot(page, 'recurrence-delete-dialog-screenshot.png', { element: scheduler });
  });
});
