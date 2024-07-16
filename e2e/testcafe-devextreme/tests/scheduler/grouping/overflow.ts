import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import Scheduler from 'devextreme-testcafe-models/scheduler';
import { changeTheme } from '../../../helpers/changeTheme';
import { createWidget } from '../../../helpers/createWidget';
import url from '../../../helpers/getPageUrl';

fixture.disablePageReloads`Scheduler: SmoothCellLines`
  .page(url(__dirname, '../../container.html'));

test('Long appointments should not overflow group view', async (t) => {
  const scheduler = new Scheduler('#container');
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await t
    .expect(await takeScreenshot('group-overflow', scheduler.element))
    .ok()
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await changeTheme('material.blue.light');

  return createWidget('dxScheduler', {
    timeZone: 'America/Los_Angeles',
    dataSource: [
      {
        text: '1',
        priorityId: 1,
        startDate: new Date('2021-04-19T16:30:00.000Z'),
        endDate: new Date('2021-04-25T18:30:00.000Z'),
      }, {
        text: '2',
        priorityId: 2,
        startDate: new Date('2021-04-19T16:30:00.000Z'),
        endDate: new Date('2021-04-25T18:30:00.000Z'),
      }, {
        text: '3',
        priorityId: 3,
        startDate: new Date('2021-04-19T16:30:00.000Z'),
        endDate: new Date('2021-04-25T18:30:00.000Z'),
      },
    ],
    views: [{
      type: 'workWeek',
      name: 'Vertical Grouping',
      groupOrientation: 'vertical',
      cellDuration: 60,
      intervalCount: 2,
    }],
    currentView: 'Vertical Grouping',
    currentDate: new Date(2021, 3, 21),
    allDayPanelMode: 'hidden',
    startDayHour: 9,
    endDayHour: 14,
    groups: ['priorityId'],
    resources: [
      {
        fieldExpr: 'priorityId',
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
          {
            text: 'Custom',
            id: 3,
            color: 'red',
          },
        ],
      },
    ],
    showAllDayPanel: false,
  });
}).after(async () => {
  await changeTheme('generic.light');
});
