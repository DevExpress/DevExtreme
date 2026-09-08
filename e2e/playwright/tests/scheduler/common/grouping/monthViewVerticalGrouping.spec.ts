import { test } from '../../../../fixtures';
import { createWidget } from '../../../../helpers/createWidget';
import { testScreenshot } from '../../../../helpers/screenshots';
import Scheduler from '../../../../models/scheduler';

const SCHEDULER_SELECTOR = '#container';

test('Scrolling: usual. Shouldn\'t overlap the next group with long all-day appointment in the month view (T1122185)', async ({ page }) => {
  await createWidget(page, 'dxScheduler', {
    dataSource: [
      {
        text: 'Appointment group 1',
        groupId: 1,
        startDate: '2021-04-29T14:00:00Z',
        endDate: '2021-06-20T14:00:00Z',
        allDay: true,
      },
    ],
    views: [{
      type: 'month',
      groupOrientation: 'vertical',
    }],
    currentView: 'month',
    currentDate: '2021-04-29T00:00:00Z',
    groups: ['groupId'],
    resources: [
      {
        fieldExpr: 'groupId',
        allowMultiple: false,
        dataSource: [{
          text: 'Group 1',
          id: 1,
          color: '#ff0000',
        }, {
          text: 'Group 2',
          id: 2,
          color: '#0000ff',
        }],
        label: 'Group',
      },
    ],
  });

  const scheduler = new Scheduler(page, SCHEDULER_SELECTOR);

  await testScreenshot(page, 'month-view_vertical-grouping_fist-app-part_T1122185.png', { element: scheduler.workSpace });

  await scheduler.toolbar.navigator.nextButton.click();
  await testScreenshot(page, 'month-view_vertical-grouping_middle-app-part_T1122185.png', { element: scheduler.workSpace });

  await scheduler.toolbar.navigator.nextButton.click();
  await testScreenshot(page, 'month-view_vertical-grouping_last-app-part_T1122185.png', { element: scheduler.workSpace });
});
