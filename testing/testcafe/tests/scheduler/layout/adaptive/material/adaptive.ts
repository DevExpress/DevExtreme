import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import createWidget, { disposeWidgets } from '../../../../../helpers/createWidget';
import url from '../../../../../helpers/getPageUrl';
import { safeSizeTest } from '../../../../../helpers/safeSizeTest';
import Scheduler from '../../../../../model/scheduler';
import { ADAPTIVE_SIZE } from '../../../const';
import {
  createDataSetForScreenShotTests,
  resourceDataSource,
  views,
  verticalViews,
  horizontalViews,
} from '../../utils';
import { changeTheme } from '../../../../../helpers/changeTheme';

fixture.skip`Scheduler: Adaptive material theme layout`
  .page(url(__dirname, '../../../../container.html'))
  .afterEach(async () => disposeWidgets());

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
  safeSizeTest(`Adaptive views layout test in material theme, crossScrollingEnabled=${crossScrollingEnabled}`, async (t) => {
    const scheduler = new Scheduler('#container');
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    // eslint-disable-next-line no-restricted-syntax
    for (const view of views) {
      await scheduler.option('currentView', view);

      await t.expect(
        await takeScreenshot(`material-view=${view}-crossScrolling=${crossScrollingEnabled}.png`, scheduler.workSpace),
      ).ok();
    }

    await changeTheme('generic.light');

    await t.expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }, ADAPTIVE_SIZE).before(async () => {
    await changeTheme('material.blue.light');

    await createScheduler({
      views,
      currentView: 'day',
      crossScrollingEnabled,
    });
  }).after(async () => disposeWidgets());

  safeSizeTest(`Adaptive views layout test in material theme, crossScrollingEnabled=${crossScrollingEnabled} when horizontal grouping is used`, async (t) => {
    const scheduler = new Scheduler('#container');
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    // eslint-disable-next-line no-restricted-syntax
    for (const view of views) {
      await scheduler.option('currentView', view);

      await t.expect(
        await takeScreenshot(`material-view=${view}-crossScrolling=${crossScrollingEnabled}-horizontal.png`, scheduler.workSpace),
      ).ok();
    }

    await changeTheme('generic.light');

    await t.expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }, ADAPTIVE_SIZE).before(async () => {
    await changeTheme('material.blue.light');

    await createScheduler({
      views: horizontalViews,
      currentView: 'day',
      crossScrollingEnabled,
      groups: ['priorityId'],
      resources: resourceDataSource,
    });
  }).after(async () => disposeWidgets());

  safeSizeTest(`Adaptive views layout test in material theme, crossScrollingEnabled=${crossScrollingEnabled} when vertical grouping is used`, async (t) => {
    const scheduler = new Scheduler('#container');
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    // eslint-disable-next-line no-restricted-syntax
    for (const view of views) {
      await scheduler.option('currentView', view);

      await t.expect(
        await takeScreenshot(`material-view=${view}-crossScrolling=${crossScrollingEnabled}-vertical.png`, scheduler.workSpace),
      ).ok();
    }

    await changeTheme('generic.light');

    await t.expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }, ADAPTIVE_SIZE).before(async () => {
    await changeTheme('material.blue.light');

    await createScheduler({
      views: verticalViews,
      currentView: 'day',
      crossScrollingEnabled,
      groups: ['priorityId'],
      resources: resourceDataSource,
    });
  }).after(async () => disposeWidgets());
});
