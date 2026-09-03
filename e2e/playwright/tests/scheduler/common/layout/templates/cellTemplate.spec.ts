import { expect, test } from '../../../../../fixtures';
import { createWidget } from '../../../../../helpers/createWidget';
import { testScreenshot } from '../../../../../helpers/screenshots';
import Scheduler from '../../../../../models/scheduler';

const SCHEDULER_SELECTOR = '#container';

['day', 'workWeek', 'month', 'timelineDay', 'timelineWorkWeek', 'timelineMonth'].forEach((currentView) => {
  test(`dataCellTemplate and dateCellTemplate layout should be rendered right in '${currentView}'`, async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      dataSource: [],
      views: [currentView],
      currentView,
      currentDate: new Date(2017, 4, 25),
      showAllDayPanel: false,
      dataCellTemplate: (itemData) => ($('<div />') as any).dxDateBox({
        type: 'time',
        value: itemData.startDate,
      }),
      dateCellTemplate: (itemData) => ($('<div />') as any).dxTextBox({
        value: new Intl.DateTimeFormat('en-US').format(itemData.date),
      }),
      height: 600,
    });

    const scheduler = new Scheduler(page, SCHEDULER_SELECTOR);

    await testScreenshot(
      page,
      `data-cell-template-currentView=${currentView}.png`,
      { element: scheduler.workSpace },
    );
  });
});

test('[T1251590] Async dateCellTemplate should be rendered only once', async ({ page }) => {
  await createWidget(page, 'dxScheduler', {
    dataSource: [
      {
        startDate: '2024-01-01T01:00:00',
        endDate: '2024-01-01T02:00:00',
        allDay: true,
      },
    ],
    dateCellTemplate: (_, __, itemElement) => {
      setTimeout(() => {
        itemElement.append('TEST');
      }, 0);
    },
    currentDate: '2024-01-01',
    currentView: 'week',
  });

  const scheduler = new Scheduler(page, SCHEDULER_SELECTOR);

  await expect(scheduler.headerPanel.headerCells.nth(0)).toHaveText('TEST');
});

test('[T1251590] Async dateCellTemplate should be rendered only once if has reference props (grouping)', async ({ page }) => {
  await createWidget(page, 'dxScheduler', {
    dataSource: [
      {
        startDate: '2024-01-01T01:00:00',
        endDate: '2024-01-01T02:00:00',
        allDay: true,
      },
    ],
    groups: ['groupId'],
    resources: [
      {
        label: 'group',
        fieldExpr: 'groupId',
        dataSource: [
          {
            text: 'A',
            id: 0,
            color: '#00af2c',
          },
        ],
      },
    ],
    dateCellTemplate: (_, __, itemElement) => {
      setTimeout(() => {
        itemElement.append('TEST');
      }, 0);
    },
    currentDate: '2024-01-01',
    currentView: 'week',
  });

  const scheduler = new Scheduler(page, SCHEDULER_SELECTOR);

  await expect(scheduler.headerPanel.headerCells.nth(0)).toHaveText('TEST');
});
