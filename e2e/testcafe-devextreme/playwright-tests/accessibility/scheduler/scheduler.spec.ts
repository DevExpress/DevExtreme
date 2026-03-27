import { test } from '@playwright/test';
import { createWidget, a11yCheck } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('Accessibility - Scheduler', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('month view accessibility check', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      dataSource: [],
      currentView: 'month',
    });
    await a11yCheck(page, {}, '#container');
  });

  ['day', 'week', 'workWeek', 'month', 'agenda', 'timelineDay', 'timelineMonth', 'timelineWeek', 'timelineWorkWeek'].forEach((currentView) => {
    test(`${currentView} view with appointment`, async ({ page }) => {
      await createWidget(page, 'dxScheduler', {
        timeZone: 'America/Los_Angeles',
        dataSource: [{
          text: 'Website Re-Design Plan',
          startDate: new Date('2021-04-29T16:30:00.000Z'),
          endDate: new Date('2021-04-29T18:30:00.000Z'),
        }],
        currentView,
        currentDate: new Date(2021, 3, 29),
        startDayHour: 9,
      });
      await a11yCheck(page, {}, '#container');
    });
  });

  test('month view with grouping by resource', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      timeZone: 'UTC',
      dataSource: [{
        text: 'App 1',
        startDate: new Date(Date.UTC(2021, 1, 1, 12)),
        endDate: new Date(Date.UTC(2021, 1, 1, 13)),
        groupId: 1,
      }],
      currentView: 'month',
      currentDate: new Date(Date.UTC(2021, 1, 1)),
      groups: ['groupId'],
      resources: [{
        fieldExpr: 'groupId',
        dataSource: [{ text: 'Resource A', id: 1 }, { text: 'Resource B', id: 2 }],
        label: 'Group',
      }],
    });
    await a11yCheck(page, {}, '#container');
  });

  test('week view with recurring appointment', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      timeZone: 'America/Los_Angeles',
      dataSource: [{
        text: 'Website Re-Design Plan',
        startDate: new Date('2021-04-29T16:30:00.000Z'),
        endDate: new Date('2021-04-29T18:30:00.000Z'),
        recurrenceRule: 'FREQ=WEEKLY;BYDAY=MO,TH;COUNT=10',
      }],
      currentView: 'week',
      currentDate: new Date('2021-04-29T18:30:00.000Z'),
      startDayHour: 9,
    });
    await a11yCheck(page, {}, '#container');
  });

  test('week view with all-day appointments', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      timeZone: 'UTC',
      dataSource: [{
        text: 'All Day Event',
        startDate: new Date(Date.UTC(2021, 3, 29)),
        endDate: new Date(Date.UTC(2021, 3, 29)),
        allDay: true,
      }],
      currentView: 'week',
      currentDate: new Date(2021, 3, 29),
    });
    await a11yCheck(page, {}, '#container');
  });

  test('week view with multiple resources grouping', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      timeZone: 'UTC',
      dataSource: [{
        text: 'App 1',
        startDate: new Date(Date.UTC(2021, 1, 1, 12)),
        endDate: new Date(Date.UTC(2021, 1, 1, 13)),
        groupId1: 1,
        groupId2: 1,
      }],
      currentView: 'week',
      currentDate: new Date(Date.UTC(2021, 1, 1)),
      groups: ['groupId1', 'groupId2'],
      resources: [
        {
          fieldExpr: 'groupId1',
          dataSource: [{ text: 'resource11', id: 1 }, { text: 'resource12', id: 2 }],
          label: 'Group 1',
        },
        {
          fieldExpr: 'groupId2',
          dataSource: [{ text: 'resource21', id: 1 }, { text: 'resource22', id: 2 }],
          label: 'Group 2',
        },
      ],
    });
    await a11yCheck(page, {}, '#container');
  });

  test('day view with disabled time ranges', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      dataSource: [{
        text: 'App 1',
        startDate: new Date(2021, 1, 1, 12),
        endDate: new Date(2021, 1, 1, 13),
      }],
      currentView: 'day',
      currentDate: new Date(2021, 3, 27),
    });
    await a11yCheck(page, {}, '#container');
  });

  test('month view with appointment collector', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      timeZone: 'America/Los_Angeles',
      dataSource: [
        {
          text: 'Website Re-Design Plan',
          startDate: new Date('2021-03-05T23:45:00.000Z'),
          endDate: new Date('2021-03-05T18:15:00.000Z'),
        },
        {
          text: 'Complete Shipper Selection Form',
          startDate: new Date('2021-03-05T15:30:00.000Z'),
          endDate: new Date('2021-03-05T17:00:00.000Z'),
        },
        {
          text: 'Upgrade Server Hardware',
          startDate: new Date('2021-03-05T19:00:00.000Z'),
          endDate: new Date('2021-03-05T21:15:00.000Z'),
        },
        {
          text: 'Upgrade Personal Computers',
          startDate: new Date('2021-03-05T21:45:00.000Z'),
          endDate: new Date('2021-03-05T23:30:00.000Z'),
        },
      ],
      currentView: 'month',
      currentDate: new Date(2021, 2, 1),
    });
    await a11yCheck(page, {}, '#container');
  });

  test('week view with allDayPanelMode hidden', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      timeZone: 'UTC',
      dataSource: [{
        text: 'App 1',
        startDate: new Date(Date.UTC(2021, 1, 1, 12)),
        endDate: new Date(Date.UTC(2021, 1, 3, 13)),
      }],
      allDayPanelMode: 'hidden',
      currentView: 'week',
      currentDate: new Date(Date.UTC(2021, 1, 1)),
    });
    await a11yCheck(page, {}, '#container');
  });

  test('month view with maxAppointmentsPerCell', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      dataSource: [
        { text: 'App 1', startDate: new Date(2021, 1, 1), endDate: new Date(2021, 1, 1) },
        { text: 'App 2', startDate: new Date(2021, 1, 2), endDate: new Date(2021, 1, 2) },
        { text: 'App 3', startDate: new Date(2021, 1, 2), endDate: new Date(2021, 1, 2) },
        { text: 'App 4', startDate: new Date(2021, 1, 3), endDate: new Date(2021, 1, 3) },
      ],
      allDayPanelMode: 'hidden',
      currentView: 'month',
      maxAppointmentsPerCell: 1,
      currentDate: new Date(2021, 1, 1),
    });
    await a11yCheck(page, {}, '#container');
  });
});
