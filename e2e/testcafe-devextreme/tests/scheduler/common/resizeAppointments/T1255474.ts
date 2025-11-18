import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import Scheduler from 'devextreme-testcafe-models/scheduler';
import { getTimezoneTest, MACHINE_TIMEZONES } from '../../../../helpers/machineTimezones';
import url from '../../../../helpers/getPageUrl';
import createScheduler from './init/widget.setup';
import { testScreenshot } from '../../../../helpers/themeUtils';

fixture.disablePageReloads`Resize appointment that cross DTC time`
  .page(url(__dirname, '../../../container.html'));

const appointmentText = 'Book Flights to San Fran for Sales Trip';

getTimezoneTest([MACHINE_TIMEZONES.EuropeBerlin])('Resize appointment that cross DTC time', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const scheduler = new Scheduler('#container');
  const appointment = scheduler.getAppointment(appointmentText);

  await t
    .drag(appointment.resizableHandle.right, 100, 0)
    .drag(appointment.resizableHandle.right, -100, 0);

  await testScreenshot(
    t,
    takeScreenshot,
    'T1255474-resize-all-day-appointment.png',
    { element: scheduler.element },
  );

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createScheduler({
  timeZone: 'America/Los_Angeles',
  views: ['week'],
  currentView: 'week',
  currentDate: new Date(2021, 2, 28),
  allDayPanelMode: 'allDay',
  height: 600,
  width: 800,
  firstDayOfWeek: 7,
  dataSource: [{
    text: appointmentText,
    startDate: new Date('2021-03-28T17:00:00.000Z'),
    endDate: new Date('2021-03-28T18:00:00.000Z'),
    TimeZone: 'Europe/Belgrade',
    allDay: true,
  }],
}));
