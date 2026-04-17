import { test, expect } from '@playwright/test';
import { testScreenshot } from '../../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../../tests/container.html')}`;

test.describe('Layout:Templates:CellTemplate', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  ['day', 'workWeek', 'month', 'timelineDay', 'timelineWorkWeek', 'timelineMonth'].forEach((currentView) => {
    test(`dataCellTemplate and dateCellTemplate layout should be rendered right in '${currentView}'`, async ({ page }) => {
      await page.evaluate((view: string) => {
        (window as any).DevExpress.fx.off = true;
        ($('#container') as any).dxScheduler({
          dataSource: [], views: [view], currentView: view, currentDate: new Date(2017, 4, 25),
          showAllDayPanel: false,
          dataCellTemplate(itemData: any) { return ($('<div />') as any).dxDateBox({ type: 'time', value: itemData.startDate }); },
          dateCellTemplate(itemData: any) { return ($('<div />') as any).dxTextBox({ value: new Intl.DateTimeFormat('en-US').format(itemData.date) }); },
          height: 600,
        });
      }, currentView);
      await testScreenshot(page, `data-cell-template-currentView=${currentView}.png`, { element: page.locator('.dx-scheduler-work-space') });
    });
  });

  test('[T1251590] Async dateCellTemplate should be rendered only once', async ({ page }) => {
    await page.evaluate(() => {
      (window as any).DevExpress.fx.off = true;
      ($('#container') as any).dxScheduler({
        dataSource: [{ startDate: '2024-01-01T01:00:00', endDate: '2024-01-01T02:00:00', allDay: true }],
        dateCellTemplate(_: any, __: any, itemElement: any) { setTimeout(() => { itemElement.append('TEST'); }, 0); },
        currentDate: '2024-01-01', currentView: 'week',
      });
    });
    await page.waitForTimeout(100);
    expect(await page.locator('.dx-scheduler-header-panel-cell').nth(0).textContent()).toBe('TEST');
  });

  test('[T1251590] Async dateCellTemplate should be rendered only once if has reference props (grouping)', async ({ page }) => {
    await page.evaluate(() => {
      (window as any).DevExpress.fx.off = true;
      ($('#container') as any).dxScheduler({
        dataSource: [{ startDate: '2024-01-01T01:00:00', endDate: '2024-01-01T02:00:00', allDay: true }],
        groups: ['groupId'],
        resources: [{ label: 'group', fieldExpr: 'groupId', dataSource: [{ text: 'A', id: 0, color: '#00af2c' }] }],
        dateCellTemplate(_: any, __: any, itemElement: any) { setTimeout(() => { itemElement.append('TEST'); }, 0); },
        currentDate: '2024-01-01', currentView: 'week',
      });
    });
    await page.waitForTimeout(100);
    expect(await page.locator('.dx-scheduler-header-panel-cell').nth(0).textContent()).toBe('TEST');
  });
});
