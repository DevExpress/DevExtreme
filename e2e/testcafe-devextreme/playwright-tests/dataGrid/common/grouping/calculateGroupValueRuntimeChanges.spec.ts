import { test, expect } from '@playwright/test';
import { createWidget } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

test.describe('Grouping API - calculateGroupValue runtime changes', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });
  test(
    'One group: should expand grouped section after calculateGroupValue update',
    async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [
        { id: 0, A: 0, B: 'B_0' },
        { id: 1, A: 1, B: 'B_1' },
        { id: 2, A: 2, B: 'B_2' },
        { id: 3, A: 3, B: 'B_3' },
      ],
      keyExpr: 'id',
      columns: [
        { dataField: 'A', sortOrder: 'desc' },
        'B',
      ],
      sorting: { mode: 'single' },
    });

          await page.locator('.dx-datagrid').first().isVisible();
      await dataGrid.apiColumnOption('group', 'calculateGroupValue', () => 'ALL');

      expect(await page.locator('.dx-group-row').nth(0).isExpanded);
      await t.notOk();
      expect(await dataGrid.getGroupRowSelector().count);
      await t.eql(1);
      expect(await dataGrid.dataRows.count);
      await t.eql(0);

      await (dataGrid
        .getGroupRow(0).click()
        .getExpandCell());

      expect(await page.locator('.dx-group-row').nth(0).isExpanded);
      await t.ok();
      expect(await dataGrid.getGroupRowSelector().count);
      await t.eql(1);
      expect(await dataGrid.dataRows.count);
      await t.eql(4);
    },
  ).before(async () => createWidget(page, 'dxDataGrid', {
    dataSource: [
      { id: 0, A: 'A_0', group: 'A' },
      { id: 1, A: 'A_1', group: 'A' },
      { id: 2, A: 'A_2', group: 'B' },
      { id: 3, A: 'A_3', group: 'B' },
    ],
    keyExpr: 'id',
    columns: [
      { dataField: 'group', groupIndex: 0 },
      'A',
    ],
    grouping: { autoExpandAll: false },
  }));

  // NOTE: Intersection with "column configuration from first data source item" feature
  // Because one of first item's fields is null and different logic is applied
  test(
    'One group: should expand grouped section after calculateGroupValue update if first record contains null value',
    async ({ page }) => {
          await page.locator('.dx-datagrid').first().isVisible();
      await dataGrid.apiColumnOption('group', 'calculateGroupValue', () => 'ALL');

      expect(await page.locator('.dx-group-row').nth(0).isExpanded);
      await t.notOk();
      expect(await dataGrid.getGroupRowSelector().count);
      await t.eql(1);
      expect(await dataGrid.dataRows.count);
      await t.eql(0);

      await (dataGrid
        .getGroupRow(0).click()
        .getExpandCell());

      expect(await page.locator('.dx-group-row').nth(0).isExpanded);
      await t.ok();
      expect(await dataGrid.getGroupRowSelector().count);
      await t.eql(1);
      expect(await dataGrid.dataRows.count);
      await t.eql(4);
    },
  ).before(async () => createWidget(page, 'dxDataGrid', {
    dataSource: [
      { id: 0, A: 'A_0', group: 'A' },
      { id: 1, A: 'A_1', group: 'A' },
      { id: 2, A: 'A_2', group: 'B' },
      { id: 3, A: 'A_3', group: 'B' },
    ],
    keyExpr: 'id',
    columns: [
      { dataField: 'group', groupIndex: 0 },
      'A',
    ],
    grouping: { autoExpandAll: false },
  }));

  test(
    'Multiple groups: should expand grouped section after calculateGroupValue update',
    async ({ page }) => {
          await page.locator('.dx-datagrid').first().isVisible();
      await dataGrid.apiColumnOption('group', 'calculateGroupValue', () => 'ALL');

      expect(await page.locator('.dx-group-row').nth(0).isExpanded);
      await t.notOk();
      expect(await dataGrid.getGroupRowSelector().count);
      await t.eql(1);
      expect(await dataGrid.dataRows.count);
      await t.eql(0);

      await (dataGrid
        .getGroupRow(0).click()
        .getExpandCell());

      expect(await page.locator('.dx-group-row').nth(0).isExpanded);
      await t.ok();
      expect(await dataGrid.getGroupRowSelector().count);
      await t.eql(5);
      expect(await dataGrid.dataRows.count);
      await t.eql(0);
    },
  ).before(async () => createWidget(page, 'dxDataGrid', {
    dataSource: [
      {
        id: 0, A: 'A_0', B: 'B_0', group: 'A',
      },
      {
        id: 1, A: 'A_1', B: 'B_1', group: 'A',
      },
      {
        id: 2, A: 'A_2', B: 'B_2', group: 'B',
      },
      {
        id: 3, A: 'A_3', B: 'B_3', group: 'B',
      },
    ],
    keyExpr: 'id',
    columns: [
      { dataField: 'group', groupIndex: 0 },
      { dataField: 'A', groupIndex: 1 },
      'B',
    ],
    grouping: { autoExpandAll: false },
  }));

  // NOTE: Intersection with "column configuration from first data source item" feature
  // Because one of first item's fields is null and different logic is applied
  test(
    'Multiple groups: should expand grouped section after calculateGroupValue update if first record contains null value [T1281192]',
    async ({ page }) => {
          await page.locator('.dx-datagrid').first().isVisible();
      await dataGrid.apiColumnOption('group', 'calculateGroupValue', () => 'ALL');

      expect(await page.locator('.dx-group-row').nth(0).isExpanded);
      await t.notOk();
      expect(await dataGrid.getGroupRowSelector().count);
      await t.eql(1);
      expect(await dataGrid.dataRows.count);
      await t.eql(0);

      await (dataGrid
        .getGroupRow(0).click()
        .getExpandCell());

      expect(await page.locator('.dx-group-row').nth(0).isExpanded);
      await t.ok();
      expect(await dataGrid.getGroupRowSelector().count);
      await t.eql(5);
      expect(await dataGrid.dataRows.count);
      await t.eql(0);
    },
  ).before(async () => createWidget(page, 'dxDataGrid', {
    dataSource: [
      {
        id: 0, A: 'A_0', B: null, group: 'A',
      },
      {
        id: 1, A: 'A_1', B: 'B_1', group: 'A',
      },
      {
        id: 2, A: 'A_2', B: 'B_2', group: 'B',
      },
      {
        id: 3, A: 'A_3', B: 'B_3', group: 'B',
      },
    ],
    keyExpr: 'id',
    columns: [
      { dataField: 'group', groupIndex: 0 },
      { dataField: 'A', groupIndex: 1 },
      'B',
    ],
    grouping: { autoExpandAll: false },
  }));

  test('Should not reset sorting parameters after calculateGroupValue update [T1298901]', async ({ page }) => {
      await page.locator('.dx-datagrid').first().isVisible();

    expect(await dataGrid.apiColumnOption('A', 'sortOrder'));
    await t.eql('desc');
    expect(await dataGrid.apiColumnOption('A', 'sortIndex'));
    await t.eql(0);

    await dataGrid.apiColumnOption('A', 'calculateGroupValue', () => 'ALL');

    expect(await dataGrid.apiColumnOption('A', 'sortOrder'));
    await t.eql('desc');
    expect(await dataGrid.apiColumnOption('A', 'sortIndex'));
    await t.eql(0);
  });
});
