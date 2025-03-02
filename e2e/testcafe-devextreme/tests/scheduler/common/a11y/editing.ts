import Scheduler from 'devextreme-testcafe-models/scheduler';
import { createWidget } from '../../../helpers/createWidget';
import url from '../../../helpers/getPageUrl';
import { a11yCheck } from '../../../helpers/accessibility/utils';

fixture.disablePageReloads`a11y - appointment`
  .page(url(__dirname, '../../container.html'));

const checkOptions = {
  rules: {
    'color-contrast': { enabled: false },
  },
};

test('Scheduler edit appointment is accessible', async (t) => {
  const scheduler = new Scheduler('#container');

  await t.doubleClick(scheduler.getAppointmentByIndex(0).element());
  await t.expect(scheduler.appointmentPopup.isVisible()).ok();

  await a11yCheck(t, checkOptions, '#container');
}).before(async () => {
  await createWidget('dxScheduler', {
    timeZone: 'America/Los_Angeles',
    dataSource: [{
      text: 'Install New Router in Dev Room',
      startDate: new Date('2021-03-29T21:30:00.000Z'),
      endDate: new Date('2021-03-29T22:30:00.000Z'),
    }],
    currentView: 'week',
    currentDate: new Date(2021, 2, 28),
  });
});
