import { test } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../../tests/container.html')}`;

const resourceDataSource = [{
  fieldExpr: 'priorityId',
  dataSource: [
    { text: 'Low Priority', id: 0, color: '#24ff50' },
    { text: 'High Priority', id: 1, color: '#ff9747' },
  ],
  label: 'Priority',
}];

const views = [
  'day', 'week', 'month',
  'timelineDay', 'timelineWeek', 'timelineMonth',
];

const verticalViews = views.map((viewType) => ({
  type: viewType,
  groupOrientation: 'vertical',
}));

const horizontalViews = views.map((viewType) => ({
  type: viewType,
  groupOrientation: 'horizontal',
}));

const createDataSetForScreenShotTests = (): Record<string, unknown>[] => {
  const result: any[] = [];
  for (let day = 1; day < 25; day++) {
    result.push({
      text: '1 appointment',
      startDate: new Date(2020, 6, day, 0),
      endDate: new Date(2020, 6, day, 1),
      priorityId: 0,
    });
    result.push({
      text: '2 appointment',
      startDate: new Date(2020, 6, day, 1),
      endDate: new Date(2020, 6, day, 2),
      priorityId: 1,
    });
    result.push({
      text: '3 appointment',
      startDate: new Date(2020, 6, day, 3),
      endDate: new Date(2020, 6, day, 5),
      allDay: true,
      priorityId: 0,
    });
  }
  return result;
};

test.describe('Scheduler: Adaptive layout in themes', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  [false, true].forEach((rtlEnabled) => {
    [false, true].forEach((crossScrollingEnabled) => {
      test(`Adaptive views layout test, crossScrollingEnabled=${crossScrollingEnabled}${rtlEnabled ? ' in RTL' : ''}`, async ({ page }) => {
        await page.setViewportSize({ width: 400, height: 600 });

        await createWidget(page, 'dxScheduler', {
          dataSource: createDataSetForScreenShotTests(),
          currentDate: new Date(2020, 6, 15),
          height: 600,
          views,
          currentView: 'day',
          crossScrollingEnabled,
          rtlEnabled,
        });

        for (const view of views) {
          await page.evaluate((v: string) => {
            ($('#container') as any).dxScheduler('instance').option('currentView', v);
          }, view);

          await testScreenshot(
            page,
            `view=${view}-crossScrolling=${crossScrollingEnabled}${rtlEnabled ? '-rtl' : ''}.png`,
            { element: page.locator('.dx-scheduler-work-space') },
          );
        }
      });

      test(`Adaptive views layout test crossScrollingEnabled=${crossScrollingEnabled} when horizontal grouping${rtlEnabled ? ' and RTL are' : ' is'} used`, async ({ page }) => {
        await page.setViewportSize({ width: 400, height: 600 });

        await createWidget(page, 'dxScheduler', {
          dataSource: createDataSetForScreenShotTests(),
          currentDate: new Date(2020, 6, 15),
          height: 600,
          views: horizontalViews,
          currentView: 'day',
          crossScrollingEnabled,
          rtlEnabled,
          groups: ['priorityId'],
          resources: resourceDataSource,
        });

        for (const view of views) {
          await page.evaluate((v: string) => {
            ($('#container') as any).dxScheduler('instance').option('currentView', v);
          }, view);

          await testScreenshot(
            page,
            `view=${view}-crossScrolling=${crossScrollingEnabled}-horizontal${rtlEnabled ? '-rtl' : ''}.png`,
            { element: page.locator('.dx-scheduler-work-space') },
          );
        }
      });

      test(`Adaptive views layout test, crossScrollingEnabled=${crossScrollingEnabled} when vertical grouping${rtlEnabled ? ' and RTL are' : ' is'} used`, async ({ page }) => {
        await page.setViewportSize({ width: 400, height: 600 });

        await createWidget(page, 'dxScheduler', {
          dataSource: createDataSetForScreenShotTests(),
          currentDate: new Date(2020, 6, 15),
          height: 600,
          views: verticalViews,
          currentView: 'day',
          crossScrollingEnabled,
          rtlEnabled,
          groups: ['priorityId'],
          resources: resourceDataSource,
        });

        for (const view of views) {
          await page.evaluate((v: string) => {
            ($('#container') as any).dxScheduler('instance').option('currentView', v);
          }, view);

          await testScreenshot(
            page,
            `view=${view}-crossScrolling=${crossScrollingEnabled}-vertical${rtlEnabled ? '-rtl' : ''}.png`,
            { element: page.locator('.dx-scheduler-work-space') },
          );
        }
      });
    });
  });
});
