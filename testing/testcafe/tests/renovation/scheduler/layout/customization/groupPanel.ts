import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import Scheduler from '../../../../../model/scheduler';
import { multiPlatformTest, createWidget, updateComponentOptions } from '../../../../../helpers/multi-platform-test';
import { PlatformType } from '../../../../../helpers/multi-platform-test/platform-type';
import { insertStylesheetRulesToPage, removeStylesheetRulesFromPage } from '../../../../../helpers/domUtils';

const test = multiPlatformTest({
  page: 'declaration/scheduler',
  platforms: ['jquery', 'react'],
});

// NOTE RENOVATION TESTCAFE: All these test scenarios have analogs in jQuery's testcafe tests.
fixture.disablePageReloads.skip('Scheduler: Layout Customization: Group Panel');

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
    dataSource: [{
      text: 'Create Report on Customer Feedback',
      startDate: new Date(2021, 4, 1, 14),
      endDate: new Date(2021, 4, 1, 15),
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
  }, true);
};

const views = [{
  type: 'week',
  groupOrientation: 'vertical',
}, {
  type: 'month',
  groupOrientation: 'vertical',
}, {
  type: 'timelineWeek',
  groupOrientation: 'vertical',
}, {
  type: 'timelineMonth',
  groupOrientation: 'vertical',
}];

[false, true].forEach((crossScrollingEnabled) => {
  test('Group panel customization should work', async (t, { platform, screenshotComparerOptions }) => {
    const scheduler = new Scheduler('#container');
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    // eslint-disable-next-line no-restricted-syntax
    for (const view of views) {
      await updateComponentOptions(platform, { currentView: view.type });

      await t.expect(
        await takeScreenshot(`custom-group-panel-in-${view.type}-cross-scrolling=${crossScrollingEnabled}.png`, scheduler.element, screenshotComparerOptions),
      ).ok();
    }

    await removeStylesheetRulesFromPage();

    await t.expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async (_, { platform }) => {
    await insertStylesheetRulesToPage('#container .dx-scheduler-group-header { width: 200px;}');

    await createScheduler(platform, {
      views,
      crossScrollingEnabled,
    });
  });
});
