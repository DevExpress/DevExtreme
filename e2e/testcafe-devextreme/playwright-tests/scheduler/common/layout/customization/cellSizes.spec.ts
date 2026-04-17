import { test } from '@playwright/test';
import { createWidget, testScreenshot, insertStylesheetRulesToPage } from '../../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../../tests/container.html')}`;

test.describe('Scheduler: Layout Customization: Cell Sizes', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  const views = [{
    type: 'week',
    groupOrientation: 'horizontal',
  }, {
    type: 'month',
    groupOrientation: 'horizontal',
  }, {
    type: 'timelineWeek',
    groupOrientation: 'vertical',
  }, {
    type: 'timelineMonth',
    groupOrientation: 'vertical',
  }];

  const createSchedulerOnPage = async (
    page: any,
    additionalProps: Record<string, unknown>,
  ): Promise<void> => {
    await createWidget(page, 'dxScheduler', {
      currentDate: new Date(2021, 4, 11),
      height: 500,
      width: 700,
      startDayHour: 9,
      showAllDayPanel: false,
      dataSource: [],
      crossScrollingEnabled: true,
      groups: ['priorityId'],
      resources: [{
        fieldExpr: 'priorityId',
        dataSource: [
          { text: 'Low Priority 1', id: 0, color: '#24ff50' },
          { text: 'Low Priority 2', id: 1, color: '#ff9747' },
          { text: 'Low Priority 3', id: 2, color: '#24ff50' },
          { text: 'High Priority 1', id: 3, color: '#ff9747' },
          { text: 'High Priority 2', id: 4, color: '#24ff50' },
          { text: 'High Priority 3', id: 5, color: '#ff9747' },
        ],
        label: 'Priority',
      }],
      ...additionalProps,
    });
  };

  test('Cell sizes customization should work', async ({ page }) => {
    await insertStylesheetRulesToPage(page, '#container .dx-scheduler-cell-sizes-vertical { height: 150px; } #container .dx-scheduler-cell-sizes-horizontal { width: 150px; }');
    await createSchedulerOnPage(page, { views });

    for (const { type } of views) {
      await page.evaluate((viewType: string) => {
        ($('#container') as any).dxScheduler('instance').option('currentView', viewType);
      }, type);

      await testScreenshot(page, `custom-cell-sizes-in-${type}.png`, {
        element: page.locator('.dx-scheduler-work-space'),
      });
    }
  });

  test('Cell sizes customization should work when all-day panel is enabled', async ({ page }) => {
    await insertStylesheetRulesToPage(page, '#container .dx-scheduler-cell-sizes-vertical { height: 150px; } #container .dx-scheduler-cell-sizes-horizontal { width: 150px; }');
    await createSchedulerOnPage(page, {
      views,
      showAllDayPanel: true,
      currentView: 'week',
    });

    await testScreenshot(page, 'custom-cell-sizes-with-all-day-panel-in-week.png', {
      element: page.locator('.dx-scheduler-work-space'),
    });
  });
});
