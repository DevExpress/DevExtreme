import { compareScreenshot } from 'devextreme-screenshot-comparer';
import createScheduler from './init/widget.setup';
import url from '../../../helpers/getPageUrl';
import Scheduler from '../../../model/scheduler';

fixture`Resize appointments in All Day Panel`
  .page(url(__dirname, '../../container.html'));

test('Resize in the workWeek view between weeks', async (t) => {
  const scheduler = new Scheduler('#container');
  const appointment1 = scheduler.getAppointment('1st');
  const appointment2 = scheduler.getAppointment('2nd');
  const appointment3 = scheduler.getAppointment('3rd');

  await t
    .drag(appointment1.resizableHandle.right, 400, 0)
    .drag(appointment2.resizableHandle.left, -400, 0)
    .drag(appointment3.resizableHandle.right, -140, 0)
    .expect(
      await compareScreenshot(t, 'resize-all-day-workweek-weekend-0.png'),
    )
    .ok();

  await t
    .drag(appointment1.resizableHandle.right, -400, 0)
    .drag(appointment2.resizableHandle.left, 400, 0)
    .drag(appointment3.resizableHandle.right, 140, 0)
    .expect(
      await compareScreenshot(t, 'resize-all-day-workweek-weekend-1.png'),
    )
    .ok();
}).before(async () => createScheduler({
  width: 800,
  height: 600,
  views: [{
    type: 'workWeek',
    intervalCount: 2,
    startDate: new Date(2021, 5, 29),
  }],
  currentDate: new Date(2021, 5, 29),
  currentView: 'workWeek',
  maxAppointmentsPerCell: 'unlimited',
  startDayHour: 9,
  endDayHour: 13,
  dataSource: [
    {
      text: '1st',
      startDate: new Date(2021, 5, 29),
      allDay: true,
    },
    {
      text: '2nd',
      startDate: new Date(2021, 6, 7),
      allDay: true,
    },
    {
      text: '3rd',
      startDate: new Date(2021, 6, 1),
      endDate: new Date(2021, 6, 5),
      allDay: true,
    },
  ],
}));
