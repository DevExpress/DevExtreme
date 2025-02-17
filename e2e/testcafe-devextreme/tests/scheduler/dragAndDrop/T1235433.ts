import Scheduler from 'devextreme-testcafe-models/scheduler';
import { createWidget } from '../../../helpers/createWidget';
import url from '../../../helpers/getPageUrl';
import { scrollTo } from '../virtualScrolling/utils';

fixture.disablePageReloads`Scheduler Drag-and-Drop inside Group`
  .page(url(__dirname, '../../container.html'));

test('T1235433: Scheduler - Drag-n-Drop works inside the group with virtual scrolling', async (t) => {
  const scheduler = new Scheduler('#container');

  await t.expect(scheduler.element.exists).ok();

  const appointment1 = scheduler.getAppointment('Book 1');
  const appointment2 = scheduler.getAppointment('Book 2');
  const appointment3 = scheduler.getAppointment('Book 3');
  const appointment4 = scheduler.getAppointment('Book 4');

  await t.drag(appointment1.element, -200, 0)
    .expect(appointment1.date.time)
    .eql('9:00 AM - 10:00 AM');
  await t.drag(appointment2.element, -200, 0)
    .expect(appointment2.date.time)
    .eql('9:00 AM - 10:00 AM');

  await scrollTo(new Date('2021-02-03T01:00:00.000Z'));

  await t.drag(appointment3.element, -200, 0)
    .expect(appointment3.date.time)
    .eql('4:00 PM - 5:15 PM');
  await t.drag(appointment4.element, -200, 0)
    .expect(appointment4.date.time)
    .eql('4:00 PM - 5:15 PM');
}).before(async () => createWidget('dxScheduler', {
  timeZone: 'America/Los_Angeles',
  dataSource: [
    {
      text: 'Book 1',
      ownerId: [2],
      startDate: new Date('2021-02-02T18:00:00.000Z'),
      endDate: new Date('2021-02-02T19:00:00.000Z'),
      priority: 1,
    }, {
      text: 'Book 2',
      ownerId: [1],
      startDate: new Date('2021-02-02T18:00:00.000Z'),
      endDate: new Date('2021-02-02T19:00:00.000Z'),
      priority: 2,
    }, {
      text: 'Book 3',
      ownerId: [1],
      startDate: new Date('2021-02-03T01:00:00.000Z'),
      endDate: new Date('2021-02-03T02:15:00.000Z'),
      priority: 1,
    }, {
      text: 'Book 4',
      ownerId: [2],
      startDate: new Date('2021-02-03T01:00:00.000Z'),
      endDate: new Date('2021-02-03T02:15:00.000Z'),
      priority: 2,
    },
  ],
  views: ['timelineDay'],
  currentView: 'timelineDay',
  currentDate: new Date('2021-02-02T17:00:00.000Z'),
  firstDayOfWeek: 0,
  scrolling: { mode: 'virtual' },
  startDayHour: 8,
  endDayHour: 20,
  cellDuration: 60,
  groups: ['priority'],
  resources: [{
    fieldExpr: 'ownerId',
    allowMultiple: true,
    dataSource: [
      {
        text: 'Samantha Bright',
        id: 1,
        color: '#cb6bb2',
      }, {
        text: 'John Heart',
        id: 2,
        color: '#56ca85',
      },
    ],
    label: 'Owner',
    useColorAsDefault: true,
  }, {
    fieldExpr: 'priority',
    allowMultiple: false,
    dataSource: [
      {
        text: 'Low Priority',
        id: 1,
        color: '#1e90ff',
      }, {
        text: 'High Priority',
        id: 2,
        color: '#ff9747',
      },
    ],
    label: 'Priority',
  }],
  height: 580,
}));
