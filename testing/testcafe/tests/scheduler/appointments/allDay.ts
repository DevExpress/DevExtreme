import { createScreenshotsComparer } from '../../../helpers/screenshot-comparer';
import createWidget from '../../../helpers/createWidget';
import url from '../../../helpers/getPageUrl';

fixture`Scheduler - All day appointments`
  .page(url(__dirname, './containerAllDay.html'));

test('it should skip weekend days in workWeek', async (t) => {
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
    dataSource: [{
      text: 'Test-01',
      startDate: new Date(2021, 3, 2, 1),
      endDate: new Date(2021, 3, 5, 0, 1),
    }],
    views: [{
      type: 'workWeek',
      intervalCount: 2,
      startDate: new Date(2021, 2, 4),
    }],
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
    dataSource: [{
      text: 'Test-01',
      startDate: new Date(2021, 3, 2, 1),
      endDate: new Date(2021, 3, 5, 0, 1),
    }],
    cellDuration: 60,
    views: [{
      type: 'timelineWorkWeek',
      intervalCount: 2,
    }],
    currentView: 'timelineWorkWeek',
    currentDate: new Date(2021, 3, 2),
  },
  true,
  '#timeline-workweek',
));
