import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import Scheduler from 'devextreme-testcafe-models/scheduler';
import { createWidget } from '../../../../../helpers/createWidget';
import url from '../../../../../helpers/getPageUrl';
import { testScreenshot } from '../../../../../helpers/themeUtils';

fixture.disablePageReloads`AppointmentForm screenshot tests`
  .page(url(__dirname, '../../../../container.html'));

test('Appointemt form tests', async (t) => {
  const scheduler = new Scheduler('#container');
  const { appointmentPopup } = scheduler;

  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await t.doubleClick(scheduler.getDateTableCell(0, 0));

  await testScreenshot(t, takeScreenshot, 'initial-form.png', {
    element: appointmentPopup.content,
  });

  await t
    .click(appointmentPopup.allDayElement)
    .click(appointmentPopup.recurrenceElement);

  await testScreenshot(t, takeScreenshot, 'allday-and-reccurence-form.png', {
    element: appointmentPopup.content,
  });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createWidget('dxScheduler', {
    currentDate: new Date(2021, 1, 1),
  });
});
