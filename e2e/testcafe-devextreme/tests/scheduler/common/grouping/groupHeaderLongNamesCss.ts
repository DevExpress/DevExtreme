import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { extend } from 'devextreme/core/utils/extend';
import Scheduler from 'devextreme-testcafe-models/scheduler';
import { insertStylesheetRulesToPage } from '../../../../helpers/domUtils';
import { createWidget } from '../../../../helpers/createWidget';
import url from '../../../../helpers/getPageUrl';

const SCHEDULER_SELECTOR = '#container';

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

const createScheduler = async (options = {}): Promise<void> => createWidget('dxScheduler', extend(DEFAULT_OPTIONS, options));

fixture`Scheduler: Group Header CSS for Long Resource Names`
  .page(url(__dirname, '../../../container.html'));

test('Group header CSS should work with vertical grouping and long resource names', async (t) => {
  const scheduler = new Scheduler(SCHEDULER_SELECTOR);
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await t.expect(scheduler.element.find('.dx-scheduler-group-header').exists)
    .ok('Group headers should exist');

  await takeScreenshot('group-header-css-vertical-grouping-long-names.png', scheduler.element);

  await t.expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await insertStylesheetRulesToPage(CELL_SIZE_CSS);
  await createScheduler({ currentView: 'Vertical Grouping' });
});

test.meta({ unstable: true })('Group header CSS should work with horizontal grouping and long resource names', async (t) => {
  const scheduler = new Scheduler(SCHEDULER_SELECTOR);
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await t.expect(scheduler.element.find('.dx-scheduler-group-header').exists)
    .ok('Group headers should exist');

  await takeScreenshot('group-header-css-horizontal-grouping-long-names.png', scheduler.element);

  await t.expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await insertStylesheetRulesToPage(CELL_SIZE_CSS);
  await createScheduler({ currentView: 'Horizontal Grouping' });
});

test('Group header CSS should work with group by date and long resource names', async (t) => {
  const scheduler = new Scheduler(SCHEDULER_SELECTOR);
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await t.expect(scheduler.element.find('.dx-scheduler-group-header').exists)
    .ok('Group headers should exist');

  await takeScreenshot('group-header-css-group-by-date-long-names.png', scheduler.element);

  await t.expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await insertStylesheetRulesToPage(CELL_SIZE_CSS);
  await createScheduler({ currentView: 'Group By Date', groupByDate: true });
});

test('Group header CSS should work with agenda view and long resource names', async (t) => {
  const scheduler = new Scheduler(SCHEDULER_SELECTOR);
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await t.expect(scheduler.element.find('.dx-scheduler-group-header').exists)
    .ok('Group headers should exist');

  await takeScreenshot('group-header-css-agenda-view-long-names.png', scheduler.element);

  await t.expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await insertStylesheetRulesToPage(CELL_SIZE_CSS);
  await createScheduler({ currentView: 'agenda' });
});
