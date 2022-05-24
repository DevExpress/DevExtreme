import Scheduler from '../../../../model/scheduler';
import { multiPlatformTest, createWidget } from '../../../../helpers/multi-platform-test';

const test = multiPlatformTest({
  page: 'declaration/scheduler',
  platforms: ['jquery', 'react'],
});

fixture('Renovated scheduler - Appointment focus');

test('it should be focused correctly', async (t) => {
  const scheduler = new Scheduler('#container');
  const appt1 = scheduler.getAppointment('a-1');
  const appt2 = scheduler.getAppointment('a-2');
  const appt3 = scheduler.getAppointment('a-3');

  await t
    .click(appt1.element)
    .expect(appt1.isFocused)
    .ok()
    .expect(appt2.isFocused)
    .notOk()
    .expect(appt3.isFocused)
    .notOk();

  await t
    .click(appt2.element)
    .expect(appt1.isFocused)
    .notOk()
    .expect(appt2.isFocused)
    .ok()
    .expect(appt3.isFocused)
    .notOk();

  await t
    .click(appt3.element)
    .expect(appt1.isFocused)
    .notOk()
    .expect(appt2.isFocused)
    .notOk()
    .expect(appt3.isFocused)
    .ok();
}).before(
  async (_, { platform }) => {
    await createWidget(platform, 'dxScheduler', {
      dataSource: [{
        text: 'a-1',
        startDate: new Date(2021, 3, 26, 9),
        allDay: true,
      }, {
        text: 'a-2',
        startDate: new Date(2021, 3, 26, 10),
        endDate: new Date(2021, 3, 26, 11),
      }, {
        text: 'a-3',
        startDate: new Date(2021, 3, 26, 12, 13),
      }],
      views: ['day'],
      currentView: 'day',
      currentDate: new Date(2021, 3, 26),
      startDayHour: 9,
      endDayHour: 13,
      width: 400,
    });
  },
);
