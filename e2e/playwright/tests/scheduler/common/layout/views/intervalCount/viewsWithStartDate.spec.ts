import { test } from '../../../../../../fixtures';
import { createWidget } from '../../../../../../helpers/createWidget';
import { testScreenshot } from '../../../../../../helpers/screenshots';
import Scheduler from '../../../../../../models/scheduler';

[{
  view: 'timelineDay',
  currentDate: new Date(2021, 4, 11),
  startDate: new Date(2021, 4, 8),
  intervalCount: 6,
}, {
  view: 'week',
  currentDate: new Date(2021, 4, 11),
  startDate: new Date(2021, 3, 12),
  intervalCount: 8,
}, {
  view: 'timelineWeek',
  currentDate: new Date(2021, 4, 11),
  startDate: new Date(2021, 3, 12),
  intervalCount: 8,
}, {
  view: 'workWeek',
  currentDate: new Date(2021, 4, 11),
  startDate: new Date(2021, 3, 12),
  intervalCount: 8,
}, {
  view: 'timelineWorkWeek',
  currentDate: new Date(2021, 4, 11),
  startDate: new Date(2021, 3, 12),
  intervalCount: 8,
}, {
  view: 'month',
  currentDate: new Date(2020, 5, 11),
  startDate: new Date(2020, 3, 8),
  intervalCount: 6,
}, {
  view: 'timelineMonth',
  currentDate: new Date(2020, 5, 11),
  startDate: new Date(2020, 3, 8),
  intervalCount: 6,
}].forEach(({
  view, currentDate, startDate, intervalCount,
}) => {
  test(`startDate should work in ${view} view`, async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      views: [{
        type: view,
        intervalCount,
        startDate,
      }],
      currentView: view,
      currentDate,
      dataSource: [],
      crossScrollingEnabled: true,
    });

    const scheduler = new Scheduler(page, '#container');

    await testScreenshot(page, `start-date-in-${view}.png`);

    await scheduler.getDateTableCell(0, 0).dblclick();

    await testScreenshot(page, `start-date-in-${view}-with-form.png`);
  });
});

[{
  view: 'week',
  currentDate: new Date(2020, 9, 6),
  startDate: new Date(2020, 8, 16),
  intervalCount: 3,
}, {
  view: 'timelineWeek',
  currentDate: new Date(2020, 9, 6),
  startDate: new Date(2020, 8, 16),
  intervalCount: 3,
}, {
  view: 'workWeek',
  currentDate: new Date(2020, 9, 6),
  startDate: new Date(2020, 8, 16),
  intervalCount: 3,
}, {
  view: 'timelineWorkWeek',
  currentDate: new Date(2020, 9, 6),
  startDate: new Date(2020, 8, 16),
  intervalCount: 3,
}].forEach(({
  view, currentDate, startDate, intervalCount,
}) => {
  test(`startDate should work in ${view} view when it indicates the same week as the start as currentDate`, async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      views: [{
        type: view,
        intervalCount,
        startDate,
      }],
      currentView: view,
      currentDate,
      dataSource: [],
      crossScrollingEnabled: true,
    });

    await testScreenshot(page, `complex-start-date-in-${view}.png`);
  });
});
