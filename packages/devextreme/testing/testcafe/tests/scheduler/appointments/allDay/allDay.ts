import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { insertStylesheetRulesToPage } from '../../../../helpers/domUtils';
import createWidget from '../../../../helpers/createWidget';
import url from '../../../../helpers/getPageUrl';
import Scheduler from '../../../../model/scheduler';

fixture.disablePageReloads`Scheduler - All day appointments`
  .page(url(__dirname, '../../../container.html'));

const data = [{
  text: '0',
  startDate: new Date(2021, 3, 1),
  endDate: new Date(2021, 3, 4),
}, {
  text: '1',
  startDate: new Date(2021, 3, 2),
  endDate: new Date(2021, 3, 5, 0, 0, 1),
}, {
  text: '2',
  startDate: new Date(2021, 3, 2, 1),
  endDate: new Date(2021, 3, 4, 23, 59),
}, {
  text: '3 - Skip',
  startDate: new Date(2021, 3, 3),
  endDate: new Date(2021, 3, 4, 23, 59, 59),
}];

test('it should skip weekend days in workWeek', async (t) => {
  const {
    takeScreenshot,
    compareResults,
  } = createScreenshotsComparer(t);

  await t
    .expect(await takeScreenshot('workweek_all-day_appointments_skip_weekend.png'))
    .ok();

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget(
  'dxScheduler',
  {
    dataSource: data,
    views: [{
      type: 'workWeek',
      intervalCount: 2,
      startDate: new Date(2021, 2, 4),
    }],
    maxAppointmentsPerCell: 'unlimited',
    currentView: 'workWeek',
    currentDate: new Date(2021, 3, 5),
    height: 300,
  },
));

test('it should skip weekend days in timelineWorkWeek', async (t) => {
  const {
    takeScreenshot,
    compareResults,
  } = createScreenshotsComparer(t);

  await t
    .expect(await takeScreenshot('timeline-work-week_all-day_appointments_skip_weekend.png'))
    .ok();

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await insertStylesheetRulesToPage('#container .dx-scheduler-cell-sizes-horizontal { width: 4px; }');

  await createWidget(
    'dxScheduler',
    {
      width: 970,
      height: 300,
      dataSource: data,
      cellDuration: 60,
      views: [{
        type: 'timelineWorkWeek',
        intervalCount: 2,
      }],
      maxAppointmentsPerCell: 'unlimited',
      currentView: 'timelineWorkWeek',
      currentDate: new Date(2021, 3, 2),
    },
  );
});

test('should work correctly for unsorted dataSource', async (t) => {
  const scheduler = new Scheduler('#container');

  const {
    takeScreenshot,
    compareResults,
  } = createScreenshotsComparer(t);

  await t
    .expect(await takeScreenshot('allDay-unsorted-datasource.png', scheduler.workSpace))
    .ok();

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createWidget(
    'dxScheduler',
    {
      dataSource: [{
        id: 3,
        text: '3',
        startDate: new Date('2020-11-23T00:00:00.000'),
        endDate: new Date('2020-11-28T00:00:00.000'),
        allDay: true,
      }, {
        id: 5,
        text: '5',
        startDate: new Date('2020-11-27T00:00:00.000'),
        endDate: new Date('2020-11-27T00:00:00.000'),
        allDay: true,
      }, {
        id: 1,
        text: '1',
        startDate: new Date('2020-11-25T22:20:00.000'),
        endDate: new Date('2020-11-26T12:30:00.000'),
      }],
      views: ['week'],
      currentView: 'week',
      showAllDayPanel: true,
      currentDate: new Date(2020, 10, 25),
      height: 600,
    },
  );
});
