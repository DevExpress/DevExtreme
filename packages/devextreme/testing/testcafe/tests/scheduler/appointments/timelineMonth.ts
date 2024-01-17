import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import createWidget from '../../../helpers/createWidget';
import url from '../../../helpers/getPageUrl';

fixture`Appointments in TimelineMonth`
  .page(url(__dirname, '../../container.html'));

test('Appointments should have correct order', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await t
    .expect(await takeScreenshot('timelineMonth-appt-order.png'))
    .ok()
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxScheduler', {
  currentDate: new Date(2016, 1, 2),
  dataSource: [
    {
      text: 'appt-01',
      startDate: new Date(2016, 1, 1, 9, 0),
      endDate: new Date(2016, 1, 1, 10, 30),
    }, {
      text: 'appt-02',
      startDate: new Date(2016, 1, 1, 11, 30),
      endDate: new Date(2016, 1, 1, 14, 15),
    }, {
      text: 'appt-03',
      startDate: new Date(2016, 1, 1, 15, 15),
      endDate: new Date(2016, 1, 1, 17, 15),
    }, {
      text: 'appt-04',
      startDate: new Date(2016, 1, 1, 18, 45),
      endDate: new Date(2016, 1, 1, 20, 15),
    }, {
      text: 'appt-05',
      startDate: new Date(2016, 1, 2, 8, 15),
      endDate: new Date(2016, 1, 2, 10, 45),
    }, {
      text: 'appt-06',
      startDate: new Date(2016, 1, 2, 12, 0),
      endDate: new Date(2016, 1, 2, 13, 45),
    }, {
      text: 'appt-07',
      startDate: new Date(2016, 1, 2, 15, 30),
      endDate: new Date(2016, 1, 2, 17, 30),
    }, {
      text: 'appt-08',
      startDate: new Date(2016, 1, 3, 8, 15),
      endDate: new Date(2016, 1, 3, 9, 0),
    }, {
      text: 'appt-09',
      startDate: new Date(2016, 1, 3, 10, 0),
      endDate: new Date(2016, 1, 3, 11, 15),
    }, {
      text: 'appt-10',
      startDate: new Date(2016, 1, 3, 11, 45),
      endDate: new Date(2016, 1, 3, 13, 45),
    }, {
      text: 'appt-11',
      startDate: new Date(2016, 1, 3, 14, 0),
      endDate: new Date(2016, 1, 3, 16, 45),
    },
  ],
  views: ['timelineMonth'],
  currentView: 'timelineMonth',
  maxAppointmentsPerCell: 'unlimited',
  height: 505,
  startDayHour: 8,
  endDayHour: 20,
  cellDuration: 60,
  firstDayOfWeek: 0,
  width: 800,
}));
