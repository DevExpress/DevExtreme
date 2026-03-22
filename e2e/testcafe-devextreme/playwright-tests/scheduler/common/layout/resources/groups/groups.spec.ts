import { test } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../../../tests/container.html')}`;

const resourceDataSource = [{
  fieldExpr: 'priorityId',
  dataSource: [
    { text: 'Low Priority', id: 0, color: '#24ff50' },
    { text: 'High Priority', id: 1, color: '#ff9747' },
  ],
  label: 'Priority',
}];

const createDataSetForScreenShotTests = (): Record<string, unknown>[] => {
  const result: any[] = [];
  for (let day = 1; day < 25; day++) {
    result.push({
      text: '1 appointment', startDate: new Date(2020, 6, day, 0),
      endDate: new Date(2020, 6, day, 1), priorityId: 0,
    });
    result.push({
      text: '2 appointment', startDate: new Date(2020, 6, day, 1),
      endDate: new Date(2020, 6, day, 2), priorityId: 1,
    });
    result.push({
      text: '3 appointment', startDate: new Date(2020, 6, day, 3),
      endDate: new Date(2020, 6, day, 5), allDay: true, priorityId: 0,
    });
  }
  return result;
};

test.describe('Scheduler: Groups layout', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  ['vertical', 'horizontal'].forEach((groupOrientation) => {
    ['agenda', 'day', 'week', 'workWeek', 'month'].forEach((view) => {
      test(`Base views layout test with groups(view='${view}', groupOrientation=${groupOrientation})`, async ({ page }) => {
        await createWidget(page, 'dxScheduler', {
          dataSource: createDataSetForScreenShotTests(),
          currentDate: new Date(2020, 6, 15),
          startDayHour: 0,
          endDayHour: 4,
          views: [{
            type: view,
            name: view,
            groupOrientation,
          }],
          currentView: view,
          crossScrollingEnabled: true,
          resources: resourceDataSource,
          groups: ['priorityId'],
          height: 700,
        });

        await testScreenshot(page, `groups(view=${view}-orientation=${groupOrientation}).png`);
      });
    });
  });

  ['vertical', 'horizontal'].forEach((groupOrientation) => {
    ['timelineDay', 'timelineWeek', 'timelineWorkWeek', 'timelineMonth'].forEach((view) => {
      test(`Timeline views layout test with groups(view='${view}', groupOrientation=${groupOrientation})`, async ({ page }) => {
        await createWidget(page, 'dxScheduler', {
          dataSource: createDataSetForScreenShotTests(),
          currentDate: new Date(2020, 6, 15),
          startDayHour: 0,
          endDayHour: 4,
          views: [{
            type: view,
            name: view,
            groupOrientation,
          }],
          currentView: view,
          crossScrollingEnabled: true,
          resources: resourceDataSource,
          groups: ['priorityId'],
          height: 700,
        });

        await testScreenshot(page, `groups(view=${view}-orientation=${groupOrientation}).png`);
      });
    });
  });
});
