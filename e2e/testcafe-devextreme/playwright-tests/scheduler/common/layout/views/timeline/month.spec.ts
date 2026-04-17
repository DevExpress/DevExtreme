import { test } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../../../tests/container.html')}`;

test.describe('Scheduler: Layout Views: Timeline Month', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('Header cells should be aligned with date-table cells in timeline-month when current date changes', async ({ page }) => {
    await createWidget(page, 'dxScheduler', { currentDate: new Date(2020, 10, 1), currentView: 'timelineMonth', height: 600, views: ['timelineMonth'], crossScrollingEnabled: true });
    await page.evaluate(() => { ($('#container') as any).dxScheduler('instance').option('currentDate', new Date(2020, 11, 1)); });
    await testScreenshot(page, 'timeline-month-change-current-date.png');
  });
});
