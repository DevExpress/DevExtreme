import type { Page } from '@playwright/test';
import { test } from '../../../../../fixtures';
import { insertStylesheetRulesToPage } from '../../../../../helpers/domUtils';
import { createWidget } from '../../../../../helpers/createWidget';
import { testScreenshot } from '../../../../../helpers/screenshots';
import Scheduler from '../../../../../models/scheduler';

const SELECTOR = '#container';

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
    dataSource: [],
    crossScrollingEnabled: true,
    groups: ['priorityId'],
    resources: [{
      fieldExpr: 'priorityId',
      dataSource: [{
        text: 'Low Priority 1',
        id: 0,
        color: '#24ff50',
      }, {
        text: 'Low Priority 2',
        id: 1,
        color: '#ff9747',
      }, {
        text: 'Low Priority 3',
        id: 2,
        color: '#24ff50',
      }, {
        text: 'High Priority 1',
        id: 3,
        color: '#ff9747',
      }, {
        text: 'High Priority 2',
        id: 4,
        color: '#24ff50',
      }, {
        text: 'High Priority 3',
        id: 5,
        color: '#ff9747',
      }],
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
  groupOrientation: 'vertical',
}, {
  type: 'timelineMonth',
  groupOrientation: 'vertical',
}];

test.describe('Scheduler: Layout Customization: Cell Sizes', () => {
  test('Cell sizes customization should work', async ({ page }) => {
    await insertStylesheetRulesToPage(page, '#container .dx-scheduler-cell-sizes-vertical { height: 150px; } #container .dx-scheduler-cell-sizes-horizontal { width: 150px; }');
    await createScheduler(page, {
      views,
    });

    const scheduler = new Scheduler(page, SELECTOR);

    for (const { type } of views) {
      await scheduler.option('currentView', type);

      await testScreenshot(
        page,
        `custom-cell-sizes-in-${type}.png`,
        { element: scheduler.workSpace },
      );
    }
  });

  test('Cell sizes customization should work when all-day panel is enabled', async ({ page }) => {
    await insertStylesheetRulesToPage(page, '#container .dx-scheduler-cell-sizes-vertical { height: 150px; } #container .dx-scheduler-cell-sizes-horizontal { width: 150px; }');

    await createScheduler(page, {
      views,
      showAllDayPanel: true,
      currentView: 'week',
    });

    const scheduler = new Scheduler(page, SELECTOR);

    await testScreenshot(
      page,
      'custom-cell-sizes-with-all-day-panel-in-week.png',
      { element: scheduler.workSpace },
    );
  });
});
