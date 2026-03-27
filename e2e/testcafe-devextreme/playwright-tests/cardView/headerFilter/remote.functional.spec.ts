import { test, expect } from '@playwright/test';
import { createWidget } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

const remoteData = new Array(10).fill(null).map((_, idx) => ({
  id: idx, A: `A_${idx}`, B: `B_${idx}`, C: `C_${idx}`,
}));

const remoteDataGroupedByA = new Array(10).fill(null).map((_, idx) => ({
  key: `A_${idx}`,
  items: null,
}));

async function setupRemoteMock(page: import('@playwright/test').Page) {
  await page.route('**/api/data**', async (route) => {
    const url = route.request().url();
    if (url.includes('group=')) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ data: remoteDataGroupedByA }),
        headers: { 'access-control-allow-origin': '*' },
      });
    } else {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ data: remoteData }),
        headers: { 'access-control-allow-origin': '*' },
      });
    }
  });
}

async function setupRemoteIdGroupMock(page: import('@playwright/test').Page) {
  await page.route('**/api/data**', async (route) => {
    const url = route.request().url();
    if (url.includes('group=')) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ data: [{ key: 0, items: null }, { key: 5, items: null }] }),
        headers: { 'access-control-allow-origin': '*' },
      });
    } else {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ data: remoteData }),
        headers: { 'access-control-allow-origin': '*' },
      });
    }
  });
}

const remoteOperationsValues: Array<'auto' | boolean> = ['auto', true, false];

