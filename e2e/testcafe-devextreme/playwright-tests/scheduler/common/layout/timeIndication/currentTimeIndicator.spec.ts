import { test } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../../tests/container.html')}`;

test.describe.skip('Scheduler: Current Time Indication', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('Current time indicator should be placed correctly when there are many groups and orientation is horizontal', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      dataSource: [],
      currentDate: new Date(2021, 7, 1),
      height: 400,
      width: 700,
      startDayHour: 5,
      indicatorTime: new Date(2021, 7, 1, 6),
      currentView: 'day',
      views: ['day', 'week'],
      groups: ['groupId'],
      resources: [{
        fieldExpr: 'groupId',
        label: 'group',
        dataSource: [
          { text: 'Group 1', id: 1 },
          { text: 'Group 2', id: 2 },
          { text: 'Group 3', id: 3 },
          { text: 'Group 4', id: 4 },
          { text: 'Group 5', id: 5 },
          { text: 'Group 6', id: 6 },
        ],
      }],
    });

    for (const view of ['day', 'week']) {
      await page.evaluate((v: string) => {
        ($('#container') as any).dxScheduler('instance').option('currentView', v);
      }, view);

      await testScreenshot(
        page,
        `current-time-indicator-in-${view}-with-many-groups.png`,
        { element: page.locator('.dx-scheduler-work-space') },
      );
    }
  });

  const TIMELINE_VIEWS = ['timelineDay', 'timelineWeek', 'timelineMonth'];

  [
    'none',
    'vertical',
    'horizontal',
  ].forEach((grouping) => {
    [
      { view: 'day', cellDuration: 240 },
      { view: 'week', cellDuration: 240 },
      { view: 'timelineDay', cellDuration: 360 },
      { view: 'timelineWeek', cellDuration: 360 },
      { view: 'timelineMonth', cellDuration: 60 },
    ].forEach(({ view, cellDuration }) => {
      [
        [0, 24],
        [6, 18],
      ].forEach(([startDayHour, endDayHour]) => {
        [
          '2023-12-03T00:00:00',
          '2023-12-03T06:30:00',
          '2023-12-03T12:00:00',
          '2023-12-03T17:30:00',
          '2023-12-03T23:59:59',
        ].forEach((indicatorTime) => {
          if (grouping === 'horizontal' && TIMELINE_VIEWS.includes(view)) {
            return;
          }
          if (view === 'timelineMonth' && startDayHour !== 0 && endDayHour !== 24) {
            return;
          }

          test(`Current time indicator should be rendered correctly (view: ${view}, now: ${indicatorTime}, grouping: ${grouping}, startDayHour: ${startDayHour}, endDayHour: ${endDayHour})`, async ({ page }) => {
            const additionalOptions = grouping === 'none'
              ? {
                views: [{ type: view, name: 'TEST_VIEW' }],
              }
              : {
                views: [{ type: view, name: 'TEST_VIEW', groupOrientation: grouping }],
                groups: ['any'],
                resources: [{
                  fieldExpr: 'any',
                  dataSource: [
                    { text: 'Group_0', id: 0 },
                    { text: 'Group_1', id: 1 },
                  ],
                }],
              };

            await createWidget(page, 'dxScheduler', {
              dataSource: [],
              currentView: 'TEST_VIEW',
              shadeUntilCurrentTime: true,
              currentDate: indicatorTime,
              startDayHour,
              endDayHour,
              indicatorTime,
              cellDuration,
              ...additionalOptions,
            });

            await testScreenshot(
              page,
              `current-time-indicator_${view}_${indicatorTime.replace(/:/g, '-')}_g-${grouping}_${startDayHour}_${endDayHour}.png`,
              { element: page.locator('.dx-scheduler-work-space') },
            );
          });
        });
      });
    });
  });
});
