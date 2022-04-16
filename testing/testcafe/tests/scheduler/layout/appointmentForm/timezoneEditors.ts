import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import Scheduler from '../../../../model/scheduler';
import createWidget from '../../../../helpers/createWidget';
import url from '../../../../helpers/getPageUrl';

fixture`Layout:AppointmentForm:TimezoneEditors(T1080932)`
  .page(url(__dirname, '../../../container.html'));

test('TimeZone editors should be have data after hide forms data(T1080932)', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const scheduler = new Scheduler('#container');

  await t.doubleClick(scheduler.getAppointmentByIndex(0).element);

  await t.expect(await takeScreenshot('time-zone-editors-after-hide-form-item.png'));

  await t.expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createWidget('dxScheduler', {
    onAppointmentFormOpening: (e) => {
      const { form } = e;
      form.itemOption('mainGroup.text', 'visible', false);
    },
    editing: {
      allowTimeZoneEditing: true,
    },
    recurrenceEditMode: 'series',
    dataSource: [{
      text: 'Watercolor Landscape',
      startDate: new Date('2020-11-01T17:30:00.000Z'),
      endDate: new Date('2020-11-01T19:00:00.000Z'),
      recurrenceRule: 'FREQ=WEEKLY',
      startDateTimeZone: 'Etc/GMT+10',
      endDateTimeZone: 'US/Alaska',
    }],
    views: ['month'],
    currentView: 'month',
    currentDate: new Date(2020, 10, 25),
    startDayHour: 9,
    height: 600,
  }, true);
});
