import { dragToOffset } from '../../../../helpers/dragUtils';
import { getTimezoneTest, MACHINE_TIMEZONES } from '../../../../helpers/machineTimezones';
import { testScreenshot } from '../../../../helpers/screenshots';
import Scheduler from '../../../../models/scheduler';
import createScheduler from './init/widget.setup';

const appointmentText = 'Book Flights to San Fran for Sales Trip';

getTimezoneTest([MACHINE_TIMEZONES.EuropeBerlin])('Resize appointment that cross DTC time', async ({ page }) => {
  await createScheduler(page, {
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
  });

  const scheduler = new Scheduler(page, '#container');
  const appointment = scheduler.getAppointment(appointmentText);

  await dragToOffset(page, appointment.resizableHandle.right, 100, 0);
  await dragToOffset(page, appointment.resizableHandle.right, -100, 0);

  await testScreenshot(
    page,
    'T1255474-resize-all-day-appointment.png',
    { element: scheduler.element },
  );
});
