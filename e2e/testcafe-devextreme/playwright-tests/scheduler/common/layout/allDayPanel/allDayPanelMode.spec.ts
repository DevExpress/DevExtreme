import { test, expect } from '@playwright/test';
import { createWidget } from '../../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../../tests/container.html')}`;

test.describe('Layout:AllDayPanelMode', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  [
    {
      testCaseName: 'Usual appointment',
      dataSource: [{ startDate: '2023-12-01T00:00:00', endDate: '2023-12-01T10:00:00', text: 'Usual appt' }],
      modesOrder: ['all', 'allDay', 'hidden'],
      expectedCollapsed: [true, true, false],
      expectedVisible: [true, true, false],
    },
    {
      testCaseName: 'Usual appointment reverse',
      dataSource: [{ startDate: '2023-12-01T00:00:00', endDate: '2023-12-01T10:00:00', text: 'Usual appt' }],
      modesOrder: ['hidden', 'allDay', 'all'],
      expectedCollapsed: [false, true, true],
      expectedVisible: [false, true, true],
    },
    {
      testCaseName: 'Long appointment',
      dataSource: [{ startDate: '2023-12-01T00:00:00', endDate: '2024-01-01T00:00:00', text: 'Long appt' }],
      modesOrder: ['all', 'allDay', 'hidden'],
      expectedCollapsed: [false, true, false],
      expectedVisible: [true, true, false],
    },
    {
      testCaseName: 'Long appointment reverse',
      dataSource: [{ startDate: '2023-12-01T00:00:00', endDate: '2024-01-01T00:00:00', text: 'Long appt' }],
      modesOrder: ['hidden', 'allDay', 'all'],
      expectedCollapsed: [false, true, false],
      expectedVisible: [false, true, true],
    },
    {
      testCaseName: 'All-day appointment',
      dataSource: [{
        startDate: '2023-12-01T00:00:00', endDate: '2023-12-01T00:00:00', text: 'All-day appt', allDay: true,
      }],
      modesOrder: ['all', 'allDay', 'hidden'],
      expectedCollapsed: [false, false, false],
      expectedVisible: [true, true, false],
    },
    {
      testCaseName: 'All-day appointment reverse',
      dataSource: [{
        startDate: '2023-12-01T00:00:00', endDate: '2023-12-01T00:00:00', text: 'All-day appt', allDay: true,
      }],
      modesOrder: ['hidden', 'allDay', 'all'],
      expectedCollapsed: [false, false, false],
      expectedVisible: [false, true, true],
    },
  ].forEach(({
    testCaseName, dataSource, modesOrder, expectedCollapsed, expectedVisible,
  }) => {
    test(`${testCaseName}: AllDayPanel visibility and collapsed state should be correct in runtime`, async ({ page }) => {
      await createWidget(page, 'dxScheduler', {
        currentView: 'week',
        currentDate: '2023-12-01',
        dataSource,
      });

      for (let idx = 0; idx < modesOrder.length; idx++) {
        const mode = modesOrder[idx];

        await page.evaluate((m: string) => {
          ($('#container') as any).dxScheduler('instance').option('allDayPanelMode', m);
        }, mode);

        const isCollapsed = await page.evaluate(() => {
          const allDayTable = document.querySelector('.dx-scheduler-all-day-table');
          if (!allDayTable) return false;
          const row = allDayTable.querySelector('tr');
          if (!row) return false;
          return row.getBoundingClientRect().height === 0;
        });

        const isVisible = await page.locator('.dx-scheduler-all-day-table-row').count() > 0;

        expect(isCollapsed).toBe(
          expectedCollapsed[idx],
        );
        expect(isVisible).toBe(
          expectedVisible[idx],
        );
      }
    });
  });
});
