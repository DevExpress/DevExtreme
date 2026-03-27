import { test } from '@playwright/test';
import { createWidget, a11yCheck } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('Accessibility - Scheduler legacyPopup', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('legacy popup accessibility check', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      dataSource: [],
      currentView: 'week',
      currentDate: new Date(2021, 3, 29),
    });
    await a11yCheck(page, {}, '#container');
  });

  test('edit appointment with legacy form', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      timeZone: 'America/Los_Angeles',
      dataSource: [{
        text: 'Install New Router in Dev Room',
        startDate: new Date('2021-03-29T21:30:00.000Z'),
        endDate: new Date('2021-03-29T22:30:00.000Z'),
        recurrenceRule: 'FREQ=DAILY',
      }],
      editing: { legacyForm: true },
      recurrenceEditMode: 'series',
      currentView: 'week',
      currentDate: new Date(2021, 2, 28),
    });
    await page.dblclick('.dx-scheduler-appointment');
    await page.waitForSelector('.dx-scheduler-appointment-popup');
    await a11yCheck(page, {}, '#container');
  });

  test('recurrence editor repeat end accessibility', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      timeZone: 'America/Los_Angeles',
      editing: { legacyForm: true },
      dataSource: [{
        text: 'Install New Router in Dev Room',
        startDate: new Date('2021-03-29T21:30:00.000Z'),
        endDate: new Date('2021-03-29T22:30:00.000Z'),
        recurrenceRule: 'FREQ=DAILY;UNTIL=20250522T215959Z',
      }],
      recurrenceEditMode: 'series',
      currentView: 'week',
      currentDate: new Date('2021-03-29T21:30:00.000Z'),
    });
    await page.dblclick('.dx-scheduler-appointment');
    await page.waitForSelector('.dx-scheduler-appointment-popup');
    await a11yCheck(page, {}, '#container');
  });
});
