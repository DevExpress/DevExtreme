import createScheduler from './init/widget.setup';
import { disposeWidgets } from '../../../helpers/createWidget';
import url from '../../../helpers/getPageUrl';
import Scheduler from '../../../model/scheduler';

fixture.disablePageReloads`Resize appointments in the Scheduler with vertical groupping`
  .page(url(__dirname, '../../container.html'))
  .afterEach(async (t) => {
    await t.wait(200);
    await disposeWidgets();
  });

test('Should correctly calculate group resizing area (T1025952)', async (t) => {
  const scheduler = new Scheduler('#container');
  const firstAppointment = scheduler.getAppointment('first');
  const secondAppointment = scheduler.getAppointment('second');

  await t
    .drag(firstAppointment.resizableHandle.bottom, 0, 100)
    .expect(firstAppointment.size.height)
    .eql('150px')
    .expect(firstAppointment.date.time)
    .eql('9:30 AM - 11:00 AM')

    .drag(secondAppointment.resizableHandle.bottom, 0, 100)
    .expect(secondAppointment.size.height)
    .eql('150px')
    .expect(secondAppointment.date.time)
    .eql('9:30 AM - 11:00 AM');
}).before(async () => createScheduler({
  dataSource: [
    {
      text: 'first',
      startDate: new Date(2021, 3, 21, 9, 30),
      endDate: new Date(2021, 3, 21, 10),
      priorityId: 1,
    },
    {
      text: 'second',
      startDate: new Date(2021, 3, 21, 9, 30),
      endDate: new Date(2021, 3, 21, 10),
      priorityId: 2,
    },
  ],
  views: [{
    type: 'workWeek',
    groupOrientation: 'vertical',
  }],
  currentView: 'workWeek',
  currentDate: new Date(2021, 3, 21),
  startDayHour: 9,
  endDayHour: 12,
  groups: ['priorityId'],
  resources: [
    {
      fieldExpr: 'priorityId',
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
    },
  ],
}));
