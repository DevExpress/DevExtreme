import { ClientFunction } from 'testcafe';
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import createWidget from '../../helpers/createWidget';
import Scheduler from '../../model/scheduler';
import { extend } from '../../../../js/core/utils/extend';
import url from '../../helpers/getPageUrl';

fixture`Scheduler: Workspace`
  .page(url(__dirname, '../container.html'));

const createScheduler = async (options = {}): Promise<void> => {
  await createWidget('dxScheduler', extend(options, {
    dataSource: [],
    startDayHour: 9,
    height: 600,
  }));
};

test('Vertical selection between two workspace cells should focus cells between them (T804954)', async (t) => {
  const scheduler = new Scheduler('#container');

  await t
    .dragToElement(scheduler.getDateTableCell(0, 0), scheduler.getDateTableCell(3, 0))
    .expect(scheduler.dateTableCells.filter('.dx-state-focused').count).eql(4);
}).before(async () => createScheduler({
  views: [{ name: '2 Days', type: 'day', intervalCount: 2 }],
  currentDate: new Date(2015, 1, 9),
  currentView: 'day',
}));

test('Horizontal selection between two workspace cells should focus cells between them', async (t) => {
  const scheduler = new Scheduler('#container');

  await t
    .dragToElement(scheduler.getDateTableCell(0, 0), scheduler.getDateTableCell(0, 3))
    .expect(scheduler.dateTableCells.filter('.dx-state-focused').count)
    .eql(4);
}).before(async () => createScheduler({
  views: ['timelineWeek'],
  currentDate: new Date(2015, 1, 9),
  currentView: 'timelineWeek',
  groups: ['roomId'],
  resources: [{
    fieldExpr: 'roomId',
    label: 'Room',
    dataSource: [{
      text: '1', id: 1,
    }, {
      text: '2', id: 2,
    }],
  }],
}));

test('Vertical grouping should work correctly when there is one group', async (t) => {
  const scheduler = new Scheduler('#container');

  await t
    .expect(scheduler.dateTableCells.count)
    .eql(336);
}).before(async () => createWidget('dxScheduler', {
  views: [{
    type: 'week',
    groupOrientation: 'vertical',
  }],
  currentView: 'week',
  dataSource: [],
  groups: ['priorityId'],
  resources: [{
    field: 'priorityId',
    dataSource: [{ id: 1, color: 'black' }],
  }],
  height: 600,
}));

const hideShow = ClientFunction((container) => {
  const instance = ($(container) as any).dxScheduler('instance');
  instance.option('visible', !instance.option('visible'));
});

const resize = ClientFunction((container) => {
  const instance = ($(container) as any).dxScheduler('instance');
  // eslint-disable-next-line no-underscore-dangle
  instance._dimensionChanged();
  // eslint-disable-next-line no-underscore-dangle
  instance._workSpace._dimensionChanged();
});

test('Hidden scheduler should not resize', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await hideShow('#container');
  await resize('#container');
  await hideShow('#container');

  await t
    .expect(await takeScreenshot('scheduler-after-hiding-and-resizing.png'))
    .ok()

    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxScheduler', {
  dataSource: [
    {
      text: 'Google AdWords Strategy',
      ownerId: [2],
      startDate: new Date('2021-02-01T16:00:00.000Z'),
      endDate: new Date('2021-02-01T17:30:00.000Z'),
      priority: 1,
    },
  ],
  resources: [
    {
      fieldExpr: 'priority',
      dataSource: [
        {
          text: 'Priority 1',
          id: 1,
          color: '#1e90ff',
        },
      ],
      label: 'Priority',
    },
  ],
  groups: ['priority'],
  views: [
    {
      type: 'timelineMonth',
      groupOrientation: 'vertical',
    },
  ],
  crossScrollingEnabled: true,
  currentView: 'timelineMonth',
  currentDate: new Date(2021, 1, 1),
  height: 400,
}));

test('All day panel should be hidden when allDayPanelMode=hidden by initializing scheduler', async (t) => {
  const scheduler = new Scheduler('#container');

  await t
    .expect(scheduler.allDayTitle.exists)
    .eql(false);

  await t
    .expect(scheduler.allDayRow.exists)
    .eql(false);
}).before(async () => createWidget('dxScheduler', {
  currentDate: new Date(2021, 2, 28),
  currentView: 'day',
  allDayPanelMode: 'hidden',
  dataSource: [{
    text: 'Book Flights to San Fran for Sales Trip',
    startDate: new Date('2021-03-28T17:00:00.000Z'),
    endDate: new Date('2021-03-28T18:00:00.000Z'),
    allDay: true,
  }, {
    text: 'Customer Workshop',
    startDate: new Date('2021-03-29T17:30:00.000Z'),
    endDate: new Date('2021-04-03T19:00:00.000Z'),
  }],
}));
