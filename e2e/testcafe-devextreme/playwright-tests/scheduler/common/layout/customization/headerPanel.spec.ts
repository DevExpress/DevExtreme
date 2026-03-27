import { test } from '@playwright/test';
import { createWidget, testScreenshot, insertStylesheetRulesToPage } from '../../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../../tests/container.html')}`;

test.describe('Scheduler: Layout Customization: Header Panel', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  const views = [
    { type: 'week', groupOrientation: 'horizontal' },
    { type: 'month', groupOrientation: 'horizontal' },
    { type: 'timelineWeek', groupOrientation: 'horizontal' },
    { type: 'timelineMonth', groupOrientation: 'horizontal' },
  ];

  test('Header panel customization should work', async ({ page }) => {
    for (const crossScrollingEnabled of [false, true]) {
      await insertStylesheetRulesToPage(page, '#container .dx-scheduler-group-header, #container .dx-scheduler-header-panel-cell { height: 100px; }');

      await createWidget(page, 'dxScheduler', {
        currentDate: new Date(2021, 4, 11),
        height: 500,
        width: 700,
        startDayHour: 9,
        showAllDayPanel: false,
        dataSource: [{
          text: 'Create Report on Customer Feedback',
          startDate: new Date(2021, 4, 11, 14),
          endDate: new Date(2021, 4, 11, 15),
          priorityId: 0,
        }, {
          text: 'Review Customer Feedback Report',
          startDate: new Date(2021, 4, 9, 9, 30),
          endDate: new Date(2021, 4, 9, 11),
          priorityId: 0,
        }],
        groups: ['priorityId'],
        resources: [{
          fieldExpr: 'priorityId',
          dataSource: [
            { text: 'Low Priority', id: 0, color: '#24ff50' },
            { text: 'High Priority', id: 1, color: '#ff9747' },
          ],
          label: 'Priority',
        }],
        views,
        crossScrollingEnabled,
      });

      for (const view of views) {
        await page.evaluate((viewType: string) => {
          ($('#container') as any).dxScheduler('instance').option('currentView', viewType);
        }, view.type);

        await testScreenshot(
          page,
          `custom-header-panel-in-${view.type}-cross-scrolling=${crossScrollingEnabled}.png`,
          { element: page.locator('.dx-scheduler') },
        );
      }
    }
  });
});
