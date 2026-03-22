import { test, expect } from '@playwright/test';
import { createWidget, getContainerUrl, setupTestPage } from '../../../../playwright-helpers';

const containerUrl = getContainerUrl(__dirname, '../../../../tests/container.html');

const schedulerOptions = {
  dataSource: [{
    text: 'Website Re-Design Plan',
    startDate: new Date(2021, 2, 30, 11),
    endDate: new Date(2021, 2, 30, 12),
    recurrenceRule: 'FREQ=DAILY;UNTIL=20211029T205959Z',
  }],
  recurrenceEditMode: 'series',
  views: ['week'],
  currentView: 'week',
  currentDate: new Date(2021, 2, 28),
  startDayHour: 9,
  height: 600,
  editing: { legacyForm: true },
};

test.describe('Appointment popup form:date editors', () => {
  test.beforeEach(async ({ page }) => {
    await setupTestPage(page, containerUrl);
  });

  test('Form date editors should pass numeric chars according by date mask', async ({ page }) => {
    await createWidget(page, 'dxScheduler', schedulerOptions);

    const appointment = page.locator('.dx-scheduler-appointment').filter({ hasText: 'Website Re-Design Plan' });
    await appointment.dblclick();

    const popup = page.locator('.dx-scheduler-appointment-popup');
    const subjectInput = popup.locator('.dx-texteditor-input').first();
    await subjectInput.click();

    await page.keyboard.press('Tab');
    const startDateInput = popup.locator('.dx-texteditor-input').nth(2);
    await startDateInput.fill('111111111111');
    const startDateValue = await startDateInput.inputValue();
    expect(startDateValue).toBe('11/11/1111, 11:11 AM');
  });

  test('Form date editors should not pass chars according by date mask', async ({ page }) => {
    await createWidget(page, 'dxScheduler', schedulerOptions);

    const appointment = page.locator('.dx-scheduler-appointment').filter({ hasText: 'Website Re-Design Plan' });
    await appointment.dblclick();

    const popup = page.locator('.dx-scheduler-appointment-popup');
    const startDateInput = popup.locator('.dx-texteditor-input').nth(2);
    await startDateInput.click();
    await startDateInput.fill('TEXT');
    const startDateValue = await startDateInput.inputValue();
    expect(startDateValue).toBe('3/30/2021, 11:00 AM');
  });
});
