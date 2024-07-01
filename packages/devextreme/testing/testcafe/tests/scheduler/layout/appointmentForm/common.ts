import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import Scheduler from '../../../../model/scheduler';
import { createWidget } from '../../../../helpers/createWidget';
import url from '../../../../helpers/getPageUrl';
import { changeTheme } from '../../../../helpers/changeTheme';

fixture`AppointmentForm screenshot tests`
  .page(url(__dirname, '../../../container.html'));

['generic.light', 'material.blue.light', 'fluent.blue.light'].forEach((theme) => {
  test('Appointemt form tests', async (t) => {
    const scheduler = new Scheduler('#container');
    const { appointmentPopup } = scheduler;

    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await t
      .doubleClick(scheduler.getDateTableCell(0, 0))
      .expect(await takeScreenshot(`initial-form_${theme}.png`, scheduler.appointmentPopup.wrapper))
      .ok()

      .click(appointmentPopup.allDayElement)
      .click(appointmentPopup.recurrenceElement)

      .expect(await takeScreenshot(`allday-and-reccurence-form_${theme}.png`, scheduler.appointmentPopup.wrapper))
      .ok()

      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async () => {
    await changeTheme(theme);
    await createWidget('dxScheduler', {
      currentDate: new Date(2021, 1, 1),
    });
  }).after(async () => {
    await changeTheme('generic.light');
  });
});
