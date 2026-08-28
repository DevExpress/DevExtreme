import { test } from '../../../../../fixtures';
import { createWidget } from '../../../../../helpers/createWidget';
import { dragToOffset } from '../../../../../helpers/dragUtils';
import { testScreenshot } from '../../../../../helpers/screenshots';
import Scheduler from '../../../../../models/scheduler';

test('Appointment\'s dragging should be work properly, if on page placed two dxSchedulers(T1020820)', async ({ page }) => {
  await createWidget(page, 'dxScheduler', {
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

  await createWidget(page, 'dxScheduler', {
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

  const scheduler = new Scheduler(page, '#container');

  await testScreenshot(page, 'before-dragging(T1020820).png');

  await dragToOffset(page, scheduler.getAppointment('Install New Database').element, -100, -100);

  await testScreenshot(page, 'after-dragging(T1020820).png');
});
