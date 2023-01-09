import createWidget from '../../../helpers/createWidget';
import url from '../../../helpers/getPageUrl';
import Scheduler from '../../../model/scheduler';

fixture.disablePageReloads`Appointment popup form:date editors`
  .page(url(__dirname, '../../container.html'));

test('Form date editors should be pass numeric chars according by date mask', async (t) => {
  const scheduler = new Scheduler('#container');
  const { appointmentPopup } = scheduler;

  await t
    .doubleClick(scheduler.getAppointment('Website Re-Design Plan').element);

  await t
    .click(appointmentPopup.subjectElement);

  await t
    .pressKey('tab')
    .typeText(appointmentPopup.startDateElement, '111111111111')
    .expect(appointmentPopup.startDateElement.value)
    .eql('11/11/1111, 11:11 AM');

  await t
    .pressKey('tab')
    .typeText(appointmentPopup.endDateElement, '111111111111')
    .expect(appointmentPopup.endDateElement.value)
    .eql('11/11/1111, 11:11 PM');

  await t
    .pressKey('tab')
    .pressKey('tab')
    .pressKey('tab')
    .pressKey('tab')
    .pressKey('tab')
    .pressKey('tab')
    .pressKey('tab')
    .typeText(appointmentPopup.endRepeatDateElement, '11111111')
    .expect(appointmentPopup.endRepeatDateElement.value)
    .eql('11/11/1111');
}).before(async () => createWidget('dxScheduler', {
  dataSource: [{
    text: 'Website Re-Design Plan',
    startDate: new Date(2021, 2, 30, 11),
    endDate: new Date(2021, 2, 30, 12),
    recurrenceRule: 'FREQ=DAILY;UNTIL=20211029T205959Z',
  }],
  recurrenceEditMode: 'series',
  views: ['week'],
  currentView: 'week',
  currentDate: new Date(2021, 2, 28),
  startDayHour: 9,
  height: 600,
}));

test('Form date editors should not be pass chars according by date mask', async (t) => {
  const scheduler = new Scheduler('#container');
  const { appointmentPopup } = scheduler;

  await t
    .doubleClick(scheduler.getAppointment('Website Re-Design Plan').element);

  await t
    .click(appointmentPopup.subjectElement);

  await t
    .pressKey('tab')
    .typeText(appointmentPopup.startDateElement, 'TEXT')
    .expect(appointmentPopup.startDateElement.value)
    .eql('3/30/2021, 11:00 AM');

  await t
    .pressKey('tab')
    .typeText(appointmentPopup.endDateElement, 'TEXT')
    .expect(appointmentPopup.endDateElement.value)
    .eql('3/30/2021, 12:00 PM');

  await t
    .pressKey('tab')
    .pressKey('tab')
    .pressKey('tab')
    .pressKey('tab')
    .pressKey('tab')
    .pressKey('tab')
    .pressKey('tab')
    .typeText(appointmentPopup.endRepeatDateElement, 'TEXT')
    .expect(appointmentPopup.endRepeatDateElement.value)
    .eql('10/29/2021');
}).before(async () => createWidget('dxScheduler', {
  dataSource: [{
    text: 'Website Re-Design Plan',
    startDate: new Date(2021, 2, 30, 11),
    endDate: new Date(2021, 2, 30, 12),
    recurrenceRule: 'FREQ=DAILY;UNTIL=20211029T205959Z',
  }],
  recurrenceEditMode: 'series',
  views: ['week'],
  currentView: 'week',
  currentDate: new Date(2021, 2, 28),
  startDayHour: 9,
  height: 600,
}));

test('Form date editors should not be pass chars after remove all characters according by date mask', async (t) => {
  const scheduler = new Scheduler('#container');
  const { appointmentPopup } = scheduler;

  await t
    .doubleClick(scheduler.getAppointment('Website Re-Design Plan').element);

  await t
    .click(appointmentPopup.startDateElement)
    .selectText(appointmentPopup.startDateElement)
    .pressKey('backspace')

    .typeText(appointmentPopup.startDateElement, 'TEXT')
    .expect(appointmentPopup.startDateElement.value)
    .eql('')

    .typeText(appointmentPopup.startDateElement, '1')
    .expect(appointmentPopup.startDateElement.value)
    .eql('1/30/2021, 11:00 AM');

  await t
    .click(appointmentPopup.endDateElement)
    .selectText(scheduler.appointmentPopup.endDateElement)
    .pressKey('backspace')

    .typeText(appointmentPopup.endDateElement, 'TEXT')
    .expect(appointmentPopup.endDateElement.value)
    .eql('')

    .typeText(appointmentPopup.endDateElement, '1')
    .expect(appointmentPopup.endDateElement.value)
    .eql('1/30/2021, 12:00 PM');

  await t
    .click(appointmentPopup.endRepeatDateElement)
    .selectText(appointmentPopup.endRepeatDateElement)
    .pressKey('backspace')

    .typeText(appointmentPopup.endRepeatDateElement, 'TEXT')
    .expect(appointmentPopup.endRepeatDateElement.value)
    .eql('')

    .typeText(appointmentPopup.endRepeatDateElement, '1')
    .expect(appointmentPopup.endRepeatDateElement.value)
    .eql('1/29/2021');
}).before(async () => createWidget('dxScheduler', {
  dataSource: [{
    text: 'Website Re-Design Plan',
    startDate: new Date(2021, 2, 30, 11),
    endDate: new Date(2021, 2, 30, 12),
    recurrenceRule: 'FREQ=DAILY;UNTIL=20211029T205959Z',
  }],
  recurrenceEditMode: 'series',
  views: ['week'],
  currentView: 'week',
  currentDate: new Date(2021, 2, 28),
  startDayHour: 9,
  height: 600,
}));
