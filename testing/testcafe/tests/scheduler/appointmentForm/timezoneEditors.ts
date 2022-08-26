import createWidget from '../../../helpers/createWidget';
import url from '../../../helpers/getPageUrl';
import Scheduler from '../../../model/scheduler';

fixture`Layout:AppointmentForm:TimezoneEditors(T1080932)`
  .page(url(__dirname, '../../container.html'));

const dataSource = [{
  text: 'Watercolor Landscape',
  startDate: new Date('2020-06-01T17:30:00.000Z'),
  endDate: new Date('2020-06-01T19:00:00.000Z'),
  recurrenceRule: 'FREQ=WEEKLY',
  startDateTimeZone: 'Etc/GMT+10',
  endDateTimeZone: 'US/Alaska',
}];

const startDateTimeZoneValue = '(GMT -10:00) Etc - GMT+10';
const endDateTimeZoneValue = '(GMT -08:00) US - Alaska';

test('TimeZone editors should be have data after hide forms data(T1080932)', async (t) => {
  const scheduler = new Scheduler('#container');
  const { appointmentPopup } = scheduler;

  await t.doubleClick(scheduler.getAppointmentByIndex(0).element);

  await t.expect(appointmentPopup.startDateTimeZoneElement.value).eql(startDateTimeZoneValue);

  await t.expect(appointmentPopup.endDateTimeZoneElement.value).eql(endDateTimeZoneValue);
}).before(async () => {
  await createWidget('dxScheduler', {
    dataSource,
    onAppointmentFormOpening: (e) => {
      e.form.itemOption('mainGroup.text', 'visible', false);
    },
    editing: {
      allowTimeZoneEditing: true,
    },
    recurrenceEditMode: 'series',
    views: ['month'],
    currentView: 'month',
    currentDate: new Date(2020, 6, 25),
    startDayHour: 9,
    height: 600,
  }, true);
});

test('TimeZone editors should be have data in default case(T1080932)', async (t) => {
  const scheduler = new Scheduler('#container');

  await t.doubleClick(scheduler.getAppointmentByIndex(0).element);

  const { appointmentPopup } = scheduler;

  await t.doubleClick(scheduler.getAppointmentByIndex(0).element);

  await t.expect(appointmentPopup.startDateTimeZoneElement.value).eql(startDateTimeZoneValue);

  await t.expect(appointmentPopup.endDateTimeZoneElement.value).eql(endDateTimeZoneValue);
}).before(async () => {
  await createWidget('dxScheduler', {
    dataSource,
    editing: {
      allowTimeZoneEditing: true,
    },
    recurrenceEditMode: 'series',
    views: ['month'],
    currentView: 'month',
    currentDate: new Date(2020, 6, 25),
    startDayHour: 9,
    height: 600,
  }, true);
});
