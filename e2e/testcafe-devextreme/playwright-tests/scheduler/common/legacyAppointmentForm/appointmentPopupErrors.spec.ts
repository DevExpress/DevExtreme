import { test, expect } from '@playwright/test';
import { createWidget } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

test.describe('Appointment Popup errors check', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

);

// NOTE: This test case requires page reloading,
// without page reloads the getBrowserConsoleMessages will return undefined.
test('Appointment popup shouldn\'t raise error if appointment is recursive', async ({ page }) => {
  // --- setup ---
const data = [{
    text: 'Meeting of Instructors',
    startDate: new Date('2020-11-01T17:00:00.000Z'),
    endDate: new Date('2020-11-01T17:15:00.000Z'),
    recurrenceRule: 'FREQ=DAILY;BYDAY=TU;UNTIL=20201203',
  }];

  return createWidget(page, 'dxScheduler', {
    timeZone: 'America/Los_Angeles',
    dataSource: data,
    currentView: 'month',
    currentDate: new Date(2020, 10, 25),
    height: 600,
    editing: {
      legacyForm: true,
    },
  // --- test ---
// Scheduler on '#container'
  await (page.locator('.dx-scheduler-appointment').filter({ hasText: 'Meeting of Instructors' }).dblclick().element);
  await (Scheduler.getEditRecurrenceDialog().click().series);

  const consoleMessages = await t.getBrowserConsoleMessages();
  expect(consoleMessages.error.length).toBe(0);
});
});
});
