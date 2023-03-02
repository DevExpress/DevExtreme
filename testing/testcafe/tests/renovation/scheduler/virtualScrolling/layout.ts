import { ClientFunction } from 'testcafe';
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import Scheduler from '../../../../model/scheduler';
import { multiPlatformTest, createWidget, updateComponentOptions } from '../../../../helpers/multi-platform-test';
import { PlatformType } from '../../../../helpers/multi-platform-test/platform-type';
import {
  resources,
  createDataSetForScreenShotTests,
  views,
  // horizontalViews,
  // scrollConfig,
  // groupedByDateViews,
} from './utils';

const test = multiPlatformTest({
  page: 'declaration/scheduler',
  platforms: ['jquery', 'react'],
});

const scrollTo = (scrollableContent, position) => ClientFunction(() => {
  (scrollableContent() as HTMLElement).scrollTo(position);
}, {
  dependencies: {
    scrollableContent,
    position,
  },
})();

// NOTE RENOVATION TESTCAFE: All these test scenarios have analogs in jQuery's testcafe tests.
fixture.disablePageReloads.skip('Scheduler: Virtual Scrolling');

const createScheduler = async (
  platform: PlatformType,
  additionalProps: Record<string, unknown>,
): Promise<void> => {
  await createWidget(platform, 'dxScheduler', {
    dataSource: createDataSetForScreenShotTests(),
    currentDate: new Date(2021, 0, 1),
    height: 600,
    resources,
    views,
    currentView: 'day',
    scrolling: { mode: 'virtual' },
    startDayHour: 0,
    endDayHour: 3,
    ...additionalProps,
  });
};

test('Virtual scrolling layout in scheduler views', async (t, { platform, screenshotComparerOptions }) => {
  const scheduler = new Scheduler('#container');

  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const { viewSwitcher } = scheduler.toolbar;

  // TODO: views[0] is day view and we have a bug in its CSS
  // It is not advisable to create screenshots for incorrect layout
  for (let i = 1; i < views.length; i += 1) {
    const view = views[i];

    await updateComponentOptions(platform, { currentView: view.type });
    await t.expect(viewSwitcher.getButton(view.type).element.exists)
      .ok();

    await scrollTo(scheduler.workspaceScrollable, { left: 0 });

    await t.expect(
      await takeScreenshot(`virtual-scrolling-${view.type}-after-scroll.png`, scheduler.workSpace, screenshotComparerOptions),
    ).ok();

    await scrollTo(scheduler.workspaceScrollable, { left: 50000 });

    await t.expect(
      await takeScreenshot(`virtual-scrolling-${view.type}-before-scroll.png`, scheduler.workSpace, screenshotComparerOptions),
    ).ok();
  }

  await t.expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async (_, { platform }) => {
  await createScheduler(platform, {});
});

// TODO unskip after scrollTo implementation
// test('Virtual scrolling layout in scheduler views when horizontal grouping is enabled',
//   async (t, { platform, screenshotComparerOptions }) => {
//   await t.resizeWindow(1200, 800);
//   const scheduler = new Scheduler('#container');
//   const { viewSwitcher } = scheduler.toolbar;

//   const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

//   // TODO: views[0] is day view and we have a bug in its CSS
//   // It is not advisable to create screenshots for incorrect layout
//   for (let i = 1; i < views.length; i += 1) {
//     const view = views[i];

//     await updateComponentOptions(platform, { currentView: view.type });
//     await t.expect(viewSwitcher.getButton(view.type).element.exists)
//       .ok();

//     await scrollTo(scrollConfig[i].firstDate, { resourceId: 6 });

//     await t.expect(
//       await takeScreenshot(`virtual-scrolling-${view.type}-after-scroll-horizontal-grouping.png`,
//         scheduler.workSpace, screenshotComparerOptions),
//     ).ok();

//     await scrollTo(scrollConfig[i].lastDate, { resourceId: 0 });

//     await t.expect(
//       await takeScreenshot(
//        `virtual-scrolling-${view.type}-before-scroll-horizontal-grouping.png`,
//         scheduler.workSpace, screenshotComparerOptions),
//     ).ok();
//   }

//   await t.expect(compareResults.isValid())
//     .ok(compareResults.errorMessages());
// }).before(async (_, { platform }) => {
//   await createScheduler(platform, {
//     views: horizontalViews,
//     groups: ['resourceId'],
//   });
// });

// TODO unskip after scrollTo implementation
// test('Virtual scrolling layout in scheduler views when grouping by date is enabled',
//   async (t, { platform, screenshotComparerOptions }) => {
//   const scheduler = new Scheduler('#container');
//   const { viewSwitcher } = scheduler.toolbar;

//   const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

//   // TODO: views[0] is day view and we have a bug in its CSS
//   // It is not advisable to create screenshots for incorrect layout
//   for (let i = 1; i < views.length; i += 1) {
//     const view = views[i];

//     await updateComponentOptions(platform, { currentView: view.type });
//     await t.expect(viewSwitcher.getButton(view.type).element.exists)
//       .ok();

//     await scrollTo(scrollConfig[i].firstDate, { resourceId: 3 });

//     await t.expect(
//       await takeScreenshot(`virtual-scrolling-${view.type}-after-scroll-grouping-by-date.png`,
//         scheduler.workSpace, screenshotComparerOptions),
//     ).ok();

//     await scrollTo(scrollConfig[i].lastDate, { resourceId: 0 });

//     await t.expect(
//       await takeScreenshot(`virtual-scrolling-${view.type}-before-scroll-grouping-by-date.png`,
//         scheduler.workSpace, screenshotComparerOptions),
//     ).ok();
//   }

//   await t.expect(compareResults.isValid())
//     .ok(compareResults.errorMessages());
// }).before(async (_, { platform }) => {
//   await createScheduler(platform, {
//     views: groupedByDateViews,
//     groups: ['resourceId'],
//   });
// });

test(
  'Header cells should be aligned with date-table cells in timeline-month when current date changes and virtual scrolling is used',
  async (t, { platform, screenshotComparerOptions }) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
    const scheduler = new Scheduler('#container');
    const { navigator } = scheduler.toolbar;

    await updateComponentOptions(platform, { currentDate: new Date(2020, 11, 1) });
    await t.expect(navigator.caption.innerText)
      .eql('December 2020');

    await t.expect(
      await takeScreenshot('virtual-scrolling-timeline-month-change-current-date-virtual.png', scheduler.workSpace, screenshotComparerOptions),
    ).ok();

    await t.expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  },
).before(async (_, { platform }) => {
  await createScheduler(platform, {
    currentDate: new Date(2020, 10, 1),
    currentView: 'timelineMonth',
  });
});
