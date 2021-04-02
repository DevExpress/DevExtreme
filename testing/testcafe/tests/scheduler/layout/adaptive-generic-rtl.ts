import { compareScreenshot } from '../../../helpers/screenshot-comparer';
import createWidget from '../../../helpers/createWidget';
import url from '../../../helpers/getPageUrl';
import { createDataSetForScreenShotTests } from './utils';
import Scheduler from '../../../model/scheduler';

fixture`Scheduler: Adaptive Generic theme layout in RTL`
  .page(url(__dirname, '../../container.html'));

const createScheduler = async (
  additionalProps: Record<string, unknown>,
): Promise<void> => {
  await createWidget('dxScheduler', {
    dataSource: createDataSetForScreenShotTests(),
    currentDate: new Date(2020, 6, 15),
    height: 600,
    rtlEnabled: true,
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
  test(`Adaptive views layout test in generic theme, crossScrollingEnabled=${crossScrollingEnabled} in RTL`, async (t) => {
    const scheduler = new Scheduler('#container');

    // eslint-disable-next-line no-restricted-syntax
    for (const view of views) {
      await scheduler.option('currentView', view);

      await t.expect(
        await compareScreenshot(t, `adaptive-generic-layout(view=${view}-crossScrollingEnabled=${!!crossScrollingEnabled}-rtl).png`),
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

  const horizontalViews = views
    .map((viewType) => ({
      type: viewType,
      groupOrientation: 'horizontal',
    }));

  test(`Adaptive views layout test in generic theme, crossScrollingEnabled=${crossScrollingEnabled} when horizontal grouping and RTL are used`, async (t) => {
    const scheduler = new Scheduler('#container');

    // eslint-disable-next-line no-restricted-syntax
    for (const view of views) {
      await scheduler.option('currentView', view);

      await t.expect(
        await compareScreenshot(t, `adaptive-generic-layout(view=${view}-crossScrollingEnabled=${!!crossScrollingEnabled}-horizontal-grouping-rtl).png`),
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

  const verticalViews = views
    // TODO: There is a bug in RTL in timeline views even without adaptivity which breaks markup.
    // We should test timeline views too after we reowrk our markup
    .slice(0, 4)
    .map((viewType) => ({
      type: viewType,
      groupOrientation: 'vertical',
    }));

  test(`Adaptive views layout test in generic theme, crossScrollingEnabled=${crossScrollingEnabled} when vertical grouping and RTL are used`, async (t) => {
    const scheduler = new Scheduler('#container');

    // eslint-disable-next-line no-restricted-syntax
    for (const view of views) {
      await scheduler.option('currentView', view);

      await t.expect(
        await compareScreenshot(t, `adaptive-generic-layout(view=${view}-crossScrollingEnabled=${!!crossScrollingEnabled}-vertical-grouping-rtl).png`),
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
