import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import createWidget from '../../../../../helpers/createWidget';
import url from '../../../../../helpers/getPageUrl';
import Scheduler from '../../../../../model/scheduler';
import {
  resourceDataSource,
  createDataSetWithAllDay,
  createDataSetWithoutAllDay,
  viewsWithoutAllDay,
  viewsWithAllDay,
  getHorizontalViews,
  getVerticalViews, TViewTypes,
} from '../../utils';
import { restoreBrowserSize } from '../../../../../helpers/restoreBrowserSize';

fixture`Scheduler: Adaptive Generic theme layout`
  .page(url(__dirname, '../../../../container.html'));

const SCREENSHOT_VIEW_NAME = 'generic-view';
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
  supportAllDay: boolean,
  additionalProps: Record<string, unknown>,
): Promise<void> => {
  await createWidget('dxScheduler', {
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
  views: TViewTypes,
  crossScrollingEnabled: boolean,
  rtlEnabled: boolean,
  grouping = '',
) => {
  const scheduler = new Scheduler('#container');
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  // eslint-disable-next-line no-restricted-syntax
  for (const view of views) {
    await scheduler.option('currentView', view);

    await t.expect(
      await takeScreenshot(
        `${SCREENSHOT_VIEW_NAME}=${view}-crossScrolling=${crossScrollingEnabled}${grouping ? `-${grouping}` : ''}${rtlEnabled ? '-rtl' : ''}.png`,
        scheduler.workSpace,
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
        async (t) => takeScreenshotsFunc(t, views, crossScrollingEnabled, rtlEnabled),
      ).before(async (t) => {
        await t.resizeWindow(400, 600);

        await createScheduler(isAllDay, {
          views,
          currentView: views[0],
          crossScrollingEnabled,
          rtlEnabled,
        });
      }).after(async (t) => {
        await restoreBrowserSize(t);
      });

      test(
        `Adaptive views layout test in generic theme, when horizontal grouping is used.
        crossScrollingEnabled=${crossScrollingEnabled};
        rtlEnabled=${rtlEnabled}`,
        async (t) => takeScreenshotsFunc(t, views, crossScrollingEnabled, rtlEnabled, 'horizontal'),
      ).before(async (t) => {
        await t.resizeWindow(400, 600);

        await createScheduler(isAllDay, {
          views: getHorizontalViews(views),
          currentView: views[0],
          crossScrollingEnabled,
          rtlEnabled,
          groups: ['priorityId'],
          resources: resourceDataSource,
        });
      }).after(async (t) => {
        await restoreBrowserSize(t);
      });

      test(`Adaptive views layout test in generic theme, when vertical grouping is used.
      crossScrollingEnabled=${crossScrollingEnabled};
      rtlEnabled=${rtlEnabled}`,
      async (t) => takeScreenshotsFunc(t, views, crossScrollingEnabled, rtlEnabled, 'vertical'))
        .before(async (t) => {
          await t.resizeWindow(400, 600);

          await createScheduler(isAllDay, {
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
