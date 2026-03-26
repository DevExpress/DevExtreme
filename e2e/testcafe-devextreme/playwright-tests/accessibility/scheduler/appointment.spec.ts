import { test } from '@playwright/test';
import { createWidget, a11yCheck } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('Accessibility - Scheduler appointment', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  ['month', 'week', 'day', 'agenda'].forEach((currentView) => {
    test(`appointment accessibility in ${currentView} view`, async ({ page }) => {
      await createWidget(page, 'dxScheduler', {
        timeZone: 'UTC',
        dataSource: [{
          text: 'App 1',
          startDate: new Date(Date.UTC(2021, 1, 1, 12)),
          endDate: new Date(Date.UTC(2021, 1, 1, 13)),
        }],
        currentView,
        currentDate: new Date(Date.UTC(2021, 1, 1)),
      });
      await a11yCheck(page, {}, '#container');
    });

    test(`appointment with template in ${currentView} view`, async ({ page }) => {
      await createWidget(page, 'dxScheduler', {
        timeZone: 'UTC',
        dataSource: [{
          text: 'App 1',
          startDate: new Date(Date.UTC(2021, 1, 1, 12)),
          endDate: new Date(Date.UTC(2021, 1, 1, 13)),
        }],
        appointmentTemplate: ({ appointmentData }) => `<div>${appointmentData.text}</div>`,
        currentView,
        currentDate: new Date(Date.UTC(2021, 1, 1)),
      });
      await a11yCheck(page, {}, '#container');
    });

    test(`appointment with group in ${currentView} view`, async ({ page }) => {
      await createWidget(page, 'dxScheduler', {
        timeZone: 'UTC',
        dataSource: [{
          text: 'App 1',
          startDate: new Date(Date.UTC(2021, 1, 1, 12)),
          endDate: new Date(Date.UTC(2021, 1, 1, 13)),
          groupId: 1,
        }],
        currentView,
        currentDate: new Date(Date.UTC(2021, 1, 1)),
        groups: ['groupId'],
        resources: [{
          fieldExpr: 'groupId',
          dataSource: [{ text: 'resource1', id: 1 }],
          label: 'Group 1',
        }],
      });
      await a11yCheck(page, {}, '#container');
    });
  });

  test('recurring appointment accessibility', async ({ page }) => {
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

  test('appointment with timezone offset', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      timeZone: 'America/Los_Angeles',
      dataSource: [{
        text: 'Install New Router in Dev Room',
        startDate: new Date('2021-03-29T21:30:00.000Z'),
        endDate: new Date('2021-03-29T22:30:00.000Z'),
      }],
      currentView: 'week',
      currentDate: new Date(2021, 2, 28),
    });
    await a11yCheck(page, {}, '#container');
  });

  test('appointment collector button', async ({ page }) => {
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
      ],
      currentView: 'month',
      currentDate: new Date(2021, 2, 1),
    });
    await a11yCheck(page, {}, '#container');
  });
});
