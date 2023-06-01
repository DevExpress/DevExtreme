// T1086079
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import Scheduler from '../../../../model/scheduler';
import createWidget from '../../../../helpers/createWidget';
import url from '../../../../helpers/getPageUrl';

fixture.disablePageReloads`Layout:Appointments:longAppointments(T1086079)`
  .page(url(__dirname, '../../../container.html'));

const dataSource = [{
  text: 'Website Re-Design Plan',
  startDate: new Date('2021-02-29T01:30:00.000Z'),
  endDate: new Date('2021-02-29T14:30:00.000Z'),
  recurrenceRule: 'FREQ=DAILY',
}];

const appointmentName = 'Website Re-Design Plan';

test('Control should be render top part of recurrent long appointment in day view(T1086079)', async (t) => {
  const scheduler = new Scheduler('#container');
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await t.expect(await takeScreenshot('long-appointment-day-view-T1086079.png', scheduler.workSpace)).ok();

  await t.click(scheduler.getAppointment(appointmentName, 0).element);
  await t.expect(scheduler.appointmentTooltip.getListItem(appointmentName).date.innerText).eql('March 29 5:30 PM - March 30 6:30 AM');

  await t.click(scheduler.getAppointment(appointmentName, 1).element);
  await t.expect(scheduler.appointmentTooltip.getListItem(appointmentName).date.innerText).eql('March 30 5:30 PM - March 31 6:30 AM');

  await t.click(scheduler.toolbar.navigator.nextButton);

  await t.click(scheduler.getAppointment(appointmentName, 0).element);
  await t.expect(scheduler.appointmentTooltip.getListItem(appointmentName).date.innerText).eql('March 30 5:30 PM - March 31 6:30 AM');

  await t.click(scheduler.getAppointment(appointmentName, 1).element);
  await t.expect(scheduler.appointmentTooltip.getListItem(appointmentName).date.innerText).eql('March 31 5:30 PM - April 1 6:30 AM');

  await t.expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createWidget('dxScheduler', {
    timeZone: 'America/Los_Angeles',
    dataSource,
    cellDuration: 120,
    views: ['day'],
    currentView: 'day',
    currentDate: new Date(2021, 2, 30),
    startDayHour: 2,
    endDayHour: 22,
    height: 600,
  });
});

test('Control should be render top part of recurrent long appointment in week view(T1086079)', async (t) => {
  const scheduler = new Scheduler('#container');
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await t.expect(await takeScreenshot('long-appointment-week-view-T1086079.png.png', scheduler.workSpace)).ok();

  await t.click(scheduler.getAppointment(appointmentName, 0).element);
  await t.expect(scheduler.appointmentTooltip.getListItem(appointmentName).date.innerText).eql('March 27 5:30 PM - March 28 6:30 AM');

  await t.click(scheduler.getAppointment(appointmentName, 1).element);
  await t.expect(scheduler.appointmentTooltip.getListItem(appointmentName).date.innerText).eql('March 28 5:30 PM - March 29 6:30 AM');

  await t.click(scheduler.getAppointment(appointmentName, 2).element);
  await t.expect(scheduler.appointmentTooltip.getListItem(appointmentName).date.innerText).eql('March 28 5:30 PM - March 29 6:30 AM');

  await t.click(scheduler.getAppointment(appointmentName, 3).element);
  await t.expect(scheduler.appointmentTooltip.getListItem(appointmentName).date.innerText).eql('March 29 5:30 PM - March 30 6:30 AM');

  await t.expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createWidget('dxScheduler', {
    timeZone: 'America/Los_Angeles',
    dataSource,
    cellDuration: 120,
    views: ['week'],
    currentView: 'week',
    currentDate: new Date(2021, 2, 30),
    startDayHour: 2,
    endDayHour: 22,
    height: 600,
  });
});
