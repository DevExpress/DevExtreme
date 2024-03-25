import { createWidget } from '../../../helpers/createWidget';
import url from '../../../helpers/getPageUrl';
import Scheduler from 'devextreme-testcafe-models/scheduler';

fixture`Appointment Popup errors check`
  .page(url(__dirname, '../../container.html'));

// NOTE: This test case requires page reloading,
// without page reloads the getBrowserConsoleMessages will return undefined.
test('Appointment popup shouldn\'t raise error if appointment is recursive', async (t) => {
  const scheduler = new Scheduler('#container');
  await t.doubleClick(scheduler.getAppointment('Meeting of Instructors').element);
  await t.click(Scheduler.getEditRecurrenceDialog().series);

  const consoleMessages = await t.getBrowserConsoleMessages();
  await t.expect(consoleMessages.error.length).eql(0);
}).before(async () => {
  const data = [{
    text: 'Meeting of Instructors',
    startDate: new Date('2020-11-01T17:00:00.000Z'),
    endDate: new Date('2020-11-01T17:15:00.000Z'),
    recurrenceRule: 'FREQ=DAILY;BYDAY=TU;UNTIL=20201203',
  }];

  return createWidget('dxScheduler', {
    timeZone: 'America/Los_Angeles',
    dataSource: data,
    currentView: 'month',
    currentDate: new Date(2020, 10, 25),
    height: 600,
  });
});
