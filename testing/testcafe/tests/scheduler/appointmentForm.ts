import { Selector } from 'testcafe';
import createWidget from '../../helpers/createWidget';
import url from '../../helpers/getPageUrl';
import Scheduler from '../../model/scheduler';

fixture`Appointment popup form`
  .page(url(__dirname, '../container.html'));

test('Subject and description fields should be empty after showing popup on empty cell', async (t) => {
  const APPOINTMENT_TEXT = 'Website Re-Design Plan';

  const scheduler = new Scheduler('#container');
  const { appointmentPopup } = scheduler;

  await t.doubleClick(scheduler.getAppointment(APPOINTMENT_TEXT).element)
    .expect(appointmentPopup.subjectElement.value)
    .eql(APPOINTMENT_TEXT)

    .typeText(appointmentPopup.descriptionElement, 'temp')

    .click(appointmentPopup.doneButton)
    .doubleClick(scheduler.getDateTableCell(0, 5))

    .expect(appointmentPopup.subjectElement.value)
    .eql('')

    .expect(appointmentPopup.descriptionElement.value)
    .eql('');
}).before(() => createWidget('dxScheduler', {
  views: ['month'],
  currentView: 'month',
  currentDate: new Date(2017, 4, 22),
  height: 600,
  width: 600,
  dataSource: [
    {
      text: 'Website Re-Design Plan',
      startDate: new Date(2017, 4, 22, 9, 30),
      endDate: new Date(2017, 4, 22, 11, 30),
    },
  ],
}, true));

test('Custom form shouldn\'t throw exception, after second show appointment form(T812654)', async (t) => {
  const APPOINTMENT_TEXT = 'Website Re-Design Plan';
  const TEXT_EDITOR_CLASS = '.dx-texteditor-input';
  const CHECKBOX_CLASS = '.dx-checkbox.dx-widget';

  const scheduler = new Scheduler('#container');

  await t
    .doubleClick(scheduler.getAppointment(APPOINTMENT_TEXT).element, {
      speed: 0.1,
    })
    .click(CHECKBOX_CLASS)

    .expect(Selector(TEXT_EDITOR_CLASS).value)
    .eql(APPOINTMENT_TEXT)

    .click(scheduler.appointmentPopup.cancelButton)

    .click(scheduler.getAppointment(APPOINTMENT_TEXT).element)
    .click(scheduler.appointmentTooltip.getListItem(APPOINTMENT_TEXT).element)

    .expect(Selector(TEXT_EDITOR_CLASS).exists)
    .eql(false);
}).before(() => createWidget('dxScheduler', {
  views: ['month'],
  currentView: 'month',
  currentDate: new Date(2017, 4, 22),
  height: 600,
  width: 600,
  onAppointmentFormOpening: (e) => {
    const items = [{
      name: 'show1',
      dataField: 'show1',
      editorType: 'dxCheckBox',
      editorOptions: {
        type: 'boolean',
        onValueChanged: (args): boolean => e.form.itemOption('text1', 'visible', args.value),
      },
    }, {
      name: 'text1',
      dataField: 'text',
      editorType: 'dxTextArea',
      colSpan: 6,
      visible: false,
    }];
    e.form.option('items', items);
  },
  dataSource: [
    {
      show1: false,
      text: 'Website Re-Design Plan',
      startDate: new Date(2017, 4, 22, 9, 30),
      endDate: new Date(2017, 4, 22, 11, 30),
    },
  ],
}, true));

test('Appointment should have correct form data on consecutive shows (T832711)', async (t) => {
  const APPOINTMENT_TEXT = 'Google AdWords Strategy';

  const scheduler = new Scheduler('#container');
  const { appointmentPopup } = scheduler;

  await t
    .doubleClick(scheduler.getAppointment(APPOINTMENT_TEXT).element, { speed: 0.1 })
    .expect(appointmentPopup.element.exists)
    .ok()
    .expect(appointmentPopup.isVisible())
    .ok()
    .expect(appointmentPopup.subjectElement.value)
    .eql(APPOINTMENT_TEXT)

    .click(appointmentPopup.allDayElement)
    .click(appointmentPopup.cancelButton)
    .expect(appointmentPopup.isVisible())
    .notOk()

    .doubleClick(scheduler.getAppointment(APPOINTMENT_TEXT).element, { speed: 0.1 })
    .expect(appointmentPopup.isVisible())
    .ok()

    .expect(appointmentPopup.endDateElement.value)
    .eql('5/5/2017');
}).before(() => createWidget('dxScheduler', {
  views: ['month'],
  currentView: 'month',
  currentDate: new Date(2017, 4, 25),
  endDayHour: 20,
  dataSource: [{
    text: 'Google AdWords Strategy',
    startDate: new Date(2017, 4, 1),
    endDate: new Date(2017, 4, 5),
    allDay: true,
  }],
  height: 580,
}, true));

test('From elements for disabled appointments should be read only (T835731)', async (t) => {
  const APPOINTMENT_TEXT = 'Install New Router in Dev Room';
  const scheduler = new Scheduler('#container');
  const { appointmentPopup } = scheduler;

  await t.doubleClick(scheduler.getAppointment(APPOINTMENT_TEXT).element)
    .expect(appointmentPopup.freqElement.hasClass('dx-state-readonly')).ok()

    .expect(appointmentPopup.subjectElement.value)
    .eql(APPOINTMENT_TEXT)

    .typeText(appointmentPopup.subjectElement, 'New Title')
    .expect(appointmentPopup.subjectElement.value)
    .eql(APPOINTMENT_TEXT)

    .typeText(appointmentPopup.descriptionElement, 'description')
    .expect(appointmentPopup.descriptionElement.value)
    .eql('')

    .click(appointmentPopup.allDayElement)
    .expect(appointmentPopup.startDateElement.value)
    .eql('5/22/2017, 2:30 PM');
}).before(() => createWidget('dxScheduler', {
  dataSource: [{
    text: 'Install New Router in Dev Room',
    startDate: new Date(2017, 4, 22, 14, 30),
    endDate: new Date(2017, 4, 25, 15, 30),
    disabled: true,
    recurrenceRule: 'FREQ=DAILY',
  }],
  currentView: 'week',
  recurrenceEditMode: 'series',
  currentDate: new Date(2017, 4, 25),
  startDayHour: 9,
  height: 600,
}));
