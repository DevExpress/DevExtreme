/* eslint-disable no-param-reassign -- customizeColumns changes the columns it gets */
import { expect, test } from '../../../../fixtures';
import { createWidget } from '../../../../helpers/createWidget';
import DataGrid from '../../../../models/dataGrid';

const GRID_SELECTOR = '#container';

test.describe('Keyboard Navigation - Column Reordering', () => {
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

    const dataGrid = new DataGrid(page, GRID_SELECTOR);
    const firstVisibleHeader = dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(0);

    await firstVisibleHeader.element.click();
    await page.keyboard.press('Control+g');

    await expect.poll(() => dataGrid.getGroupPanel().getHeadersCount()).toBe(1);
    await dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(1).expectFocused();
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

    const dataGrid = new DataGrid(page, GRID_SELECTOR);
    const firstVisibleHeader = dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(0);

    await firstVisibleHeader.element.click();
    await page.keyboard.press('Control+g');

    await expect.poll(() => dataGrid.getGroupPanel().getHeadersCount()).toBe(0);
    await dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(0).expectFocused();
  });

  test('Group column when pressing Ctrl + G if adaptability is enabled', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', () => ({
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
      customizeColumns: (columns) => {
        columns[0].hidingPriority = 0;
        columns[2].hidingPriority = 1;
        columns[3].hidingPriority = 2;
      },
    }));

    const dataGrid = new DataGrid(page, GRID_SELECTOR);
    const firstVisibleHeader = dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(1);

    await firstVisibleHeader.element.click();
    await page.keyboard.press('Control+g');

    await expect.poll(() => dataGrid.getGroupPanel().getHeadersCount()).toBe(1);
    await dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(4).expectFocused();
  });

  test('Group column with showWhenGrouped enabled when pressing Ctrl + G if adaptability is enabled', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', () => ({
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
      customizeColumns: (columns) => {
        columns[1].showWhenGrouped = true;

        columns[0].hidingPriority = 0;
        columns[2].hidingPriority = 1;
        columns[3].hidingPriority = 2;
      },
    }));

    const dataGrid = new DataGrid(page, GRID_SELECTOR);
    const firstVisibleHeader = dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(1);

    await firstVisibleHeader.element.click();
    await page.keyboard.press('Control+g');

    await expect.poll(() => dataGrid.getGroupPanel().getHeadersCount()).toBe(1);
    await dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(2).expectFocused();
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

    const dataGrid = new DataGrid(page, GRID_SELECTOR);
    const nestedFirstHeader = dataGrid.getHeaders().getHeaderRow(1).getHeaderCell(0);

    await nestedFirstHeader.element.click();
    await page.keyboard.press('Control+g');

    await expect.poll(() => dataGrid.getGroupPanel().getHeadersCount()).toBe(1);
    // The headers render a moment after the group panel: until then the grouped column's header,
    // still focused, holds this place.
    await expect(dataGrid.getHeaders().getHeaderRow(1).getHeaderCell(0).element).toHaveText('Field 3');
    await dataGrid.getHeaders().getHeaderRow(1).getHeaderCell(0).expectFocused();
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

    const dataGrid = new DataGrid(page, GRID_SELECTOR);
    const nestedLastHeader = dataGrid.getHeaders().getHeaderRow(1).getHeaderCell(2);

    await nestedLastHeader.element.click();
    await page.keyboard.press('Control+g');

    await expect.poll(() => dataGrid.getGroupPanel().getHeadersCount()).toBe(1);
    await dataGrid.getHeaders().getHeaderRow(1).getHeaderCell(1).expectFocused();
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

    const dataGrid = new DataGrid(page, GRID_SELECTOR);
    const nestedSecondHeader = dataGrid.getHeaders().getHeaderRow(1).getHeaderCell(1);

    await nestedSecondHeader.element.click();
    await page.keyboard.press('Control+g');

    await expect.poll(() => dataGrid.getGroupPanel().getHeadersCount()).toBe(1);
    await dataGrid.getHeaders().getHeaderRow(1).getHeaderCell(0).expectFocused();
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

    const dataGrid = new DataGrid(page, GRID_SELECTOR);
    const nestedLastHeader = dataGrid.getHeaders().getHeaderRow(1).getHeaderCell(0);

    await nestedLastHeader.element.click();
    await page.keyboard.press('Control+g');

    await expect.poll(() => dataGrid.getGroupPanel().getHeadersCount()).toBe(1);
    await dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(2).expectFocused();
  });

  test('Group nested column when pressing Ctrl + G if adaptability is enabled', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      width: 550,
      columnWidth: 100,
      allowColumnReordering: true,
      dataSource: [{
        field1: 'test1',
        field2: 'test2',
        field3: 'test3',
        field4: 'test4',
        field5: 'test5',
        field6: 'test6',
        field7: 'test7',
        field8: 'test8',
        field9: 'test9',
      }],
      groupPanel: {
        visible: true,
      },
      columns: [
        'field1',
        {
          caption: 'Band column 1',
          columns: [
            {
              dataField: 'field2',
              hidingPriority: 0,
            },
            'field3',
            'field4',
            {
              dataField: 'field5',
              hidingPriority: 1,
            },
            {
              dataField: 'field6',
              hidingPriority: 2,
            },
            'field7',
            {
              dataField: 'field8',
              hidingPriority: 3,
            },
          ],
        },
        'field9',
      ],
    });

    const dataGrid = new DataGrid(page, GRID_SELECTOR);
    const firstVisibleNestedHeader = dataGrid.getHeaders().getHeaderRow(1).getHeaderCell(2);

    await firstVisibleNestedHeader.element.click();
    await page.keyboard.press('Control+g');

    await expect.poll(() => dataGrid.getGroupPanel().getHeadersCount()).toBe(1);
    await dataGrid.getHeaders().getHeaderRow(1).getHeaderCell(4).expectFocused();
  });

  test('Ungroup column with showWhenGrouped enabled when pressing Ctrl + Shift + G if adaptability is enabled', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', () => ({
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
      customizeColumns: (columns) => {
        columns[1].showWhenGrouped = true;
        columns[1].groupIndex = 0;

        columns[0].hidingPriority = 0;
        columns[2].hidingPriority = 1;
        columns[3].hidingPriority = 2;
      },
    }));

    const dataGrid = new DataGrid(page, GRID_SELECTOR);
    const firstVisibleHeader = dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(2);

    await firstVisibleHeader.element.click();
    await page.keyboard.press('Control+Shift+g');

    await expect.poll(() => dataGrid.getGroupPanel().getHeadersCount()).toBe(0);
    await dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(1).expectFocused();
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

    const dataGrid = new DataGrid(page, GRID_SELECTOR);
    const contextMenu = dataGrid.getContextMenu();
    const firstGroupedHeader = dataGrid.getGroupPanel().getHeader(0);

    // Simulate leaving a page and returning back
    await page.evaluate(() => {
      document.dispatchEvent(new Event('visibilitychange'));
    });

    await firstGroupedHeader.element.click({ button: 'right' });
    await contextMenu.getItemByText('Ungroup').click();

    await expect.poll(() => dataGrid.getGroupPanel().getHeadersCount()).toBe(2);
    await expect(dataGrid.getGroupPanel().getHeader(0).element).toBeFocused();
  });
});
