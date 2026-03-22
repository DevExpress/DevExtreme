import { test, expect } from '@playwright/test';
import { createWidget, getContainerUrl, setupTestPage } from '../../../../playwright-helpers';

const containerUrl = getContainerUrl(__dirname, '../../../../tests/container.html');

test.describe('Scheduler: Virtual scrolling', () => {
  test.beforeEach(async ({ page }) => {
    await setupTestPage(page, containerUrl);
  });

  test('it should correctly render virtual table if scheduler sizes are set in % (T1091980)', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      width: '100%',
      height: '100%',
      dataSource: [],
      views: [{
        type: 'week',
        intervalCount: 10,
      }],
      currentView: 'week',
      currentDate: new Date(2021, 3, 5),
      startDayHour: 8,
      endDayHour: 20,
      crossScrollingEnabled: true,
      scrolling: {
        mode: 'virtual',
      },
    });

    const allDayCellCount = await page.locator('.dx-scheduler-all-day-table-cell').count();
    expect(allDayCellCount).toBe(24);

    const dateTableCellCount = await page.locator('.dx-scheduler-date-table-cell').count();
    expect(dateTableCellCount).toBe(576);

    await page.evaluate(() => {
      const instance = ($('#container') as any).dxScheduler('instance');
      instance.scrollTo(new Date(2021, 5, 12, 19));
    });

    const allDayCellCountAfter = await page.locator('.dx-scheduler-all-day-table-cell').count();
    expect(allDayCellCountAfter).toBe(24);

    const dateTableCellCountAfter = await page.locator('.dx-scheduler-date-table-cell').count();
    expect(dateTableCellCountAfter).toBe(576);
  });
});
