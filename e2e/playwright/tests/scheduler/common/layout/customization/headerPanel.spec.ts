import type { Page } from '@playwright/test';
import { test } from '../../../../../fixtures';
import { insertStylesheetRulesToPage } from '../../../../../helpers/domUtils';
import { createWidget } from '../../../../../helpers/createWidget';
import { testScreenshot } from '../../../../../helpers/screenshots';
import Scheduler from '../../../../../models/scheduler';

const createScheduler = async (
  page: Page,
  additionalProps: Record<string, unknown>,
): Promise<void> => {
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
    ...additionalProps,
  });
};

const views = [{
  type: 'week',
  groupOrientation: 'horizontal',
}, {
  type: 'month',
  groupOrientation: 'horizontal',
}, {
  type: 'timelineWeek',
  groupOrientation: 'horizontal',
}, {
  type: 'timelineMonth',
  groupOrientation: 'horizontal',
}];

test.describe('Scheduler: Layout Customization: Header Panel', () => {
  [false, true].forEach((crossScrollingEnabled) => {
    test(`Header panel customization should work (crossScrollingEnabled: ${crossScrollingEnabled})`, async ({ page }) => {
      await insertStylesheetRulesToPage(page, '#container .dx-scheduler-group-header, #container .dx-scheduler-header-panel-cell { height: 100px; }');

      await createScheduler(page, {
        views,
        crossScrollingEnabled,
      });

      const scheduler = new Scheduler(page, '#container');

      for (const view of views) {
        await scheduler.option('currentView', view.type);

        await testScreenshot(
          page,
          `custom-header-panel-in-${view.type}-cross-scrolling=${crossScrollingEnabled}.png`,
          { element: scheduler.element },
        );
      }
    });
  });
});
