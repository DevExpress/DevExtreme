import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import createWidget from '../../../helpers/createWidget';
import url from '../../../helpers/getPageUrl';

fixture`Timeline Appointments`
  .page(url(__dirname, '../../container.html'));

test('all-day and ordinary appointments should overlap each other correctly in timeline views (T1017889)', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await t
    .expect(await takeScreenshot('timeline-overlapping-appointments.png'))
    .ok()

    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxScheduler', {
  dataSource: [{
    text: 'Google AdWords Strategy',
    startDate: new Date(2021, 1, 1, 10),
    endDate: new Date(2021, 1, 1, 11),
    allDay: true,
  }, {
    text: 'Brochure Design Review',
    startDate: new Date(2021, 1, 1, 11, 30),
    endDate: new Date(2021, 1, 1, 12, 30),
  }],
  views: ['timelineWeek'],
  currentView: 'timelineWeek',
  currentDate: new Date(2021, 1, 1),
  firstDayOfWeek: 1,
  startDayHour: 10,
  endDayHour: 20,
  cellDuration: 60,
  height: 580,
}));
