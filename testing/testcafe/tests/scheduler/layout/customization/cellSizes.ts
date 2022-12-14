import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import createWidget, { disposeWidgets } from '../../../../helpers/createWidget';
import url from '../../../../helpers/getPageUrl';
import { deleteStylesheetRule, insertStylesheetRule } from '../../../navigation/helpers/domUtils';
import Scheduler from '../../../../model/scheduler';

fixture.disablePageReloads`Scheduler: Layout Customization: Cell Sizes`
  .page(url(__dirname, '../../../container.html'))
  .afterEach(async () => disposeWidgets());

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
  }, true);
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
  for (const view of views) {
    await scheduler.option('currentView', view.type);

    await t.expect(
      await takeScreenshot(`custom-cell-sizes-in-${view.type}.png`, scheduler.workSpace),
    ).ok();
  }

  await deleteStylesheetRule(0);

  await t.expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await insertStylesheetRule('#container .dx-scheduler-cell-sizes-vertical, #container .dx-scheduler-cell-sizes-horizontal { height: 150px; }', 0);

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

  await deleteStylesheetRule(0);

  await t.expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await insertStylesheetRule('#container .dx-scheduler-cell-sizes-vertical, #container .dx-scheduler-cell-sizes-horizontal { height: 150px; }', 0);

  await createScheduler({
    views,
    showAllDayPanel: true,
    currentView: 'week',
  });
});
