import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { ClientFunction } from 'testcafe';
import Scheduler from '../../../../model/scheduler';
import url from '../../../../helpers/getPageUrl';

fixture`DataSource`
  .page(url(__dirname, '../../../container.html'));

test('Appointment key should be deleted when removing an appointment from series (T1024213)', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  const scheduler = new Scheduler('#container');

  await t
    .doubleClick(scheduler.getAppointmentByIndex(1).element)
    .click(scheduler.appointmentPopup.doneButton)

    .expect(await takeScreenshot('exclude-appointment-from-series-via-form-editing.png', scheduler.workSpace))
    .ok()

    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  const initScheduler = ClientFunction(() => {
    const devExpress = (window as any).DevExpress;

    ($('#container') as any).dxScheduler({
      dataSource: new devExpress.data.DataSource({
        store: {
          type: 'array',
          key: 'appointmentId',
          data: [{
            startDate: new Date(2021, 6, 12, 10),
            endDate: new Date(2021, 6, 12, 11),
            text: 'Test Appointment',
            recurrenceRule: 'FREQ=DAILY;COUNT=3',
            appointmentId: 0,
          }],
        },
      }),
      recurrenceEditMode: 'occurrence',
      views: ['week'],
      currentView: 'week',
      startDayHour: 9,
      currentDate: new Date(2021, 6, 12, 10),
      height: 600,
    });
  });

  await initScheduler();
});
