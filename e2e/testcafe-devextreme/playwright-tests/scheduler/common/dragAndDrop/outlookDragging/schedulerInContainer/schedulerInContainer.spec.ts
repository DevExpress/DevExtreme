import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../../../tests/container.html')}`;

test.describe('Outlook dragging, for case scheduler in container', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

);

test('Dragging should be work right in case dxScheduler placed in dxTabPanel', async ({ page }) => {
  // --- setup ---
await createWidget(page, 'dxTabPanel', {
    items: [{
      title: 'Info',
      text: 'This is Info Tab',
    }, {
      title: 'Contacts',
      text: 'This is Contacts Tab',
      disabled: true,
    }],
    itemTemplate: ClientFunction(() => ($('<div />') as any).dxScheduler({
      dataSource: [{
        text: 'Website Re-Design Plan',
        startDate: new Date(2021, 2, 30, 11),
        endDate: new Date(2021, 2, 30, 12),
      }],
      views: ['week', 'month'],
      currentView: 'week',
      currentDate: new Date(2021, 2, 28),
      startDayHour: 9,
      height: 600,
    })),
  // --- test ---
// Scheduler on '.dx-scheduler'

    const draggableAppointment = page.locator('.dx-scheduler-appointment').filter({ hasText: 'Website Re-Design Plan' });

  await /* TODO: drag */ await (draggableAppointment.element).click() /* drag(0, 120) */;

  await testScreenshot(page, 'dxScheduler-placed-in-dxTabPanel-drag-to-bottom.png');

  await /* TODO: drag */ await (draggableAppointment.element).click() /* drag(0, -170) */;

  await testScreenshot(page, 'dxScheduler-placed-in-dxTabPanel-drag-to-top.png');

  await /* TODO: drag */ await (draggableAppointment.element).click() /* drag(100, 0) */;

  await testScreenshot(page, 'dxScheduler-placed-in-dxTabPanel-drag-to-right.png');

  expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
});
});
});
