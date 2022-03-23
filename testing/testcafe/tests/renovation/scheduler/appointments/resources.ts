import Scheduler from '../../../../model/scheduler';
import { multiPlatformTest, createWidget } from '../../../../helpers/multi-platform-test';

const test = multiPlatformTest({
  page: 'declaration/scheduler',
  platforms: ['jquery', 'react', 'angular'],
});

const dataSource = [{
  text: 'test-appt-1',
  priorityId: 1,
  typeId: 2,
  startDate: new Date('2021-05-26T06:45:00.000Z'),
  endDate: new Date('2021-05-26T09:15:00.000Z'),
}, {
  text: 'test-appt-2',
  priorityId: 2,
  typeId: 1,
  startDate: new Date('2021-05-26T06:45:00.000Z'),
  endDate: new Date('2021-05-26T09:15:00.000Z'),
}];

const priorityData = [{
  text: 'Low Priority',
  id: 1,
  color: 'rgb(252, 182, 94)',
}, {
  text: 'High Priority',
  id: 2,
  color: 'rgb(225, 142, 146)',
}];

fixture('Appointment resources');

test('Resource color should be correct if groups is set in "views"', async (t) => {
  const scheduler = new Scheduler('#container');
  const appointment1 = scheduler.getAppointment('test-appt-1');
  const appointment2 = scheduler.getAppointment('test-appt-2');

  await t
    .expect(appointment1.getColor()).eql(priorityData[0].color)
    .expect(appointment2.getColor()).eql(priorityData[1].color);
}).before(async (_, { platform }) => createWidget(
  platform,
  'dxScheduler',
  {
    height: 600,
    dataSource,
    views: [{
      type: 'workWeek',
      startDayHour: 9,
      endDayHour: 18,
      groups: ['priorityId'],
    }],
    currentView: 'workWeek',
    currentDate: new Date(2021, 4, 25),
    resources: [{
      fieldExpr: 'priorityId',
      allowMultiple: false,
      dataSource: priorityData,
      label: 'Priority',
    }, {
      fieldExpr: 'typeId',
      allowMultiple: false,
      dataSource: [{
        id: 1,
        color: '#b6d623',
      }, {
        id: 2,
        color: '#679ec5',
      }],
    }],
  },
));
