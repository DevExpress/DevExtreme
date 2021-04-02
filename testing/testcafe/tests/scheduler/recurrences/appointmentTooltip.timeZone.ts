// import createWidget from '../../../helpers/createWidget';
// import url from '../../../helpers/getPageUrl';
// import Scheduler from '../../../model/scheduler';

// fixture`Appointment tooltip with recurrence appointment and custom time zone`
//   .page(url(__dirname, '../../container.html'));

// test('Time in appointment tooltip should has valid value in case with recurrence appointment and custom time zone(T848058)', async (t) => {
//   const scheduler = new Scheduler('#container');
//   const appointmentCount = await scheduler.getAppointmentCount();

//   for (let i = 0; i < appointmentCount; i += 1) {
//     await t
//       .click(scheduler.getAppointment('Stand-up meeting', i).element)
//       .expect(scheduler.appointmentTooltip.getListItem('Stand-up meeting').date.textContent)
//       .eql('8:30 AM - 8:45 AM');
//   }
// }).before(() => createWidget('dxScheduler', {
//   dataSource: [{
//     text: 'Stand-up meeting',
//     startDate: '2017-05-22T15:30:00.000Z',
//     endDate: '2017-05-22T15:45:00.000Z',
//     recurrenceRule: 'FREQ=DAILY',
//     startDateTimeZone: 'America/Los_Angeles',
//     endDateTimeZone: 'America/Los_Angeles',
//   }],
//   views: ['week'],
//   currentView: 'week',
//   currentDate: new Date(2017, 4, 25),
//   startDayHour: 8,
//   timeZone: 'America/Los_Angeles',
//   height: 600,
// }));
