import type { Page } from '@playwright/test';
import { expect, test } from '../../../../../../fixtures';
import { createWidget } from '../../../../../../helpers/createWidget';
import { testScreenshot } from '../../../../../../helpers/screenshots';
import Scheduler from '../../../../../../models/scheduler';
import { createDataSetForScreenShotTests, resourceDataSource } from '../../utils';

const createScheduler = async (
  page: Page,
  view: string,
  resourcesValue?: unknown[],
): Promise<void> => {
  await createWidget(page, 'dxScheduler', {
    dataSource: createDataSetForScreenShotTests(),
    currentDate: new Date(2020, 6, 15),
    views: [view],
    currentView: view,
    resources: resourcesValue,
    height: 600,
  });
};

[undefined, resourceDataSource].forEach((resourcesValue) => {
  ['agenda', 'day', 'week', 'month', 'workWeek'].forEach((view) => {
    test(`Base views layout test with resources(view='${view})', resource=${!!resourcesValue}`, async ({ page }) => {
      await createScheduler(page, view, resourcesValue);

      const scheduler = new Scheduler(page, '#container');

      await scheduler.toolbar.element.click();
      await scheduler.getAppointment('1 appointment', 0).element.click();
      expect(await scheduler.appointmentTooltip.isVisible()).toBe(true);

      await testScreenshot(page, `resource(view=${view}-resource=${!!resourcesValue}).png`);
    });
  });
});

[undefined, resourceDataSource].forEach((resourcesValue) => {
  ['timelineDay', 'timelineWeek', 'timelineMonth', 'timelineWorkWeek'].forEach((view) => {
    test(`Timeline views layout test with resources(view='${view})', resource=${!!resourcesValue}`, async ({ page }) => {
      await createScheduler(page, view, resourcesValue);

      const scheduler = new Scheduler(page, '#container');

      /*
       * If appointment position is the same in the next view,then mouse doesn't change
       * their position and doesn't trigger hover effect. This is the reason for the instability
       * of the tests. The following operation ensures that the mouse position is changed.
       */
      await scheduler.toolbar.element.click();
      await scheduler.getAppointment('1 appointment', 0).element.click();
      expect(await scheduler.appointmentTooltip.isVisible()).toBe(true);

      await testScreenshot(page, `resource(view=${view}-resource=${!!resourcesValue}).png`);
    });
  });
});

test('Scheduler should have correct height in month view (T927862)', async ({ page }) => {
  await createWidget(page, 'dxScheduler', {
    dataSource: [],
    views: ['month'],
    currentView: 'month',
    height: 800,
  });

  const scheduler = new Scheduler(page, '#container');

  const dateTableBox = await scheduler.dateTable.boundingBox();
  const workspaceBox = await scheduler.workspaceScrollable.boundingBox();

  expect(dateTableBox!.y + dateTableBox!.height)
    .toBe(workspaceBox!.y + workspaceBox!.height);
});
