import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import Scheduler from 'devextreme-testcafe-models/scheduler';
import { createWidget } from '../../../../../helpers/createWidget';
import url from '../../../../../helpers/getPageUrl';
import { ADAPTIVE_SIZE } from '../../const';
import { testScreenshot } from '../../../../../helpers/themeUtils';
import {
  createDataSetForScreenShotTests,
  resourceDataSource,
  views,
  verticalViews,
  horizontalViews,
} from '../utils';

fixture.disablePageReloads`Scheduler: Adaptive layout in themes`
  .page(url(__dirname, '../../../../container.html'));

const createScheduler = async (
  additionalProps: Record<string, unknown>,
): Promise<void> => {
  await createWidget('dxScheduler', {
    dataSource: createDataSetForScreenShotTests(),
    currentDate: new Date(2020, 6, 15),
    height: 600,
    ...additionalProps,
  });
};

// visual: generic.light
// visual: fluent.blue.light
// visual: material.blue.light
[false, true].forEach((rtlEnabled) => {
  [false, true].forEach((crossScrollingEnabled) => {
    test.meta({ browserSize: ADAPTIVE_SIZE })(`Adaptive views layout test, crossScrollingEnabled=${crossScrollingEnabled}${rtlEnabled ? 'in RTL' : ''}`, async (t) => {
      const scheduler = new Scheduler('#container');
      const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

      // eslint-disable-next-line no-restricted-syntax
      for (const view of views) {
        await scheduler.option('currentView', view);

        await testScreenshot(
          t,
          takeScreenshot,
          `view=${view}-crossScrolling=${crossScrollingEnabled}${rtlEnabled ? '-rtl' : ''}.png`,
          { element: scheduler.workSpace },
        );
      }

      await t.expect(compareResults.isValid())
        .ok(compareResults.errorMessages());
    }).before(async () => {
      await createScheduler({
        views,
        currentView: 'day',
        crossScrollingEnabled,
        rtlEnabled,
      });
    });

    test.meta({ browserSize: ADAPTIVE_SIZE })(`Adaptive views layout test crossScrollingEnabled=${crossScrollingEnabled} when horizontal grouping${rtlEnabled ? ' and RTL are' : ' is'} used`, async (t) => {
      const scheduler = new Scheduler('#container');
      const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

      // eslint-disable-next-line no-restricted-syntax
      for (const view of views) {
        await scheduler.option('currentView', view);

        await testScreenshot(
          t,
          takeScreenshot,
          `view=${view}-crossScrolling=${crossScrollingEnabled}-horizontal${rtlEnabled ? '-rtl' : ''}.png`,
          { element: scheduler.workSpace },
        );
      }

      await t.expect(compareResults.isValid())
        .ok(compareResults.errorMessages());
    }).before(async () => {
      await createScheduler({
        views: horizontalViews,
        currentView: 'day',
        crossScrollingEnabled,
        rtlEnabled,
        groups: ['priorityId'],
        resources: resourceDataSource,
      });
    });

    test.meta({ browserSize: ADAPTIVE_SIZE })(`Adaptive views layout test, crossScrollingEnabled=${crossScrollingEnabled} when vertical grouping${rtlEnabled ? ' and RTL are' : ' is'} used`, async (t) => {
      const scheduler = new Scheduler('#container');
      const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

      // eslint-disable-next-line no-restricted-syntax
      for (const view of views) {
        await scheduler.option('currentView', view);

        await testScreenshot(
          t,
          takeScreenshot,
          `view=${view}-crossScrolling=${crossScrollingEnabled}-vertical${rtlEnabled ? '-rtl' : ''}.png`,
          { element: scheduler.workSpace },
        );
      }

      await t.expect(compareResults.isValid())
        .ok(compareResults.errorMessages());
    }).before(async () => {
      await createScheduler({
        views: verticalViews,
        currentView: 'day',
        crossScrollingEnabled,
        rtlEnabled,
        groups: ['priorityId'],
        resources: resourceDataSource,
      });
    });
  });
});
