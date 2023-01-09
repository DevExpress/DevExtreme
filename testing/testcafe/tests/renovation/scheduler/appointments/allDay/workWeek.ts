import { restoreBrowserSize } from '../../../../../helpers/restoreBrowserSize';
import Scheduler from '../../../../../model/scheduler';
import { multiPlatformTest, createWidget } from '../../../../../helpers/multi-platform-test';

const test = multiPlatformTest({
  page: 'declaration/scheduler',
  platforms: ['jquery', 'react'],
});

fixture('Layout:Appointments:AllDay:WorkWeek');

test('It should not cut appointment if end date is concides with the begining of the week end', async (t) => {
  const appointment = new Scheduler('#container').getAppointmentByIndex(0);

  await t.expect(appointment.element.clientWidth)
    .within(130, 135);
}).before(async (_, { platform }) => {
  await createWidget(platform, 'dxScheduler', {
    height: 600,
    width: 800,
    dataSource: [{
      text: 'Test',
      startDate: new Date(2021, 3, 2),
      endDate: new Date(2021, 3, 3),
    }],
    views: ['workWeek'],
    currentView: 'workWeek',
    currentDate: new Date(2021, 2, 28),
  });
}).after(async (t) => restoreBrowserSize(t));
