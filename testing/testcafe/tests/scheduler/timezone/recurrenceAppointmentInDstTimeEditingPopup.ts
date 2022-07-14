import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import url from '../../../helpers/getPageUrl';
import createWidget from '../../../helpers/createWidget';
import { restoreBrowserSize } from '../../../helpers/restoreBrowserSize';
import Scheduler from '../../../model/scheduler';
import AppointmentDialog from '../../../model/scheduler/appointment/dialog';

const SCREENSHOT_BASE_NAME = 'timezone-recurrence-appointment-in-dst';
const SCHEDULER_SELECTOR = '#container';
const TEST_APPOINTMENT_TEXT = 'Watercolor Landscape';
const TEST_CURSOR_OPTIONS = { speed: 0.1 };

async function DSTTestFunction(t: TestController, screenshotName: string): Promise<void> {
  const scheduler = new Scheduler(SCHEDULER_SELECTOR);
  const screenshotZone = scheduler.workSpace;
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  const appointmentToEdit = scheduler.getAppointment(TEST_APPOINTMENT_TEXT);
  await t.doubleClick(appointmentToEdit.element, TEST_CURSOR_OPTIONS);

  const appointmentDialog = new AppointmentDialog();
  await t.click(appointmentDialog.series, TEST_CURSOR_OPTIONS);

  const { appointmentPopup } = scheduler;
  await t.click(appointmentPopup.doneButton, TEST_CURSOR_OPTIONS);

  await takeScreenshot(`${SCREENSHOT_BASE_NAME}__${screenshotName}.png`, screenshotZone);

  await t.expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}

fixture`Recurrent appointment in DST time: Editing popup`
  .page(url(__dirname, '../../container.html'));

test('Should correctly been edited from editing popup. DST - winter time', async (t) => {
  await DSTTestFunction(t, 'winter-time');
}).before(async (t) => {
  await restoreBrowserSize(t);

  await createWidget('dxScheduler', {
    dataSource: [{
      startDate: new Date('2020-11-01T17:30:00.000Z'),
      endDate: new Date('2020-11-01T19:00:00.000Z'),
      recurrenceRule: 'FREQ=WEEKLY;BYDAY=MO;COUNT=10',
      text: 'Watercolor Landscape',
    }],
    timeZone: 'America/Los_Angeles',
    currentView: 'week',
    currentDate: new Date('2020-11-01T17:30:00.000Z'),
    startDayHour: 9,
    cellDuration: 30,
    width: 1000,
    height: 585,
  });
});

test('Should correctly been edited from editing popup. DST - summer time', async (t) => {
  await DSTTestFunction(t, 'summer-time');
}).before(async (t) => {
  await restoreBrowserSize(t);

  await createWidget('dxScheduler', {
    dataSource: [{
      startDate: new Date('2020-03-08T16:30:00.000Z'),
      endDate: new Date('2020-03-08T18:00:00.000Z'),
      recurrenceRule: 'FREQ=WEEKLY;BYDAY=MO;COUNT=10',
      text: 'Watercolor Landscape',
    }],
    timeZone: 'America/Los_Angeles',
    currentView: 'week',
    currentDate: new Date('2020-03-08T16:30:00.000Z'),
    startDayHour: 9,
    cellDuration: 30,
    width: 1000,
    height: 585,
  });
});
