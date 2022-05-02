import url from '../../../../helpers/getPageUrl';
import Scheduler from '../../../../model/scheduler';
import { multiPlatformTest, createWidget } from '../../../../helpers/multi-platform-test';

const test = multiPlatformTest({
  page: 'declaration/scheduler',
  platforms: ['jquery', 'react'],
});

const priorityData = [{
  text: 'test-appt-1',
  id: 1,
  color: 'rgb(30, 144, 255)',
}, {
  text: 'test-appt-2',
  id: 2,
  color: 'rgb(255, 151, 71)',
}];

fixture`Resources`
  .skip
  .page(url(__dirname, '../../container.html'));

[
  undefined,
  ['priorityId'],
].forEach((groups) => {
  test(`Resource color should be correct if deferred loading and groups is ${groups}`, async (t) => {
    const scheduler = new Scheduler('#container');
    const appointment1 = scheduler.getAppointmentByIndex(0);
    const appointment2 = scheduler.getAppointmentByIndex(1);

    await t
      .wait(10)
      .expect(appointment1.getColor()).eql(priorityData[0].color)
      // eslint-disable-next-line newline-per-chained-call
      .expect(appointment2.getColor()).eql(priorityData[1].color);
  }).before(async (_, { platform }) => createWidget(
    platform,
    'dxScheduler',
    {
      dataSource: [{
        text: 'appt-0',
        startDate: new Date(2021, 3, 26, 10),
        endDate: new Date(2021, 3, 26, 12),
        priorityId: 1,
      }, {
        text: 'appt-1',
        startDate: new Date(2021, 3, 26, 10),
        endDate: new Date(2021, 3, 26, 12),
        priorityId: 2,
      }],
      views: ['day'],
      currentView: 'day',
      currentDate: new Date(2021, 3, 26),
      startDayHour: 9,
      endDayHour: 13,
      height: 600,
      width: 600,
      groups,
      resources: [{
        fieldExpr: 'priorityId',
        allowMultiple: false,
        dataSource: {
          load: () => new Promise((resolve) => {
            setTimeout(() => {
              resolve([{
                text: 'test-appt-1',
                id: 1,
                color: '#1e90ff',
              }, {
                text: 'test-appt-2',
                id: 2,
                color: '#ff9747',
              }]);
            });
          }),
        },
        label: 'Priority',
      }],
    },
  ));
});

test('Scheduler should renders correctly if resource dataSource is not set', async (t) => {
  const scheduler = new Scheduler('#container');
  const appointment1 = scheduler.getAppointment('Appt-1');
  const appointment2 = scheduler.getAppointment('Appt-2');

  await t
    .expect(appointment1.element.exists)
    .ok()
    .expect(appointment2.element.exists)
    .ok();
}).before(async (_, { platform }) => createWidget(
  platform,
  'dxScheduler',
  {
    height: 600,
    width: 800,
    dataSource: [{
      text: 'Appt-1',
      startDate: new Date(2021, 3, 27, 10),
      endDate: new Date(2021, 3, 27, 12),
    }, {
      text: 'Appt-2',
      startDate: new Date(2021, 3, 29, 11),
      endDate: new Date(2021, 3, 29, 13),
    }],
    views: ['workWeek'],
    currentView: 'workWeek',
    currentDate: new Date(2021, 3, 26),
    startDayHour: 9,
    endDayHour: 14,
    resources: [{
      fieldExpr: 'roomId',
      label: 'Room',
    }],
  },
));
