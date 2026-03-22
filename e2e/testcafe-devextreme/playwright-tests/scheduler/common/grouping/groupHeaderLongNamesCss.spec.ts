import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot, insertStylesheetRulesToPage, setupTestPage } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

const resources = [
  {
    text: 'Very Long Priority Name for High Priority Tasks and Urgent Matters',
    id: 1,
    color: '#ff9747',
  },
  {
    text: 'Extremely Long Priority Name for Medium Priority Tasks and Regular Work',
    id: 2,
    color: '#24ff50',
  },
  {
    text: 'Super Long Priority Name for Low Priority Tasks and Background Activities',
    id: 3,
    color: '#3366ff',
  },
];

const dataSource = [
  {
    text: 'Team Meeting',
    startDate: new Date(2021, 3, 21, 10, 0),
    endDate: new Date(2021, 3, 21, 11, 30),
    priorityId: 1,
  },
  {
    text: 'Code Review',
    startDate: new Date(2021, 3, 21, 14, 0),
    endDate: new Date(2021, 3, 21, 15, 0),
    priorityId: 2,
  },
  {
    text: 'Planning Session',
    startDate: new Date(2021, 3, 22, 9, 0),
    endDate: new Date(2021, 3, 22, 12, 0),
    priorityId: 3,
  },
];

const DEFAULT_OPTIONS = {
  currentDate: new Date(2021, 3, 21),
  height: 600,
  width: 1000,
  startDayHour: 9,
  endDayHour: 16,
  crossScrollingEnabled: true,
  showCurrentTimeIndicator: false,
  showAllDayPanel: false,
  groups: ['priorityId'],
  views: [{
    type: 'workWeek',
    name: 'Vertical Grouping',
    groupOrientation: 'vertical',
    cellDuration: 60,
    intervalCount: 2,
  },
  {
    type: 'workWeek',
    name: 'Horizontal Grouping',
    groupOrientation: 'horizontal',
    cellDuration: 30,
    intervalCount: 2,
  }, {
    type: 'month',
    name: 'Group By Date',
    groupOrientation: 'horizontal',
  }, 'agenda'],
  resources: [{
    fieldExpr: 'priorityId',
    allowMultiple: false,
    dataSource: resources,
    label: 'Priority',
  }],
  dataSource,
};

const CELL_SIZE_CSS = `
  #container .dx-scheduler-group-header {
    width: auto;
  }
  #container .dx-scheduler-group-flex-container,
  #container .dx-scheduler-work-space-vertical-group-table,
  #container .dx-scheduler-sidebar-scrollable {
    flex: 0 0 auto;
  }
`;

test.describe('Scheduler: Group Header CSS for Long Resource Names', () => {
  test.beforeEach(async ({ page }) => {
    await setupTestPage(page, containerUrl);
  });

  test('Group header CSS should work with vertical grouping and long resource names', async ({ page }) => {
    await insertStylesheetRulesToPage(page, CELL_SIZE_CSS);
    await createWidget(page, 'dxScheduler', { ...DEFAULT_OPTIONS, currentView: 'Vertical Grouping' });

    const groupHeaders = page.locator('.dx-scheduler-group-header');
    await expect(groupHeaders.first()).toBeVisible();

    await testScreenshot(page, 'group-header-css-vertical-grouping-long-names.png', {
      element: page.locator('.dx-scheduler'),
    });
  });

  test('Group header CSS should work with horizontal grouping and long resource names', async ({ page }) => {
    await insertStylesheetRulesToPage(page, CELL_SIZE_CSS);
    await createWidget(page, 'dxScheduler', { ...DEFAULT_OPTIONS, currentView: 'Horizontal Grouping' });

    const groupHeaders = page.locator('.dx-scheduler-group-header');
    await expect(groupHeaders.first()).toBeVisible();

    await testScreenshot(page, 'group-header-css-horizontal-grouping-long-names.png', {
      element: page.locator('.dx-scheduler'),
    });
  });

  test('Group header CSS should work with group by date and long resource names', async ({ page }) => {
    await insertStylesheetRulesToPage(page, CELL_SIZE_CSS);
    await createWidget(page, 'dxScheduler', { ...DEFAULT_OPTIONS, currentView: 'Group By Date', groupByDate: true });

    const groupHeaders = page.locator('.dx-scheduler-group-header');
    await expect(groupHeaders.first()).toBeVisible();

    await testScreenshot(page, 'group-header-css-group-by-date-long-names.png', {
      element: page.locator('.dx-scheduler'),
    });
  });

  test('Group header CSS should work with agenda view and long resource names', async ({ page }) => {
    await insertStylesheetRulesToPage(page, CELL_SIZE_CSS);
    await createWidget(page, 'dxScheduler', { ...DEFAULT_OPTIONS, currentView: 'agenda' });

    const groupHeaders = page.locator('.dx-scheduler-group-header');
    await expect(groupHeaders.first()).toBeVisible();

    await testScreenshot(page, 'group-header-css-agenda-view-long-names.png', {
      element: page.locator('.dx-scheduler'),
    });
  });
});
