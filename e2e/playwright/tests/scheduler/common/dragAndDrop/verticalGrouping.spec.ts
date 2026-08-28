import { test } from '../../../../fixtures';
import { dragToElement } from '../../../../helpers/dragUtils';
import { testScreenshot } from '../../../../helpers/screenshots';
import Scheduler from '../../../../models/scheduler';
import createScheduler from './init/widget.setup';

test('Should drag appoinment to the previous day`s cell (T1025952)', async ({ page }) => {
  await createScheduler(page, {
    dataSource: [
      {
        text: 'appointment',
        startDate: new Date(2021, 3, 21, 9, 30),
        endDate: new Date(2021, 3, 21, 10),
        priorityId: 1,
      },
    ],
    views: [
      {
        type: 'week',
        groupOrientation: 'vertical',
      },
    ],
    currentView: 'week',
    currentDate: new Date(2021, 3, 21),
    groups: ['priorityId'],
    resources: [
      {
        dataSource: [
          {
            text: 'Low Priority',
            id: 1,
          }, {
            text: 'High Priority',
            id: 2,
          },
        ],
        fieldExpr: 'priorityId',
        displayExpr: 'name',
        allowMultiple: false,
      },
    ],
    startDayHour: 9,
    endDayHour: 12,
    height: 600,
  });

  const scheduler = new Scheduler(page, '#container');
  const appointment = scheduler.getAppointment('appointment');

  await dragToElement(page, appointment.element, scheduler.getDateTableCell(1, 1));

  await testScreenshot(page, 'drag-n-drop-previous-day-cell.png', { element: scheduler.workSpace });
});
