import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import Scheduler from '../../../../../../model/scheduler';
import {
  createDataSetForScreenShotTests,
  resourceDataSource,
  views,
  verticalViews,
  horizontalViews,
} from '../../utils';
import { restoreBrowserSize } from '../../../../../../helpers/restoreBrowserSize';
import { multiPlatformTest, createWidget, updateComponentOptions } from '../../../../../../helpers/multi-platform-test';
import { PlatformType } from '../../../../../../helpers/multi-platform-test/platform-type';

const test = multiPlatformTest({
  page: 'declaration/scheduler',
  platforms: ['jquery', 'react'],
});

fixture('Scheduler: Adaptive Generic theme layout');

const createScheduler = async (
  platform: PlatformType,
  additionalProps: Record<string, unknown>,
): Promise<void> => {
  await createWidget(platform, 'dxScheduler', {
    dataSource: createDataSetForScreenShotTests(),
    currentDate: new Date(2020, 6, 15),
    height: 600,
    ...additionalProps,
  }, true);
};

[false, true].forEach((crossScrollingEnabled) => {
  test(`Adaptive views layout test in generic theme, crossScrollingEnabled=${crossScrollingEnabled}`, async (t, { platform }) => {
    const scheduler = new Scheduler('#container');
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    // eslint-disable-next-line no-restricted-syntax
    for (const view of views) {
      await updateComponentOptions(platform, { currentView: view });

      await t
        .expect(scheduler.checkViewType(view))
        .ok();

      await t.expect(
        await takeScreenshot(`generic-view=${view}-crossScrolling=${!!crossScrollingEnabled}.png`, scheduler.workSpace),
      ).ok();
    }

    await t.expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async (t, { platform }) => {
    await t.resizeWindow(400, 600);

    await createScheduler(
      platform,
      {
        views,
        currentView: 'day',
        crossScrollingEnabled,
      },
    );
  }).after(async (t) => {
    await restoreBrowserSize(t);
  });

  test(`Adaptive views layout test in generic theme, crossScrollingEnabled=${crossScrollingEnabled} when horizontal grouping is used`, async (t, { platform }) => {
    const scheduler = new Scheduler('#container');
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    // eslint-disable-next-line no-restricted-syntax
    for (const view of views) {
      await updateComponentOptions(platform, { currentView: view });

      await t
        .expect(scheduler.checkViewType(view))
        .ok();

      await t.expect(
        await takeScreenshot(`generic-view=${view}-crossScrolling=${!!crossScrollingEnabled}-horizontal.png`, scheduler.workSpace),
      ).ok();
    }

    await t.expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async (t, { platform }) => {
    await t.resizeWindow(400, 600);

    await createScheduler(
      platform,
      {
        views: horizontalViews,
        currentView: 'day',
        crossScrollingEnabled,
        groups: ['priorityId'],
        resources: resourceDataSource,
      },
    );
  }).after(async (t) => {
    await restoreBrowserSize(t);
  });

  test(`Adaptive views layout test in generic theme, crossScrollingEnabled=${crossScrollingEnabled} when vertical grouping is used`, async (t, { platform }) => {
    const scheduler = new Scheduler('#container');
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    // eslint-disable-next-line no-restricted-syntax
    for (const view of views) {
      await updateComponentOptions(platform, { currentView: view });

      await t
        .expect(scheduler.checkViewType(view))
        .ok();

      await t.expect(
        await takeScreenshot(`generic-view=${view}-crossScrolling=${!!crossScrollingEnabled}-vertical.png`, scheduler.workSpace),
      ).ok();
    }

    await t.expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async (t, { platform }) => {
    await t.resizeWindow(400, 600);

    await createScheduler(
      platform,
      {
        views: verticalViews,
        currentView: 'day',
        crossScrollingEnabled,
        groups: ['priorityId'],
        resources: resourceDataSource,
      },
    );
  }).after(async (t) => {
    await restoreBrowserSize(t);
  });
});
