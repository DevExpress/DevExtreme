import type { Page } from '@playwright/test';
import { test } from '../../../../../fixtures';
import { createWidget } from '../../../../../helpers/createWidget';
import { insertStylesheetRulesToPage } from '../../../../../helpers/domUtils';
import { testScreenshot } from '../../../../../helpers/screenshots';
import Scheduler from '../../../../../models/scheduler';

const views = ['day', 'week', 'timelineDay', 'timelineWeek', 'timelineMonth'];
const style = `
.dx-scheduler-date-time-shader-top::before,
.dx-scheduler-date-time-shader-bottom::before,
.dx-scheduler-timeline .dx-scheduler-date-time-shader::before,
.dx-scheduler-date-time-shader-all-day {
  background-color: red !important;
}`;

const createScheduler = async (
  page: Page,
  additionalProps: Record<string, unknown>,
): Promise<void> => {
  await createWidget(page, 'dxScheduler', {
    dataSource: [],
    currentDate: new Date(2021, 7, 1),
    height: 400,
    width: 700,
    startDayHour: 5,
    indicatorTime: new Date(2021, 7, 1, 6),
    currentView: 'day',
    resources: [{
      fieldExpr: 'priorityId',
      dataSource: [
        {
          text: 'Low Priority',
          id: 0,
          color: '#24ff50',
        }, {
          text: 'High Priority',
          id: 1,
          color: '#ff9747',
        },
      ],
      label: 'Priority',
    }],
    shadeUntilCurrentTime: true,
    ...additionalProps,
  });
};

[false, true].forEach((crossScrollingEnabled) => {
  test(`Shader should be displayed correctly when crossScrollingEnabled=${crossScrollingEnabled}`, async ({ page }) => {
    await insertStylesheetRulesToPage(page, style);
    await createScheduler(page, {
      views,
      crossScrollingEnabled,
    });

    const scheduler = new Scheduler(page, '#container');

    for (const view of views) {
      await scheduler.option('currentView', view);

      await testScreenshot(
        page,
        `shader-in-${view}-crossScrolling=${crossScrollingEnabled}.png`,
        { element: scheduler.workSpace },
      );
    }
  });

  test(`Shader should be displayed correctly when crossScrollingEnabled=${crossScrollingEnabled} and horizontal grouping is used`, async ({ page }) => {
    await insertStylesheetRulesToPage(page, style);
    await createScheduler(page, {
      views: [{
        type: 'day',
        groupOrientation: 'horizontal',
      }, {
        type: 'week',
        groupOrientation: 'horizontal',
      }, {
        type: 'tiemlineDay',
        groupOrientation: 'horizontal',
      }, {
        type: 'timelineWeek',
        groupOrientation: 'horizontal',
      }, {
        type: 'timelineMonth',
        groupOrientation: 'horizontal',
      }],
      crossScrollingEnabled,
      groups: ['priorityId'],
    });

    const scheduler = new Scheduler(page, '#container');

    for (const view of views) {
      await scheduler.option('currentView', view);

      await testScreenshot(
        page,
        `shader-in-${view}-crossScrolling=${crossScrollingEnabled}-horizontal-grouping.png`,
        { element: scheduler.workSpace },
      );
    }
  });

  test(`Shader should be displayed correctly when crossScrollingEnabled=${crossScrollingEnabled} and vertical grouping is used`, async ({ page }) => {
    await insertStylesheetRulesToPage(page, style);
    await createScheduler(page, {
      views: [{
        type: 'day',
        groupOrientation: 'vertical',
      }, {
        type: 'week',
        groupOrientation: 'vertical',
      }, {
        type: 'tiemlineDay',
        groupOrientation: 'vertical',
      }, {
        type: 'timelineWeek',
        groupOrientation: 'vertical',
      }, {
        type: 'timelineMonth',
        groupOrientation: 'vertical',
      }],
      crossScrollingEnabled,
      groups: ['priorityId'],
    });

    const scheduler = new Scheduler(page, '#container');

    for (const view of views) {
      await scheduler.option('currentView', view);

      await testScreenshot(
        page,
        `shader-in-${view}-crossScrolling=${crossScrollingEnabled}-vertical-grouping.png`,
        { element: scheduler.workSpace },
      );
    }
  });
});
