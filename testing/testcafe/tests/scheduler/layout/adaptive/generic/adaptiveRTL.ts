import { compareScreenshot } from '../../../../../helpers/screenshot-comparer';
import createWidget from '../../../../../helpers/createWidget';
import url from '../../../../../helpers/getPageUrl';
import Scheduler from '../../../../../model/scheduler';
import {
  createDataSetForScreenShotTests,
  resourceDataSource,
  views,
  verticalViews,
  horizontalViews,
} from '../../utils';
import { restoreBrowserSize } from '../../../../../helpers/restoreBrowserSize';

fixture`Scheduler: Adaptive Generic theme layout in RTL`
  .page(url(__dirname, '../../../../container.html'));

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

[false, true].forEach((crossScrollingEnabled) => {
  // TODO: There is a bug in RTL in timeline views even without adaptivity which breaks markup.
  // We should test timeline views too after we reowrk our markup
  const lastVerticalView = crossScrollingEnabled ? 4 : 8;

  const verticalViewsForRTL = verticalViews.slice(0, lastVerticalView);

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
    await restoreBrowserSize(t);
  });

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
      resources: resourceDataSource,
    });
  }).after(async (t) => {
    await restoreBrowserSize(t);
  });

  test(`Adaptive views layout test in generic theme, crossScrollingEnabled=${crossScrollingEnabled} when vertical grouping and RTL are used`, async (t) => {
    const scheduler = new Scheduler('#container');

    // eslint-disable-next-line no-restricted-syntax
    for (const view of verticalViewsForRTL) {
      await scheduler.option('currentView', view.type);

      await t.expect(
        await compareScreenshot(t, `adaptive-generic-layout(view=${view.type}-crossScrollingEnabled=${!!crossScrollingEnabled}-vertical-grouping-rtl).png`),
      ).ok();
    }
  }).before(async (t) => {
    await t.resizeWindow(400, 600);

    await createScheduler({
      views: verticalViewsForRTL,
      currentView: 'day',
      crossScrollingEnabled,
      groups: ['priorityId'],
      resources: resourceDataSource,
    });
  }).after(async (t) => {
    await restoreBrowserSize(t);
  });
});
