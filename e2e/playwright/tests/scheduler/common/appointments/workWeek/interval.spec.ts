import { test } from '../../../../../fixtures';
import { createWidget } from '../../../../../helpers/createWidget';
import { testScreenshot } from '../../../../../helpers/screenshots';
import Scheduler from '../../../../../models/scheduler';

test('Should correctly render scheduler in workWeek view with interval, skipping weekends (T1243027)', async ({ page }) => {
  await createWidget(page, 'dxScheduler', {
    dataSource: [
      {
        startDate: '2024-01-05T01:00:00',
        endDate: '2024-01-07T01:00:00',
        text: 'Ends in weekend',
        color: 'red',
      },
      {
        startDate: '2024-01-07T01:00:00',
        endDate: '2024-01-08T01:00:00',
        text: 'Starts in weekend',
        color: 'blue',
      },
      {
        startDate: '2024-01-05T01:00:00',
        endDate: '2024-01-08T01:00:00',
        text: 'Goes over weekend',
        color: 'green',
      },
    ],
    views: [{
      name: 'myView',
      type: 'workWeek',
      allDayPanelMode: 'allDay',
      intervalCount: 2,
      maxAppointmentsPerCell: 'unlimited',
    }],
    currentView: 'myView',
    currentDate: '2024-01-01',
    height: 600,
    // NOTE: resources are used only to distinguish appts in etalon file
    resources: [{
      fieldExpr: 'color',
      dataSource: [
        { id: 'red', color: 'red' },
        { id: 'blue', color: 'blue' },
        { id: 'green', color: 'green' },
      ],
      label: 'Room',
    }],
  });

  const scheduler = new Scheduler(page, '#container');

  await testScreenshot(page, 'work_week_interval-2.png', { element: scheduler.workSpace });
});
