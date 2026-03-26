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
});
