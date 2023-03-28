import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import Scheduler from '../../../../model/scheduler';
import createWidget from '../../../../helpers/createWidget';
import url from '../../../../helpers/getPageUrl';

fixture`Layout:AppointmentForm:AllDay`
  .page(url(__dirname, '../../../container.html'));

test('Start and end dates should be reflect the current day(appointment is already available case)', async (t) => {
  const scheduler = new Scheduler('#container');
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await t
    .click(scheduler.getAppointment('Text').element)
    .click(scheduler.appointmentTooltip.getListItem('Text').element)
    .hover('body', { offsetX: 0, offsetY: 0 })
    .expect(await takeScreenshot('appointment-form-before-click-all-day.png'))
    .ok();

  await t
    .click(scheduler.appointmentPopup.allDayElement)
    .expect(await takeScreenshot('appointment-form-after-click-all-day.png'))
    .ok();

  await t
    .click(scheduler.appointmentPopup.doneButton)
    .hover('body', { offsetX: 0, offsetY: 0 })
    .expect(await takeScreenshot('all-day-appointment-on-tables.png'))
    .ok();

  await t
    .click(scheduler.getAppointment('Text').element)
    .click(scheduler.appointmentTooltip.getListItem('Text').element)
    .hover('body', { offsetX: 0, offsetY: 0 })
    .expect(await takeScreenshot('appointment-form-after-render-on-table.png'))
    .ok();

  await t
    .click(scheduler.appointmentPopup.allDayElement)
    .hover('body', { offsetX: 0, offsetY: 0 })
    .expect(await takeScreenshot('appointment-form-after-switch-off-all-day.png'))
    .ok();

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
  });
});

test('Start and end dates should be reflect the current day(create new appointment case)', async (t) => {
  const scheduler = new Scheduler('#container');
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await t
    .doubleClick(scheduler.getDateTableCell(2, 3))
    .hover('body', { offsetX: 0, offsetY: 0 })
    .expect(await takeScreenshot('new-appointment-form-before-click-all-day.png'))
    .ok();

  await t
    .click(scheduler.appointmentPopup.allDayElement)
    .hover('body', { offsetX: 0, offsetY: 0 })
    .expect(await takeScreenshot('new-appointment-form-after-click-all-day.png'))
    .ok();

  await t
    .click(scheduler.appointmentPopup.doneButton)
    .hover('body', { offsetX: 0, offsetY: 0 })
    .expect(await takeScreenshot('new-all-day-appointment-on-tables.png'))
    .ok();

  await t
    .click(scheduler.getAppointment('').element)
    .click(scheduler.appointmentTooltip.getListItem('').element)
    .hover('body', { offsetX: 0, offsetY: 0 })
    .expect(await takeScreenshot('new-appointment-form-after-render-on-table.png'))
    .ok();

  await t
    .click(scheduler.appointmentPopup.allDayElement)
    .hover('body', { offsetX: 0, offsetY: 0 })
    .expect(await takeScreenshot('new-appointment-form-after-switch-off-all-day.png'))
    .ok();

  await t.expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createWidget('dxScheduler', {
    dataSource: [],
    views: ['week'],
    currentView: 'week',
    currentDate: new Date(2021, 3, 29),
    startDayHour: 9,
    height: 600,
  });
});

test('StartDate and endDate should have correct type after "allDay" and "repeat" option are changed (T1002864)', async (t) => {
  const scheduler = new Scheduler('#container');
  const { appointmentPopup } = scheduler;

  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await t
    .doubleClick(scheduler.getDateTableCell(0, 0))
    .expect(await takeScreenshot('form-before-change-allday-and-reccurence-options.png'))
    .ok()

    .click(appointmentPopup.allDayElement)
    .click(appointmentPopup.recurrenceElement)

    .expect(await takeScreenshot('form-after-change-allday-and-reccurence-options.png'))
    .ok()

    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxScheduler', {
  currentDate: new Date(2021, 1, 1),
}));
