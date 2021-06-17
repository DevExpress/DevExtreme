import { createScreenshotsComparer } from '../../../../../helpers/screenshot-comparer';
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

fixture`Scheduler: Adaptive Generic theme layout`
  .page(url(__dirname, '../../../../container.html'));

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

[false, true].forEach((crossScrollingEnabled) => {
  test(`Adaptive views layout test in generic theme, crossScrollingEnabled=${crossScrollingEnabled}`, async (t) => {
    const scheduler = new Scheduler('#container');
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    // eslint-disable-next-line no-restricted-syntax
    for (const view of views) {
      await scheduler.option('currentView', view);

      await t.expect(
        await takeScreenshot(`generic-view=${view}-crossScrolling=${!!crossScrollingEnabled}.png`),
      ).ok();
    }

    await t.expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
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

  test(`Adaptive views layout test in generic theme, crossScrollingEnabled=${crossScrollingEnabled} when horizontal grouping is used`, async (t) => {
    const scheduler = new Scheduler('#container');
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    // eslint-disable-next-line no-restricted-syntax
    for (const view of views) {
      await scheduler.option('currentView', view);

      await t.expect(
        await takeScreenshot(`generic-view=${view}-crossScrolling=${!!crossScrollingEnabled}-horizontal.png`),
      ).ok();
    }

    await t.expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
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

  test(`Adaptive views layout test in generic theme, crossScrollingEnabled=${crossScrollingEnabled} when vertical grouping is used`, async (t) => {
    const scheduler = new Scheduler('#container');
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    // eslint-disable-next-line no-restricted-syntax
    for (const view of views) {
      await scheduler.option('currentView', view);

      await t.expect(
        await takeScreenshot(`generic-view=${view}-crossScrolling=${!!crossScrollingEnabled}-vertical.png`),
      ).ok();
    }

    await t.expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async (t) => {
    await t.resizeWindow(400, 600);

    await createScheduler({
      views: verticalViews,
      currentView: 'day',
      crossScrollingEnabled,
      groups: ['priorityId'],
      resources: resourceDataSource,
    });
  }).after(async (t) => {
    await restoreBrowserSize(t);
  });
});
