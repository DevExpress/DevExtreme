import type { Page } from '@playwright/test';
import { test } from '../../../../fixtures';
import { createWidget } from '../../../../helpers/createWidget';
import { testScreenshot } from '../../../../helpers/screenshots';
import Scheduler from '../../../../models/scheduler';
import {
  createDataSetForScreenShotTests,
  groupedByDateViews,
  horizontalViews,
  resources,
  scrollConfig,
  views,
} from './utils';

const createScheduler = async (
  page: Page,
  additionalProps: Record<string, unknown>,
): Promise<void> => createWidget(page, 'dxScheduler', {
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

test('Virtual scrolling layout in scheduler views', async ({ page }) => {
  await createScheduler(page, {});

  const scheduler = new Scheduler(page, '#container');

  // TODO: views[0] is day view and we have a bug in its CSS
  // It is not advisable to create screenshots for incorrect layout
  for (let i = 1; i < views.length; i += 1) {
    const view = views[i];

    await scheduler.option('currentView', view.type);
    await scheduler.scrollTo(scrollConfig[i].firstDate);

    await testScreenshot(page, `virtual-scrolling-${view.type}-after-scroll.png`);

    await scheduler.scrollTo(scrollConfig[i].lastDate);

    await testScreenshot(page, `virtual-scrolling-${view.type}-before-scroll.png`);
  }
});

test('Virtual scrolling layout in scheduler views when horizontal grouping is enabled', async ({ page }) => {
  await createScheduler(page, {
    views: horizontalViews,
    groups: ['resourceId'],
  });

  const scheduler = new Scheduler(page, '#container');

  // TODO: views[0] is day view and we have a bug in its CSS
  // It is not advisable to create screenshots for incorrect layout
  for (let i = 1; i < views.length; i += 1) {
    const view = views[i];

    await scheduler.option('currentView', view.type);
    await scheduler.scrollTo(scrollConfig[i].firstDate, { resourceId: 6 });

    await testScreenshot(page, `virtual-scrolling-${view.type}-after-scroll-horizontal-grouping.png`);

    await scheduler.scrollTo(scrollConfig[i].lastDate, { resourceId: 0 });

    await testScreenshot(page, `virtual-scrolling-${view.type}-before-scroll-horizontal-grouping.png`);
  }
});

test('Virtual scrolling layout in scheduler views when grouping by date is enabled', async ({ page }) => {
  await createScheduler(page, {
    views: groupedByDateViews,
    groups: ['resourceId'],
  });

  const scheduler = new Scheduler(page, '#container');

  // TODO: views[0] is day view and we have a bug in its CSS
  // It is not advisable to create screenshots for incorrect layout
  for (let i = 1; i < views.length; i += 1) {
    const view = views[i];

    await scheduler.option('currentView', view.type);

    await scheduler.scrollTo(scrollConfig[i].firstDate, { resourceId: 3 });

    await testScreenshot(page, `virtual-scrolling-${view.type}-after-scroll-grouping-by-date.png`);

    await scheduler.scrollTo(scrollConfig[i].lastDate, { resourceId: 0 });

    await testScreenshot(page, `virtual-scrolling-${view.type}-before-scroll-grouping-by-date.png`);
  }
});

test('Header cells should be aligned with date-table cells in timeline-month when current date changes and virtual scrolling is used', async ({ page }) => {
  await createScheduler(page, {
    currentDate: new Date(2020, 10, 1),
    currentView: 'timelineMonth',
  });

  const scheduler = new Scheduler(page, '#container');

  await scheduler.option('currentDate', new Date(2020, 11, 1));

  await testScreenshot(page, 'virtual-scrolling-timeline-month-change-current-date-virtual.png');
});
