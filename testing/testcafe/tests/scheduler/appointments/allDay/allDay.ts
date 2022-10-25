import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import createWidget from '../../../../helpers/createWidget';
import url from '../../../../helpers/getPageUrl';

fixture`Scheduler - All day appointments`
  .page(url(__dirname, './containers/containerAllDay.html'));

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
  await t.resizeWindow(1200, 800);

  const {
    takeScreenshot,
    compareResults,
  } = createScreenshotsComparer(t);

  await t
    .expect(await takeScreenshot('workweek_all-day_appointments_skip_weekend.png'))
    .ok()
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
  true,
  '#workweek',
));

test('it should skip weekend days in timelineWorkWeek', async (t) => {
  const {
    takeScreenshot,
    compareResults,
  } = createScreenshotsComparer(t);

  await t
    .expect(await takeScreenshot('timeline-work-week_all-day_appointments_skip_weekend.png'))
    .ok()
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget(
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
  true,
  '#timeline-workweek',
));