test.describe('HeaderFilter.Remote.Functional', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('remote header filter should load grouped data', async ({ page }) => {
    const groupedData = [
      { key: 'Group A', items: [{ id: 1, name: 'Item 1' }, { id: 2, name: 'Item 2' }] },
      { key: 'Group B', items: [{ id: 3, name: 'Item 3' }] },
    ];

    await page.route('**/api/header-filter**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(groupedData),
      });
    });

    await createWidget(page, 'dxCardView', {
      dataSource: [
        { id: 1, name: 'Item 1', category: 'Group A' },
        { id: 2, name: 'Item 2', category: 'Group A' },
        { id: 3, name: 'Item 3', category: 'Group B' },
      ],
      keyExpr: 'id',
      headerFilter: {
        visible: true,
      },
      columns: [
        { dataField: 'name' },
        {
          dataField: 'category',
          headerFilter: {
            dataSource: {
              load() {
                return groupedData;
              },
            },
          },
        },
      ],
    });

    const headerFilterIcon = page.locator('.dx-header-filter-icon').first();
    await headerFilterIcon.click();

    const headerFilterPopup = page.locator('.dx-popup-wrapper.dx-header-filter-menu');
    await expect(headerFilterPopup).toBeVisible();

    const listItems = headerFilterPopup.locator('.dx-list-item');
    const count = await listItems.count();
    expect(count).toBeGreaterThan(0);
  });

  for (const remoteOperations of remoteOperationsValues) {
    test(`remote operations: ${remoteOperations} -> list should contain loaded items`, async ({ page }) => {
      await setupRemoteMock(page);
      await page.evaluate((ro) => { (window as any).testRemoteOperations = ro; }, remoteOperations);

      await createWidget(page, 'dxCardView', () => ({
        dataSource: {
          store: (window as any).DevExpress.data.AspNet.createStore({
            key: 'id',
            loadUrl: 'https://api/data',
          }),
        },
        columns: ['A', 'B', 'C'],
        remoteOperations: (window as any).testRemoteOperations,
        headerFilter: { visible: true },
        height: 600,
      }));

      const filterIcon = page.locator('.dx-cardview-headers .dx-cardview-header-item').first().locator('.dx-header-filter-icon');
      await filterIcon.click();

      const headerFilterPopup = page.locator('.dx-popup-wrapper.dx-header-filter-menu');
      await expect(headerFilterPopup).toBeVisible();

      const listItems = headerFilterPopup.locator('.dx-list-item');
      await expect(listItems).toHaveCount(remoteData.length);

      for (let idx = 0; idx < remoteData.length; idx++) {
        await expect(listItems.nth(idx)).toContainText(remoteData[idx].A);
      }
    });

    test(`remote operations: ${remoteOperations} -> should support custom dataSource`, async ({ page }) => {
      await setupRemoteMock(page);
      await page.evaluate((ro) => { (window as any).testRemoteOperations = ro; }, remoteOperations);

      await createWidget(page, 'dxCardView', () => ({
        dataSource: {
          store: (window as any).DevExpress.data.AspNet.createStore({
            key: 'id',
            loadUrl: 'https://api/data',
          }),
        },
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
        remoteOperations: (window as any).testRemoteOperations,
        headerFilter: { visible: true },
        height: 600,
      }));

      const filterIcon = page.locator('.dx-cardview-headers .dx-cardview-header-item').first().locator('.dx-header-filter-icon');
      await filterIcon.click();

      const headerFilterPopup = page.locator('.dx-popup-wrapper.dx-header-filter-menu');
      await expect(headerFilterPopup).toBeVisible();

      const listItems = headerFilterPopup.locator('.dx-list-item');
      await expect(listItems).toHaveCount(3);

      for (let idx = 0; idx < 3; idx++) {
        await expect(listItems.nth(idx)).toContainText(`CUSTOM_${idx}`);
      }
    });

    test(`remote operations: ${remoteOperations} -> should update column options with filterType and values (regular selection)`, async ({ page }) => {
      await setupRemoteMock(page);
      await page.evaluate((ro) => { (window as any).testRemoteOperations = ro; }, remoteOperations);

      await createWidget(page, 'dxCardView', () => ({
        dataSource: {
          store: (window as any).DevExpress.data.AspNet.createStore({
            key: 'id',
            loadUrl: 'https://api/data',
          }),
        },
        columns: ['A', 'B', 'C'],
        remoteOperations: (window as any).testRemoteOperations,
        headerFilter: { visible: true },
        height: 600,
      }));

      const filterIcon = page.locator('.dx-cardview-headers .dx-cardview-header-item').first().locator('.dx-header-filter-icon');
      await filterIcon.click();

      const headerFilterPopup = page.locator('.dx-popup-wrapper.dx-header-filter-menu');
      const listItems = headerFilterPopup.locator('.dx-list-item');

      await listItems.nth(0).click();
      await listItems.nth(1).click();
      await headerFilterPopup.locator('.dx-button').first().click();

      const columnOptions = await page.evaluate(() => {
        const instance = ($('#container') as any).dxCardView('instance');
        return {
          filterType: instance.columnOption('A', 'filterType'),
          filterValues: instance.columnOption('A', 'filterValues'),
        };
      });

      expect(columnOptions.filterType).toBeUndefined();
      expect(columnOptions.filterValues).toEqual(['A_0', 'A_1']);
    });

    test(`remote operations: ${remoteOperations} -> should update column options with filterType and values (selectAll case #0)`, async ({ page }) => {
      await setupRemoteMock(page);
      await page.evaluate((ro) => { (window as any).testRemoteOperations = ro; }, remoteOperations);

      await createWidget(page, 'dxCardView', () => ({
        dataSource: {
          store: (window as any).DevExpress.data.AspNet.createStore({
            key: 'id',
            loadUrl: 'https://api/data',
          }),
        },
        columns: ['A', 'B', 'C'],
        remoteOperations: (window as any).testRemoteOperations,
        headerFilter: { visible: true },
        height: 600,
      }));

      const filterIcon = page.locator('.dx-cardview-headers .dx-cardview-header-item').first().locator('.dx-header-filter-icon');
      await filterIcon.click();

      const headerFilterPopup = page.locator('.dx-popup-wrapper.dx-header-filter-menu');
      const selectAllCheckbox = headerFilterPopup.locator('.dx-list-select-all .dx-checkbox');
      await selectAllCheckbox.click();
      await headerFilterPopup.locator('.dx-button').first().click();

      const columnOptions = await page.evaluate(() => {
        const instance = ($('#container') as any).dxCardView('instance');
        return {
          filterType: instance.columnOption('A', 'filterType'),
          filterValues: instance.columnOption('A', 'filterValues'),
        };
      });

      expect(columnOptions.filterType).toBe('exclude');
      expect(columnOptions.filterValues).toBeNull();
    });

    test(`remote operations: ${remoteOperations} -> should update column options with filterType and values (selectAll case #1)`, async ({ page }) => {
      await setupRemoteMock(page);
      await page.evaluate((ro) => { (window as any).testRemoteOperations = ro; }, remoteOperations);

      await createWidget(page, 'dxCardView', () => ({
        dataSource: {
          store: (window as any).DevExpress.data.AspNet.createStore({
            key: 'id',
            loadUrl: 'https://api/data',
          }),
        },
        columns: ['A', 'B', 'C'],
        remoteOperations: (window as any).testRemoteOperations,
        headerFilter: { visible: true },
        height: 600,
      }));

      const filterIcon = page.locator('.dx-cardview-headers .dx-cardview-header-item').first().locator('.dx-header-filter-icon');
      await filterIcon.click();

      const headerFilterPopup = page.locator('.dx-popup-wrapper.dx-header-filter-menu');
      const listItems = headerFilterPopup.locator('.dx-list-item');
      const selectAllCheckbox = headerFilterPopup.locator('.dx-list-select-all .dx-checkbox');

      await selectAllCheckbox.click();
      await listItems.nth(2).click();
      await listItems.nth(3).click();
      await headerFilterPopup.locator('.dx-button').first().click();

      const columnOptions = await page.evaluate(() => {
        const instance = ($('#container') as any).dxCardView('instance');
        return {
          filterType: instance.columnOption('A', 'filterType'),
          filterValues: instance.columnOption('A', 'filterValues'),
        };
      });

      expect(columnOptions.filterType).toBe('exclude');
      expect(columnOptions.filterValues).toEqual(['A_2', 'A_3']);
    });

    test(`remote operations: ${remoteOperations} -> should apply filter from options (type: "include" by default)`, async ({ page }) => {
      await setupRemoteMock(page);
      await page.evaluate((ro) => { (window as any).testRemoteOperations = ro; }, remoteOperations);

      await createWidget(page, 'dxCardView', () => ({
        dataSource: {
          store: (window as any).DevExpress.data.AspNet.createStore({
            key: 'id',
            loadUrl: 'https://api/data',
          }),
        },
        columns: [
          { dataField: 'A', filterValues: ['A_0', 'A_1'] },
          'B',
          'C',
        ],
        remoteOperations: (window as any).testRemoteOperations,
        headerFilter: { visible: true },
        height: 600,
      }));

      const filterIcon = page.locator('.dx-cardview-headers .dx-cardview-header-item').first().locator('.dx-header-filter-icon');
      await filterIcon.click();

      const headerFilterPopup = page.locator('.dx-popup-wrapper.dx-header-filter-menu');
      await expect(headerFilterPopup).toBeVisible();

      const listItems = headerFilterPopup.locator('.dx-list-item');
      const firstItemCheckbox = listItems.nth(0).locator('.dx-checkbox');
      const secondItemCheckbox = listItems.nth(1).locator('.dx-checkbox');
      const thirdItemCheckbox = listItems.nth(2).locator('.dx-checkbox');

      await expect(firstItemCheckbox).toHaveClass(/dx-checkbox-checked/);
      await expect(secondItemCheckbox).toHaveClass(/dx-checkbox-checked/);
      await expect(thirdItemCheckbox).not.toHaveClass(/dx-checkbox-checked/);
    });

    test(`remote operations: ${remoteOperations} -> should apply filter from options (type: "include")`, async ({ page }) => {
      await setupRemoteMock(page);
      await page.evaluate((ro) => { (window as any).testRemoteOperations = ro; }, remoteOperations);

      await createWidget(page, 'dxCardView', () => ({
        dataSource: {
          store: (window as any).DevExpress.data.AspNet.createStore({
            key: 'id',
            loadUrl: 'https://api/data',
          }),
        },
        columns: [
          { dataField: 'A', filterValues: ['A_0', 'A_1'], filterType: 'include' },
          'B',
          'C',
        ],
        remoteOperations: (window as any).testRemoteOperations,
        headerFilter: { visible: true },
        height: 600,
      }));

      const filterIcon = page.locator('.dx-cardview-headers .dx-cardview-header-item').first().locator('.dx-header-filter-icon');
      await filterIcon.click();

      const headerFilterPopup = page.locator('.dx-popup-wrapper.dx-header-filter-menu');
      await expect(headerFilterPopup).toBeVisible();

      const listItems = headerFilterPopup.locator('.dx-list-item');
      const firstItemCheckbox = listItems.nth(0).locator('.dx-checkbox');
      const secondItemCheckbox = listItems.nth(1).locator('.dx-checkbox');
      const thirdItemCheckbox = listItems.nth(2).locator('.dx-checkbox');

      await expect(firstItemCheckbox).toHaveClass(/dx-checkbox-checked/);
      await expect(secondItemCheckbox).toHaveClass(/dx-checkbox-checked/);
      await expect(thirdItemCheckbox).not.toHaveClass(/dx-checkbox-checked/);
    });

    test(`remote operations: ${remoteOperations} -> should apply filter from options (type: "exclude")`, async ({ page }) => {
      await setupRemoteMock(page);
      await page.evaluate((ro) => { (window as any).testRemoteOperations = ro; }, remoteOperations);

      await createWidget(page, 'dxCardView', () => ({
        dataSource: {
          store: (window as any).DevExpress.data.AspNet.createStore({
            key: 'id',
            loadUrl: 'https://api/data',
          }),
        },
        columns: [
          { dataField: 'A', filterValues: ['A_2', 'A_3', 'A_4'], filterType: 'exclude' },
          'B',
          'C',
        ],
        remoteOperations: (window as any).testRemoteOperations,
        headerFilter: { visible: true },
        height: 600,
      }));

      const filterIcon = page.locator('.dx-cardview-headers .dx-cardview-header-item').first().locator('.dx-header-filter-icon');
      await filterIcon.click();

      const headerFilterPopup = page.locator('.dx-popup-wrapper.dx-header-filter-menu');
      await expect(headerFilterPopup).toBeVisible();

      const listItems = headerFilterPopup.locator('.dx-list-item');
      const firstItemCheckbox = listItems.nth(0).locator('.dx-checkbox');
      const secondItemCheckbox = listItems.nth(1).locator('.dx-checkbox');
      const thirdItemCheckbox = listItems.nth(2).locator('.dx-checkbox');

      await expect(firstItemCheckbox).toHaveClass(/dx-checkbox-checked/);
      await expect(secondItemCheckbox).toHaveClass(/dx-checkbox-checked/);
      await expect(thirdItemCheckbox).not.toHaveClass(/dx-checkbox-checked/);
    });

    test(`remote operations: ${remoteOperations} -> should not update column options if popup cancel btn clicked`, async ({ page }) => {
      await setupRemoteMock(page);
      await page.evaluate((ro) => { (window as any).testRemoteOperations = ro; }, remoteOperations);

      await createWidget(page, 'dxCardView', () => ({
        dataSource: {
          store: (window as any).DevExpress.data.AspNet.createStore({
            key: 'id',
            loadUrl: 'https://api/data',
          }),
        },
        columns: [
          { dataField: 'A', filterValues: ['A_4'] },
          'B',
          'C',
        ],
        remoteOperations: (window as any).testRemoteOperations,
        headerFilter: { visible: true },
        height: 600,
      }));

      const filterIcon = page.locator('.dx-cardview-headers .dx-cardview-header-item').first().locator('.dx-header-filter-icon');
      await filterIcon.click();

      const headerFilterPopup = page.locator('.dx-popup-wrapper.dx-header-filter-menu');
      const listItems = headerFilterPopup.locator('.dx-list-item');

      await listItems.nth(0).click();
      await listItems.nth(1).click();
      await headerFilterPopup.locator('.dx-button').nth(1).click();

      const columnOptions = await page.evaluate(() => {
        const instance = ($('#container') as any).dxCardView('instance');
        return {
          filterType: instance.columnOption('A', 'filterType'),
          filterValues: instance.columnOption('A', 'filterValues'),
        };
      });

      expect(columnOptions.filterType).toBeUndefined();
      expect(columnOptions.filterValues).toEqual(['A_4']);
    });

    test(`remote operations: ${remoteOperations} -> should process groupInterval option`, async ({ page }) => {
      await setupRemoteIdGroupMock(page);
      await page.evaluate((ro) => { (window as any).testRemoteOperations = ro; }, remoteOperations);

      await createWidget(page, 'dxCardView', () => ({
        dataSource: {
          store: (window as any).DevExpress.data.AspNet.createStore({
            key: 'id',
            loadUrl: 'https://api/data',
          }),
        },
        columns: [
          {
            dataField: 'id',
            dataType: 'number',
            headerFilter: { groupInterval: 5 },
          },
          'A',
        ],
        remoteOperations: (window as any).testRemoteOperations,
        headerFilter: { visible: true },
        height: 600,
      }));

      const filterIcon = page.locator('.dx-cardview-headers .dx-cardview-header-item').first().locator('.dx-header-filter-icon');
      await filterIcon.click();

      const headerFilterPopup = page.locator('.dx-popup-wrapper.dx-header-filter-menu');
      await expect(headerFilterPopup).toBeVisible();

      const listItems = headerFilterPopup.locator('.dx-list-item');
      await expect(listItems).toHaveCount(2);

      await expect(listItems.nth(0)).toContainText('0 - 5');
      await expect(listItems.nth(1)).toContainText('5 - 10');
    });
  }
});
