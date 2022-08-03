import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { IComparerOptions } from 'devextreme-screenshot-comparer/build/src/options';
import { multiPlatformTest, createWidget, updateComponentOptions } from '../../../../../../helpers/multi-platform-test';
import { restoreBrowserSize } from '../../../../../../helpers/restoreBrowserSize';
import Scheduler from '../../../../../../model/scheduler';
import {
  resourceDataSource,
  createDataSetWithAllDay,
  createDataSetWithoutAllDay,
  viewsWithoutAllDay,
  viewsWithAllDay,
  getHorizontalViews,
  getVerticalViews, TViewTypes,
} from '../../utils';
import { PlatformType } from '../../../../../../helpers/multi-platform-test/platform-type';

const test = multiPlatformTest({
  page: 'declaration/schedulerMaterial',
  platforms: ['jquery', 'react'],
});

fixture('Scheduler: Adaptive material theme layout');

const SCREENSHOT_VIEW_NAME = 'material-view';
const RTL_MODE = [false, true];
const CROSS_SCROLLING_MODES = [false, true];
const VIEW_TYPES = [{
  isAllDay: true,
  views: viewsWithAllDay,
}, {
  isAllDay: false,
  views: viewsWithoutAllDay,
}];

const createScheduler = async (
  platform: PlatformType,
  supportAllDay: boolean,
  additionalProps: Record<string, unknown>,
): Promise<void> => {
  await createWidget(platform,
    'dxScheduler', {
      dataSource: supportAllDay
        ? createDataSetWithAllDay()
        : createDataSetWithoutAllDay(),
      currentDate: new Date(2020, 6, 15),
      height: 600,
      ...additionalProps,
    }, true);
};

const takeScreenshotsFunc = async (
  t: TestController,
  platform: PlatformType,
  screenshotComparerOptions: Partial<IComparerOptions> | undefined,
  views: TViewTypes,
  crossScrollingEnabled: boolean,
  rtlEnabled: boolean,
  grouping = '',
) => {
  const scheduler = new Scheduler('#container');
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  // eslint-disable-next-line no-restricted-syntax
  for (const view of views) {
    // NOTE: Disable timelineDay horizontal grouping with RTL test for react.
    if (view === 'timelineDay' && platform === 'react' && grouping === 'horizontal' && rtlEnabled) {
      return;
    }

    await updateComponentOptions(platform, { currentView: view });

    await t
      .expect(scheduler.checkViewType(view))
      .ok()
      .wait(100);

    await t.expect(
      await takeScreenshot(
        `${SCREENSHOT_VIEW_NAME}=${view}-crossScrolling=${crossScrollingEnabled}${grouping ? `-${grouping}` : ''}${rtlEnabled ? '-rtl' : ''}.png`,
        scheduler.workSpace,
        screenshotComparerOptions,
      ),
    ).ok();
  }

  await t.expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
};

RTL_MODE.forEach((rtlEnabled) => {
  CROSS_SCROLLING_MODES.forEach((crossScrollingEnabled) => {
    VIEW_TYPES.forEach(({ isAllDay, views }) => {
      test(
        `Adaptive views layout test in generic theme.
       crossScrollingEnabled=${crossScrollingEnabled};
       rtlEnabled=${rtlEnabled}`,
        async (t,
          { platform, screenshotComparerOptions }) => takeScreenshotsFunc(
          t,
          platform,
          screenshotComparerOptions,
          views,
          crossScrollingEnabled,
          rtlEnabled,
        ),
      ).before(async (t, { platform }) => {
        await t.resizeWindow(400, 600);

        await createScheduler(
          platform,
          isAllDay,
          {
            views,
            currentView: views[0],
            crossScrollingEnabled,
            rtlEnabled,
          },
        );
      }).after(async (t) => {
        await restoreBrowserSize(t);
      });

      test(
        `Adaptive views layout test in generic theme, when horizontal grouping is used.
        crossScrollingEnabled=${crossScrollingEnabled};
        rtlEnabled=${rtlEnabled}`,
        async (t,
          { platform, screenshotComparerOptions }) => takeScreenshotsFunc(
          t,
          platform,
          screenshotComparerOptions,
          views,
          crossScrollingEnabled,
          rtlEnabled,
          'horizontal',
        ),
      ).before(async (t, { platform }) => {
        await t.resizeWindow(400, 600);

        await createScheduler(
          platform,
          isAllDay,
          {
            views: getHorizontalViews(views),
            currentView: views[0],
            crossScrollingEnabled,
            rtlEnabled,
            groups: ['priorityId'],
            resources: resourceDataSource,
          },
        );
      }).after(async (t) => {
        await restoreBrowserSize(t);
      });

      test(`Adaptive views layout test in generic theme, when vertical grouping is used.
      crossScrollingEnabled=${crossScrollingEnabled};
      rtlEnabled=${rtlEnabled}`,
      async (t,
        { platform, screenshotComparerOptions }) => takeScreenshotsFunc(
        t,
        platform,
        screenshotComparerOptions,
        views,
        crossScrollingEnabled,
        rtlEnabled,
        'vertical',
      ))
        .before(async (t, { platform }) => {
          await t.resizeWindow(400, 600);

          await createScheduler(platform,
            isAllDay,
            {
              views: getVerticalViews(views),
              currentView: views[0],
              crossScrollingEnabled,
              rtlEnabled,
              groups: ['priorityId'],
              resources: resourceDataSource,
            });
        }).after(async (t) => {
          await restoreBrowserSize(t);
        });
    });
  });
});
