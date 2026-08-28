import { test } from '../../../../fixtures';
import { dragToOffset } from '../../../../helpers/dragUtils';
import { testScreenshot } from '../../../../helpers/screenshots';
import Scheduler from '../../../../models/scheduler';
import createScheduler from './init/widget.setup';

test('Resize in the workWeek view between weeks', async ({ page }) => {
  await createScheduler(page, {
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
  });

  const scheduler = new Scheduler(page, '#container');
  const appointment1 = scheduler.getAppointment('1st');
  const appointment2 = scheduler.getAppointment('2nd');
  const appointment3 = scheduler.getAppointment('3rd');

  await dragToOffset(page, appointment1.resizableHandle.right, 400, 0);
  await dragToOffset(page, appointment2.resizableHandle.left, -400, 0);
  await dragToOffset(page, appointment3.resizableHandle.right, -140, 0);

  await testScreenshot(page, 'resize-all-day-workweek-weekend-0.png');

  await dragToOffset(page, appointment1.resizableHandle.right, -400, 0);
  await dragToOffset(page, appointment2.resizableHandle.left, 400, 0);
  await dragToOffset(page, appointment3.resizableHandle.right, 140, 0);

  await testScreenshot(page, 'resize-all-day-workweek-weekend-1.png');
});
