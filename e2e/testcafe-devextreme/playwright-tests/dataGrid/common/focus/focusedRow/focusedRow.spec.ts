import { test, expect } from '@playwright/test';
import { createWidget, DataGrid, testScreenshot } from '../../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../../tests/container.html')}`;

test.describe('Focused row', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('onFocusedRowChanged event should fire once after changing focusedRowKey if paging.enabled = false (T755722)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [
        { name: 'Alex', phone: '111111', room: 6 },
        { name: 'Dan', phone: '2222222', room: 5 },
        { name: 'Ben', phone: '333333', room: 4 },
      ],
      keyExpr: 'name',
      focusedRowEnabled: true,
      focusedRowIndex: 1,
      paging: { enabled: false },
      onFocusedRowChanged: () => {
        const global = window as Window & typeof globalThis & { onFocusedRowChangedCounter: number };
        if (!global.onFocusedRowChangedCounter) {
          global.onFocusedRowChangedCounter = 0;
        }
        global.onFocusedRowChangedCounter += 1;
      },
    });

    const counter1 = await page.evaluate(() => (window as any).onFocusedRowChangedCounter);
    expect(counter1).toBe(1);

    await page.evaluate(() => (window as any).widget.option('focusedRowKey', 'Ben'));
    await page.waitForTimeout(100);

    const dataGrid = new DataGrid(page, '#container');
    await expect(dataGrid.getFocusedRow()).toBeVisible();

    const counter2 = await page.evaluate(() => (window as any).onFocusedRowChangedCounter);
    expect(counter2).toBe(2);
  });

  test('Focused row should not fire onFocusedRowChanging, onFocusedRowChanged events on scrolling if scrolling.mode and rowRenderingMode are virtual', async ({ page }) => {
    await page.evaluate(() => {
      const data: Record<string, unknown>[] = [];
      for (let i = 0; i < 200; i += 1) {
        data.push({ id: i, c0: 'c0', c1: `c1_${i % 20}` });
      }

      ($('#container') as any).dxDataGrid({
        height: 300,
        keyExpr: 'id',
        dataSource: data,
        focusedRowEnabled: true,
        focusedRowKey: 1,
        editing: { allowAdding: true, allowUpdating: true, mode: 'form' },
        columns: ['id', 'c0', { dataField: 'c1', groupIndex: 0 }],
        paging: { pageSize: 5 },
        scrolling: { mode: 'virtual', rowRenderingMode: 'virtual' },
        onFocusedRowChanging: () => {
          const g = window as any;
          g.focusedRowChanging_Counter = (g.focusedRowChanging_Counter || 0) + 1;
        },
        onFocusedRowChanged: () => {
          const g = window as any;
          g.focusedRowChanged_Counter = (g.focusedRowChanged_Counter || 0) + 1;
        },
      });
    });

    await page.waitForTimeout(300);

    const dataGrid = new DataGrid(page, '#container');
    await expect(dataGrid.getFocusedRow()).toBeVisible();

    await dataGrid.scrollTo({ y: 2000 });
    await page.waitForTimeout(500);

    const changingCounterAfterScroll = await page.evaluate(() => (window as any).focusedRowChanging_Counter);
    const changedCounterAfterScroll = await page.evaluate(() => (window as any).focusedRowChanged_Counter);

    expect(changingCounterAfterScroll).toBeUndefined();
    expect(changedCounterAfterScroll).toBe(1);

    await dataGrid.scrollTo({ y: 0 });
    await page.waitForTimeout(500);

    const changingCounterFinal = await page.evaluate(() => (window as any).focusedRowChanging_Counter);
    const changedCounterFinal = await page.evaluate(() => (window as any).focusedRowChanged_Counter);

    expect(changingCounterFinal).toBeUndefined();
    expect(changedCounterFinal).toBe(1);
  });

  test('It is possible to focus row that was added via push method if previously row with same index was focused (T1202646)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: {
        store: { type: 'array', data: [{ value: 1 }] },
        reshapeOnPush: true,
      },
      keyExpr: 'value',
      repaintChangesOnly: true,
      focusedRowEnabled: true,
      columns: [{ dataField: 'value', sortOrder: 'desc' }],
    });

    const dataGrid = new DataGrid(page, '#container');
    await dataGrid.getDataRow(0).element.click();

    const isFocused1 = await dataGrid.getFocusedRow().isVisible();
    expect(isFocused1).toBeTruthy();

    await page.evaluate(() => {
      const grid = ($('#container') as any).dxDataGrid('instance');
      grid.getDataSource().store().push([{ type: 'insert', data: { value: 2 } }]);
    });

    await page.waitForTimeout(100);
    await expect(dataGrid.getDataRow(0).element).toContainText('2');

    await dataGrid.getDataRow(0).element.click();
    await expect(dataGrid.getFocusedRow()).toBeVisible();
  });

  [null, undefined, -1, 'test'].forEach((groupValue) => {
    test(`Group should expand when focusedRowKey is set - group: ${groupValue}`, async ({ page }) => {
      await createWidget(page, 'dxDataGrid', {
        dataSource: [
          { id: 1, group: groupValue, name: 'Item 1' },
          { id: 2, group: groupValue, name: 'Item 2' },
          { id: 3, group: 'A', name: 'Item 3' },
          { id: 4, group: 'A', name: 'Item 4' },
        ],
        keyExpr: 'id',
        grouping: { autoExpandAll: false },
        columns: [
          { dataField: 'id' },
          { dataField: 'group', groupIndex: 0 },
          { dataField: 'name' },
        ],
        height: 400,
        focusedRowEnabled: true,
      });

      const dataGrid = new DataGrid(page, '#container');
      await dataGrid.option('focusedRowKey', 1);
      await page.waitForTimeout(200);

      await testScreenshot(page, `focused-row_under_group=${groupValue}.png`, { element: page.locator('#container') });
    });
  });

  test('Group should expand when focusedRowKey is set and data items have \'items\' property', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [
        { id: 1, group: 'A', name: 'Item 1', items: 1 },
        { id: 2, group: 'A', name: 'Item 2', items: 2 },
      ],
      keyExpr: 'id',
      grouping: { autoExpandAll: false },
      columns: [
        { dataField: 'id' },
        { dataField: 'group', groupIndex: 0 },
        { dataField: 'name' },
        { dataField: 'items' },
      ],
      height: 400,
      focusedRowEnabled: true,
    });

    const dataGrid = new DataGrid(page, '#container');
    await dataGrid.option('focusedRowKey', 1);
    await page.waitForTimeout(200);

    await testScreenshot(page, 'focused-row_under_group_when_data-items_have_items-property.png', { element: page.locator('#container') });
  });
});
