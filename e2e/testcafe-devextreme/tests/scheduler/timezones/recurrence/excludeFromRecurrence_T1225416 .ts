import Scheduler from 'devextreme-testcafe-models/scheduler';
import {
  getTimezoneTest,
  MACHINE_TIMEZONES,
  MachineTimezonesType,
} from '../../../../helpers/machineTimezones';
import url from '../../../../helpers/getPageUrl';
import { generateOptionMatrix } from '../../../../helpers/generateOptionMatrix';
import { createWidget } from '../../../../helpers/createWidget';

fixture`Scheduler exclude from recurrence`
  .page(url(__dirname, '../../../container.html'));

const SCHEDULER_SELECTOR = '#container';
const MS_IN_MINUTE = 60000;
const MS_IN_HOUR = MS_IN_MINUTE * 60;
const APPOINTMENT_TEXT = 'TEST_APPT';

const getAppointments = (
  startDate: Date,
  currentView: string,
) => [
  {
    startDate,
    endDate: new Date(startDate.getTime() + MS_IN_HOUR),
    text: APPOINTMENT_TEXT,
    recurrenceRule: currentView === 'week' ? 'FREQ=DAILY' : 'FREQ=WEEKLY;BYDAY=FR',
  },
];

const getFirstDayOfWeek = (currentView: string) => (currentView === 'week' ? 4 : 0);
const getAppointmentsCount = (currentView: string) => (currentView === 'week' ? 7 : 6);

generateOptionMatrix({
  timeZone: [undefined, 'America/New_York'],
  currentView: ['week', 'month'],
  location: [
    [MACHINE_TIMEZONES.EuropeBerlin, 'summer', '2024-03-31', new Date('2024-01-01T12:00:00Z')],
    [MACHINE_TIMEZONES.EuropeBerlin, 'winter', '2024-10-27', new Date('2024-01-01T12:00:00Z')],
    [MACHINE_TIMEZONES.AmericaLosAngeles, 'summer', '2024-03-10', new Date('2024-01-01T12:00:00Z')],
    [MACHINE_TIMEZONES.AmericaLosAngeles, 'winter', '2024-11-03', new Date('2024-01-01T12:00:00Z')],
  ] as [MachineTimezonesType, string, string, Date][],
}).forEach(({
  timeZone,
  currentView,
  location: [machineTimezone, caseName, currentDate, startDate],
}) => {
  const dataSource = getAppointments(startDate, currentView);
  const firstDayOfWeek = getFirstDayOfWeek(currentView);
  const appointmentsCount = getAppointmentsCount(currentView);

  getTimezoneTest([machineTimezone])(
    `Should correctly exclude appointment from recurrence (week, ${timeZone}, ${machineTimezone}, ${caseName})`,
    async (t) => {
      const scheduler = new Scheduler(SCHEDULER_SELECTOR);

      await t.expect(scheduler.getAppointmentCount()).eql(appointmentsCount);

      for (let idx = 0; idx < appointmentsCount; idx += 1) {
        await t.click(scheduler.getAppointment(APPOINTMENT_TEXT, 0).element)
          .click(scheduler.appointmentTooltip.deleteButton);

        await t.expect(scheduler.getAppointmentCount()).eql(appointmentsCount - (idx + 1));
      }

      await t.expect(scheduler.getAppointmentCount()).eql(0);
    },
  ).before(async () => {
    await createWidget('dxScheduler', {
      timeZone,
      dataSource,
      currentDate,
      currentView,
      firstDayOfWeek,
      recurrenceEditMode: 'occurrence',
    });
  });
});
