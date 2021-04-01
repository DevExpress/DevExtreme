import { compareScreenshot } from '../../../helpers/screenshot-comparer';
import createWidget from '../../../helpers/createWidget';
import url from '../../../helpers/getPageUrl';
import { createDataSetForScreenShotTests } from './utils';
import Scheduler from '../../../model/scheduler';

fixture`Scheduler: Generic theme layout`
  .page(url(__dirname, '../../container.html'));

const createScheduler = async (
  additionalProps: Record<string, unknown>,
): Promise<void> => {
  await createWidget('dxScheduler', {
    dataSource: createDataSetForScreenShotTests(),
    currentDate: new Date(2020, 6, 15),
    height: 600,
    ...additionalProps,
  }, true);
};

const views = ['day', 'week', 'workWeek', 'month', 'timelineDay', 'timelineWeek', 'timelineWorkWeek', 'timelineMonth'];

const resources = [{
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
}];

[false, true].forEach((crossScrollingEnabled) => {
  test(`Adaptive views layout test in generic theme, crossScrollingEnabled=${crossScrollingEnabled}`, async (t) => {
    const scheduler = new Scheduler('#container');

    // eslint-disable-next-line no-restricted-syntax
    for (const view of views) {
      await scheduler.option('currentView', view);

      await t.expect(
        await compareScreenshot(t, `adaptive-generic-layout(view=${view}-crossScrollingEnabled=${!!crossScrollingEnabled}).png`),
      ).ok();
    }
  }).before(async (t) => {
    await t.resizeWindow(400, 600);

    await createScheduler({
      views,
      currentView: 'day',
      crossScrollingEnabled,
    });
  }).after(async (t) => {
    await t.resizeWindow(1200, 800);
  });
});

[false, true].forEach((crossScrollingEnabled) => {
  const horizontalViews = views
    .map((viewType) => ({
      type: viewType,
      groupOrientation: 'horizontal',
    }));

  test(`Adaptive views layout test in generic theme, crossScrollingEnabled=${crossScrollingEnabled} when horizontal grouping is used`, async (t) => {
    const scheduler = new Scheduler('#container');

    // eslint-disable-next-line no-restricted-syntax
    for (const view of views) {
      await scheduler.option('currentView', view);

      await t.expect(
        await compareScreenshot(t, `adaptive-generic-layout(view=${view}-crossScrollingEnabled=${!!crossScrollingEnabled}-horizontal-grouping).png`),
      ).ok();
    }
  }).before(async (t) => {
    await t.resizeWindow(400, 600);

    await createScheduler({
      views: horizontalViews,
      currentView: 'day',
      crossScrollingEnabled,
      groups: ['priorityId'],
      resources,
    });
  }).after(async (t) => {
    await t.resizeWindow(1200, 800);
  });
});

[false, true].forEach((crossScrollingEnabled) => {
  const verticalViews = views
    .map((viewType) => ({
      type: viewType,
      groupOrientation: 'vertical',
    }));

  test(`Adaptive views layout test in generic theme, crossScrollingEnabled=${crossScrollingEnabled} when vertical grouping is used`, async (t) => {
    const scheduler = new Scheduler('#container');

    // eslint-disable-next-line no-restricted-syntax
    for (const view of views) {
      await scheduler.option('currentView', view);

      await t.expect(
        await compareScreenshot(t, `adaptive-generic-layout(view=${view}-crossScrollingEnabled=${!!crossScrollingEnabled}-vertical-grouping).png`),
      ).ok();
    }
  }).before(async (t) => {
    await t.resizeWindow(400, 600);

    await createScheduler({
      views: verticalViews,
      currentView: 'day',
      crossScrollingEnabled,
      groups: ['priorityId'],
      resources,
    });
  }).after(async (t) => {
    await t.resizeWindow(1200, 800);
  });
});
