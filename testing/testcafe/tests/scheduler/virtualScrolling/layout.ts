import { createScreenshotsComparer, compareScreenshot } from '../../../helpers/screenshot-comparer';
import createWidget from '../../../helpers/createWidget';
import url from '../../../helpers/getPageUrl';
import Scheduler from '../../../model/scheduler';
import {
  resources,
  createDataSetForScreenShotTests,
  views,
  scrollTo,
  horizontalViews,
  scrollConfig,
  groupedByDateViews,
} from './utils';

fixture`Scheduler: Virtual Scrolling`
  .page(url(__dirname, '../../container.html'));

const createScheduler = async (
  additionalProps: Record<string, unknown>,
): Promise<void> => {
  await createWidget('dxScheduler', {
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
  }, true);
};

test('Virtual scrolling layout in scheduler views', async (t) => {
  const scheduler = new Scheduler('#container');

  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  // TODO: views[0] is day view and we have a bug in its CSS
  // It is not advisable to create screenshots for incorrect layout
  for (let i = 1; i < views.length; i += 1) {
    const view = views[i];

    await scheduler.option('currentView', view.type);

    await t.expect(
      await takeScreenshot(`virtual-scrolling-${view.type}-before-scroll.png`),
    ).ok();

    await scrollTo(scrollConfig[i].firstDate);

    await t.expect(
      await takeScreenshot(`virtual-scrolling-${view.type}-after-scroll.png`),
    ).ok();

    await scrollTo(scrollConfig[i].lastDate);

    await t.expect(
      await takeScreenshot(`virtual-scrolling-${view.type}-before-scroll.png`),
    ).ok();
  }

  await t.expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createScheduler({});
});

test('Virtual scrolling layout in scheduler views when horizontal grouping is enabled', async (t) => {
  const scheduler = new Scheduler('#container');

  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  // TODO: views[0] is day view and we have a bug in its CSS
  // It is not advisable to create screenshots for incorrect layout
  for (let i = 1; i < views.length; i += 1) {
    const view = views[i];

    await scheduler.option('currentView', view.type);

    await t.expect(
      await takeScreenshot(`virtual-scrolling-${view.type}-before-scroll-horizontal-grouping.png`),
    ).ok();

    await scrollTo(scrollConfig[i].firstDate, { resourceId: 6 });

    await t.expect(
      await takeScreenshot(`virtual-scrolling-${view.type}-after-scroll-horizontal-grouping.png`),
    ).ok();

    await scrollTo(scrollConfig[i].lastDate, { resourceId: 0 });

    await t.expect(
      await takeScreenshot(`virtual-scrolling-${view.type}-before-scroll-horizontal-grouping.png`),
    ).ok();
  }

  await t.expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createScheduler({
    views: horizontalViews,
    groups: ['resourceId'],
  });
});

test('Virtual scrolling layout in scheduler views when grouping by date is enabled', async (t) => {
  const scheduler = new Scheduler('#container');

  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  // TODO: views[0] is day view and we have a bug in its CSS
  // It is not advisable to create screenshots for incorrect layout
  for (let i = 1; i < views.length; i += 1) {
    const view = views[i];

    await scheduler.option('currentView', view.type);

    await t.expect(
      await takeScreenshot(`virtual-scrolling-${view.type}-before-scroll-grouping-by-date.png`),
    ).ok();

    await scrollTo(scrollConfig[i].firstDate, { resourceId: 3 });

    await t.expect(
      await takeScreenshot(`virtual-scrolling-${view.type}-after-scroll-grouping-by-date.png`),
    ).ok();

    await scrollTo(scrollConfig[i].lastDate, { resourceId: 0 });

    await t.expect(
      await takeScreenshot(`virtual-scrolling-${view.type}-before-scroll-grouping-by-date.png`),
    ).ok();
  }

  await t.expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createScheduler({
    views: groupedByDateViews,
    groups: ['resourceId'],
  });
});

test('Header cells should be aligned with date-table cells in timeline-month when current date changes and virtual scrolling is used', async (t) => {
  const scheduler = new Scheduler('#container');

  await scheduler.option('currentDate', new Date(2020, 11, 1));

  await t.expect(
    await compareScreenshot(t, 'virtual-scrolling-timeline-month-change-current-date-virtual.png'),
  ).ok();
}).before(async () => {
  await createScheduler({
    currentDate: new Date(2020, 10, 1),
    currentView: 'timelineMonth',
  });
});
