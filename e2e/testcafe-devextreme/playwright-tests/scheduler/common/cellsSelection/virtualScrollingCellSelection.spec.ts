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

test.describe('Scheduler: Cells Selection in Virtual Scrolling', () => {
  test.beforeEach(async ({ page }) => {
    await setupTestPage(page, containerUrl);
  });

  [true, false].forEach((showAllDayPanel) => {
    test(`Selected cells shouldn't disapppear on scroll when showAllDayPanel is equal to ${showAllDayPanel}`, async ({ page }) => {
      await createSchedulerWidget(page, { showAllDayPanel });

      const firstCell = page.locator('.dx-scheduler-date-table-row').nth(0).locator('.dx-scheduler-date-table-cell').nth(0);
      const secondCell = page.locator('.dx-scheduler-date-table-row').nth(0).locator('.dx-scheduler-date-table-cell').nth(1);

      await firstCell.dragTo(secondCell);

      let selectedCount = await page.locator(`.dx-scheduler-date-table-cell.${SELECTED_CELL_CLASS}`).count();
      expect(selectedCount).toBeGreaterThan(0);

      await scrollTo(page, 0, 500);

      await scrollTo(page, 0, 0);

      selectedCount = await page.locator(`.dx-scheduler-date-table-cell.${SELECTED_CELL_CLASS}`).count();
      expect(selectedCount).toBeGreaterThan(0);
    });
  });

  [true, false].forEach((showAllDayPanel) => {
    test(`Selected cells shouldn't disapppear on scroll when showAllDayPanel is equal to ${showAllDayPanel} and horizontal grouping is used`, async ({ page }) => {
      await createSchedulerWidget(page, {
        showAllDayPanel,
        groups: ['resourceId0'],
      });

      const firstCell = page.locator('.dx-scheduler-date-table-row').nth(0).locator('.dx-scheduler-date-table-cell').nth(0);
      const secondCell = page.locator('.dx-scheduler-date-table-row').nth(0).locator('.dx-scheduler-date-table-cell').nth(1);

      await firstCell.dragTo(secondCell);

      let selectedCount = await page.locator(`.dx-scheduler-date-table-cell.${SELECTED_CELL_CLASS}`).count();
      expect(selectedCount).toBeGreaterThan(0);

      await scrollTo(page, 0, 500);
      selectedCount = await page.locator(`.dx-scheduler-date-table-cell.${SELECTED_CELL_CLASS}`).count();

      await scrollTo(page, 0, 0);
      selectedCount = await page.locator(`.dx-scheduler-date-table-cell.${SELECTED_CELL_CLASS}`).count();
      expect(selectedCount).toBeGreaterThan(0);
    });

    test(`Selected cells shouldn't disapppear on scroll when showAllDayPanel is equal to ${showAllDayPanel} and appointments are grouped by date`, async ({ page }) => {
      await createSchedulerWidget(page, {
        showAllDayPanel,
        groups: ['resourceId0'],
        views: [{ type: 'week', groupOrientation: 'horizontal', groupByDate: true }],
      });

      const firstCell = page.locator('.dx-scheduler-date-table-row').nth(0).locator('.dx-scheduler-date-table-cell').nth(0);
      const secondCell = page.locator('.dx-scheduler-date-table-row').nth(0).locator('.dx-scheduler-date-table-cell').nth(2);

      await firstCell.dragTo(secondCell);

      let selectedCount = await page.locator(`.dx-scheduler-date-table-cell.${SELECTED_CELL_CLASS}`).count();
      expect(selectedCount).toBeGreaterThan(0);

      await scrollTo(page, 0, 500);
      selectedCount = await page.locator(`.dx-scheduler-date-table-cell.${SELECTED_CELL_CLASS}`).count();

      await scrollTo(page, 0, 0);
      selectedCount = await page.locator(`.dx-scheduler-date-table-cell.${SELECTED_CELL_CLASS}`).count();
      expect(selectedCount).toBeGreaterThan(0);
    });

    test(`Selected cells shouldn't disapppear on scroll when showAllDayPanel is equal to ${showAllDayPanel} and appointments are grouped vertically`, async ({ page }) => {
      await createSchedulerWidget(page, {
        showAllDayPanel,
        groups: ['resourceId0'],
        views: [{ type: 'week', groupOrientation: 'vertical' }],
      });

      const firstCell = page.locator('.dx-scheduler-date-table-row').nth(0).locator('.dx-scheduler-date-table-cell').nth(0);
      const secondCell = page.locator('.dx-scheduler-date-table-row').nth(0).locator('.dx-scheduler-date-table-cell').nth(1);

      await firstCell.dragTo(secondCell);

      let selectedCount = await page.locator(`.dx-scheduler-date-table-cell.${SELECTED_CELL_CLASS}`).count();
      expect(selectedCount).toBeGreaterThan(0);

      await scrollTo(page, 0, 1100);
      selectedCount = await page.locator(`.dx-scheduler-date-table-cell.${SELECTED_CELL_CLASS}`).count();

      await scrollTo(page, 0, 0);
      selectedCount = await page.locator(`.dx-scheduler-date-table-cell.${SELECTED_CELL_CLASS}`).count();
      expect(selectedCount).toBeGreaterThan(0);
    });
  });

  test('Selection should work correctly while scrolling', async ({ page }) => {
    await createSchedulerWidget(page, { groups: ['resourceId0'] });

    const firstCell = page.locator('.dx-scheduler-date-table-row').nth(0).locator('.dx-scheduler-date-table-cell').nth(0);
    const secondCell = page.locator('.dx-scheduler-date-table-row').nth(0).locator('.dx-scheduler-date-table-cell').nth(1);

    await firstCell.dragTo(secondCell);

    let selectedCount = await page.locator(`.dx-scheduler-date-table-cell.${SELECTED_CELL_CLASS}`).count();
    expect(selectedCount).toBeGreaterThan(0);

    await scrollTo(page, 0, 500);
    await scrollTo(page, 0, 0);

    selectedCount = await page.locator(`.dx-scheduler-date-table-cell.${SELECTED_CELL_CLASS}`).count();
    expect(selectedCount).toBeGreaterThan(0);
  });

  test('Selection should work correctly while scrolling when appointments are grouped vertically', async ({ page }) => {
    await createSchedulerWidget(page, {
      groups: ['resourceId0'],
      views: [{ type: 'week', groupOrientation: 'vertical' }],
    });

    const firstCell = page.locator('.dx-scheduler-date-table-row').nth(0).locator('.dx-scheduler-date-table-cell').nth(0);
    const secondCell = page.locator('.dx-scheduler-date-table-row').nth(0).locator('.dx-scheduler-date-table-cell').nth(1);

    await firstCell.dragTo(secondCell);

    let selectedCount = await page.locator(`.dx-scheduler-date-table-cell.${SELECTED_CELL_CLASS}`).count();
    expect(selectedCount).toBeGreaterThan(0);

    await scrollTo(page, 0, 500);
    await scrollTo(page, 0, 0);

    selectedCount = await page.locator(`.dx-scheduler-date-table-cell.${SELECTED_CELL_CLASS}`).count();
    expect(selectedCount).toBeGreaterThan(0);
  });

  test('Selection should work in timeline views', async ({ page }) => {
    await createSchedulerWidget(page, {
      views: ['timelineDay', 'timelineWeek', 'timelineMonth'],
      currentView: 'timelineDay',
    });

    const firstCell = page.locator('.dx-scheduler-date-table-row').nth(0).locator('.dx-scheduler-date-table-cell').nth(0);
    const secondCell = page.locator('.dx-scheduler-date-table-row').nth(0).locator('.dx-scheduler-date-table-cell').nth(1);

    await firstCell.dragTo(secondCell);

    const selectedCount = await page.locator(`.dx-scheduler-date-table-cell.${SELECTED_CELL_CLASS}`).count();
    expect(selectedCount).toBeGreaterThan(0);
  });

  test('Selection should work in month view', async ({ page }) => {
    await createSchedulerWidget(page, {
      views: [{ type: 'month', intervalCount: 30 }],
      currentView: 'month',
    });

    const firstCell = page.locator('.dx-scheduler-date-table-row').nth(0).locator('.dx-scheduler-date-table-cell').nth(0);
    const secondCell = page.locator('.dx-scheduler-date-table-row').nth(0).locator('.dx-scheduler-date-table-cell').nth(1);

    await firstCell.dragTo(secondCell);

    let selectedCount = await page.locator(`.dx-scheduler-date-table-cell.${SELECTED_CELL_CLASS}`).count();
    expect(selectedCount).toBeGreaterThan(0);

    await scrollTo(page, 0, 1500);

    selectedCount = await page.locator(`.dx-scheduler-date-table-cell.${SELECTED_CELL_CLASS}`).count();
    expect(selectedCount).toBe(0);

    await scrollTo(page, 0, 0);

    selectedCount = await page.locator(`.dx-scheduler-date-table-cell.${SELECTED_CELL_CLASS}`).count();
    expect(selectedCount).toBeGreaterThan(0);
  });
});
