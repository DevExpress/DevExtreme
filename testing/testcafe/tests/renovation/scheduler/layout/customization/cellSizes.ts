import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { insertStylesheetRulesToPage, removeStylesheetRulesFromPage } from '../../../../../helpers/domUtils';
import Scheduler from '../../../../../model/scheduler';
import { multiPlatformTest, createWidget, updateComponentOptions } from '../../../../../helpers/multi-platform-test';
import { PlatformType } from '../../../../../helpers/multi-platform-test/platform-type';

const test = multiPlatformTest({
  page: 'declaration/scheduler',
  platforms: ['jquery', 'react'],
});

// NOTE RENOVATION TESTCAFE: All these test scenarios have analogs in jQuery's testcafe tests.
fixture.skip('Scheduler: Layout Customization: Cell Sizes');

const createScheduler = async (
  platform: PlatformType,
  additionalProps: Record<string, unknown>,
): Promise<void> => {
  await createWidget(platform, 'dxScheduler', {
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

test('Cell sizes customization should work', async (t, { platform, screenshotComparerOptions }) => {
  const scheduler = new Scheduler('#container');
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  // eslint-disable-next-line no-restricted-syntax
  for (const view of views) {
    await updateComponentOptions(platform, { currentView: view.type });

    await t.expect(
      await takeScreenshot(`custom-cell-sizes-in-${view.type}.png`, scheduler.workSpace, screenshotComparerOptions),
    ).ok();
  }

  await removeStylesheetRulesFromPage();

  await t.expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async (_, { platform }) => {
  await insertStylesheetRulesToPage('#container .dx-scheduler-cell-sizes-vertical { height: 150px; } #container .dx-scheduler-cell-sizes-horizontal { width: 150px;}');

  await createScheduler(platform, {
    views,
  });
});

test('Cell sizes customization should work when all-day panel is enabled', async (t, { screenshotComparerOptions }) => {
  const scheduler = new Scheduler('#container');
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await t.expect(
    await takeScreenshot('custom-cell-sizes-with-all-day-panel-in-\'week.png', scheduler.workSpace, screenshotComparerOptions),
  ).ok();

  await removeStylesheetRulesFromPage();

  await t.expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async (_, { platform }) => {
  await insertStylesheetRulesToPage('#container .dx-scheduler-cell-sizes-vertical { height: 150px; } #container .dx-scheduler-cell-sizes-horizontal { width: 150px;}');

  await createScheduler(platform, {
    views,
    showAllDayPanel: true,
    currentView: 'week',
  });
});
