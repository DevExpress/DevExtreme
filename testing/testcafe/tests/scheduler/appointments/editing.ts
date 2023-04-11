import { ClientFunction } from 'testcafe';
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import createWidget from '../../../helpers/createWidget';
import url from '../../../helpers/getPageUrl';
import Scheduler from '../../../model/scheduler';

const CLICK_OPTIONS = { speed: 0.5 };
const SCHEDULER_SELECTOR = '#container';
const INITIAL_APPOINTMENT_TITLE = 'appointment';
const ADDITIONAL_TITLE_TEXT = '-updated';
const UPDATED_APPOINTMENT_TITLE = `${INITIAL_APPOINTMENT_TITLE}${ADDITIONAL_TITLE_TEXT}`;

fixture.disablePageReloads`Appointment Editing`
  .page(url(__dirname, '../../container.html'));

test('Should correctly update appointment if dataSource is a simple array', async (t) => {
  const scheduler = new Scheduler(SCHEDULER_SELECTOR);
  const appointment = scheduler.getAppointment(INITIAL_APPOINTMENT_TITLE);
  const updatedAppointment = scheduler.getAppointment(UPDATED_APPOINTMENT_TITLE);
  const { appointmentPopup } = scheduler;

  await t
    .doubleClick(appointment.element, CLICK_OPTIONS)
    .click(appointmentPopup.subjectElement)
    .typeText(appointmentPopup.subjectElement, ADDITIONAL_TITLE_TEXT)
    .expect(appointmentPopup.subjectElement.value)
    .eql(UPDATED_APPOINTMENT_TITLE)
    .click(appointmentPopup.doneButton)
    .expect(updatedAppointment.element.exists)
    .ok();
}).before(async () => createWidget('dxScheduler', {
  dataSource: [{
    id: 1,
    text: INITIAL_APPOINTMENT_TITLE,
    startDate: new Date(2021, 2, 29, 9, 30),
    endDate: new Date(2021, 2, 29, 11, 30),
  }],
  views: ['day'],
  currentView: 'day',
  currentDate: new Date(2021, 2, 29),
  startDayHour: 9,
  endDayHour: 14,
  height: 600,
}));

test('Should correctly update appointment if dataSource is a Store with key array', async (t) => {
  const scheduler = new Scheduler(SCHEDULER_SELECTOR);
  const appointment = scheduler.getAppointment(INITIAL_APPOINTMENT_TITLE);
  const updatedAppointment = scheduler.getAppointment(UPDATED_APPOINTMENT_TITLE);
  const { appointmentPopup } = scheduler;

  await t
    .doubleClick(appointment.element, CLICK_OPTIONS)
    .click(appointmentPopup.subjectElement)
    .typeText(appointmentPopup.subjectElement, ADDITIONAL_TITLE_TEXT)
    .expect(appointmentPopup.subjectElement.value)
    .eql(UPDATED_APPOINTMENT_TITLE)
    .click(appointmentPopup.doneButton)
    .expect(updatedAppointment.element.exists)
    .ok();
}).before(async () => {
  const initScheduler = ClientFunction(() => {
    const $scheduler = $(SCHEDULER_SELECTOR) as any;
    const devExpress = (window as any).DevExpress;

    $scheduler.dxScheduler({
      dataSource: new devExpress.data.DataSource({
        store: {
          type: 'array',
          key: 'id',
          data: [{
            id: 1,
            text: INITIAL_APPOINTMENT_TITLE,
            startDate: new Date(2021, 2, 29, 9, 30),
            endDate: new Date(2021, 2, 29, 11, 30),
          }],
        },
      }),
      views: ['day'],
      currentView: 'day',
      currentDate: new Date(2021, 2, 29),
      startDayHour: 9,
      endDayHour: 14,
      height: 600,
    }).dxScheduler('instance');
    devExpress.fx.off = true;
  }, { dependencies: { SCHEDULER_SELECTOR, INITIAL_APPOINTMENT_TITLE } });

  await initScheduler();
});

test('Appointment EditForm screenshot', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const scheduler = new Scheduler(SCHEDULER_SELECTOR);
  const appointment = scheduler.getAppointment(INITIAL_APPOINTMENT_TITLE);

  await t
    .doubleClick(appointment.element, CLICK_OPTIONS)
    // act
    .expect(await takeScreenshot('appointment-popup-screenshot.png', appointment.element))
    .ok()
    // assert
    .expect(scheduler.appointmentPopup.element.exists)
    .ok()
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxScheduler', {
  dataSource: [{
    id: 1,
    text: INITIAL_APPOINTMENT_TITLE,
    startDate: new Date(2021, 2, 29, 9, 30),
    endDate: new Date(2021, 2, 29, 11, 30),
  }],
  views: ['day'],
  currentView: 'day',
  currentDate: new Date(2021, 2, 29),
  startDayHour: 9,
  endDayHour: 14,
  height: 600,
}));
