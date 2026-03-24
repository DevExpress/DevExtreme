import { test } from '@playwright/test';
import { createWidget, a11yCheck } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('Accessibility - Scheduler', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('month view accessibility check', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      dataSource: [],
      currentView: 'month',
    });
    await a11yCheck(page, {}, '#container');
  });

  ['day', 'week', 'workWeek', 'month', 'agenda'].forEach((currentView) => {
    test(`${currentView} view with appointment`, async ({ page }) => {
      await createWidget(page, 'dxScheduler', {
        timeZone: 'America/Los_Angeles',
        dataSource: [{
          text: 'Website Re-Design Plan',
          startDate: new Date('2021-04-29T16:30:00.000Z'),
          endDate: new Date('2021-04-29T18:30:00.000Z'),
        }],
        currentView,
        currentDate: new Date(2021, 3, 29),
        startDayHour: 9,
      });
      await a11yCheck(page, {}, '#container');
    });
  });
});
