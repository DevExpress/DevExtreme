import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import Scheduler from '../../../../model/scheduler';
import {
  resources,
  views,
  scrollTo,
  horizontalViews,
  setZoomLevel,
  scrollConfig,
} from './utils';
import { multiPlatformTest, createWidget, updateComponentOptions } from '../../../../helpers/multi-platform-test';
import { PlatformType } from '../../../../helpers/multi-platform-test/platform-type';

const test = multiPlatformTest({
  page: 'declaration/scheduler',
  platforms: ['jquery', 'react'],
});

// TODO unskip after scrollTo implementation
fixture.disablePageReloads.skip('Scheduler: Virtual Scrolling with Zooming');

const createScheduler = async (
  platform: PlatformType,
  additionalProps: Record<string, unknown>,
): Promise<void> => {
  await createWidget(platform, 'dxScheduler', {
    currentDate: new Date(2021, 0, 1),
    height: 600,
    resources,
    views,
    currentView: 'day',
    scrolling: { mode: 'virtual' },
    startDayHour: 0,
    endDayHour: 3,
    ...additionalProps,
  }, true);
};

test('Virtual scrolling layout in scheduler views when horizontal grouping is enabled and zooming is used', async (t, { platform, screenshotComparerOptions }) => {
  const scheduler = new Scheduler('#container');

  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  // TODO: views[0] is day view and we have a bug in its CSS
  // It is not advisable to create screenshots for incorrect layout
  for (let i = 1; i < views.length; i += 1) {
    const view = views[i];

    await updateComponentOptions(platform, { currentView: view.type });

    await t.expect(
      await takeScreenshot(`virtual-scrolling-${view.type}-before-scroll-horizontal-grouping-scaling.png`, scheduler.workSpace, screenshotComparerOptions),
    ).ok();

    await scrollTo(scrollConfig[i].firstDate, { resourceId: 7 });

    await t.expect(
      await takeScreenshot(`virtual-scrolling-${view.type}-after-scroll-horizontal-grouping-scaling.png`, scheduler.workSpace, screenshotComparerOptions),
    ).ok();
  }

  await t.expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async (_, { platform }) => {
  await setZoomLevel(125);
  await createScheduler(platform, {
    views: horizontalViews,
    groups: ['resourceId'],
  });
}).after(async () => {
  await setZoomLevel(0);
});
