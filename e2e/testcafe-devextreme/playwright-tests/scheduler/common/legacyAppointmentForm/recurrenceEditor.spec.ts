import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot, getContainerUrl, setupTestPage } from '../../../../playwright-helpers';

const containerUrl = getContainerUrl(__dirname, '../../../../tests/container.html');

test.describe('Appointment Form: recurrence editor', () => {
  test.beforeEach(async ({ page }) => {
    await setupTestPage(page, containerUrl);
  });

  test('Should not reset the recurrence editor value after the repeat toggling', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      dataSource: [],
      views: ['week'],
      currentView: 'week',
      currentDate: '2024-01-01T10:00:00',
      editing: { legacyForm: true },
    });

    const cell = page.locator('.dx-scheduler-date-table-row').nth(0).locator('.dx-scheduler-date-table-cell').nth(0);
    await cell.dblclick();

    const popup = page.locator('.dx-scheduler-appointment-popup');
    const recurrenceSwitch = popup.locator('.dx-recurrence-switch-container .dx-switch');
    await recurrenceSwitch.click();

    await recurrenceSwitch.click();
    await recurrenceSwitch.click();

    const content = popup.locator('.dx-popup-content');
    await testScreenshot(page, 'recurrence-editor_after-hide.png', { element: content });
  });

  test('Should correctly create usual appointment after repeat toggling', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      dataSource: [],
      views: ['week'],
      currentView: 'week',
      currentDate: '2024-01-01T10:00:00',
      editing: { legacyForm: true },
    });

    const cell = page.locator('.dx-scheduler-date-table-row').nth(0).locator('.dx-scheduler-date-table-cell').nth(0);
    await cell.dblclick();

    const popup = page.locator('.dx-scheduler-appointment-popup');
    const recurrenceSwitch = popup.locator('.dx-recurrence-switch-container .dx-switch');
    await recurrenceSwitch.click();
    await recurrenceSwitch.click();

    const doneButton = popup.locator('.dx-popup-done.dx-button');
    await doneButton.click();

    const appointmentCount = await page.locator('.dx-scheduler-appointment').count();
    expect(appointmentCount).toBe(1);
  });

  test('Should correctly create recurrent appointment', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      dataSource: [],
      views: ['week'],
      currentView: 'week',
      currentDate: '2024-01-01T10:00:00',
      editing: { legacyForm: true },
    });

    const cell = page.locator('.dx-scheduler-date-table-row').nth(0).locator('.dx-scheduler-date-table-cell').nth(0);
    await cell.dblclick();

    const popup = page.locator('.dx-scheduler-appointment-popup');
    const recurrenceSwitch = popup.locator('.dx-recurrence-switch-container .dx-switch');
    await recurrenceSwitch.click();

    const doneButton = popup.locator('.dx-popup-done.dx-button');
    await doneButton.click();

    const appointmentCount = await page.locator('.dx-scheduler-appointment').count();
    expect(appointmentCount).toBe(7);
  });
});
