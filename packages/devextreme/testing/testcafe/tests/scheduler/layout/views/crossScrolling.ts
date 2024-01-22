import { compareScreenshot } from 'devextreme-screenshot-comparer';

import createWidget from '../../../../helpers/createWidget';
import url from '../../../../helpers/getPageUrl';
import Scheduler from '../../../../model/scheduler';

fixture`Scheduler: View with cross-scrolling`
  .page(url(__dirname, '../../../container.html'));

test('Scrollable synchronization should work after changing current date (T1027231)', async (t) => {
  const scheduler = new Scheduler('#container');

  await scheduler.option('currentDate', new Date(2021, 4, 5));
  await scheduler.scrollTo(new Date(2021, 4, 15), { priorityId: 2 });

  await t.expect(
    await compareScreenshot(t, 'cross-scrolling-sync.png', scheduler.workSpace),
  ).ok();
}).before(async () => {
  await createWidget('dxScheduler', {
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
});

test('Scrollable should be prepared correctly after change visibility (T1032171)', async (t) => {
  const scheduler = new Scheduler('#container');

  await scheduler.option('visible', true);
  await scheduler.scrollTo(new Date(2021, 1, 12));

  await t.expect(
    await compareScreenshot(t, 'cross-scrolling-sync-visibility.png', scheduler.workSpace),
  ).ok();
}).before(async () => {
  await createWidget('dxScheduler', {
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
});
