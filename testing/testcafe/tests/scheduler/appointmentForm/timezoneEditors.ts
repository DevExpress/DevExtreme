import createWidget from '../../../helpers/createWidget';
import url from '../../../helpers/getPageUrl';
import Scheduler from '../../../model/scheduler';

fixture.disablePageReloads`Layout:AppointmentForm:TimezoneEditors(T1080932)`
  .page(url(__dirname, '../../container.html'));

const dataSource = [{
  text: 'Watercolor Landscape',
  startDate: new Date('2020-06-01T17:30:00.000Z'),
  endDate: new Date('2020-06-01T19:00:00.000Z'),
  recurrenceRule: 'FREQ=WEEKLY',
  startDateTimeZone: 'Etc/GMT+10',
  endDateTimeZone: 'US/Alaska',
}];

const inputClassName = '.dx-texteditor-input';
const startDateTimeZoneValue = '(GMT -10:00) Etc - GMT+10';
const endDateTimeZoneValue = '(GMT -08:00) US - Alaska';

test('TimeZone editors should be have data after hide forms data(T1080932)', async (t) => {
  const scheduler = new Scheduler('#container');
  const { appointmentPopup } = scheduler;

  await t.doubleClick(scheduler.getAppointmentByIndex(0).element);

  const startDateTimeZone = appointmentPopup.wrapper.find(inputClassName).nth(1);
  await t.expect(startDateTimeZone.value).eql(startDateTimeZoneValue);

  const endDateTimeZone = appointmentPopup.wrapper.find(inputClassName).nth(3);
  await t.expect(endDateTimeZone.value).eql(endDateTimeZoneValue);
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
  });
});

test('TimeZone editors should be have data in default case(T1080932)', async (t) => {
  const scheduler = new Scheduler('#container');

  await t.doubleClick(scheduler.getAppointmentByIndex(0).element);

  const { appointmentPopup } = scheduler;

  await t.doubleClick(scheduler.getAppointmentByIndex(0).element);

  const startDateTimeZone = appointmentPopup.wrapper.find(inputClassName).nth(2);
  await t.expect(startDateTimeZone.value).eql(startDateTimeZoneValue);

  const endDateTimeZone = appointmentPopup.wrapper.find(inputClassName).nth(4);
  await t.expect(endDateTimeZone.value).eql(endDateTimeZoneValue);
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
  });
});
