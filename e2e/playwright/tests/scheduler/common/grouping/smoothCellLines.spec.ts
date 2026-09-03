import { test } from '../../../../fixtures';
import { createWidget } from '../../../../helpers/createWidget';
import { testScreenshot } from '../../../../helpers/screenshots';
import Scheduler from '../../../../models/scheduler';

const resourcesData = [...Array(20).keys()].map((num: number) => ({
  text: `Name ${num}`,
  id: num,
}));

test('The group panel and date table stay in sync during scrolling on material themes (T1146448)', async ({ page }) => {
  await createWidget(page, 'dxScheduler', {
    dataSource: [],
    views: ['timelineWeek'],
    currentView: 'timelineWeek',
    groups: ['ownerId'],
    currentDate: new Date(2021, 1, 2),
    resources: [{ fieldExpr: 'ownerId', dataSource: resourcesData, label: 'Owner' }],
    height: 600,
  });

  const scheduler = new Scheduler(page, '#container');

  await scheduler.scrollWorkSpaceTo({ left: 0, top: 1100 });

  await testScreenshot(page, 'scrolling-vertical', {
    element: scheduler.workSpace,
  });
});
