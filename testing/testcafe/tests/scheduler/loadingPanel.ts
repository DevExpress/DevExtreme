import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import createWidget from '../../helpers/createWidget';
import Scheduler from '../../model/scheduler';
import url from '../../helpers/getPageUrl';

const CLICK_OPTIONS = { speed: 0.5 };
const SCHEDULER_SELECTOR = '#container';
const INITIAL_APPOINTMENT_TITLE = 'appointment';
const ADDITIONAL_TITLE_TEXT = '-updated';

fixture.disablePageReloads`Scheduler loading panel`
  .page(url(__dirname, '../container.html'));

test('Save appointment loading panel screenshot', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const scheduler = new Scheduler(SCHEDULER_SELECTOR);
  const appointment = scheduler.getAppointment(INITIAL_APPOINTMENT_TITLE);
  const { appointmentPopup } = scheduler;

  await t
    .doubleClick(appointment.element, CLICK_OPTIONS)
    .click(appointmentPopup.subjectElement)
    .typeText(appointmentPopup.subjectElement, ADDITIONAL_TITLE_TEXT)
    .click(appointmentPopup.doneButton)
    // act
    .expect(await takeScreenshot('save-appointment-loading-panel-screenshot.png', scheduler.element))
    .ok()
    // assert
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
  onAppointmentUpdating: (e) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    e.cancel = new Promise((resolve, reject) => { });
  },
}));
