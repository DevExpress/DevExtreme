import createWidget from '../../../helpers/createWidget';
import url from '../../../helpers/getPageUrl';
import Scheduler from '../../../model/scheduler';

fixture`Layout:AppointmentForm:ShowTimeZone`
  .page(url(__dirname, '../../container.html'));

const dataSource = [{
  text: 'Prepare 2021 Marketing Plan',
  startDate: new Date(2021, 3, 26),
  endDate: new Date(2021, 3, 26),
  allDay: true,
},
{
  text: 'Final Budget Review',
  startDate: new Date(2021, 3, 27, 9),
  endDate: new Date(2021, 3, 27, 10),
}];

test('Time zone fields should be hidden on all day appointments', async (t) => {
  const scheduler = new Scheduler('#container');

  const { appointmentPopup } = scheduler;

  await t
    .doubleClick(scheduler.getAppointment(dataSource[0].text).element)
    .expect(appointmentPopup.startDateTimeZoneElement.exists)
    .notOk()
    .expect(appointmentPopup.endDateTimeZoneElement.exists)
    .notOk();
}).before(async () => {
  await createWidget('dxScheduler', {
    dataSource,
    editing: {
      allowTimeZoneEditing: true,
    },
    views: ['workWeek'],
    currentView: 'workWeek',
    currentDate: new Date(2021, 3, 27),
    recurrenceRule: 'FREQ=WEEKLY',
    startDateTimeZone: 'Etc/GMT+10',
    endDateTimeZone: 'US/Alaska',
    startDayHour: 8,
  });
});

test('Time zone fields should be visible on non all day appointments', async (t) => {
  const scheduler = new Scheduler('#container');

  const { appointmentPopup } = scheduler;

  await t
    .doubleClick(scheduler.getAppointment(dataSource[1].text).element)
    .expect(appointmentPopup.startDateTimeZoneElement.exists)
    .ok()
    .expect(appointmentPopup.endDateTimeZoneElement.exists)
    .ok();
}).before(async () => {
  await createWidget('dxScheduler', {
    dataSource,
    editing: {
      allowTimeZoneEditing: true,
    },
    views: ['workWeek'],
    currentView: 'workWeek',
    currentDate: new Date(2021, 3, 27),
    recurrenceRule: 'FREQ=WEEKLY',
    startDateTimeZone: 'Etc/GMT+10',
    endDateTimeZone: 'US/Alaska',
    startDayHour: 8,
  });
});

test('Time zone fields should be hidden when allowTimeZoneEditing is false', async (t) => {
  const scheduler = new Scheduler('#container');

  const { appointmentPopup } = scheduler;

  await t
    .doubleClick(scheduler.getAppointment(dataSource[1].text).element)
    .expect(appointmentPopup.startDateTimeZoneElement.exists)
    .notOk()
    .expect(appointmentPopup.endDateTimeZoneElement.exists)
    .notOk();
}).before(async () => {
  await createWidget('dxScheduler', {
    dataSource,
    editing: {
      allowTimeZoneEditing: false,
    },
    views: ['workWeek'],
    currentView: 'workWeek',
    currentDate: new Date(2021, 3, 27),
    startDayHour: 8,
  });
});
