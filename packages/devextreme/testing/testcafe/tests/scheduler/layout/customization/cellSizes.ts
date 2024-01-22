import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { insertStylesheetRulesToPage } from '../../../../helpers/domUtils';
import createWidget from '../../../../helpers/createWidget';
import url from '../../../../helpers/getPageUrl';
import Scheduler from '../../../../model/scheduler';

fixture`Scheduler: Layout Customization: Cell Sizes`
  .page(url(__dirname, '../../../container.html'));

const createScheduler = async (
  additionalProps: Record<string, unknown>,
): Promise<void> => {
  await createWidget('dxScheduler', {
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

test('Cell sizes customization should work', async (t) => {
  const scheduler = new Scheduler('#container');
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  // eslint-disable-next-line no-restricted-syntax
  for (const { type } of views) {
    await scheduler.option('currentView', type);
    await t.expect(
      await takeScreenshot(`custom-cell-sizes-in-${type}.png`, scheduler.workSpace),
    ).ok();
  }

  await t.expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await insertStylesheetRulesToPage('#container .dx-scheduler-cell-sizes-vertical { height: 150px; } #container .dx-scheduler-cell-sizes-horizontal { width: 150px; }');
  await createScheduler({
    views,
  });
});

test('Cell sizes customization should work when all-day panel is enabled', async (t) => {
  const scheduler = new Scheduler('#container');
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await t.expect(
    await takeScreenshot('custom-cell-sizes-with-all-day-panel-in-week.png', scheduler.workSpace),
  ).ok();

  await t.expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await insertStylesheetRulesToPage('#container .dx-scheduler-cell-sizes-vertical { height: 150px; } #container .dx-scheduler-cell-sizes-horizontal { width: 150px; }');

  await createScheduler({
    views,
    showAllDayPanel: true,
    currentView: 'week',
  });
});
