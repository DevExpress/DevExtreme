import { expect, test } from '../../../../fixtures';
import { dragToOffset } from '../../../../helpers/dragUtils';
import Scheduler from '../../../../models/scheduler';
import createScheduler from './init/widget.setup';

const resources = [
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
];

test('Should correctly calculate group resizing area (T1025952)', async ({ page }) => {
  await createScheduler(page, {
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
    resources,
  });

  const scheduler = new Scheduler(page, '#container');
  const firstAppointment = scheduler.getAppointment('first');
  const secondAppointment = scheduler.getAppointment('second');

  await dragToOffset(page, firstAppointment.resizableHandle.bottom, 0, 100);
  await expect(firstAppointment.date.time).toHaveText('9:30 AM - 11:00 AM');

  await dragToOffset(page, secondAppointment.resizableHandle.bottom, 0, 100);
  await expect(secondAppointment.date.time).toHaveText('9:30 AM - 11:00 AM');
});

test('Should correctly calculate group resizing area after scroll (T1041672)', async ({ page }) => {
  await createScheduler(page, {
    dataSource: [
      {
        text: 'app',
        startDate: new Date(2021, 3, 21, 9, 30),
        endDate: new Date(2021, 3, 21, 10),
        priorityId: 2,
      },
    ],
    views: [{
      type: 'week',
      groupOrientation: 'vertical',
    }],
    currentView: 'week',
    currentDate: new Date(2021, 3, 21),
    height: 400,
    groups: ['priorityId'],
    resources,
  });

  const scheduler = new Scheduler(page, '#container');

  await scheduler.scrollTo(new Date(2021, 3, 21, 9, 30), { priorityId: 2 });

  const appointment = scheduler.getAppointment('app');

  await dragToOffset(page, appointment.resizableHandle.bottom, 0, 100);
  await expect(appointment.date.time).toHaveText('9:30 AM - 11:00 AM');
});
