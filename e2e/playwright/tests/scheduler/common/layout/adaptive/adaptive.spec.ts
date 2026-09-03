import type { Page } from '@playwright/test';
import { test } from '../../../../../fixtures';
import { createWidget } from '../../../../../helpers/createWidget';
import { testScreenshot } from '../../../../../helpers/screenshots';
import Scheduler from '../../../../../models/scheduler';
import { ADAPTIVE_SIZE } from '../../const';
import {
  createDataSetForScreenShotTests,
  horizontalViews,
  resourceDataSource,
  verticalViews,
  views,
} from '../utils';

const createScheduler = async (
  page: Page,
  additionalProps: Record<string, unknown>,
): Promise<void> => {
  await createWidget(page, 'dxScheduler', {
    dataSource: createDataSetForScreenShotTests(),
    currentDate: new Date(2020, 6, 15),
    height: 600,
    ...additionalProps,
  });
};

test.describe(() => {
  test.use({ browserSize: ADAPTIVE_SIZE });

  [false, true].forEach((rtlEnabled) => {
    [false, true].forEach((crossScrollingEnabled) => {
      test(`Adaptive views layout test, crossScrollingEnabled=${crossScrollingEnabled}${rtlEnabled ? 'in RTL' : ''}`, async ({ page }) => {
        await createScheduler(page, {
          views,
          currentView: 'day',
          crossScrollingEnabled,
          rtlEnabled,
        });

        const scheduler = new Scheduler(page, '#container');

        for (const view of views) {
          await scheduler.option('currentView', view);

          await testScreenshot(
            page,
            `view=${view}-crossScrolling=${crossScrollingEnabled}${rtlEnabled ? '-rtl' : ''}.png`,
            { element: scheduler.workSpace },
          );
        }
      });

      test(`Adaptive views layout test crossScrollingEnabled=${crossScrollingEnabled} when horizontal grouping${rtlEnabled ? ' and RTL are' : ' is'} used`, async ({ page }) => {
        await createScheduler(page, {
          views: horizontalViews,
          currentView: 'day',
          crossScrollingEnabled,
          rtlEnabled,
          groups: ['priorityId'],
          resources: resourceDataSource,
        });

        const scheduler = new Scheduler(page, '#container');

        for (const view of views) {
          await scheduler.option('currentView', view);

          await testScreenshot(
            page,
            `view=${view}-crossScrolling=${crossScrollingEnabled}-horizontal${rtlEnabled ? '-rtl' : ''}.png`,
            { element: scheduler.workSpace },
          );
        }
      });

      test(`Adaptive views layout test, crossScrollingEnabled=${crossScrollingEnabled} when vertical grouping${rtlEnabled ? ' and RTL are' : ' is'} used`, async ({ page }) => {
        await createScheduler(page, {
          views: verticalViews,
          currentView: 'day',
          crossScrollingEnabled,
          rtlEnabled,
          groups: ['priorityId'],
          resources: resourceDataSource,
        });

        const scheduler = new Scheduler(page, '#container');

        for (const view of views) {
          await scheduler.option('currentView', view);

          await testScreenshot(
            page,
            `view=${view}-crossScrolling=${crossScrollingEnabled}-vertical${rtlEnabled ? '-rtl' : ''}.png`,
            { element: scheduler.workSpace },
          );
        }
      });
    });
  });
});
