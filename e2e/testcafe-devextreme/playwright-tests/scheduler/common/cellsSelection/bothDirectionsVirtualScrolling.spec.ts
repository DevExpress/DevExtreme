import { test, expect } from '@playwright/test';
import { createWidget, getContainerUrl, setupTestPage } from '../../../../playwright-helpers';

const containerUrl = getContainerUrl(__dirname, '../../../../tests/container.html');

const SELECTED_CELL_CLASS = 'dx-state-focused';

const createSchedulerWidget = async (page: any, options = {}) => {
  await createWidget(page, 'dxScheduler', {
    dataSource: [],
    views: ['week'],
    currentView: 'week',
    currentDate: new Date(2020, 8, 20),
    cellDuration: 60,
    height: 300,
    width: 400,
    scrolling: { mode: 'virtual' },
    resources: [{
      fieldExpr: 'resourceId0',
      dataSource: [{ id: 0 }, { id: 1 }],
    }],
    ...options,
  });
};

const scrollTo = async (page: any, x: number, y: number) => {
  await page.evaluate(({ scrollX, scrollY }: { scrollX: number; scrollY: number }) => {
    const instance = ($('#container') as any).dxScheduler('instance');
    const scrollable = instance.getWorkSpaceScrollable();
    scrollable.scrollTo({ y: scrollY, x: scrollX });
  }, { scrollX: x, scrollY: y });
  await page.waitForTimeout(300);
};

const baseConfig = {
  scrolling: { mode: 'virtual', orientation: 'both' },
  views: [{ type: 'week', intervalCount: 3 }],
  currentView: 'week',
};

test.describe('Scheduler: Cells Selection in Both Directions Virtual Scrolling', () => {
  test.beforeEach(async ({ page }) => {
    await setupTestPage(page, containerUrl);
  });

  test('Selected cells shouldn\'t disappear on scroll', async ({ page }) => {
    await createSchedulerWidget(page, { ...baseConfig });

    const firstCell = page.locator('.dx-scheduler-date-table-row').nth(0).locator('.dx-scheduler-date-table-cell').nth(0);
    const secondCell = page.locator('.dx-scheduler-date-table-row').nth(0).locator('.dx-scheduler-date-table-cell').nth(1);

    await firstCell.dragTo(secondCell);

    let selectedCount = await page.locator(`.dx-scheduler-date-table-cell.${SELECTED_CELL_CLASS}`).count();
    expect(selectedCount).toBeGreaterThan(0);

    await scrollTo(page, 1000, 0);
    selectedCount = await page.locator(`.dx-scheduler-date-table-cell.${SELECTED_CELL_CLASS}`).count();
    expect(selectedCount).toBe(0);

    await scrollTo(page, 0, 0);
    selectedCount = await page.locator(`.dx-scheduler-date-table-cell.${SELECTED_CELL_CLASS}`).count();
    expect(selectedCount).toBeGreaterThan(0);
  });

  test('Selection should work in month view', async ({ page }) => {
    await createSchedulerWidget(page, {
      ...baseConfig,
      views: [{ type: 'month', groupOrientation: 'horizontal' }],
      currentView: 'month',
      groups: ['resourceId0'],
      resources: [{
        fieldExpr: 'resourceId0',
        dataSource: [{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }],
      }],
    });

    const firstCell = page.locator('.dx-scheduler-date-table-row').nth(0).locator('.dx-scheduler-date-table-cell').nth(0);
    const secondCell = page.locator('.dx-scheduler-date-table-row').nth(0).locator('.dx-scheduler-date-table-cell').nth(1);

    await firstCell.dragTo(secondCell);

    let selectedCount = await page.locator(`.dx-scheduler-date-table-cell.${SELECTED_CELL_CLASS}`).count();
    expect(selectedCount).toBeGreaterThan(0);

    await scrollTo(page, 1000, 0);
    selectedCount = await page.locator(`.dx-scheduler-date-table-cell.${SELECTED_CELL_CLASS}`).count();
    expect(selectedCount).toBe(0);

    await scrollTo(page, 0, 0);
    selectedCount = await page.locator(`.dx-scheduler-date-table-cell.${SELECTED_CELL_CLASS}`).count();
    expect(selectedCount).toBeGreaterThan(0);
  });
});
