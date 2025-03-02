import Scheduler from 'devextreme-testcafe-models/scheduler';
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import url from '../../../helpers/getPageUrl';
import { createWidget } from '../../../helpers/createWidget';
import { safeSizeTest } from '../../../helpers/safeSizeTest';

fixture.disablePageReloads`Appointments with adaptive`
  .page(url(__dirname, '../../container.html'));

const SCHEDULER_SELECTOR = '#container';
const MOBILE_SIZE: [width: number, height: number] = [500, 700];

['week', 'month'].forEach((view) => {
  safeSizeTest(`should correctly render appointment collectors (view:${view})`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
    const scheduler = new Scheduler(SCHEDULER_SELECTOR);

    await takeScreenshot(`adaptive_appts_view-${view}.png`, scheduler.workSpace);

    await t.expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }, MOBILE_SIZE).before(async () => createWidget('dxScheduler', {
    dataSource: [
      {
        startDate: '2023-12-20T10:00:00',
        endDate: '2024-01-20T12:00:00',
        allDay: true,
        text: 'all-day #0 (long)',
      },
      {
        startDate: '2023-12-31T10:00:00',
        endDate: '2024-01-06T12:00:00',
        allDay: true,
        text: 'all-day #1 (week-long)',
      },
      {
        startDate: '2024-01-01T10:00:00',
        endDate: '2024-01-05T12:00:00',
        allDay: true,
        text: 'all-day #2',
      },
      {
        startDate: '2024-01-02T10:00:00',
        endDate: '2024-01-04T12:00:00',
        allDay: true,
        text: 'all-day #3',
      },
      {
        startDate: '2024-01-03T10:00:00',
        endDate: '2024-01-03T12:00:00',
        allDay: true,
        text: 'all-day #4 (single-day)',
      },
      {
        startDate: '2024-12-30T10:00:00',
        endDate: '2024-01-20T12:00:00',
        text: 'usual #0 (long)',
      },
      {
        startDate: '2024-01-03T01:30:00',
        endDate: '2024-01-03T22:00:00',
        text: 'usual #1 (day-long)',
      },
      {
        startDate: '2024-01-03T01:30:00',
        endDate: '2024-01-03T02:30:00',
        text: 'usual #2 (short)',
      },
      {
        startDate: '2024-01-03T02:30:00',
        endDate: '2024-01-03T22:00:00',
        text: 'usual #3 (day-long)',
      },
    ],
    adaptivityEnabled: true,
    currentView: 'week',
    currentDate: '2024-01-01T00:00:00',
  }));
});

safeSizeTest('should correctly render long appointments with disabled allDayPanel ()', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const scheduler = new Scheduler(SCHEDULER_SELECTOR);

  await takeScreenshot('adaptive_long-appts-without-all-day-panel_view-week.png', scheduler.workSpace);

  await t.expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}, MOBILE_SIZE).before(async () => createWidget('dxScheduler', {
  dataSource: [
    {
      startDate: '2023-12-20T00:00:00',
      endDate: '2024-01-20T02:00:00',
      text: '#0 (long)',
    },
    {
      startDate: '2023-12-31T00:00:00',
      endDate: '2024-01-06T02:00:00',
      text: '#1 (week-long)',
    },
    {
      startDate: '2024-01-01T00:00:00',
      endDate: '2024-01-05T02:00:00',
      text: '#2',
    },
    {
      startDate: '2024-01-02T00:00:00',
      endDate: '2024-01-04T02:00:00',
      text: '#3',
    },
    {
      startDate: '2024-01-03T00:00:00',
      endDate: '2024-01-03T02:00:00',
      text: '#4 (single-day)',
    },
    {
      startDate: '2024-01-03T01:30:00',
      endDate: '2024-01-03T22:00:00',
      text: '#5',
    },
    {
      startDate: '2024-01-03T01:30:00',
      endDate: '2024-01-03T02:30:00',
      text: '#6',
    },
    {
      startDate: '2024-01-03T02:30:00',
      endDate: '2024-01-03T22:00:00',
      text: '#7',
    },
  ],
  adaptivityEnabled: true,
  allDayPanelMode: 'hidden',
  showAllDayPanel: false,
  currentView: 'week',
  currentDate: '2024-01-01T00:00:00',
}));
