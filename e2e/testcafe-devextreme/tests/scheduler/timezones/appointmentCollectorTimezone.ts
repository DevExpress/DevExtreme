import Scheduler from 'devextreme-testcafe-models/scheduler';
import { createWidget } from '../../../helpers/createWidget';
import { getTimezoneTest, MACHINE_TIMEZONES } from '../../../helpers/machineTimezones';
import url from '../../../helpers/getPageUrl';

fixture.disablePageReloads`Scheduler - Appointment Collector Timezone`
  .page(url(__dirname, '../../container.html'));

[
  MACHINE_TIMEZONES.EuropeBerlin,
].forEach((machineTimezone) => {
  getTimezoneTest([machineTimezone])(
    'Appointment collector button should have correct date',
    async (t) => {
      const scheduler = new Scheduler('#container');
      const schedulerCollector = scheduler.collectors.get(0);
      const expectedDate = 'March 5, 2021';

      const ariaRoleDescription = await schedulerCollector.element().getAttribute('aria-roledescription');

      await t
        .expect(scheduler.element().exists)
        .ok()
        .expect(ariaRoleDescription)
        .contains(expectedDate, `Collector should display ${expectedDate} after timezone conversion`);
    },
  ).before(async () => {
    await createWidget('dxScheduler', {
      timeZone: 'America/Los_Angeles',
      dataSource: [
        {
          text: 'Website Re-Design Plan',
          startDate: new Date('2021-03-05T15:30:00.000Z'),
          endDate: new Date('2021-03-05T17:00:00.000Z'),
        },
        {
          text: 'Complete Shipper Selection Form',
          startDate: new Date('2021-03-05T15:30:00.000Z'),
          endDate: new Date('2021-03-05T17:00:00.000Z'),
        },
        {
          text: 'Upgrade Server Hardware',
          startDate: new Date('2021-03-05T19:00:00.000Z'),
          endDate: new Date('2021-03-05T21:15:00.000Z'),
        },
        {
          text: 'Upgrade Personal Computers',
          startDate: new Date('2021-03-05T23:45:00.000Z'),
          endDate: new Date('2021-03-06T01:30:00.000Z'),
        },
      ],
      currentView: 'month',
      currentDate: new Date(2021, 2, 1),
      maxAppointmentsPerCell: 3,
    });
  });
});
