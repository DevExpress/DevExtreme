import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../../tests/container.html')}`;

test.describe('AppointmentForm screenshot tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

);

// visual: generic.light
// visual: fluent.blue.light
// visual: material.blue.light
test('Appointemt form tests', async ({ page }) => {
  // --- setup ---
await createWidget(page, 'dxScheduler', {
    currentDate: new Date(2021, 1, 1),
    editing: { legacyForm: true },
  // --- test ---
// Scheduler on '#container'
  const { legacyAppointmentPopup: appointmentPopup } = scheduler;

    await (page.locator('.dx-scheduler-date-table-row').nth(0).locator('.dx-scheduler-date-table-cell').nth(0).dblclick());

  await testScreenshot(page, 'initial-form.png', {
    element: appointmentPopup.content,
  });

  await (appointmentPopup.allDayElement).click()
    .click(appointmentPopup.recurrenceElement);

  await testScreenshot(page, 'allday-and-reccurence-form.png', {
    element: appointmentPopup.content,
  });

  expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
});
});
});
