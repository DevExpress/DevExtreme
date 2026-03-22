import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot, setStyleAttribute } from '../../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../../tests/container.html')}`;

test.describe('Outlook dragging base tests in shifted container', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

);

test('Basic drag-n-drop movements in shifted container', async ({ page }) => {
  // --- setup ---
await setStyleAttribute(Selector('#container'), 'margin-left: 50px; margin-top: 70px;');

  return createWidget(page, 'dxScheduler', {
    dataSource: [{
      text: 'Website Re-Design Plan',
      startDate: new Date(2021, 2, 22, 10),
      endDate: new Date(2021, 2, 22, 12, 30),
    }],
    views: ['week'],
    currentView: 'week',
    currentDate: new Date(2021, 2, 22),
    startDayHour: 9,
    height: 600,
    width: 950,
  // --- test ---
// Scheduler on '#container'
  const draggableAppointment = page.locator('.dx-scheduler-appointment').filter({ hasText: 'Website Re-Design Plan' });

    await t.drag(draggableAppointment.element, 100, 0, { speed: 0.5 });

  await testScreenshot(page, 'drag-n-drop-to-right-in-shifted-container.png', { element: page.locator('.dx-scheduler-work-space') });

  await t.drag(draggableAppointment.element, -100, 0, { speed: 0.5 });

  await testScreenshot(page, 'drag-n-drop-to-left-in-shifted-container.png', { element: page.locator('.dx-scheduler-work-space') });

  await t.drag(draggableAppointment.element, 0, 100, { speed: 0.5 });

  await testScreenshot(page, 'drag-n-drop-to-bottom-in-shifted-container.png', { element: page.locator('.dx-scheduler-work-space') });

  await t.drag(draggableAppointment.element, 0, -100, { speed: 0.5 });

  await testScreenshot(page, 'drag-n-drop-to-top-in-shifted-container.png', { element: page.locator('.dx-scheduler-work-space') });

  expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
});
});
});
