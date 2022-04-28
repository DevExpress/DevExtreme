import createWidget from '../../../helpers/createWidget';
import url from '../../../helpers/getPageUrl';
import Scheduler from '../../../model/scheduler';

fixture`Layout:AppointmentForm:TimezoneEditors(T1080932)`
  .page(url(__dirname, '../../container.html'));

test('TimeZone editors should be have data after hide forms data(T1080932)', async (t) => {
  const scheduler = new Scheduler('#container');
  const { appointmentPopup } = scheduler;

  await t.doubleClick(scheduler.getAppointmentByIndex(0).element);

  const startDateTimeZone = appointmentPopup.wrapper.find('.dx-texteditor-input').nth(1);
  await t.expect(startDateTimeZone.value).eql('(GMT -10:00) Etc - GMT+10');

  const endDateTimeZone = appointmentPopup.wrapper.find('.dx-texteditor-input').nth(3);
  await t.expect(endDateTimeZone.value).eql('(GMT -08:00) US - Alaska');
}).before(async () => {
  await createWidget('dxScheduler', {
    onAppointmentFormOpening: (e) => {
      e.form.itemOption('mainGroup.text', 'visible', false);
    },
    editing: {
      allowTimeZoneEditing: true,
    },
    recurrenceEditMode: 'series',
    dataSource: [{
      text: 'Watercolor Landscape',
      startDate: new Date('2020-11-01T17:30:00.000Z'),
      endDate: new Date('2020-11-01T19:00:00.000Z'),
      recurrenceRule: 'FREQ=WEEKLY',
      startDateTimeZone: 'Etc/GMT+10',
      endDateTimeZone: 'US/Alaska',
    }],
    views: ['month'],
    currentView: 'month',
    currentDate: new Date(2020, 10, 25),
    startDayHour: 9,
    height: 600,
  }, true);
});

test('TimeZone editors should be have data in default case(T1080932)', async (t) => {
  const scheduler = new Scheduler('#container');

  await t.doubleClick(scheduler.getAppointmentByIndex(0).element);

  const { appointmentPopup } = scheduler;

  await t.doubleClick(scheduler.getAppointmentByIndex(0).element);

  const startDateTimeZone = appointmentPopup.wrapper.find('.dx-texteditor-input').nth(2);
  await t.expect(startDateTimeZone.value).eql('(GMT -10:00) Etc - GMT+10');

  const endDateTimeZone = appointmentPopup.wrapper.find('.dx-texteditor-input').nth(4);
  await t.expect(endDateTimeZone.value).eql('(GMT -08:00) US - Alaska');
}).before(async () => {
  await createWidget('dxScheduler', {
    editing: {
      allowTimeZoneEditing: true,
    },
    recurrenceEditMode: 'series',
    dataSource: [{
      text: 'Watercolor Landscape',
      startDate: new Date('2020-11-01T17:30:00.000Z'),
      endDate: new Date('2020-11-01T19:00:00.000Z'),
      recurrenceRule: 'FREQ=WEEKLY',
      startDateTimeZone: 'Etc/GMT+10',
      endDateTimeZone: 'US/Alaska',
    }],
    views: ['month'],
    currentView: 'month',
    currentDate: new Date(2020, 10, 25),
    startDayHour: 9,
    height: 600,
  }, true);
});
