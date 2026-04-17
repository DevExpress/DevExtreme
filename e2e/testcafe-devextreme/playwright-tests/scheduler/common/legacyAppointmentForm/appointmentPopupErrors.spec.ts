import { test, expect } from '@playwright/test';
import { createWidget, getContainerUrl, setupTestPage } from '../../../../playwright-helpers';

const containerUrl = getContainerUrl(__dirname, '../../../../tests/container.html');

test.describe.skip('Appointment Popup errors check', () => {
  test.beforeEach(async ({ page }) => {
    await setupTestPage(page, containerUrl);
  });

  test("Appointment popup shouldn't raise error if appointment is recursive", async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    await createWidget(page, 'dxScheduler', {
      timeZone: 'America/Los_Angeles',
      dataSource: [{
        text: 'Meeting of Instructors',
        startDate: new Date('2020-11-01T17:00:00.000Z'),
        endDate: new Date('2020-11-01T17:15:00.000Z'),
        recurrenceRule: 'FREQ=DAILY;BYDAY=TU;UNTIL=20201203',
      }],
      currentView: 'month',
      currentDate: new Date(2020, 10, 25),
      height: 600,
      editing: { legacyForm: true },
    });

    const appointment = page.locator('.dx-scheduler-appointment').filter({ hasText: 'Meeting of Instructors' });
    await appointment.dblclick();

    const dialog = page.locator('.dx-dialog');
    const seriesBtn = dialog.locator('.dx-dialog-button').last();
    await seriesBtn.click();

    expect(consoleErrors.length).toBe(0);
  });
});
