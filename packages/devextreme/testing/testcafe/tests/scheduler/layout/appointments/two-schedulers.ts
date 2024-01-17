import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import Scheduler from '../../../../model/scheduler';
import createWidget from '../../../../helpers/createWidget';
import url from '../../../../helpers/getPageUrl';

fixture`Layout:Appointments:two-schedulers`
  .page(url(__dirname, '../../../container.html'));

test('Appointment\'s dragging should be work properly, if on page placed two dxSchedulers(T1020820)', async (t) => {
  const scheduler = new Scheduler('#container');
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await t
    .expect(await takeScreenshot('before-dragging(T1020820).png'))
    .ok();

  await t
    .drag(scheduler.getAppointment('Install New Database').element, -100, -100, { speed: 0.5 })
    .expect(await takeScreenshot('after-dragging(T1020820).png'))
    .ok();

  await t.expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createWidget('dxScheduler', {
    maxAppointmentsPerCell: 'unlimited',
    dataSource: [{
      text: 'Website Re-Design Plan',
      startDate: new Date('2021-03-29T16:30:00.000Z'),
      endDate: new Date('2021-03-29T18:30:00.000Z'),
    }, {
      text: 'Book Flights to San Fran for Sales Trip',
      startDate: new Date('2021-03-29T19:00:00.000Z'),
      endDate: new Date('2021-03-29T20:00:00.000Z'),
      allDay: true,
    }, {
      text: 'Approve Personal Computer Upgrade Plan',
      startDate: new Date('2021-03-30T17:00:00.000Z'),
      endDate: new Date('2021-03-30T18:00:00.000Z'),
    }, {
      text: 'Final Budget Review',
      startDate: new Date('2021-03-30T19:00:00.000Z'),
      endDate: new Date('2021-03-30T20:35:00.000Z'),
    }, {
      text: 'Install New Database',
      startDate: new Date('2021-03-31T16:45:00.000Z'),
      endDate: new Date('2021-03-31T18:15:00.000Z'),
    }],
    views: ['month'],
    currentView: 'month',
    currentDate: new Date(2021, 2, 29),
    startDayHour: 9,
    height: 400,
  });

  await createWidget('dxScheduler', {
    maxAppointmentsPerCell: 'unlimited',
    dataSource: [{
      text: 'Helen',
      startDate: new Date('2021-03-29T16:30:00.000Z'),
      endDate: new Date('2021-04-29T18:30:00.000Z'),
    }, {
      text: 'Alex',
      startDate: new Date('2021-03-29T19:00:00.000Z'),
      endDate: new Date('2021-04-29T20:00:00.000Z'),
    }],
    views: ['day'],
    currentView: 'day',
    currentDate: new Date(2021, 2, 29),
    startDayHour: 9,
    height: 400,
  }, '#otherContainer');
});
