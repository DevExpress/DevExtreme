import { test, expect } from '@playwright/test';
import { createWidget, DataGrid } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

test.describe.skip('DataGrid Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('The column should be grouped when pressing Ctrl + G if grouping.contextMenuEnabled is false', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      width: 550,
      columnWidth: 100,
      grouping: {
        contextMenuEnabled: false,
      },
      groupPanel: {
        visible: true,
      },
      dataSource: [{
        field1: 'test1',
        field2: 'test2',
        field3: 'test3',
        field4: 'test4',
      }],
    });

    const dataGrid = new DataGrid(page);
    const firstVisibleHeader = dataGrid.getHeaderRow().locator('td').nth(0);

    await firstVisibleHeader.click();
    await page.keyboard.press('Control+g');

    const groupPanel = dataGrid.getGroupPanel();
    const groupItems = groupPanel.locator('.dx-group-panel-item');
    await expect(groupItems).toHaveCount(1);
  });

  test('The column should not be grouped when pressing Ctrl + G if keyboardNavigation.enabled is false', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      width: 550,
      columnWidth: 100,
      keyboardNavigation: {
        enabled: false,
      },
      groupPanel: {
        visible: true,
      },
      dataSource: [{
        field1: 'test1',
        field2: 'test2',
        field3: 'test3',
        field4: 'test4',
      }],
    });

    const dataGrid = new DataGrid(page);
    const firstVisibleHeader = dataGrid.getHeaderRow().locator('td').nth(0);

    await firstVisibleHeader.click();
    await page.keyboard.press('Control+g');

    const groupPanel = dataGrid.getGroupPanel();
    const groupItems = groupPanel.locator('.dx-group-panel-item');
    await expect(groupItems).toHaveCount(0);

    await expect(dataGrid.getHeaders().getHeaderCell(0, 0)).toHaveClass(/dx-focused/);
  });

  test('Group column when pressing Ctrl + G if adaptability is enabled', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      width: 550,
      columnWidth: 100,
      allowColumnReordering: true,
      groupPanel: {
        visible: true,
      },
      dataSource: [{
        field1: 'test1',
        field2: 'test2',
        field3: 'test3',
        field4: 'test4',
        field5: 'test5',
        field6: 'test6',
        field7: 'test7',
        field8: 'test8',
      }],
      customizeColumns: (columns: any[]) => {
        columns[0].hidingPriority = 0;
        columns[2].hidingPriority = 1;
        columns[3].hidingPriority = 2;
      },
    });

    const dataGrid = new DataGrid(page);
    const firstVisibleHeader = dataGrid.getHeaders().getHeaderCell(0, 1);

    await firstVisibleHeader.click();
    await page.keyboard.press('Control+g');

    const groupPanel = dataGrid.getGroupPanel();
    const groupItems = groupPanel.locator('.dx-group-panel-item');
    await expect(groupItems).toHaveCount(1);

    await expect(dataGrid.getHeaders().getHeaderCell(0, 4)).toHaveClass(/dx-focused/);
  });

  test('Group column with showWhenGrouped enabled when pressing Ctrl + G if adaptability is enabled', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      width: 550,
      columnWidth: 100,
      allowColumnReordering: true,
      groupPanel: {
        visible: true,
      },
      dataSource: [{
        field1: 'test1',
        field2: 'test2',
        field3: 'test3',
        field4: 'test4',
        field5: 'test5',
        field6: 'test6',
        field7: 'test7',
        field8: 'test8',
      }],
      customizeColumns: (columns: any[]) => {
        columns[1].showWhenGrouped = true;

        columns[0].hidingPriority = 0;
        columns[2].hidingPriority = 1;
        columns[3].hidingPriority = 2;
      },
    });

    const dataGrid = new DataGrid(page);
    const firstVisibleHeader = dataGrid.getHeaders().getHeaderCell(0, 1);

    await firstVisibleHeader.click();
    await page.keyboard.press('Control+g');

    const groupPanel = dataGrid.getGroupPanel();
    const groupItems = groupPanel.locator('.dx-group-panel-item');
    await expect(groupItems).toHaveCount(1);

    await expect(dataGrid.getHeaders().getHeaderCell(0, 2)).toHaveClass(/dx-focused/);
  });

  test('Group first nested column when pressing Ctrl + G', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [{
        field1: 'test1',
        field2: 'test2',
        field3: 'test3',
        field4: 'test4',
        field5: 'test5',
      }],
      grouping: {
        contextMenuEnabled: true,
      },
      groupPanel: {
        visible: true,
      },
      columns: [
        'field1',
        {
          caption: 'Band Column',
          columns: ['field2', 'field3', 'field4'],
        },
        'field5',
      ],
    });

    const dataGrid = new DataGrid(page);
    const nestedFirstHeader = dataGrid.getHeaders().getHeaderCell(1, 0);

    await nestedFirstHeader.click();
    await page.keyboard.press('Control+g');

    const groupPanel = dataGrid.getGroupPanel();
    const groupItems = groupPanel.locator('.dx-group-panel-item');
    await expect(groupItems).toHaveCount(1);

    await expect(dataGrid.getHeaders().getHeaderCell(1, 0)).toHaveClass(/dx-focused/);
  });

  test('Group last nested column when pressing Ctrl + G', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [{
        field1: 'test1',
        field2: 'test2',
        field3: 'test3',
        field4: 'test4',
        field5: 'test5',
      }],
      grouping: {
        contextMenuEnabled: true,
      },
      groupPanel: {
        visible: true,
      },
      columns: [
        'field1',
        {
          caption: 'Band Column',
          columns: ['field2', 'field3', 'field4'],
        },
        'field5',
      ],
    });

    const dataGrid = new DataGrid(page);
    const nestedLastHeader = dataGrid.getHeaders().getHeaderCell(1, 2);

    await nestedLastHeader.click();
    await page.keyboard.press('Control+g');

    const groupPanel = dataGrid.getGroupPanel();
    const groupItems = groupPanel.locator('.dx-group-panel-item');
    await expect(groupItems).toHaveCount(1);

    await expect(dataGrid.getHeaders().getHeaderCell(1, 1)).toHaveClass(/dx-focused/);
  });

  test('Group last nested column when pressing Ctrl + G when there are several band columns', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [{
        field1: 'test1',
        field2: 'test2',
        field3: 'test3',
        field4: 'test4',
        field5: 'test5',
        field6: 'test6',
      }],
      grouping: {
        contextMenuEnabled: true,
      },
      groupPanel: {
        visible: true,
      },
      columns: [
        'field1',
        {
          caption: 'Band Column 1',
          columns: ['field2', 'field3'],
        },
        'field4',
        {
          caption: 'Band Column 2',
          columns: ['field5', 'field6'],
        },
      ],
    });

    const dataGrid = new DataGrid(page);
    const nestedSecondHeader = dataGrid.getHeaders().getHeaderCell(1, 1);

    await nestedSecondHeader.click();
    await page.keyboard.press('Control+g');

    const groupPanel = dataGrid.getGroupPanel();
    const groupItems = groupPanel.locator('.dx-group-panel-item');
    await expect(groupItems).toHaveCount(1);

    await expect(dataGrid.getHeaders().getHeaderCell(1, 0)).toHaveClass(/dx-focused/);
  });

  test('Group single nested column when pressing Ctrl + G', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [{
        field1: 'test1',
        field2: 'test2',
        field3: 'test3',
      }],
      grouping: {
        contextMenuEnabled: true,
      },
      groupPanel: {
        visible: true,
      },
      columns: [
        'field1',
        {
          caption: 'Band Column',
          columns: ['field2'],
        },
        'field3',
      ],
    });

    const dataGrid = new DataGrid(page);
    const nestedLastHeader = dataGrid.getHeaders().getHeaderCell(1, 0);

    await nestedLastHeader.click();
    await page.keyboard.press('Control+g');

    const groupPanel = dataGrid.getGroupPanel();
    const groupItems = groupPanel.locator('.dx-group-panel-item');
    await expect(groupItems).toHaveCount(1);

    await expect(dataGrid.getHeaders().getHeaderCell(0, 2)).toHaveClass(/dx-focused/);
  });

  test('Ungroup column with showWhenGrouped enabled when pressing Ctrl + Shift + G if adaptability is enabled', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      width: 550,
      columnWidth: 100,
      allowColumnReordering: true,
      groupPanel: {
        visible: true,
      },
      dataSource: [{
        field1: 'test1',
        field2: 'test2',
        field3: 'test3',
        field4: 'test4',
        field5: 'test5',
        field6: 'test6',
        field7: 'test7',
        field8: 'test8',
      }],
      customizeColumns: (columns: any[]) => {
        columns[1].showWhenGrouped = true;
        columns[1].groupIndex = 0;

        columns[0].hidingPriority = 0;
        columns[2].hidingPriority = 1;
        columns[3].hidingPriority = 2;
      },
    });

    const dataGrid = new DataGrid(page);
    const firstVisibleHeader = dataGrid.getHeaders().getHeaderCell(0, 2);

    await firstVisibleHeader.click();
    await page.keyboard.press('Control+Shift+g');

    const groupPanel = dataGrid.getGroupPanel();
    const groupItems = groupPanel.locator('.dx-group-panel-item');
    await expect(groupItems).toHaveCount(0);

    await expect(dataGrid.getHeaders().getHeaderCell(0, 1)).toHaveClass(/dx-focused/);
  });

  test('Focus should be restored when ungrouping the column via context menu after leaving the page and returning back', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [{
        field1: 'test1',
        field2: 'test2',
        field3: 'test3',
        field4: 'test4',
      }],
      groupPanel: {
        visible: true,
      },
      columns: [
        {
          dataField: 'field1',
          groupIndex: 1,
        },
        {
          dataField: 'field2',
          groupIndex: 2,
        },
        'field3',
        {
          dataField: 'field4',
          groupIndex: 0,
        },
      ],
    });

    await page.evaluate(() => {
      document.dispatchEvent(new Event('visibilitychange'));
    });

    const dataGrid = new DataGrid(page);
    const contextMenu = dataGrid.getContextMenu();
    const firstGroupedHeader = dataGrid.getGroupPanel().locator('.dx-group-panel-item').nth(0);

    await firstGroupedHeader.click({ button: 'right' });
    await contextMenu.getItemByText('Ungroup').click();

    const groupPanel = dataGrid.getGroupPanel();
    const groupItems = groupPanel.locator('.dx-group-panel-item');
    await expect(groupItems).toHaveCount(2);

    await expect(firstGroupedHeader).toBeFocused();
  });
});
