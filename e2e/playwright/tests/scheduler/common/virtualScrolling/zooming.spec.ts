import type { Page } from '@playwright/test';
import { test } from '../../../../fixtures';
import { createWidget } from '../../../../helpers/createWidget';
import { testScreenshot } from '../../../../helpers/screenshots';
import Scheduler from '../../../../models/scheduler';
import {
  horizontalViews,
  resources,
  scrollConfig,
  setZoomLevel,
  views,
} from './utils';

// We don't support zooming (known limitation)

const createScheduler = async (
  page: Page,
  additionalProps: Record<string, unknown>,
): Promise<void> => createWidget(page, 'dxScheduler', {
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

test('Virtual scrolling layout in scheduler views when horizontal grouping is enabled and zooming is used', async ({ page }) => {
  await setZoomLevel(page, 125);
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

    await testScreenshot(
      page,
      `virtual-scrolling-${view.type}-before-scroll-horizontal-grouping-scaling.png`,
    );

    await scheduler.scrollTo(scrollConfig[i].firstDate, { resourceId: 7 });

    await testScreenshot(
      page,
      `virtual-scrolling-${view.type}-after-scroll-horizontal-grouping-scaling.png`,
    );
  }

  await setZoomLevel(page, 0);
});
