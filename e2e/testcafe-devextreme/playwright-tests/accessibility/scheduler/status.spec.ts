import { test } from '@playwright/test';
import { createWidget, a11yCheck } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('Accessibility - Scheduler status', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('scheduler status accessibility check', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      dataSource: [{
        text: 'App 1',
        startDate: new Date(2021, 3, 29, 9, 30),
        endDate: new Date(2021, 3, 29, 11, 30),
      }],
      currentView: 'week',
      currentDate: new Date(2021, 3, 29),
    });
    await a11yCheck(page, {}, '#container');
  });

  test('scheduler status day view with appointments', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      timeZone: 'America/Los_Angeles',
      dataSource: [
        {
          startDate: '2025-04-30T15:00:00.000Z',
          endDate: '2025-04-30T16:00:00.000Z',
        },
      ],
      views: ['day', 'week', 'month'],
      currentView: 'day',
      currentDate: '2025-04-30T15:00:00.000Z',
      showCurrentTimeIndicator: false,
    });
    await a11yCheck(page, {}, '#container');
  });

  test('scheduler status month view with appointments', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      timeZone: 'America/Los_Angeles',
      dataSource: [
        {
          startDate: '2025-04-30T15:00:00.000Z',
          endDate: '2025-04-30T16:00:00.000Z',
        },
      ],
      views: ['day', 'week', 'month'],
      currentView: 'month',
      currentDate: '2025-04-30T15:00:00.000Z',
      showCurrentTimeIndicator: false,
    });
    await a11yCheck(page, {}, '#container');
  });

  test('scheduler status agenda view', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      timeZone: 'America/Los_Angeles',
      dataSource: [
        {
          startDate: '2025-04-30T15:00:00.000Z',
          endDate: '2025-04-30T16:00:00.000Z',
        },
      ],
      views: ['agenda'],
      currentView: 'agenda',
      currentDate: '2025-04-30T15:00:00.000Z',
      showCurrentTimeIndicator: false,
    });
    await a11yCheck(page, {}, '#container');
  });
});
