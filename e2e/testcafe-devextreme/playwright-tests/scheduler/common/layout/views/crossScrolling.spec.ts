import { test } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../../tests/container.html')}`;

test.describe('Scheduler: View with cross-scrolling', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('Scrollable synchronization should work after changing current date (T1027231)', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      views: [{ type: 'week', name: 'Horizontal Grouping', groupOrientation: 'horizontal', cellDuration: 30, intervalCount: 2 }],
      currentView: 'Horizontal Grouping', crossScrollingEnabled: true, currentDate: new Date(2021, 3, 21),
      groups: ['priorityId'],
      resources: [{ fieldExpr: 'priorityId', allowMultiple: false, dataSource: [{ text: 'Low Priority', id: 1, color: '#1e90ff' }, { text: 'High Priority', id: 2, color: '#ff9747' }], label: 'Priority' }],
      height: 600,
    });
    await page.evaluate(() => { ($('#container') as any).dxScheduler('instance').option('currentDate', new Date(2021, 4, 5)); });
    await page.evaluate(() => { ($('#container') as any).dxScheduler('instance').scrollTo(new Date(2021, 4, 15), { priorityId: 2 }); });
    await testScreenshot(page, 'cross-scrolling-sync.png', { element: page.locator('.dx-scheduler-work-space') });
  });

  test('Scrollable should be prepared correctly after change visibility (T1032171)', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      dataSource: [], views: ['timelineMonth'], currentView: 'timelineMonth', currentDate: new Date(2021, 1, 2),
      firstDayOfWeek: 0, startDayHour: 8, endDayHour: 20, cellDuration: 60, visible: false, height: 400,
    });
    await page.evaluate(() => { ($('#container') as any).dxScheduler('instance').option('visible', true); });
    await page.evaluate(() => { ($('#container') as any).dxScheduler('instance').scrollTo(new Date(2021, 1, 12)); });
    await testScreenshot(page, 'cross-scrolling-sync-visibility.png', { element: page.locator('.dx-scheduler-work-space') });
  });
});
