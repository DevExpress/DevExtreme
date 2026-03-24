import { test } from '@playwright/test';
import { createWidget, a11yCheck } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('Accessibility - Scheduler appointment', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  ['month', 'week', 'day'].forEach((currentView) => {
    test(`appointment accessibility in ${currentView} view`, async ({ page }) => {
      await createWidget(page, 'dxScheduler', {
        timeZone: 'UTC',
        dataSource: [{
          text: 'App 1',
          startDate: new Date(Date.UTC(2021, 1, 1, 12)),
          endDate: new Date(Date.UTC(2021, 1, 1, 13)),
        }],
        currentView,
        currentDate: new Date(Date.UTC(2021, 1, 1)),
      });
      await a11yCheck(page, {}, '#container');
    });
  });
});
