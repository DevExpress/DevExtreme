import { ClientFunction } from 'testcafe';
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import Scheduler from 'devextreme-testcafe-models/scheduler';
import { createWidget } from '../../../../../helpers/createWidget';
import url from '../../../../../helpers/getPageUrl';
import { testScreenshot } from '../../../../../helpers/themeUtils';

fixture.disablePageReloads`Layout:Templates:CellTemplate`
  .page(url(__dirname, '../../../../container.html'));

const SCHEDULER_SELECTOR = '#container';

['day', 'workWeek', 'month', 'timelineDay', 'timelineWorkWeek', 'timelineMonth'].forEach((currentView) => {
  test(`dataCellTemplate and dateCellTemplate layout should be rendered right in '${currentView}'`, async (t) => {
    const scheduler = new Scheduler(SCHEDULER_SELECTOR);
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await testScreenshot(
      t,
      takeScreenshot,
      `data-cell-template-currentView=${currentView}.png`,
      { element: scheduler.workSpace },
    );

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async () => {
    await createWidget('dxScheduler', {
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
    });
  });
});

test('[T1251590] Async dateCellTemplate should be rendered only once', async (t) => {
  const scheduler = new Scheduler(SCHEDULER_SELECTOR);

  const firstTableCell = scheduler.headerPanel.headerCells.nth(0);

  await t.expect(firstTableCell.textContent).eql('TEST');
}).before(async () => {
  await createWidget('dxScheduler', {
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
  });
});

test('[T1251590] Async dateCellTemplate should be rendered only once if has reference props (grouping)', async (t) => {
  const scheduler = new Scheduler(SCHEDULER_SELECTOR);

  const firstTableCell = scheduler.headerPanel.headerCells.nth(0);

  await t.expect(firstTableCell.textContent).eql('TEST');
}).before(async () => {
  await createWidget('dxScheduler', {
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
