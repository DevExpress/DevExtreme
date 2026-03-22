import { test, expect } from '@playwright/test';
import { createWidget, getContainerUrl, setupTestPage } from '../../../playwright-helpers';

const containerUrl = getContainerUrl(__dirname, '../../../tests/container.html');

test.describe('Legacy appointment popup form', () => {
  test.beforeEach(async ({ page }) => {
    await setupTestPage(page, containerUrl);
  });

  test('Subject and description fields should be empty after showing popup on empty cell', async ({ page }) => {
    const APPOINTMENT_TEXT = 'Website Re-Design Plan';

    await createWidget(page, 'dxScheduler', {
      views: ['month'],
      currentView: 'month',
      currentDate: new Date(2017, 4, 22),
      height: 600,
      width: 600,
      editing: { legacyForm: true },
      dataSource: [{
        text: APPOINTMENT_TEXT,
        startDate: new Date(2017, 4, 22, 9, 30),
        endDate: new Date(2017, 4, 22, 11, 30),
      }],
    });

    const appointment = page.locator('.dx-scheduler-appointment').filter({ hasText: APPOINTMENT_TEXT });
    await appointment.dblclick();

    const popup = page.locator('.dx-scheduler-appointment-popup');
    const subjectInput = popup.locator('.dx-texteditor-input').first();
    const subjectValue = await subjectInput.inputValue();
    expect(subjectValue).toBe(APPOINTMENT_TEXT);

    const descriptionInput = popup.locator('.dx-texteditor-input').nth(1);
    await descriptionInput.fill('temp');

    const doneButton = popup.locator('.dx-popup-done.dx-button');
    await doneButton.click();

    const cell = page.locator('.dx-scheduler-date-table-row').nth(0).locator('.dx-scheduler-date-table-cell').nth(5);
    await cell.dblclick();

    const subjectValueAfter = await subjectInput.inputValue();
    expect(subjectValueAfter).toBe('');

    const descriptionValueAfter = await descriptionInput.inputValue();
    expect(descriptionValueAfter).toBe('');
  });

  test('Appointment should have correct form data on consecutive shows (T832711)', async ({ page }) => {
    const APPOINTMENT_TEXT = 'Google AdWords Strategy';

    await createWidget(page, 'dxScheduler', {
      views: ['month'],
      currentView: 'month',
      currentDate: new Date(2017, 4, 25),
      endDayHour: 20,
      editing: { legacyForm: true },
      dataSource: [{
        text: APPOINTMENT_TEXT,
        startDate: new Date(2017, 4, 1),
        endDate: new Date(2017, 4, 5),
        allDay: true,
      }],
      height: 580,
    });

    const appointment = page.locator('.dx-scheduler-appointment').filter({ hasText: APPOINTMENT_TEXT });
    await appointment.dblclick();

    const popup = page.locator('.dx-scheduler-appointment-popup');
    await expect(popup).toBeVisible();

    const allDaySwitch = popup.locator('.dx-switch');
    await allDaySwitch.click();

    const cancelButton = popup.locator('.dx-popup-cancel.dx-button');
    await cancelButton.click();

    await expect(popup).not.toBeVisible();

    await appointment.dblclick();
    await expect(popup).toBeVisible();
  });

  test('From elements for disabled appointments should be read only (T835731)', async ({ page }) => {
    const APPOINTMENT_TEXT = 'Install New Router in Dev Room';

    await createWidget(page, 'dxScheduler', {
      dataSource: [{
        text: APPOINTMENT_TEXT,
        startDate: new Date(2017, 4, 22, 14, 30),
        endDate: new Date(2017, 4, 25, 15, 30),
        disabled: true,
        recurrenceRule: 'FREQ=DAILY',
      }],
      editing: { legacyForm: true },
      currentView: 'week',
      recurrenceEditMode: 'series',
      currentDate: new Date(2017, 4, 25),
      startDayHour: 9,
      height: 600,
    });

    const appointment = page.locator('.dx-scheduler-appointment').filter({ hasText: APPOINTMENT_TEXT });
    await appointment.dblclick();

    const popup = page.locator('.dx-scheduler-appointment-popup');
    const subjectInput = popup.locator('.dx-texteditor-input').first();

    const subjectValue = await subjectInput.inputValue();
    expect(subjectValue).toBe(APPOINTMENT_TEXT);
  });

  test('AppointmentForm should display correct dates in work-week when firstDayOfWeek is used', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      views: ['workWeek'],
      currentView: 'workWeek',
      editing: { legacyForm: true },
      currentDate: new Date(2021, 5, 28),
      startDayHour: 5,
      height: 600,
      firstDayOfWeek: 2,
    });

    const cell = page.locator('.dx-scheduler-date-table-row').nth(2).locator('.dx-scheduler-date-table-cell').nth(4);
    await cell.dblclick();

    const popup = page.locator('.dx-scheduler-appointment-popup');
    const startDateInput = popup.locator('.dx-texteditor-input').nth(2);
    const startDateValue = await startDateInput.inputValue();
    expect(startDateValue).toBe('6/28/2021, 6:00 AM');
  });
});
