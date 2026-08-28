import { test } from '../../../../../fixtures';
import { createWidget } from '../../../../../helpers/createWidget';
import { testScreenshot } from '../../../../../helpers/screenshots';
import Scheduler from '../../../../../models/scheduler';

test('Scrollable synchronization should work after changing current date (T1027231)', async ({ page }) => {
  await createWidget(page, 'dxScheduler', {
    views: [{
      type: 'week',
      name: 'Horizontal Grouping',
      groupOrientation: 'horizontal',
      cellDuration: 30,
      intervalCount: 2,
    }],
    currentView: 'Horizontal Grouping',
    crossScrollingEnabled: true,
    currentDate: new Date(2021, 3, 21),
    groups: ['priorityId'],
    resources: [{
      fieldExpr: 'priorityId',
      allowMultiple: false,
      dataSource: [
        {
          text: 'Low Priority',
          id: 1,
          color: '#1e90ff',
        }, {
          text: 'High Priority',
          id: 2,
          color: '#ff9747',
        },
      ],
      label: 'Priority',
    }],
    height: 600,
  });

  const scheduler = new Scheduler(page, '#container');

  await scheduler.option('currentDate', new Date(2021, 4, 5));
  await scheduler.scrollTo(new Date(2021, 4, 15), { priorityId: 2 });

  await testScreenshot(page, 'cross-scrolling-sync.png', {
    element: scheduler.workSpace,
  });
});

test('Scrollable should be prepared correctly after change visibility (T1032171)', async ({ page }) => {
  await createWidget(page, 'dxScheduler', {
    dataSource: [],
    views: ['timelineMonth'],
    currentView: 'timelineMonth',
    currentDate: new Date(2021, 1, 2),
    firstDayOfWeek: 0,
    startDayHour: 8,
    endDayHour: 20,
    cellDuration: 60,
    visible: false,
    height: 400,
  });

  const scheduler = new Scheduler(page, '#container');

  await scheduler.option('visible', true);
  await scheduler.scrollTo(new Date(2021, 1, 12));

  await testScreenshot(page, 'cross-scrolling-sync-visibility.png', {
    element: scheduler.workSpace,
  });
});
