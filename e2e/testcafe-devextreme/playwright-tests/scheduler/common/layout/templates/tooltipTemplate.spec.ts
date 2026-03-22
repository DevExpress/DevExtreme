import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../../tests/container.html')}`;

test.describe('Layout:Templates:appointmentTooltipTemplate', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

);

test('appointmentTooltipTemplate layout should be rendered right', async ({ page }) => {
  // --- setup ---
await createWidget(page, 'dxScheduler', {
    dataSource: [{
      startDate: new Date(2017, 4, 25, 0, 30),
      endDate: new Date(2017, 4, 25, 2, 30),
    }],
    views: ['workWeek'],
    currentView: 'workWeek',
    currentDate: new Date(2017, 4, 25),
    appointmentTooltipTemplate: ClientFunction((appointment) => {
      const result = $('<div  style=\'display: flex; flex-wrap: wrap;\' />');

      const startDateBox = ($('<div />') as any).dxDateBox({
        type: 'datetime',
        value: appointment.appointmentData.startDate,
  // --- test ---
// Scheduler on '#container'
    await (scheduler.getAppointmentByIndex().click().element);

  await testScreenshot(page,
    'appointment-tooltip-template.png',
    { element: page.locator('.dx-scheduler') },
  );

  expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
});

      const endDateBox = ($('<div />') as any).dxDateBox({
        type: 'datetime',
        value: appointment.appointmentData.endDate,
      });

      result.append(startDateBox, endDateBox);

      return result;
    }),
    height: 600,
  });
});
});
