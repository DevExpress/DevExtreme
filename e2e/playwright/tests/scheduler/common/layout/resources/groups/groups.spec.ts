import type { Page } from '@playwright/test';
import { test } from '../../../../../../fixtures';
import { createWidget } from '../../../../../../helpers/createWidget';
import { testScreenshot } from '../../../../../../helpers/screenshots';
import { createDataSetForScreenShotTests, resourceDataSource } from '../../utils';

const createScheduler = async (
  page: Page,
  view: string,
  groupOrientation: string,
): Promise<void> => {
  await createWidget(page, 'dxScheduler', {
    dataSource: createDataSetForScreenShotTests(),
    currentDate: new Date(2020, 6, 15),
    startDayHour: 0,
    endDayHour: 4,
    views: [{
      type: view,
      name: view,
      groupOrientation,
    }],
    currentView: view,
    crossScrollingEnabled: true,
    resources: resourceDataSource,
    groups: ['priorityId'],
    height: 700,
  });
};

['vertical', 'horizontal'].forEach((groupOrientation) => {
  ['agenda', 'day', 'week', 'workWeek', 'month'].forEach((view) => {
    test(`Base views layout test with groups(view='${view}', groupOrientation=${groupOrientation})`, async ({ page }) => {
      await createScheduler(page, view, groupOrientation);

      await testScreenshot(page, `groups(view=${view}-orientation=${groupOrientation}).png`);
    });
  });
});

['vertical', 'horizontal'].forEach((groupOrientation) => {
  ['timelineDay', 'timelineWeek', 'timelineWorkWeek', 'timelineMonth'].forEach((view) => {
    test(`Timeline views layout test with groups(view='${view}', groupOrientation=${groupOrientation})`, async ({ page }) => {
      await createScheduler(page, view, groupOrientation);

      await testScreenshot(page, `groups(view=${view}-orientation=${groupOrientation}).png`);
    });
  });
});
