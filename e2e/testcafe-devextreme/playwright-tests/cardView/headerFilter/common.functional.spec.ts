import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('HeaderFilter.Common.Functional', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('popup should open on header filter icon click', async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      dataSource: [
        { A: 'A_0', B: 'B_0', C: 'C_0' },
        { A: 'A_1', B: 'B_1', C: 'C_1' },
      ],
      columns: ['A', 'B', 'C'],
      headerFilter: { visible: true },
      height: 600,
    });

    await page.locator('.dx-header-filter-icon').first().click();

    const popup = page.locator('.dx-popup-wrapper.dx-header-filter-menu');
    await expect(popup).toBeVisible();
  });

  test('should support custom translations', async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      dataSource: [
        { A: 'A_0', B: 'B_0', C: 'C_0' },
        { A: 'A_1', B: 'B_1', C: 'C_1' },
        { A: 'A_2', B: 'B_2', C: 'C_2' },
        { A: 'A_3', B: 'B_3', C: 'C_3' },
        { A: 'A_4', B: 'B_4', C: 'C_4' },
      ],
      columns: [
        { dataField: 'A', calculateFieldValue: () => undefined },
        'B',
        'C',
      ],
      headerFilter: {
        visible: true,
        texts: { ok: 'TEST_OK', cancel: 'TEST_CANCEL', emptyValue: 'TEST_EMPTY' },
      },
      height: 600,
    });

    await page.locator('.dx-header-filter-icon').first().click();
    await page.waitForSelector('.dx-popup-wrapper.dx-header-filter-menu');

    const popup = page.locator('.dx-popup-wrapper.dx-header-filter-menu');
    const buttons = popup.locator('.dx-button');
    await expect(buttons.nth(0)).toContainText('TEST_OK');
    await expect(buttons.nth(1)).toContainText('TEST_CANCEL');

    const firstItem = page.locator('.dx-list-item').first();
    await expect(firstItem).toContainText('TEST_EMPTY');
  });

  test('Should apply filter to values in another column', async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      dataSource: [
        { id: 1, title: 'Mr.', name: 'John', lastName: 'Heart' },
        { id: 2, title: 'Mrs.', name: 'Olivia', lastName: 'Peyton' },
        { id: 3, title: 'Mr.', name: 'Robert', lastName: 'Reagan' },
        { id: 4, title: 'Mr.', name: 'Greta', lastName: 'Sims' },
      ],
      columns: [{ dataField: 'id' }, { dataField: 'title' }, { dataField: 'name' }, { dataField: 'lastName' }],
      headerFilter: { visible: true },
    });

    const filterIcons = page.locator('.dx-header-filter-icon');
    await filterIcons.nth(0).click();
    await page.waitForSelector('.dx-popup-wrapper.dx-header-filter-menu');
    await expect(page.locator('.dx-list-item')).toHaveCount(4);
    await page.locator('.dx-popup-wrapper.dx-header-filter-menu .dx-button-cancel').click();

    await filterIcons.nth(1).click();
    await page.waitForSelector('.dx-popup-wrapper.dx-header-filter-menu');
    await page.locator('.dx-list-item').first().click();
    await page.locator('.dx-popup-wrapper.dx-header-filter-menu .dx-button-ok').click();
    await expect(page.locator('.dx-cardview-card')).toHaveCount(3);

    await filterIcons.nth(0).click();
    await page.waitForSelector('.dx-popup-wrapper.dx-header-filter-menu');
    await expect(page.locator('.dx-list-item')).toHaveCount(3);
  });

  test('Filter values should not filter themselves', async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      dataSource: [
        { id: 1, title: 'Mr.', name: 'John', lastName: 'Heart' },
        { id: 2, title: 'Mrs.', name: 'Olivia', lastName: 'Peyton' },
        { id: 3, title: 'Mr.', name: 'Robert', lastName: 'Reagan' },
        { id: 4, title: 'Mr.', name: 'Greta', lastName: 'Sims' },
      ],
      columns: [{ dataField: 'id' }, { dataField: 'title' }, { dataField: 'name' }, { dataField: 'lastName' }],
      headerFilter: { visible: true },
    });

    const filterIcons = page.locator('.dx-header-filter-icon');
    await filterIcons.nth(0).click();
    await page.waitForSelector('.dx-popup-wrapper.dx-header-filter-menu');
    await expect(page.locator('.dx-list-item')).toHaveCount(4);
    await page.locator('.dx-popup-wrapper.dx-header-filter-menu .dx-button-cancel').click();

    await filterIcons.nth(1).click();
    await page.waitForSelector('.dx-popup-wrapper.dx-header-filter-menu');
    await page.locator('.dx-list-item').first().click();
    await page.locator('.dx-popup-wrapper.dx-header-filter-menu .dx-button-ok').click();
    await expect(page.locator('.dx-cardview-card')).toHaveCount(3);

    await filterIcons.nth(0).click();
    await page.waitForSelector('.dx-popup-wrapper.dx-header-filter-menu');
    await expect(page.locator('.dx-list-item')).toHaveCount(3);
    await page.locator('.dx-list-item').first().click();
    await page.locator('.dx-popup-wrapper.dx-header-filter-menu .dx-button-ok').click();
    await expect(page.locator('.dx-cardview-card')).toHaveCount(1);

    await filterIcons.nth(0).click();
    await page.waitForSelector('.dx-popup-wrapper.dx-header-filter-menu');
    await expect(page.locator('.dx-list-item')).toHaveCount(3);
  });

  test('Filtering should work with computed column', async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      dataSource: [{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }],
      keyExpr: 'id',
      headerFilter: { visible: true },
      columns: [
        {
          caption: 'Computed',
          allowFiltering: true,
          calculateFieldValue: ({ id }) => `str_${id}`,
        },
      ],
    });

    await page.locator('.dx-header-filter-icon').first().click();
    await page.waitForSelector('.dx-popup-wrapper.dx-header-filter-menu');
    await expect(page.locator('.dx-list-item')).toHaveCount(4);

    await page.locator('.dx-list-item').first().click();
    await page.locator('.dx-popup-wrapper.dx-header-filter-menu .dx-button-ok').click();
    await expect(page.locator('.dx-cardview-card')).toHaveCount(1);

    await page.locator('.dx-header-filter-icon').first().click();
    await page.waitForSelector('.dx-popup-wrapper.dx-header-filter-menu');
    await page.locator('.dx-list-item').nth(2).click();
    await page.locator('.dx-popup-wrapper.dx-header-filter-menu .dx-button-ok').click();
    await expect(page.locator('.dx-cardview-card')).toHaveCount(2);
  });

  test('The item\'s selection state should be correct if a custom data source is specified', async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      dataSource: [
        { id: 1, title: 'Mr.', name: 'John', lastName: 'Heart' },
        { id: 2, title: 'Mrs.', name: 'Olivia', lastName: 'Peyton' },
        { id: 3, title: 'Mr.', name: 'Robert', lastName: 'Reagan' },
        { id: 4, title: 'Mr.', name: 'Greta', lastName: 'Sims' },
      ],
      columns: [
        {
          dataField: 'id',
          filterValues: [1],
          headerFilter: {
            dataSource: [{ text: 'Test1', value: 1 }, { text: 'Test2', value: 2 }],
          },
        },
        { dataField: 'title' },
        { dataField: 'name' },
        { dataField: 'lastName' },
      ],
      headerFilter: { visible: true },
    });

    await page.locator('.dx-header-filter-icon').first().click();
    await page.waitForSelector('.dx-popup-wrapper.dx-header-filter-menu');

    const items = page.locator('.dx-list-item');
    await expect(items).toHaveCount(2);
    await expect(items.first()).toContainText('Test1');

    const firstItemCheckbox = items.first().locator('.dx-checkbox');
    const isChecked = await firstItemCheckbox.evaluate(
      el => el.classList.contains('dx-checkbox-checked')
    );
    expect(isChecked).toBe(true);
  });

  test('Filtering should work when a custom data source is specified as an array of filter expressions', async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      dataSource: [
        { id: 1, title: 'Mr.', name: 'John', lastName: 'Heart' },
        { id: 2, title: 'Mrs.', name: 'Olivia', lastName: 'Peyton' },
        { id: 3, title: 'Mr.', name: 'Robert', lastName: 'Reagan' },
        { id: 4, title: 'Mr.', name: 'Greta', lastName: 'Sims' },
      ],
      remoteOperations: true,
      columns: [
        {
          dataField: 'id',
          headerFilter: {
            dataSource: [
              { value: ['id', '=', 1], text: '1' },
              { value: ['id', '=', 2], text: '2' },
            ],
          },
        },
        { dataField: 'title' },
        { dataField: 'name' },
        { dataField: 'lastName' },
      ],
      headerFilter: { visible: true },
    });

    await page.locator('.dx-header-filter-icon').first().click();
    await page.waitForSelector('.dx-popup-wrapper.dx-header-filter-menu');
    await expect(page.locator('.dx-list-item')).toHaveCount(2);

    await page.locator('.dx-list-item').first().click();
    await page.locator('.dx-popup-wrapper.dx-header-filter-menu .dx-button-ok').click();
    await expect(page.locator('.dx-cardview-card')).toHaveCount(1);

    const combinedFilter = await page.evaluate(() => {
      return ($('#container') as any).dxCardView('instance').getCombinedFilter();
    });
    expect(combinedFilter).toEqual(['id', '=', 1]);
  });
});
