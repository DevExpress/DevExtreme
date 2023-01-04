import { multiPlatformTest, createWidget } from '../../../../../helpers/multi-platform-test';
import Scheduler from '../../../../../model/scheduler';

const test = multiPlatformTest({
  page: 'declaration/scheduler',
  platforms: ['jquery', 'react'],
});

// NOTE RENOVATION TESTCAFE: All these test scenarios have analogs in jQuery's testcafe tests.
fixture.disablePageReloads.skip('Scheduler - DataSource loading');

test('it should correctly load items with post processing', async (t) => {
  const scheduler = new Scheduler('#container');
  const appointment0 = scheduler.getAppointment('appt-0');

  await t
    .expect(scheduler.getAppointmentCount())
    .eql(1)
    .expect(appointment0.element.exists)
    .ok();
}).before(async (_, { platform }) => createWidget(
  platform,
  'dxScheduler',
  {
    dataSource: {
      store: [
        {
          text: 'appt-0',
          startDate: new Date(2021, 3, 26, 9, 30),
          endDate: new Date(2021, 3, 26, 11, 30),
        }, {
          text: 'appt-1',
          startDate: new Date(2021, 3, 27, 9, 30),
          endDate: new Date(2021, 3, 27, 11, 30),
        }, {
          text: 'appt-2',
          startDate: new Date(2021, 3, 28, 9, 30),
          endDate: new Date(2021, 3, 28, 11, 30),
        },
      ],
      postProcess: (items) => [items[0]],
    },
    views: ['workWeek'],
    currentView: 'workWeek',
    currentDate: new Date(2021, 3, 27),
    startDayHour: 9,
    endDayHour: 19,
    height: 600,
    width: 800,
  },
));
