import createWidget from '../../../helpers/createWidget';
import url from '../../../helpers/getPageUrl';
import Scheduler from '../../../model/scheduler';

fixture`Appointment tooltip with recurrence appointment and custom time zone`
  .page(url(__dirname, '../../container.html'));

test('Time in appointment tooltip should has valid value in case with recurrence appointment and custom time zone(T848058)', async (t) => {
  const scheduler = new Scheduler('#container');
  const appointmentCount = await scheduler.getAppointmentCount();

  for (let i = 0; i < appointmentCount; i += 1) {
    await t
      .click(scheduler.getAppointment('Stand-up meeting', i).element)
      .expect(scheduler.appointmentTooltip.getListItem('Stand-up meeting').date.textContent)
      .eql('8:30 AM - 8:45 AM');
  }
}).before(async () => createWidget('dxScheduler', {
  dataSource: [{
    text: 'Stand-up meeting',
    startDate: '2017-05-22T15:30:00.000Z',
    endDate: '2017-05-22T15:45:00.000Z',
    recurrenceRule: 'FREQ=DAILY',
    startDateTimeZone: 'America/Los_Angeles',
    endDateTimeZone: 'America/Los_Angeles',
  }],
  views: ['week'],
  currentView: 'week',
  currentDate: new Date(2017, 4, 25),
  startDayHour: 8,
  timeZone: 'America/Los_Angeles',
  height: 600,
}));

test('The only one displayed part of recurrence appointment '
  + 'must have correct offset after DST(T1034216)', async (t) => {
  const scheduler = new Scheduler('#container');

  await t
    .click(scheduler.getAppointment('apt').element)
    .expect(scheduler.appointmentTooltip.getListItem('apt').date.textContent)
    .eql('December 1 12:00 PM - 1:00 PM');
}).before(async () => createWidget('dxScheduler', {
  timeZone: 'Europe/Moscow',
  startDateTimeZoneExpr: 'TimeZone',
  endDateTimeZoneExpr: 'TimeZone',
  views: ['month', 'week'],
  currentView: 'month',
  currentDate: '2021-12-01',
  dataSource: [
    {
      text: 'apt',
      startDate: '2021-09-01T01:00:00-07:00',
      endDate: '2021-09-01T02:00:00-07:00',
      recurrenceException: '',
      recurrenceRule: 'FREQ=MONTHLY;BYDAY=WE,FR;BYSETPOS=1;UNTIL=20211231T235959Z',
      TimeZone: 'America/Los_Angeles',
    },
  ],
  height: 600,
}));
