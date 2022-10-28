import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import Scheduler from '../../../../../../model/scheduler';
import {
  createDataSetForScreenShotTests,
  resourceDataSource,
  views,
  verticalViews,
  horizontalViews,
} from '../../utils';
import { multiPlatformTest, createWidget, updateComponentOptions } from '../../../../../../helpers/multi-platform-test';
import { PlatformType } from '../../../../../../helpers/multi-platform-test/platform-type';

const test = multiPlatformTest({
  page: 'declaration/schedulerMaterial',
  platforms: ['jquery', 'react'],
});

const testJQuery = multiPlatformTest({
  page: 'declaration/schedulerMaterial',
  platforms: ['jquery'],
});

// NOTE RENOVATION TESTCAFE: All these test scenarios have analogs in jQuery's testcafe tests.
fixture.skip('Scheduler: Adaptive Material theme layout in RTL');

const createScheduler = async (
  platform: PlatformType,
  additionalProps: Record<string, unknown>,
): Promise<void> => {
  await createWidget(platform, 'dxScheduler', {
    dataSource: createDataSetForScreenShotTests(),
    currentDate: new Date(2020, 6, 15),
    height: 600,
    rtlEnabled: true,
    ...additionalProps,
  }, true);
};

[false, true].forEach((crossScrollingEnabled) => {
  test(`Adaptive views layout test in material theme, crossScrollingEnabled=${crossScrollingEnabled} in RTL`, async (t, { platform, screenshotComparerOptions }) => {
    const scheduler = new Scheduler('#container');
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    // eslint-disable-next-line no-restricted-syntax
    for (const view of views) {
      await updateComponentOptions(platform, { currentView: view });

      await t
        .expect(scheduler.checkViewType(view))
        .ok();

      await t.expect(
        await takeScreenshot(`material-view=${view}-crossScrolling=${crossScrollingEnabled}-rtl.png`, scheduler.workSpace, screenshotComparerOptions),
      ).ok();
    }

    await t.expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async (_, { platform }) => {
    await createScheduler(platform, {
      views,
      currentView: 'day',
      crossScrollingEnabled,
    });
  });

  test(`Adaptive views layout test in material theme, crossScrollingEnabled=${crossScrollingEnabled} when horizontal grouping and RTL are used`, async (t, { platform, screenshotComparerOptions }) => {
    const scheduler = new Scheduler('#container');
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    // eslint-disable-next-line no-restricted-syntax
    for (const view of views) {
      await updateComponentOptions(platform, { currentView: view });

      await t
        .expect(scheduler.checkViewType(view))
        .ok();

      await t.expect(
        await takeScreenshot(`material-view=${view}-crossScrolling=${crossScrollingEnabled}-horizontal-rtl.png`, scheduler.workSpace, screenshotComparerOptions),
      ).ok();
    }

    await t.expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async (_, { platform }) => {
    await createScheduler(platform, {
      views: horizontalViews,
      currentView: 'day',
      crossScrollingEnabled,
      groups: ['priorityId'],
      resources: resourceDataSource,
    });
  });

  testJQuery(`Adaptive views layout test in material theme, crossScrollingEnabled=${crossScrollingEnabled} when vertical grouping and RTL are used`, async (t, { platform, screenshotComparerOptions }) => {
    const scheduler = new Scheduler('#container');
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    // eslint-disable-next-line no-restricted-syntax
    for (const view of verticalViews) {
      await updateComponentOptions(platform, { currentView: view.type });

      await t
        .expect(scheduler.checkViewType(view.type))
        .ok();

      // Another bug in RTL in month view
      if (crossScrollingEnabled || view.type !== 'month') {
        await t.expect(
          await takeScreenshot(`material-view=${view.type}-crossScrolling=${crossScrollingEnabled}-vertical-rtl.png`, scheduler.workSpace, screenshotComparerOptions),
        ).ok();
      }
    }

    await t.expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async (_, { platform }) => {
    await createScheduler(platform, {
      views: verticalViews,
      currentView: 'day',
      crossScrollingEnabled,
      groups: ['priorityId'],
      resources: resourceDataSource,
    });
  });
});
