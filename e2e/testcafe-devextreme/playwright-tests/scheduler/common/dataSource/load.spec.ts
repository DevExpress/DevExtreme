import { test, expect } from '@playwright/test';
import { createWidget, getContainerUrl, setupTestPage } from '../../../../playwright-helpers';

const containerUrl = getContainerUrl(__dirname, '../../../../tests/container.html');

test.describe('Scheduler - DataSource loading', () => {
  test.beforeEach(async ({ page }) => {
    await setupTestPage(page, containerUrl);
  });

  test('it should correctly load items with post processing', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      dataSource: {
        store: [
          { text: 'appt-0', startDate: new Date(2021, 3, 26, 9, 30), endDate: new Date(2021, 3, 26, 11, 30) },
          { text: 'appt-1', startDate: new Date(2021, 3, 27, 9, 30), endDate: new Date(2021, 3, 27, 11, 30) },
          { text: 'appt-2', startDate: new Date(2021, 3, 28, 9, 30), endDate: new Date(2021, 3, 28, 11, 30) },
        ],
        postProcess: ((items: any[]) => [items[0]]) as any,
      },
      views: ['workWeek'],
      currentView: 'workWeek',
      currentDate: new Date(2021, 3, 27),
      startDayHour: 9,
      endDayHour: 19,
      height: 600,
      width: 800,
    });

    const appointmentCount = await page.locator('.dx-scheduler-appointment').count();
    expect(appointmentCount).toBe(1);

    const appointment0 = page.locator('.dx-scheduler-appointment').filter({ hasText: 'appt-0' });
    await expect(appointment0).toBeVisible();
  });

  test('it should not call additional DataSource loads after repaint', async ({ page }) => {
    await page.evaluate(() => {
      (window as any).testOptions = { loadCount: 0 };
      (window as any).widget = ($('#container') as any)
        .dxScheduler({
          dataSource: {
            store: new (window as any).DevExpress.data.ArrayStore({
              data: [],
              onLoaded: () => { (window as any).testOptions.loadCount! += 1; },
            }),
          },
        }).dxScheduler('instance');
    });

    await page.evaluate(() => { (window as any).widget.repaint(); });
    await page.evaluate(() => { (window as any).widget.repaint(); });
    await page.evaluate(() => { (window as any).widget.repaint(); });

    await page.evaluate(() => {
      const store = (window as any).widget.getDataSource().store();
      store.push([{ type: 'update', key: 0, data: {} }]);
    });
    await page.waitForTimeout(200);

    const loadCount = await page.evaluate(() => (window as any).testOptions.loadCount);
    expect(loadCount).toBe(2);
  });
});
