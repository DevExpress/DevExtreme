import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import Scheduler from '../../../../../model/scheduler';
import url from '../../../../../helpers/getPageUrl';

fixture`DataSource`
  .page(url(__dirname, '.././pages/containerWithArrayStore.html'));

test.skip('Appointment key should be deleted when removing an appointment from series (T1024213)', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  const scheduler = new Scheduler('#scheduler');

  await t
    .doubleClick(scheduler.getAppointmentByIndex(1).element)
    .click(scheduler.appointmentPopup.doneButton)

    .expect(await takeScreenshot('exclude-appointment-from-series-via-form-editing.png', scheduler.workSpace))
    .ok()

    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
});
