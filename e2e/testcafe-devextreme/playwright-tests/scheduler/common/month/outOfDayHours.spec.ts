import { test, expect } from '@playwright/test';
import { createWidget } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

test.describe('Scheduler: take into account start and end day hour', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('Should show appointment in month view', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      dataSource: [{
        startDate: '2024-01-01T11:00:00',
        endDate: '2024-01-01T12:00:00',
        text: 'test',
      }],
      startDayHour: 11,
      endDayHour: 22,
      currentDate: '2024-01-01',
      views: ['month', 'timelineMonth'],
      currentView: 'month',
    });

    await expect(page.locator('.dx-scheduler-appointment').filter({ hasText: 'test' })).toBeVisible();
  });

  test('Should not show appointment in month view', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      dataSource: [{
        startDate: '2024-01-01T11:00:00',
        endDate: '2024-01-01T12:00:00',
        text: 'test',
      }],
      startDayHour: 13,
      endDayHour: 22,
      currentDate: '2024-01-01',
      views: ['month', 'timelineMonth'],
      currentView: 'month',
    });

    await expect(page.locator('.dx-scheduler-appointment').filter({ hasText: 'test' })).toHaveCount(0);
  });
});
