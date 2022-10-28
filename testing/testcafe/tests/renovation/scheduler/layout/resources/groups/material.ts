import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import Scheduler from '../../../../../../model/scheduler';
import { createDataSetForScreenShotTests, resourceDataSource } from '../../utils';
import { multiPlatformTest, createWidget } from '../../../../../../helpers/multi-platform-test';
import { PlatformType } from '../../../../../../helpers/multi-platform-test/platform-type';

const test = multiPlatformTest({
  page: 'declaration/schedulerMaterial',
  platforms: ['jquery', 'react'],
});

// NOTE RENOVATION TESTCAFE: All these test scenarios have analogs in jQuery's testcafe tests.
fixture.skip('Scheduler: Material theme layout');

const createScheduler = async (
  platform: PlatformType,
  view: string,
  groupOrientation: string,
): Promise<void> => {
  await createWidget(platform, 'dxScheduler', {
    dataSource: createDataSetForScreenShotTests(),
    currentDate: new Date(2020, 6, 15),
    startDayHour: 0,
    endDayHour: 4,
    views: [{
      type: view,
      name: view,
      groupOrientation,
    }],
    currentView: view,
    crossScrollingEnabled: true,
    resources: resourceDataSource,
    groups: ['priorityId'],
    height: 700,
  }, true);
};

['vertical', 'horizontal'].forEach((groupOrientation) => {
  ['day', 'week', 'workWeek', 'month'].forEach((view) => {
    test(`Base views layout test in material theme with groups(view='${view}', groupOrientation=${groupOrientation})`, async (t, { screenshotComparerOptions }) => {
      const scheduler = new Scheduler('#container');
      const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

      await t
        .expect(await takeScreenshot(`material-groups(view=${view}-orientation=${groupOrientation}).png`, scheduler.workSpace, screenshotComparerOptions)).ok();

      await t.expect(compareResults.isValid())
        .ok(compareResults.errorMessages());
    }).before(async (_, { platform }) => createScheduler(platform, view, groupOrientation));
  });
});

['vertical', 'horizontal'].forEach((groupOrientation) => {
  ['timelineDay', 'timelineWeek', 'timelineWorkWeek', 'timelineMonth'].forEach((view) => {
    test(`Timeline views layout test in material theme with groups(view='${view}', groupOrientation=${groupOrientation})`, async (t, { screenshotComparerOptions }) => {
      const scheduler = new Scheduler('#container');
      const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

      await t
        .expect(await takeScreenshot(`material-groups(view=${view}-orientation=${groupOrientation}).png`, scheduler.workSpace, screenshotComparerOptions)).ok();

      await t.expect(compareResults.isValid())
        .ok(compareResults.errorMessages());
    }).before(async (_, { platform }) => createScheduler(platform, view, groupOrientation));
  });
});
