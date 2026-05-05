import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import Scheduler from 'devextreme-testcafe-models/scheduler';
import { createWidget } from '../../../../../helpers/createWidget';
import url from '../../../../../helpers/getPageUrl';
import { testScreenshot } from '../../../../../helpers/themeUtils';

fixture.disablePageReloads`Layout:AppointmentForm:MobileEnvironment`
  .page(url(__dirname, '../../../../container.html'));

test.meta({ browserSize: [350, 600] })('Appointment form should be display valid layout', async (t) => {
  const scheduler = new Scheduler('#container');
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await t.doubleClick(scheduler.getAppointment('Text').element);

  await testScreenshot(t, takeScreenshot, 'appointment-form-in-mobile-environment.png');

  await t.expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
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
    editing: { legacyForm: true },
  });
});
