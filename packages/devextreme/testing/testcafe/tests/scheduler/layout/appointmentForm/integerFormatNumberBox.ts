import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import Scheduler from '../../../../model/scheduler';
import createWidget from '../../../../helpers/createWidget';
import url from '../../../../helpers/getPageUrl';

fixture`Layout:AppointmentForm:IntegerFormatNumberBox`
  .page(url(__dirname, '../../../container.html'));

test('dxNumberBox should not allow to enter not integer chars(T1002864)', async (t) => {
  const scheduler = new Scheduler('#container');
  const { appointmentPopup } = scheduler;

  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await t
    .doubleClick(scheduler.getAppointment('Website Re-Design Plan').element);

  await t
    .typeText(appointmentPopup.repeatEveryElement, '.,2', { speed: 0.5 });

  await t
    .expect(await takeScreenshot('dx-number-boxes-not-integer-chars.png', scheduler.appointmentPopup.wrapper))
    .ok();

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxScheduler', {
  dataSource: [{
    text: 'Website Re-Design Plan',
    startDate: new Date(2021, 3, 26, 10),
    endDate: new Date(2021, 3, 26, 11),
    recurrenceRule: 'FREQ=WEEKLY;BYDAY=MO,TH;UNTIL=20220114T205959Z',
  }],
  views: ['day', 'week', 'workWeek', 'month'],
  currentView: 'week',
  currentDate: new Date(2021, 3, 29),
  startDayHour: 9,
  height: 600,
  recurrenceEditMode: 'series',
}));
