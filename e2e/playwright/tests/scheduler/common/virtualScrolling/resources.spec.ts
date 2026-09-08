import { expect, test } from '../../../../fixtures';
import { createWidget } from '../../../../helpers/createWidget';
import Scheduler from '../../../../models/scheduler';

test('Should correctly render view if virtual scrolling and groupByDate', async ({ page }) => {
  await createWidget(page, 'dxScheduler', {
    height: 600,
    width: 200,
    dataSource: [{
      userId: 1,
      startDate: new Date(2022, 0, 16, 14, 30),
      endDate: new Date(2022, 0, 16, 15),
    }],
    currentDate: new Date(2022, 0, 15),
    views: ['month'],
    currentView: 'month',
    groupByDate: true,
    groups: [
      'userId',
    ],
    resources: [
      {
        fieldExpr: 'userId',
        allowMultiple: false,
        dataSource: [
          { id: 1, text: 'User 1' },
          { id: 2, text: 'User 2' },
          { id: 3, text: 'User 3' },
          { id: 4, text: 'User 4' },
          { id: 5, text: 'User 5' },
        ],
        label: 'User',
      },
    ],
    scrolling: {
      mode: 'virtual',
    },
  });

  const scheduler = new Scheduler(page, '#container');

  await expect(scheduler.getAppointmentByIndex(0).element).toBeAttached();
});
