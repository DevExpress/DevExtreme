import { test, expect } from '@playwright/test';
import { createWidget } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('Legacy appointment popup form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

);

test('Subject and description fields should be empty after showing popup on empty cell', async ({ page }) => {
  const APPOINTMENT_TEXT = 'Website Re-Design Plan';

  // Scheduler on '#container'
  const { legacyAppointmentPopup: appointmentPopup } = scheduler;

  await (scheduler.getAppointment(APPOINTMENT_TEXT).dblclick().element)
    .expect(appointmentPopup.subjectElement.value)
    .eql(APPOINTMENT_TEXT)

    .typeText(appointmentPopup.descriptionElement, 'temp')

    .click(appointmentPopup.doneButton)
    .doubleClick(page.locator('.dx-scheduler-date-table-row').nth(0).locator('.dx-scheduler-date-table-cell').nth(5))

    .expect(appointmentPopup.subjectElement.value)
    .eql('')

    .expect(appointmentPopup.descriptionElement.value)
    .eql('');
}).before(async () => createWidget(page, 'dxScheduler', {
  views: ['month'],
  currentView: 'month',
  currentDate: new Date(2017, 4, 22),
  height: 600,
  width: 600,
  editing: { legacyForm: true },
  dataSource: [
    {
      text: 'Website Re-Design Plan',
      startDate: new Date(2017, 4, 22, 9, 30),
      endDate: new Date(2017, 4, 22, 11, 30),
    },
  ],
}));

test('Custom form shouldn\'t throw exception, after second show appointment form(T812654)', async (t) => {
  const APPOINTMENT_TEXT = 'Website Re-Design Plan';
  const TEXT_EDITOR_CLASS = '.dx-texteditor-input';
  const CHECKBOX_CLASS = '.dx-checkbox.dx-widget';

  // Scheduler on '#container'

  await (scheduler.getAppointment(APPOINTMENT_TEXT).dblclick().element, {
      speed: 0.5,
    })
    .click(CHECKBOX_CLASS)

    .expect(Selector(TEXT_EDITOR_CLASS).value)
    .eql(APPOINTMENT_TEXT)

    .click(scheduler.legacyAppointmentPopup.cancelButton)

    .click(scheduler.getAppointment(APPOINTMENT_TEXT).element)
    .click(scheduler.appointmentTooltip.getListItem(APPOINTMENT_TEXT).element)

    .expect(Selector(TEXT_EDITOR_CLASS).exists)
    .eql(false);
}).before(async () => createWidget(page, 'dxScheduler', {
  views: ['month'],
  currentView: 'month',
  currentDate: new Date(2017, 4, 22),
  height: 600,
  width: 600,
  editing: { legacyForm: true },
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
}));

test.meta({ runInTheme: Themes.genericLight })('Appointment should have correct form data on consecutive shows (T832711)', async (t) => {
  const APPOINTMENT_TEXT = 'Google AdWords Strategy';

  // Scheduler on '#container'
  const { legacyAppointmentPopup: appointmentPopup } = scheduler;

  await (scheduler.getAppointment(APPOINTMENT_TEXT).dblclick().element)
    .expect(appointmentPopup.element.exists)
    .ok()
    .expect(appointmentPopup.isVisible())
    .ok()
    .expect(appointmentPopup.subjectElement.value)
    .eql(APPOINTMENT_TEXT)

    .click(appointmentPopup.allDayElement)
    .click(appointmentPopup.cancelButton)
    .expect(appointmentPopup.isVisible())
    .notOk();

  await (scheduler.getAppointment(APPOINTMENT_TEXT).dblclick().element)
    .expect(appointmentPopup.isVisible())
    .ok()

    .expect(appointmentPopup.endDateElement.value)
    .eql('5/5/2017');
}).before(async () => createWidget(page, 'dxScheduler', {
  views: ['month'],
  currentView: 'month',
  currentDate: new Date(2017, 4, 25),
  endDayHour: 20,
  editing: { legacyForm: true },
  dataSource: [{
    text: 'Google AdWords Strategy',
    startDate: new Date(2017, 4, 1),
    endDate: new Date(2017, 4, 5),
    allDay: true,
  }],
  height: 580,
}));

test('From elements for disabled appointments should be read only (T835731)', async ({ page }) => {
  const APPOINTMENT_TEXT = 'Install New Router in Dev Room';
  // Scheduler on '#container'
  const { legacyAppointmentPopup: appointmentPopup } = scheduler;

  await (scheduler.getAppointment(APPOINTMENT_TEXT).dblclick().element)
    .expect(appointmentPopup.freqElement.hasClass('dx-state-readonly')).toBeTruthy()

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
}).before(async () => createWidget(page, 'dxScheduler', {
  dataSource: [{
    text: 'Install New Router in Dev Room',
    startDate: new Date(2017, 4, 22, 14, 30),
    endDate: new Date(2017, 4, 25, 15, 30),
    disabled: true,
    recurrenceRule: 'FREQ=DAILY',
  }],
  editing: { legacyForm: true },
  currentView: 'week',
  recurrenceEditMode: 'series',
  currentDate: new Date(2017, 4, 25),
  startDayHour: 9,
  height: 600,
}));

test('AppointmentForm should display correct dates in work-week when firstDayOfWeek is used', async ({ page }) => {
  // Scheduler on '#container'
  const { legacyAppointmentPopup: appointmentPopup } = scheduler;

  await (page.locator('.dx-scheduler-date-table-row').nth(2).locator('.dx-scheduler-date-table-cell').nth(4).dblclick())

    .expect(appointmentPopup.startDateElement.value)
    .eql('6/28/2021, 6:00 AM')

    .expect(appointmentPopup.endDateElement.value)
    .eql('6/28/2021, 6:30 AM');
}).before(async () => createWidget(page, 'dxScheduler', {
  views: ['workWeek'],
  currentView: 'workWeek',
  editing: { legacyForm: true },
  currentDate: new Date(2021, 5, 28),
  startDayHour: 5,
  height: 600,
  firstDayOfWeek: 2,
}));
});
