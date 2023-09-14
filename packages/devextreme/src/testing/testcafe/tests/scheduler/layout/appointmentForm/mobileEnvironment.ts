import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { safeSizeTest } from '../../../../helpers/safeSizeTest';
import Scheduler from '../../../../model/scheduler';
import createWidget from '../../../../helpers/createWidget';
import url from '../../../../helpers/getPageUrl';

fixture.disablePageReloads`Layout:AppointmentForm:MobileEnvironment`
  .page(url(__dirname, '../../../container.html'));

safeSizeTest('Appointment form should be display valid layout', async (t) => {
  const scheduler = new Scheduler('#container');
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await t
    .doubleClick(scheduler.getAppointment('Text').element)
    .expect(await takeScreenshot('appointment-form-in-mobile-environment.png'))
    .ok();

  await t.expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}, [350, 600]).before(async () => {
  await createWidget('dxScheduler', {
    dataSource: [{
      text: 'Text',
      startDate: new Date(2021, 3, 28, 10),
      endDate: new Date(2021, 3, 28, 12),
    }],
    views: ['week'],
    currentView: 'week',
    currentDate: new Date(2021, 3, 29),
    startDayHour: 9,
    height: 600,
  });
});
