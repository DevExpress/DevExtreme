import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import createWidget from '../../../../helpers/createWidget';
import url from '../../../../helpers/getPageUrl';
import { safeSizeTest } from '../../../../helpers/safeSizeTest';
import Scheduler from '../../../../model/scheduler';
import { ADAPTIVE_SIZE } from '../../const';
import { changeTheme } from '../../../../helpers/changeTheme';
import {
  createDataSetForScreenShotTests,
  resourceDataSource,
  views,
  verticalViews,
  horizontalViews,
} from '../utils';

fixture`Scheduler: Adaptive layout in themes`
  .page(url(__dirname, '../../../container.html'));

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

['generic.light', 'material.blue.light'].forEach((theme) => {
  const themePrefix = theme.split('.')[0];

  [false, true].forEach((rtlEnabled) => {
    [false, true].forEach((crossScrollingEnabled) => {
      safeSizeTest(`Adaptive views layout test in ${themePrefix} theme, crossScrollingEnabled=${crossScrollingEnabled}${rtlEnabled ? 'in RTL' : ''}`, async (t) => {
        const scheduler = new Scheduler('#container');
        const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

        // eslint-disable-next-line no-restricted-syntax
        for (const view of views) {
          await scheduler.option('currentView', view);

          await t.expect(
            await takeScreenshot(`${themePrefix}-view=${view}-crossScrolling=${crossScrollingEnabled}${rtlEnabled ? '-rtl' : ''}.png`, scheduler.workSpace),
          ).ok();
        }

        await t.expect(compareResults.isValid())
          .ok(compareResults.errorMessages());
      }, ADAPTIVE_SIZE).before(async () => {
        await changeTheme(theme);

        await createScheduler({
          views,
          currentView: 'day',
          crossScrollingEnabled,
          rtlEnabled,
        });
      }).after(async () => {
        await changeTheme('generic.light');
      });

      safeSizeTest(`Adaptive views layout test in ${themePrefix} theme, crossScrollingEnabled=${crossScrollingEnabled} when horizontal grouping${rtlEnabled ? ' and RTL are' : ' is'} used`, async (t) => {
        const scheduler = new Scheduler('#container');
        const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

        // eslint-disable-next-line no-restricted-syntax
        for (const view of views) {
          await scheduler.option('currentView', view);

          await t.expect(
            await takeScreenshot(`${themePrefix}-view=${view}-crossScrolling=${crossScrollingEnabled}-horizontal${rtlEnabled ? '-rtl' : ''}.png`, scheduler.workSpace),
          ).ok();
        }

        await t.expect(compareResults.isValid())
          .ok(compareResults.errorMessages());
      }, ADAPTIVE_SIZE).before(async () => {
        await changeTheme(theme);

        await createScheduler({
          views: horizontalViews,
          currentView: 'day',
          crossScrollingEnabled,
          rtlEnabled,
          groups: ['priorityId'],
          resources: resourceDataSource,
        });
      }).after(async () => {
        await changeTheme('generic.light');
      });

      safeSizeTest(`Adaptive views layout test in ${themePrefix} theme, crossScrollingEnabled=${crossScrollingEnabled} when vertical grouping${rtlEnabled ? ' and RTL are' : ' is'} used`, async (t) => {
        const scheduler = new Scheduler('#container');
        const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

        // eslint-disable-next-line no-restricted-syntax
        for (const view of views) {
          await scheduler.option('currentView', view);

          await t.expect(
            await takeScreenshot(`${themePrefix}-view=${view}-crossScrolling=${crossScrollingEnabled}-vertical${rtlEnabled ? '-rtl' : ''}.png`, scheduler.workSpace),
          ).ok();
        }

        await t.expect(compareResults.isValid())
          .ok(compareResults.errorMessages());
      }, ADAPTIVE_SIZE).before(async () => {
        await changeTheme(theme);

        await createScheduler({
          views: verticalViews,
          currentView: 'day',
          crossScrollingEnabled,
          rtlEnabled,
          groups: ['priorityId'],
          resources: resourceDataSource,
        });
      }).after(async () => {
        await changeTheme('generic.light');
      });
    });
  });
});
