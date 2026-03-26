import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('HeaderFilter.Local.Functional', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('should filter data after selecting item', async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      dataSource: [
        { A: 'A_0', B: 'B_0' },
        { A: 'A_1', B: 'B_1' },
        { A: 'A_2', B: 'B_2' },
      ],
      columns: ['A', 'B'],
      headerFilter: { visible: true },
      height: 600,
    });

    await page.locator('.dx-header-filter-icon').first().click();
    await page.waitForSelector('.dx-popup-wrapper.dx-header-filter-menu');

    const listItems = page.locator('.dx-list-item');
    await expect(listItems).toHaveCount(3);
  });

  test('list should contain all column values', async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      columns: ['A', 'B', 'C'],
      dataSource: [
        { A: 'A_0', B: 'B_0', C: 'C_0' },
        { A: 'A_1', B: 'B_1', C: 'C_1' },
        { A: 'A_2', B: 'B_2', C: 'C_2' },
        { A: 'A_3', B: 'B_3', C: 'C_3' },
        { A: 'A_4', B: 'B_4', C: 'C_4' },
      ],
      headerFilter: { visible: true },
      height: 600,
    });

    await page.locator('.dx-header-filter-icon').first().click();
    await page.waitForSelector('.dx-popup-wrapper.dx-header-filter-menu');

    const items = page.locator('.dx-list-item');
    await expect(items).toHaveCount(5);

    for (let idx = 0; idx < 5; idx++) {
      await expect(items.nth(idx)).toContainText(`A_${idx}`);
    }
  });

  test('list should contain all column values from all pages', async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      columns: ['A', 'B', 'C'],
      dataSource: [
        { A: 'A_0', B: 'B_0', C: 'C_0' },
        { A: 'A_1', B: 'B_1', C: 'C_1' },
        { A: 'A_2', B: 'B_2', C: 'C_2' },
        { A: 'A_3', B: 'B_3', C: 'C_3' },
        { A: 'A_4', B: 'B_4', C: 'C_4' },
      ],
      headerFilter: { visible: true },
      paging: { pageSize: 1, pageIndex: 0 },
      height: 600,
    });

    await page.locator('.dx-header-filter-icon').first().click();
    await page.waitForSelector('.dx-popup-wrapper.dx-header-filter-menu');

    const items = page.locator('.dx-list-item');
    await expect(items).toHaveCount(5);

    for (let idx = 0; idx < 5; idx++) {
      await expect(items.nth(idx)).toContainText(`A_${idx}`);
    }
  });

  test('list should contain all values from computed column', async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      dataSource: [
        { A: 'A_0', B: 'B_0', C: 'C_0' },
        { A: 'A_1', B: 'B_1', C: 'C_1' },
        { A: 'A_2', B: 'B_2', C: 'C_2' },
        { A: 'A_3', B: 'B_3', C: 'C_3' },
        { A: 'A_4', B: 'B_4', C: 'C_4' },
      ],
      columns: [
        {
          caption: 'Computed',
          allowFiltering: true,
          calculateFieldValue: (data) => `${data.A}_${data.B}`,
        },
      ],
      headerFilter: { visible: true },
      height: 600,
    });

    await page.locator('.dx-header-filter-icon').first().click();
    await page.waitForSelector('.dx-popup-wrapper.dx-header-filter-menu');

    const items = page.locator('.dx-list-item');
    await expect(items).toHaveCount(5);

    for (let idx = 0; idx < 3; idx++) {
      await expect(items.nth(idx)).toContainText(`A_${idx}_B_${idx}`);
    }
  });

  test('should support custom dataSource', async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      dataSource: [
        { A: 'A_0', B: 'B_0', C: 'C_0' },
        { A: 'A_1', B: 'B_1', C: 'C_1' },
        { A: 'A_2', B: 'B_2', C: 'C_2' },
        { A: 'A_3', B: 'B_3', C: 'C_3' },
        { A: 'A_4', B: 'B_4', C: 'C_4' },
      ],
      columns: [
        {
          dataField: 'A',
          headerFilter: {
            dataSource: [
              { text: 'CUSTOM_0', value: 0 },
              { text: 'CUSTOM_1', value: 1 },
              { text: 'CUSTOM_2', value: 2 },
            ],
          },
        },
        'B',
        'C',
      ],
      headerFilter: { visible: true },
      height: 600,
    });

    await page.locator('.dx-header-filter-icon').first().click();
    await page.waitForSelector('.dx-popup-wrapper.dx-header-filter-menu');

    const items = page.locator('.dx-list-item');
    await expect(items).toHaveCount(3);

    for (let idx = 0; idx < 3; idx++) {
      await expect(items.nth(idx)).toContainText(`CUSTOM_${idx}`);
    }
  });

  test('should not update column options if popup cancel btn clicked', async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      dataSource: [
        { A: 'A_0', B: 'B_0', C: 'C_0' },
        { A: 'A_1', B: 'B_1', C: 'C_1' },
        { A: 'A_2', B: 'B_2', C: 'C_2' },
        { A: 'A_3', B: 'B_3', C: 'C_3' },
        { A: 'A_4', B: 'B_4', C: 'C_4' },
      ],
      columns: [
        { dataField: 'A', filterValues: ['A_4'] },
        'B',
        'C',
      ],
      headerFilter: { visible: true },
      height: 600,
    });

    await page.locator('.dx-header-filter-icon').first().click();
    await page.waitForSelector('.dx-popup-wrapper.dx-header-filter-menu');

    await page.locator('.dx-list-item').first().click();
    await page.locator('.dx-list-item').nth(1).click();
    await page.locator('.dx-popup-wrapper.dx-header-filter-menu .dx-button-cancel').click();

    const columnOptions = await page.evaluate(() => {
      return ($('#container') as any).dxCardView('instance').columnOption('A', ['filterType', 'filterValues']);
    });
    expect(columnOptions.filterValues).toEqual(['A_4']);
  });
});
