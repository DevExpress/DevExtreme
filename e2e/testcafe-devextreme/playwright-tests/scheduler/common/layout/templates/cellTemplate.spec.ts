import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../../tests/container.html')}`;

test.describe('Layout:Templates:CellTemplate', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

);

const SCHEDULER_SELECTOR = '#container';

['day', 'workWeek', 'month', 'timelineDay', 'timelineWorkWeek', 'timelineMonth'].forEach((currentView) => {
  test(`dataCellTemplate and dateCellTemplate layout should be rendered right in '${currentView}'`, async ({ page }) => {
  // --- setup ---
await createWidget(page, 'dxScheduler', {
      dataSource: [],
      views: [currentView],
      currentView,
      currentDate: new Date(2017, 4, 25),
      showAllDayPanel: false,
      dataCellTemplate: ClientFunction((itemData) => ($('<div />') as any).dxDateBox({
        type: 'time',
        value: itemData.startDate,
      })),
      dateCellTemplate: ClientFunction((itemData) => ($('<div />') as any).dxTextBox({
        value: new Intl.DateTimeFormat('en-US').format(itemData.date),
      })),
      height: 600,
  // --- test ---
const scheduler = new Scheduler(SCHEDULER_SELECTOR);
        await testScreenshot(page,
      `data-cell-template-currentView=${currentView}.png`,
      { element: page.locator('.dx-scheduler-work-space') },
    );

    expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
});
  });
});

test('[T1251590] Async dateCellTemplate should be rendered only once', async ({ page }) => {
  // --- setup ---
await createWidget(page, 'dxScheduler', {
    dataSource: [
      {
        startDate: '2024-01-01T01:00:00',
        endDate: '2024-01-01T02:00:00',
        allDay: true,
      },
    ],
    dateCellTemplate: ClientFunction((_, __, itemElement) => {
      setTimeout(() => {
        itemElement.append('TEST');
      }, 0);
    }),
    currentDate: '2024-01-01',
    currentView: 'week',
  // --- test ---
const scheduler = new Scheduler(SCHEDULER_SELECTOR);

  const firstTableCell = scheduler.headerPanel.headerCells.nth(0);

  expect(firstTableCell.textContent).toBe('TEST');
});
});

test('[T1251590] Async dateCellTemplate should be rendered only once if has reference props (grouping)', async ({ page }) => {
  const scheduler = new Scheduler(SCHEDULER_SELECTOR);

  const firstTableCell = scheduler.headerPanel.headerCells.nth(0);

  expect(firstTableCell.textContent).toBe('TEST');
});

// TODO: .before() block not converted - move to test setup
// {
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
    dateCellTemplate: ClientFunction((_, __, itemElement) => {
      setTimeout(() => {
        itemElement.append('TEST');
      }, 0);
    }),
    currentDate: '2024-01-01',
    currentView: 'week',
  });
});
});
