import { test } from '@playwright/test';
import { createWidget, a11yCheck } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe.skip('Accessibility - Scheduler appointmentForm', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('appointment form accessibility check', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      dataSource: [{
        text: 'App 1',
        startDate: new Date(2021, 3, 29, 9, 30),
        endDate: new Date(2021, 3, 29, 11, 30),
      }],
      currentView: 'week',
      currentDate: new Date(2021, 3, 29),
    });
    await page.click('.dx-scheduler-appointment');
    await page.waitForSelector('.dx-tooltip-wrapper.dx-scheduler-appointment-tooltip');
    await a11yCheck(page, {}, '#container');
  });

  test('appointment form opened on double-click', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      timeZone: 'UTC',
      dataSource: [{
        text: 'App 1',
        startDate: new Date(Date.UTC(2021, 1, 1, 12)),
        endDate: new Date(Date.UTC(2021, 1, 1, 13)),
      }],
      currentView: 'week',
      currentDate: new Date(2021, 1, 1),
    });
    await page.dblclick('.dx-scheduler-appointment');
    await page.waitForSelector('.dx-scheduler-appointment-popup .dx-overlay-content');
    await a11yCheck(page, {}, '.dx-scheduler-appointment-popup .dx-overlay-content');
  });

  test('appointment form with recurring appointment', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      timeZone: 'America/Los_Angeles',
      dataSource: [{
        text: 'Recurring App',
        startDate: new Date('2021-04-29T16:30:00.000Z'),
        endDate: new Date('2021-04-29T18:30:00.000Z'),
        recurrenceRule: 'FREQ=WEEKLY;BYDAY=MO,TH;COUNT=10',
      }],
      currentView: 'week',
      currentDate: new Date('2021-04-29T18:30:00.000Z'),
      startDayHour: 9,
    });
    await page.click('.dx-scheduler-appointment');
    await page.waitForSelector('.dx-tooltip-wrapper.dx-scheduler-appointment-tooltip');
    await a11yCheck(page, {}, '#container');
  });
});
